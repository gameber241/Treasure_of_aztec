import { _decorator, Component, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
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

    private basePos: Vec3 = null;

    ScrollToCombo(comboNumber: number) {
        const spaceY = 100;

        // Lưu vị trí gốc của container (chỉ lưu 1 lần)
        if (!this.basePos) {
            this.basePos = this.containCombo.position.clone();
        }

        // 1. Tạo thêm combo nếu chưa đủ
        while (this.listCombo.length < comboNumber) {
            let newCombo = instantiate(this.comboPrefab);
            this.containCombo.addChild(newCombo);

            let index = this.listCombo.length;
            newCombo.setPosition(0, -index * spaceY, 0);

            let item = newCombo.getComponent(ItemCombo);
            item.init(index + 1);

            this.listCombo.push(newCombo);
        }

        // 2. Lấy combo cần focus
        let target = this.listCombo[comboNumber - 1];
        this.comboCurrent = target.getComponent(ItemCombo);

        // 3. Lấy vị trí local của combo đó
        let targetLocalPos = target.position;

        // 4. Tính vị trí mới cho container (không cộng dồn)
        let newPos = new Vec3(
            this.basePos.x - targetLocalPos.x,
            this.basePos.y - targetLocalPos.y,
            this.basePos.z
        );

        // 5. Tween cho mượt
        tween(this.containCombo)
            .to(0.25, { position: newPos }, { easing: 'quadOut' })
            .start();
    }

}

