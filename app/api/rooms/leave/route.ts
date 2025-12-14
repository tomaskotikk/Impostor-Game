// api/rooms/leave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRoom, removePlayer } from '@/lib/game-state';
import { pusherServer } from '@/lib/pusher';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { roomCode, playerId } = await request.json();

    if (!roomCode || !playerId) {
      return NextResponse.json({ error: 'roomCode and playerId are required' }, { status: 400 });
    }

    const normalized = roomCode.toUpperCase();
    
    // 🔧 OPRAVA: Nejdřív ověř že hráč existuje
    const room = getRoom(normalized);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const playerExists = room.players.some(p => p.id === playerId);
    if (!playerExists) {
      return NextResponse.json({ success: true }); // Už není v místnosti
    }

    // 🔧 OPRAVA: Odstraň hráče
    const removed = removePlayer(normalized, playerId);

    if (!removed) {
      return NextResponse.json({ success: false });
    }

    // 🔧 OPRAVA: Broadcast AKTUÁLNÍ stav (po odstranění)
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
        gameMode: updatedRoom.gameMode,
        noImpostorChance: updatedRoom.noImpostorChance,
        allImpostorChance: updatedRoom.allImpostorChance,
      });
    } else {
      // Místnost byla smazána (prázdná)
      await pusherServer.trigger(`room-${normalized}`, 'roomDeleted', { 
        roomCode: normalized 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}