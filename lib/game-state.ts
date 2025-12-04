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
  'Pulp Fiction','Avatar','Titanic','Matrix','Inception',
  'Interstellar','Forrest Gump','The Godfather','Fight Club','The Dark Knight',
  'Gladiator','The Shawshank Redemption','The Lord of the Rings','Star Wars','Jurassic Park',
  'Back to the Future','The Terminator','Alien','Blade Runner','The Matrix Reloaded',
  'The Prestige','Memento','Goodfellas','The Revenant','Whiplash',
  'The Green Mile','Saving Private Ryan','Schindler\'s List','The Silence of the Lambs','Braveheart',
  'La La Land','Mad Max: Fury Road','Parasite','Joker','Avengers: Endgame',
  'Avengers: Infinity War','Guardians of the Galaxy','Deadpool','Logan','Django Unchained',
  'Inglourious Basterds','Once Upon a Time in Hollywood','The Wolf of Wall Street','Shutter Island','Se7en',
  'The Hateful Eight','Oppenheimer','Barbie','The Irishman','Arrival',
  'Gravity','The Social Network','Birdman','The Big Short','Her',
  'The Truman Show','Cast Away','No Country for Old Men','There Will Be Blood','The Pianist',
  '12 Years a Slave','The Departed','Heat','The Usual Suspects','American Beauty',
  'American Psycho','Requiem for a Dream','Black Swan','Moonlight','The Shape of Water',
  'Everything Everywhere All at Once','Dune','Dune: Part Two','Tenet','The Batman',
  'The Bourne Identity','The Bourne Supremacy','The Bourne Ultimatum','Mission: Impossible','Mission: Impossible – Fallout',
  'John Wick','John Wick: Chapter 2','John Wick: Chapter 3','John Wick: Chapter 4','Kingsman: The Secret Service',
  'Kingsman: The Golden Circle','The Hunger Games','The Hunger Games: Catching Fire','The Hunger Games: Mockingjay Part 1','The Hunger Games: Mockingjay Part 2',
  'Transformers','Transformers: Revenge of the Fallen','Transformers: Dark of the Moon','Transformers: Age of Extinction','Transformers: The Last Knight',
  'Madagascar','Madagascar 2','Madagascar 3','Shrek','Shrek 2',
  'Shrek the Third','Shrek Forever After','Kung Fu Panda','Kung Fu Panda 2','Kung Fu Panda 3',
  'Toy Story','Toy Story 2','Toy Story 3','Toy Story 4','Cars',
  'Cars 2','Cars 3','Coco','Soul','Inside Out',
  'Up','WALL-E','Ratatouille','Finding Nemo','Finding Dory',
  'Frozen','Frozen II','Moana','Zootopia','Encanto',
  'The Lion King','Aladdin','Beauty and the Beast','Mulan','Hercules',
  'Tarzan','The Little Mermaid','The Incredibles','The Incredibles 2','Big Hero 6',
  'Spirited Away','Princess Mononoke','Howl\'s Moving Castle','Your Name','A Silent Voice',
  'Weathering With You','The Boy and the Heron','Akira','Ghost in the Shell','Perfect Blue',
  'The Avengers','Captain America: Civil War','Captain America: The Winter Soldier','Iron Man','Iron Man 2',
  'Iron Man 3','Thor','Thor: Ragnarok','Doctor Strange','Doctor Strange in the Multiverse of Madness',
  'Black Panther','Black Panther: Wakanda Forever','Ant-Man','Ant-Man and the Wasp','Guardians of the Galaxy Vol. 2',
  'Guardians of the Galaxy Vol. 3','Spider-Man: Homecoming','Spider-Man: Far From Home','Spider-Man: No Way Home','Spider-Man 2',
  'Spider-Man 3','The Amazing Spider-Man','The Amazing Spider-Man 2','The Fault in Our Stars','The Notebook',
  'The Conjuring','The Conjuring 2','Annabelle','Annabelle Creation','Insidious',
  'Insidious Chapter 2','Saw','Saw II','Saw III','Saw X'
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
  'Přátelé','Hra o trůny','Breaking Bad','Stranger Things','The Office',
  'The Walking Dead','Lost','Sherlock','House of Cards','The Crown',
  'The Witcher','Squid Game','Money Heist','The Mandalorian','The Boys',
  'How I Met Your Mother','Big Bang Theory','Peaky Blinders','Narcos','Vikings',
  'Black Mirror','Westworld','Better Call Saul','Chernobyl','The Last of Us',
  'Brooklyn Nine-Nine','Rick and Morty','True Detective','Dexter','Sons of Anarchy',

  'The Sopranos','Fargo','The Wire','Succession','Ozark',
  'Mindhunter','Dark','Arcane','Euphoria','Mr. Robot',
  'The Haunting of Hill House','The Haunting of Bly Manor','The Sandman','Loki','WandaVision',
  'Hawkeye','Moon Knight','Daredevil','Jessica Jones','Luke Cage',
  'Iron Fist','The Punisher','Agents of S.H.I.E.L.D.','Supernatural','Gotham',
  'Arrow','The Flash','Supergirl','Legends of Tomorrow','Smallville',
  'Prison Break','House','Grey\'s Anatomy','The Good Doctor','Hannibal',
  'Lucifer','The 100','Person of Interest','The Walking Dead: World Beyond','Fear the Walking Dead',
  'Boardwalk Empire','The Pacific','Band of Brothers','The Leftovers','Utopia',
  'The Expanse','Battlestar Galactica','Star Trek: Discovery','Star Trek: Picard','Star Trek: Strange New Worlds',
  'Community','Parks and Recreation','Seinfeld','Modern Family','The Middle',
  'Two and a Half Men','The IT Crowd','Futurama','South Park','Family Guy',
  'American Dad','The Simpsons','BoJack Horseman','Big Mouth','Invincible',
  'The Handmaid\'s Tale','The Umbrella Academy','The End of the F***ing World','Elite','13 Reasons Why',
  'Riverdale','Wednesday','Shadow and Bone','The Order','Manifest',
  'The Good Place','Lost in Space','The Witcher: Blood Origin','1899','The Rain',
  'Barbarians','Rome','Marco Polo','Black Sails','The Serpent',
  'Peacemaker','Titans','Doom Patrol','Gotham Knights','The Orville',
  'His Dark Materials','The Night Manager','Jack Ryan','Reacher','The Terminal List',
  'Yellowstone','1883','1923','True Blood','Penny Dreadful',
  'The Originals','The Vampire Diaries','Legacies','Teen Wolf','Shadowhunters',
  'Halo','The Last Kingdom','Z Nation','Continuum','Fringe',
  'Heroes','Sense8','Travelers','Altered Carbon','Snowpiercer',
  'Suits','Billions','The Blacklist','Homeland','Designated Survivor',
  'The Mentalist','Criminal Minds','NCIS','NCIS: Los Angeles','CSI: Miami'
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

  'jidlo': [
  // OVOCE
  'Jablko','Hruška','Banán','Pomeranč','Mandarinka',
  'Citron','Limetka','Ananas','Mango','Meloun',
  'Vodní meloun','Třešně','Višně','Blumy','Švestky',
  'Meruňky','Broskve','Maliny','Ostružiny','Jahody',
  'Borůvky','Rybíz','Angrešt','Kiwi','Papája',
  'Granátové jablko','Fíky','Datle','Hroznové víno','Nektarinka',
  'Lichořeřišnice plod','Kaktusový fík','Kumkvat','Durian','Guava',
  'Liči','Maracuja','Pomelo','Grapefruit','Kokos',

  // ZELENINA
  'Mrkev','Brambory','Cibule','Česnek','Pórek',
  'Rajče','Okurka','Paprika','Kedluben','Celer',
  'Řapíkatý celer','Petržel','Kapusta','Zelí','Květák',
  'Brokolice','Špenát','Ředkvičky','Batáty','Artyčok',
  'Avokádo','Chřest','Cuketa','Lilek','Dýně',
  'Hrášek','Zelené fazolky','Kukuřice','Řepa','Lusky',
  'Koriandr','Pažitka','Kopr','Zázvor','Křen',

  // MASO A RYBY
  'Kuřecí maso','Krůtí maso','Vepřové maso','Hovězí maso','Jehněčí maso',
  'Kachna','Husa','Králík','Klobása','Slanina',
  'Šunka','Salám','Vepřová panenka','Steak','Losos',
  'Tuňák','Makrela','Pstruh','Treska','Sardinky',
  'Krevety','Humr','Krab','Mušle','Ústřice',

  // PŘÍLOHY
  'Rýže','Těstoviny','Kuskus','Bulgur','Quinoa',
  'Knedlíky','Houskové knedlíky','Bramborové knedlíky','Bramborová kaše','Americké brambory',
  'Hranolky','Pečené brambory','Rösti','Bramborák','Chléb',
  'Houska','Rohlík','Bageta','Tortilla','Pita chleba',

  // POLÉVKY
  'Vývar','Hovězí vývar','Kuřecí vývar','Zeleninová polévka','Česnečka',
  'Gulášová polévka','Rajská polévka','Květáková polévka','Hrachová polévka','Kulajda',
  'Dršťková polévka','Zelňačka','Bramboračka','Čočková polévka','Minestrone',
  'Pho Bo','Ramen','Tom Yum','Tom Kha','Cibulačka',

  // HLAVNÍ JÍDLA ČESKÁ
  'Svíčková','Guláš','Vepřo knedlo zelo','Řízek','Smažák',
  'Segedínský guláš','Halušky','Bramborový salát','Pečená kachna','Knedlo zelo kachno',
  'Koprová omáčka','Rajská omáčka','Křenová omáčka','Znojemská omáčka','Vepřová pečeně',
  'Kachní stehno','Kuře na paprice','Kotlety na houbách','Sekaná','Karbanátek',
  'Moravský vrabec','Čevabčiči','Zelňačka s klobásou','Palačinky','Lívance',

  // MEZINÁRODNÍ JÍDLA
  'Pizza Margherita','Pizza Salami','Pizza Quattro Formaggi','Spaghetti Carbonara','Spaghetti Bolognese',
  'Lasagne','Risotto','Paella','Tapas','Tacos',
  'Burrito','Quesadilla','Nachos','Hamburger','Cheeseburger',
  'Hot Dog','Steak na grilu','Fish and Chips','Sushi','Sashimi',
  'Tempura','Katsu curry','Pad Thai','Kung Pao','Fried rice',
  'Spring rolls','Dim sum','Kebab','Shawarma','Falafel',

  // SLADKÁ JÍDLA A DEZERTY
  'Koláč','Buchta','Bábovka','Trdelník','Větrník',
  'Věneček','Kobliha','Donut','Zmrzlina','Tiramisu',
  'Panna cotta','Cheesecake','Jablečný štrůdl','Puding','Palačinky s nutellou',
  'Muffin','Cupcake','Brownie','Medovník','Punčový řez',
  'Rakvička','Kremrole','Kakaový dort','Jahodový dort','Čokoládový dort',

  // NÁPOJE
  'Voda','Minerální voda','Čaj','Zelený čaj','Černý čaj',
  'Káva','Espresso','Cappuccino','Latte','Mocha',
  'Džus pomerančový','Džus jablečný','Džus ananasový','Cola','Fanta',
  'Sprite','Smoothie','Milkshake','Energetický nápoj','Koktejl',

  // DALŠÍ JÍDLA
  'Omeleta','Míchaná vejce','Vejce na tvrdo','Vejce na hniličko','Vajíčková pomazánka',
  'Tatarák','Toast','Sýr Eidam','Sýr Gouda','Hermelín',
  'Niva','Camembert','Mozzarella','Parmazán','Ricotta',
  'Jogurt','Tvaroh','Cottage','Smetana','Máslo',

  // SALÁTY
  'Caesar salát','Řecký salát','Zeleninový salát','Těstovinový salát','Bramborový salát (lehčí)',
  'Tuňákový salát','Kuřecí salát','Šopský salát','Coleslaw','Caprese'
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
