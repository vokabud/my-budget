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

export enum RuleCondition {
    Equals = 0,
    Contains = 1,
}

export enum RuleResultType {
    FromValue = 0,
    FromProperty = 1,
}

export interface IRule {
    property: Property;
    condition: RuleCondition;
    value: string;
    result: IRuleResult;
}

export interface IRuleResult {
    type: RuleResultType;
    value: string;
    property: Property;
}

export enum Property {
    Details = 'Details',
    MCC = 'MCC',
    Currency = 'Currency',
}
