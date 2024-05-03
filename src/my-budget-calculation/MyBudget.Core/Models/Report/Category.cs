using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Report;

public class Category
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("total")]
    public decimal Total { get; set; }

    [JsonPropertyName("subCategories")]
    public List<SubCategory> SubCategories { get; set; } = [];
    
}
