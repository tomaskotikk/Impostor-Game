import { NextRequest, NextResponse } from 'next/server';
import { getRoom, removePlayer } from '@/lib/game-state';
import { pusherServer } from '@/lib/pusher';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { roomCode, playerId: targetId, requesterId } = await request.json();

    if (!roomCode || !targetId || !requesterId) {
      return NextResponse.json({ error: 'roomCode, playerId and requesterId are required' }, { status: 400 });
    }

    const normalized = roomCode.toUpperCase();
    const room = getRoom(normalized);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Only host (first player) can kick
    if (!room.players || room.players.length === 0 || room.players[0].id !== requesterId) {
      return NextResponse.json({ error: 'Only the host can kick players' }, { status: 403 });
    }

    // Prevent kicking the host
    if (targetId === requesterId) {
      return NextResponse.json({ error: 'Host cannot kick themself' }, { status: 400 });
    }

    const removed = removePlayer(normalized, targetId);

    // Notify kicked player via private channel so client can redirect
    try {
      await pusherServer.trigger(`private-player-${targetId}`, 'kicked', { roomCode: normalized });
    } catch (err) {
      // non-fatal
      console.warn('Failed to send kicked event to player', targetId, err);
    }

    // Broadcast updated room state (if exists)
    const updatedRoom = getRoom(normalized);
    if (updatedRoom) {
      await pusherServer.trigger(`room-${normalized}`, 'gameState', {
        players: updatedRoom.players,
        gameStarted: updatedRoom.gameStarted,
        gamePhase: updatedRoom.gamePhase,
        category: updatedRoom.category,
        customWords: updatedRoom.customWords,
        impostorId: updatedRoom.impostorId,
        votes: updatedRoom.votes,
        roomCode: normalized,
        maxPlayers: updatedRoom.maxPlayers,
      });
    } else {
      await pusherServer.trigger(`room-${normalized}`, 'roomDeleted', { roomCode: normalized });
    }

    return NextResponse.json({ success: removed });
  } catch (error) {
    console.error('Error kicking player:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
