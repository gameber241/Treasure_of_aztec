import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ItemCombo } from './ItemCombo';
const { ccclass, property } = _decorator;

@ccclass('ComboManager')
export class ComboManager extends Component {
    @property(Prefab)
    comboPrefab: Prefab = null

    @property(Node)
    containCombo: Node = null
    listCombo: Node[] = []


    protected start(): void {
        this.setUp()
    }

    comboCurrent: ItemCombo = null
    setUp() {
        this.listCombo = []
        let combox1 = instantiate(this.comboPrefab)
        this.listCombo.push(combox1)
        this.containCombo.addChild(combox1)
        combox1.getComponent(ItemCombo).init(1)
        this.comboCurrent = combox1.getComponent(ItemCombo)
    }
}

