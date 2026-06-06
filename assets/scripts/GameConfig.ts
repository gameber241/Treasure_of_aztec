// Game Configuration for Treasures of Aztec
export const GameConfig = {
    // url_api: "http://localhost:3000",
    // url_ws: "ws://localhost:3204", 
    
    url_api: "https://server.a3gaming.tech",
    url_ws: "wss://game-treasuresofaztec.a3gaming.tech",

    gameName: "Treasures of Aztec",
    gameId: "1004",

    useServerSpin: true,

    autoLogin: {
        enabled: false,
        apiKey: "d6b2f832-416b-4f8c-88a1-043179748e68",
        secretKey: "d5df66f9-2be4-4c0c-b92b-5c62561ae88c",
        username: "testuser1",
        password: "123456"
    },

    // Win tier thresholds
    winTiers: {
        bigWin: 10,      // 10x bet
        megaWin: 25,     // 25x bet
        superWin: 50     // 50x bet
    }
};
