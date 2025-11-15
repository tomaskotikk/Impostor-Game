const { Server: SocketIOServer } = require('socket.io');

const wordCategories = {
  'rappers-czsk': [
    'Rytmus',
    'Ektor',
    'Yzomandias',
    'Nik Tendo',
    'Separ',
    'Hasan',
    'Kato',
    'Rest',
    'Calin',
    'Kontrafakt',
  ],
  'rappers-foreign': [
    'Eminem',
    'Drake',
    'Kendrick Lamar',
    'Travis Scott',
    'Post Malone',
    'J. Cole',
    'Kanye West',
    'Lil Wayne',
    'Snoop Dogg',
    '50 Cent',
  ],
  'streamers-czsk': [
    'Agraelus',
    'Vojtěch',
    'Bax',
    'MenT',
    'Jirka Kral',
    'Kovy',
    'Herdyn',
    'Gejmr',
    'Pewdiepie',
  ],
  'streamers-foreign': [
    'xQc',
    'Pokimane',
    'Shroud',
    'Ninja',
    'Valkyrae',
    'TimTheTatman',
    'DrDisrespect',
    'HasanAbi',
    'Ludwig',
    'Mizkif',
  ],
  'clash-royale': [
    'Král',
    'Princezna',
    'Čaroděj',
    'Golem',
    'Pekka',
    'Drak',
    'Mega rytíř',
    'Lumberjack',
    'Valkýra',
    'Čarodějka',
  ],
};

function getRandomWord(category, customWords) {
  if (customWords && customWords.length > 0) {
    return customWords[Math.floor(Math.random() * customWords.length)];
  }
  
  const words = wordCategories[category];
  if (!words || words.length === 0) {
    return 'Slovo';
  }
  
  return words[Math.floor(Math.random() * words.length)];
}

