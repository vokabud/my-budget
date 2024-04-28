using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Report;

public class ExpenseReport
{
    [JsonPropertyName("startDate")]
    public DateOnly StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateOnly EndDate { get; set; }

    [JsonPropertyName("total")]
    public decimal Total { get; set; }

    [JsonPropertyName("categories")]
    public List<Category> Categories { get; set; } = [];
}
