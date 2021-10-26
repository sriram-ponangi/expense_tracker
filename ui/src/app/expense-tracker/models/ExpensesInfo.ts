export class ExpensesInfo {
    date: Date;
    expenses: Expense[];

    constructor(date: Date, expenses: Expense[]) {
        this.date = date;
        this.expenses = expenses;
    }
}

export class Expense {
    category: string = "";
    reason: string = "";
    cost: number = 0;
    constructor(category: string,
        reason: string,
        cost: number) {
        this.category = category;
        this.reason = reason;
        this.cost = cost;
    }
}