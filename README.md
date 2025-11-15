# 🎭 Impostor Game

Hra podobná TikToku, kde skupina 5 lidí hádá, kdo je impostor. 4 lidem se ukáže slovo, 1 je impostor a musí zjistit, jaké slovo ostatní mají.

## 🚀 Instalace a spuštění

1. Nainstaluj závislosti:
```bash
npm install
```

2. Spusť vývojový server:
```bash
npm run dev
```

3. Otevři prohlížeč na `http://localhost:3000`

## 🎮 Jak hrát

1. **Připojení**: Zadej své jméno a připoj se do hry
2. **Lobby**: Počkej, až se připojí 5 hráčů
3. **Výběr kategorie**: Host (první hráč) vybere kategorii nebo zadá vlastní slova
4. **Hra**: 
   - 4 hráčům se ukáže slovo
   - 1 hráč je impostor a musí zjistit slovo
   - Hráči mezi sebou diskutují (mimo aplikaci)
5. **Hlasování**: Hlasuj, kdo si myslíš, že je impostor
6. **Výsledky**: Zjisti, kdo byl impostor a kdo správně hlasoval

## 📋 Kategorie

- Rappeři CZ/SK
- Rappeři Zahraniční
- Streamery CZ/SK
- Streamery Zahraniční
- Clash Royale
- Vlastní slova (zadáte před začátkem hry)

## 🛠️ Technologie

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Socket.io** - Real-time komunikace
- **TypeScript** - Type safety

## 📝 Poznámky

- Hra nevyžaduje databázi - vše běží v paměti serveru
- Maximálně 5 hráčů na místnost
- Hráči komunikují mezi sebou mimo aplikaci (např. přes Discord, telefon, atd.)

