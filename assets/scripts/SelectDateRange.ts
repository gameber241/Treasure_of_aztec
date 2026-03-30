import { _decorator, Color, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SelectDateRange')
export class SelectDateRange extends Component {
    @property(Node)
    button: Node[] = []


    btnClick(target, args) {
        console.log()
        this.button.forEach(e => {
            e.children[0].getComponent(Label).color = Color.WHITE
        })

        target.target.children[0].getComponent(Label).color = new Color(246, 186, 101)

        switch (args) {
            case 0:
                this.node.active = false
                break
            case 1:
                this.node.active = false
                break
            case 2:
                break
        }
    }
}


