import { _decorator, Component, Node } from 'cc';
import { ReelBase } from '../ReelBase';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: ReelBase })
    reels: ReelBase[] = []


    protected start(): void {
        this.scheduleOnce(() => {
            this.GenerateMap()

        }, 0.3)
    }
    dataExample = {
        "grid": [
            [ // Reel 0 (ngang, 4 ô)
                { "i": 2, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 5, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 8, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 11, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
            ],

            [ // Reel 1 – Mega Silver 1x3 (sid=100)
                { "i": 6, "t": 0, "f": 2, "ms": 3, "mi": 0, "sid": 100 },
                { "i": 6, "t": 0, "f": 2, "ms": 3, "mi": 1, "sid": 100 },
                { "i": 6, "t": 0, "f": 2, "ms": 3, "mi": 2, "sid": 100 },
                { "i": 9, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 1, "t": 2, "f": 1, "ms": 1, "mi": 0, "sid": -1 }
            ],

            [ // Reel 2 – Wild Mega 1x2 (sid=200)
                { "i": 0, "t": 1, "f": 4, "ms": 2, "mi": 0, "sid": 200 },
                { "i": 3, "t": 1, "f": 4, "ms": 2, "mi": 1, "sid": 200 },
                { "i": 10, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 7, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 12, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
            ],

            [ // Reel 3
                { "i": 3, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 4, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 5, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 6, "t": 0, "f": 3, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 8, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
            ],

            [ // Reel 4 – Scatter
                { "i": 1, "t": 2, "f": 1, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 2, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 9, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 10, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 11, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
            ],

            [ // Reel 5 – Wild thường
                { "i": 0, "t": 1, "f": 4, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 7, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 8, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 6, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 },
                { "i": 12, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
            ],

            [ // Reel 6 – Mega Gold 1x4 (sid=300)
                { "i": 4, "t": 0, "f": 3, "ms": 4, "mi": 0, "sid": 300 },
                { "i": 4, "t": 0, "f": 3, "ms": 4, "mi": 1, "sid": 300 },
                { "i": 4, "t": 0, "f": 3, "ms": 4, "mi": 2, "sid": 300 },
                { "i": 4, "t": 0, "f": 3, "ms": 4, "mi": 3, "sid": 300 },
                { "i": 5, "t": 0, "f": 0, "ms": 1, "mi": 0, "sid": -1 }
            ]
        ]
    }



    GenerateMap() {
        this.reels.forEach((e, index) => {
            e.startRoll()
            this.scheduleOnce(() => {
                e.stopRoll(this.dataExample.grid[index])

            }, 2)
        })
    }

}

