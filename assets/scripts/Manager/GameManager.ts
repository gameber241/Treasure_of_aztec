import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
import { ReelBase } from '../ReelBase';
import { ComboManager } from '../ComboManager';
import { Symbol } from '../Symbol';
import { SymbolCell } from '../SymbolCell';
import { ESymbolFace } from '../ESymbolFace';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: ReelBase })
    reels: ReelBase[] = []
    public static instance: GameManager = null
    public stoppedCount = 0
    onLoad() {
        GameManager.instance = this
    }
    protected start(): void {
        this.initGrid()
        this.scheduleOnce(() => {
            this.PlaySpin()
        }, 0.3)

        // this.scheduleOnce(() => {
        //     this.GenerateMap()
        // }, 4)

        // this.scheduleOnce(() => {
        //     this.GenerateMap()
        // }, 8)
    }
    // dataExample = {
    //     "grid": [
    //         [ // Reel 0 (ngang, 4 ô)
    //             { "i": 2, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 5, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 8, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 11, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
    //         ],

    //         [ // Reel 1 – Mega Silver 1x3 (sid=100)
    //             { "i": 6, "f": 2, "ms": 3, "mi": 0, "sid": 100 },
    //             { "i": 6, "f": 2, "ms": 3, "mi": 1, "sid": 100 },
    //             { "i": 6, "f": 2, "ms": 3, "mi": 2, "sid": 100 },
    //             { "i": 9, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 1, "t": 2, "f": 1, "ms": 1, "mi": 0, "sid": -1 }
    //         ],

    //         [ // Reel 2 – Wild Mega 1x2 (sid=200)
    //             { "i": 0, "f": 4, "ms": 2, "mi": 0, "sid": 200 },
    //             { "i": 0, "f": 4, "ms": 2, "mi": 1, "sid": 200 },
    //             { "i": 10, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 7, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 12, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
    //         ],

    //         [ // Reel 3
    //             { "i": 3, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 4, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 5, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 6, "f": 3, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 8, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
    //         ],

    //         [ // Reel 4 – Scatter
    //             { "i": 1, "f": 1, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 1, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 9, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 10, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 11, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
    //         ],

    //         [ // Reel 5 – Wild thường
    //             { "i": 0, "f": 4, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 7, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 8, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 6, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
    //             { "i": 12, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
    //         ],

    //         [ // Reel 6 – Mega Gold 1x4 (sid=300)
    //             { "i": 4, "f": 3, "ms": 4, "mi": 0, "sid": 300 },
    //             { "i": 4, "f": 3, "ms": 4, "mi": 1, "sid": 300 },
    //             { "i": 4, "f": 3, "ms": 4, "mi": 2, "sid": 300 },
    //             { "i": 4, "f": 3, "ms": 4, "mi": 3, "sid": 300 },
    //             { "i": 5, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
    //         ]
    //     ]
    // }

    symBolArray: Symbol[][]

    initGrid() {
        const rows = 6;
        const cols = 6;

        this.symBolArray = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => null)
        );
    }
    sampleJson = {
        success: true,
        totalWin: 2250,
        freeSpinsLeft: 0,
        usingFreeSpin: false,

        rounds: [

            // // =================================================
            // // ROUND 0 – TEN WIN
            // // =================================================
            {
                index: 0,
                multiplier: 1,

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
                        { i: 0, f: 4, ms: 1, mi: 0, sid: -1 },
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
                hasNext: true
            },

            // // =================================================
            // // ROUND 1 – GOLDEN_IDOL + MEGA
            // // =================================================
            {
                index: 1,
                multiplier: 2,

                grid: [

                    // Reel 0
                    [
                        { i: 4, f: 0, ms: 1, mi: 0, sid: -1 },
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
                hasNext: false
            }
        ]
    };


    isSpin = false
    index = 0
    public PlaySpin() {
        if (this.isSpin == true) return
        this.isSpin = true
        if (this.sampleJson.rounds.length > this.index) {
            this.sampleJson.rounds[this.index].grid[0].reverse()
            let dataRound = this.sampleJson.rounds[this.index]
            this.GenerateMap(dataRound.grid)
            ComboManager.instance.ScrollToCombo(dataRound.multiplier)

        }
    }


    GenerateMap(grid: any[][]) {
        if (this.CheckScratch() == false)
            this.RollDataNormal(grid)
        else {
            this.RollDataScratch(grid)
        }
    }

    RollDataScratch(grid) {
        let indexReel = this.CheckReelFull3Scratch()
        if (indexReel == this.reels.length - 1) {
            this.RollDataNormal(this)
        }
        else {
            // ===== PHASE 1 =====
            this.reels.forEach((reel, i) => {
                this.scheduleOnce(() => {
                    reel.startRoll();

                }, 0.1 * i)
            });

            let stoppedPhase1 = 0;
            let phase1Count = indexReel + 1;

            for (let i = 0; i <= indexReel; i++) {

                this.reels[i].setOnFullyStopped(() => {

                    stoppedPhase1++;

                    if (stoppedPhase1 === phase1Count) {
                        // 🔥 Phase 1 stop xong → bắt đầu phase 2
                        this.stopPhase2(indexReel, grid);
                        for (let j = 0; j <= indexReel; j++) {
                            this.reels[j].symbols.forEach(e => {
                                if (e.face == ESymbolFace.SCRATCH) {
                                    e.PlayIdleScratch()
                                }
                            })
                        }
                    }
                });
                this.scheduleOnce(() => {
                    this.reels[i].stopRoll(grid[i]);
                }, 1 + 0.3 * i)
            }

        }

    }
    private stopPhase2(index: number, grid) {
        let current = index + 1;
        this.playAnimReelScratch(current)
        let time = 2
        const stopNext = () => {


            const reel = this.reels[current];
            reel.setOnFullyStopped(() => {
                current++;
                if (current >= this.reels.length) {
                    console.log("scroll xong")
                    this.playAnimReelScratch(99)

                    return;
                }
                this.playAnimReelScratch(current)
                this.scheduleOnce(() => {
                    stopNext();
                }, time)

            });

            reel.stopRoll(grid[current]);
        };
        this.scheduleOnce(() => {
            stopNext();
        }, time)
    }



    RollDataNormal(grid) {
        let stoppedCount = 0;
        this.reels.forEach((reel, index) => {
            reel.setOnFullyStopped(() => {
                stoppedCount++;
                if (stoppedCount === this.reels.length) {
                    this.ClearData();
                }
            });
            this.scheduleOnce(() => {
                reel.startRoll();
                this.scheduleOnce(() => {
                    reel.stopRoll(grid[index]);
                }, 1.3);
            }, 0.1 * index);
        });
    }

    StopRollAllReel() {
        this.ClearData()
    }


    FlipData(onComplete?: () => void) {
        let dataRound = this.sampleJson.rounds[0].flips;
        if (!dataRound || dataRound.length === 0) {
            onComplete?.();
            return;
        }
        let completed = 0;
        dataRound.forEach(e => {
            const symbol = this.symBolArray[e.from.c][e.from.r];
            symbol.FlipSymbol(e.to, () => {
                completed++;
                if (completed === dataRound.length) {
                    onComplete?.();
                }
            });
        });
    }


    ClearData() {
        let dataRound = this.sampleJson.rounds[0].win.positions
        dataRound.forEach(e => {
            if (this.symBolArray[e.c][e.r])
                this.symBolArray[e.c][e.r].Dispose()
        })
        this.scheduleOnce(() => {
            if (this.sampleJson.rounds[0].flips) {
                this.FlipData(() => {
                    this.reels.forEach((e, index) => {
                        e.cascadeDrop(this.sampleJson.rounds[this.index].above[index]);
                    });

                });
            }
            else {
                this.reels.forEach((e, index) => {
                    this.scheduleOnce(() => { })
                    e.cascadeDrop(this.sampleJson.rounds[this.index].above[index])
                })
            }

        }, 1.3)

    }

    CheckScratch() {
        let indexScratch = 0
        this.sampleJson.rounds[this.index].grid.forEach(reels => {
            reels.forEach(e => {
                if (e.i == ESymbolFace.SCRATCH) {
                    indexScratch++
                }

            })
        })

        return indexScratch >= 3
    }

    public CheckReelFull3Scratch() {
        let indexScratch = 0
        let grid = this.sampleJson.rounds[this.index].grid
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].i == ESymbolFace.SCRATCH) {
                    indexScratch++

                }
            }

            if (indexScratch >= 3) return i

        }
    }

    public playAnimReelScratch(index) {
        console.log(index, "efff")
        this.reels.forEach((e, i) => {
            console.log(i)
            if (i == index) {
                tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
            }
            else tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 255 }).start()

        })
    }

}

