import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Waymanager')
export class Waymanager extends Component {
    @property(Label)
    way: Label = null
    public static instance: Waymanager = null
    protected onLoad(): void {
        Waymanager.instance = this
        this.resetWay()
    }


    animWay(way) {
        this.countFromNToM(0, way)
    }
    private _countCb: Function | null = null
    countFromNToM(n: number, m: number) {
        if (n > m) return

        let duration = 1        // 1 giây
        let time = 0

        this.unschedule(this._countCb)

        this._countCb = (dt: number) => {
            time += dt

            let t = Math.min(time / duration, 1)

            let value = Math.floor(n + (m - n) * t)

            this.way.string = value.toString()

            if (t >= 1) {
                this.unschedule(this._countCb)
            }
        }

        this.schedule(this._countCb, 0)
    }
    resetWay() {
        this.way.string = "..."
    }
}

