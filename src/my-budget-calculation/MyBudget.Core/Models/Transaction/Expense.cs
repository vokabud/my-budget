namespace MyBudget.Core.Models.Transactions;

public class Expense
{
    public DateTime Date { get; set; }

    public string Category { get; set; }

    public string SubCategory { get; set; }

    public string MCC { get; set; }

    public decimal TransactionAmount { get; set; }

    public string Details { get; set; }
}
