'use client';

import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

interface Player {
  id: string;
  name: string;
  isImpostor?: boolean;
  word?: string;
  votes?: number;
  speakingOrder?: number;
}

interface GameState {
  players: Player[];
  gameStarted: boolean;
  gamePhase: 'lobby' | 'playing' | 'voting' | 'results';
  category?: string;
  customWords?: string[];
  impostorId?: string;
  votes: Record<string, string>;
  roomCode?: string;
  maxPlayers?: number;
}

type View = 'menu' | 'create' | 'join' | 'lobby' | 'playing' | 'voting' | 'results';

const categories = [
  { id: 'rappers-foreign', name: '🎤 Rappeři Zahraniční', description: 'Eminem, Snoop Dogg, Drake...' },
  { id: 'streamers-czsk', name: '📺 Streamery CZ/SK', description: 'Coconut, Gejmr, Stazid...' },
  { id: 'streamers-foreign', name: '📺 Streamery Zahraniční', description: 'xQc, Pokimane, Shroud...' },
  { id: 'clash-royale', name: '👑 Clash Royale', description: 'Karty, postavy, arény...' },
  { id: 'movies', name: '🎬 Filmy', description: 'Pulp Fiction, Avatar, Titanic...' },
  { id: 'tv-shows', name: '📺 Seriály', description: 'Přátelé, Hra o trůny, Breaking Bad...' },
  { id: 'celebrities', name: '🌟 Celebrity', description: 'Herci, zpěváci, influenceři...' },
  { id: 'games', name: '🎮 Hry', description: 'Minecraft, GTA, Fortnite...' },
  { id: 'superheroes', name: '🦸 Superhrdinové', description: 'Superman, Batman, Wonder Woman...' },
];

