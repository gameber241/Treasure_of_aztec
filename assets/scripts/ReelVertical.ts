import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelVertical')
export class ReelVertical extends ReelBase {

    public VISIBLE_COUNT = 5;
    public FIRST_VISIBLE = 4

    public getCellSize(ui: UITransform): number {
        return ui.contentSize.height;
    }

    public computeHalfSize() {
        this.halfSize = this.totalSize * 0.5;
    }


    public getSymbolPosition(i: number) {
        return v3(
            0,
            this.halfSize - (i + 0.5) * this.cellSize - 1,
            0
        );
    }

    public sortSibling() {
        this.symbols.sort((a, b) => a.node.position.y - b.node.position.y);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }
    public override isHorizontal(): boolean { return false; }

}
