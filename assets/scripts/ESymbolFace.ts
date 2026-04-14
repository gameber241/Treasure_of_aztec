export enum ESymbolFace {
    WILD = 0,
    SCRATCH = 1,     // Scatter
    MASK_RED = 2,
    STONE_WHEEL = 3,
    GREEN_IDOL = 4,
    PURPLE_SERPENT = 5,
    GOLDEN_IDOL = 6,
    JAGUAR_PINK = 7,
    TEN = 8,
    JACK = 9,
    QUEEN = 10,
    KING = 11,
    ACE = 12
}


export const SymbolPayoutConfig = {
    [ESymbolFace.WILD]: {
        count: "",
        value: ""
    },
    [ESymbolFace.SCRATCH]: {
        count: "",
        value: ""
    },

    [ESymbolFace.MASK_RED]: {
        count: "6\n5\n4\n3",
        value: "70\n50\n25\n20"
    },

    [ESymbolFace.GOLDEN_IDOL]: {
        count: "6\n5\n4\n3",
        value: "80\n60\n40\n30"
    },
    [ESymbolFace.JAGUAR_PINK]: {
        count: "6\n5\n4\n3",
        value: "50\n40\n25\n10"
    },
    [ESymbolFace.PURPLE_SERPENT]: {
        count: "6\n5\n4\n3",
        value: "30\n20\n15\n8"
    },
    [ESymbolFace.STONE_WHEEL]: {
        count: "6\n5\n4\n3",
        value: "15\n12\n10\n6"
    },
    [ESymbolFace.GREEN_IDOL]: {
        count: "6\n5\n4\n3",
        value: "15\n12\n10\n6"
    },

    [ESymbolFace.ACE]: {
        count: "6\n5\n4\n3",
        value: "10\n8\n6\n4"
    },
    [ESymbolFace.KING]: {
        count: "6\n5\n4\n3",
        value: "10\n8\n6\n4"
    },
    [ESymbolFace.QUEEN]: {
        count: "6\n5\n4\n3",
        value: "4\n3\n2\n1"
    },
    [ESymbolFace.JACK]: {
        count: "6\n5\n4\n3",
        value: "4\n3\n2\n1"
    },
    [ESymbolFace.TEN]: {
        count: "6\n5\n4\n3",
        value: "4\n3\n2\n1"
    }
};

