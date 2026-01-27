import { _decorator, Component, Tween, tween, UITransform, Sprite, Enum, Node } from 'cc';
import { ReelBase } from './ReelBase';
import { PrefabManager } from './Manager/PrefabManager';
import { ListDataSymbol } from './data/ListDataSymbol';

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

    @property({ type: Sprite })
    icon: Sprite = null;     // thay skeleton bằng sprite

    reel: ReelBase = null;
    reelIndex: number = 0;

    // Mega stack
    stackId: number = -1;
    stackSize: number = 1;     // 1..4
    stackIndex: number = 0;    // 0 = root, >0 = cell phụ

    uiTransform: UITransform = null;

    get isRoot(): boolean {
        return this.stackIndex === 0;
    }

    protected onLoad(): void {
        this.icon = this.node.getComponent(Sprite)

        // this.refreshVisual();
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
        this.icon.spriteFrame = PrefabManager.instance.GetDataSymbol().getIconByType(this.face)

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

    }
}
