import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelVertical')
export class ReelVertical extends ReelBase {

    public VISIBLE_COUNT = 5;
    public FIRST_VISIBLE = 2;

    public getCellSize(ui: UITransform): number {
        return ui.contentSize.height;
    }

    public computeHalfSize() {
        this.halfSize = this.totalSize / 2 - this.cellSize / 2;
    }

    public getSymbolPosition(i: number) {
        return v3(
            0,
            this.halfSize - i * this.cellSize - this.cellSize * 0.5,
            0
        );
    }

    public sortSibling() {
        this.symbols.sort((a, b) => b.node.position.y - a.node.position.y);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }
}
