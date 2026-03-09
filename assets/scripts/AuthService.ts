import { GameConfig } from './GameConfig';

export interface LoginResponse {
    success: boolean;
    token?: string;
    error?: string;
    user?: {
        id: number;
        username: string;
        balance: number;
    };
}

export class AuthService {
    private static instance: AuthService = null;
    private token: string = '';
    private userId: number = 0;

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async autoLogin(): Promise<LoginResponse> {
        if (!GameConfig.autoLogin.enabled) {
            return { success: false, error: 'Auto login is disabled' };
        }

        console.log('[Auth] Auto login starting...');
        return this.login(
            GameConfig.autoLogin.username,
            GameConfig.autoLogin.password
        );
    }

    private async generateSignature(secretKey: string, payload: string): Promise<string> {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(payload);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const hashArray = Array.from(new Uint8Array(signature));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    public async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const url = `${GameConfig.url_api}/api/user/login`;
            console.log('[Auth] Logging in to:', url);

            const body = { username, password };
            const rawBody = JSON.stringify(body);
            const timestamp = Date.now().toString();
            const method = 'POST';
            const pathname = '/api/user/login';
            const payload = `${method}|${pathname}|${timestamp}|${rawBody}`;

            const signature = await this.generateSignature(GameConfig.autoLogin.secretKey, payload);

            console.log('[Auth] Debug info:');
            console.log('  API Key:', GameConfig.autoLogin.apiKey);
            console.log('  Timestamp:', timestamp);
            console.log('  Payload:', payload);
            console.log('  Signature:', signature);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': GameConfig.autoLogin.apiKey,
                    'X-Signature': signature,
                    'X-Timestamp': timestamp
                },
                body: rawBody
            });

            const response_data = await response.json();
            console.log('[Auth] Login response:', response_data);

            // Server trả về format: {success: true, data: {message, token, user}}
            if (response_data.success && response_data.data) {
                const data = response_data.data;
                this.token = data.token;
                this.userId = data.user?.userId || data.user?.id || 0;
                console.log('[Auth] Login successful, token:', this.token.substring(0, 20) + '...');
                return {
                    success: true,
                    token: data.token,
                    user: data.user
                };
            } else {
                console.error('[Auth] Login failed:', response_data.data?.error || response_data.error);
                return { success: false, error: response_data.data?.error || response_data.error || 'Login failed' };
            }

        } catch (error) {
            console.error('[Auth] Login error:', error);
            return { success: false, error: error.message || 'Network error' };
        }
    }

    public getToken(): string {
        return this.token;
    }

    public getUserId(): number {
        return this.userId;
    }

    public isLoggedIn(): boolean {
        return !!this.token;
    }

    public logout(): void {
        this.token = '';
        this.userId = 0;
    }
}
