import { _decorator, Component, UITransform, Vec3, Tween, tween, instantiate, Node, sp } from 'cc';
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
                        if (!this._isStopping) {
                            s.ResetSymbol(); // random khi chưa stop
                        }
                        s.node.position = this.getSymbolPosition(-1);


                    }
                    s.rollToIndex(0.05);
                }
                // ===== STOP PHASE =====
                if (this._isStopping) {
                    this._remainSteps--;
                    if (this._remainSteps <= 0) {
                        SoundToggle.instance.PlayRoll()
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
            // Horizontal reel visual: reelIndex 0=rightmost, 3=leftmost
            // Server: result[0]=leftmost, result[3]=rightmost
            // Reverse for horizontal to match visual layout
            const processedResult = this.isHorizontal() ? [...result].reverse() : result;

            const total = this.symbols.length;
            const visible = this.VISIBLE_COUNT;
            const firstVisible = this.FIRST_VISIBLE;
            const usedSymbols = new Set<any>();

            for (let i = 0; i < visible; i++) {

                if (!processedResult[i]) continue;

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

                const e = processedResult[i];
                s.InitSymbol(e);
                usedSymbols.add(s);

                if (this.possitionReel == 0) {
                    // After reverse: processedResult[0]=rightmost, processedResult[3]=leftmost
                    // Map to symBolArray: col 4=rightmost, col 1=leftmost
                    const col = 4 - i;  // i=0→col=4, i=1→col=3, i=2→col=2, i=3→col=1
                    GameManager.instance.symBolArray[col][0] = s
                    s.col = col
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
        this.symbols = this.symbols.filter(item => item.node !== null);
        let listSymbok = []

        if (this.isHorizontal()) {
            // Horizontal reel: reverse above to match visual layout
            const reversedAbove = [...dataAbove].reverse();

            // Get remaining symbols from symBolArray (not disposed)
            let remainingSymbols = [];
            for (let col = 1; col <= 4; col++) {
                const s = GameManager.instance.symBolArray[col][0];
                if (s && s.node && s.node.isValid) {
                    remainingSymbols.push({ symbol: s, oldCol: col });
                }
            }

            // Clear symBolArray
            for (let col = 1; col <= 4; col++) {
                GameManager.instance.symBolArray[col][0] = null;
            }

            // Reassign remaining symbols to leftmost columns (slide left)
            remainingSymbols.forEach((item, index) => {
                const s = item.symbol;
                const newCol = index + 1;
                const newReelIndex = 8 - newCol;  // col 1→reelIndex 7, col 2→6, etc

                s.col = newCol;
                s.reelIndex = newReelIndex;
                GameManager.instance.symBolArray[newCol][0] = s;

                // Always add to listSymbok to trigger animation
                listSymbok.push(s);
            });

            // Add above symbols to rightmost positions
            const startCol = remainingSymbols.length + 1;
            reversedAbove.forEach((data, i) => {
                const Symbol = this.createNewSymbol();
                this.symbols.push(Symbol);

                const col = startCol + i;
                const finalReelIndex = 8 - col;

                // Start from outside visible area (low reelIndex = far right)
                Symbol.reelIndex = finalReelIndex;
                Symbol.node.setPosition(this.getSymbolPosition(finalReelIndex - reversedAbove.length));
                Symbol.reel = this;
                Symbol.InitSymbol(data);
                listSymbok.push(Symbol);

                Symbol.col = col;
                Symbol.row = 0;
                GameManager.instance.symBolArray[col][0] = Symbol;
            });
        } else {
            // Vertical reel: drop down, fill from top
            let space = 0;
            let max = 8;

            for (let i = max; i >= 4; i--) {
                let s = this.symbols.find(e => e.reelIndex == i);
                if (s == undefined || s == null) {
                    space++;
                } else {
                    if (space > 0) {
                        s.reelIndex += space;
                        listSymbok.push(s);
                        s.row += space;
                        GameManager.instance.symBolArray[s.col][s.row] = s;
                    }
                }
            }

            for (let i = space - 1; i >= 0; i--) {
                let Symbol = this.createNewSymbol();
                this.symbols.push(Symbol);
                Symbol.reelIndex = 4 + i;
                Symbol.node.setPosition(this.getSymbolPosition(4 - (space - i)));
                Symbol.reel = this;
                Symbol.InitSymbol(dataAbove[i]);
                listSymbok.push(Symbol);

                Symbol.col = this.possitionReel - 1;
                Symbol.row = space - i;
                GameManager.instance.symBolArray[Symbol.col][Symbol.row] = Symbol;
            }
        }

        listSymbok.forEach((e, i) => {
            this.scheduleOnce(() => {
                e.DropToindex(0.1);
            }, 0.05 * i);
        });
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