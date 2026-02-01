import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, Tween } from 'cc';
import { ESymbolFace } from '../ESymbolFace';


const { ccclass, property } = _decorator;

@ccclass('dataSymbol')
export class dataSymbol {
    @property({ type: Enum(ESymbolFace) })
    face: ESymbolFace = ESymbolFace.TEN;

    @property({ type: SpriteFrame })
    public icon: SpriteFrame = null

    @property({ type: SpriteFrame })
    public iconV2: SpriteFrame = null


    @property({ type: SpriteFrame })
    public icon_move: SpriteFrame = null

    @property({ type: SpriteFrame })
    public iconV2_move: SpriteFrame = null




    @property({ type: SpriteFrame })
    public bg1x1: SpriteFrame = null
    @property({ type: SpriteFrame })
    public bg1x2: SpriteFrame = null
    @property({ type: SpriteFrame })
    public bg1x3: SpriteFrame = null
    @property({ type: SpriteFrame })
    public bg1x4: SpriteFrame = null


    @property({ type: SpriteFrame })
    public bg1x1_move: SpriteFrame = null
    @property({ type: SpriteFrame })
    public bg1x2_move: SpriteFrame = null
    @property({ type: SpriteFrame })
    public bg1x3_move: SpriteFrame = null
    @property({ type: SpriteFrame })
    public bg1x4_move: SpriteFrame = null





}

