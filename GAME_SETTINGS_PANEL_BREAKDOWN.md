# Game Settings Panel - Detailní Rozpad Implementace

## 1. AKTUÁLNÍ STAV (Bez Settings Panel)

### Lobby View
```tsx
// app/page.tsx - "lobby" view
{view === 'lobby' && (
  <div className="flex flex-col gap-4">
    {/* Hráči */}
    {/* Tlačítko Spustit Hru */}
    {/* Výběr kategorie */}
    {/* Custom words input */}
  </div>
)}
```

### Kde se nastavují parametry hry?
- **maxPlayers**: Nastaveno v `createRoom()` - fixní hodnota
- **preferSecondHalf**: Toggle checkbox v `createRoom()` view
- **noImpostorChance**: Toggle checkbox v `createRoom()` view
- **allImpostorChance**: Toggle checkbox v `createRoom()` view
- **discussionTime**: HARDCODED na backend (defaultně 60 sekund)
- **impostorCount**: HARDCODED na 1 impostor vždy

### Problém aktuálního řešení
❌ Nastavení jsou ODDĚLENÁ mezi create/join views a lobby view  
❌ Hráči co se připojili POZDĚJI se nemůžou podílet na nastavení  
❌ Host si nemůže po vytvoření místnosti změnit nastavení  
❌ discussionTime a impostorCount nejsou vůbec konfigurovatelné  

---

## 2. NOVÝ DESIGN - Game Settings Panel

### 2.1 Umístění v UI
```
LOBBY VIEW:
┌─────────────────────────────────────────┐
│  Místnost: ABCD                         │
├─────────────────────────────────────────┤
│ Hráči (seznam):                         │
│  👑 Jméno1 [vyhodit]                    │
│     Jméno2                              │
│     Jméno3                              │
├─────────────────────────────────────────┤
│ ⚙️ NASTAVENÍ HRY (pouze pro host)       │
│                                         │
│  Počet impostorů: [1] [2] [3] [Vše] │  │ ← NEW
│  Doba diskuse: [30s] [60s] [120s]   │  │ ← NEW
│  Speciální mód:                      │  │ ← NEW
│    ☐ Bez impostora (0 impostorů)     │  │ ← NEW
│    ☐ Všichni jsou impostory          │  │ ← NEW
│    ☐ Preferuji druhou polovinu       │  │ ← EXISTING
│                                         │
│  Kategorie: [Vybrat kategorii...]    │  │
│  Vlastní slova: [text input]         │  │
│                                         │
│  [Spustit hru]                        │  │
├─────────────────────────────────────────┤
│ Zpráva: "Nebyly zadány vlastní slova"  │
└─────────────────────────────────────────┘
```

---

## 3. ARCHITEKTURNÍ ZMĚNY

### 3.1 GameState Interface - ROZŠÍŘENÍ

**Aktuálně:**
```typescript
export interface GameRoom {
  players: Player[];
  gameStarted: boolean;
  gamePhase: 'lobby' | 'playing' | 'voting' | 'results';
  category?: string;
  customWords?: string[];
  impostorId?: string;
  votes: Record<string, string>;
  word?: string;
  maxPlayers: number;
  preferSecondHalf?: boolean;
  noImpostorChance?: boolean;
  allImpostorChance?: boolean;
  gameMode?: 'none' | 'all' | 'normal';
}
```

**Nově:**
```typescript
export interface GameRoom {
  // ... existující
  
  // NOVÁ NASTAVENÍ
  impostorCount?: number;        // 1, 2, 3, nebo 'all'
  discussionTime?: number;       // 30, 60, 120 (v sekundách)
  specialMode?: 'none' | 'no-impostor' | 'all-impostor';  // Specia mód
  hostId?: string;               // Aby vůbec host věděl, kdo je host (používáme players[0] už)
}
```

**Důvod:** Parametry HRY vs LOBBY nastavení oddělíme. `impostorCount` a `discussionTime` se uloží v GameRoom a pošlou se do `/api/game/start`.

