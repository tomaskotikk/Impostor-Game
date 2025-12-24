import { NextRequest, NextResponse } from 'next/server';
import { getRoom, getRandomWord, generateSpeakingOrder } from '@/lib/game-state';
import { pusherServer } from '@/lib/pusher';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { roomCode, category, customWords, playerId, preferSecondHalf, noImpostorChance, allImpostorChance } = await request.json();
    
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
        { error: 'Pouze host může spustit hru!' },
        { status: 403 }
      );
    }

    // Allow starting when there are at least 3 players (up to the room max)
    if (room.players.length < 3) {
      return NextResponse.json(
        { error: `Musí být alespoň 3 hráči!` },
        { status: 400 }
      );
    }

    if (room.gameStarted) {
      return NextResponse.json(
        { error: 'Hra již běží!' },
        { status: 400 }
      );
    }

    // Validace vlastních slov
    // Require at least as many custom words as current players (if no category)
    if (!category && (!customWords || customWords.length < room.players.length)) {
      return NextResponse.json(
        { error: `Musíš zadat alespoň ${room.players.length} vlastních slov!` },
        { status: 400 }
      );
    }

    // Ulož aktuální volby (nastavují se při startu hry)
    room.preferSecondHalf = !!preferSecondHalf;
    room.noImpostorChance = !!noImpostorChance;
    room.allImpostorChance = !!allImpostorChance;

    // Rozhodni speciální režim impostora
    let mode: 'none' | 'all' | 'normal' = 'normal';
    const roll = Math.random();
    const noThreshold = room.noImpostorChance ? 1 / 15 : 0;
    const allThreshold = room.allImpostorChance ? noThreshold + 1 / 15 : noThreshold;

    if (room.noImpostorChance && roll < noThreshold) {
      mode = 'none';
    } else if (room.allImpostorChance && roll < allThreshold) {
      mode = 'all';
    }
    
    room.gameMode = mode;

    let impostorId: string | undefined = undefined;

    if (mode === 'normal') {
      // Vyber náhodného impostora
      let impostorIndex: number;
      const playerCount = room.players.length;
      if (room.preferSecondHalf) {
        // Prefer second half relative to current player count
        const firstHalf = Math.max(1, Math.floor(playerCount / 2));
        const secondHalfStart = firstHalf;
        if (Math.random() < 0.7) {
          impostorIndex = secondHalfStart + Math.floor(Math.random() * (playerCount - secondHalfStart));
        } else {
          impostorIndex = Math.floor(Math.random() * firstHalf);
        }
      } else {
        impostorIndex = Math.floor(Math.random() * playerCount);
      }
      const impostor = room.players[impostorIndex];
      impostorId = impostor.id;
      room.impostorId = impostorId;
    } else {
      room.impostorId = undefined;
    }

    // Vygeneruj slovo
    if (!room.usedWords) {
      room.usedWords = [];
    }
    const word = getRandomWord(category, customWords, room.usedWords);
    room.word = word;
    room.category = category;
    room.customWords = customWords;
    room.usedWords.push(word);

    // Vygeneruj náhodné pořadí mluvení pro aktuální počet hráčů
    const speakingOrder = generateSpeakingOrder(room.players.length);

    // Přiřaď slova a pořadí hráčům
    room.players.forEach((player, index) => {
      player.speakingOrder = speakingOrder[index];
      
      if (mode === 'none') {
        player.isImpostor = false;
        player.word = word;
      } else if (mode === 'all') {
        player.isImpostor = true;
        player.word = undefined;
      } else {
        if (player.id === impostorId) {
          player.isImpostor = true;
          player.word = undefined;
        } else {
          player.isImpostor = false;
          player.word = word;
        }
      }
    });

    room.gameStarted = true;
    room.gamePhase = 'playing';
    room.votes = {};

    // Pošli každému hráči jeho informace
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
      roomCode: normalizedRoomCode,
      maxPlayers: room.maxPlayers,
      gameMode: room.gameMode,
      noImpostorChance: room.noImpostorChance,
      allImpostorChance: room.allImpostorChance,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}