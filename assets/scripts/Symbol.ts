import { _decorator, Component, Tween, tween, UITransform, Sprite, Enum, Node, Vec2, SpriteFrame, Vec3, randomRangeInt, sp, size, Layers } from 'cc';
import { ReelBase } from './ReelBase';
import { PrefabManager } from './Manager/PrefabManager';
import { ListDataSymbol } from './data/ListDataSymbol';
import { dataSymbol } from './data/dataSymbol';
import { ESymbolFace } from './ESymbolFace';
import { GameManager } from './Manager/GameManager';
import { SymbolCell } from './SymbolCell';

const { ccclass, property, executeInEditMode } = _decorator;

export enum SymbolFrameState {
    NORMAL = 0,   // bình thường
    SCRATCH = 1,  // scatter frame
    SILVER = 2,   // mega bạc
    GOLD = 3,     // mega vàng
    WILD = 4      // biến thành wild
}
export enum StateSymbol {
    IDLE = 0,
    MOVE = 1,
    ACTION = 2,
    ACTION_IDLE = 3,
    UPDATE = 4,
    WIN = 5
}


@ccclass('Symbol')
@executeInEditMode(true)
export class Symbol extends Component {

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

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    reel: ReelBase = null;
    @property(Number)
    reelIndex: number = 0;

    // Mega stack
    stackId: number = -1;
    stackSize: number = 1;     // 1..4
    stackIndex: number = 0;    // 0 = root, >0 = cell phụ
    dataSymbols: dataSymbol = null
    uiTransform: UITransform = null;

    col = 0
    row = 0
    layer = 0
    get isRoot(): boolean {
        return this.stackIndex === 0;
    }



    public getNameIdle() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                console.log(this.stackSize, "WILD")
                if (this.stackSize == 1) {
                    name = "icon_Wild1_idle"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_idle"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_idle"
                }
                break;
            case ESymbolFace.SCRATCH:
                console.log(this.stackSize, "SCRATCH")

                if (this.stackSize == 1) {
                    name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    name = "Icon_Scatter_big_idle"
                }
                break
            default:

