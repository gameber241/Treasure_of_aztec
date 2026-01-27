import { _decorator, Component, Tween, tween, UITransform, sp, Enum } from 'cc';
import { ReelBase } from './ReelBase';
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

export enum State {
    IDLE = 'IDLE',
    MOVING = 'MOVING',
    STOPPED = 'STOPPED'
}

@ccclass('Symbol')
@executeInEditMode(true)
export class Symbol extends Component {

    static Anim = {
        'NORMAL': { 'IDLE': 'mahjong_normal_idle', 'MOVE': 'mahjong_normal_move', 'WIN': 'mahjong_normal_action' },
        'GOLD': { 'IDLE': 'mahjong_gold_idle', 'MOVE': 'mahjong_gold_move', 'WIN': 'mahjong_gold_action' },
        'WILD': { 'IDLE': 'icon_wild_idle', 'WIN': 'icon_wild_action' },
        'SCATTER': { 'IDLE': 'icon_scatter_idle', 'MOVE': 'icon_scatter_move', 'WIN': 'icon_scatter_action' }
    } as const;

    // static Face2Skin = {
    //     'BLANK': 'default',
    //     'CHARACTER_8': 'icon_1',
    //     'DRAGON_RED': 'icon_2',
    //     'BAMBOO_5': 'icon_3',
    //     'DRAGON_GREEN': 'icon_4',
    //     'DOT_2': 'icon_5',
    //     'BAMBOO_2': 'icon_6',
    //     'DOT_5': 'icon_7',
    //     'DRAGON_WHITE': 'icon_8',
    //     'DOT_3': 'icon_9'
    // } as const;

    static MoveType = {
        START: 'start',
        STOP: 'stop',
        MOVING: 'moving'
    } as const;

    @property({ type: Enum(SymbolTileType) })
    type: SymbolTileType = SymbolTileType.NORMAL;

    @property({ type: Enum(SymbolFace) })
    face: SymbolFace = SymbolFace.TEN;

    @property({ type: Enum(SymbolFrameState) })
    frameState: SymbolFrameState = SymbolFrameState.NORMAL;

    @property({ type: sp.Skeleton })
    skeleton: sp.Skeleton = null;

    reel: ReelBase = null;
    reelIndex: number = 0;

    // Mega stack
    stackId: number = -1;
    stackSize: number = 1;
    stackIndex: number = 0; // 0 = root

    uiTransform: UITransform = null;

    get isVisualRoot(): boolean {
        return this.stackIndex === 0;
    }

    protected onLoad(): void {
        this.uiTransform = this.node.getComponent(UITransform);
        this.refreshVisual();
    }

    rollToIndex(time: number = 0.2, type: string = Symbol.MoveType.MOVING) {
        const newPosition = this.reel.getPositionByIndex(this.reelIndex);
        Tween.stopAllByTarget(this.node);

        // chỉ root mới có animation
        // if (this.isVisualRoot && this.skeleton) {
        //     if (type === Symbol.MoveType.MOVING)
        //         this.skeleton.setAnimation(0, Symbol.Anim[this.getAnimKey()].MOVE ?? Symbol.Anim[this.getAnimKey()].IDLE, true);
        //     else
        //         this.skeleton.setAnimation(0, Symbol.Anim[this.getAnimKey()].IDLE, true);
        // }

        // spawn random ở ô trên cùng
        if (this.isVisualRoot && this.reelIndex === 1)
            this.setRandomFace();

        const ease = {
            start: 'cubicOut',
            stop: 'bounceOut',
            moving: 'linear'
        };

        return tween(this.node)
            .to(time, { position: newPosition }, { easing: ease[type] })
            .start();
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
        const randomFace = faces[Math.floor(Math.random() * faces.length)];
        this.face = randomFace;
        this.type = SymbolTileType.NORMAL;
        this.frameState = SymbolFrameState.NORMAL;
        this.refreshVisual();
    }

    private getAnimKey(): SymbolTileType {
        // if (this.frameState === SymbolFrameState.GOLD) return SymbolTileType.GOLD;
        // if (this.frameState === SymbolFrameState.WILD) return SymbolTileType.WILD;
        return this.type;
    }

    refreshVisual() {
        if (!this.isVisualRoot || !this.skeleton) return;

        // this.skeleton.setSkin(Symbol.Face2Skin[this.face]);
        const animKey = this.getAnimKey();
        this.skeleton.setAnimation(0, Symbol.Anim[animKey][State.IDLE], true);

        // Mega symbol kéo cao
        if (this.stackSize > 1 && this.reel) {
            this.uiTransform.height = this.reel.getCellSizeValue() * this.stackSize;
        }
    }

    /** Wilds-on-the-Way state machine */
    advanceFrameState() {
        if (this.type === SymbolTileType.SCATTER) return;

        switch (this.frameState) {
            case SymbolFrameState.NORMAL:
                this.frameState = SymbolFrameState.SCRATCH;
                break;
            case SymbolFrameState.SCRATCH:
                this.frameState = SymbolFrameState.SILVER;
                this.setRandomFace(); // random normal, không Wild, không Scatter
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
}
