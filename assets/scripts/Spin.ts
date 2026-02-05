import { _decorator, Component, Input, Node, sp } from 'cc';
import { GameManager } from './Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Spin')
export class Spin extends Component {
    @property(sp.Skeleton)
    fxTouch: sp.Skeleton = null

    @property(sp.Skeleton)
    skeletonSpin: sp.Skeleton = null

    public static instance: Spin
    protected onLoad(): void {
        Spin.instance = this
    }
    protected start(): void {
        this.node.on(Node.EventType.MOUSE_ENTER, this.MouseEnter, this)
        this.node.on(Node.EventType.MOUSE_LEAVE, this.MoveLeave, this)
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this)
    }

    isMove = false
    MouseEnter() {
        if (this.isMove == true) return
        this.isMove = true
        this.fxTouch.node.active = true
        this.fxTouch.setAnimation(0, "idle_touch", true)

    }


    MoveLeave() {
        this.fxTouch.node.active = false
        this.isMove = false
    }

    isSpin = false
    TouchEnd() {
        if (this.isSpin == true) return
        this.isSpin = true
        GameManager.instance.PlaySpin()
        this.skeletonSpin.setAnimation(0, "action", false)
        this.skeletonSpin.addAnimation(0, "idle", true)
    }


}

