import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, UIOpacity, Vec3, director, resources, JsonAsset } from 'cc';
import { ReelBase } from '../ReelBase';
import { ComboManager } from '../ComboManager';
import { Symbol } from '../Symbol';
import { SymbolCell } from '../SymbolCell';
import { ESymbolFace } from '../ESymbolFace';
import { Spin } from '../Spin';
import { BigWin } from '../BigWin';
import { FreeSpines } from '../FreeSpines';
import { AutoCtrl } from '../AutoCtrl';
import { H_story } from '../History';
import { SoundToggle } from '../Sound';
import { EventBus } from '../EventBus';
import { UserInfo } from '../UserInfo';
import { WebSocketService } from '../WebSocketService';
import { Waymanager } from '../Waymanager';
import { TextBoxCombo } from './TextBoxCombo';
import { GameConfig } from '../GameConfig';
import { LabelBet } from '../LabelBet';
import { SoundManager } from '../SoundManager';




export const currencyFormatSimple = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const waitForSeconds = (s: number): Promise<void> => {
    // Dùng tween thay vì setTimeout để đồng bộ với engine game loop
    const tempObj = { v: 0 };
    return new Promise(resolve => {
        tween(tempObj)
            .delay(s)
            .call(() => resolve())
            .start();
    });
}
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: ReelBase })
    reels: ReelBase[] = []
    public static instance: GameManager = null
    public stoppedCount = 0

    @property(Label)
    walet: Label = null
    @property(Label)
    walletAuto: Label = null

    @property(Label)
    winLb: Label = null

    @property(Label)
    winLbAuto: Label = null

    @property(Label)
    betLb: Label = null

    @property(Label)
    betLbAuto: Label = null

    @property(Label)
    numberFreeSpin: Label = null

    @property(Node)
    headerNormal: Node = null

    @property(Node)
    headerFreeSpines: Node = null

    @property(Node)
    frameReel1Normal: Node = null

    @property(Node)
    frameReel1FreeSpin: Node = null

    @property(Node)
    footFreeSpin: Node = null

    @property(Node)
    walletNode: Node = null

    @property(Node)
    footer: Node

    @property(Node)
    optionSetting: Node = null

    @property(Node)
    bgBotNormal: Node = null

    @property(Node)
    bgFreeGame: Node = null

    @property(AutoCtrl)
    UiAuto: AutoCtrl = null
    isTurbo = false
    @property(Node)
    maskInf: Node = null

    turboMode = 0


    //data Freespin
    dataFreespin = null


    onLoad() {
        GameManager.instance = this
        // Listen to profile updates
        EventBus.getInstance().on('profile:updated', this.onProfileUpdated, this);
    }
    protected start(): void {
        this.UpdatePrice();
        this.UpdatePriceWin();
        this.SetNormal();
        this.initGrid();

        // Không show balance = 0 khi chưa có profile
        if (this.walet) this.walet.string = "--";
        if (this.ballanTitle) this.ballanTitle.string = "--";
        if (this.walletAuto) this.walletAuto.string = "--";

        this.scheduleOnce(() => {
            const wsService = WebSocketService.getInstance();
            if (wsService) {
                wsService.getProfile();
            }
        }, 0.1);
    }

    onProfileUpdated(payload: any): void {
        const balance = this.extractBalanceFromPayload(payload);

        if (balance !== null && !Number.isNaN(balance)) {
            this.isProfileLoaded = true;

            UserInfo.getInstance().updateBalance(balance);
            this.updateBalanceDisplay();
        } else {
            console.warn('[GameManager] Could not extract balance from payload');
        }
    }

    extractBalanceFromPayload(payload: any): number | null {

        if (!payload) {
            return null;
        }

        const data = payload.data ? payload.data : payload;

        // Check wallets array first
        const wallets = Array.isArray(data.wallets) ? data.wallets : [];

        if (wallets.length > 0 && wallets[0] && wallets[0].balance !== undefined) {
            return Number(wallets[0].balance);
        }

        // Check user.balance
        if (data.user && data.user.balance !== undefined) {
            // console.log('[GameManager] Found balance in data.user:', data.user.balance);
            return Number(data.user.balance);
        }

        // Check direct balance
        if (data.balance !== undefined) {
            return Number(data.balance);
        }

        console.warn('[GameManager] No balance found in payload');
        return null;
    }

    updateBalanceDisplay(): void {
        const balance = UserInfo.getInstance().balance;

        if (this.walet) {
            const formatted = balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            this.walet.string = formatted;
            this.ballanTitle.string = formatted;
            this.walletAuto.string = formatted;



        } else {
            console.warn('[GameManager] walet Label is null!');
        }
    }

    protected onDestroy(): void {
        EventBus.getInstance().off('profile:updated', this.onProfileUpdated);
    }

    symBolArray: Symbol[][]

    initGrid() {
        const cols = 7
        this.symBolArray = []
        for (let col = 0; col < cols; col++) {
            const rows = (col == 0) ? 4 : 5
            this.symBolArray[col] = Array.from(
                { length: rows },
                () => null
            )
        }
    }
    sampleJson = null;

    private isProfileLoaded: boolean = false;

    private pendingTotalWin: number = 0;
    private pendingWinAdded: boolean = false;
    private getSpinTotalWin(spinResult: any): number {
        const totalWin = Number(
            spinResult?.totalWin ??
            spinResult?.payload?.totalWin ??
            spinResult?.data?.totalWin ??
            spinResult?.payload?.batchSummary?.totalWin ??
            0
        );

        return Number.isFinite(totalWin) ? totalWin : 0;
    }

    private getCurrentBalance(): number {
        const balance = Number(UserInfo.getInstance().balance);
        return Number.isFinite(balance) ? balance : 0;
    }

    private subtractBetWhenSpin(): void {
        if (this.isFreeSpin) {
            return;
        }

        const currentBalance = this.getCurrentBalance();
        const bet = Number(this.betCurrent) || 0;
        const newBalance = currentBalance - bet;

        UserInfo.getInstance().updateBalance(newBalance);
        this.updateBalanceDisplay();

        console.log("[GameManager] Subtract bet:", {
            currentBalance,
            bet,
            newBalance,
        });
    }

    private addWinWhenSpinEnd(): void {
        if (this.pendingWinAdded) {
            return;
        }

        this.pendingWinAdded = true;

        const totalWin = Number(this.pendingTotalWin) || 0;

        if (totalWin <= 0) {
            console.log("[GameManager] No win to add");
            return;
        }

        const currentBalance = this.getCurrentBalance();
        const newBalance = currentBalance + totalWin;

        UserInfo.getInstance().updateBalance(newBalance);
        this.updateBalanceDisplay();

        console.log("[GameManager] Add win:", {
            currentBalance,
            totalWin,
            newBalance,
        });
    }

    private preparePendingWin(spinResult: any): void {
        this.pendingTotalWin = this.getSpinTotalWin(spinResult);
        this.pendingWinAdded = false;

        console.log("[GameManager] Pending total win:", this.pendingTotalWin);
    }
    indexCurrentReel = 0;
    public async PlaySpin() {
        if (!this.isProfileLoaded && !this.isFreeSpin) {
            console.warn("[GameManager] Profile not loaded yet, cannot spin");
            Spin.instance.ActiveSpin();
            return;
        }

        if (UserInfo.getInstance().balance < this.betCurrent && !this.isFreeSpin) {
            console.warn("[GameManager] Not enough balance");
            Spin.instance.ActiveSpin();
            return;
        }

        TextBoxCombo.instant.box.setAnimation(0, "textBox1_idle", true);

        // Nếu là round đầu tiên thì gọi server lấy kết quả spin
        if (this.indexCurrentReel === 0) {
            const useServerSpin = GameConfig.useServerSpin;

            if (useServerSpin === false) {
                await new Promise<void>((resolve, reject) => {
                    resources.load('test-spin-data', JsonAsset, (err, jsonAsset) => {
                        if (err) {
                            console.error("[GameManager] Failed to load test data:", err);
                            Spin.instance.ActiveSpin();
                            reject(err);
                            return;
                        }

                        const spinResult = jsonAsset.json;

                        if (spinResult.success) {
                            this.sampleJson = spinResult;

                            // Lưu tiền win để lát nữa quay xong mới cộng
                            this.preparePendingWin(spinResult);

                            // Trừ tiền cược ngay khi bắt đầu spin
                            this.subtractBetWhenSpin();

                            resolve();
                        } else {
                            console.error("[GameManager] Test data invalid");

                            if (this.isFreeSpin == true) return;

                            Spin.instance.ActiveSpin();
                            reject(new Error("Invalid test data"));
                        }
                    });
                });
            } else {
                try {
                    let wsService = WebSocketService.getInstance();

                    if (!wsService) {
                        console.warn("[GameManager] WebSocketService instance is null, trying to find persisted node");

                        const wsNode = director.getScene().getChildByName('WebSocketService');

                        if (wsNode) {
                            wsService = wsNode.getComponent(WebSocketService);
                        }
                    }

                    if (!wsService) {
                        console.error("[GameManager] WebSocketService not available");

                        if (this.isFreeSpin == true) return;

                        Spin.instance.ActiveSpin();
                        return;
                    }

                    const spinResult = await wsService.spin(this.betCurrent);

                    if (spinResult.success) {
                        this.sampleJson = spinResult;

                        // Lưu totalWin, chưa cộng ngay
                        this.preparePendingWin(spinResult);

                        // Server không tự trừ tiền nên client tự trừ khi spin
                        this.subtractBetWhenSpin();
                    } else {
                        console.error("[GameManager] Spin failed:", spinResult.error);

                        if (this.isFreeSpin == true) return;

                        Spin.instance.ActiveSpin();
                        return;
                    }
                } catch (error) {
                    console.error("[GameManager] Spin API error:", error);

                    if (this.isFreeSpin == true) return;

                    Spin.instance.ActiveSpin();
                    return;
                }
            }
        }

        this.SpinGame();
    }

    stepOld = 1
    SpinGame() {
        this.stepWinCurrent = 0
        this.UpdatePriceWin()
        TextBoxCombo.instant.playRandomText()
        this.stepOld = 1
        Spin.instance.isSpin = true
        // Total.instance.SetTextNormal()
        Waymanager.instance.resetWay()
        // this.Disabledbtns()
        const round = this.sampleJson.rounds[this.indexCurrentReel];

        this.SetNormal();
        const grid = round.grid;
        this.GenerateMap(grid);
    }

    UpdatePriceWin() {
        this.winLb.string = currencyFormatSimple.format(this.stepWinCurrent)
        this.winLbAuto.string = currencyFormatSimple.format(this.stepWinCurrent)

    }
    GenerateMap(grid: any[][]) {
        if (this.CheckScratch() == false)
            this.RollDataNormal(grid)
        else {
            this.RollDataScratch(grid)
        }
    }

    async RollDataScratch(grid) {
        const indexReel = this.CheckReelFull3Scratch();
        if (indexReel === this.reels.length - 1) {
            this.RollDataNormal(grid);
            return;
        }
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].startRoll();
        }
        await GameManager.waitForSeconds(this.GetTimeTurboScratchStart());


        let stopped = 0;
        const phase1 = indexReel + 1;
        for (let i = 0; i <= indexReel; i++) {
            let newRow = [...grid[i]];
            this.reels[i].stopRoll(grid[i])
            await GameManager.waitForSeconds(this.GetTimeTurboScratchStart());

            if (++stopped !== phase1) continue;
            this.stopPhase2(indexReel, grid);
            for (let j = 0; j <= indexReel; j++)
                this.reels[j].symbols
                    .forEach(e => {
                        if (e.face === ESymbolFace.SCRATCH && e.stackIndex == 0)
                            e.PlayIdleScratch();
                    });
            return


        }
    }

    private async stopPhase2(index: number, grid: any[]) {
        // Total.instance.setTextScratch()
        let current = index + 1;

        while (current < this.reels.length) {
            const reel = this.reels[current];
            reel.changeSpeed(0.07)
            // play animation scratch cho reel hiện tại
            this.playAnimReelScratch(current);
            // play idle scratch cho symbol
            reel.symbols.forEach(e => {
                if (e.face === ESymbolFace.SCRATCH && e.stackIndex === 0) {
                    // e.PlayIdleScratch();
                }
            });

            // đợi 4s
            await GameManager.waitForSeconds(this.GetTimeTurboScratchSpin());

            // stop reel
            reel.stopRoll(grid[current]);
            reel._delay = 0.04

            current++;
        }

        // Khi stop hết reel
        this.playAnimReelScratch(99);
        this.scheduleOnce(() => {
            this.ShowAllReef(true)
            this.scheduleOnce(() => {
                this.ClearData()
            }, 1)

        }, 0.4)
    }

    async RollDataNormal(grid) {
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            await GameManager.waitForSeconds(i == 0 ? 0 : this.GetTimeTurboStopSpin());
            this.reels[current].startRoll();
        }

        await GameManager.waitForSeconds(0.16);

        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].stopRoll(grid[i]);
            await GameManager.waitForSeconds(i == 0 ? 0 : this.GetTimeTurboStopSpin());
        }
        await GameManager.waitForSeconds(0.5);
        this.ClearData()


    }


    private resolveSymbolByPosition(c: number, r: number, expectedFace?: number) {
        const byGrid = this.symBolArray[c][r] as Symbol;
        if (byGrid && (expectedFace === undefined || byGrid.face === expectedFace)) {
            return byGrid;
        }

        const reel = this.reels[c];
        const byRow = reel?.symbols?.find(s => s?.node?.isValid && s.row === r) as Symbol;
        if (byRow && (expectedFace === undefined || byRow.face === expectedFace)) {
            this.symBolArray[c][r] = byRow;
            return byRow;
        }

        return null;
    }

    FlipData() {
        let dataRound = this.sampleJson.rounds[this.indexCurrentReel].flips;
        this.scheduleOnce(() => {
            SoundToggle.instance.PlayChangeSymbol()

        }, 0.7)
        dataRound.forEach(e => {
            const symbol = this.resolveSymbolByPosition(e.from.c, e.from.r);
            if (!symbol) return;
            symbol.FlipSymbol(e.to);
        });
    }

    stepWinCurrent = 0
    async ClearData() {
        const r = this.sampleJson.rounds[this.indexCurrentReel];

        if (r.win.positions.length > 0) {
            Waymanager.instance.animWay(r.win.ways)
            TextBoxCombo.instant.PlayStepWin(r.win.stepWin, this.stepOld)
            this.stepWinCurrent += r.win.stepWin
            this.UpdatePriceWin()
            this.removeWinDuplicateFlip(r)
            const flipPos = new Set(
                r.flips.map(f => `${f.from.c}_${f.from.r}`)
            );

            // dispose all win symbols except flip positions
            let disposeCount = 0;
            for (const e of r.win.positions) {
                const key = `${e.c}_${e.r}`;
                if (flipPos.has(key)) {
                    continue;
                }
                const symbol = this.resolveSymbolByPosition(e.c, e.r, e.i);
                if (!symbol) {
                    continue;
                }
                symbol.Dispose();
                disposeCount++;
            }

            SoundToggle.instance.PlaySymbolWin()
            this.stepOld = this.sampleJson.rounds[this.indexCurrentReel].multiplier
            ComboManager.instance.ScrollToCombo(this.sampleJson.rounds[this.indexCurrentReel].multiplier)
            await GameManager.waitForSeconds(1.1);

            if (r.flips.length > 0) {
                this.FlipData();
                await GameManager.waitForSeconds(2);
            }
            // Chỉ gọi AnimationWin cho các symbol thực sự win
            r.win.positions.forEach(pos => {
                const symbol = this.resolveSymbolByPosition(pos.c, pos.r, pos.i);
                if (symbol) {
                    symbol.AnimationWin();
                }
            });
            this.reels.forEach((reel, i) => {
                if (r.above[i] && r.above[i].length > 0) {
                    reel.cascadeDrop(r.above[i]);
                }
            });

            await GameManager.waitForSeconds(1);
        }
        if (r.hasNext) {
            this.indexCurrentReel++;
            await this.ClearData(); // ⭐ cực quan trọng
        }
        else {
            if (this.stepOld > 2) {
                TextBoxCombo.instant.box.setAnimation(0, "textBox3_idle", true)
            }
            else {
                TextBoxCombo.instant.box.setAnimation(0, "textBox1_idle", true)
            }

            this.ShowBigWin();

            // ComboManager.instantiate.total.node.active = false

        }
    }


    ShowBigWin() {
        const r = this.sampleJson.rounds[this.indexCurrentReel];
        const next = () => {
            // Quay/cascade/bigwin xong thì mới cộng tiền win
            this.addWinWhenSpinEnd();

            if (this.CheckScratch4() == true) {
                this.indexCurrentReel = 0;
                this.isFreeSpin = true;
                FreeSpines.instance.playAnimation(this.getFreeSpin(this.GetNumberScratch()));
            } else {
                if (this.isFreeSpin == true) {
                    this.indexCurrentReel = 0;
                    this.PlayModeFreeSpin();
                } else {
                    this.indexCurrentReel = 0;
                    Spin.instance.ActiveSpin();
                    this.SetNormal();
                    SoundToggle.instance.playNormal();
                }
            }
        };
        // danh sách animation cần chạy
        const winQueue: Array<() => void> = [];

        if (this.stepWinCurrent > 10 * this.betCurrent) {
            let step = 0
            if (this.stepWinCurrent < 15 * this.betCurrent) {
                step = this.stepWinCurrent
            }
            else {
                step = 10 * this.betCurrent
            }
            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                BigWin.instance.showBigWin(runNext, step);
            });
        }
        if (this.stepWinCurrent > 15 * this.betCurrent) {
            let step = 0
            if (this.stepWinCurrent < 25 * this.betCurrent) {
                step = this.stepWinCurrent
            }
            else {
                step = 10 * this.betCurrent
            }
            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                BigWin.instance.showSuperWin(runNext, step);
            });
        }
        if (this.stepWinCurrent > 25 * this.betCurrent) {
            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                BigWin.instance.showMegaWin(runNext, this.stepWinCurrent);
            });
        }

        // nếu không có animation nào
        if (winQueue.length === 0) {
            next();
            return;
        }

        let index = 0;

        const runNext = () => {
            if (index >= winQueue.length) {
                next();
                return;
            }

            const fn = winQueue[index];
            index++;
            fn();
        };
        // bắt đầu chạy queue
        runNext();
    }


    CheckScratch() {
        let indexScratch = 0
        this.sampleJson.rounds[this.indexCurrentReel].grid.forEach(reels => {
            reels.forEach(e => {
                if (e.i == ESymbolFace.SCRATCH) {
                    indexScratch++
                }
            })
        })
        return indexScratch >= 3
    }

    public CheckReelFull3Scratch() {
        let indexScratch = 0
        let grid = this.sampleJson.rounds[this.indexCurrentReel].grid
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j].i == ESymbolFace.SCRATCH) {
                    indexScratch++
                }
            }
            if (indexScratch >= 3) return i
        }
    }

    public CheckScratch4() {
        let indexScratch = 0
        this.reels.forEach(e => {
            e.symbols.forEach(s => {
                if (s.face == ESymbolFace.SCRATCH) {
                    indexScratch++;
                }
            })
        })
        if (indexScratch >= 4) return true;
    }


    public GetNumberScratch() {
        let indexScratch = 0
        this.reels.forEach(e => {
            e.symbols.forEach(s => {
                if (s.face == ESymbolFace.SCRATCH) {
                    indexScratch++;
                }
            })
        })
        return indexScratch
    }

    public playAnimReelScratch(index) {
        this.reels.forEach((e, i) => {
            if (i == index) {
                if (e.spinesEff)
                    e.spinesEff.enabled = true
                tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
            }
            else {
                if (e.spinesEff)
                    e.spinesEff.enabled = false
                tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 255 }).start()
            }
        })
    }



    ShowAllReef(iSpine = false) {
        this.reels.forEach((e, i) => {
            e.symbols.forEach(s => {
                if (s.face == ESymbolFace.SCRATCH && iSpine == false) {
                    s.playiconAnimation(s.getNameIdle(), true)
                }
            })
            tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
        })
    }
    isFree = false
    public SetNormal() {
        if (this.isFree == true) {
            SoundToggle.instance.playNormal()
            this.isFree = false
        }
        this.headerNormal.active = true
        this.headerFreeSpines.active = false
        this.frameReel1Normal.active = true
        this.frameReel1FreeSpin.active = false
        this.footFreeSpin.active = false
        this.walletNode.setPosition(0, -436)
        this.bgBotNormal.active = true
        this.bgFreeGame.active = false
    }

    public SetFreeSpines() {
        this.isFree = true
        this.headerNormal.active = false
        this.headerFreeSpines.active = true
        this.frameReel1Normal.active = false
        this.frameReel1FreeSpin.active = true
        this.footFreeSpin.active = true
        this.walletNode.setPosition(0, -679.364)
        this.bgBotNormal.active = false
        this.bgFreeGame.active = true
    }



    isShowSetting = false
    public ShowSetting() {
        if (this.isShowSetting == true) return
        this.isShowSetting = true
        this.footer.setPosition(0, -550)
        tween(this.footer).to(0.2, { position: new Vec3(0, -880) })
            .call(() => {
                this.isShowSetting = false
            })
            .start()
        this.optionSetting.setPosition(0, -880)
        tween(this.optionSetting).to(0.2, { position: new Vec3(0, -550) }).start()
    }
    isShowFooter = false
    public ShowFooter() {
        if (this.isShowFooter == true) return
        this.isShowFooter = true
        this.optionSetting.setPosition(0, -550)
        tween(this.optionSetting).to(0.2, { position: new Vec3(0, -880) })
            .call(() => {
                this.isShowFooter = false
            })
            .start()
        this.footer.setPosition(0, -880)
        tween(this.footer).to(0.2, { position: new Vec3(0, -550) }).start()
    }

    public ShowAuto() {
        this.UiAuto.show()
    }

    priceOffset = 2000
    priceMax = 20000
    BtnMinus() {
        this.betLb.node.getComponent(LabelBet).decreaseBet()

    }

    BtnPlus() {
        this.betLb.node.getComponent(LabelBet).increaseBet()

    }

    UpdatePrice() {
        // this.totalPrice.string = this.betCurrent.toString()
        // this.totalPriceBot.string = this.betCurrent.toString()
    }

    @property(Node) history: Node = null
    BtnHistory() {
        this.history.getComponent(H_story).show()
    }


    static waitForSeconds(s: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    GetTimeTurboStarSpin() {
        if (this.turboMode == 0) return 0.75
        if (this.turboMode == 1) return 0.25
        if (this.turboMode == 2) return 0
    }

    GetTimeTurboScratchStart() {
        if (this.turboMode == 0) return 0.2
        if (this.turboMode == 1) return 0
        if (this.turboMode == 2) return 0
    }

    GetTimeTurboStopSpin() {
        if (this.turboMode == 0) return 0.15
        if (this.turboMode == 1) {
            SoundToggle.instance.PlayScatchIdle()
            return 0
        }
        if (this.turboMode == 2) {
            SoundToggle.instance.PlayScatchIdle()
            return 0
        }
    }


    GetTimeTurboScratchSpin() {
        if (this.turboMode == 0) {
            SoundToggle.instance.PlayRollScatch()
            return 4
        }
        if (this.turboMode == 1) {
            return 0
        }
        if (this.turboMode == 2) {
            return 0
        }

    }


    removeWinDuplicateFlip(round: any) {
        if (!round?.win?.positions) return;

        // chỉ loại trùng lặp trong chính win.positions (không loại theo flip)
        const seen = new Set<string>();
        round.win.positions = round.win.positions.filter(p => {
            const key = `${p.c}_${p.r}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    @property(Node)
    ballanNode: Node = null

    @property(Label)
    ballanTitle: Label = null


    BtnBallan() {
        this.ballanNode.active = true
    }
    btnCloseBallan() {
        this.ballanNode.active = false

    }

    @property(Node)
    DatCuocNode: Node = null

    BtnCuoc() {
        this.DatCuocNode.active = true
    }

    onClickMap() {
        director.emit("HIDE_INF")
        this.maskInf.active = false
    }


    betCurrent = 0.6
    UpdateBetCurrent(bet) {
        this.betCurrent = bet
        this.betLb.node.getComponent(LabelBet).updateFromPanelBet()
        this.betLbAuto.node.getComponent(LabelBet).updateFromPanelBet()

    }
    isFreeSpin = false
    indexCurrentFreeSpin = 0
    totalFreeSpin = 0

    getFreeSpin(scratch: number): number {
        if (scratch < 4) return 0;
        this.totalFreeSpin += 10 + (scratch - 4) * 2;
        return this.totalFreeSpin
    }
    GetDataFreeSpin() {
        if (this.indexCurrentFreeSpin >= this.dataFreespin.payload.batchSpins.length) {
            return null
        }
        return this.dataFreespin.payload.batchSpins[this.indexCurrentFreeSpin]
    }

    PlayModeFreeSpin() {
        let dataFree = this.GetDataFreeSpin()
        if (dataFree == null) {
            FreeSpines.instance.ShowTotalSpin(() => {
                this.indexCurrentFreeSpin = 0
                this.isFreeSpin = false

                this.totalFreeSpin = 0
                this.dataFreespin = null
                Spin.instance.ActiveSpin()
                this.SetNormal();
                SoundToggle.instance.playNormal()
            }, this.dataFreespin.payload.batchSummary.totalWin);
            return;
        }
        this.SetFreeSpines()
        this.indexCurrentFreeSpin++
        this.totalFreeSpin--
        this.isFreeSpin = true
        TextBoxCombo.instant.box.setAnimation(0, "textBox1_idle", true)
        this.UpdatePriceWin()
        TextBoxCombo.instant.playRandomText()
        this.stepOld = 1
        Spin.instance.isSpin = true
        Waymanager.instance.resetWay()
        this.sampleJson = dataFree
        const grid = this.sampleJson.rounds[this.indexCurrentReel].grid;
        this.preparePendingWin(dataFree);
        FreeSpines.instance.UpdateFreeSpinLb(this.totalFreeSpin)
        this.GenerateMap(grid);
    }
}

