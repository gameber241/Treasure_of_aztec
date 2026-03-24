import { _decorator, Component } from 'cc';
import { GameConfig } from './GameConfig';
import { EventBus } from './EventBus';
const { ccclass } = _decorator;

interface SpinResult {
    success: boolean;
    error?: string;
    usingFreeSpin: boolean;
    freeSpinsLeft: number;
    totalWin: number;
    free: {
        triggered: boolean;
        awarded: number;
    };
    rounds: any[];
    jackpot?: {
        won: boolean;
        tier: string;
        amount: number;
        triggerType: string;
    };
}


@ccclass('WebSocketService')
export class WebSocketService extends Component {
    private static instance: WebSocketService = null;
    private ws: WebSocket | null = null;
    private token: string = '';
    private gameId: string = '1004';
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 3000;
    private messageHandlers: Map<string, Function> = new Map();
    private isConnecting: boolean = false;

    public static getInstance(): WebSocketService {
        return WebSocketService.instance;
    }

    protected onLoad(): void {
        WebSocketService.instance = this;
    }

    public connect(serverUrl: string, token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                console.log('[WS] Already connected');
                resolve();
                return;
            }

            if (this.isConnecting) {
                console.log('[WS] Connection already in progress');
                reject(new Error('Connection already in progress'));
                return;
            }

            this.isConnecting = true;
            this.token = token;

            const wsUrl = `${serverUrl}?gameID=${this.gameId}&token=${encodeURIComponent(token)}`;
            console.log('[WS] Connecting to:', wsUrl);

