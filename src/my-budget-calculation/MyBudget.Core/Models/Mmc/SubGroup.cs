using System.Text.Json.Serialization;

namespace MyBudget.Core.Models.Mmc;

public class SubGroup
{
    [JsonPropertyName("mcc")]
    public string Mcc { get; set; }

    [JsonPropertyName("group")]
    public Group Group { get; set; }

    [JsonPropertyName("shortDescription")]
    public string ShortDescription { get; set; }

    [JsonPropertyName("fullDescription")]
    public string FullDescription { get; set; }
}
