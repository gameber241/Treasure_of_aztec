import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Paytable')
export class Paytable extends Component {
    btnClose() {
        this.node.active = false
    }

    Show() {
        this.node.active = true
    }
}

