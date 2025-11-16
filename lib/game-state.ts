export interface Player {
    id: string;
    name: string;
    isImpostor?: boolean;
    word?: string;
    votes?: number;
    speakingOrder?: number; // Nové pole pro pořadí
  }
  
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
  }
  
  export const wordCategories: Record<string, string[]> = {
    'rappers-czsk': [
      'Rytmus', 'Ektor', 'Yzomandias', 'Nik Tendo', 'Separ',
      'Hasan', 'Kato', 'Rest', 'Calin', 'Kontrafakt',
    ],
    'rappers-foreign': [
      'Eminem', 'Drake', 'Kendrick Lamar', 'Travis Scott', 'Post Malone',
      'J. Cole', 'Kanye West', 'Lil Wayne', 'Snoop Dogg', '50 Cent',
    ],
    'streamers-czsk': [
      'Agraelus', 'Vojtěch', 'Bax', 'MenT', 'Jirka Kral',
      'Kovy', 'Herdyn', 'Gejmr', 'Pewdiepie',
    ],
    'streamers-foreign': [
      'xQc', 'Pokimane', 'Shroud', 'Ninja', 'Valkyrae',
      'TimTheTatman', 'DrDisrespect', 'HasanAbi', 'Ludwig', 'Mizkif',
    ],
    'clash-royale': [
      'Archers', 'Baby Dragon', 'Balloon', 'Bandit', 'Barbarians',
      'Bats', 'Battle Healer', 'Battle Ram', 'Bomber', 'Bowler',
      'Cannon', 'Cannon Cart', 'Dark Prince', 'Electro Dragon', 'Electro Giant',
      'Electro Spirit', 'Elite Barbarians', 'Executioner', 'Fire Spirit', 'Firecracker',
      'Fisherman', 'Flying Machine', 'Giant', 'Giant Skeleton', 'Goblin Barrel',
      'Goblin Cage', 'Goblin Gang', 'Goblin Giant', 'Goblin Hut', 'Goblins',
      'Golden Knight', 'Golem', 'Graveyard', 'Guards', 'Hog Rider',
      'Hunter', 'Ice Golem', 'Ice Spirit', 'Ice Wizard', 'Inferno Dragon',
      'Inferno Tower', 'Knight', 'Lava Hound', 'Lumberjack', 'Magic Archer',
      'Mega Knight', 'Mega Minion', 'Miner', 'Mini P.E.K.K.A', 'Minions',
      'Mortar', 'Mother Witch', 'Musketeer', 'Night Witch', 'P.E.K.K.A',
      'Prince', 'Princess', 'Ram Rider', 'Royal Delivery', 'Royal Ghost',
      'Royal Giant', 'Royal Hogs', 'Royal Recruits', 'Skeleton Army', 'Skeleton Barrel',
      'Skeleton Dragons', 'Skeleton King', 'Skeletons', 'Sparky', 'Spear Goblins',
      'Tesla', 'Three Musketeers', 'Tombstone', 'Valkyrie', 'Wall Breakers',
      'Witch', 'Wizard', 'X-Bow', 'Zappies'
    ],
    'movies': [
      'Pulp Fiction', 'Avatar', 'Titanic', 'Matrix', 'Inception',
      'Interstellar', 'Forrest Gump', 'The Godfather', 'Fight Club', 'The Dark Knight',
      'Gladiator', 'Shawshank Redemption', 'The Lord of the Rings', 'Star Wars', 'Jurassic Park',
    ],
    'tv-shows': [
      'Přátelé', 'Hra o trůny', 'Breaking Bad', 'Stranger Things', 'The Office',
      'The Walking Dead', 'Lost', 'Sherlock', 'House of Cards', 'The Crown',
      'The Witcher', 'Squid Game', 'Money Heist', 'The Mandalorian', 'The Boys',
    ],
    'celebrities': [
      'Tom Hanks', 'Leonardo DiCaprio', 'Brad Pitt', 'Angelina Jolie', 'Johnny Depp',
      'Emma Watson', 'Ryan Reynolds', 'Scarlett Johansson', 'Chris Hemsworth', 'Jennifer Lawrence',
      'Robert Downey Jr.', 'Will Smith', 'Dwayne Johnson', 'Margot Robbie', 'Chris Evans',
    ],
    'games': [
      'Minecraft', 'GTA', 'Fortnite', 'Call of Duty', 'FIFA',
      'Counter-Strike', 'League of Legends', 'World of Warcraft', 'Among Us', 'Valorant',
      'Apex Legends', 'Rocket League', 'Overwatch', 'The Witcher 3', 'Cyberpunk 2077',
    ],
    'superheroes': [
      'Superman', 'Batman', 'Wonder Woman', 'Spider-Man', 'Iron Man',
      'Captain America', 'Thor', 'Hulk', 'Black Widow', 'Wolverine',
      'Deadpool', 'Flash', 'Green Lantern', 'Aquaman', 'Black Panther',
    ],
  };
  
  export function getRandomWord(category?: string, customWords?: string[]): string {
    if (customWords && Array.isArray(customWords) && customWords.length > 0) {
      return customWords[Math.floor(Math.random() * customWords.length)];
    }
    
    if (category && typeof category === 'string' && category.trim() !== '') {
      const words = wordCategories[category];
      if (words && Array.isArray(words) && words.length > 0) {
        return words[Math.floor(Math.random() * words.length)];
      }
    }
    
    return 'Slovo';
  }
  
  // Nová funkce pro generování náhodného pořadí
  export function generateSpeakingOrder(playerCount: number): number[] {
    const order = Array.from({ length: playerCount }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }
  
  const rooms = new Map<string, GameRoom>();
  
  function generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  export function createRoom(maxPlayers = 5): string {
    let code: string;
    do {
      code = generateRoomCode();
    } while (rooms.has(code));
    
    rooms.set(code, {
      players: [],
      gameStarted: false,
      gamePhase: 'lobby',
      votes: {},
      maxPlayers: maxPlayers,
    });
    return code;
  }
  
  export function getRoom(roomCode: string): GameRoom | undefined {
    return rooms.get(roomCode);
  }
  
  // PŘIDÁNO: Funkce pro aktualizaci místnosti
  export function updateRoom(roomCode: string, room: GameRoom): void {
    rooms.set(roomCode, room);
  }
  
  export function getAllRooms(): Map<string, GameRoom> {
    return rooms;
  }
  
  export function deleteRoom(roomCode: string): boolean {
    return rooms.delete(roomCode);
  }