import { _decorator, Component, Node } from 'cc';
import { Spin } from './Spin';
import { GameManager } from './Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('BtnSetting')
export class BtnSetting extends Component {
    btnClick = false
    onClick() {
        if (Spin.instance.isSpin == true) return
        if (this.btnClick == true) return
        this.btnClick = true
        // GameManager.instance.ShowSpin()

    }
}

