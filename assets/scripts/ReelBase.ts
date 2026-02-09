import { _decorator, Component, UITransform, Vec3, Tween, tween, instantiate, Node, sp } from 'cc';
import { Symbol } from './Symbol';
import { PrefabManager } from './Manager/PrefabManager';
import { GameManager } from './Manager/GameManager';
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

    protected _delay = 0.03;
    protected _isStopping = false;
    protected _remainSteps = 0;

    @property(Number)
    possitionReel: number = 0

    isRolling = false;

    @property(Number)
    numberSymbols: number = 9; // dọc = 9, ngang = 8
    private _onFullyStopped: (() => void) | null = null;

    public setOnFullyStopped(cb: () => void) {
        this._onFullyStopped = cb;
    }

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

    // ================= QUAY =================
    startRoll() {
        this.isRolling = true;
        this._isStopping = false;
        this.symbols.forEach(e => {
            e.isInit = false
        })
        Tween.stopAllByTarget(this.node);

        tween(this.node)
            .call(() => {
                if (!this.isRolling) return;
                for (let s of this.symbols) {
                    s.reelIndex++;
                    if (s.reelIndex >= this.symbols.length) {
                        s.reelIndex = 0;
                        if (!this._isStopping || s.isInit == false) {
                            s.ResetSymbol(); // random khi chưa stop
                        }
                        s.node.position = this.getSymbolPosition(-1);


                    }
                    s.rollToIndex(this._isStopping ? 0.08 : 0.05);
                }
                // ===== STOP PHASE =====
                if (this._isStopping) {
                    this._remainSteps--;
                    if (this._remainSteps <= 0) {
                        this.isRolling = false;
                        Tween.stopAllByTarget(this.node);
                        this.snapToFinalPosition();
                        const visibleSymbols = this.symbols.filter(s =>
                            this.isVisibleIndex(s.reelIndex)
                        );
                        if (visibleSymbols.length === 0) {
                            this._onFullyStopped?.();
                            this._onFullyStopped = null;
                            return;
                        }
                        let completed = 0;
                        this.playIdleFXVisible();
                        visibleSymbols.forEach(s => {
                            s.exploAnim(10, () => {
                                completed++;
                                if (completed === visibleSymbols.length) {
                                    // 🔥 chỉ emit event ở đây
                                    this._onFullyStopped?.();
                                    this._onFullyStopped = null;
                                }
                            });
                        });
                        return;
                    }
                }
            })
            .delay(this._delay)
            .union()
            .repeatForever()
            .start();
    }

    private snapToFinalPosition() {
        for (let s of this.symbols) {
            const pos = this.getSymbolPosition(s.reelIndex);
            s.node.setPosition(pos);
        }
        this.sortSibling();
    }
    private isVisibleIndex(index: number): boolean {
        const total = this.symbols.length;
        const start = this.FIRST_VISIBLE;
        const end = (start + this.VISIBLE_COUNT) % total;

        if (start < end) {
            return index >= start && index < end;
        } else {
            return index >= start || index < end;
        }
    }

    protected playIdleFXVisible() {
        for (let s of this.symbols) {
            if (this.isVisibleIndex(s.reelIndex)) {
                s.fxIdle();
            }
        }
    }

    // ================= CHUẨN BỊ DỪNG KIỂU GAME GỐC =================
    stopRoll(result: any[]) {
        if (result) {
            const total = this.symbols.length;
            const visible = this.VISIBLE_COUNT;
            const firstVisible = this.FIRST_VISIBLE;
            const usedSymbols = new Set<any>();

            for (let i = 0; i < visible; i++) {

                if (!result[i]) continue;

                let targetIndex = firstVisible + i;
                if (targetIndex >= total) {
                    targetIndex -= total;
                }

                let placeIndex = targetIndex - visible;
                while (placeIndex < 0) {
                    placeIndex += total;
                }

                const s = this.symbols.find(sym => sym.reelIndex === placeIndex);
                if (!s) continue;

                const e = result[i];
                s.InitSymbol(e);
                usedSymbols.add(s);

                if (this.possitionReel == 0) {
                    GameManager.instance.symBolArray[5 - (i + 1)][0] = s
                    s.col = 5 - (i + 1)
                    s.row = 0
                }
                else {
                    s.col = this.possitionReel - 1
                    s.row = i + 1

                    GameManager.instance.symBolArray[this.possitionReel - 1][i + 1] = s

                }
            }
            this._isStopping = true;
            this._remainSteps = visible;
        }
    }





    public cascadeDrop(dataAbove: any[]) {
        let space = 0
        let max = 7
        this.symbols = this.symbols.filter(item => item.node !== null);
        let listSymbok = []
        if (this.isHorizontal() == false) max = 8
        for (let i = max; i >= 4; i--) {
            let s = this.symbols.find(e => e.reelIndex == i)
            if (s == undefined || s == null) {
                space++
            }
            else {
                if (space > 0) {
                    s.reelIndex += space
                    listSymbok.push(s)
                    if (this.isHorizontal() == true) {
                        s.col -= space
                        GameManager.instance.symBolArray[s.col][s.row]
                    }
                    else {
                        console.log(s.col, space, this.possitionReel)
                        s.row += space
                        GameManager.instance.symBolArray[s.col][s.row]
                    }
                }

            }
        }

        console.log(this.possitionReel, space, dataAbove)
        for (let i = space - 1; i >= 0; i--) {
            let Symbol = this.createNewSymbol()
            this.symbols.push(Symbol)
            Symbol.reelIndex = 4 + i
            Symbol.node.setPosition(this.getSymbolPosition(4 - (space - i)))
            Symbol.reel = this
            Symbol.InitSymbol(dataAbove[i]);
            listSymbok.push(Symbol)
            if (this.isHorizontal() == true) {
                Symbol.row = 4 - i
                GameManager.instance.symBolArray[Symbol.col][Symbol.row]
            }
            else {
                Symbol.col = 1 + i
                GameManager.instance.symBolArray[Symbol.col][Symbol.row]
            }
        }

        listSymbok.forEach((e, i) => {
            this.scheduleOnce(() => {
                e.DropToindex(0.1)
            }, 0.05 * i)

        }
        )

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

    protected playMoveFX() {
        for (let s of this.symbols) {
            s.fxMove();
        }
    }


    protected playExplodeFX(onComplete?: () => void) {

        const visibleSymbols = this.symbols.filter(s =>
            this.isVisibleIndex(s.reelIndex)
        );

        if (visibleSymbols.length === 0) {
            onComplete && onComplete();
            return;
        }

        let completed = 0;

        visibleSymbols.forEach(s => {
            s.exploAnim(10, () => {
                completed++;

                if (completed === visibleSymbols.length) {
                    onComplete && onComplete();
                }
            });
        });
    }

    protected update(dt: number): void {
        this.maskEff.setSiblingIndex(999)
    }

}