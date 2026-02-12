import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { ReelBase } from '../ReelBase';
import { ComboManager } from '../ComboManager';
import { Symbol } from '../Symbol';
import { SymbolCell } from '../SymbolCell';
import { ESymbolFace } from '../ESymbolFace';
import { Spin } from '../Spin';
import { BigWin } from '../BigWin';
import { FreeSpines } from '../FreeSpines';
import { AutoCtrl } from '../AutoCtrl';
import { H_story } from '../Hístory';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: ReelBase })
    reels: ReelBase[] = []
    public static instance: GameManager = null
    public stoppedCount = 0

    @property(Label)
    walet: Label = null

    @property(Label)
    priceTienCuoc: Label = null

    @property(Label)
    totalPrice: Label = null
    @property(Label)
    totalPriceBot: Label = null

    @property(Node)
    headerNormal: Node = null

    @property(Node)
    headerFreeSpines: Node = null

    @property(Node)
    frameReel1Normal: Node = null

    @property(Node)
    frameReel1FreeSpin: Node = null

    @property(Node)
    footFreeSpin: Node = null

    @property(Node)
    walletNode: Node = null

    @property(Node)
    footer: Node

    @property(Node)
    optionSetting: Node = null

    @property(AutoCtrl)
    UiAuto: AutoCtrl = null
    isTurbo = false
    onLoad() {
        GameManager.instance = this
    }
    protected start(): void {
        this.UpdatePrice()
        this.SetNormal()
        this.initGrid()

    }

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
        usingFreeSpin: false,

        rounds: [{
            index: 0,
            multiplier: 1,
            isScratch: false,
            freeSpin: 0,

            grid: [

                // Reel 0
                [
                    { i: 7, f: 0, ms: 1, mi: 0, sid: -1 },
                    { i: 2, f: 0, ms: 1, mi: 0, sid: -1 },
                    { i: 5, f: 0, ms: 1, mi: 0, sid: -1 },
                    { i: 7, f: 0, ms: 1, mi: 0, sid: -1 }
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
            BigWin: 0,
            MegaWin: 0,
            SuperWin: 0,
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

    indexCurrentReel = 0
    public PlaySpin() {
        if (this.sampleJson.rounds[this.indexCurrentReel].isScratch == true) {
            this.SetFreeSpines()
            this.PlayFreeSpin(this.sampleJson.rounds[this.indexCurrentReel].freeSpin)
        }
        else {
            this.SetNormal()
        }
        if (this.sampleJson.rounds.length > this.indexCurrentReel) {
            this.sampleJson.rounds[this.indexCurrentReel].grid[0].reverse()
            let dataRound = this.sampleJson.rounds[this.indexCurrentReel]
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
            this.reels.forEach((reel, i) => {
                this.scheduleOnce(() => {
                    reel.startRoll();

                }, (this.isTurbo == false) ? 0.1 : 0.03)
            });
            let stoppedPhase1 = 0;
            let phase1Count = indexReel + 1;
            for (let i = 0; i <= indexReel; i++) {
                this.reels[i].setOnFullyStopped(() => {
                    stoppedPhase1++;
                    if (stoppedPhase1 === phase1Count) {
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
                }, (this.isTurbo == false) ? (1 + 0.3 * i) : (0.2 + 0.2 * i))
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
                reel.symbols.forEach(e => {
                    if (e.face == ESymbolFace.SCRATCH) {
                        e.PlayIdleScratch()
                    }
                })
                if (current >= this.reels.length) {
                    this.playAnimReelScratch(99)
                    this.scheduleOnce(() => {
                        if (this.sampleJson.rounds[this.indexCurrentReel].freeSpin > 0) {
                            this.ShowAllReef(true)

                        }
                        else {
                            this.ShowAllReef()

                        }
                        this.scheduleOnce(() => {
                            if (this.sampleJson.rounds[this.indexCurrentReel].freeSpin > 0) {
                                FreeSpines.instance.playAnimation(() => {
                                    this.SetFreeSpines()
                                    this.PlayFreeSpin(this.sampleJson.rounds[this.indexCurrentReel].freeSpin)
                                    this.scheduleOnce(() => {
                                        this.CheckContinueSpin()

                                    }, 2)
                                })
                            }
                            else {
                                this.CheckContinueSpin()

                            }
                        }, 1)

                    }, 0.4)
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
                }, (this.isTurbo == false) ? 1 : 0.5);
            }, 0.03 * index)

        })
    }

    StopRollAllReel() {
        this.ClearData()
    }


    FlipData(onComplete?: () => void) {
        let dataRound = this.sampleJson.rounds[this.indexCurrentReel].flips;
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
        let dataRound = this.sampleJson.rounds[this.indexCurrentReel].win.positions

        dataRound.forEach(e => {
            if (this.symBolArray[e.c][e.r])
                this.symBolArray[e.c][e.r].Dispose()
        })
        this.scheduleOnce(() => {
            if (this.sampleJson.rounds[this.indexCurrentReel].flips.length > 0) {
                this.FlipData(() => {
                    this.reels.forEach((e, index) => {
                        e.cascadeDrop(this.sampleJson.rounds[this.indexCurrentReel].above[index]);
                    });

                    this.scheduleOnce(() => {
                        this.ShowBigWin()
                    }, 2)
                });
            }
            else {
                console.log(this.sampleJson.rounds[this.indexCurrentReel].above)
                this.reels.forEach((e, index) => {
                    this.scheduleOnce(() => { })
                    e.cascadeDrop(this.sampleJson.rounds[this.indexCurrentReel].above[index])
                })
                this.scheduleOnce(() => {
                    this.ShowBigWin()
                }, 2)
            }



        }, 1.3)

    }

    ShowBigWin() {
        if (this.sampleJson.rounds[this.indexCurrentReel].BigWin > 0) {
            BigWin.instance.showBigWin(() => {
                if (this.sampleJson.rounds[this.indexCurrentReel].MegaWin > 0) {
                    BigWin.instance.showMegaWin(() => {
                        if (this.sampleJson.rounds[this.indexCurrentReel].SuperWin > 0) {
                            BigWin.instance.showSuperWin(() => {
                                this.CheckContinueSpin()
                            }, this.sampleJson.rounds[this.indexCurrentReel].SuperWin)
                        }
                        else {
                            this.CheckContinueSpin()
                        }
                    }, this.sampleJson.rounds[this.indexCurrentReel].MegaWin)
                }
                else {
                    this.CheckContinueSpin()
                }
            }, this.sampleJson.rounds[this.indexCurrentReel].BigWin)
        }
        else {
            if (this.sampleJson.rounds[this.indexCurrentReel].totalPrice && this.sampleJson.rounds[this.indexCurrentReel].totalPrice > 0 && this.sampleJson.rounds[this.indexCurrentReel].isScratch) {
                FreeSpines.instance.ShowTotalSpin(() => {
                    this.CheckContinueSpin()
                }, 4000)
            }
            else {
                this.CheckContinueSpin()

            }

        }
    }

    CheckContinueSpin() {
        if (Spin.instance.isAuto == false) {
            console.log("den day", this.sampleJson.rounds.length - 1 > this.indexCurrentReel)
            if (this.sampleJson.rounds.length - 1 > this.indexCurrentReel) {
                this.indexCurrentReel++
                this.PlaySpin()
            }
            else {
                Spin.instance.ActiveSpin()
                this.indexCurrentReel = 0
                this.SetNormal()
            }
        }
        else {
            Spin.instance.CheckAuto()
        }
    }

    CheckScratch() {
        let indexScratch = 0
        this.sampleJson.rounds[this.indexCurrentReel].grid.forEach(reels => {
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
        let grid = this.sampleJson.rounds[this.indexCurrentReel].grid
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
        this.reels.forEach((e, i) => {
            if (i == index) {
                if (e.spinesEff)
                    e.spinesEff.enabled = true
                tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
            }
            else {
                if (e.spinesEff)
                    e.spinesEff.enabled = false
                tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 255 }).start()
            }
        })
    }

    ShowAllReef(iSpine = false) {
        this.reels.forEach((e, i) => {
            e.symbols.forEach(s => {
                if (s.face == ESymbolFace.SCRATCH && iSpine == false) {
                    s.playAnimation(s.getNameIdle(), true)
                }
            })
            tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
        })
    }

    public SetNormal() {
        this.headerNormal.active = true
        this.headerFreeSpines.active = false
        this.frameReel1Normal.active = true
        this.frameReel1FreeSpin.active = false
        this.footFreeSpin.active = false
        this.walletNode.setPosition(0, -436)
    }

    public SetFreeSpines() {
        this.headerNormal.active = false
        this.headerFreeSpines.active = true
        this.frameReel1Normal.active = false
        this.frameReel1FreeSpin.active = true
        this.footFreeSpin.active = true
        this.walletNode.setPosition(0, -679.364)

    }


    public PlayFreeSpin(round) {
        FreeSpines.instance.UpdateRound(round)
    }


    isShowSetting = false
    public ShowSetting() {
        if (this.isShowSetting == true) return
        this.isShowSetting = true
        this.footer.setPosition(0, -550)
        tween(this.footer).to(0.2, { position: new Vec3(0, -880) })
            .call(() => {
                this.isShowSetting = false
            })
            .start()
        this.optionSetting.setPosition(0, -880)
        tween(this.optionSetting).to(0.2, { position: new Vec3(0, -550) }).start()
    }
    isShowFooter = false
    public ShowFooter() {
        if (this.isShowFooter == true) return
        this.isShowFooter = true
        this.optionSetting.setPosition(0, -550)
        tween(this.optionSetting).to(0.2, { position: new Vec3(0, -880) })
            .call(() => {
                this.isShowFooter = false
            })
            .start()
        this.footer.setPosition(0, -880)
        tween(this.footer).to(0.2, { position: new Vec3(0, -550) }).start()
    }

    public ShowAuto() {
        this.UiAuto.show()
    }

    priceOffset = 2000
    priceCurrent = 10000
    priceMax = 20000
    BtnMinus() {
        if (this.priceCurrent > this.priceOffset) {
            this.priceCurrent -= this.priceOffset
            this.UpdatePrice()
        }
    }

    BtnPlus() {
        if (this.priceCurrent < this.priceMax) {
            this.priceCurrent += this.priceOffset
            this.UpdatePrice()
        }
    }

    UpdatePrice() {
        this.totalPrice.string = this.priceCurrent.toString()
        this.totalPriceBot.string = this.priceCurrent.toString()
    }

    @property(Node) history: Node = null
    BtnHistory() {
        this.history.getComponent(H_story).show()
    }

}

