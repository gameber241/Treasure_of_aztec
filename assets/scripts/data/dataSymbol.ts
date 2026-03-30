import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, Tween } from 'cc';
import { ESymbolFace } from '../ESymbolFace';


const { ccclass, property } = _decorator;

@ccclass('dataSymbol')
export class dataSymbol {
    @property({ type: Enum(ESymbolFace) })
    face: ESymbolFace = ESymbolFace.TEN;

    @property({ type: SpriteFrame })
    public icon: SpriteFrame = null

}

