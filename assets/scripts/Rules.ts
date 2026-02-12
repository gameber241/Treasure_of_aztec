import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Rules')
export class Rules extends Component {
    btnClose() {
        this.node.active = false
    }

    Show() {
        this.node.active = true
    }
}

