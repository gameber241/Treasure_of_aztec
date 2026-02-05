import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BigWin')
export class BigWin extends Component {
    public static instance: BigWin = null
    protected onLoad(): void {
        BigWin.instance = this
    }
    @property(sp.Skeleton)
    fxBigwin: sp.Skeleton = null


    showBigWin(callback) {
        console.log("den day neeee")
        this.fxBigwin.node.parent.active = true
        this.fxBigwin.setAnimation(0, "BigWin_Appear", false)
        this.fxBigwin.addAnimation(0, "BigWin_Idle", true)

        this.fxBigwin.setCompleteListener((tracking) => {
            if (tracking.animation.name != "BigWin_Idle") return
            this.fxBigwin.setCompleteListener(null)

            this.scheduleOnce(() => {
                this.fxBigwin.node.parent.active = false
                callback?.()

            }, 2)
        });
    }

    showMegaWin(callback) {
        this.fxBigwin.node.parent.active = true


        this.fxBigwin.setAnimation(0, "MegaWin_Appear", false)
        this.fxBigwin.addAnimation(0, "MegaWin_Idle", true)

        this.fxBigwin.setCompleteListener((tracking) => {
            if (tracking.animation.name != "MegaWin_Idle") return
            this.fxBigwin.setCompleteListener(null)
            this.scheduleOnce(() => {
                this.fxBigwin.node.parent.active = false

                callback?.()
            }, 2)
        });
    }


    showSuperWin(callback) {
        this.fxBigwin.node.parent.active = true


        this.fxBigwin.setAnimation(0, "SuperWin_Appear", false)
        this.fxBigwin.addAnimation(0, "SuperWin_Idle", true)

        this.fxBigwin.setCompleteListener((tracking) => {
            if (tracking.animation.name != "MegaWin_Idle") return
            this.fxBigwin.setCompleteListener(null)
            this.scheduleOnce(() => {
                this.fxBigwin.node.parent.active = false

                callback?.()
            }, 2)
        });
    }
}

