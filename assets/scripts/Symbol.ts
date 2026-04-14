import { _decorator, Component, Tween, tween, UITransform, Sprite, Enum, Node, Vec2, SpriteFrame, Vec3, randomRangeInt, sp, size, Layers, Widget, Color, Game, Label, Input, director, Layout, Size } from 'cc';
import { ReelBase } from './ReelBase';
import { PrefabManager } from './Manager/PrefabManager';
import { ListDataSymbol } from './data/ListDataSymbol';
import { dataSymbol } from './data/dataSymbol';
import { ESymbolFace, SymbolPayoutConfig } from './ESymbolFace';
import { GameManager } from './Manager/GameManager';
import { SymbolCell } from './SymbolCell';
import { SoundToggle } from './Sound';
import { SymbolFrameState } from './Enum/SymbolFrameState';
import { Spin } from './Spin';

const { ccclass, property, executeInEditMode } = _decorator;

export enum StateSymbol {
    IDLE = 0,
    MOVE = 1,
    ACTION = 2,
    ACTION_IDLE = 3,
    UPDATE = 4,
    WIN = 5
}



const SymbolAnim = {
    WILD: {
        idle: ["icon_Wild1_idle", "icon_Wild2_idle", "icon_Wild3_idle"],
        move: ["icon_Wild1_move", "icon_Wild2_move", "icon_Wild3_move"],
        action: ["icon_Wild1_appear", "icon_Wild2_appear", "icon_Wild3_appear"],
        win: ["icon_Wild1_broken_action", "icon_Wild2_broken_action", "icon_Wild3_broken_action"]
    },
    SCRATCH: {
        idle: ["Icon_Scatter_small_idle", "Icon_Scatter_big_idle"],
        move: ["Icon_Scatter_small_idle", "Icon_Scatter_big_idle"],
        action: ["Icon_Scatter_small_action", "Icon_Scatter_big_action"],
        win: ["", ""]
    },
    DEFAULT: {
        idle: ["icon_size1_idle", "icon_size2_idle", "icon_size3_idle"],
        move: ["icon_size1_move", "icon_size2_move", "icon_size3_move"],
        action: ["", "", ""],
        win: ["icon_size1_action", "icon_size2_action", "icon_size3_action"]
    },
    FRAME: {
        idle: ["icon_size1_idle", "icon_size2_idle", "icon_size3_idle"],
        move: ["icon_size1_move", "icon_size2_move", "icon_size3_move"],
    }
};

@ccclass('Symbol')
@executeInEditMode(true)

export class Symbol extends Component {

    @property({ type: Enum(ESymbolFace) })
    face: ESymbolFace = ESymbolFace.TEN;

    @property({ type: Enum(SymbolFrameState) })
    frameState: SymbolFrameState = SymbolFrameState.NORMAL;
    @property(sp.Skeleton) icon: sp.Skeleton = null!;
    @property(sp.Skeleton) frame: sp.Skeleton = null!;
    reel: ReelBase = null!;
    reelIndex = 0;

    stackId = -1; stackSize = 1; stackIndex = 0;
    col = 0; row = 0; layer = 0;
    isInit = false;

    get isRoot() { return this.stackIndex === 0; }

    @property(sp.Skeleton)
    fxSmoke: sp.Skeleton = null


    dataSymbols: dataSymbol = null
    uiTransform: UITransform = null;

    static MoveType = {
        'START': 'start',
        'STOP': 'stop',
        'MOVING': 'moving'
    } as const
    private SkinMap = {
        [ESymbolFace.ACE]: "Icon1",
        [ESymbolFace.KING]: "Icon2",
        [ESymbolFace.QUEEN]: "Icon3",
        [ESymbolFace.JACK]: "Icon4",
        [ESymbolFace.TEN]: "Icon5",
        [ESymbolFace.MASK_RED]: "Icon6",
        [ESymbolFace.JAGUAR_PINK]: "Icon7",
        [ESymbolFace.STONE_WHEEL]: "Icon8",
        [ESymbolFace.PURPLE_SERPENT]: "Icon9",
        [ESymbolFace.GREEN_IDOL]: "Icon10",
        [ESymbolFace.GOLDEN_IDOL]: "Icon11"
    };


    protected start() {
        this.layer = 64

        this.icon.node.layer = Layers.Enum.DEFAULT
        director.on("HIDE_INF", this.hideInf, this)
    }

