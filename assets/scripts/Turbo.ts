import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { GameManager } from './Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Turbo')
export class Turbo extends Component {
    @property(Sprite)
    turboSP: Sprite = null

    @property(SpriteFrame)
    turboOn: SpriteFrame = null

    @property(SpriteFrame)
    turboOff: SpriteFrame = null


    onClick() {
        if (GameManager.instance.isTurbo == false) {
            GameManager.instance.isTurbo = true
            this.turboSP.spriteFrame = this.turboOn
        }
        else {
            GameManager.instance.isTurbo = false
            this.turboSP.spriteFrame = this.turboOff


        }
    }
}