---

### 3.2 Frontend State - ROZŠÍŘENÍ

**Aktuálně v `app/page.tsx`:**
```tsx
const [maxPlayers, setMaxPlayers] = useState<number>(5);
const [preferSecondHalf, setPreferSecondHalf] = useState<boolean>(false);
const [noImpostorChance, setNoImpostorChance] = useState<boolean>(false);
const [allImpostorChance, setAllImpostorChance] = useState<boolean>(false);
```

**Nově přidat:**
```tsx
// Nové game settings (budou v lobby view)
const [impostorCount, setImpostorCount] = useState<number | 'all'>(1);
const [discussionTime, setDiscussionTime] = useState<number>(60);
const [specialMode, setSpecialMode] = useState<'none' | 'no-impostor' | 'all-impostor'>('none');

// Computed: jestli jsem host
const isHost = playerId === gameState.players[0]?.id;
```

---

## 4. IMPLEMENTAČNÍ KROKY

### 4.1 Backend - game-state.ts

**KROK 1: Rozšířit GameRoom interface**
```typescript
export interface GameRoom {
  // ... existující pole ...
  impostorCount?: number;
  discussionTime?: number;
  specialMode?: 'none' | 'no-impostor' | 'all-impostor';
}
```

**KROK 2: Přidat helper funkci pro update nastavení**
```typescript
export function updateGameSettings(
  roomCode: string,
  settings: {
    impostorCount?: number | 'all';
    discussionTime?: number;
    specialMode?: 'none' | 'no-impostor' | 'all-impostor';
  }
): boolean {
  const room = getRoom(roomCode);
  if (!room) return false;
  
  if (settings.impostorCount !== undefined) room.impostorCount = settings.impostorCount;
  if (settings.discussionTime !== undefined) room.discussionTime = settings.discussionTime;
  if (settings.specialMode !== undefined) room.specialMode = settings.specialMode;
  
  return true;
}
```

---

### 4.2 Frontend - page.tsx (UI Component)

**KROK 1: Přidat state pro game settings**
```tsx
const [impostorCount, setImpostorCount] = useState<number | 'all'>(1);
const [discussionTime, setDiscussionTime] = useState<number>(60);
const [specialMode, setSpecialMode] = useState<'none' | 'no-impostor' | 'all-impostor'>('none');

// Computed properties
const isHost = playerId === gameState.players[0]?.id;
```

**KROK 2: Přidat funkci `updateRoomSettings()` pro update nastavení v lobbies**
```tsx
const updateRoomSettings = async (newSettings: {
  impostorCount?: number | 'all';
  discussionTime?: number;
  specialMode?: 'none' | 'no-impostor' | 'all-impostor';
}) => {
  // Zatím lokálně update statu (až do pusher notifikace)
  if (newSettings.impostorCount !== undefined) setImpostorCount(newSettings.impostorCount);
  if (newSettings.discussionTime !== undefined) setDiscussionTime(newSettings.discussionTime);
  if (newSettings.specialMode !== undefined) setSpecialMode(newSettings.specialMode);
  
  // Broadcast ostatním hráčům via Pusher channel
  if (channel) {
    // Pusher bude vysílat updated gameState s novými settings
    // Teď si hráči aplikují tato nastavení z gameState
  }
};
```

