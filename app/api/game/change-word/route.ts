import { NextRequest, NextResponse } from 'next/server';
import { getRoom, getRandomWord, saveRooms } from '@/lib/game-state';
import { pusherServer } from '@/lib/pusher';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { roomCode, playerId } = await request.json();

    if (!roomCode || !playerId) {
      return NextResponse.json(
        { error: 'Room code and player ID are required' },
        { status: 400 }
      );
    }

    const normalizedRoomCode = roomCode.toUpperCase();
    const room = getRoom(normalizedRoomCode);

    if (!room) {
      return NextResponse.json(
        { error: 'Místnost neexistuje!' },
        { status: 404 }
      );
    }

    // Check if player is host (first player)
    if (room.players.length === 0 || room.players[0].id !== playerId) {
      return NextResponse.json(
        { error: 'Pouze host může vyměnit slovo!' },
        { status: 403 }
      );
    }

    // Check if game is in playing phase
    if (!room.gameStarted || room.gamePhase !== 'playing') {
      return NextResponse.json(
        { error: 'Slovo lze vyměnit pouze během hry!' },
        { status: 400 }
      );
    }

    // Vygeneruj nové slovo
    if (!room.usedWords) {
      room.usedWords = [];
    }
    let newWord = getRandomWord(room.category, room.customWords, room.usedWords);
    // Zajisti, že nové slovo není stejné jako aktuální
    let attempts = 0;
    while (newWord === room.word && attempts < 10) {
      newWord = getRandomWord(room.category, room.customWords, room.usedWords);
      attempts++;
    }
    console.log('Old word:', room.word, 'New word:', newWord, 'Used words:', room.usedWords);
    room.word = newWord;
    room.usedWords.push(newWord);

    // Aktualizuj slova hráčů
    room.players.forEach(player => {
      if (!player.isImpostor) {
        player.word = newWord;
      }
    });

    // Pošli každému hráči jeho aktualizované informace
    for (const player of room.players) {
      await pusherServer.trigger(`private-player-${player.id}`, 'wordAssigned', {
        word: player.word,
        isImpostor: player.isImpostor,
        speakingOrder: player.speakingOrder,
      });
    }

    // Broadcast game state to room
    await pusherServer.trigger(`room-${normalizedRoomCode}`, 'gameState', {
      players: room.players,
      gameStarted: room.gameStarted,
      gamePhase: room.gamePhase,
      category: room.category,
      customWords: room.customWords,
      impostorId: room.impostorId,
      votes: room.votes,
      word: room.word,
      maxPlayers: room.maxPlayers,
      gameMode: room.gameMode,
      noImpostorChance: room.noImpostorChance,
      allImpostorChance: room.allImpostorChance,
    });

    saveRooms();

    return NextResponse.json({ success: true, newWord });

  } catch (error) {
    console.error('Error changing word:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}