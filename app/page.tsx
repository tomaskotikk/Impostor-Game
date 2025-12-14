'use client';

import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { Toaster } from 'sonner';
import * as notifications from '@/lib/notifications';
import { sound } from '@/lib/sound-effects';
import SupportForm from '@/components/SupportForm';
import { Heart } from 'lucide-react';

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
  gameMode?: 'none' | 'all' | 'normal';
  noImpostorChance?: boolean;
  allImpostorChance?: boolean;
}

type View = 'menu' | 'create' | 'join' | 'lobby' | 'playing' | 'voting' | 'results';

const categories = [
  { id: 'rappers-foreign', name: 'Rappeři Zahraniční', description: 'Eminem, Snoop Dogg, Drake...', icon: 'mic' },
  { id: 'streamers-czsk', name: 'Streamery CZ/SK', description: 'Coconut, Gejmr, Stazid...', icon: 'monitor' },
  { id: 'streamers-foreign', name: 'Streamery Zahraniční', description: 'xQc, Pokimane, Shroud...', icon: 'monitor' },
  { id: 'clash-royale', name: 'Clash Royale', description: 'Karty, postavy, arény...', icon: 'crown' },
  { id: 'movies', name: 'Filmy', description: 'Pulp Fiction, Avatar, Titanic...', icon: 'film' },
  { id: 'ceske-filmy', name: 'České filmy', description: 'Pelíšky, Kolja, Samotáři...', icon: 'film' },
  { id: 'pohadky', name: 'Pohádky', description: 'Tři oříšky pro Popelku, Pyšná princezna...', icon: 'sparkles' },
  { id: 'tv-shows', name: 'Seriály', description: 'Přátelé, Hra o trůny, Breaking Bad...', icon: 'tv' },
  { id: 'celebrities', name: 'Celebrity', description: 'Herci, zpěváci, influenceři...', icon: 'star' },
  { id: 'jidlo', name: 'Jídlo', description: 'Ovoce, Zelenina , Celá jídla...', icon: 'utensils' },
  { id: 'games', name: 'Hry', description: 'Minecraft, GTA, Fortnite...', icon: 'gamepad' },
  { id: 'superheroes', name: 'Superhrdinové', description: 'Superman, Batman, Wonder Woman...', icon: 'shield' },
];

