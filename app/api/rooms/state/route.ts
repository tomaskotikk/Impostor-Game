import { NextRequest, NextResponse } from 'next/server';
import { getRoom } from '@/lib/game-state';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomCode = searchParams.get('roomCode');
    
    if (!roomCode) {
      return NextResponse.json(
        { error: 'Room code is required' },
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

    return NextResponse.json({
      players: room.players,
      gameStarted: room.gameStarted,
      gamePhase: room.gamePhase,
      category: room.category,
      customWords: room.customWords,
      impostorId: room.impostorId,
      votes: room.votes,
      roomCode: normalizedRoomCode,
      maxPlayers: room.maxPlayers,
    });
  } catch (error) {
    console.error('Error getting room state:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}