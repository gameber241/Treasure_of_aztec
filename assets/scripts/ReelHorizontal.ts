import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelHorizontal')
export class ReelHorizontal extends ReelBase {

    public VISIBLE_COUNT = 4;

    // nếu total = 9 và visible = 4
    // thì FIRST_VISIBLE nên là 2 hoặc 3 (tùy layout)
    public FIRST_VISIBLE = 4;

    public getCellSize(ui: UITransform): number {
        return ui.contentSize.width;
    }

    public computeHalfSize() {
        // phải dùng totalSize
        this.halfSize = this.totalSize * 0.5;
    }

    public getSymbolPosition(i: number) {
        return v3(
            this.halfSize - (i + 0.5) * this.cellSize,
            0,
            0
        );
    }

    public sortSibling() {
        this.symbols.sort((a, b) => b.node.position.x - a.node.position.x);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }

    public override isHorizontal(): boolean { return true; }
}
