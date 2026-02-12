import { _decorator, Component, ProgressBar, Label, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar = null!;


    @property(Node)
    startButton: Node = null!;

    private targetProgress: number = 0;
    private currentProgress: number = 0;
    private isLoaded: boolean = false;

    start() {
        this.startButton.active = false;
        this.loadGameplay();
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

        // smooth loading
        if (this.currentProgress < this.targetProgress) {
            this.currentProgress += dt; // tốc độ tăng
            if (this.currentProgress > this.targetProgress) {
                this.currentProgress = this.targetProgress;
            }
        }

        this.progressBar.progress = this.currentProgress;

        if (this.isLoaded && this.currentProgress >= 1) {
            this.progressBar.node.active = false
            this.startButton.active = true;
        }
    }

    onClickStart() {
        director.loadScene("game");
    }
}
