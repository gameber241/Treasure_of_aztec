import { _decorator, Component, UITransform, Vec3, Tween, tween } from 'cc';
import { Symbol } from './Symbol';
const { ccclass } = _decorator;

@ccclass('ReelBase')
export abstract class ReelBase extends Component {

    protected symbolPadding = 3;
    protected symbols: Symbol[] = [];

    protected cellSize = 0;
    protected totalSize = 0;
    protected halfSize = 0;

    protected _isStartingRoll = false;
    protected _delay = 0.05;
    isRolling = false;

    onLoad() {
        this.collectSymbols();
        this.rearrangeSymbols();

        this.startRoll()

        this.scheduleOnce(()=>{
            this.stopRoll()
        }, 3)
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

        if (this.symbols.length === 0) return;

        const ui = this.symbols[0].node.getComponent(UITransform);
        this.cellSize = this.getCellSize(ui) + this.symbolPadding;
        this.totalSize = this.cellSize * this.symbols.length;

        this.computeHalfSize(); // giao cho class con
    }

    protected abstract computeHalfSize(): void;

    protected rearrangeSymbols() {
        for (let s of this.symbols) {
            s.node.position = this.getSymbolPosition(s.reelIndex);
        }
    }

    startRoll() {
        this._isStartingRoll = true;
        this.isRolling = true;

        tween(this.node)
            .call(() => {
                if (!this.isRolling) return;

                for (let s of this.symbols) {
                    s.reelIndex++;
                    if (s.reelIndex >= this.symbols.length) {
                        s.reelIndex = 0;
                        s.node.position = this.getSymbolPosition(-1);
                    }

                    if (this._isStartingRoll) {
                        this._delay = 0.8;
                        s.rollToIndex(0.8, Symbol.MoveType.START);
                    } else {
                        this._delay = 0.05;
                        s.rollToIndex(0.05, Symbol.MoveType.MOVING);
                    }
                }
            })
            .delay(this._delay)
            .call(() => {
                this._isStartingRoll = false;
                this.sortSibling();
            })
            .union()
            .repeatForever()
            .start();
    }

    stopRoll() {
        Tween.stopAllByTarget(this.node);
        this.isRolling = false;

        for (let s of this.symbols) {
            s.reelIndex++;
            if (s.reelIndex >= this.symbols.length) {
                s.reelIndex = 0;
                s.node.position = this.getSymbolPosition(-1);
            }
            s.rollToIndex(0.4, Symbol.MoveType.STOP);
        }
    }

    public getCellSizeValue() {
        return this.cellSize;
    }

    public getPositionByIndex(index: number): Vec3 {
        return this.getSymbolPosition(index);
    }

    public isHorizontal(): boolean { return false; }

    protected abstract getCellSize(ui: UITransform): number;
    protected abstract getSymbolPosition(index: number): Vec3;
    protected abstract sortSibling(): void;
}
