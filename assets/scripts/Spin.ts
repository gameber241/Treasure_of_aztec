import { _decorator, Button, Component, Input, Label, Node, sp } from 'cc';
import { GameManager } from './Manager/GameManager';
import { SoundToggle } from './Sound';
const { ccclass, property } = _decorator;

@ccclass('Spin')
export class Spin extends Component {

    @property(sp.Skeleton)
    fxTouch: sp.Skeleton = null;

    @property(sp.Skeleton)
    skeletonSpin: sp.Skeleton = null;

    @property(Button)
    btnMinus: Button = null;

    @property(Button)
    btnPlus: Button = null;

    @property(Button)
    auto: Button = null;

    @property(Button)
    btnOPtion: Button = null;

    @property(Label)
    countAuto: Label = null;

    @property(sp.Skeleton)
    spAuto: sp.Skeleton = null;

    public static instance: Spin;

    // ================= STATE =================

    isSpin = false;
    isAuto = false;
    autoCount = 0;
    isMove = false;

    protected onLoad(): void {
        Spin.instance = this;
    }

    protected start(): void {
        this.node.on(Node.EventType.MOUSE_ENTER, this.MouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this.MoveLeave, this);
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);

        this.countAuto.node.active = false;
        this.spAuto.node.active = false;
        this.skeletonSpin.setAnimation(0, "idle", true);
    }

    // ================= NORMAL SPIN =================

    TouchEnd() {
        if (this.isSpin) return;

        // Nếu đang auto mà người chơi bấm tay => tắt auto
        if (this.isAuto) {
            this.StopAuto();
        }

        this.StartSpin();
    }

    StartSpin() {
        if (this.isSpin) return; // tránh gọi trùng

        this.isSpin = true;

        SoundToggle.instance.PlaySpin();

        if (this.spAuto.node.active) {
            this.spAuto.setAnimation(0, "auto_free", true);
        } else {
            this.skeletonSpin.setAnimation(0, "action", false);
            this.skeletonSpin.addAnimation(0, "idle", true);
        }

        this.btnMinus.interactable = false;
        this.btnPlus.interactable = false;
        this.auto.interactable = false;
        this.btnOPtion.interactable = false;

        GameManager.instance.PlaySpin();
    }

    /**
     * Gọi sau khi vòng quay kết thúc.
     */
    ActiveSpin() {
        this.isSpin = false;
        this.btnMinus.interactable = true;
        this.btnPlus.interactable = true;
        this.auto.interactable = true;
        this.btnOPtion.interactable = true;

        // Nếu đang auto thì spin tiếp
        if (this.isAuto) {
            this.AutoSpinNext();
        }
    }

    // ================= AUTO SPIN =================

    PlayAuto(number: number) {
        // Nếu đang auto mà bấm lại => tắt auto
        if (this.isAuto) {
            this.StopAuto();
            return;
        }

        this.isAuto = true;
        this.autoCount = number;

        this.countAuto.node.active = true;
        this.countAuto.string = this.autoCount.toString();

        this.spAuto.node.active = true;
        this.skeletonSpin.node.active = false;
        this.spAuto.setAnimation(0, "auto_free", true);

        // Spin đầu tiên KHÔNG trừ count
        this.StartSpin();
    }

    /**
     * Chỉ được gọi sau khi 1 lượt spin hoàn tất.
     * Mỗi lần gọi chỉ trừ 1.
     */
    AutoSpinNext() {
        // Giảm số lượt còn lại
        this.autoCount--;

        // Cập nhật UI
        if (this.autoCount > 0) {
            this.countAuto.string = this.autoCount.toString();
            this.StartSpin();
        } else {
            // Hết lượt
            this.countAuto.string = "0";
            this.StopAuto();
        }
    }

    StopAuto() {
        this.isAuto = false;
        this.autoCount = 0;

        this.countAuto.node.active = false;
        this.spAuto.node.active = false;
        this.skeletonSpin.node.active = true;

        this.skeletonSpin.setAnimation(0, "idle", true);
    }

    // ================= FX =================

    MouseEnter() {
        if (this.isMove) return;

        this.isMove = true;
        this.fxTouch.node.active = true;
        this.fxTouch.setAnimation(0, "idle_touch", true);
    }

    MoveLeave() {
        this.fxTouch.node.active = false;
        this.isMove = false;
    }
}