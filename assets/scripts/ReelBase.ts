import { _decorator, Component, UITransform, Vec3, Tween, tween, instantiate, Node, sp, Layers } from 'cc';
import { Symbol } from './Symbol';
import { PrefabManager } from './Manager/PrefabManager';
import { GameManager } from './Manager/GameManager';
import { SoundManager } from './SoundManager';
import { SoundToggle } from './Sound';
const { ccclass, property } = _decorator;

@ccclass('ReelBase')
export abstract class ReelBase extends Component {
    @property(Node)
    maskEff: Node = null
    @property(sp.Skeleton)
    spinesEff: sp.Skeleton = null
    protected symbolPadding = 1.5;
    public symbols: Symbol[] = [];

    protected cellSize = 0;
    protected totalSize = 0;
    protected halfSize = 0;

    _delay = 0.04;
    protected _isStopping = false;
    protected _remainSteps = 0;

    @property(Number)
    possitionReel: number = 0

    isRolling = false;

    @property(Number)
    numberSymbols: number = 9; // dọc = 9, ngang = 8

    public abstract VISIBLE_COUNT: number;
    public abstract FIRST_VISIBLE: number;

    protected start(): void {
        this.init();
        this.collectSymbols();
        this.rearrangeSymbols();
    }

    init() {
        for (let i = 0; i < this.numberSymbols; i++) {
            let symbol = instantiate(PrefabManager.instance.symbolPrefab);
            this.node.addChild(symbol);
        }
    }

    protected collectSymbols() {
        this.symbols = [];
        for (let n of this.node.children) {
            const s = n.getComponent(Symbol);
            if (s) {
                s.reel = this;
                s.reelIndex = this.symbols.length;
                this.symbols.push(s);
                s.ResetSymbol()
            }
        }

        const ui = this.symbols[0].node.getComponent(UITransform);
        this.cellSize = this.getCellSize(ui) + this.symbolPadding;
        this.totalSize = this.cellSize * this.symbols.length;
        this.computeHalfSize();
    }

    protected rearrangeSymbols() {
        for (let s of this.symbols) {
            s.node.position = this.getSymbolPosition(s.reelIndex);
        }
    }


    startRoll() {
        this._isStopping = false;
        this.isRolling = true;
        this.collectSymbols();
        this.rearrangeSymbols();
        this.symbols.forEach(e => {
            e.icon.node.layer = Layers.Enum.DEFAULT
            e.frame.node.layer = Layers.Enum.DEFAULT
            e.isInit = false
            e.node.active = true
        })
        tween(this.node)
            .call(() => {
                if (this.isRolling === false) return;
                for (let s of this.symbols) {
                    s.reelIndex += 1
                    if (s.reelIndex >= this.symbols.length) {
                        s.reelIndex = 0;
                        if (!this._isStopping) {
                            s.ResetSymbol();
                        }
                        s.node.position = this.getSymbolPosition(-1);
                    }
                    s.rollToIndex(this._delay, Symbol.MoveType.MOVING);

                }

            })
            .delay(this._delay)
            .call(() => {
                // this.sortSibling();
            })
            .union()
            .repeatForever()
            .start();

    }


    // stopRoll(result: any[]) {
    //     this.isRolling = false;
    //     this._isStopping = true;

    //     Tween.stopAllByTarget(this.node);
    //     const total = this.symbols.length;     // 15
    //     const visible = this.VISIBLE_COUNT;   // 5
    //     const firstVisible = this.FIRST_VISIBLE;
    //     if (!result) {
    //         this.symbols.forEach(s => {
    //             s.reelIndex += visible;
    //             s.rollToIndex(this._delay * 5, Symbol.MoveType.STOP);

    //         });
    //         return;

    //     }


    //     // 1️⃣ Set result vào 5 symbol phía trên (không đụng visible hiện tại)
    //     for (let i = 0; i < visible; i++) {
    //         const targetIndex = (firstVisible + i) % total;
    //         const placeIndex = (targetIndex - visible + total) % total;
    //         const s = this.symbols.find(sym => sym.reelIndex === placeIndex);
    //         if (!s) continue;
    //         const dataIndex = this.isHorizontal() ? (visible - 1 - i) : i;
    //         s.InitSymbol(result[dataIndex]);
    //         s.col = this.possitionReel
    //         s.row = dataIndex;
    //         GameManager.instance.symBolArray[s.col][s.row] = s

    //     }
    //     // 2️⃣ Cho tất cả symbol scroll xuống như bình thường bằng rollToIndex
    //     this.symbols.forEach(s => {
    //         s.reelIndex += visible;
    //         s.rollToIndex(this._delay * 5, Symbol.MoveType.STOP);

