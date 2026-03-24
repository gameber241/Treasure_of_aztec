import { _decorator, Component } from 'cc';
import { WebSocketService } from './WebSocketService';
const { ccclass } = _decorator;

@ccclass('H_story')
export class H_story extends Component {

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

            const firstLog = logs[0];
            const logId = firstLog?.id;
            if (logId === undefined || logId === null) {
                console.warn('[History] First log has no id:', firstLog);
                return;
            }

            console.log('[History] Requesting getLogDetail for id:', logId);
            const detailResult = await wsService.getLogDetail(logId);
            console.log('[History] getLogDetailResult:', detailResult);
        } catch (error) {
            console.error('[History] Failed to load history demo:', error);
        }
    }
}