                break


        }

        return name
    }


    public getNameWin() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_broken_action"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_broken_action"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_broken_action"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    // name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    // name = "Icon_Scatter_big_idle"
                }
                break
            default:
                if (this.stackSize == 1) {
                    name = "icon_size1_action"
                }
                if (this.stackSize == 2) {
                    name = "icon_size2_action"
                }
                if (this.stackSize == 3) {
                    name = "icon_size3_action"
                }
                break


        }

        return name
    }

    public getNameMove() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_move"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_move"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_move"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    name = "Icon_Scatter_big_idle"
                }
                break
            default:

                break


        }

        return name
    }

    public getNameAction() {
        let name = ""
        switch (this.face) {
            case ESymbolFace.WILD:
                if (this.stackSize == 1) {
                    name = "icon_Wild1_move"
                }
                if (this.stackSize == 2) {
                    name = "icon_Wild2_move"
                }
                if (this.stackSize == 3) {
                    name = "icon_Wild3_move"
                }
                break;
            case ESymbolFace.SCRATCH:
                if (this.stackSize == 1) {
                    name = "Icon_Scatter_small_idle"
                }
                if (this.stackSize == 2) {
                    name = "Icon_Scatter_big_idle"
                }
                break
            default:

                break


        }

        return name
    }

    protected start(): void {
        this.layer = this.spine.node.layer
        // this.ResetSymbol()
    }

    rollToIndex(time: number = 0.2) {
        // Chỉ root mới tween
        if (!this.reel) return;
        this.fxMove()
        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);
        return tween(this.node)
            .to(time, { position: newPosition })
            .start();
    }

    DropToindex(time: number = 0.2) {
        if (!this.reel) return;

        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);
        return tween(this.node)
            .to(time, { position: newPosition })
            .call(() => {
                this.exploAnim(20)
            })
            .start();
    }

    refreshVisual() {
        if (!this.isRoot || !this.reel) return;
        this.dataSymbols = PrefabManager.instance.GetDataSymbol().getDataByType(this.face)
        if (this.dataSymbols == null) return
        this.iconSymbol.node.setScale(1, 1)

        if (this.stackSize == 1) {
            this.iconSymbol.spriteFrame = this.dataSymbols.icon
        }
        else {
            this.iconSymbol.spriteFrame = this.dataSymbols.iconV2
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
        this.frameState = SymbolFrameState.NORMAL;
        this.refreshVisual();
    }

    ResetSymbol() {
        this.stackId = -1;
        this.stackSize = 1;
        this.stackIndex = 0;
        this.setRandomFace()
        this.UpdateUI()
    }

    UpdatePositionIcon() {
        let ui = this.bg.node.getComponent(UITransform).contentSize
        switch (this.face) {
            case ESymbolFace.ACE:
            case ESymbolFace.TEN:
            case ESymbolFace.JACK:
            case ESymbolFace.QUEEN:
            case ESymbolFace.KING:
                if (this.reel.isHorizontal() == false)
                    this.iconSymbol.node.setPosition(0, -ui.height / 2 + 50, 0)
                break;
            case ESymbolFace.SCRATCH:
                this.iconSymbol.enabled = false
                this.bg.enabled = false
                this.frame.enabled = false
                break;
            case ESymbolFace.WILD:
                this.iconSymbol.enabled = false
                this.bg.enabled = false
                this.frame.enabled = false
                break;
            default:
                if (this.reel.isHorizontal() == false)
                    this.iconSymbol.node.setPosition(0, -ui.height / 2 + 50, 0)
        }
    }

    UpdateBg() {
        if (this.dataSymbols == null) return
        if (this.stackIndex == 0) {
            this.iconSymbol.enabled = true
            this.bg.enabled = true
            this.bg.node.setScale(1, 1, 1)
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

        if (this.reel.isHorizontal() == true) return
        let height = 103 * (this.stackSize)
        this.bg.getComponent(UITransform).setContentSize(124, height)
        this.bg.node.setPosition(0, -height / 2 + 103 / 2)
    }
    exploAnim(bounce = 10) {
        if (!this.isRoot || !this.reel) return;

        const node = this.node;
        Tween.stopAllByTarget(node);

        const basePos = this.reel.getSymbolPosition(this.reelIndex);
        const isHorizontal = this.reel.isHorizontal();

        const upPos = isHorizontal
            ? basePos.clone().add3f(bounce, 0, 0)
            : basePos.clone().add3f(0, bounce, 0);

        tween(node)
            // đảm bảo đang ở đúng vị trí trước khi nảy
            .set({ position: basePos })

            // nảy lên
            .to(0.08, { position: upPos }, { easing: 'sineOut' })

            // về lại đúng basePos tuyệt đối
            .to(0.08, { position: basePos }, { easing: 'sineIn' })

            .call(() => {
                this.spine.node.layer = this.layer;
            })
            .start();
    }



    UpdateFrame() {
        let height = 103 * (this.stackSize)
        this.frame.getComponent(UITransform).setContentSize(124, height)
        this.frame.node.setPosition(0, -height / 2 + 103 / 2)
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

    UpdateSpines() {
        let ui = this.node.getComponent(UITransform).contentSize
        this.spine.node.setPosition(0, -ui.height * this.stackSize / 2 + 50, 0)

    }

    InitSymbol(data: SymbolCell) {
        this.face = data.i
        this.frameState = data.f
        this.stackSize = data.ms
        this.stackIndex = data.mi
        this.stackId = data.sid
        console.log("den day ", data)
        this.UpdateUI()
    }


    UpdateUI() {
        this.refreshVisual();
        this.UpdateBg()
        this.UpdatePositionIcon()
        this.UpdateFrame()
        this.UpdateSpines()

        if (this.stackIndex > 0) {
            this.iconSymbol.enabled = false
            this.bg.enabled = false
            this.frame.enabled = false
            this.EnabledAniamtion(false)
        }
    }

    fxMove() {
        this.UpdateUIMove()
    }

    UpdateUIMove() {
        this.spine.node.layer = Layers.Enum.UI_2D

        switch (this.face) {
            case ESymbolFace.SCRATCH:
            case ESymbolFace.WILD:
                this.playAnimation(this.getNameMove(), true)
                break;
            default:
                if (this.reel.isHorizontal() == true) return
                this.bg.node.setScale(1.1, 1.1)
                this.iconSymbol.node.setPosition(0, -103 / 2 + 50, 0)
                this.iconSymbol.node.setScale(1.2, 1.2)
                let height = 103 * (this.stackSize)
                this.bg.getComponent(UITransform).setContentSize(124, height)
                this.bg.node.setPosition(0, -height / 2 + 103 / 2)
                if (this.stackSize == 1) {
                    this.bg.spriteFrame = this.dataSymbols.bg1x1_move
                }
                if (this.stackSize == 2) {
                    this.bg.spriteFrame = this.dataSymbols.bg1x2_move

                }
                if (this.stackSize == 3) {
                    this.bg.spriteFrame = this.dataSymbols.bg1x3_move
                }

                if (this.stackSize == 4) {
                    this.bg.spriteFrame = this.dataSymbols.bg1x4_move
                }

                if (this.stackSize == 1) {
                    this.iconSymbol.spriteFrame = this.dataSymbols.icon_move
                }
                else {
                    this.iconSymbol.spriteFrame = this.dataSymbols.iconV2_move
                }

                break;
        }
    }

    fxIdle() {
        this.playAnimation(this.getNameIdle(), true)
        this.UpdateUI()
        // Lấy index từ bitmask
    }

    playAnimation(name, loop) {
        if (name != "") {
            this.EnabledAniamtion(true)

            this.spine.setAnimation(0, name, loop)
        }
        else {
            this.EnabledAniamtion(false)

        }
    }

    EnabledAniamtion(isEnabled) {
        if (this.stackIndex == 0) {
            this.spine.enabled = isEnabled
        }
        else {
            this.spine.enabled = false

        }
    }

    Dispose() {
        this.playAnimation(this.getNameWin(), false)
        this.scheduleOnce(() => {
            this.node.destroy()
        }, 1.2)
    }

    HideAll() {
        this.EnabledAniamtion(false)
        this.iconSymbol.enabled = false
        this.bg.enabled = false
        this.frame.enabled = false
    }
    FlipSymbol(data) {
        let name = ""
        if (this.stackSize == 1) {
            name = "icon_size1_action_upgrade"
        }
        if (this.stackSize == 2) {
            name = "icon_size2_action_upgrade"
        }
        if (this.stackSize == 3) {
            name = "icon_size3_action_upgrade"
        }
        // this.HideAll()
        this.playAnimation(name, false)
        this.scheduleOnce(() => {
            this.InitSymbol(data)
            this.fxIdle()
        }, 1.5)
    }
}
