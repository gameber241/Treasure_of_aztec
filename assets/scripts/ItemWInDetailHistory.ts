import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { PrefabManager } from './Manager/PrefabManager';
import { ESymbolFace } from './ESymbolFace';
const { ccclass, property } = _decorator;

@ccclass('ItemWInDetailHistory')
export class ItemWInDetailHistory extends Component {
    @property(Sprite)
    icon: Sprite = null

    @property(Label)
    title1: Label = null

    SetUp(id, quantity) {
        this.icon.spriteFrame = PrefabManager.instance.GetDataSymbol().getDataByType(id).icon
        this.title1.string = quantity + " of a Kind"
    }
}


