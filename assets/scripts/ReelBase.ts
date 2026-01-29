import { _decorator, Component, UITransform, Vec3, Tween, tween, instantiate } from 'cc';
import { Symbol } from './Symbol';
import { PrefabManager } from './Manager/PrefabManager';
const { ccclass, property } = _decorator;

@ccclass('ReelBase')
export abstract class ReelBase extends Component {

    protected symbolPadding = 1.5;
    public symbols: Symbol[] = [];

    protected cellSize = 0;
    protected totalSize = 0;
    protected halfSize = 0;

    protected _delay = 0.05;
    protected _isStopping = false;
    protected _remainSteps = 0;

    isRolling = false;

    @property(Number)
    numberSymbols: number = 9; // dọc = 9, ngang = 8

    protected abstract VISIBLE_COUNT: number;
    protected abstract FIRST_VISIBLE: number;

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

        tween(this.node)
            .call(() => {
                if (!this.isRolling) return;

                for (let s of this.symbols) {
                    s.reelIndex++;

                    if (s.reelIndex >= this.symbols.length) {
                        s.reelIndex = 0;
                        s.node.position = this.getSymbolPosition(-1);

                        if (!this._isStopping) {
                            s.ResetSymbol(); // random khi chưa vào pha dừng
                        }
                    }

                    s.rollToIndex(this._isStopping ? 0.08 : 0.05);
                }

                // đếm bước rơi kết quả
                if (this._isStopping) {
                    this._remainSteps--;
                    if (this._remainSteps <= 0) {
                        this.isRolling = false;
                        Tween.stopAllByTarget(this.node);
                        this.sortSibling();
                    }
                }
            })
            .delay(this._delay)
            .union()
            .repeatForever()
            .start();
    }

    // ================= CHUẨN BỊ DỪNG KIỂU GAME GỐC =================
    stopRoll(result: any[]) {
        const total = this.symbols.length;
        const visible = this.VISIBLE_COUNT;
        const firstVisible = this.FIRST_VISIBLE;

        // Đặt kết quả vào đúng reelIndex sẽ rơi vào khung sau visible bước
        for (let i = 0; i < visible; i++) {
            const targetIndex = firstVisible + i;          // index sẽ nằm trong khung
            let placeIndex = targetIndex - visible;       // vị trí hiện tại cần đặt
            if (placeIndex < 0) placeIndex += total;      // wrap vòng

            const s = this.symbols.find(sym => sym.reelIndex === placeIndex);
            const e = result[i];
            if (s && e) {
                console.log(s, e)
                s.InitSymbol(e.i, e.t, e.f, e.ms, e.mi, e.sid);
            }
        }

        this._isStopping = true;
        this._remainSteps = visible; // chạy thêm đúng số ô hiển thị
    }

    public isHorizontal(): boolean { return false; }

    public abstract getCellSize(ui: UITransform): number;
    public abstract computeHalfSize(): void;
    public abstract getSymbolPosition(index: number): Vec3;
    public abstract sortSibling(): void;
}
