using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Rules;

public class Rules
{
    [JsonPropertyName("categories")]
    public Rule[] Categories { get; set; }

    [JsonPropertyName("subCategories")]
    public Rule[] SubCategories { get; set; }
}
