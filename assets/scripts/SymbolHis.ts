import { _decorator, Component, Tween, tween, UITransform, Sprite, Enum, Node, Vec2, SpriteFrame, Vec3, randomRangeInt, sp, size, Layers, Widget, Color, Game } from 'cc';
import { ReelBase } from './ReelBase';
import { PrefabManager } from './Manager/PrefabManager';
import { ListDataSymbol } from './data/ListDataSymbol';
import { dataSymbol } from './data/dataSymbol';
import { ESymbolFace } from './ESymbolFace';
import { GameManager } from './Manager/GameManager';
import { SymbolCell } from './SymbolCell';
import { SoundToggle } from './Sound';
import { SymbolFrameState } from './Enum/SymbolFrameState';

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

@ccclass('SymbolHis')
@executeInEditMode(true)

export class SymbolHis extends Component {

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

        if (!name) { this.EnabledAniamtion(false); return; }

        this.SetSkin();
        this.EnabledAniamtion(true);
        this.icon.setAnimation(0, name, loop);
    }

    addAnimation(name: string, loop: boolean) {
        if (name) this.icon.addAnimation(0, name, loop);
    }

    playFrameAnimation(name: string, loop: boolean) {
        this.frame?.setAnimation(0, name, loop);
    }

    UpdateFrame() {
        if (this.stackIndex > 0) {
            this.frame.enabled = false
            return
        }

        if (this.frameState == SymbolFrameState.GOLD ||
            this.frameState == SymbolFrameState.SILVER ||
            this.frameState == SymbolFrameState.WILD) {
            this.frame.enabled = true

            // Force set frame to a known good animation
            if (this.frameState == SymbolFrameState.SILVER) {
                this.playFrameAnimation('icon_size1_idle', true);
            }
        }
        else {
            this.frame.enabled = false
        }

    }

    SetUISymbolNormal() {
        this.UpdateFrame();
        this.playiconAnimation(this.getNameIdle(), true);
        this.playFrameAnimation(this.getNameIdle(), true)
        this.icon.node.setPosition(0, -102 * this.stackSize / 2 + 100 / 2, 0)
        this.frame.node.setPosition(0, -102 * this.stackSize / 2 + 100 / 2, 0)



    }


    InitSymbol(data: SymbolCell) {

        this.isInit = true;
        this.face = data.i;
        this.frameState = data.f;
        this.stackSize = data.ms;
        this.stackIndex = data.mi;
        this.stackId = data.sid;

        this.SetUISymbolNormal();
    }





}
