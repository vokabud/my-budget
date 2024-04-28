namespace MyBudget.Core.Models.Transactions;

public class Transaction
{
    public DateTime Date { get; set; }

    public string Details { get; set; }

    public string MCC { get; set; }

    public string CardAmount { get; set; }

    public decimal TransactionAmount { get; set; }

    public string Currency { get; set; }

    public string ExchangeRate { get; set; }

    public string CommissionAmount { get; set; }

    public string CashbackAmount { get; set; }

    public string Balance { get; set; }
}
