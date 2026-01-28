import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemCombo')
export class ItemCombo extends Component {
    @property(Label)
    comboLb: Label = null

    comboNb = 0
    init(comboNumber) {
        this.comboNb = comboNumber
        this.comboLb.string = "x" + comboNumber
    }
}

