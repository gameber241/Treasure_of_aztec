import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Sound')
export class Sound extends Component {

    @property(Sprite)
    icon: Sprite = null

    @property(SpriteFrame)
    icons: SpriteFrame[] = []

    ísSound = true

    btnClick() {
        if (this.ísSound == false) {
            this.ísSound = true
            this.icon.spriteFrame = this.icons[0]
        }
        else {
            this.ísSound = false
            this.icon.spriteFrame = this.icons[1]

        }
    }
}

