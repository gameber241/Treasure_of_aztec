import { _decorator, Component, Node } from 'cc';
import { dataSymbol } from './dataSymbol';
import { SymbolFace } from '../Symbol';
const { ccclass, property } = _decorator;

@ccclass('ListDataSymbol')
export class ListDataSymbol extends Component {
    @property([dataSymbol])
    listData: dataSymbol[] = []


    public getIconByType(type: SymbolFace) {
        let x = this.listData.filter(e => e.type == type)[0]
        return x.icon
    }
}

