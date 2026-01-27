import { _decorator, Component, Node, Prefab } from 'cc';
import { ListDataSymbol } from '../data/ListDataSymbol';
const { ccclass, property } = _decorator;

@ccclass('PrefabManager')
export class PrefabManager extends Component {
    @property({ type: Prefab })
    dataSymbls: Prefab = null
}

