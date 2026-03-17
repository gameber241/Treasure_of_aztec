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
import { H_story } from '../Hístory';
import { SoundToggle } from '../Sound';
import { EventBus } from '../EventBus';
import { UserInfo } from '../UserInfo';
import { WebSocketService } from '../WebSocketService';
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
    }

    onProfileUpdated(payload: any): void {
        // console.log('[GameManager] ===== PROFILE UPDATED EVENT =====');
        // console.log('[GameManager] Received payload:', JSON.stringify(payload, null, 2));

        const balance = this.extractBalanceFromPayload(payload);
        console.log('[GameManager] Extracted balance:', balance);

        if (balance !== null) {
            // console.log('[GameManager] Updating UserInfo balance to:', balance);
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
        // console.log('[GameManager] updateBalanceDisplay - balance from UserInfo:', balance);

        if (this.walet) {
            const formatted = balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            // console.log('[GameManager] Setting walet.string to:', formatted);
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
        const cols = 7;  // 7 columns (reels)
        const rows = 5;  // max 5 rows per reel

        this.symBolArray = Array.from({ length: cols }, () =>
            Array.from({ length: rows }, () => null)
        );
    }

    sampleJson = null

    indexCurrentReel = 0
    public async PlaySpin() {
        console.log("[GameManager] PlaySpin called - round " + this.indexCurrentReel);

        // If this is the first round, fetch spin result from server
        if (this.indexCurrentReel === 0) {
            const testMode = false; // Set to false to use real server data
            if (testMode) {
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


    SpinGame() {
        Spin.instance.isSpin = true
        // Total.instance.SetTextNormal()

        // this.Disabledbtns()
        const round = this.sampleJson.rounds[this.indexCurrentReel];
        console.log(round)
        round.isScratch
            ? (this.SetFreeSpines(), this.PlayFreeSpin(round.freeSpin))
            : this.SetNormal();
        this.GenerateMap(round.grid);
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

    RollDataScratch(grid) {
        // let indexReel = this.CheckReelFull3Scratch()
        // if (indexReel == this.reels.length - 1) {
        //     this.RollDataNormal(this)
        // }
        // else {
        //     this.reels.forEach((reel, i) => {
        //         this.scheduleOnce(() => {
        //             reel.startRoll();

        //         }, (this.isTurbo == false) ? 0.3 : 0.16)
        //     });
        //     let stoppedPhase1 = 0;
        //     let phase1Count = indexReel + 1;
        //     for (let i = 0; i <= indexReel; i++) {
        //         this.reels[i].setOnFullyStopped(() => {
        //             stoppedPhase1++;
        //             if (stoppedPhase1 === phase1Count) {
        //                 this.stopPhase2(indexReel, grid);
        //                 for (let j = 0; j <= indexReel; j++) {
        //                     this.reels[j].symbols.forEach(e => {
        //                         if (e.face == ESymbolFace.SCRATCH) {
        //                             e.PlayIdleScratch()
        //                         }
        //                     })
        //                 }
        //             }
        //         });
        //         this.scheduleOnce(() => {
        //             this.reels[i].stopRoll(grid[i]);
        //         }, (this.isTurbo == false) ? (1 + 0.3 * i) : (0.16 + 0.16 * i))
        //     }

        // }

    }
    private stopPhase2(index: number, grid) {
        // let current = index + 1;
        // this.playAnimReelScratch(current)
        // SoundToggle.instance.PlayRollScatch()

        // let time = 4
        // const stopNext = () => {
        //     const reel = this.reels[current];
        //     reel.setOnFullyStopped(() => {
        //         current++;
        //         reel.symbols.forEach(e => {
        //             if (e.face == ESymbolFace.SCRATCH) {
        //                 e.PlayIdleScratch()
        //             }
        //         })
        //         if (current >= this.reels.length) {
        //             this.playAnimReelScratch(99)
        //             this.scheduleOnce(() => {
        //                 if (this.sampleJson.rounds[this.indexCurrentReel].freeSpin > 0) {
        //                     this.ShowAllReef(true)

        //                 }
        //                 else {
        //                     this.ShowAllReef()

        //                 }
        //                 this.scheduleOnce(() => {
        //                     if (this.sampleJson.rounds[this.indexCurrentReel].freeSpin > 0) {
        //                         SoundToggle.instance.playFreewin()
        //                         FreeSpines.instance.playAnimation(() => {

        //                             this.SetFreeSpines()
        //                             this.PlayFreeSpin(this.sampleJson.rounds[this.indexCurrentReel].freeSpin)
        //                             this.scheduleOnce(() => {
        //                                 this.ClearData()

        //                             }, 2)
        //                         })
        //                     }
        //                     else {
        //                         this.ClearData()

        //                     }
        //                 }, 1)

        //             }, 0.4)
        //             return;
        //         }
        //         SoundToggle.instance.PlayRollScatch()

        //         this.playAnimReelScratch(current)
        //         this.scheduleOnce(() => {
        //             stopNext();
        //         }, time)

        //     });

        //     reel.stopRoll(grid[current]);
        // };
        // this.scheduleOnce(() => {
        //     stopNext();
        // }, time)
    }

    async RollDataNormal(grid) {
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].startRoll();
        }
        await GameManager.waitForSeconds(this.GetTimeTurboStarSpin());
        for (let i = 0; i < this.reels.length; i++) {
            let current = i;
            this.reels[current].stopRoll(grid[i]);
            await GameManager.waitForSeconds(this.GetTimeTurboStopSpin());
        }
        await GameManager.waitForSeconds(0.5);
        // this.ClearData()


    }


    FlipData(onComplete?: () => void) {
        let dataRound = this.sampleJson.rounds[this.indexCurrentReel].flips;
        if (!dataRound || dataRound.length === 0) {
            onComplete?.();
            return;
        }
        let completed = 0;
        this.scheduleOnce(() => {
            SoundToggle.instance.PlayChangeSymbol()

        }, 0.7)
        dataRound.forEach(e => {
            const symbol = this.symBolArray[e.from.c][e.from.r];
            symbol.FlipSymbol(e.to, () => {
                completed++;
                if (completed === dataRound.length) {
                    onComplete?.();
                }
            });
        });
    }


    async ClearData() {
        await GameManager.waitForSeconds(0.05);

        const r = this.sampleJson.rounds[this.indexCurrentReel];
        this.reels.forEach(e => {
            e.symbols.forEach(e => {
                e.ShowMask()
            })
        })
        // Win animation delay từng symbol
        for (let i = 0; i < r.win.positions.length; i++) {
            const e = r.win.positions[i];
            this.symBolArray[e.c][e.r].AnimationWin();
            await GameManager.waitForSeconds(0.05);
        }

        if (r.flips.length) {
            this.FlipData();
        }
        // dispose sau khi animation xong
        for (const e of r.win.positions) {
            this.symBolArray[e.c][e.r].Dispose();
        }

        SoundToggle.instance.PlaySymbolWin()
        ComboManager.instance.ScrollToCombo(this.sampleJson.rounds[this.indexCurrentReel].multiplier)

        await GameManager.waitForSeconds(1.1);
        this.reels.forEach(e => {
            e.symbols.forEach(e => {
                e.AnimationWin()
            })
        })
        this.reels.forEach((reel, i) => reel.cascadeDrop(r.above[i]));

        await GameManager.waitForSeconds(1);
        if (r.hasNext) {

            this.indexCurrentReel++;
            // await this.ClearData(); // ⭐ cực quan trọng
        }
        else {
            // ComboManager.instantiate.total.node.active = false
            // this.ShowBigWin();
        }
    }

    // ShowBigWin() {
    //     if (this.sampleJson.rounds[this.indexCurrentReel].BigWin > 0) {
    //         SoundToggle.instance.playBigWin()
    //         BigWin.instance.showBigWin(() => {

    //             if (this.sampleJson.rounds[this.indexCurrentReel].MegaWin > 0) {
    //                 SoundToggle.instance.playBigWin()

    //                 BigWin.instance.showMegaWin(() => {

    //                     if (this.sampleJson.rounds[this.indexCurrentReel].SuperWin > 0) {
    //                         SoundToggle.instance.playBigWin()

    //                         BigWin.instance.showSuperWin(() => {

    //                             this.CheckContinueSpin()
    //                         }, this.sampleJson.rounds[this.indexCurrentReel].SuperWin)
    //                     }
    //                     else {
    //                         this.CheckContinueSpin()
    //                     }
    //                 }, this.sampleJson.rounds[this.indexCurrentReel].MegaWin)
    //             }
    //             else {
    //                 this.CheckContinueSpin()
    //             }
    //         }, this.sampleJson.rounds[this.indexCurrentReel].BigWin)
    //     }
    //     else {
    //         if (this.sampleJson.rounds[this.indexCurrentReel].totalPrice && this.sampleJson.rounds[this.indexCurrentReel].totalPrice > 0 && this.sampleJson.rounds[this.indexCurrentReel].isScratch) {
    //             SoundToggle.instance.playTotalWin()
    //             FreeSpines.instance.ShowTotalSpin(() => {
    //                 SoundToggle.instance.stopTotalWIn()
    //                 this.CheckContinueSpin()
    //             }, 4000)
    //         }
    //         else {
    //             this.CheckContinueSpin()

    //         }

    //     }
    // }




    CheckContinueSpin() {
        if (Spin.instance.isAuto == false) {
            if (this.sampleJson.rounds.length - 1 > this.indexCurrentReel) {
                // Has next round (cascade) - don't spin again, just process next round
                this.indexCurrentReel++
                console.log('[CheckContinueSpin] Processing cascade round:', this.indexCurrentReel);
                this.scheduleOnce(() => {
                    this.ClearData();
                }, 0.5);
            }
            else {
                Spin.instance.ActiveSpin()
                this.indexCurrentReel = 0
                this.SetNormal()
            }
        }
        else {
            Spin.instance.CheckAuto()
        }
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
        // this.reels.forEach((e, i) => {
        //     e.symbols.forEach(s => {
        //         if (s.face == ESymbolFace.SCRATCH && iSpine == false) {
        //             s.playAnimation(s.getNameIdle(), true)
        //         }
        //     })
        //     tween(e.maskEff.getComponent(UIOpacity)).to(0.3, { opacity: 0 }).start()
        // })
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
    }

    public SetFreeSpines() {
        this.isFree = true
        this.headerNormal.active = false
        this.headerFreeSpines.active = true
        this.frameReel1Normal.active = false
        this.frameReel1FreeSpin.active = true
        this.footFreeSpin.active = true
        this.walletNode.setPosition(0, -679.364)

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
        if (this.turboMode == 0) return 0.3
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
}

