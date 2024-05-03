using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Report;

public class Expense
{
    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("transactionAmount")]
    public decimal TransactionAmount { get; set; }

    [JsonPropertyName("details")]
    public string Details { get; set; }
}