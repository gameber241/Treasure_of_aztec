import { _decorator, Component, Input, Label, sp, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BigWin')
export class BigWin extends Component {

    public static instance: BigWin = null!;

    protected onLoad(): void {
        BigWin.instance = this;
    }

    @property(sp.Skeleton)
    fxBigwin: sp.Skeleton = null!;

    @property(Label)
    textBigwin: Label = null!;

    @property(Label)
    textMegawin: Label = null!;

    @property(Label)
    textSuperwin: Label = null!;

    // =============================

    private currentValue: number = 0;
    private targetValue: number = 0;

    private tweenObj: { value: number } | null = null;
    private runningTween: Tween<any> | null = null;

    private touchHandler: Function | null = null;

    private isStopped: boolean = false;

    // =============================

    showBigWin(callback?: Function, current: number = 0) {
        this.prepareShow(current, this.textBigwin, "BigWin_Appear", "BigWin_Idle", callback);
    }

    showMegaWin(callback?: Function, current: number = 0) {
        this.prepareShow(current, this.textMegawin, "MegaWin_Appear", "MegaWin_Idle", callback);
    }

    showSuperWin(callback?: Function, current: number = 0) {
        this.prepareShow(current, this.textSuperwin, "SuperWin_Appear", "SuperWin_Idle", callback);
    }

    // =============================

    private prepareShow(
        value: number,
        activeLabel: Label,
        appearAnim: string,
        idleAnim: string,
        callback?: Function
    ) {
        // reset state
        this.resetState();

        // bật FX root
        this.node.children[0].active = true;

        // bật đúng label
        this.textBigwin.node.active = false;
        this.textMegawin.node.active = false;
        this.textSuperwin.node.active = false;
        activeLabel.node.active = true;

        // spine animation
        this.fxBigwin.setAnimation(0, appearAnim, false);
        this.fxBigwin.addAnimation(0, idleAnim, true);

        // play number
        this.playTo(value, 3, activeLabel, callback);
    }

    // =============================

    private playTo(targetValue: number, duration: number, label: Label, callback?: Function) {

        this.targetValue = targetValue;
        this.tweenObj = { value: this.currentValue };

        this.runningTween = tween(this.tweenObj)
            .to(duration, { value: targetValue }, {
                easing: "cubicOut",
                onUpdate: () => {
                    if (!this.tweenObj) return;
                    this.currentValue = this.tweenObj.value;
                    label.string = this.currentValue.toFixed(2);
                }
            })
            .call(() => {
                this.complete(label, callback);
            })
            .start();

        // register touch skip
        this.touchHandler = () => {
            this.stopAndComplete(label, callback);
        };

        this.node.on(Input.EventType.TOUCH_END, this.touchHandler, this);
    }

    // =============================

    private stopAndComplete(label: Label, callback?: Function) {

        if (this.isStopped) return;
        this.isStopped = true;

        if (this.runningTween) {
            this.runningTween.stop();
            this.runningTween = null;
        }

        if (this.tweenObj) {
            this.currentValue = this.targetValue;
            label.string = this.targetValue.toFixed(2);
        }

        this.complete(label, callback);
    }

    // =============================

    private complete(label: Label, callback?: Function) {

        // remove event
        if (this.touchHandler) {
            this.node.off(Input.EventType.TOUCH_END, this.touchHandler, this);
            this.touchHandler = null;
        }

        // delay hide giống slot
        this.scheduleOnce(() => {
            this.node.children[0].active = false;
            callback?.();
        }, 2);
    }

    // =============================

    private resetState() {

        this.unscheduleAllCallbacks();

        if (this.runningTween) {
            this.runningTween.stop();
            this.runningTween = null;
        }

        if (this.touchHandler) {
            this.node.off(Input.EventType.TOUCH_END, this.touchHandler, this);
            this.touchHandler = null;
        }

        this.currentValue = 0;
        this.isStopped = false;
    }
}