    hideInf() {
        this.infNode.active = false
    }

    private getAnim(type: "idle" | "move" | "action" | "win"): string {

        const size = Math.max(0, this.stackSize - 1);

        let cfg = SymbolAnim.DEFAULT;
        if (this.face === ESymbolFace.WILD) cfg = SymbolAnim.WILD;
        if (this.face === ESymbolFace.SCRATCH) cfg = SymbolAnim.SCRATCH;

        return cfg[type]?.[size] ?? "";
    }

    getNameIdle() { return this.getAnim("idle"); }
    getNameMove() { return this.getAnim("move"); }
    getNameAction() { return this.getAnim("action"); }
    getNameWin() { return this.getAnim("win"); }

    SetSkin() {
        this.icon.setSkin(this.SkinMap[this.face] ?? "default");

    }

    EnabledAniamtion(enable: boolean) {
        this.icon.enabled = enable && this.isRoot;
    }

    playiconAnimation(name: string, loop: boolean) {
        this.SetSkin();
        this.EnabledAniamtion(true);
        this.icon.setAnimation(0, name, loop);

    }

    addAnimation(name: string, loop: boolean) {
        if (name) this.icon.addAnimation(0, name, loop);
    }

    playFrameAnimation(name: string, loop: boolean) {

        if (this.frameState == SymbolFrameState.SILVER) {
            this.frame.setSkin("Border_Silver")

        }

        if (this.frameState == SymbolFrameState.GOLD) {
            this.frame.setSkin("Border_Gold")

        }
        this.frame?.setAnimation(0, name, loop);

    }

    UpdateFrame() {
        if (this.stackIndex > 0) {
            this.frame.enabled = false
            return
        }

        if (this.frameState == SymbolFrameState.GOLD ||
            this.frameState == SymbolFrameState.SILVER) {
            this.frame.enabled = true
            this.frameInf.enabled = true
            this.playFrameAnimation(this.getNameIdle(), true);

        }
        else {
            this.frame.enabled = false
            this.frameInf.enabled = false

        }

    }

    SetUISymbolNormal() {
        this.UpdateFrame();
        this.playiconAnimation(this.getNameIdle(), true);
        this.playFrameAnimation(this.getNameIdle(), true)
        this.icon.node.setPosition(0, -102 * this.stackSize / 2 + 100 / 2, 0)
        this.frame.node.setPosition(0, -102 * this.stackSize / 2 + 100 / 2, 0)
        this.infNode.setPosition(0, -102 * this.stackSize / 2 + 100 / 2, 0)
        this.icon.getComponent(UITransform).setContentSize(100, 100 * this.stackSize)

    }

    SetUiMove() {
        const name = this.getNameMove();
        this.playiconAnimation(name, true);
        this.playFrameAnimation(name, true);
    }

    InitSymbol(data: SymbolCell) {

        this.isInit = true;
        this.face = data.i;
        this.frameState = data.f;
        this.stackSize = data.ms;
        this.stackIndex = data.mi;
        this.stackId = data.sid;

        this.SetUISymbolNormal();
        this.icon.node.off(Input.EventType.TOUCH_END, this.ShowInf, this)
        if (this.stackIndex == 0) {
            this.icon.node.on(Input.EventType.TOUCH_END, this.ShowInf, this)

        }
    }

    ResetSymbol() {
        this.stackId = -1;
        this.stackSize = 1;
        this.stackIndex = 0;
        this.setRandomFace();
        this.SetUISymbolNormal();

    }

    setRandomFace() {
        const faces = [
            ESymbolFace.MASK_RED,
            ESymbolFace.STONE_WHEEL,
            ESymbolFace.GREEN_IDOL,
            ESymbolFace.PURPLE_SERPENT,
            // ESymbolFace.GOLDEN_IDOL,
            ESymbolFace.JAGUAR_PINK,
            ESymbolFace.TEN,
            ESymbolFace.ACE,
            ESymbolFace.JACK,
            ESymbolFace.QUEEN,
            ESymbolFace.KING
        ];
        this.face = faces[Math.floor(Math.random() * faces.length)];
        this.frameState = SymbolFrameState.NORMAL;
        this.icon.node.off(Input.EventType.TOUCH_END, this.ShowInf, this)
        if (this.stackIndex == 0) {
            this.icon.node.on(Input.EventType.TOUCH_END, this.ShowInf, this)

        }

    }

