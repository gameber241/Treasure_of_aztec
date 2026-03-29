import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { ItemHistory } from './ItemHistory';
import { SymbolHis } from './SymbolHis';
const { ccclass, property } = _decorator;

@ccclass('ItemDetailHistory')
export class ItemDetailHistory extends Component {
    @property(Label)
    Balance: Label = null

    @property(Label)
    transaction: Label = null

    @property(Label)
    bet: Label = null

    @property(Label)
    profit: Label = null

    @property(Node)
    reels: Node[] = []

    @property(Prefab)
    symbolHis: Prefab = null

    SetUp(data) {
        console.log(data, "check")
        data.grid.forEach((e, index) => {
            e.grid.forEach(s => {
                console.log(s, "check")
                let item = instantiate(this.symbolHis)
                this.reels[index].addChild(item)
                item.getComponent(SymbolHis).InitSymbol(s)
            })
        })
    }
}