// Icon component helper
const Icon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    mask: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    mic: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    monitor: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    crown: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    film: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    sparkles: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    tv: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    star: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    utensils: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    gamepad: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.751 9.75l3.501 3.5L21 12l-2.748-2.25L14.751 9.75zM9.25 9.75L5.75 13.25 3 12l2.748-2.25L9.25 9.75zM9.25 14.25l-3.5-3.5L3 12l2.748 2.25L9.25 14.25zM14.751 14.25l3.501-3.5L21 12l-2.748 2.25-3.501 3.5z" />
      </svg>
    ),
    shield: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    edit: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    detective: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    clock: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    target: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    vote: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    trophy: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    refresh: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    dice: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    play: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    user: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    help: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10a4 4 0 118 0c0 1.657-1.5 2.5-2.5 3.5-.5.5-.5 1-.5 1.5M12 18h.01" />
      </svg>
    ),
    heart: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  };

  return icons[name] || null;
};

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
    maxPlayers: 8,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customWords, setCustomWords] = useState<string>('');
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [showWord, setShowWord] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState<number>(8);
  const [preferSecondHalf, setPreferSecondHalf] = useState<boolean>(false);
  const [noImpostorChance, setNoImpostorChance] = useState<boolean>(false);
  const [allImpostorChance, setAllImpostorChance] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showImpostor, setShowImpostor] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiType, setConfettiType] = useState<'green' | 'red' | 'blue' | null>(null);
  const [soundMuted, setSoundMuted] = useState(false);

  // Initialize sound muting from localStorage
  useEffect(() => {
    const muted = localStorage.getItem('game-sound-muted');
    if (muted) {
      setSoundMuted(JSON.parse(muted));
    }
  }, []);

  // Sync sound mute state with sound effects library
  useEffect(() => {
    import('@/lib/sound-effects').then(({ setSoundMuted: setSoundEffectsMuted }) => {
      setSoundEffectsMuted(soundMuted);
    });
  }, [soundMuted]);
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

  // When user closes or reloads the page, notify server to free up the lobby slot
  useEffect(() => {
    const leaveRoom = () => {
      if (roomCode && playerId) {
        try {
          // use navigator.sendBeacon if available for reliable unload delivery
          const url = '/api/rooms/leave';
          const payload = JSON.stringify({ roomCode, playerId });
          if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
          } else {
            // fallback to fetch with keepalive
            fetch(url, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true });
          }
        } catch (err) {
          console.error('Error sending leave beacon', err);
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      leaveRoom();
      // Optionally show confirmation (not necessary) - do nothing else
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // also try to leave when component unmounts
      leaveRoom();
    };
  }, [roomCode, playerId]);

  // Disconnect button handler
  const handleDisconnectRoom = async () => {
    try {
      await fetch('/api/rooms/leave', {
        method: 'POST',
        body: JSON.stringify({ roomCode, playerId }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('Error disconnecting from room', err);
    }
    // Reload page to clear state and go back to home
    window.location.reload();
  };

  // Page visibility API - detect when user switches tab or minimizes app (mobile)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && roomCode && playerId) {
        // Page is hidden - immediately notify server
        try {
          const url = '/api/rooms/leave';
          const payload = JSON.stringify({ roomCode, playerId });
          if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
          } else {
            await fetch(url, {
              method: 'POST',
              body: payload,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true
            });
          }
        } catch (err) {
          console.error('Error sending visibility leave beacon', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomCode, playerId]);

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
        
        // Detect player join/leave events
        const previousPlayers = gameState.players;
        const newPlayers = state.players;
        
        // Check for new players
        newPlayers.forEach(newPlayer => {
          if (!previousPlayers.find(p => p.id === newPlayer.id)) {
            sound.join();
            notifications.notifyPlayerJoined(newPlayer.name);
          }
        });
        
        // Check for players who left
        previousPlayers.forEach(oldPlayer => {
          if (!newPlayers.find(p => p.id === oldPlayer.id)) {
            sound.leave();
            notifications.notifyPlayerLeft(oldPlayer.name);
          }
        });
        
        setGameState(state);
        if (state.roomCode) {
          setRoomCode(state.roomCode);
        }
        
        // Změna fáze hry
        if (state.gamePhase === 'lobby') {
          setView('lobby');
          setVotedFor(null);
          setShowWord(false);
        } else if (state.gamePhase === 'playing') {
          setView('playing');
          setVotedFor(null); // Reset při nové hře
          setShowWord(false);
        } else if (state.gamePhase === 'voting') {
          sound.voting();
          notifications.notifyVotingPhase();
          setView('voting');
          // Reset votedFor - zkontroluj jestli už máme hlas v gameState
          const hasVote = state.votes[playerId || ''];
          if (hasVote) {
            setVotedFor(hasVote);
          } else {
            setVotedFor(null);
          }
        } else if (state.gamePhase === 'results') {
          setView('results');
          setShowImpostor(false);
          setConfettiActive(false);
          setConfettiType(null);
          // Spustit animaci po 2 sekundách
          setTimeout(() => {
            setShowImpostor(true);
            // Určit typ konfet podle výsledku
            const impostor = state.players.find(p => p.isImpostor);
            if (impostor) {
              const impostorVotes = Object.values(state.votes).filter(v => v === impostor.id).length;
              const maxVotes = Math.max(...state.players.map(p => 
                Object.values(state.votes).filter(v => v === p.id).length
              ));
              const isTie = state.players.filter(p => 
                Object.values(state.votes).filter(v => v === p.id).length === maxVotes
              ).length > 1;
              
              // Pokud remíza
              if (isTie) {
                setConfettiType('blue');
              } 
              // Pokud má impostor nejvíc hlasů = uhodnut (impostor prohrál)
              else if (impostorVotes === maxVotes && impostorVotes > 0) {
                // Impostor prohrál - pro něj červené, pro ostatní zelené
                setConfettiType('green'); // green = impostor uhodnut
                sound.winner();
                notifications.notifyGameEnded(impostor.name, true);
              } else {
                // Impostor neuhodnut (impostor vyhrál) - pro něj zelené, pro ostatní červené
                setConfettiType('red'); // red = impostor neuhodnut
                sound.loser();
                notifications.notifyGameEnded(impostor.name, false);
              }
            }
            // Spustit konfety po další 0.5s
            setTimeout(() => {
              setConfettiActive(true);
            }, 500);
          }, 2000);
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
          if (data.isImpostor) {
            sound.gameStart();
            notifications.notifyYouAreImpostor();
          } else if (data.word) {
            sound.success();
            notifications.notifyYouAreCitizen(data.word);
            setShowWord(true);
          }
        });

        // Pokud tě host vyhodí, udělej úplné přesměrování na hlavní stránku (full reload)
        privateChannel.bind('kicked', (data: { roomCode?: string }) => {
          sound.leave();
          notifications.notifyYouWereKicked();
          // Vyčistit lokální stav
          try { setRoomCode(''); } catch (e) {}
          try { setPlayerId(null); } catch (e) {}
          try { setView('menu'); } catch (e) {}
          // Force navigaci na root s úplným reloadem stránky
          try {
            window.location.replace('/');
            // Po chvíli zajistit reload, pokud replace neprovedl reload
            setTimeout(() => {
              try { window.location.reload(); } catch (e) {}
            }, 200);
          } catch (e) {
            try { window.location.href = '/'; } catch (e) {}
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
      if (playerName.trim().length > 16) {
        notifications.notifyNicknameToLong();
        return;
      }
      try {
        const response = await fetch('/api/rooms/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: playerName.trim(), maxPlayers, preferSecondHalf }),
        });
        const data = await response.json();
        if (response.ok) {
          setRoomCode(data.roomCode);
          setPlayerId(data.playerId);
          setView('lobby');
        } else {
          notifications.notifyError(data.error || 'Chyba při vytváření místnosti');
        }
      } catch (err) {
        notifications.notifyError('Chyba při vytváření místnosti');
      }
    }
  };

  const joinRoom = async () => {
    if (playerName.trim() && inputRoomCode.trim()) {
      if (playerName.trim().length > 16) {
        notifications.notifyNicknameToLong();
        return;
      }
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
          notifications.notifyError(data.error || 'Chyba při připojování');
        }
      } catch (err) {
        notifications.notifyError('Chyba při připojování');
      }
    }
  };

  // Host action: kick a player from the room
  const kickPlayer = async (targetId: string) => {
    if (!roomCode || !playerId) return;
    if (!confirm('Opravdu chceš tohoto hráče vyhodit?')) return;
    try {
      const response = await fetch('/api/rooms/kick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode, playerId: targetId, requesterId: playerId }),
      });
      const data = await response.json();
      if (!response.ok) {
        notifications.notifyError(data.error || 'Chyba při vyhazování hráče');
      }
    } catch (err) {
      notifications.notifyError('Chyba při vyhazování hráče');
    }
  };

  const startGame = async () => {
    if (roomCode && playerId && (selectedCategory || customWords)) {
      const wordsArray = !selectedCategory && customWords 
        ? customWords.split(',').map(w => w.trim()).filter(w => w) 
        : undefined;
      // Use current number of players as the required word count when starting
      const requiredWords = gameState.players.length || gameState.maxPlayers || 8;
      
      if (!selectedCategory && (!wordsArray || wordsArray.length < requiredWords)) {
        notifications.notifyNotEnoughWords(requiredWords);
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
            preferSecondHalf,
            noImpostorChance,
            allImpostorChance,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          notifications.notifyError(data.error || 'Chyba při spuštění hry');
        }
      } catch (err) {
        notifications.notifyError('Chyba při spuštění hry');
      }
    }
  };

  const vote = async (votedForId: string) => {
    if (roomCode && playerId) {
      try {
        // Nastavit votedFor PŘED voláním API
        setVotedFor(votedForId);
        
        const response = await fetch('/api/game/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId, votedForId }),
        });
        
        if (!response.ok) {
          // Pokud selže, resetuj votedFor
          setVotedFor(null);
          notifications.notifyError('Chyba při hlasování');
        }
      } catch (err) {
        // Pokud selže, resetuj votedFor
        setVotedFor(null);
        notifications.notifyError('Chyba při hlasování');
      }
    }
  };
  
  const voteSpecial = async (mode: 'none' | 'all') => {
    if (roomCode && playerId) {
      try {
        // Použij speciální ID pro tyto režimy
        const specialId = mode === 'none' ? 'NO_IMPOSTOR' : 'ALL_IMPOSTORS';
        setVotedFor(specialId);
        
        const response = await fetch('/api/game/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId, votedForId: specialId }),
        });
        
        if (!response.ok) {
          setVotedFor(null);
          notifications.notifyError('Chyba při hlasování');
        }
      } catch (err) {
        setVotedFor(null);
        notifications.notifyError('Chyba při hlasování');
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
        notifications.notifyError('Chyba při spuštění hlasování');
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
        notifications.notifyError('Chyba při spuštění nové hry');
      }
    }
  };

  const restartGame = async () => {
    if (roomCode && playerId) {
      try {
        setVotedFor(null);
        setShowWord(false);
        const response = await fetch('/api/game/restart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, playerId }),
        });
        if (!response.ok) {
          const data = await response.json();
          notifications.notifyError(data.error || 'Chyba při restartu hry');
        }
      } catch (err) {
        notifications.notifyError('Chyba při restartu hry');
      }
    }
  };

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const isHost = gameState.players.length > 0 && gameState.players[0].id === playerId;

  // Konfety komponenta - přes celou obrazovku
  const Confetti = ({ type }: { type: 'green' | 'red' | 'blue' }) => {
    const colors = {
      green: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#22c55e', '#4ade80'],
      red: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#dc2626', '#f43f5e'],
      blue: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb', '#1d4ed8'],
    };

    // Více konfet pro lepší efekt
    const confettiPieces = Array.from({ length: 120 }, (_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const duration = 3 + Math.random() * 2;
      const color = colors[type][Math.floor(Math.random() * colors[type].length)];
      const size = 6 + Math.random() * 8;
      const rotation = Math.random() * 360;
      const horizontalDrift = (Math.random() - 0.5) * 30; // Boční drift

      return (
        <div
          key={i}
          className="fixed pointer-events-none"
          style={{
            left: `${left}%`,
            top: '-20px',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%', // Některé kulaté, některé čtvercové
            animation: `confetti-fall ${duration}s ${delay}s ease-out forwards`,
            transform: `rotate(${rotation}deg)`,
            '--drift': `${horizontalDrift}px`,
          } as React.CSSProperties}
        />
      );
    });

    return <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">{confettiPieces}</div>;
  };

  // Určení výsledku hry a typu konfet pro aktuálního hráče
  const impostor = gameState.players.find(p => p.isImpostor);
  const currentPlayerIsImpostor = currentPlayer?.isImpostor || false;
  const impostorVotes = impostor ? Object.values(gameState.votes).filter(v => v === impostor.id).length : 0;
  const maxVotes = gameState.players.length > 0 
    ? Math.max(...gameState.players.map(p => Object.values(gameState.votes).filter(v => v === p.id).length))
    : 0;
  const isTie = maxVotes > 0 && gameState.players.filter(p => 
    Object.values(gameState.votes).filter(v => v === p.id).length === maxVotes
  ).length > 1;
  
  // Určit typ konfet pro aktuálního hráče
  let playerConfettiType: 'green' | 'red' | 'blue' | null = null;
  if (confettiActive && confettiType) {
    if (confettiType === 'blue') {
      playerConfettiType = 'blue'; // Remíza - modré pro všechny
    } else if (confettiType === 'green') {
      // Impostor uhodnut
      playerConfettiType = currentPlayerIsImpostor ? 'red' : 'green';
    } else if (confettiType === 'red') {
      // Impostor neuhodnut
      playerConfettiType = currentPlayerIsImpostor ? 'green' : 'red';
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Icon name="mask" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Impostor Game</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {roomCode && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline">Místnost:</span>
                <code className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-200">
                  {roomCode}
                </code>
              </div>
            )}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-200 hover:bg-slate-700/60 transition-all"
              aria-label="Otevřít menu"
            >
              <Icon name="menu" className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <Toaster position="top-right" theme="dark" richColors visibleToasts={1} />

        {view === 'menu' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <Icon name="mask" className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">Impostor Game</h2>
              <p className="text-sm sm:text-base text-slate-400 flex items-center justify-center gap-2">
                <Icon name="detective" className="w-4 h-4" />
                Najdi impostora mezi přáteli!
              </p>
            </div>
            
            <div className="grid gap-3 sm:gap-4">
              <button
                onClick={() => setView('create')}
                className="group bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 rounded-xl p-6 sm:p-8 transition-all text-left backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center mb-4 transition-colors">
                  <Icon name="play" className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-200">Vytvořit místnost</h3>
                <p className="text-xs sm:text-sm text-slate-400">Založte novou hru a pozvěte přátele</p>
              </button>

              <button
                onClick={() => setView('join')}
                className="group bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 rounded-xl p-6 sm:p-8 transition-all text-left backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
                  <Icon name="users" className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-slate-200">Připojit se</h3>
                <p className="text-xs sm:text-sm text-slate-400">Vstupte do existující místnosti</p>
              </button>
            </div>
          </div>
        )}

        {view === 'create' && (
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => setView('menu')}
              className="mb-4 sm:mb-6 text-sm text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zpět
            </button>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-200">Vytvořit místnost</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                    <Icon name="user" className="w-4 h-4" />
                    Vaše jméno
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Zadejte své jméno"
                    maxLength={16}
                    className="w-full px-4 py-3 text-base bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-200 placeholder-slate-500"
                    onKeyPress={(e) => e.key === 'Enter' && createRoom()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-slate-300 flex items-center gap-2">
                    <Icon name="users" className="w-4 h-4" />
                    Počet hráčů
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {[3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setMaxPlayers(num)}
                        className={`py-3 px-4 rounded-lg font-semibold text-base transition-all ${
                          maxPlayers === num
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-700/50'
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
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-3 text-base rounded-lg transition-all disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
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
              className="mb-4 sm:mb-6 text-sm text-slate-400 hover:text-slate-200 flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zpět
            </button>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-slate-200">Připojit se</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                    <Icon name="user" className="w-4 h-4" />
                    Vaše jméno
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Zadejte své jméno"
                    maxLength={16}
                    className="w-full px-4 py-3 text-base bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-200 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                    <Icon name="target" className="w-4 h-4" />
                    Kód místnosti
                  </label>
                  <input
                    type="text"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                    placeholder="ABCD"
                    maxLength={4}
                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl font-mono font-bold tracking-[0.5em] uppercase text-slate-200"
                    onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
                  />
                </div>

                <button
                  onClick={joinRoom}
                  disabled={!playerName.trim() || !inputRoomCode.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-3 text-base rounded-lg transition-all disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  Připojit se
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'lobby' && (
          <div className="max-w-4xl mx-auto">
            {roomCode && (
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                  <Icon name="target" className="w-4 h-4 text-slate-400" />
                  <span className="text-xs sm:text-sm text-slate-400">Kód místnosti:</span>
                  <code className="px-2 sm:px-3 py-1 bg-slate-900/50 border border-slate-800/50 rounded-lg font-mono text-base sm:text-lg font-bold tracking-wider text-slate-200">
                    {roomCode}
                  </code>
                </div>
              </div>
            )}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 text-slate-200 flex items-center gap-2">
                    <Icon name="clock" className="w-5 h-5 text-slate-400" />
                    Čekárna
                  </h2>
                  <p className="text-sm text-slate-400">
                    Čeká se na {(gameState.maxPlayers || 8) - gameState.players.length} 
                    {(gameState.maxPlayers || 8) - gameState.players.length === 1 ? ' hráče' : ' hráče'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3">
                    <div className="text-3xl font-bold text-slate-200">{gameState.players.length}/{gameState.maxPlayers || 8}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                      <Icon name="users" className="w-3 h-3" />
                      Hráči
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 mb-8">
                {Array.from({ length: gameState.maxPlayers || 8 }).map((_, index) => {
                  const player = gameState.players[index];
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all ${
                        player
                          ? player.id === playerId
                            ? 'bg-indigo-500/10 border-indigo-500/30'
                            : 'bg-slate-800/50 border-slate-700/50'
                          : 'bg-slate-900/30 border-slate-800 border-dashed'
                      }`}
                    >
                      {player ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-purple-500/20">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base flex items-center gap-2 flex-wrap">
                              <span className="truncate text-slate-200">{player.name}</span>
                              {player.id === playerId && (
                                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full flex-shrink-0 border border-indigo-500/30">Ty</span>
                              )}
                              {index === 0 && (
                                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex-shrink-0 border border-amber-500/30 flex items-center gap-1">
                                  <Icon name="crown" className="w-3 h-3" />
                                  Host
                                </span>
                              )}
                              {/* Host může vyhodit ostatní hráče */}
                              {isHost && player.id !== playerId && (
                                <button
                                  onClick={() => kickPlayer(player.id)}
                                  className="ml-2 text-xs text-rose-300 bg-slate-800/30 hover:bg-slate-800/50 px-2 py-0.5 rounded-full"
                                >
                                  Vyhodit
                                </button>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Icon name="check" className="w-3 h-3" />
                              Připraven
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-600">
                          <div className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center flex-shrink-0">
                            <Icon name="user" className="w-5 h-5" />
                          </div>
                          <span className="text-sm">Čeká se na hráče...</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isHost && (
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-slate-300">Výběr kategorie</label>
                    
                    {/* Vlastní slova karta */}
                    <div
                      onClick={() => setSelectedCategory('')}
                      className={`p-4 rounded-lg border cursor-pointer transition-all mb-3 ${
                        !selectedCategory
                          ? 'bg-indigo-500/10 border-indigo-500/30'
                          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          !selectedCategory
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          <Icon name="edit" className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-slate-200">Vlastní slova</div>
                          <div className="text-xs text-slate-500">Zadejte vlastní slova oddělená čárkou</div>
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
                              ? 'bg-indigo-500/10 border-indigo-500/30'
                              : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name={category.icon} className="w-4 h-4 text-slate-400" />
                            <div className="font-semibold text-sm text-slate-200">{category.name}</div>
                          </div>
                          <div className="text-xs text-slate-500">{category.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vlastní slova input - zobrazí se pouze pokud není vybrána kategorie */}
                  {!selectedCategory && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">
                        Vlastní slova (min. {gameState.players.length || gameState.maxPlayers || 8})
                      </label>
                      <input
                        type="text"
                        value={customWords}
                        onChange={(e) => setCustomWords(e.target.value)}
                        placeholder="Pes, Kočka, Pták, Slon, Medvěd..."
                        className="w-full px-4 py-3 text-base bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-200 placeholder-slate-500"
                      />
                      <p className="text-xs text-slate-500 mt-2">Oddělte slova čárkou</p>
                    </div>
                  )}

                  {/* Nastavení impostora */}
                  <div className="space-y-3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-400/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Icon name="dice" className="w-4 h-4 text-purple-300" />
                      Speciální módy
                    </p>

                    <button
                      type="button"
                      onClick={() => setPreferSecondHalf(!preferSecondHalf)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                        preferSecondHalf
                          ? 'border-indigo-400/60 bg-indigo-500/10'
                          : 'border-slate-600/40 bg-slate-800/20 hover:border-slate-500/60'
                      }`}
                    >
                      <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        preferSecondHalf
                          ? 'border-indigo-400 bg-indigo-500'
                          : 'border-slate-600'
                      }`}>
                        {preferSecondHalf && <Icon name="check" className="w-3 h-3 text-white" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-200">Druhá polovina jako impostor</p>
                        <p className="text-xs text-slate-500 mt-1">Větší šance, že impostor bude vybrán z druhé poloviny hráčů</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNoImpostorChance(!noImpostorChance)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                        noImpostorChance
                          ? 'border-emerald-400/60 bg-emerald-500/10'
                          : 'border-slate-600/40 bg-slate-800/20 hover:border-slate-500/60'
                      }`}
                    >
                      <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        noImpostorChance
                          ? 'border-emerald-400 bg-emerald-500'
                          : 'border-slate-600'
                      }`}>
                        {noImpostorChance && <Icon name="check" className="w-3 h-3 text-white" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-200">Žádný impostor (1/15 šance)</p>
                        <p className="text-xs text-slate-500 mt-1">Všichni dostanou slovo - hledejte mezi sebou!</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAllImpostorChance(!allImpostorChance)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                        allImpostorChance
                          ? 'border-red-400/60 bg-red-500/10'
                          : 'border-slate-600/40 bg-slate-800/20 hover:border-slate-500/60'
                      }`}
                    >
                      <div className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        allImpostorChance
                          ? 'border-red-400 bg-red-500'
                          : 'border-slate-600'
                      }`}>
                        {allImpostorChance && <Icon name="check" className="w-3 h-3 text-white" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-200">Všichni impostory (1/15 šance)</p>
                        <p className="text-xs text-slate-500 mt-1">Nikdo nedostane slovo - všichni lhete!</p>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={startGame}
                    disabled={
                      // Allow starting when there are at least 3 players
                      gameState.players.length < 3 ||
                      (!selectedCategory && (!customWords.trim() || customWords.split(',').filter(w => w.trim()).length < (gameState.players.length || gameState.maxPlayers || 8)))
                    }
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white font-semibold py-3 text-base rounded-lg transition-all disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {gameState.players.length >= 3 ? (
                      <>
                        <Icon name="play" className="w-5 h-5" />
                        Spustit hru
                      </>
                    ) : (
                      <>
                        <Icon name="clock" className="w-5 h-5" />
                        Čeká se na hráče ({gameState.players.length}/{gameState.maxPlayers || 8})
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDisconnectRoom}
                    className="w-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-300 font-semibold py-3 text-base rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Icon name="exit" className="w-5 h-5" />
                    Opustit místnost
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'playing' && (
          <div className="max-w-2xl mx-auto text-center">
            {/* Kategorie - viditelná pro všechny */}
            {(gameState.category || gameState.customWords) && (
              <div className="mb-6 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-center gap-2">
                  <Icon name="target" className="w-3 h-3" />
                  Kategorie
                </p>
                <p className="text-lg font-bold text-indigo-400 flex items-center justify-center gap-2">
                  {gameState.category ? (
                    <>
                      <Icon name={categories.find(c => c.id === gameState.category)?.icon || 'target'} className="w-5 h-5" />
                      {categories.find(c => c.id === gameState.category)?.name || 'Kategorie'}
                    </>
                  ) : (
                    <>
                      <Icon name="edit" className="w-5 h-5" />
                      Vlastní slova
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-6 md:p-12 backdrop-blur-sm">
              {currentPlayer?.isImpostor ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-red-400 mb-2 sm:mb-3 flex items-center justify-center gap-2 flex-wrap">
                      <Icon name="mask" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                      <span className="break-words">TY JSI IMPOSTOR!</span>
                    </h3>
                    <p className="text-sm sm:text-base text-slate-400 flex items-center justify-center gap-2 flex-wrap px-2">
                      <Icon name="detective" className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words">Snaž se zjistit slovo z kategorie výše, aniž bys to prozradil</span>
                    </p>
                  </div>
                  {currentPlayer.speakingOrder && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-slate-400 mb-1 flex items-center justify-center gap-2">
                        <Icon name="dice" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span>Pořadí mluvení</span>
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-red-400 text-center break-words mb-4">Mluvíš jako {currentPlayer.speakingOrder}.</p>
                      
                      {/* Seznam pořadí mluvení pro všechny */}
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-2 text-center">Pořadí mluvení (všichni vidí):</p>
                        <div className="space-y-2">
                          {[...gameState.players]
                            .sort((a, b) => (a.speakingOrder || 0) - (b.speakingOrder || 0))
                            .map((player) => (
                              <div
                                key={player.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                  player.id === playerId
                                    ? 'bg-red-500/20 border border-red-500/30'
                                    : 'bg-slate-700/30'
                                }`}
                              >
                                <span className="text-sm font-bold text-red-400 w-6 text-center">
                                  {player.speakingOrder}.
                                </span>
                                <span className={`text-sm flex-1 ${
                                  player.id === playerId ? 'text-red-300 font-semibold' : 'text-slate-300'
                                }`}>
                                  {player.name}
                                  {player.id === playerId && (
                                    <span className="ml-2 text-xs text-red-400">(Ty)</span>
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : showWord && currentPlayer?.word ? (
                <div className="space-y-6">
                  <p className="text-slate-400 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                    <Icon name="target" className="w-4 h-4" />
                    Tvé slovo
                  </p>
                  <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl p-8 sm:p-12 backdrop-blur-sm">
                    <p className="text-3xl sm:text-5xl font-bold break-words hyphens-auto text-slate-100" lang="cs">{currentPlayer.word}</p>
                  </div>
                  {currentPlayer.speakingOrder && (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                      <p className="text-sm text-slate-400 mb-1 flex items-center justify-center gap-2">
                        <Icon name="dice" className="w-4 h-4" />
                        Pořadí mluvení
                      </p>
                      <p className="text-3xl font-bold text-indigo-400 mb-4">Mluvíš jako {currentPlayer.speakingOrder}.</p>
                      
                      {/* Seznam pořadí mluvení pro všechny */}
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-2 text-center">Pořadí mluvení (všichni vidí):</p>
                        <div className="space-y-2">
                          {[...gameState.players]
                            .sort((a, b) => (a.speakingOrder || 0) - (b.speakingOrder || 0))
                            .map((player) => (
                              <div
                                key={player.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                  player.id === playerId
                                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                                    : 'bg-slate-700/30'
                                }`}
                              >
                                <span className="text-sm font-bold text-indigo-400 w-6 text-center">
                                  {player.speakingOrder}.
                                </span>
                                <span className={`text-sm flex-1 ${
                                  player.id === playerId ? 'text-indigo-300 font-semibold' : 'text-slate-300'
                                }`}>
                                  {player.name}
                                  {player.id === playerId && (
                                    <span className="ml-2 text-xs text-indigo-400">(Ty)</span>
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-base text-slate-400 flex items-center justify-center gap-2">
                    <Icon name="detective" className="w-4 h-4" />
                    Diskutuj s ostatními a najdi impostora
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-base text-slate-400">Načítání...</p>
                </div>
              )}
              {isHost && (
                <button
                  onClick={startVoting}
                  className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-8 text-base rounded-lg transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mx-auto"
                >
                  <Icon name="vote" className="w-5 h-5" />
                  Začít hlasování
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'voting' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-slate-200 flex items-center justify-center gap-2">
                  <Icon name="vote" className="w-6 h-6" />
                  Hlasování
                </h2>
                <p className="text-base text-slate-400 flex items-center justify-center gap-2">
                  <Icon name="detective" className="w-4 h-4" />
                  Kdo si myslíš, že je impostor?
                </p>
              </div>
              
              {/* Speciální kolonky - zobrazují se permanentně když jsou checkboxy zaškrtnuté */}
              {(gameState.noImpostorChance || gameState.allImpostorChance) && (
                <div className="space-y-3 mb-4">
                  {gameState.noImpostorChance && (
                    <button
                      onClick={() => voteSpecial('none')}
                      disabled={!!votedFor}
                      className={`w-full p-4 rounded-lg text-left transition-all border ${
                        votedFor === 'NO_IMPOSTOR'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : votedFor
                          ? 'bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                          : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                            <Icon name="shield" className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="font-semibold text-base text-blue-300">Nikdo není impostor</span>
                        </div>
                        {Object.values(gameState.votes).filter((v) => v === 'NO_IMPOSTOR').length > 0 && (
                          <span className="text-sm bg-slate-700/50 px-3 py-1 rounded-full flex-shrink-0 text-slate-300 border border-slate-600/50">
                            {Object.values(gameState.votes).filter((v) => v === 'NO_IMPOSTOR').length} {Object.values(gameState.votes).filter((v) => v === 'NO_IMPOSTOR').length === 1 ? 'hlas' : 'hlasy'}
                          </span>
                        )}
                      </div>
                    </button>
                  )}
                  {gameState.allImpostorChance && (
                    <button
                      onClick={() => voteSpecial('all')}
                      disabled={!!votedFor}
                      className={`w-full p-4 rounded-lg text-left transition-all border ${
                        votedFor === 'ALL_IMPOSTORS'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : votedFor
                          ? 'bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                          : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                            <Icon name="mask" className="w-5 h-5 text-red-400" />
                          </div>
                          <span className="font-semibold text-base text-red-300">Všichni jsou impostor</span>
                        </div>
                        {Object.values(gameState.votes).filter((v) => v === 'ALL_IMPOSTORS').length > 0 && (
                          <span className="text-sm bg-slate-700/50 px-3 py-1 rounded-full flex-shrink-0 text-slate-300 border border-slate-600/50">
                            {Object.values(gameState.votes).filter((v) => v === 'ALL_IMPOSTORS').length} {Object.values(gameState.votes).filter((v) => v === 'ALL_IMPOSTORS').length === 1 ? 'hlas' : 'hlasy'}
                          </span>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {gameState.players
                  .filter((p) => p.id !== playerId)
                  .map((player) => {
                    const voteCount = Object.values(gameState.votes).filter((v) => v === player.id).length;
                    return (
                      <button
                        key={player.id}
                        onClick={() => vote(player.id)}
                        disabled={!!votedFor}
                        className={`w-full p-4 rounded-lg text-left transition-all border ${
                          votedFor === player.id
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : votedFor
                            ? 'bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                            : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 active:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-purple-500/20">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-base truncate text-slate-200">{player.name}</span>
                          </div>
                          {voteCount > 0 && (
                            <span className="text-sm bg-slate-700/50 px-3 py-1 rounded-full flex-shrink-0 text-slate-300 border border-slate-600/50">
                              {voteCount} {voteCount === 1 ? 'hlas' : 'hlasy'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
              
              {/* Seznam hlasujících */}
              {Object.keys(gameState.votes).length > 0 && (
                <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-3 flex items-center gap-2">
                    <Icon name="vote" className="w-4 h-4" />
                    Hlasovali ({Object.keys(gameState.votes).length}/{gameState.players.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(gameState.votes).map((voterId) => {
                      const voter = gameState.players.find(p => p.id === voterId);
                      return voter ? (
                        <span
                          key={voterId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-sm text-slate-300"
                        >
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {voter.name.charAt(0).toUpperCase()}
                          </div>
                          {voter.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'results' && (
          <div className="max-w-2xl mx-auto relative">
            {playerConfettiType && <Confetti type={playerConfettiType} />}
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-8 backdrop-blur-sm relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-slate-200 flex items-center justify-center gap-2">
                <Icon name="trophy" className="w-6 h-6" />
                Výsledky
              </h2>
              
              <div className="space-y-3 mb-8">
                {gameState.players
                  .filter(player => !player.isImpostor || showImpostor)
                  .map((player) => {
                    const voteCount = Object.values(gameState.votes).filter((v) => v === player.id).length;
                    const isImpostor = player.isImpostor;
                    
                    return (
                      <div
                        key={player.id}
                        className={`p-4 rounded-lg border transition-all duration-500 ${
                          isImpostor && showImpostor
                            ? 'bg-red-500/10 border-red-500/30 animate-pulse'
                            : 'bg-slate-800/50 border-slate-700/50'
                        } ${isImpostor && !showImpostor ? 'opacity-0 h-0 p-0 overflow-hidden' : ''}`}
                        style={{
                          animation: isImpostor && showImpostor ? 'slideIn 0.6s ease-out' : undefined,
                        }}
                      >
                        <div className="flex justify-between items-center gap-3 relative z-10">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-500 ${
                              isImpostor && showImpostor
                                ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/20 scale-110'
                                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20'
                            }`}>
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-base break-all text-slate-200">{player.name}</span>
                                {player.id === playerId && (
                                  <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full flex-shrink-0 border border-indigo-500/30">Ty</span>
                                )}
                                {isImpostor && showImpostor && (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold flex-shrink-0 border border-red-500/30 flex items-center gap-1 animate-pulse">
                                    <Icon name="mask" className="w-3 h-3" />
                                    IMPOSTOR
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm bg-slate-700/50 px-3 py-1 rounded-full whitespace-nowrap text-slate-300 border border-slate-600/50">
                            {voteCount} {voteCount === 1 ? 'hlas' : 'hlasy'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {!showImpostor && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-slate-400">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}

              {/* Výsledek hry */}
              {showImpostor && (
                <div className="mb-6 sm:mb-8">
                  {(() => {
                    // Speciální volby - když jsou checkboxy zaškrtnuté
                    // Nejdřív zkontroluj speciální volby (mají prioritu)
                    const noImpostorVotes = Object.values(gameState.votes).filter(v => v === 'NO_IMPOSTOR').length;
                    const allImpostorVotes = Object.values(gameState.votes).filter(v => v === 'ALL_IMPOSTORS').length;
                    const maxSpecialVotes = Math.max(noImpostorVotes, allImpostorVotes);
                    
                    // Pokud někdo hlasoval pro speciální volby, použij jejich logiku
                    if (maxSpecialVotes > 0) {
                      // Pokud hráči zvolili že není impostor
                      if (noImpostorVotes > allImpostorVotes) {
                        if (gameState.gameMode === 'none') {
                          // Uhodli správně - není impostor
                          return (
                            <div className="text-center p-4 sm:p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                              <p className="text-lg sm:text-xl font-bold text-emerald-400">Vyhráli normální hráči!</p>
                              <p className="text-sm sm:text-base text-slate-300 mt-1">Uhodli že není impostor</p>
                            </div>
                          );
                        } else {
                          // Neuhodli - je tam impostor, vyhrává impostor
                          return (
                            <div className="text-center p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <p className="text-lg sm:text-xl font-bold text-red-400">Vyhrál IMPOSTOR!</p>
                              <p className="text-sm sm:text-base text-slate-300 mt-1">Hráči zvolili že není impostor, ale impostor tam byl</p>
                            </div>
                          );
                        }
                      }
                      
                      // Pokud hráči zvolili že všichni jsou impostor
                      if (allImpostorVotes > noImpostorVotes) {
                        if (gameState.gameMode === 'all') {
                          // Uhodli správně - všichni jsou impostor
                          return (
                            <div className="text-center p-4 sm:p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                              <p className="text-lg sm:text-xl font-bold text-emerald-400">Vyhráli normální hráči!</p>
                              <p className="text-sm sm:text-base text-slate-300 mt-1">Uhodli že všichni jsou impostor</p>
                            </div>
                          );
                        } else {
                          // Neuhodli - není to pravda, vyhrává impostor
                          return (
                            <div className="text-center p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                              <p className="text-lg sm:text-xl font-bold text-red-400">Vyhrál IMPOSTOR!</p>
                              <p className="text-sm sm:text-base text-slate-300 mt-1">Hráči zvolili že všichni jsou impostor, ale není to pravda</p>
                            </div>
                          );
                        }
                      }
                    }
                    
                    
                    // Normální režim
                    const impostor = gameState.players.find(p => p.isImpostor);
                    if (!impostor) return null;
                    
                    const impostorVotes = Object.values(gameState.votes).filter(v => v === impostor.id).length;
                    const playerVoteCounts = gameState.players.map(p => ({
                      id: p.id,
                      votes: Object.values(gameState.votes).filter(v => v === p.id).length,
                      isImpostor: p.isImpostor || false
                    }));
                    
                    const maxVotes = Math.max(...playerVoteCounts.map(p => p.votes));
                    const playersWithMaxVotes = playerVoteCounts.filter(p => p.votes === maxVotes);
                    const normalPlayersWithMaxVotes = playersWithMaxVotes.filter(p => !p.isImpostor);
                    
                    // Pokud je remíza mezi normálními hráči a impostor má nejméně hlasů, impostor vyhrává
                    if (normalPlayersWithMaxVotes.length > 1 && impostorVotes < maxVotes) {
                      return (
                        <div className="text-center p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                          <p className="text-lg sm:text-xl font-bold text-red-400">Vyhrál IMPOSTOR!</p>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">Remíza mezi normálními hráči, impostor měl nejméně hlasů</p>
                        </div>
                      );
                    }
                    
                    // Pokud je remíza obecně
                    if (playersWithMaxVotes.length > 1) {
                      return (
                        <div className="text-center p-4 sm:p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                          <p className="text-lg sm:text-xl font-bold text-blue-400">Remíza!</p>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">Nikdo nevyhrál</p>
                        </div>
                      );
                    } else if (impostorVotes === maxVotes && impostorVotes > 0) {
                      return (
                        <div className="text-center p-4 sm:p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <p className="text-lg sm:text-xl font-bold text-emerald-400">Vyhráli normální hráči!</p>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">Impostor byl odhalen</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-center p-4 sm:p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                          <p className="text-lg sm:text-xl font-bold text-red-400">Vyhrál IMPOSTOR!</p>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">Impostor nebyl odhalen</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
              
              {isHost && showImpostor && (
                <div className="space-y-3">
                  <button
                    onClick={restartGame}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 text-base rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Icon name="play" className="w-5 h-5" />
                    Hrát znovu
                  </button>
                  <button
                    onClick={nextRound}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 text-base rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    <Icon name="refresh" className="w-5 h-5" />
                    Nová hra
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showHelp && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-900/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-3xl pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-pink-500/10 blur-3xl pointer-events-none"></div>
            <div className="relative p-5 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-300/80">Průvodce hrou</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                    <Icon name="help" className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-300" />
                    Jak hrát Impostor Game
                  </h3>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 transition-colors"
                  aria-label="Zavřít nápovědu"
                >
                  ✕
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="shield" className="w-5 h-5 text-emerald-300" />
                    <h4 className="font-semibold text-slate-100">Role: Normální hráč</h4>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1.5">
                    <li>• Řekni krátký popis vygenerovaného slova podle kategorie, neprozraď ho.</li>
                    <li>• Sleduj rozpory v odpovědích ostatních.</li>
                    <li>• Ptej se detailně – impostor často tápe.</li>
                    <li>• Hlasuj pro nejpodezřelejšího.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="mask" className="w-5 h-5 text-rose-300" />
                    <h4 className="font-semibold text-slate-100">Role: Impostor</h4>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-1.5">
                    <li>• Nemáš slovo – improvizuj podle kategorie.</li>
                    <li>• Buď obecný a drž se tématu.</li>
                    <li>• Neopakuj chyby – poslouchej ostatní.</li>
                    <li>• Útoč na nejisté hráče, abys odpoutal pozornost.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="detective" className="w-5 h-5 text-indigo-300" />
                  <h4 className="font-semibold text-slate-100">Rychlý průběh kola</h4>
                </div>
                <ol className="text-sm text-slate-300 space-y-1.5 list-decimal list-inside">
                  <li>Každý popíše své slovo (impostor improvizuje).</li>
                  <li>Krátká diskuze, podezřelé odpovědi si zapamatuj.</li>
                  <li>Hlasování: klikni na hráče, kterého tipuješ.</li>
                  <li>Výsledky: zjisti, zda byl impostor odhalen.</li>
                </ol>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors shadow-md shadow-indigo-500/30 w-full sm:w-auto"
                >
                  Rozumím
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupport && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowSupport(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-red-900/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-red-500/20 blur-3xl pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-pink-500/10 blur-3xl pointer-events-none"></div>
            <div className="relative p-5 sm:p-8 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-red-300/80">Podpora hry</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                    <Icon name="heart" className="w-5 h-5 sm:w-6 sm:h-6 text-red-300" />
                    Podpořte Impostor Game
                  </h3>
                </div>
                <button
                  onClick={() => setShowSupport(false)}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 transition-colors"
                  aria-label="Zavřít podporu"
                >
                  ✕
                </button>
              </div>

              <div className="text-center space-y-4">
                <p className="text-slate-300">
                  Pomozte nám udržovat a vylepšovat hru! Vaše podpora je neocenitelná pro další vývoj.
                </p>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-red-500" />
                    <h4 className="text-lg font-semibold text-slate-100">Vyberte částku podpory</h4>
                  </div>

                  <SupportForm />

                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowSupport(false)}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors shadow-md shadow-red-500/30 w-full sm:w-auto"
                >
                  Zavřít
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-200">Menu</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {roomCode && (
                <div className="p-3 sm:p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="target" className="w-4 h-4 text-slate-400" />
                    <span className="text-xs sm:text-sm font-medium text-slate-300">Kód místnosti</span>
                  </div>
                  <code className="block w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg font-mono text-sm sm:text-base font-bold tracking-wider text-slate-200 text-center">
                    {roomCode}
                  </code>
                </div>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowHelp(true);
                }}
                className="w-full flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <Icon name="help" className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
                <span className="text-sm sm:text-base text-slate-200">Nápověda</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowSupport(true);
                }}
                className="w-full flex items-center gap-3 p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <Icon name="heart" className="w-4 h-4 sm:w-5 sm:h-5 text-red-300" />
                <span className="text-sm sm:text-base text-slate-200">Podpora</span>
              </button>
              <button
                onClick={() => setSoundMuted(!soundMuted)}
                className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg transition-colors text-left ${
                  soundMuted
                    ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                }`}
              >
                {soundMuted ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.572l-5.365 3.828A2 2 0 004 9.25v5.5a2 2 0 001.405 1.966l5.365 3.828c1.114.684 2.73-.236 2.73-1.572V4.06" />
                    <path d="M3 3l18 18" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.5 4.06c0-1.336-1.616-2.256-2.73-1.572l-5.365 3.828A2 2 0 004 9.25v5.5a2 2 0 001.405 1.966l5.365 3.828c1.114.684 2.73-.236 2.73-1.572V4.06zM16.5 12a4.5 4.5 0 00-1.206-3.001m0 5.999a4.471 4.471 0 001.206-2.999" />
                  </svg>
                )}
                <span className="text-sm sm:text-base text-slate-200">
                  {soundMuted ? 'Zapnout zvuky' : 'Vypnout zvuky'}
                </span>
              </button>
              {roomCode && playerId && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    handleDisconnectRoom();
                  }}
                  className="w-full flex items-center gap-3 p-3 sm:p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors text-left"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm sm:text-base text-red-400">Opustit místnost</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    {/* Footer */}
    <footer className="mt-10 border-t border-slate-800/70 bg-slate-950/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center text-slate-400 text-sm">
        <span>Stránku Vytvořil:</span>
        <a
          href="https://tomaskotik.cz"
          target="_blank"
          rel="noreferrer"
          className="ml-2 text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          Tomáš Kotík
        </a>
      </div>
    </footer>
    </main>
  );
}
