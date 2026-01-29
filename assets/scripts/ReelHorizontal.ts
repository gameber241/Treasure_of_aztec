import { _decorator, UITransform, v3 } from 'cc';
import { ReelBase } from './ReelBase';
const { ccclass } = _decorator;

@ccclass('ReelHorizontal')
export class ReelHorizontal extends ReelBase {

    public VISIBLE_COUNT = 4;
    public FIRST_VISIBLE = 2;

    public getCellSize(ui: UITransform): number {
        return ui.contentSize.width;
    }

    public computeHalfSize() {
        const ui = this.node.getComponent(UITransform);
        this.halfSize = ui.contentSize.width * 0.5 - this.cellSize * 0.5;
    }

    public getSymbolPosition(i: number) {
        return v3(this.halfSize - i * this.cellSize, 0, 0);
    }

    public sortSibling() {
        this.symbols.sort((a, b) => a.node.position.x - b.node.position.x);
        this.symbols.forEach((s, i) => s.node.setSiblingIndex(i));
    }

    public override isHorizontal(): boolean { return true; }
}
