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
    'PSH', 'MC Gey', 'Marpo', 'Refew', 'Sensey',
    'Hasan', 'Kato', 'Rest', 'Calin', 'Kontrafakt',
    'DMS', 'Idea', 'Smack', 'Pil C',
    'Majk Spirit', 'Delik', 'Moja Reč', 'Strapo', 'Gleb',
    'Vladimir 518', 'Orion', 'LA4', 'Logic', 'DJ Wich',
    'Paulie Garand', 'Ben Cristovao', 'Lvcas Dope', 'Stein27', 'Samey',
    'Decky', 'Zayo', 'Ego', 'Tono S.', 'Boy Wonder',
    'Otis', 'Konex', 'Milion Plus', 'PTK', 'Sharlota',
    'Shimmi', 'Šín', 'Fobia Kid', 'Radikal Chef', 'Zverina',
  ],

  'rappers-foreign': [
    'Eminem', 'Drake', 'Kendrick Lamar', 'Travis Scott', 'Post Malone',
    'J. Cole', 'Kanye West', 'Lil Wayne', 'Snoop Dogg', '50 Cent',
    'Jay-Z', 'Nas', 'Notorious B.I.G.', 'Tupac', 'Future',
    'Cardi B', 'Nicki Minaj', 'A$AP Rocky', 'Mac Miller', 'Juice WRLD',
    'Lil Uzi Vert', 'Lil Pump', 'Lil Baby', 'DaBaby', '21 Savage',
    'Young Thug', 'Gunna', 'Chief Keef', 'Trippie Redd', 'Migos',
    'Logic', 'Wiz Khalifa', 'Chance the Rapper', 'Tyler, The Creator', 'Lil Nas X',
    'Doja Cat', 'Ice Cube', 'Missy Elliott', 'Lauryn Hill', 'Run-D.M.C.',
    'OutKast', 'Public Enemy', 'DMX', 'A$AP Ferg', 'A Boogie wit da Hoodie',
    'Flo Rida', 'Pitbull', 'G-Eazy', 'NF', 'Joey Bada$$',
  ],

  'streamers-czsk': [
    'Agraelus', 'Baxtrix', 'MenT', 'Jirka Král', 'Kovy',
    'Herdyn', 'GEJMR', 'Sajfa', 'Jmenovatel', 'Freescoot',
    'House', 'Gogo', 'Duklock', 'Selassie', 'Wedry',
    'FattyPillow', 'Carry', 'Tary', 'StudioMoonTV', 'Smusa',
    'Shadey', 'Artix', 'PedrosGame', 'Bender', 'VládiaVideos',
    'Pedro', 'AtiShow', 'Vidrail', 'Karel', 'Restt',
    'Bašťan', 'Gameballcz', 'FiFqo', 'Martin Rota', 'FlyGun',
    'MadMonq', 'Cagy', 'Annie Camel', 'Gabriel Tuček', 'Veronika Spurna',
  ],

  'streamers-foreign': [
    'xQc', 'Pokimane', 'Shroud', 'Ninja', 'Valkyrae',
    'TimTheTatman', 'DrDisrespect', 'HasanAbi', 'Ludwig', 'Mizkif',
    'SypherPK', 'Myth', 'Tfue', 'Nickmercs', 'Sodapoppin',
    'Summit1g', 'Asmongold', 'Ibai', 'Rubius', 'TheGrefg',
    'PewDiePie', 'Jacksepticeye', 'TommyInnit', 'Tubbo', 'Ranboo',
    'Sykkuno', 'CorpseHusband', 'DrLupo', 'CohhCarnage', 'Nadeshot',
    'Loserfruit', 'Fresh', 'Typical Gamer', 'Clix', 'Bugha',
    'Zerator', 'Gaules', 'AnneMunition', 'MoistCr1TiKaL', 'Disguised Toast',
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
    'Witch', 'Wizard', 'X-Bow', 'Zappies',
    'Archer Queen', 'Mighty Miner', 'Monk', 'Phoenix', 'Goblin Drill',
    'Elixir Golem', 'Mirror', 'Clone', 'Zap', 'Fireball',
    'Rocket', 'Lightning', 'Arrows', 'Rage', 'Freeze',
    'Poison', 'Earthquake', 'The Log', 'Heal Spirit', 'Tornado',
  ],

  'movies': [
    'Pulp Fiction', 'Avatar', 'Titanic', 'Matrix', 'Inception',
    'Interstellar', 'Forrest Gump', 'The Godfather', 'Fight Club', 'The Dark Knight',
    'Gladiator', 'The Shawshank Redemption', 'The Lord of the Rings', 'Star Wars', 'Jurassic Park',
    'Back to the Future', 'The Terminator', 'Alien', 'Blade Runner', 'The Matrix Reloaded',
    'The Prestige', 'Memento', 'Goodfellas', 'The Revenant', 'Whiplash',
    'The Green Mile', 'Saving Private Ryan', 'Schindler\'s List', 'The Silence of the Lambs', 'Braveheart',
    'La La Land', 'Mad Max: Fury Road', 'Parasite', 'Joker', 'Avengers: Endgame',
    'Avengers: Infinity War', 'Guardians of the Galaxy', 'Deadpool', 'Logan', 'Django Unchained',
    'Inglourious Basterds', 'Once Upon a Time in Hollywood', 'The Wolf of Wall Street', 'Shutter Island', 'Se7en',
  ],

  'ceske-filmy': [
    'Pelíšky', 'Kolja', 'Samotáři', 'Vesničko má středisková', 'Postřižiny',
    'Hoří, má panenko', 'Slunce, seno, jahody', 'Slunce, seno a pár facek', 'Černí baroni', 'Pupendo',
    'Obecná škola', 'Marečku, podejte mi pero!', 'S tebou mě baví svět', 'Anděl Páně', 'Tmavomodrý svět',
    'Bony a klid', 'Cesta do pravěku', 'Adéla ještě nevečeřela', 'Spalovač mrtvol', 'Limonádový Joe',
    'Markéta Lazarová', 'Ostře sledované vlaky', 'Tři oříšky pro Popelku', 'Na samotě u lesa', 'Krkonošské pohádky',
    'Žert', 'Šakalí léta', 'Bába z ledu', 'Musíme si pomáhat', 'Nuda v Brně',
    'Gympl', 'Snowboarďáci', 'Bobule', 'Vrchní, prchni!', 'Rozpuštěný a vypuštěný',
    'Čtyři vraždy stačí, drahoušku', 'Dědictví aneb Kurvahošigutntag', 'Jak svět přichází o básníky', 'Helimadoe',
  ],

  'pohadky': [
    'Tři oříšky pro Popelku', 'Pyšná princezna', 'S čerty nejsou žerty', 'Princezna ze mlejna', 'Lotrando a Zubejda',
    'O princezně Jasněnce a létajícím ševci', 'Princ a Večernice', 'Sedmero krkavců', 'O statečném kováři', 'Čert a Káča',
    'Perníková chaloupka', 'Krkonošské pohádky', 'Pohádky z mechu a kapradí', 'Arabela', 'Rumcajs',
    'Maxipes Fík', 'Šíleně smutná princezna', 'O Popelce', 'Princezna se zlatou hvězdou', 'O zlaté rybce',
    'O Sněhurce a sedmi trpaslících', 'O dvanácti měsíčkách',
    'Čarodějův učeň', 'Malá mořská víla', 'Král Drozdí brada', 'Anděl Páně', 'Tři bratři',
    'Kráska a zvíře', 'Aladin', 'Shrek', 'Ledové království', 'Na vlásku',
  ],

  'tv-shows': [
    'Přátelé', 'Hra o trůny', 'Breaking Bad', 'Stranger Things', 'The Office',
    'The Walking Dead', 'Lost', 'Sherlock', 'House of Cards', 'The Crown',
    'The Witcher', 'Squid Game', 'Money Heist', 'The Mandalorian', 'The Boys',
    'How I Met Your Mother', 'Big Bang Theory', 'Peaky Blinders', 'Narcos', 'Vikings',
    'Black Mirror', 'Westworld', 'Better Call Saul', 'Chernobyl', 'The Last of Us',
    'Brooklyn Nine-Nine', 'Rick and Morty', 'True Detective', 'Dexter', 'Sons of Anarchy',
  ],

  'celebrities': [
    'Tom Hanks', 'Leonardo DiCaprio', 'Brad Pitt', 'Angelina Jolie', 'Johnny Depp',
    'Emma Watson', 'Ryan Reynolds', 'Scarlett Johansson', 'Chris Hemsworth', 'Jennifer Lawrence',
    'Robert Downey Jr.', 'Will Smith', 'Dwayne Johnson', 'Margot Robbie', 'Chris Evans',
    'Keanu Reeves', 'Beyoncé', 'Taylor Swift', 'Ed Sheeran', 'Ariana Grande',
    'Justin Bieber', 'Selena Gomez', 'Katy Perry', 'Rihanna', 'Billie Eilish',
    'Lady Gaga', 'Bruno Mars', 'Shakira', 'Jason Momoa', 'Gal Gadot',
  ],

  'games': [
    'Minecraft', 'GTA', 'Fortnite', 'Call of Duty', 'FIFA',
    'Counter-Strike', 'League of Legends', 'World of Warcraft', 'Among Us', 'Valorant',
    'Apex Legends', 'Rocket League', 'Overwatch', 'The Witcher 3', 'Cyberpunk 2077',
    'Red Dead Redemption 2', 'Elden Ring', 'Dark Souls', 'Hollow Knight', 'Stardew Valley',
    'Terraria', 'PUBG', 'Dota 2', 'Clash of Clans', 'Clash Royale',
    'Brawl Stars', 'The Legend of Zelda', 'Super Mario', 'Pokémon', 'Roblox',
  ],

  'superheroes': [
    'Superman', 'Batman', 'Wonder Woman', 'Spider-Man', 'Iron Man',
    'Captain America', 'Thor', 'Hulk', 'Black Widow', 'Wolverine',
    'Deadpool', 'Flash', 'Green Lantern', 'Aquaman', 'Black Panther',
    'Doctor Strange', 'Ant-Man', 'Scarlet Witch', 'Vision', 'Falcon',
    'Winter Soldier', 'Star-Lord', 'Gamora', 'Groot', 'Rocket Raccoon',
    'Daredevil', 'Jessica Jones', 'Luke Cage', 'Iron Fist', 'Punisher',
    'Green Arrow', 'Supergirl', 'Batgirl', 'Shazam', 'Captain Marvel',
    'Blade', 'Silver Surfer', 'Storm', 'Cyclops', 'Professor X',
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