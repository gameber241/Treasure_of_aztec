import { _decorator, CCFloat, Component, Label, Node } from 'cc';
import { MessageBox } from './MessageBox';
import { PopEffect } from './PopEffect';
import { PanelBet } from './PanelBet';
import { currencyFormatSimple } from './Manager/GameManager';
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
        const panel = PanelBet.instance;
        if (!panel) return;

        const list = panel.betAmounts;
        let index = list.indexOf(this.betAmount);

        if (index < list.length - 1) {
            index++;
            this.betAmount = list[index];
            this.messageBox.hideMessage();
        } else {
            this.messageBox.showMessage("Mức cược tối đa");
        }

        this.node.getComponent(PopEffect)?.play();
        this.updateLabel();
    }

    decreaseBet() {
        const panel = PanelBet.instance;
        if (!panel) return;

        const list = panel.betAmounts;
        let index = list.indexOf(this.betAmount);

        if (index > 0) {
            index--;
            this.betAmount = list[index];
            this.messageBox.hideMessage();
        } else {
            this.messageBox.showMessage("Mức cược tối thiểu");
        }

        this.node.getComponent(PopEffect)?.play();
        this.updateLabel();
    }

    updateFromPanelBet() {
        this.minBet = PanelBet.instance.minBet;
        this.maxBet = PanelBet.instance.maxBet;
        this.betAmount = PanelBet.instance.betAmount;
        this.stepBet = PanelBet.instance.betSize;
        this.node.getComponent(Label).string = currencyFormatSimple.format(this.betAmount);
        console.log(this.betAmount, this.stepBet)
    }

    updateLabel() {
        this.node.getComponent(Label).string = currencyFormatSimple.format(this.betAmount);
    }
}

