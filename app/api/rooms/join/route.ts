import { NextRequest, NextResponse } from 'next/server';
import { getRoom, saveRooms } from '@/lib/game-state';
import { pusherServer } from '@/lib/pusher';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { roomCode, name } = await request.json();
    
    if (!roomCode || !name) {
      return NextResponse.json(
        { error: 'Room code and name are required' },
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

    if (room.players.length >= room.maxPlayers) {
      return NextResponse.json(
        { error: 'Místnost je plná!' },
        { status: 400 }
      );
    }

    const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    room.players.push({
      id: playerId,
      name,
    });

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

    saveRooms();

    return NextResponse.json({
      success: true,
      playerId,
    });
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