    rollToIndex(time: number = 0.2, type: string = Symbol.MoveType.MOVING) {

        const newPosition = this.reel.getSymbolPosition(this.reelIndex);

        // ❗ CHỈ stop tween khi STOP, không stop khi MOVING
        if (type === Symbol.MoveType.STOP) {
            Tween.stopAllByTarget(this.node);
        }
        if (type === Symbol.MoveType.MOVING) {
            this.SetUiMove()
        }
        const easingType =
            type === Symbol.MoveType.MOVING
                ? "linear"
                : "cubicOut";

        return tween(this.node)
            .to(time, { position: newPosition }, { easing: easingType })
            .call(() => {

                this.reelIndex =
                    this.reelIndex % this.reel.symbols.length;

                if (type === Symbol.MoveType.STOP) {
                    this.exploAnim();
                }

            })
            .start();
    }


    DropToindex(time: number = 0.2) {
        if (!this.reel) return;

        const newPosition = this.reel.getSymbolPosition(this.reelIndex);
        Tween.stopAllByTarget(this.node);
        return tween(this.node)
            .to(time, { position: newPosition })
            .call(() => {
                this.exploAnim()
            })
            .start();
    }



    exploAnim(bounce = 2) {
        const basePos = this.reel.getSymbolPosition(this.reelIndex);
        const isHorizontal = this.reel.isHorizontal();

        const upPos = isHorizontal
            ? basePos.clone().add3f(bounce, 0, 0)
            : basePos.clone().add3f(0, bounce, 0);

        tween(this.node)
            .set({ position: basePos })
            .to(0.08, { position: upPos }, { easing: 'sineOut' })
            .to(0.08, { position: basePos }, { easing: 'sineIn' })
            .call(() => {
                if (this.isInit == true) {
                    if (this.face == ESymbolFace.WILD || this.face == ESymbolFace.GOLDEN_IDOL) {
                        if (GameManager.instance.CheckScratch() == false) {
                            this.icon.node.layer = this.layer
                            this.frame.node.layer = this.layer
                        }

                    }
                }
                else {
                    this.node.active = false
                }
                if (this.face == ESymbolFace.SCRATCH) {
                    this.icon.node.layer = this.layer
                    this.frame.node.layer = this.layer

                }
                if (this.face == ESymbolFace.SCRATCH || this.face == ESymbolFace.WILD) {

                    SoundToggle.instance.PlayScatchIdle()
                    const animNameAction = this.getNameAction();
                    const animNameIdle = this.getNameIdle()
                    this.icon.setCompleteListener((tracking) => {
                        if (tracking.animation.name != animNameIdle) return
                        this.icon.setCompleteListener(null);
                    });
                    this.playiconAnimation(animNameAction, true)
                    this.addAnimation(animNameIdle, true)

                }
                else {
                    const animNameIdle = this.getNameIdle()
                    this.icon.setCompleteListener((tracking) => {
                        if (tracking.animation.name != animNameIdle) return
                        this.icon.setCompleteListener(null);
                    });
                    this.playiconAnimation(animNameIdle, true)
                }
            })
            .start();
    }

    snapToGrid() {
        const cellHeight = 84; // hoặc this.height nếu bạn lưu
        const y = this.node.position.y;

        const snappedY = Math.round(y / cellHeight) * cellHeight;

        this.node.setPosition(
            this.node.position.x,
            snappedY,
            this.node.position.z
        );
    }
    FlipSymbol(data, onComplete?: () => void) {
        this.AnimationWin()
        if (!this.isRoot) { onComplete?.(); return; }
        this.isInit = true;
        this.face = data.i;
        this.frameState = data.f;
        this.stackSize = data.ms;
        this.stackIndex = data.mi;
        this.stackId = data.sid;
        const name = `icon_size${this.stackSize}_action_upgrade`;
        this.playiconAnimation(name, false);
        this.icon.setCompleteListener(() => {
            this.icon.setCompleteListener(null);
            this.UpdateFrame();
            this.addAnimation(this.getNameIdle(), true);
            if (this.face == ESymbolFace.SCRATCH || this.face == ESymbolFace.WILD || this.face == ESymbolFace.GOLDEN_IDOL) {
                this.icon.node.layer = this.layer
            }
        });
    }

