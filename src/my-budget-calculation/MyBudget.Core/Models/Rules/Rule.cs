using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Rules;

public class Rule
{
    [JsonPropertyName("property")]
    public string Property { get; set; }

    [JsonPropertyName("condition")]
    public Condition Condition { get; set; }

    [JsonPropertyName("value")]
    public string Value { get; set; }

    [JsonPropertyName("result")]
    public Result Result { get; set; }
}
