import { _decorator, Component, Node } from 'cc';
import { dataSymbol } from './dataSymbol';
import { SymbolFace } from '../Symbol';
const { ccclass, property } = _decorator;

@ccclass('ListDataSymbol')
export class ListDataSymbol extends Component {
    @property([dataSymbol])
    listData: dataSymbol[] = []


    public getIconByType(type: SymbolFace) {
        console.log(type)
        const x = this.listData.find(e => e.type === type)!;
        return x.icon;
    }

}

