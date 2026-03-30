import { _decorator, Component, Label, Node, randomRangeInt, Sprite, SpriteFrame, Tween, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TextBoxCombo')
export class TextBoxCombo extends Component {
    @property(Sprite)
    textRandom: Sprite = null

    @property(SpriteFrame)
    texts: SpriteFrame[] = []

    @property(Node)
    totalWin: Node = null

    @property(Node)
    textWin: Node = null


    @property(Node)
    textTotalWin: Node = null

    @property(Label)
    lbScore: Label = null

    @property(Label)
    comboAnim: Label = null


    public static instant: TextBoxCombo

    protected start(): void {
        TextBoxCombo.instant = this
        this.playRandomText()
    }

    playRandomText() {
        this.totalWin.active = false
        this.textRandom.node.active = true
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

    PlayStepWin(step, multi) {
        Tween.stopAllByTarget(this.textRandom.node)
        this.unscheduleAllCallbacks()
        console.log(step, "414313123123")
        this.totalWin.active = true
        this.textRandom.node.active = false
        this.textWin.active = false
        this.textTotalWin.active = false
        this.comboAnim.node.active = false
        if (multi == 1) {
            this.textWin.active = true
            this.lbScore.string = step

        }
        else {
            let result = step * multi
            result = Number(result.toFixed(2))
            this.lbScore.string = result.toString()
            this.scheduleOnce(() => {
                this.comboAnim.node.active = true
                this.comboAnim.node.getComponent(UIOpacity).opacity = 0
                this.comboAnim.node.setScale(1, 1, 1)
                this.comboAnim.string = "x" + multi
                tween(this.comboAnim.node.getComponent(UIOpacity)).to(0.5, { opacity: 120 })
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        this.comboAnim.node.active = false
                    })
                    .start()
                tween(this.comboAnim.node).to(0.5, { scale: new Vec3(3, 3, 3) })

                    .start()

                this.textWin.active = true
                this.lbScore.string = step
            }, 1)

        }
    }

    PlayTotalWIn(total) {
        Tween.stopAllByTarget(this.textRandom.node)
        this.totalWin.active = true
        this.unscheduleAllCallbacks()

        this.textRandom.node.active = false
        this.textWin.active = false
        this.textTotalWin.active = false

        this.textTotalWin.active = true
        this.lbScore.string = total

    }

}

