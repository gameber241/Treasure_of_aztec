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
    priceTienCuoc: Label = null

    @property(Label)
    priceWin: Label = null

    @property(Label)
    totalPrice: Label = null
    @property(Label)
    totalPriceBot: Label = null

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

    turboMode = 0
    onLoad() {
        GameManager.instance = this
        // Listen to profile updates
        EventBus.getInstance().on('profile:updated', this.onProfileUpdated, this);
    }
    protected start(): void {
        this.UpdatePrice()
        this.SetNormal()
        this.initGrid()
        // Update balance from UserInfo
        this.updateBalanceDisplay();

        // Request profile update after listener is registered
        this.scheduleOnce(() => {
            const wsService = WebSocketService.getInstance();
            if (wsService) {
                console.log('[GameManager] Requesting profile update after listener registration');
                wsService.getProfile();
            }
        }, 0.1);
    }

    onProfileUpdated(payload: any): void {
        console.log('[GameManager] ===== PROFILE UPDATED EVENT =====');
        console.log('[GameManager] Received payload:', JSON.stringify(payload, null, 2));

        const balance = this.extractBalanceFromPayload(payload);
        console.log('[GameManager] Extracted balance:', balance);

        if (balance !== null) {
            console.log('[GameManager] Updating UserInfo balance to:', balance);
            UserInfo.getInstance().updateBalance(balance);
            this.updateBalanceDisplay();
        } else {
            console.warn('[GameManager] Could not extract balance from payload');
        }
    }

    extractBalanceFromPayload(payload: any): number | null {
        // console.log('[GameManager] extractBalanceFromPayload - payload:', JSON.stringify(payload, null, 2));

        if (!payload) {
            console.log('[GameManager] Payload is null/undefined');
            return null;
        }

        const data = payload.data ? payload.data : payload;
        // console.log('[GameManager] Extracted data:', JSON.stringify(data, null, 2));

        // Check wallets array first
        const wallets = Array.isArray(data.wallets) ? data.wallets : [];
        // console.log('[GameManager] Wallets array:', wallets);

        if (wallets.length > 0 && wallets[0] && wallets[0].balance !== undefined) {
            // console.log('[GameManager] Found balance in wallets[0]:', wallets[0].balance);
            return Number(wallets[0].balance);
        }

        // Check user.balance
        if (data.user && data.user.balance !== undefined) {
            // console.log('[GameManager] Found balance in data.user:', data.user.balance);
            return Number(data.user.balance);
        }

        // Check direct balance
        if (data.balance !== undefined) {
            console.log('[GameManager] Found direct balance:', data.balance);
            return Number(data.balance);
        }

        console.warn('[GameManager] No balance found in payload');
        return null;
    }

    updateBalanceDisplay(): void {
        const balance = UserInfo.getInstance().balance;
        console.log('[GameManager] updateBalanceDisplay - balance from UserInfo:', balance);

        if (this.walet) {
            const formatted = balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            console.log('[GameManager] Setting walet.string to:', formatted);
            this.walet.string = formatted;
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

    indexCurrentReel = 0
    public async PlaySpin() {
        console.log("[GameManager] PlaySpin called - round " + this.indexCurrentReel);
        // If this is the first round, fetch spin result from server
        if (this.indexCurrentReel === 0) {
            const useServerSpin = GameConfig.useServerSpin; // Read from config
            if (useServerSpin === false) {
                // ===== TEST MODE: Using static JSON data =====
                // TODO: Switch back to server data after testing
                console.log("[GameManager] Loading TEST data from JSON file");

                // Convert callback to Promise and await it
                await new Promise<void>((resolve, reject) => {
                    resources.load('test-spin-data', JsonAsset, (err, jsonAsset) => {
                        if (err) {
                            console.error("[GameManager] Failed to load test data:", err);
                            Spin.instance.ActiveSpin();
                            reject(err);
                            return;
                        }
                        const spinResult = jsonAsset.json;
                        console.log("[GameManager] Using TEST data:", spinResult);

                        if (spinResult.success) {
                            this.sampleJson = spinResult;
                            console.log("[GameManager] Updated sampleJson with TEST data");

                            // Update balance
                            UserInfo.getInstance().updateBalance(UserInfo.getInstance().balance - this.priceCurrent + spinResult.totalWin);
                            this.updateBalanceDisplay();
                            resolve();
                        } else {
                            console.error("[GameManager] Test data invalid");
                            Spin.instance.ActiveSpin();
                            reject(new Error("Invalid test data"));
                        }
                    });
                });
            } else {
                try {
                    console.log("[GameManager] Calling spin API with bet:", this.priceCurrent);

                    // Get WebSocketService instance, try to find it if null
                    let wsService = WebSocketService.getInstance();
                    if (!wsService) {
                        console.warn("[GameManager] WebSocketService instance is null, trying to find persisted node");
                        const wsNode = director.getScene().getChildByName('WebSocketService');
                        if (wsNode) {
                            wsService = wsNode.getComponent(WebSocketService);
                            console.log("[GameManager] Found WebSocketService from persisted node");
                        }
                    }

                    if (!wsService) {
                        console.error("[GameManager] WebSocketService not available");
                        Spin.instance.ActiveSpin();
                        return;
                    }

                    const spinResult = await wsService.spin(this.priceCurrent);
                    console.log("[GameManager] Spin result received:", spinResult);

                    if (spinResult.success) {
                        this.sampleJson = spinResult;
                        console.log("[GameManager] Updated sampleJson with server data");

                        // Update balance
                        UserInfo.getInstance().updateBalance(UserInfo.getInstance().balance - this.priceCurrent + spinResult.totalWin);
                        this.updateBalanceDisplay();
                    } else {
                        console.error("[GameManager] Spin failed:", spinResult.error);
                        Spin.instance.ActiveSpin();
                        return;
                    }
                } catch (error) {
                    console.error("[GameManager] Spin API error:", error);
                    Spin.instance.ActiveSpin();
                    return;
                }
            }
        }

        // console.log(this.sampleJson.rounds[this.indexCurrentReel]);
        // if (this.sampleJson.rounds[this.indexCurrentReel].isScratch == true) {
        //     this.SetFreeSpines()
        //     this.PlayFreeSpin(this.sampleJson.rounds[this.indexCurrentReel].freeSpin)
        // }
        // else {
        //     this.SetNormal()
        // }
        // if (this.sampleJson.rounds.length > this.indexCurrentReel) {
        //     let dataRound = this.sampleJson.rounds[this.indexCurrentReel]
        //     // Server already sends reel 0 in display order (top-to-bottom)
        //     this.GenerateMap(dataRound.grid)
        //     ComboManager.instance.ScrollToCombo(dataRound.multiplier)
        // }
        this.SpinGame()
    }

    stepOld = 1
    SpinGame() {
        // TextBoxCombo.instant.playRandomText()
        this.stepOld = 1
        Spin.instance.isSpin = true
        // Total.instance.SetTextNormal()
        Waymanager.instance.resetWay()
        // this.Disabledbtns()
        const round = this.sampleJson.rounds[this.indexCurrentReel];
        // console.log("round", round)
        round.isScratch
            ? (this.SetFreeSpines(), this.PlayFreeSpin(round.freeSpin))
            : this.SetNormal();
        const grid = round.grid;
        this.GenerateMap(grid);
        if (round.isScratch == true && round.freeSpinCurrent > 0) {
            // this.currentFree.string = round.freeSpinCurrent
            // this.totalFree.string = round.freeSpinTotal

        }
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
            this.RollDataNormal(this);
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
                    e.PlayIdleScratch();
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
                if (this.sampleJson.rounds[this.indexCurrentReel].freeSpin > 0) {
                    SoundToggle.instance.playFreewin()
                    FreeSpines.instance.playAnimation(() => {

                        this.SetFreeSpines()
                        this.PlayFreeSpin(this.sampleJson.rounds[this.indexCurrentReel].freeSpin)
                        this.scheduleOnce(() => {
                            this.ClearData()
                        }, 2)
                    })
                }
                else {
                    this.ClearData()

                }
            }, 1)

        }, 0.4)
    }

    async RollDataNormal(grid) {
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            await GameManager.waitForSeconds(i == 0 ? 0 : this.GetTimeTurboStopSpin());
            this.reels[current].startRoll();
        }
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


    async ClearData() {
        const r = this.sampleJson.rounds[this.indexCurrentReel];
        Waymanager.instance.animWay(r.win.ways)

        if (r.win.positions.length > 0) {
            console.log('[ClearData] win.positions BEFORE removeWinDuplicateFlip:', r.win.positions.length);
            TextBoxCombo.instant.PlayStepWin(r.win.stepWin, this.stepOld)
            this.removeWinDuplicateFlip(r)
            console.log('[ClearData] win.positions AFTER removeWinDuplicateFlip:', r.win.positions.length);
            const flipPos = new Set(
                r.flips.map(f => `${f.from.c}_${f.from.r}`)
            );
            console.log('[ClearData] Flip positions:', Array.from(flipPos));

            // dispose all win symbols except flip positions
            let disposeCount = 0;
            for (const e of r.win.positions) {
                const key = `${e.c}_${e.r}`;
                if (flipPos.has(key)) {
                    console.log(`[ClearData] Skip dispose for flip position: ${key}`);
                    continue;
                }
                const symbol = this.resolveSymbolByPosition(e.c, e.r, e.i);
                if (!symbol) {
                    console.log(`[ClearData] Symbol not found at ${key}`);
                    continue;
                }
                console.log(`[ClearData] Disposing symbol at ${key}`);
                symbol.Dispose();
                disposeCount++;
            }
            console.log(`[ClearData] Total disposed: ${disposeCount} out of ${r.win.positions.length}`);

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
            // ComboManager.instantiate.total.node.active = false
            this.ShowBigWin();
        }
    }


    ShowBigWin() {
        const r = this.sampleJson.rounds[this.indexCurrentReel];
        const next = () => {
            this.indexCurrentReel = 0;
            if (r.isScratch === true && r.freeSpinCurrent > 1) {
                this.SetFreeSpines()
                this.PlaySpin();
            }
            else {
                Spin.instance.ActiveSpin()
                this.SetNormal();
                SoundToggle.instance.playNormal()
                if (Spin.instance.isAuto == true) {
                    Spin.instance.AutoSpinNext()
                }
                else {
                    Spin.instance.isSpin = false;
                }
            }

        };
        // danh sách animation cần chạy
        const winQueue: Array<() => void> = [];

        if (r.BigWin) {

            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                BigWin.instance.showBigWin(runNext, r.BigWin);
            });
        }

        if (r.SuperWin) {

            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                BigWin.instance.showSuperWin(runNext, r.SuperWin);
            });
        }

        if (r.MegaWin) {

            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                BigWin.instance.showMegaWin(runNext, r.MegaWin);
            });
        }

        // total win
        if (r.totalPrice > 0 && r.isScratch) {


            winQueue.push(() => {
                SoundToggle.instance.playBigWin()
                FreeSpines.instance.ShowTotalSpin(() => {
                    runNext();
                }, 4000);
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


    public PlayFreeSpin(round) {
        FreeSpines.instance.UpdateRound(round)
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
    priceCurrent = 10000
    priceMax = 20000
    BtnMinus() {
        if (this.priceCurrent > this.priceOffset) {
            this.priceCurrent -= this.priceOffset
            this.UpdatePrice()
        }
    }

    BtnPlus() {
        if (this.priceCurrent < this.priceMax) {
            this.priceCurrent += this.priceOffset
            this.UpdatePrice()
        }
    }

    UpdatePrice() {
        this.totalPrice.string = this.priceCurrent.toString()
        this.totalPriceBot.string = this.priceCurrent.toString()
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
}

