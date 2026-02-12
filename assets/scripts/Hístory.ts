import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('H_story')
export class H_story extends Component {

    btnClose() {
        this.node.active = false
    }

    show() {
        this.node.active = true
    }
}