    Dispose() {
        this.playiconAnimation(this.getNameWin(), false);
        this.scheduleOnce(() => {
            director.off("HIDE_INF", this.hideInf, this)

            this.node.destroy();
            GameManager.instance.symBolArray[this.col][this.row] = null
        }, 1);


    }

    HideAll() { this.EnabledAniamtion(false); }

    PlayIdleScratch() {

        const name = this.stackSize === 1
            ? "Icon_Scatter_small_action_idle"
            : "Icon_Scatter_big_action_idle";

        this.playiconAnimation(name, true);
    }


    ShowMask() {
        this.icon.color = new Color(158, 158, 158, 255)
        this.frame.color = new Color(158, 158, 158, 255)
    }


    AnimationWin() {
        tween(this.icon).to(0.1, { color: new Color(255, 255, 255, 255) }).start()
        tween(this.frame).to(0.1, { color: new Color(255, 255, 255, 255) }).start()

    }


    @property(Label)
    titleInf1: Label = null


    @property(Label)
    titleInf2: Label = null

    @property(sp.Skeleton) iconInf: sp.Skeleton = null!;
    @property(sp.Skeleton) frameInf: sp.Skeleton = null!;

    @property(Node)
    infNode: Node = null

    @property(Node)
    bg: Node = null

    @property(Node)
    frane: Node = null

    @property(Layout)
    containtNode: Layout = null

    @property(Node)
    numberNode: Node = null

    @property(Node)
    textWild: Node = null;

    @property(Node)
    textScratch: Node = null

    ShowInf() {
        if (Spin.instance.isAuto == true) return
        if (Spin.instance.isSpin == true) return
        GameManager.instance.maskInf.active = true
        this.infNode.active = true
        this.titleInf1.string = SymbolPayoutConfig[this.face].count
        this.titleInf2.string = SymbolPayoutConfig[this.face].value

        this.iconInf.setSkin(this.SkinMap[this.face] ?? "default");
        this.iconInf.setAnimation(0, this.getNameIdle(), true)



        if (this.face != ESymbolFace.WILD && this.face != ESymbolFace.SCRATCH) {
            this.textWild.active = false
            this.numberNode.active = true
            this.textScratch.active = false
            this.bg.getComponent(UITransform).setContentSize(300, 100 * this.stackSize + 30)
            this.frane.getComponent(UITransform).setContentSize(300, 100 * this.stackSize + 30)

            if (this.node.worldPosition.x > 400) {
                this.containtNode.horizontalDirection = Layout.HorizontalDirection.RIGHT_TO_LEFT;
                this.containtNode.node.parent.setPosition(-70, 0, 0)
            }
            else {
                this.containtNode.horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
                this.containtNode.node.parent.setPosition(70, 0, 0)
            }

        }
        if (this.face == ESymbolFace.WILD) {
            this.textWild.active = true
            this.numberNode.active = false
            this.textScratch.active = false
            this.bg.getComponent(UITransform).setContentSize(500, 100 * this.stackSize + 30)
            this.frane.getComponent(UITransform).setContentSize(500, 100 * this.stackSize + 30)
            if (this.node.worldPosition.x > 400) {
                this.containtNode.horizontalDirection = Layout.HorizontalDirection.RIGHT_TO_LEFT;
                this.containtNode.node.parent.setPosition(-170, 0, 0)
            }
            else {
                this.containtNode.horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
                this.containtNode.node.parent.setPosition(172, 0, 0)
            }
        }
        if (this.face == ESymbolFace.SCRATCH) {
            this.textWild.active = false
            this.numberNode.active = false
            this.textScratch.active = true
            this.bg.getComponent(UITransform).setContentSize(600, 100 * this.stackSize + 30)
            this.frane.getComponent(UITransform).setContentSize(600, 100 * this.stackSize + 30)
            if (this.node.worldPosition.x > 400) {
                this.containtNode.horizontalDirection = Layout.HorizontalDirection.RIGHT_TO_LEFT;
                this.containtNode.node.parent.setPosition(-225, 0, 0)
            }
            else {
                this.containtNode.horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
                this.containtNode.node.parent.setPosition(225, 0, 0)
            }
        }

        if (this.frameState == SymbolFrameState.SILVER) {
            this.frameInf.setSkin("Border_Silver")

        }

        if (this.frameState == SymbolFrameState.GOLD) {
            this.frameInf.setSkin("Border_Gold")
        }

        this.frameInf.setAnimation(0, this.getNameIdle(), true)

    }
}
