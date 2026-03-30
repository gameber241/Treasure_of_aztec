import { _decorator, Component, EventTouch, Input, Label, Node } from 'cc';
import { WebSocketService } from './WebSocketService';
import { GameManager } from './Manager/GameManager';
import { H_story } from './History';
const { ccclass, property } = _decorator;

@ccclass('ItemHistory')
export class ItemHistory extends Component {
    @property(Label)
    timeStem: Label = null

    @property(Label)
    transaction: Label = null

    @property(Label)
    bet: Label = null

    @property(Label)
    profit: Label = null



    data = null
    SetUp(data) {
        this.data = data
        this.timeStem.string = this.formatFull(data.timestamp)
        this.bet.string = data.bet
        this.transaction.string = data.id
        this.profit.string = (data.balanceBefore - data.balanceAfter).toString()

        this.node.on(Input.EventType.TOUCH_START, this.TouchStart, this)
        this.node.on(Input.EventType.TOUCH_MOVE, this.TouchMove, this)
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this)


    }

    TouchStart(event: EventTouch) {

    }

    TouchMove(event: EventTouch) {
        if (event.getDeltaY() > 5) {
            event.propagationStopped = true
        }
    }

    TouchEnd(event: EventTouch) {
        this.Btn()
    }

    pad2(n: number): string {
        return n < 10 ? "0" + n : "" + n
    }

    formatFull(isoTime: string) {
        const d = new Date(isoTime)

        const hh = this.pad2(d.getHours())
        const mm = this.pad2(d.getMinutes())
        const ss = this.pad2(d.getSeconds())

        const month = this.pad2(d.getMonth() + 1)
        const day = this.pad2(d.getDate())

        return `${hh}:${mm}:${ss}\n${month}/${day}`
    }


    async Btn() {
        const wsService = WebSocketService.getInstance();
        const detailResult = await wsService.getLogDetail(this.data.id);
        console.log('[History] getLogDetailResult:', detailResult);
        GameManager.instance.history.getComponent(H_story).ShowDetail(detailResult.log)
    }
}

