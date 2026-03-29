import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { WebSocketService } from './WebSocketService';
import { ItemHistory } from './ItemHistory';
const { ccclass, property } = _decorator;

@ccclass('H_story')
export class H_story extends Component {

    @property(Prefab)
    itemHis: Prefab = null

    @property(ScrollView)
    scrollHis: ScrollView = null


    btnClose() {
        this.node.active = false
    }

    async show() {
        console.log('[History] show() called');
        this.node.active = true;
        await this.loadHistoryDemo();
    }

    private async loadHistoryDemo() {
        const wsService = WebSocketService.getInstance();
        if (!wsService) {
            console.warn('[History] WebSocketService not found');
            return;
        }

        if (!this.scrollHis) {
            console.error('[History] scrollHis is null. Please bind ScrollView in Inspector.');
            return;
        }

        if (!this.scrollHis.content) {
            console.error('[History] scrollHis.content is null. Please set ScrollView content node.');
            return;
        }

        if (!this.itemHis) {
            console.error('[History] itemHis prefab is null. Please bind item prefab in Inspector.');
            return;
        }

        try {
            console.log('[History] Clearing old history items');
            this.scrollHis.content.removeAllChildren();

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

            console.log(`[History] Found ${logs.length} logs. Loading getLogDetail sequentially...`);

            const detailResults: any[] = [];
            for (const logItem of logs) {
                try {
                    if (!logItem?.id) {
                        console.warn('[History] Skip log without id:', logItem);
                        detailResults.push(logItem);
                        continue;
                    }

                    console.log('[History] Requesting getLogDetail for id:', logItem.id);
                    const detailResult = await wsService.getLogDetail(logItem.id);
                    console.log('[History] getLogDetailResult:', logItem.id, detailResult);

                    const detailLog = detailResult?.log || detailResult?.data || detailResult;
                    const mergedEntry = {
                        ...logItem,
                        detail: detailLog,
                        replayRounds: detailLog?.replayRounds,
                        rounds: detailLog?.replayRounds || detailLog?.rounds || logItem?.rounds,
                    };

                    detailResults.push(mergedEntry);
                } catch (detailError) {
                    console.error('[History] Failed to get log detail:', logItem?.id, detailError);
                    detailResults.push(logItem);
                }
            }

            console.log('[History] Rendering history entries:', detailResults.length);
            detailResults.forEach((entry, index) => {
                try {
                    const item = instantiate(this.itemHis);
                    this.scrollHis.content.addChild(item);

                    const itemHistory = item.getComponent(ItemHistory);
                    if (!itemHistory) {
                        console.error('[History] Item prefab missing ItemHistory component at index:', index);
                        return;
                    }

                    itemHistory.SetUp(entry);
                    console.log('[History] Rendered entry:', index, entry?.id, {
                        hasDetail: Boolean(entry?.detail),
                        replayRounds: entry?.replayRounds?.length ?? 0,
                    });
                } catch (renderError) {
                    console.error('[History] Failed to render entry at index:', index, renderError);
                }
            });
        } catch (error) {
            console.error('[History] Failed to load history demo:', error);
        }
    }



}