    //     });
    //     SoundToggle.instance.PlaySymbolDrop()
    // }
    stopRoll(result: any[]) {
        this.isRolling = false;
        this._isStopping = true;

        Tween.stopAllByTarget(this.node);

        const total = this.symbols.length;
        const visible = this.VISIBLE_COUNT;
        const firstVisible = this.FIRST_VISIBLE;

        // 🛡️ Safety check
        if (!this.symbols || this.symbols.length === 0) {
            console.error("❌ No symbols in reel");
            return;
        }

        if (!result || result.length < visible) {
            console.error("❌ Invalid result:", result);
            return;
        }

        // 🔥 FIX 1: normalize reelIndex (quan trọng nhất)
        this.symbols.sort((a, b) => a.reelIndex - b.reelIndex);
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].reelIndex = i;
        }

        // 🔥 FIX 2: build map index -> symbol
        const indexMap = new Map<number, Symbol>();
        for (let sym of this.symbols) {
            indexMap.set(sym.reelIndex, sym);
        }

        // 🔥 FIX 3: set result (KHÔNG dùng find nữa)
        for (let i = 0; i < visible; i++) {
            const targetIndex = (firstVisible + i) % total;
            const placeIndex = (targetIndex - visible + total) % total;

            let s = indexMap.get(placeIndex);

            // fallback nếu miss (trường hợp hiếm)
            if (!s) {
                console.warn("⚠ Missing symbol at index:", placeIndex);
                s = this.symbols[i % this.symbols.length];
            }

            const dataIndex = this.isHorizontal() ? (visible - 1 - i) : i;

            if (result[dataIndex] == null) {
                console.warn("⚠ Missing result data at:", dataIndex);
                continue;
            }

            s.InitSymbol(result[dataIndex]);
            s.col = this.possitionReel;
            s.row = dataIndex;

            if (GameManager.instance?.symBolArray) {
                GameManager.instance.symBolArray[s.col][s.row] = s;
            }
        }

        // 🔥 FIX 4: roll xuống như cũ
        this.symbols.forEach(s => {
            s.reelIndex += visible;
            s.rollToIndex(this._delay * 5, Symbol.MoveType.STOP);
        });

        SoundToggle.instance?.PlaySymbolDrop();
    }
    changeSpeed(newDelay: number) {
        this._delay = newDelay;

        Tween.stopAllByTarget(this.node);

        this.startRoll();
    }
    public cascadeDrop(dataAbove: any[]) {
        const aboveData = this.isHorizontal() ? dataAbove : [...dataAbove].reverse();
        this.symbols = this.symbols.filter(
            s => s.node && s.node.isValid
        );

        if (this.isHorizontal()) {
            const min = 4;
            const max = 7;
            const listSymbok = [];
            const visibleSymbols = this.symbols
                .filter(s => s.reelIndex >= min && s.reelIndex <= max)
                .sort((a, b) => a.row - b.row);

            for (let row = 0; row < this.VISIBLE_COUNT; row++) {
                if (GameManager.instance.symBolArray[this.possitionReel][row]) {
                    GameManager.instance.symBolArray[this.possitionReel][row] = null;
                }
            }

            visibleSymbols.forEach((s, index) => {
                s.row = index;
                s.reelIndex = max - index;
                listSymbok.push(s);
                GameManager.instance.symBolArray[s.col][s.row] = s;
            });

            const createCount = Math.min(this.VISIBLE_COUNT - visibleSymbols.length, aboveData.length);
            for (let i = 0; i < createCount; i++) {
                let Symbol = this.createNewSymbol()
                this.symbols.push(Symbol)
                const row = visibleSymbols.length + i;
                Symbol.reelIndex = max - row
                Symbol.node.setPosition(this.getSymbolPosition(Symbol.reelIndex - createCount))
                Symbol.reel = this
                Symbol.InitSymbol(aboveData[i]);
                listSymbok.push(Symbol)
                Symbol.col = this.possitionReel
                Symbol.row = row
                GameManager.instance.symBolArray[Symbol.col][Symbol.row] = Symbol
            }

            listSymbok.forEach((e, i) => {
                this.scheduleOnce(() => {
                    e.DropToindex(0.1)
                }, 0.05 * i)
            })
            return;
        }

        let space = 0
        let max = 9
        let min = 5
        let listSymbok = []

        for (let i = max; i >= min; i--) {
            let s = this.symbols.find(e => e.reelIndex == i)
            if (s == undefined || s == null) {
                space++
            }
            else {
                if (space > 0) {
                    const oldRow = s.row;
                    s.row += space
                    s.reelIndex += space
                    if (oldRow >= 0 && GameManager.instance.symBolArray[s.col][oldRow] === s) {
                        GameManager.instance.symBolArray[s.col][oldRow] = null;
                    }
                    listSymbok.push(s)
                    GameManager.instance.symBolArray[s.col][s.row] = s
                }
            }
        }
        const createCount = Math.min(space, aboveData.length)
        for (let i = createCount - 1; i >= 0; i--) {
            let Symbol = this.createNewSymbol()
            this.symbols.push(Symbol)
            Symbol.reelIndex = min + i
            Symbol.node.setPosition(this.getSymbolPosition(Symbol.reelIndex - createCount))
            Symbol.reel = this
            Symbol.InitSymbol(aboveData[i]);
            listSymbok.push(Symbol)
            Symbol.col = this.possitionReel
            Symbol.row = i
            GameManager.instance.symBolArray[Symbol.col][Symbol.row] = Symbol
        }

        listSymbok.forEach((e, i) => {
            this.scheduleOnce(() => {
                e.DropToindex(0.1)
            }, 0.05 * i)
        })

    }


    private createNewSymbol(): Symbol {
        let symbol = instantiate(PrefabManager.instance.symbolPrefab);
        this.node.addChild(symbol);

        return symbol.getComponent(Symbol);
    }


    public isHorizontal(): boolean { return false; }

    public abstract getCellSize(ui: UITransform): number;
    public abstract computeHalfSize(): void;
    public abstract getSymbolPosition(index: number): Vec3;
    public abstract sortSibling(): void;


}