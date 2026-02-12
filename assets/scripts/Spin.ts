import { _decorator, Button, Component, Input, Label, Node, sp } from 'cc';
import { GameManager } from './Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Spin')
export class Spin extends Component {
    @property(sp.Skeleton)
    fxTouch: sp.Skeleton = null

    @property(sp.Skeleton)
    skeletonSpin: sp.Skeleton = null

    @property(Button)
    btnMinus: Button = null

    @property(Button)
    btnPlus: Button = null

    @property(Button)
    auto: Button = null

    @property(Button)
    btnOPtion: Button = null

    @property(Label)
    countAuto: Label = null

    @property(sp.Skeleton)
    spAuto: sp.Skeleton = null
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
        this.PlaySpin()
        this.skeletonSpin.setAnimation(0, "action", false)
        this.skeletonSpin.addAnimation(0, "idle", true)
    }

    PlaySpin() {
        this.isSpin = true
        this.btnMinus.interactable = false
        this.btnPlus.interactable = false
        this.auto.interactable = false
        this.btnOPtion.interactable = false
        GameManager.instance.PlaySpin()
    }

    ActiveSpin() {
        this.isSpin = false
        this.btnMinus.interactable = true
        this.btnPlus.interactable = true
        this.auto.interactable = true
        this.btnOPtion.interactable = true
    }

    isAuto = false
    count = 0
    PlayAuto(number = 0) {
        if (this.isAuto == false) {
            this.isAuto = true
            this.spAuto.node.active = true
            this.skeletonSpin.node.active = false
            this.spAuto.addAnimation(0, "auto_free", true)
            this.countAuto.string = number.toString()
            this.countAuto.node.active = true
            this.count = number
            this.scheduleOnce(() => {
                this.PlayResume()
            }, 0.5)
        }
        else {
            this.skeletonSpin.addAnimation(0, "idle", true)
            this.skeletonSpin.node.active = true
            this.isAuto = false
            this.countAuto.node.active = false
            this.spAuto.node.active = false


        }
    }

    PlayResume() {
        this.PlaySpin()
        this.count--
        this.countAuto.string = this.count.toString()
    }

    CheckAuto() {
        console.log(this.count, "check  ")
        if (this.count == 0) {
            this.spAuto.node.active = false
            this.skeletonSpin.node.active = true
            this.skeletonSpin.addAnimation(0, "idle", true)
            this.isAuto = false
            this.countAuto.node.active = false
            // Spin.instance.ActiveSpin()
            // GameManager.instance.indexCurrentReel = 0
            // GameManager.instance.SetNormal()
        }
        else {
            this.PlayResume()
        }
    }
}