**KROK 3: Komponenta Settings Panel v lobby view**
```tsx
{view === 'lobby' && isHost && (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
      <Icon name="edit" className="w-5 h-5" />
      Nastavení hry
    </h3>
    
    {/* Počet impostorů */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Počet impostorů</label>
      <div className="flex gap-2">
        {[1, 2, 3].map(n => (
          <button
            key={n}
            onClick={() => setImpostorCount(n)}
            className={`px-3 py-2 rounded ${impostorCount === n ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setImpostorCount('all')}
          className={`px-3 py-2 rounded ${impostorCount === 'all' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
        >
          Vše
        </button>
      </div>
    </div>
    
    {/* Doba diskuse */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Doba diskuse</label>
      <div className="flex gap-2">
        {[30, 60, 120].map(t => (
          <button
            key={t}
            onClick={() => setDiscussionTime(t)}
            className={`px-3 py-2 rounded ${discussionTime === t ? 'bg-green-500 text-white' : 'bg-white border'}`}
          >
            {t}s
          </button>
        ))}
      </div>
    </div>
    
    {/* Speciální módy */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Speciální módy</label>
      
      <label className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={specialMode === 'no-impostor'}
          onChange={(e) => setSpecialMode(e.target.checked ? 'no-impostor' : 'none')}
          className="w-4 h-4"
        />
        <span>Bez impostora (0 impostorů)</span>
      </label>
      
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={specialMode === 'all-impostor'}
          onChange={(e) => setSpecialMode(e.target.checked ? 'all-impostor' : 'none')}
          className="w-4 h-4"
        />
        <span>Všichni jsou impostory</span>
      </label>
    </div>
  </div>
)}
```

**KROK 4: Upravit `startGame()` funkci**
```tsx
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
          preferSecondHalf,
          // NOVÉ PARAMETRY
          impostorCount: specialMode === 'all-impostor' ? 'all' : (specialMode === 'no-impostor' ? 0 : impostorCount),
          discussionTime: discussionTime,
          specialMode: specialMode,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Chyba při spuštění hry');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('Chyba při spuštění hry');
      setTimeout(() => setError(''), 5000);
    }
  }
};
```

---

## 5. API ROUTE CHANGES

### 5.1 `/api/game/start` - ROZŠÍŘENÍ

**Request body (NOVĚ):**
```typescript
{
  roomCode: string;
  playerId: string;
  category?: string;
  customWords?: string[];
  preferSecondHalf?: boolean;
  impostorCount?: number | 'all' | 0;        // ← NEW
  discussionTime?: number;                   // ← NEW
  specialMode?: 'none' | 'no-impostor' | 'all-impostor'; // ← NEW
}
```

**V route handleru:**
```typescript
export async function POST(req: Request) {
  const {
    roomCode,
    playerId,
    category,
    customWords,
    preferSecondHalf,
    impostorCount,      // ← NEW
    discussionTime,     // ← NEW
    specialMode,        // ← NEW
  } = await req.json();

  // ... existující validace ...

  const room = getRoom(roomCode);
  
  // NOVÉ: Store settings v GameRoom
  if (impostorCount !== undefined) room.impostorCount = impostorCount;
  if (discussionTime !== undefined) room.discussionTime = discussionTime;
  if (specialMode !== undefined) room.specialMode = specialMode;

  // ... zbývající game start logic ...
  
  // Quando select impostor, use impostorCount
  let impostorToSelect = 1;
  if (specialMode === 'all-impostor') {
    impostorToSelect = room.players.length; // All
  } else if (specialMode === 'no-impostor') {
    impostorToSelect = 0; // None
  } else if (typeof impostorCount === 'number') {
    impostorToSelect = impostorCount;
  }
  
  // Select impostors
  const selectedImpostorIndices = new Set<number>();
  while (selectedImpostorIndices.size < impostorToSelect) {
    selectedImpostorIndices.add(Math.floor(Math.random() * room.players.length));
  }
  
  room.players.forEach((player, idx) => {
    player.isImpostor = selectedImpostorIndices.has(idx);
  });
}
```

---

## 6. PUSHER SYNCHRONIZACE

### Challenge: Non-Host Players
Když se nový hráč připojí do lobby, MUSÍ dostanout aktuální nastavení (impostorCount, discussionTime, specialMode).

**Řešení:**
```tsx
// V app/page.tsx - na přijetí gameState z Pusheru:

roomChannel.bind('gameState', (state: GameState) => {
  setGameState(state);
  
  // NOVÉ: Sync game settings z GameState
  if (state.impostorCount !== undefined) setImpostorCount(state.impostorCount);
  if (state.discussionTime !== undefined) setDiscussionTime(state.discussionTime);
  if (state.specialMode !== undefined) setSpecialMode(state.specialMode);
});
```

**V `/api/rooms/join` - při připojení:**
```typescript
// Broadcast updated gameState s aktuálními settings všem v lobby
pusherServer.trigger(`room-${roomCode}`, 'gameState', {
  ...room,
  impostorCount: room.impostorCount,
  discussionTime: room.discussionTime,
  specialMode: room.specialMode,
});
```

---

## 7. SCHÉMA ZMĚN - TABULKA

| Komponenta | Aktuální | Nové | Důvod |
|-----------|----------|------|-------|
| **GameRoom Interface** | Žádné impostor/discussion settings | `impostorCount`, `discussionTime`, `specialMode` | Uchování nastavení v lobby |
| **Frontend State** | 4 settings vars | +3 vars | Lokální state pro UI |
| **Lobby View** | Bez nastavení panelu | Settings Panel (host only) | User control |
| **startGame()** | Hardcoded impostor=1 | Respect `impostorCount`, `specialMode` | Динамics |
| **Impostor Selection** | 1 vždy | 1, 2, 3, all, 0 | Gameplay variety |
| **Game Start API** | 2-3 params | +3 params | Pass settings downstream |
| **Pusher broadcast** | Bez settings fields | Include settings fields | Sync all players |

---

## 8. USER FLOW

### Host vytváří místnost:
1. Host klikne "Vytvořit hru"
2. Lobby se otevře → vidí **Settings Panel** s default values:
   - Počet impostorů: 1
   - Doba diskuse: 60s
   - Speciální mód: none
3. Host může měnit nastavení klikáním na tlačítka
4. Každá změna se synchronizuje ostatním hráčům přes Pusher
5. Host vybere kategorii a klikne "Spustit hru"
6. Hra začíná s hostovým nastavením

### Hráč se připojuje:
1. Hráč klikne "Připojit se" a vloží kód
2. Lobby se otevře → vidí **nastavení z hosta** (read-only)
   - Počet impostorů: 2
   - Doba diskuse: 120s
   - Speciální mód: none
3. Hráč **nemůže** měnit nastavení
4. Čeká na hostitele, aby spustil hru

---

## 9. POKROČILÉ FEATURE (FUTURE)

Pokud bychom chtěli "demokratickou" volbu (všichni hlasují na nastavení):

```tsx
// FUTURE: Nejsou pokrytá touto RFC
- Hlasování na nastavení před startem hry
- Persistentní profil hráče s preferovanými nastavením
- Leaderboard per nastavení (stats pro impostorCount=1, discussionTime=120, atd.)
- Preset profiles ("Classic", "Speed Run", "Chaos Mode")
```

---

## 10. TESTOVACÍ SCÉNÁŘE

1. **Host vytvoří místnost s custom nastavením**
   - ✅ Settings Panel vidí pouze host
   - ✅ Nastavení se odešle do `/api/game/start`
   - ✅ Hra startuje s tím nastavením

2. **Hráč se připojí a vidí nastavení**
   - ✅ Nový hráč vidí aktuální settings (read-only)
   - ✅ Pusher broadcast obsahuje settings

3. **Speciální módy fungují**
   - ✅ "Bez impostora" → 0 impostorů, všichni jsou občané
   - ✅ "Všichni impostory" → všichni jsou impostory
   - ✅ Custom impostor count → N-tý počet impostorů

4. **Discussion Time se použije v game/next-round**
   - ✅ Backend respektuje `discussionTime` parameter
   - ✅ Voting phase trvá N sekund místo hardcoded 60s

---

## SHRNUTÍ

**Tato implementace přesun konfiguraci hry z "create/join" views do "lobby" view, kde:**
- Host má plnou kontrolu (Settings Panel)
- Non-host hráči vidí settings (read-only)
- Settings se synchronizují přes Pusher
- Game start respektuje všechna nastavení
- Kód zůstane čitelný a maintainable

**Effort: ~1.5-2 hodiny** dle velikosti bugfixů na game start logice.
