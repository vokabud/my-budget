using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Rules;

public class Result
{
    [JsonPropertyName("type")]
    public ResultType Type { get; set; }

    [JsonPropertyName("value")]
    public string Value { get; set; }

    [JsonPropertyName("property")]
    public string Property { get; set; }
}
