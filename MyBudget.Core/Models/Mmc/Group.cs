using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Mmc;

public class Group
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }
}
