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
                this.sortSibling();
            })
            .union()
            .repeatForever()
            .start();
    }


    stopRoll(result: any[]) {
        this.isRolling = false;
        this._isStopping = true;

        Tween.stopAllByTarget(this.node);

        if (!result) {
            this.symbols.forEach(s => {
                s.reelIndex += visible;
                s.rollToIndex(this._delay * 5, Symbol.MoveType.STOP);

            });
            return;

        }

        const total = this.symbols.length;     // 15
        const visible = this.VISIBLE_COUNT;   // 5
        const firstVisible = this.FIRST_VISIBLE;
        // 1️⃣ Set result vào 5 symbol phía trên (không đụng visible hiện tại)
        for (let i = 0; i < visible; i++) {
            const targetIndex = (firstVisible + i) % total;
            const placeIndex = (targetIndex - visible + total) % total;
            const s = this.symbols.find(sym => sym.reelIndex === placeIndex);
            if (!s) continue;
            s.InitSymbol(result[i]);
            if (this.possitionReel == 0) {
                const row = 3 - i;
                s.col = this.possitionReel
                s.row = row

            }
            else {
                s.col = this.possitionReel
                s.row = i

            }
            GameManager.instance.symBolArray[s.col][s.row] = s

        }
        // 2️⃣ Cho tất cả symbol scroll xuống như bình thường bằng rollToIndex
        this.symbols.forEach(s => {
            s.reelIndex += visible;
            s.rollToIndex(this._delay * 5, Symbol.MoveType.STOP);

        });
        SoundToggle.instance.PlaySymbolDrop()
    }
    changeSpeed(newDelay: number) {
        this._delay = newDelay;

        Tween.stopAllByTarget(this.node);

        this.startRoll();
    }
    public cascadeDrop(dataAbove: any[]) {
        dataAbove.reverse()

        let space = 0
        let max = 9
        let min = 5
        this.symbols = this.symbols.filter(
            s => s.node && s.node.isValid
        );
        let listSymbok = []
        if (this.isHorizontal() == true) max = 8
        if (this.isHorizontal() == true) min = 4

        for (let i = max; i >= min; i--) {
            let s = this.symbols.find(e => e.reelIndex == i)
            if (s == undefined || s == null) {
                space++
            }
            else {
                if (space > 0) {
                    if (this.isHorizontal() == true) {
                        s.reelIndex += space
                        s.row -= space

                    }
                    else {
                        s.row += space
                        s.reelIndex += space

                    }
                    listSymbok.push(s)

                    GameManager.instance.symBolArray[s.col][s.row] = s
                }

            }
        }
        for (let i = space - 1; i >= 0; i--) {
            let Symbol = this.createNewSymbol()
            this.symbols.push(Symbol)
            Symbol.reelIndex = min + i

            Symbol.node.setPosition(this.getSymbolPosition(Symbol.reelIndex - space))
            Symbol.reel = this
            Symbol.InitSymbol(dataAbove[i]);
            listSymbok.push(Symbol)
            if (this.isHorizontal() == true) {
                Symbol.row = 3 - i
            }
            else {
                Symbol.row = i
            }
            Symbol.col = this.possitionReel
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