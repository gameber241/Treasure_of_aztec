import { _decorator, Button, Component, Input, Label, Node, sp } from 'cc';
import { GameManager } from './Manager/GameManager';
import { SoundToggle } from './Sound';
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

    // ================= NORMAL SPIN =================

    isSpin = false

    TouchEnd() {
        if (this.isSpin) return

        // nếu đang auto mà bấm tay => tắt auto
        if (this.isAuto) this.StopAuto()

        this.StartSpin()
    }

    StartSpin() {
        this.isSpin = true

        SoundToggle.instance.PlaySpin()

        this.skeletonSpin.setAnimation(0, "action", false)
        this.skeletonSpin.addAnimation(0, "idle", true)

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

        // ⭐ auto spin tiếp tại đây
        if (this.isAuto) {
            this.AutoSpinNext()
        }
    }

    // ================= AUTO SPIN =================

    isAuto = false
    autoCount = 0

    PlayAuto(number: number) {

        if (this.isAuto) {
            this.StopAuto()
            return
        }

        this.isAuto = true
        this.autoCount = number

        this.countAuto.node.active = true
        this.countAuto.string = this.autoCount.toString()

        this.spAuto.node.active = true
        this.skeletonSpin.node.active = false
        this.spAuto.setAnimation(0, "auto_free", true)

        this.StartSpin()
    }

    AutoSpinNext() {

        if (this.autoCount <= 0) {
            this.StopAuto()
            return
        }

        this.autoCount--
        this.countAuto.string = this.autoCount.toString()

        this.StartSpin()
    }

    StopAuto() {
        this.isAuto = false

        this.countAuto.node.active = false
        this.spAuto.node.active = false
        this.skeletonSpin.node.active = true
        this.skeletonSpin.setAnimation(0, "idle", true)
    }

    // ================= FX =================

    isMove = false

    MouseEnter() {
        if (this.isMove) return
        this.isMove = true
        this.fxTouch.node.active = true
        this.fxTouch.setAnimation(0, "idle_touch", true)
    }

    MoveLeave() {
        this.fxTouch.node.active = false
        this.isMove = false
    }

}