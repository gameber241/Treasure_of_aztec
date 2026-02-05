import { _decorator, Component, Node, randomRangeInt, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TextBoxCombo')
export class TextBoxCombo extends Component {
    @property(Sprite)
    textRandom: Sprite = null

    @property(SpriteFrame)
    texts: SpriteFrame[] = []

    protected start(): void {
        this.playRandomText()
    }

    playRandomText() {
        let random = randomRangeInt(0, this.texts.length)
        this.textRandom.spriteFrame = this.texts[random]
        if (random == 0) {
            this.textRandom.node.setPosition(103.37, 30, 0)
            tween(this.textRandom.node).to(6, { position: new Vec3(-737.464, 30, 0) })
                .call(() => {
                    this.playRandomText()
                })
                .start()

        } else
            if (random == 1) {
                this.textRandom.node.setPosition(103.37, 30, 0)
                tween(this.textRandom.node).to(6, { position: new Vec3(-737.464, 30, 0) })
                    .call(() => {
                        this.playRandomText()
                    })
                    .start()

            }
            else {
                this.textRandom.node.setPosition(0, 30, 0)
                this.scheduleOnce(() => {
                    this.playRandomText()
                }, 3)
            }

    }
}

