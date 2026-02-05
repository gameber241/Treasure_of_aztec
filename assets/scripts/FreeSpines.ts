import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FreeSpines')
export class FreeSpines extends Component {
    public static instance: FreeSpines = null
    @property(sp.Skeleton)
    fx: sp.Skeleton = null
    protected onLoad(): void {
        FreeSpines.instance = this
    }



    playAnimation(callback) {
        this.fx.node.active = true
        this.fx.setAnimation(0, "_FreeWin_Appear", false)
        this.fx.addAnimation(0, "_FreeWin_Idle", false)
        this.fx.addAnimation(0, "_FreeWin_Action", false)
        this.fx.addAnimation(0, "_FreeWin_Action_Idle", false)

        this.fx.setCompleteListener((tracking) => {
            if (tracking.animation.name != "_FreeWin_Action_Idle") return
            this.fx.setCompleteListener(null)
            this.scheduleOnce(() => {
                this.fx.node.active = false
                callback?.()
            }, 2)
        });
    }
}

