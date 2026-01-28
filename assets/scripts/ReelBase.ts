import { _decorator, Component, UITransform, Vec3, Tween, tween } from 'cc';
import { Symbol } from './Symbol';
const { ccclass } = _decorator;

@ccclass('ReelBase')
export abstract class ReelBase extends Component {

    protected symbolPadding = 1.5;
    public symbols: Symbol[] = [];

    protected cellSize = 0;
    protected totalSize = 0;
    protected halfSize = 0;

    protected _isStartingRoll = false;
    protected _delay = 0.05;
    isRolling = false;

    onLoad() {
        this.collectSymbols();
        this.rearrangeSymbols();
        this.scheduleOnce(() => {
            this.startRoll()
            this.scheduleOnce(() => {
                this.stopRoll()
            }, 1)
        }, 0.1 * this.node.getSiblingIndex())



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
                        s.ResetSymbol()
                    }

                    if (this._isStartingRoll) {
                        this._delay = 0.8;
                        s.rollToIndex(0.8);
                    } else {
                        this._delay = 0.05;
                        s.rollToIndex(0.05);
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

    stopRoll(typeAndFaces: any = null, typeAndFacesAbove: any = null) {
        Tween.stopAllByTarget(this.node);
        this.isRolling = false;

        // gán kết quả server
        if (typeAndFaces) {
            for (let i = 0; i < typeAndFaces.length; i++) {
                const symbol = this.symbols.find(s => s.reelIndex === i + 3);
                if (symbol && typeAndFaces[i]) {
                    symbol.type = typeAndFaces[i].type;
                    symbol.face = typeAndFaces[i].face;
                    symbol.refreshVisual();
                }
            }
        }

        if (typeAndFacesAbove) {
            for (let i = 0; i < typeAndFacesAbove.length; i++) {
                const symbol = this.symbols.find(s => s.reelIndex === 2 - i);
                if (symbol && typeAndFacesAbove[i]) {
                    symbol.type = typeAndFacesAbove[i].type;
                    symbol.face = typeAndFacesAbove[i].face;
                    symbol.refreshVisual();
                }
            }
        }

        // snap + tween về vị trí cuối
        for (let i = 0; i < this.symbols.length; i++) {
            const s = this.symbols[i];
            s.reelIndex += 1;
            if (s.reelIndex === this.symbols.length) {
                s.reelIndex = 0;
                s.node.position = this.getSymbolPosition(-1);
            }
            // s.rollToIndex(0.25, Symbol.MoveType.STOP);
        }

        // delay đúng bằng thời gian STOP rồi mới bật bounce
        for (let s of this.symbols) {
            s.exploAnim?.();
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
