import { _decorator, Component, Tween, tween, UITransform, Sprite, Enum, Node, Vec2, SpriteFrame, Vec3, randomRangeInt } from 'cc';
import { ReelBase } from './ReelBase';
import { PrefabManager } from './Manager/PrefabManager';
import { ListDataSymbol } from './data/ListDataSymbol';
import { dataSymbol } from './data/dataSymbol';
import { ESymbolFace } from './ESymbolFace';

const { ccclass, property, executeInEditMode } = _decorator;

export enum SymbolTileType {
    NORMAL = 0,
    WILD = 1,
    SCATTER = 2
}


export enum SymbolFrameState {
    NORMAL = 0,   // bình thường
    SCRATCH = 1,  // scatter frame
    SILVER = 2,   // mega bạc
    GOLD = 3,     // mega vàng
    WILD = 4      // biến thành wild
}



@ccclass('Symbol')
@executeInEditMode(true)
export class Symbol extends Component {

    @property({ type: Enum(SymbolTileType) })
    type: SymbolTileType = SymbolTileType.NORMAL;

    @property({ type: Enum(ESymbolFace) })
    face: ESymbolFace = ESymbolFace.TEN;

    @property({ type: Enum(SymbolFrameState) })
    frameState: SymbolFrameState = SymbolFrameState.NORMAL;

    @property(Sprite)
    iconSymbol: Sprite = null;

    @property({ type: Sprite })
    bg: Sprite = null


    @property({ type: Sprite })
    frame: Sprite = null


    @property(SpriteFrame)
    frames: SpriteFrame[] = []
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

    protected start(): void {
        this.ResetSymbol()
    }

    rollToIndex(time: number = 0.2) {
        // Chỉ root mới tween
        if (!this.reel) return;

        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);

        return tween(this.node)
            .to(time, { position: newPosition })
            .start();
    }

    refreshVisual() {
        if (!this.isRoot || !this.reel) return;
        this.dataSymbols = PrefabManager.instance.GetDataSymbol().getDataByType(this.face)
        console.log(this.dataSymbols, this.face)
        this.iconSymbol.spriteFrame = this.dataSymbols.icon
        // Kéo cao Mega Symbol
        if (this.stackSize > 1) {
            // const cellSize = this.reel.getCellSize();
            // this.uiTransform.height = cellSize * this.stackSize;
        }
    }

    setRandomFace() {
        const faces = [
            ESymbolFace.MASK_RED,
            ESymbolFace.STONE_WHEEL,
            ESymbolFace.GREEN_IDOL,
            ESymbolFace.PURPLE_SERPENT,
            ESymbolFace.GOLDEN_IDOL,
            ESymbolFace.JAGUAR_PINK,
            ESymbolFace.TEN,
            ESymbolFace.ACE,
            ESymbolFace.JACK,
            ESymbolFace.QUEEN,
            ESymbolFace.KING
        ];
        this.face = faces[Math.floor(Math.random() * faces.length)];
        this.type = SymbolTileType.NORMAL;
        this.frameState = SymbolFrameState.NORMAL;
        this.refreshVisual();
    }

    ResetSymbol() {
        this.stackId = -1;
        this.stackSize = 1;
        this.stackIndex = 0;
        this.refreshVisual();
        this.setRandomFace()
        this.UpdatePositionIcon()
        this.UpdateBg()
        this.UpdateFrame()
    }

    UpdatePositionIcon() {
        let ui = this.bg.node.getComponent(UITransform).contentSize
        switch (this.face) {
            case ESymbolFace.ACE:
            case ESymbolFace.TEN:
            case ESymbolFace.JACK:
            case ESymbolFace.QUEEN:
            case ESymbolFace.KING:
                this.iconSymbol.node.setPosition(0, -50, 0)
                break;
            default:
                this.iconSymbol.node.setPosition(0, -50, 0)
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

        const basePos = this.reel.getSymbolPosition(this.reelIndex);

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



    UpdateFrame() {
        switch (this.frameState) {
            case SymbolFrameState.NORMAL:
                this.frame.enabled = false
                break
            case SymbolFrameState.GOLD:
                this.frame.enabled = true
                this.frame.spriteFrame = this.frames[1]
                break;
            case SymbolFrameState.SILVER:
                this.frame.enabled = true
                this.frame.spriteFrame = this.frames[0]
                break;
            case SymbolFrameState.SCRATCH:
                this.frame.enabled = false
                break;
            case SymbolFrameState.WILD:
                this.frame.enabled = false

                break;
        }
    }

    InitSymbol(face: ESymbolFace, type: SymbolTileType, frame: SymbolFrameState, stackSize, stackIndex, stackId) {
        console.log(face)
        this.face = face
        this.type = type
        this.frameState = frame
        this.stackSize = stackSize
        this.stackIndex = stackIndex
        this.stackId = stackId
        this.refreshVisual();
        this.UpdatePositionIcon()
        this.UpdateBg()
        this.UpdateFrame()
    }
}
