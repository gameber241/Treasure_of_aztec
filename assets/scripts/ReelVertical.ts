import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelVertical')
export class ReelVertical extends ReelBase {

    protected getCellSize(ui: UITransform): number {
        return ui.contentSize.height;
    }

    protected computeHalfSize() {
        // tâm của cell đầu tiên trong reel
        this.halfSize = this.totalSize / 2 - this.cellSize / 2;
    }

    protected getSymbolPosition(i: number) {
        // index 0 ở trên cùng, rơi xuống dưới
        return v3(0, this.halfSize - i * this.cellSize, 0);
    }


    protected sortSibling() {
        this.symbols.sort((a, b) => b.node.position.y - a.node.position.y);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }
}
