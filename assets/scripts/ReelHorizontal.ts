import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelHorizontal')
export class ReelHorizontal extends ReelBase {
    protected getCellSize(ui: UITransform): number {
        return ui.contentSize.width;
    }

    protected computeHalfSize() {
        // tâm toàn dải reel
        this.halfSize = this.totalSize / 2 - this.cellSize / 2;
    }

    protected getSymbolPosition(i: number) {
        // index 0 ở bên phải, chạy sang trái
        console.log(v3(this.halfSize - i * this.cellSize, 0, 0), this.halfSize, this.cellSize)
        return v3(this.halfSize - i * this.cellSize, 0, 0);
    }


    protected sortSibling() {
        this.symbols.sort((a, b) => a.node.position.x - b.node.position.x);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }

    public override isHorizontal(): boolean { return true; }
}
