import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelHorizontal')
export class ReelHorizontal extends ReelBase {
    protected getCellSize(ui: UITransform): number {
        return ui.contentSize.width;
    }

    protected computeHalfSize() {
        // tâm của cell, không phải tâm toàn dải
        this.halfSize = (this.totalSize - this.cellSize) / 2;
    }

    protected getSymbolPosition(i: number) {
        return v3(-i * this.cellSize + this.halfSize, 0, 0);
    }

    protected sortSibling() {
        this.symbols.sort((a, b) => a.node.position.x - b.node.position.x);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }

    public override isHorizontal(): boolean { return true; }
}
