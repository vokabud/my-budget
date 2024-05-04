export interface IReport {
    categories: ICategory[];
    endDate: string;
    startDate: string;
    total: number;
}

export interface ICategory {
    name: string;
    total: number;
    subCategories: ISubCategory[];
}

export interface ISubCategory {
    name: string;
    total: number;
    expenses: IExpense[];
}

export interface IExpense {
    date: string;
    transactionAmount: number;
    details: string;
}

export interface IRule {
    property: string;
    condition: string;
    value: number;
    result: IRuleResult;
}

export interface IRuleResult {
    type: string;
    value: string;
    property: string;
}
