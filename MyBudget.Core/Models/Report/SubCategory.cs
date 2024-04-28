using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Report;

public class SubCategory
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("total")]
    public decimal Total { get; set; }

    [JsonPropertyName("expenses")]
    public List<Expense> Expenses { get; set; } = [];
}
