export const xampleJson2 = {
    success: true,
    totalWin: 2250,
    usingFreeSpin: false,

    rounds: [{
        index: 0,
        multiplier: 1,
        isScratch: false,
        freeSpin: 0,

        grid: [
            // Reel 0
            [
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: 200 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 300,
        MegaWin: 1000,
        SuperWin: 100000,
        flips: [],
        copies: [],
        hasNext: false
    },

    // // =================================================
    // // ROUND 0 – TEN WIN
    // // =================================================
    {
        index: 0,
        multiplier: 1,
        isScratch: false,
        freeSpin: 10,
        grid: [

            // Reel 0 (4 rows)
            [
                { i: 1, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, // WIN
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1
            [
                { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, // WIN
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 1, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2
            [
                { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, // WIN
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, // WIN
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 1, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, // WIN
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, // WIN
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild)
            [
                { i: 1, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [

        ],

        win: {
            positions: [

            ],
            stepWin: 250
        },

        flips: [],
        copies: [],
        hasNext: true,
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
    },

    // // =================================================
    // // ROUND 1 – GOLDEN_IDOL + MEGA
    // // =================================================
    {
        index: 0,
        multiplier: 2,
        isScratch: true,
        freeSpin: 9,
        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 6, f: 3, ms: 3, mi: 0, sid: 200 },
                { i: 6, f: 3, ms: 3, mi: 1, sid: 200 },
                { i: 6, f: 3, ms: 3, mi: 2, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 0, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],

        ],

        win: {
            positions: [
                { c: 0, r: 1 },
                { c: 0, r: 2 },
                { c: 0, r: 3 },
                { c: 0, r: 4 },
                { c: 0, r: 5 },
                { c: 2, r: 1 },
                { c: 3, r: 1 },
                { c: 4, r: 1 },
                { c: 5, r: 1 },
            ],
            stepWin: 2000
        },

        flips: [
            {
                from: { c: 1, r: 1 },
                to: { i: 0, f: 4, ms: 3, mi: 0, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 1, r: 2 },
                to: { i: 0, f: 4, ms: 3, mi: 1, sid: 1 } // biến thành Wild
            },
            {
                from: { c: 1, r: 3 },
                to: { i: 0, f: 4, ms: 3, mi: 2, sid: 1 } // biến thành Wild
            },
        ],
        copies: [],
        hasNext: false,
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
    },
    {
        index: 0,
        multiplier: 4,
        isScratch: true,
        freeSpin: 8,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 8,
        isScratch: true,
        freeSpin: 7,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 16,
        isScratch: true,
        freeSpin: 6,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 32,
        isScratch: true,
        freeSpin: 5,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 64,
        isScratch: true,
        freeSpin: 4,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 128,
        isScratch: true,
        freeSpin: 3,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 256,
        isScratch: true,
        freeSpin: 2,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 1024,
        isScratch: true,
        freeSpin: 1,

        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    },
    {
        index: 0,
        multiplier: 4,
        isScratch: true,
        freeSpin: 0,
        totalPrice: 10000,
        grid: [

            // Reel 0
            [
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 1 (NO mega)
            [
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 3, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 5, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 2 (MEGA 3 stack)
            [
                { i: 7, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 8, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 9, f: 3, ms: 1, mi: 0, sid: 200 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 3
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 4
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 9, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 5
            [
                { i: 6, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 12, f: 0, ms: 1, mi: 0, sid: -1 }
            ],

            // Reel 6 (Wild giữ nguyên)
            [
                { i: 3, f: 4, ms: 1, mi: 0, sid: -1 },
                { i: 11, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                { i: 10, f: 0, ms: 1, mi: 0, sid: -1 }
            ]
        ],

        above: [
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [],
            [{ i: 7, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 9, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }, { i: 8, f: 0, ms: 1, mi: 0, sid: -1 }],
            [{ i: 2, f: 0, ms: 1, mi: 0, sid: -1 }],
        ],

        win: {
            positions: [
                { c: 1, r: 0 },
                { c: 0, r: 4 },
                { c: 2, r: 5 },
                { c: 3, r: 4 },
                { c: 4, r: 4 },
                { c: 4, r: 2 },
                { c: 5, r: 3 },
            ],
            stepWin: 2000
        },
        BigWin: 0,
        MegaWin: 0,
        SuperWin: 0,
        flips: [],
        copies: [],
        hasNext: false
    }
    ]
};