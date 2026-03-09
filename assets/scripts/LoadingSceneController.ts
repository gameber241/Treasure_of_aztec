import { _decorator, Component, ProgressBar, Label, Node, director } from 'cc';
import { AuthService } from './AuthService';
import { WebSocketService } from './WebSocketService';
import { GameConfig } from './GameConfig';
import { UserInfo } from './UserInfo';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar = null!;


    @property(Node)
    startButton: Node = null!;

    @property(Label)
    statusLabel: Label = null;

    private targetProgress: number = 0;
    private currentProgress: number = 0;
    private isLoaded: boolean = false;
    private isLoggedIn: boolean = false;
    private authService: AuthService = null;
    private wsService: WebSocketService = null;

    start() {
        this.startButton.active = false;
        this.authService = AuthService.getInstance();

        // Initialize WebSocketService if not exists
        if (!WebSocketService.getInstance()) {
            const wsNode = new Node('WebSocketService');
            wsNode.addComponent(WebSocketService);
            director.addPersistRootNode(wsNode); // Persist across scenes
            console.log('[Loading] WebSocketService component created and persisted');
        }

        console.log('[Loading] Starting auto login process');
        this.performAutoLogin();
    }

    loadGameplay() {
        director.preloadScene("game", (completedCount, totalCount) => {

            this.targetProgress = completedCount / totalCount;

        }, () => {

            // preload xong
            this.targetProgress = 1;
            this.isLoaded = true;

        });
    }

    update(dt: number) {
        // Fast loading - increase by 2x speed
        if (this.currentProgress < this.targetProgress) {
            this.currentProgress += dt * 2;
            if (this.currentProgress > this.targetProgress) {
                this.currentProgress = this.targetProgress;
            }
        }

        this.progressBar.progress = this.currentProgress;

        if (this.isLoaded && this.currentProgress >= 1) {
            this.progressBar.node.active = false;
            this.startButton.active = true;
        }
    }

    async performAutoLogin() {
        if (this.statusLabel) {
            this.statusLabel.string = 'Đang đăng nhập...';
        }

        try {
            const loginResult = await this.authService.autoLogin();

            if (loginResult.success && loginResult.token) {
                // console.log('[Loading] Auto login successful');
                if (this.statusLabel) {
                    this.statusLabel.string = 'Đang kết nối...';
                }

                // Connect to WebSocket
                this.wsService = WebSocketService.getInstance();
                if (this.wsService) {
                    await this.wsService.connect(GameConfig.url_ws, loginResult.token);
                    // console.log('[Loading] WebSocket connected, waiting 500ms for server to be ready...');

                    // Wait a bit for server to finish connection setup
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Fetch user profile
                    try {
                        // console.log('[Loading] Calling getProfile()...');
                        const profile = await this.wsService.getProfile();
                        // console.log('[Loading] Profile loaded:', JSON.stringify(profile, null, 2));
                        UserInfo.getInstance().updateProfile(profile);
                        // console.log('[Loading] UserInfo updated, balance:', UserInfo.getInstance().balance);
                    } catch (error) {
                        console.warn('[Loading] Failed to load profile:', error);
                    }
                }

                this.isLoggedIn = true;
                if (this.statusLabel) {
                    this.statusLabel.string = 'Sẵn sàng!';
                }

                // Set progress to 100% immediately
                this.targetProgress = 1;
                this.currentProgress = 1;
                this.isLoaded = true;
            } else {
                console.error('[Loading] Auto login failed:', loginResult.error);
                if (this.statusLabel) {
                    this.statusLabel.string = 'Đăng nhập thất bại: ' + (loginResult.error || 'Unknown error');
                }
            }
        } catch (error) {
            console.error('[Loading] Auto login error:', error);
            if (this.statusLabel) {
                this.statusLabel.string = 'Lỗi đăng nhập: ' + error.message;
            }
        }
    }

    onClickStart() {
        if (this.isLoggedIn && this.isLoaded) {
            director.loadScene("game");
        }
    }
}
