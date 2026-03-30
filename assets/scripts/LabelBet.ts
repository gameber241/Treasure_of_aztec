import { _decorator, CCFloat, Component, Label, Node } from 'cc';
import { MessageBox } from './MessageBox';
import { PopEffect } from './PopEffect';
import { PanelBet } from './PanelBet';
import { currencyFormat } from './Helper';
const { ccclass, property } = _decorator;

@ccclass('LabelBet')
export class LabelBet extends Component {

    @property(MessageBox)
    messageBox: MessageBox = null;

    @property(CCFloat)
    betAmount: number = 12;

    @property(CCFloat)
    stepBet: number = 4;

    @property(CCFloat)
    minBet: number = 4;

    @property(CCFloat)
    maxBet: number = 40;

    protected start(): void {
        this.updateFromPanelBet();
    }

    increaseBet() {
        this.betAmount += this.stepBet;
        this.node.getComponent(PopEffect).play();
        this.messageBox.hideMessage();
        if (this.betAmount > this.maxBet) {
            this.betAmount = this.maxBet;
            this.messageBox.showMessage("Mức cược tối đa");
        }
        this.node.getComponent(Label).string = currencyFormat.format(this.betAmount);
    }

    decreaseBet() {
        this.betAmount -= this.stepBet;
        this.node.getComponent(PopEffect).play();
        this.messageBox.hideMessage();
        if (this.betAmount < this.minBet) {
            this.betAmount = this.minBet;
            this.messageBox.showMessage("Mức cược tối thiểu");
        }
        this.node.getComponent(Label).string = currencyFormat.format(this.betAmount);
    }

    updateFromPanelBet() {
        this.minBet = PanelBet.instance.minBet;
        this.maxBet = PanelBet.instance.maxBet;
        this.betAmount = PanelBet.instance.betAmount;
        this.stepBet = PanelBet.instance.betSize;
        this.node.getComponent(Label).string = currencyFormat.format(this.betAmount);
        console.log(this.betAmount, this.stepBet)
    }
}

