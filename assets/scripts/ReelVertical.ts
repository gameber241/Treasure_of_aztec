import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelVertical')
export class ReelVertical extends ReelBase {

    protected getCellSize(ui: UITransform): number {
        return ui.contentSize.height;
    }

    protected computeHalfSize() {
        this.halfSize = this.totalSize / 2;
    }

    protected getSymbolPosition(i: number) {
        return v3(0, -i * this.cellSize + this.halfSize + 50,  0) ;
    }

    protected sortSibling() {
        this.symbols.sort((a, b) => b.node.position.y - a.node.position.y);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }
}