            try {
                this.ws = new WebSocket(wsUrl);

                this.ws.onopen = () => {
                    console.log('[WS] Connected successfully');
                    this.isConnecting = false;
                    this.reconnectAttempts = 0;
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };

                this.ws.onerror = (error) => {
                    console.error('[WS] Error:', error);
                    this.isConnecting = false;
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('[WS] Connection closed');
                    this.isConnecting = false;
                    this.handleReconnect();
                };

            } catch (error) {
                console.error('[WS] Connection failed:', error);
                this.isConnecting = false;
                reject(error);
            }
        });
    }

    private handleMessage(data: string): void {
        try {
            const message = JSON.parse(data);
            // console.log('[WS] Received message:', message);
            // console.log('[WS] Message type:', message.type);
            // console.log('[WS] Message payload:', message.payload);

            // Handle getProfileResult specifically
            if (message.type === 'getProfileResult') {
                // console.log('[WS] ===== PROFILE RESULT DETECTED =====');
                // console.log('[WS] Full message:', JSON.stringify(message, null, 2));
                // console.log('[WS] Payload:', JSON.stringify(message.payload, null, 2));

                const handler = this.messageHandlers.get('profile');
                if (handler) {
                    // console.log('[WS] Calling profile handler');
                    handler(message);
                } else {
                    console.warn('[WS] No profile handler registered!');
                }

                // Emit global event for profile updates
                const eventData = message.payload || message;
                console.log('[WS] Emitting profile:updated event with data:', JSON.stringify(eventData, null, 2));
                EventBus.getInstance().emit('profile:updated', eventData);
            }
            // Handle spin result
            else if (message.type === 'spinResult' || message.type === 'spin' || message.action === 'spinResult') {
                // console.log('[WS] ===== SPIN RESULT DETECTED =====');
                // console.log('[WS] Full message:', JSON.stringify(message, null, 2));

                const handler = this.messageHandlers.get('spin');
                if (handler) {
                    // console.log('[WS] Calling spin handler');
                    handler(message);
                } else {
                    console.warn('[WS] No spin handler registered!');
                }
            }
            else {
                const handler = this.messageHandlers.get(message.action || message.type);
                if (handler) {
                    handler(message);
                }
            }

            // Emit global event
            this.node.emit('ws-message', message);

        } catch (error) {
            console.error('[WS] Failed to parse message:', error);
        }
    }

    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[WS] Max reconnect attempts reached');
            this.node.emit('ws-reconnect-failed');
            return;
        }

        this.reconnectAttempts++;
        // console.log(`[WS] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

        setTimeout(() => {
            if (this.token) {
                this.connect(GameConfig.url_ws, this.token).catch(err => {
                    console.error('[WS] Reconnect failed:', err);
                });
            }
        }, this.reconnectDelay);
    }

    public on(action: string, handler: Function): void {
        this.messageHandlers.set(action, handler);
    }

    public off(action: string): void {
        this.messageHandlers.delete(action);
    }

    public send(action: string, data?: any): void {
        // console.log('[WS] send() called with action:', action, 'data:', data);
        // console.log('[WS] WebSocket state:', this.ws ? this.ws.readyState : 'null');
        // console.log('[WS] WebSocket.OPEN constant:', WebSocket.OPEN);

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('[WS] Cannot send message: not connected');
            console.error('[WS] ws is null:', this.ws === null);
            console.error('[WS] readyState:', this.ws ? this.ws.readyState : 'N/A');
            return;
        }

        const message = {
            type: action,
            payload: data || {}
        };
        const messageStr = JSON.stringify(message);
        console.log('[WS] Sending message:', messageStr);
        this.ws.send(messageStr);
        console.log('[WS] Message sent successfully');
    }

    public spin(bet: number): Promise<SpinResult> {
        return new Promise((resolve, reject) => {
            // console.log('[WS] spin() called with bet:', bet);

            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.error('[WS] spin failed: WebSocket not connected');
                reject(new Error('Not connected'));
                return;
            }

            const timeout = setTimeout(() => {
                console.error('[WS] spin timeout after 30 seconds');
                this.off('spin');
                this.off('error');
                reject(new Error('Spin timeout'));
            }, 30000);

            const cleanup = () => {
                clearTimeout(timeout);
                this.off('spin');
                this.off('error');
            };

            // Handle error messages from server
            this.on('error', (message: any) => {
                console.error('[WS] Received error message:', message);
                cleanup();
                reject(new Error(message.error || 'Server error'));
            });

            this.on('spin', (message: any) => {
                // console.log('[WS] spin handler received message:', message);
                cleanup();

                const result = message.payload || message;
                // console.log('[WS] spin result:', JSON.stringify(result, null, 2));
                console.log(result);
                if (result.success) {
                    resolve(result as SpinResult);
                } else {
                    reject(new Error(result.error || 'Spin failed'));
                }
            });

            console.log('[WS] Sending spin request with bet:', bet);
            this.send('spin', { bet });
        });
    }

    public getProfile(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('[WS] getProfile() called');

            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.error('[WS] getProfile failed: WebSocket not connected');
                reject(new Error('WebSocket not connected'));
                return;
            }

            const timeout = setTimeout(() => {
                console.error('[WS] getProfile timeout after 7 seconds');
                this.off('profile');
                reject(new Error('getProfile timeout'));
            }, 7000);

            this.on('profile', (message: any) => {
                // console.log('[WS] getProfile handler received message:', message);
                // console.log('[WS] message.payload:', message.payload);
                // console.log('[WS] message.data:', message.data);

                clearTimeout(timeout);
                this.off('profile');

                const result = message.payload || message.data;
                // console.log('[WS] getProfile resolving with:', JSON.stringify(result, null, 2));
                resolve(result);
            });

            console.log('[WS] Sending getProfile request with gameID:', this.gameId);
            this.send('getProfile', { gameID: this.gameId });
        });
    }

    public getLogs(options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('[WS] getLogs() called with options:', options);

            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.error('[WS] getLogs failed: WebSocket not connected');
                reject(new Error('WebSocket not connected'));
                return;
            }

            const timeout = setTimeout(() => {
                console.error('[WS] getLogs timeout after 10 seconds');
                this.off('getLogsResult');
                this.off('error');
                reject(new Error('getLogs timeout'));
            }, 10000);

            const cleanup = () => {
                clearTimeout(timeout);
                this.off('getLogsResult');
                this.off('error');
            };

            this.on('error', (message: any) => {
                console.error('[WS] getLogs error message:', message);
                cleanup();
                reject(new Error(message.error || 'getLogs failed'));
            });

            this.on('getLogsResult', (message: any) => {
                cleanup();
                const result = message.payload || message;
                resolve(result);
            });

            this.send('getLogs', options || {});
        });
    }

    public getLogDetail(id: number | string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('[WS] getLogDetail() called with id:', id);

            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                console.error('[WS] getLogDetail failed: WebSocket not connected');
                reject(new Error('WebSocket not connected'));
                return;
            }

            const timeout = setTimeout(() => {
                console.error('[WS] getLogDetail timeout after 10 seconds');
                this.off('getLogDetailResult');
                this.off('error');
                reject(new Error('getLogDetail timeout'));
            }, 10000);

            const cleanup = () => {
                clearTimeout(timeout);
                this.off('getLogDetailResult');
                this.off('error');
            };

            this.on('error', (message: any) => {
                console.error('[WS] getLogDetail error message:', message);
                cleanup();
                reject(new Error(message.error || 'getLogDetail failed'));
            });

            this.on('getLogDetailResult', (message: any) => {
                cleanup();
                const result = message.payload || message;
                resolve(result);
            });

            this.send('getLogDetail', { id });
        });
    }

    public ping(): void {
        this.send('ping');
    }

    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }

    public isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    protected onDestroy(): void {
        this.disconnect();
        WebSocketService.instance = null;
    }
}
