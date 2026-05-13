// Paste server response vào đây để debug
const serverData = {
  "rounds": [{
    "above": [
      [{"i": 8}],  // Reel 0: 1 symbol
      [{"i": 8}],  // Reel 1: 1 symbol
      [{"i": 8}],  // Reel 2: 1 symbol
      [{"i": 7}, {"i": 9}],  // Reel 3: 2 symbols
      [{"i": 9}],  // Reel 4: 1 symbol
      [{"i": 2}, {"i": 8}],  // Reel 5: 2 symbols
      [{"i": 2}]   // Reel 6: 1 symbol
    ],
    "win": {
      "positions": [
        {"c": 0, "r": 0},
        {"c": 2, "r": 3},
        {"c": 1, "r": 4},
        {"c": 3, "r": 0},
        {"c": 3, "r": 3},
        {"c": 4, "r": 3},
        {"c": 5, "r": 4},
        {"c": 6, "r": 2},
        {"c": 5, "r": 0}
      ]
    }
  }]
};

// Tính số symbols cần drop cho mỗi reel
const winPositions = serverData.rounds[0].win.positions;
const reelWinCounts = [0,0,0,0,0,0,0];

winPositions.forEach(pos => {
  reelWinCounts[pos.c]++;
});

// Check if they match
reelWinCounts.forEach((count, i) => {
  const aboveLen = serverData.rounds[0].above[i].length;
  if (count !== aboveLen) {
    console.error(`MISMATCH at reel ${i}: ${count} wins but ${aboveLen} above symbols`);
  }
});
