import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, Tween } from 'cc';
import { SymbolFace } from '../Symbol';
const { ccclass, property } = _decorator;
Enum(SymbolFace)
@ccclass('dataSymbol')
export class dataSymbol {
    @property({ type: SymbolFace })
    public type: SymbolFace = SymbolFace.TEN

    @property({ type: SpriteFrame })
    public icon: SpriteFrame = null

}

