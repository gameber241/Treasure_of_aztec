import { _decorator, Component, Label, Node, Prefab, instantiate, Button } from 'cc';
const { ccclass, property } = _decorator;

enum ESelectType {
    YEAR,
    MONTH,
    DAY
}

@ccclass('SelectDate')
export class SelectDate extends Component {

    @property(Label) yearStart: Label = null;
    @property(Label) yearEnd: Label = null;

    @property(Label) MonthStart: Label = null;
    @property(Label) MonthEnd: Label = null;

    @property(Label) DayStart: Label = null;
    @property(Label) DayEnd: Label = null;

    // START
    @property(Node) containtYearStart: Node = null;
    @property(Node) containtMonthStart: Node = null;
    @property(Node) containtDayStart: Node = null;

    // END
    @property(Node) containtYearEnd: Node = null;
    @property(Node) containtMonthEnd: Node = null;
    @property(Node) containtDayEnd: Node = null;

    @property(Prefab) boxTime: Prefab = null;

    protected onEnable(): void {
        this.init();
    }

    // ===== INIT =====
    init() {
        const now = new Date();

        this.setStartDate(now);
        this.setEndDate(now);

        this.clearAll();
        this.hideAll();

        const year = now.getFullYear();

        // Year chỉ 2 giá trị
        this.genYears(this.containtYearStart, year, true);
        this.genYears(this.containtYearEnd, year, false);

        // Month full 12
        this.genMonths(this.containtMonthStart, true);
        this.genMonths(this.containtMonthEnd, false);

        // Day full 31
        this.genDays(this.containtDayStart, true);
        this.genDays(this.containtDayEnd, false);
    }

    // ===== GENERATE =====
    genYears(parent: Node, currentYear: number, isStart: boolean) {
        const years = [currentYear, currentYear - 1];

        for (let y of years) {
            this.createItem(parent, `${y}`, ESelectType.YEAR, isStart);
        }
    }

    genMonths(parent: Node, isStart: boolean) {
        for (let m = 12; m >= 1; m--) {
            this.createItem(parent, this.format(m), ESelectType.MONTH, isStart);
        }
    }

    genDays(parent: Node, isStart: boolean) {
        for (let d = 31; d >= 1; d--) {
            this.createItem(parent, this.format(d), ESelectType.DAY, isStart);
        }
    }

    // ===== CREATE ITEM =====
    createItem(parent: Node, value: string, type: ESelectType, isStart: boolean) {
        const item = instantiate(this.boxTime);
        item.setParent(parent);

        const label = item.getComponentInChildren(Label);
        if (label) label.string = value;

        const btn = item.getComponent(Button);
        if (btn) {
            btn.node.on(Button.EventType.CLICK, () => {
                this.onSelect(value, type, isStart);
            });
        }
    }

    // ===== SELECT =====
    onSelect(value: string, type: ESelectType, isStart: boolean) {
        if (isStart) {
            if (type === ESelectType.YEAR) this.yearStart.string = value;
            if (type === ESelectType.MONTH) this.MonthStart.string = value;
            if (type === ESelectType.DAY) this.DayStart.string = value;
        } else {
            if (type === ESelectType.YEAR) this.yearEnd.string = value;
            if (type === ESelectType.MONTH) this.MonthEnd.string = value;
            if (type === ESelectType.DAY) this.DayEnd.string = value;
        }

        this.validateRange(isStart);
        this.hideAll();
    }

    // ===== VALIDATE =====
    validateRange(isStart: boolean) {
        const start = this.getStartDate();
        const end = this.getEndDate();

        if (!start || !end) return;

        if (start.getTime() > end.getTime()) {
            if (isStart) this.setEndDate(start);
            else this.setStartDate(end);
        }
    }

    // ===== DATE =====
    getStartDate(): Date | null {
        if (!this.yearStart.string || !this.MonthStart.string || !this.DayStart.string) return null;

        return new Date(
            Number(this.yearStart.string),
            Number(this.MonthStart.string) - 1,
            Number(this.DayStart.string)
        );
    }

    getEndDate(): Date | null {
        if (!this.yearEnd.string || !this.MonthEnd.string || !this.DayEnd.string) return null;

        return new Date(
            Number(this.yearEnd.string),
            Number(this.MonthEnd.string) - 1,
            Number(this.DayEnd.string)
        );
    }

    setStartDate(date: Date) {
        this.yearStart.string = `${date.getFullYear()}`;
        this.MonthStart.string = this.format(date.getMonth() + 1);
        this.DayStart.string = this.format(date.getDate());
    }

    setEndDate(date: Date) {
        this.yearEnd.string = `${date.getFullYear()}`;
        this.MonthEnd.string = this.format(date.getMonth() + 1);
        this.DayEnd.string = this.format(date.getDate());
    }

    // ===== CLICK =====
    onClickYearStart() { this.open(ESelectType.YEAR, true); }
    onClickMonthStart() { this.open(ESelectType.MONTH, true); }
    onClickDayStart() { this.open(ESelectType.DAY, true); }

    onClickYearEnd() { this.open(ESelectType.YEAR, false); }
    onClickMonthEnd() { this.open(ESelectType.MONTH, false); }
    onClickDayEnd() { this.open(ESelectType.DAY, false); }

    open(type: ESelectType, isStart: boolean) {
        this.showOnly(type, isStart);
        // ✅ KHÔNG reset label nữa
    }

    // ===== SHOW/HIDE =====
    showOnly(type: ESelectType, isStart: boolean) {
        const year = isStart ? this.containtYearStart : this.containtYearEnd;
        const month = isStart ? this.containtMonthStart : this.containtMonthEnd;
        const day = isStart ? this.containtDayStart : this.containtDayEnd;

        year.active = type === ESelectType.YEAR;
        month.active = type === ESelectType.MONTH;
        day.active = type === ESelectType.DAY;
    }

    hideAll() {
        this.containtYearStart.active = false;
        this.containtMonthStart.active = false;
        this.containtDayStart.active = false;

        this.containtYearEnd.active = false;
        this.containtMonthEnd.active = false;
        this.containtDayEnd.active = false;
    }

    // ===== CLEAR =====
    clearAll() {
        this.containtYearStart.removeAllChildren();
        this.containtMonthStart.removeAllChildren();
        this.containtDayStart.removeAllChildren();

        this.containtYearEnd.removeAllChildren();
        this.containtMonthEnd.removeAllChildren();
        this.containtDayEnd.removeAllChildren();
    }

    // ===== FORMAT =====
    format(n: number): string {
        return n < 10 ? `0${n}` : `${n}`;
    }
}