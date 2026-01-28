import { _decorator, Component, Tween, tween, UITransform, Sprite, Enum, Node, Vec2, SpriteFrame, Vec3 } from 'cc';
import { ReelBase } from './ReelBase';
import { PrefabManager } from './Manager/PrefabManager';
import { ListDataSymbol } from './data/ListDataSymbol';
import { dataSymbol } from './data/dataSymbol';

const { ccclass, property, executeInEditMode } = _decorator;

export enum SymbolTileType {
    NORMAL = 'NORMAL',
    WILD = 'WILD',
    SCATTER = 'SCATTER'
};

export enum SymbolFrameState {
    NORMAL = 'NORMAL',
    SCRATCH = 'SCRATCH',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    WILD = 'WILD'
}

export enum SymbolFace {
    MASK_RED = 'MASK_RED',
    STONE_WHEEL = 'STONE_WHEEL',
    GREEN_IDOL = 'GREEN_IDOL',
    PURPLE_SERPENT = 'PURPLE_SERPENT',
    GOLDEN_IDOL = 'GOLDEN_IDOL',
    JAGUAR_PINK = 'JAGUAR_PINK',
    TEN = 'TEN',
    ACE = 'ACE',
    JACK = 'JACK',
    KING = 'KING',
    QUEEN = 'QUEEN',
    WILD = "WILD",
    SCRATCH = "SCRATCH"
}

@ccclass('Symbol')
@executeInEditMode(true)
export class Symbol extends Component {

    @property({ type: Enum(SymbolTileType) })
    type: SymbolTileType = SymbolTileType.NORMAL;

    @property({ type: Enum(SymbolFace) })
    face: SymbolFace = SymbolFace.TEN;

    @property({ type: Enum(SymbolFrameState) })
    frameState: SymbolFrameState = SymbolFrameState.NORMAL;

    @property(Sprite)
    iconSymbol: Sprite = null;

    @property({ type: Sprite })
    bg: Sprite = null


    reel: ReelBase = null;
    reelIndex: number = 0;

    // Mega stack
    stackId: number = -1;
    stackSize: number = 1;     // 1..4
    stackIndex: number = 0;    // 0 = root, >0 = cell phụ
    dataSymbols: dataSymbol = null
    uiTransform: UITransform = null;

    get isRoot(): boolean {
        return this.stackIndex === 0;
    }

    protected onLoad(): void {
        // this.ResetSymbol()
    }
    protected start(): void {
        this.ResetSymbol()
    }

    rollToIndex(time: number = 0.2) {
        // Chỉ root mới tween
        if (!this.isRoot || !this.reel) return;

        const newPosition = this.reel.getPositionByIndex(this.reelIndex);
        Tween.stopAllByTarget(this.node);

        return tween(this.node)
            .to(time, { position: newPosition })
            .start();
    }

    refreshVisual() {
        if (!this.isRoot || !this.reel) return;

        // TODO: ở đây map face -> spriteFrame (bạn gán trong editor hoặc atlas)

        this.dataSymbols = PrefabManager.instance.GetDataSymbol().getDataByType(this.face)

        this.iconSymbol.spriteFrame = this.dataSymbols.icon
        // Kéo cao Mega Symbol
        if (this.stackSize > 1) {
            const cellSize = this.reel.getCellSizeValue();
            this.uiTransform.height = cellSize * this.stackSize;
        }
    }

    setRandomFace() {
        const faces = [
            SymbolFace.MASK_RED,
            SymbolFace.STONE_WHEEL,
            SymbolFace.GREEN_IDOL,
            SymbolFace.PURPLE_SERPENT,
            SymbolFace.GOLDEN_IDOL,
            SymbolFace.JAGUAR_PINK,
            SymbolFace.TEN,
            SymbolFace.ACE,
            SymbolFace.JACK,
            SymbolFace.QUEEN,
            SymbolFace.KING
        ];
        this.face = faces[Math.floor(Math.random() * faces.length)];
        this.type = SymbolTileType.NORMAL;
        this.frameState = SymbolFrameState.NORMAL;
        this.refreshVisual();
    }

    /** Wilds-on-the-Way */
    advanceFrameState() {
        if (this.type === SymbolTileType.SCATTER) return;

        switch (this.frameState) {
            case SymbolFrameState.NORMAL:
                this.frameState = SymbolFrameState.SCRATCH;
                break;
            case SymbolFrameState.SCRATCH:
                this.frameState = SymbolFrameState.SILVER;
                this.setRandomFace();
                break;
            case SymbolFrameState.SILVER:
                this.frameState = SymbolFrameState.GOLD;
                break;
            case SymbolFrameState.GOLD:
                this.frameState = SymbolFrameState.WILD;
                this.type = SymbolTileType.WILD;
                break;
        }

        this.refreshVisual();
    }


    ResetSymbol() {
        this.stackId = -1;
        this.stackSize = 1;
        this.stackIndex = 0;
        this.setRandomFace()
        this.UpdatePositionIcon()
        this.UpdateBg()
    }

    UpdatePositionIcon() {
        let ui = this.bg.node.getComponent(UITransform).contentSize
        switch (this.face) {
            case SymbolFace.ACE:
            case SymbolFace.TEN:
            case SymbolFace.JACK:
            case SymbolFace.QUEEN:
            case SymbolFace.KING:
                this.iconSymbol.node.setPosition(0, - ui.height / 2 - 5, 0)
                break;
            default:
                this.iconSymbol.node.setPosition(0, - ui.height / 2, 0)
        }
    }

    UpdateBg() {
        if (this.stackIndex == 0) {
            this.iconSymbol.enabled = true
            this.bg.enabled = true

            switch (this.stackSize) {
                case 1:
                    if (this.dataSymbols.bg1x1)
                        this.bg.spriteFrame = this.dataSymbols.bg1x1
                    break
                case 2:
                    if (this.dataSymbols.bg1x2)
                        this.bg.spriteFrame = this.dataSymbols.bg1x2
                    break
                case 3:
                    if (this.dataSymbols.bg1x3)
                        this.bg.spriteFrame = this.dataSymbols.bg1x3
                    break
                case 4:
                    if (this.dataSymbols.bg1x4)
                        this.bg.spriteFrame = this.dataSymbols.bg1x4
                    break
            }
        }
        else {
            this.iconSymbol.enabled = false
            this.bg.enabled = false
        }
    }
    exploAnim() {
        if (!this.isRoot || !this.reel) return;

        const node = this.node;
        Tween.stopAllByTarget(node);

        const basePos = this.reel.getPositionByIndex(this.reelIndex);

        const bounce = 10; // độ nảy
        const isHorizontal = this.reel.isHorizontal();

        const up = isHorizontal
            ? new Vec3(bounce, 0, 0)   // reel ngang: nảy theo X
            : new Vec3(0, bounce, 0);  // reel dọc: nảy theo Y

        const down = isHorizontal
            ? new Vec3(-bounce, 0, 0)
            : new Vec3(0, -bounce, 0);

        tween(node)
            // rơi / trượt về vị trí chuẩn
            .to(0.18, { position: basePos }, { easing: 'cubicOut' })
            // bật nhẹ
            .by(0.08, { position: up }, { easing: 'sineOut' })
            // trở lại
            .by(0.08, { position: down }, { easing: 'sineIn' })
            .start();
    }

}