const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createRoom(maxPlayers = 5) {
  let code;
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

function getRoom(roomCode) {
  return rooms.get(roomCode);
}

function initializeSocketServer(server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('createRoom', ({ name, maxPlayers }, callback) => {
      const roomCode = createRoom(maxPlayers || 5);
      const room = rooms.get(roomCode);
      
      room.players.push({
        id: socket.id,
        name,
      });

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      
      console.log(`Room ${roomCode} created by ${name} with max ${maxPlayers} players`);
      
      callback({ roomCode });
      
      io.to(roomCode).emit('gameState', {
        players: room.players,
        gameStarted: room.gameStarted,
        gamePhase: room.gamePhase,
        category: room.category,
        customWords: room.customWords,
        impostorId: room.impostorId,
        votes: room.votes,
        roomCode: roomCode,
        maxPlayers: room.maxPlayers,
      });
    });

    socket.on('joinRoom', ({ roomCode, name }, callback) => {
      const room = getRoom(roomCode);
      
      if (!room) {
        callback({ error: 'Místnost neexistuje!' });
        return;
      }

      if (room.players.length >= room.maxPlayers) {
        callback({ error: 'Místnost je plná!' });
        return;
      }

      if (room.players.some((p) => p.id === socket.id)) {
        callback({ error: 'Již jsi v místnosti!' });
        return;
      }

      room.players.push({
        id: socket.id,
        name,
      });

      socket.join(roomCode);
      socket.data.roomCode = roomCode;
      
      console.log(`${name} joined room ${roomCode}`);
      
      callback({ success: true });
      
      io.to(roomCode).emit('gameState', {
        players: room.players,
        gameStarted: room.gameStarted,
        gamePhase: room.gamePhase,
        category: room.category,
        customWords: room.customWords,
        impostorId: room.impostorId,
        votes: room.votes,
        roomCode: roomCode,
        maxPlayers: room.maxPlayers,
      });
    });

    socket.on('startGame', ({ category, customWords }) => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) {
        socket.emit('error', { message: 'Nejsi v místnosti!' });
        return;
      }
      
      const room = getRoom(roomCode);
      if (!room) {
        socket.emit('error', { message: 'Místnost neexistuje!' });
        return;
      }

      if (room.players.length !== room.maxPlayers) {
        socket.emit('error', { message: `Musí být přesně ${room.maxPlayers} hráčů!` });
        return;
      }

      if (room.gameStarted) {
        return;
      }

      // Validace vlastních slov
      if (!category && (!customWords || customWords.length < room.maxPlayers)) {
        socket.emit('error', { message: `Musíš zadat alespoň ${room.maxPlayers} vlastních slov!` });
        return;
      }

      // Vyber náhodného impostora
      const impostorIndex = Math.floor(Math.random() * room.maxPlayers);
      const impostor = room.players[impostorIndex];
      room.impostorId = impostor.id;

      // Vygeneruj slovo
      const word = getRandomWord(category || '', customWords);
      room.word = word;
      room.category = category;
      room.customWords = customWords;

      // Přiřaď slova hráčům
      room.players.forEach((player) => {
        if (player.id === impostor.id) {
          player.isImpostor = true;
          player.word = undefined;
        } else {
          player.isImpostor = false;
          player.word = word;
        }
      });

      room.gameStarted = true;
      room.gamePhase = 'playing';
      room.votes = {};

      console.log(`Game started in room ${roomCode}. Impostor: ${impostor.name}`);

      // Pošli každému hráči jeho informace
      room.players.forEach((player) => {
        io.to(player.id).emit('wordAssigned', {
          word: player.word,
          isImpostor: player.isImpostor,
        });
      });

      io.to(roomCode).emit('gameState', {
        players: room.players,
        gameStarted: room.gameStarted,
        gamePhase: room.gamePhase,
        category: room.category,
        customWords: room.customWords,
        impostorId: room.impostorId,
        votes: room.votes,
        roomCode: roomCode,
        maxPlayers: room.maxPlayers,
      });
    });

    socket.on('startVoting', () => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      
      const room = getRoom(roomCode);
      if (!room) return;
      
      if (room.gamePhase === 'playing') {
        room.gamePhase = 'voting';
        room.votes = {};
        
        console.log(`Voting started in room ${roomCode}`);
        
        io.to(roomCode).emit('gameState', {
          players: room.players,
          gameStarted: room.gameStarted,
          gamePhase: room.gamePhase,
          category: room.category,
          customWords: room.customWords,
          impostorId: room.impostorId,
          votes: room.votes,
          roomCode: roomCode,
          maxPlayers: room.maxPlayers,
        });
      }
    });

    socket.on('vote', ({ votedForId }) => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      
      const room = getRoom(roomCode);
      if (!room) return;
      
      if (room.gamePhase === 'voting' && !room.votes[socket.id]) {
        room.votes[socket.id] = votedForId;
        
        console.log(`Vote cast in room ${roomCode}`);
        
        io.to(roomCode).emit('gameState', {
          players: room.players,
          gameStarted: room.gameStarted,
          gamePhase: room.gamePhase,
          category: room.category,
          customWords: room.customWords,
          impostorId: room.impostorId,
          votes: room.votes,
          roomCode: roomCode,
          maxPlayers: room.maxPlayers,
        });

        // Pokud všichni hlasovali, přejdi na výsledky
        if (Object.keys(room.votes).length === room.players.length) {
          setTimeout(() => {
            room.gamePhase = 'results';
            
            console.log(`Results shown in room ${roomCode}`);
            
            io.to(roomCode).emit('gameState', {
              players: room.players,
              gameStarted: room.gameStarted,
              gamePhase: room.gamePhase,
              category: room.category,
              customWords: room.customWords,
              impostorId: room.impostorId,
              votes: room.votes,
              roomCode: roomCode,
              maxPlayers: room.maxPlayers,
            });
          }, 2000);
        }
      }
    });

    socket.on('nextRound', () => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      
      const room = getRoom(roomCode);
      if (!room) return;
      
      // Reset hry
      room.gameStarted = false;
      room.gamePhase = 'lobby';
      room.impostorId = undefined;
      room.word = undefined;
      room.votes = {};
      room.players.forEach((player) => {
        player.isImpostor = undefined;
        player.word = undefined;
      });

      console.log(`New round started in room ${roomCode}`);

      io.to(roomCode).emit('gameState', {
        players: room.players,
        gameStarted: room.gameStarted,
        gamePhase: room.gamePhase,
        category: room.category,
        customWords: room.customWords,
        impostorId: room.impostorId,
        votes: room.votes,
        roomCode: roomCode,
        maxPlayers: room.maxPlayers,
      });
    });

    socket.on('disconnect', () => {
      const roomCode = socket.data.roomCode;
      if (!roomCode) return;
      
      const room = getRoom(roomCode);
      if (!room) return;
      
      const player = room.players.find(p => p.id === socket.id);
      room.players = room.players.filter((p) => p.id !== socket.id);
      socket.leave(roomCode);

      console.log(`${player?.name || 'Player'} disconnected from room ${roomCode}`);

      // Pokud je místnost prázdná, smaž ji
      if (room.players.length === 0) {
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} deleted (empty)`);
      } else {
        io.to(roomCode).emit('gameState', {
          players: room.players,
          gameStarted: room.gameStarted,
          gamePhase: room.gamePhase,
          category: room.category,
          customWords: room.customWords,
          impostorId: room.impostorId,
          votes: room.votes,
          roomCode: roomCode,
          maxPlayers: room.maxPlayers,
        });
      }
    });
  });

  return io;
}

module.exports = { initializeSocketServer };