export default function Home() {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [view, setView] = useState<View>('menu');
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    gameStarted: false,
    gamePhase: 'lobby',
    votes: {},
    maxPlayers: 5,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customWords, setCustomWords] = useState<string>('');
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [showWord, setShowWord] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState<number>(5);

  // Initialize Pusher
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PUSHER_KEY) {
      const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
        authEndpoint: '/api/pusher/auth',
        auth: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      });
      setPusher(pusherInstance);
      return () => {
        pusherInstance.disconnect();
      };
    }
  }, []);

  // Subscribe to room channel when roomCode changes
  useEffect(() => {
    if (pusher && roomCode) {
      const roomChannel = pusher.subscribe(`room-${roomCode}`);
      const privateChannel = playerId ? pusher.subscribe(`private-player-${playerId}`) : null;

      // Čekej na připojení channelu a načti aktuální stav
      roomChannel.bind('pusher:subscription_succeeded', async () => {
        console.log('✅ Subscribed to room channel:', roomCode);
        // Načti aktuální stav místnosti
        try {
          const response = await fetch(`/api/rooms/state?roomCode=${roomCode}`);
          if (response.ok) {
            const state = await response.json();
            setGameState(state);
            if (state.gamePhase === 'lobby') {
              setView('lobby');
            }
          }
        } catch (err) {
          console.error('Error fetching room state:', err);
        }
      });

      roomChannel.bind('gameState', (state: GameState) => {
        console.log('📦 Received gameState:', state);
        setGameState(state);
        if (state.roomCode) {
          setRoomCode(state.roomCode);
        }
        if (state.gamePhase === 'lobby') {
          setView('lobby');
          setVotedFor(null);
          setShowWord(false);
        } else if (state.gamePhase === 'playing') {
          setView('playing');
        } else if (state.gamePhase === 'voting') {
          setView('voting');
          setVotedFor(null);
        } else if (state.gamePhase === 'results') {
          setView('results');
        }
        
        const currentPlayer = state.players.find(p => p.id === playerId);
        if (state.gamePhase === 'playing' && currentPlayer && !currentPlayer.isImpostor && currentPlayer.word) {
          setShowWord(true);
        } else if (state.gamePhase === 'lobby') {
          setShowWord(false);
        }
      });

      if (privateChannel) {
        privateChannel.bind('pusher:subscription_succeeded', () => {
          console.log('✅ Subscribed to private channel:', playerId);
        });

        privateChannel.bind('wordAssigned', (data: { word: string; isImpostor: boolean; speakingOrder?: number }) => {
          if (!data.isImpostor && data.word) {
            setShowWord(true);
          }
        });
      }

      setChannel(roomChannel);

      return () => {
        roomChannel.unbind_all();
        roomChannel.unsubscribe();
        if (privateChannel) {
          privateChannel.unbind_all();
          privateChannel.unsubscribe();
        }
      };
    }
  }, [pusher, roomCode, playerId]);

  const createRoom = async () => {
    if (playerName.trim() && maxPlayers) {
      setError('');
      try {
        const response = await fetch('/api/rooms/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: playerName.trim(), maxPlayers }),
        });
        const data = await response.json();
        if (response.ok) {
          setRoomCode(data.roomCode);
          setPlayerId(data.playerId);
          setView('lobby');
        } else {
          setError(data.error || 'Chyba při vytváření místnosti');
        }
      } catch (err) {
        setError('Chyba při vytváření místnosti');
      }
    }
  };

  const joinRoom = async () => {
    if (playerName.trim() && inputRoomCode.trim()) {
      setError('');
      try {
        const response = await fetch('/api/rooms/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode: inputRoomCode.trim().toUpperCase(), name: playerName.trim() }),
        });
        const data = await response.json();
        if (response.ok) {
          setRoomCode(inputRoomCode.trim().toUpperCase());
          setPlayerId(data.playerId);
          setView('lobby');
        } else {
          setError(data.error || 'Chyba při připojování');
        }
      } catch (err) {
        setError('Chyba při připojování');
      }
    }
  };

  const startGame = async () => {
    if (roomCode && playerId && (selectedCategory || customWords)) {
      const wordsArray = !selectedCategory && customWords 
        ? customWords.split(',').map(w => w.trim()).filter(w => w) 
        : undefined;
      const requiredWords = gameState.maxPlayers || 5;
      
      if (!selectedCategory && (!wordsArray || wordsArray.length < requiredWords)) {
        setError(`Musíš zadat alespoň ${requiredWords} vlastních slov!`);
        setTimeout(() => setError(''), 5000);
        return;
      }
      
      try {
        const response = await fetch('/api/game/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomCode,
            playerId,
            category: selectedCategory && selectedCategory.trim() !== '' ? selectedCategory : undefined,
            customWords: wordsArray,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Chyba při spuštění hry');
        }
      } catch (err) {
        setError('Chyba při spuštění hry');
      }
    }
  };

  const vote = async (votedForId: string) => {
    if (roomCode && playerId && !votedFor) {
      try {
        await fetch('/api/game/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId, votedForId }),
        });
        setVotedFor(votedForId);
      } catch (err) {
        setError('Chyba při hlasování');
      }
    }
  };

  const startVoting = async () => {
    if (roomCode && playerId) {
      try {
        await fetch('/api/game/start-voting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId }),
        });
      } catch (err) {
        setError('Chyba při spuštění hlasování');
      }
    }
  };

  const nextRound = async () => {
    if (roomCode && playerId) {
      try {
        await fetch('/api/game/next-round', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId }),
        });
        setVotedFor(null);
        setShowWord(false);
        setSelectedCategory('');
        setCustomWords('');
      } catch (err) {
        setError('Chyba při spuštění nové hry');
      }
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const isHost = gameState.players.length > 0 && gameState.players[0].id === playerId;

  return (
    <main className="min-h-screen bg-[#0f0f10] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-[#0f0f10]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold text-base sm:text-lg">
              🎭
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold">Impostor Game</h1>
              <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold">BETA</span>
            </div>
          </div>
          {roomCode && (
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm text-zinc-400 hidden sm:inline">Místnost:</span>
              <code className="px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-800 rounded-lg font-mono text-xs sm:text-sm font-bold tracking-wider">
                {roomCode}
              </code>
              <button
                onClick={copyRoomCode}
                className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {view === 'menu' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">Impostor Game</h2>
              <p className="text-sm sm:text-base text-zinc-400">Najdi impostora mezi přáteli! 🕵️‍♂️</p>
            </div>
            
            <div className="grid gap-3 sm:gap-4">
              <button
                onClick={() => setView('create')}
                className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 sm:p-8 transition-all text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Vytvořit místnost</h3>
                <p className="text-xs sm:text-sm text-zinc-400">Založte novou hru a pozvěte přátele</p>
              </button>

              <button
                onClick={() => setView('join')}
                className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 sm:p-8 transition-all text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Připojit se</h3>
                <p className="text-xs sm:text-sm text-zinc-400">Vstupte do existující místnosti</p>
              </button>
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => setView('menu')}
              className="mb-4 sm:mb-6 text-xs sm:text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zpět
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Vytvořit místnost</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-zinc-300">Vaše jméno</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Zadejte své jméno"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && createRoom()}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-zinc-300">Počet hráčů</label>
                  <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                    {[3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setMaxPlayers(num)}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                          maxPlayers === num
                            ? 'bg-purple-500 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={createRoom}
                  disabled={!playerName.trim()}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Vytvořit místnost
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'join' && (
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => setView('menu')}
              className="mb-4 sm:mb-6 text-xs sm:text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zpět
            </button>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Připojit se</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-zinc-300">Vaše jméno</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Zadejte své jméno"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-zinc-300">Kód místnosti</label>
                  <input
                    type="text"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                    placeholder="ABCD"
                    maxLength={4}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-xl sm:text-2xl font-mono font-bold tracking-[0.3em] sm:tracking-[0.5em] uppercase"
                    onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                  />
                </div>

                <button
                  onClick={joinRoom}
                  disabled={!playerName.trim() || !inputRoomCode.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Připojit se
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'lobby' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">Čekárna 🕒</h2>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Čeká se na {(gameState.maxPlayers || 5) - gameState.players.length} 
                    {(gameState.maxPlayers || 5) - gameState.players.length === 1 ? ' hráče' : ' hráče'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold">{gameState.players.length}/{gameState.maxPlayers || 5}</div>
                  <div className="text-xs sm:text-sm text-zinc-400">Hráči</div>
                </div>
              </div>

              <div className="grid gap-2 sm:gap-3 mb-6 sm:mb-8">
                {Array.from({ length: gameState.maxPlayers || 5 }).map((_, index) => {
                  const player = gameState.players[index];
                  return (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg border transition-all ${
                        player
                          ? player.id === playerId
                            ? 'bg-purple-500/10 border-purple-500/30'
                            : 'bg-zinc-800 border-zinc-700'
                          : 'bg-zinc-900 border-zinc-800 border-dashed'
                      }`}
                    >
                      {player ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="truncate">{player.name}</span>
                              {player.id === playerId && (
                                <span className="text-[10px] sm:text-xs bg-purple-500/20 text-purple-400 px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0">Ty</span>
                              )}
                              {index === 0 && (
                                <span className="text-[10px] sm:text-xs bg-yellow-500/20 text-yellow-400 px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0">Host 👑</span>
                              )}
                            </div>
                            <div className="text-[10px] sm:text-xs text-zinc-500">Připraven ✅</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 sm:gap-3 text-zinc-600">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs sm:text-sm">Čeká se na hráče...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isHost && (
                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-zinc-800">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-zinc-300">Výběr kategorie</label>
                    
                    {/* Vlastní slova karta */}
                    <div
                      onClick={() => setSelectedCategory('')}
                      className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all mb-2 ${
                        !selectedCategory
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 ${
                          !selectedCategory
                            ? 'bg-purple-500 text-white'
                            : 'bg-zinc-700 text-zinc-400'
                        }`}>
                          ✏️
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm sm:text-base">Vlastní slova</div>
                          <div className="text-[10px] sm:text-xs text-zinc-500">Zadejte vlastní slova oddělená čárkou</div>
                        </div>
                      </div>
                    </div>

                    {/* Kategorie v mřížce */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedCategory === category.id
                              ? 'bg-purple-500/10 border-purple-500/30'
                              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          <div className="font-semibold text-xs sm:text-sm mb-1">{category.name}</div>
                          <div className="text-[10px] text-zinc-500">{category.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vlastní slova input - zobrazí se pouze pokud není vybrána kategorie */}
                  {!selectedCategory && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2 text-zinc-300">
                        Vlastní slova (min. {gameState.maxPlayers || 5})
                      </label>
                      <input
                        type="text"
                        value={customWords}
                        onChange={(e) => setCustomWords(e.target.value)}
                        placeholder="Pes, Kočka, Pták, Slon, Medvěd..."
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                      <p className="text-[10px] sm:text-xs text-zinc-500 mt-1.5 sm:mt-2">Oddělte slova čárkou</p>
                    </div>
                  )}

                  <button
                    onClick={startGame}
                    disabled={
                      gameState.players.length !== (gameState.maxPlayers || 5) ||
                      (!selectedCategory && (!customWords.trim() || customWords.split(',').filter(w => w.trim()).length < (gameState.maxPlayers || 5)))
                    }
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all disabled:cursor-not-allowed"
                  >
                    {gameState.players.length === (gameState.maxPlayers || 5) 
                      ? '🎮 Spustit hru' 
                      : `⏳ Čeká se na hráče (${gameState.players.length}/${gameState.maxPlayers || 5})`
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'playing' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-12">
              {currentPlayer?.isImpostor ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-red-400 mb-2 sm:mb-3">TY JSI IMPOSTOR! 🎭</h3>
                    <p className="text-sm sm:text-base text-zinc-400">Snaž se zjistit slovo, aniž bys to prozradil 🕵️‍♂️</p>
                  </div>
                  {currentPlayer.speakingOrder && (
                    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                      <p className="text-sm text-zinc-400 mb-1">Pořadí mluvení</p>
                      <p className="text-3xl font-bold text-red-400">🎲 Mluvíš jako {currentPlayer.speakingOrder}.</p>
                    </div>
                  )}
                </div>
              ) : showWord && currentPlayer?.word ? (
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-zinc-400 text-xs sm:text-sm uppercase tracking-wider">Tvé slovo</p>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 sm:p-12">
                    <p className="text-2xl sm:text-5xl font-bold break-words hyphens-auto" lang="cs">{currentPlayer.word}</p>
                  </div>
                  {currentPlayer.speakingOrder && (
                    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                      <p className="text-sm text-zinc-400 mb-1">Pořadí mluvení</p>
                      <p className="text-3xl font-bold text-purple-400">🎲 Mluvíš jako {currentPlayer.speakingOrder}.</p>
                    </div>
                  )}
                  <p className="text-sm sm:text-base text-zinc-400">Diskutuj s ostatními a najdi impostora 🎯</p>
                </div>
              ) : (
                <div className="py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-sm sm:text-base text-zinc-400">Načítání...</p>
                </div>
              )}
              {isHost && (
                <button
                  onClick={startVoting}
                  className="mt-6 sm:mt-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2.5 sm:py-3 px-6 sm:px-8 text-sm sm:text-base rounded-lg transition-all"
                >
                  🗳️ Začít hlasování
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'voting' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Hlasování 🗳️</h2>
                <p className="text-sm sm:text-base text-zinc-400">Kdo si myslíš, že je impostor? 🕵️‍♂️</p>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {gameState.players
                  .filter((p) => p.id !== playerId)
                  .map((player) => {
                    const voteCount = Object.values(gameState.votes).filter((v) => v === player.id).length;
                    return (
                      <button
                        key={player.id}
                        onClick={() => vote(player.id)}
                        disabled={!!votedFor}
                        className={`w-full p-3 sm:p-4 rounded-lg text-left transition-all border ${
                          votedFor === player.id
                            ? 'bg-green-500/10 border-green-500/30'
                            : votedFor
                            ? 'bg-zinc-800/50 border-zinc-700/50 opacity-50 cursor-not-allowed'
                            : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 active:bg-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm sm:text-base truncate">{player.name}</span>
                          </div>
                          {voteCount > 0 && (
                            <span className="text-xs sm:text-sm bg-zinc-700 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">
                              {voteCount} {voteCount === 1 ? 'hlas' : 'hlasy'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
              
              {votedFor && (
                <div className="mt-4 sm:mt-6 text-center bg-zinc-800 rounded-lg p-3 sm:p-4">
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    Hlasovalo: {Object.keys(gameState.votes).length}/{gameState.players.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'results' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Výsledky 🏆</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {gameState.players.map((player) => {
                  const voteCount = Object.values(gameState.votes).filter((v) => v === player.id).length;
                  return (
                    <div
                      key={player.id}
                      className={`p-3 sm:p-4 rounded-lg border ${
                        player.isImpostor
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-zinc-800 border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                            player.isImpostor 
                              ? 'bg-gradient-to-br from-red-500 to-red-700' 
                              : 'bg-gradient-to-br from-purple-500 to-pink-600'
                          }`}>
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-sm sm:text-base break-all">{player.name}</span>
                              {player.id === playerId && (
                                <span className="text-[10px] sm:text-xs bg-purple-500/20 text-purple-400 px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0">Ty</span>
                              )}
                              {player.isImpostor && (
                                <span className="text-[10px] sm:text-xs bg-red-500/20 text-red-400 px-1.5 sm:px-2 py-0.5 rounded font-semibold flex-shrink-0">IMPOSTOR 🎭</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm bg-zinc-700 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                          {voteCount} {voteCount === 1 ? 'hlas' : 'hlasy'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {isHost && (
                <button
                  onClick={nextRound}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all"
                >
                  🔄 Nová hra
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}