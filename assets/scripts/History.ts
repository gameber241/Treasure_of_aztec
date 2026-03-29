import { _decorator, Component, instantiate, Label, Prefab, ScrollView } from 'cc';
import { WebSocketService } from './WebSocketService';
import { ItemHistory } from './ItemHistory';
import { DetailHistory } from './DetailHistory';
const { ccclass, property } = _decorator;

@ccclass('H_story')
export class H_story extends Component {

    @property(Prefab)
    itemHis: Prefab = null

    @property(ScrollView)
    scrollHis: ScrollView = null

    @property(DetailHistory)
    detailHistory: DetailHistory = null

    btnClose() {
        this.node.active = false
    }

    async show() {
        this.node.active = true
        await this.loadHistoryDemo();
    }

    private async loadHistoryDemo() {
        const wsService = WebSocketService.getInstance();
        if (!wsService) {
            console.warn('[History] WebSocketService not found');
            return;
        }

        try {
            const logsPayload = {
                limit: 10,
                offset: 0,
                sort: 't.desc',
                datePreset: 'today'
            };

            console.log('[History] Requesting getLogs with payload:', logsPayload);
            const logsResult = await wsService.getLogs(logsPayload);
            console.log('[History] getLogsResult:', logsResult);

            const logs = logsResult?.logs || logsResult?.data || logsResult?.items || [];
            if (!Array.isArray(logs) || logs.length === 0) {
                console.log('[History] No logs found');
                return;
            }

            logs.forEach(e => {
                let item = instantiate(this.itemHis)
                this.scrollHis.content.addChild(item)
                item.getComponent(ItemHistory).SetUp(e)
                console.log(e)
            })


        } catch (error) {
            console.error('[History] Failed to load history demo:', error);
        }
    }

    ShowDetail(data) {
        this.detailHistory.show(data)
    }

}

