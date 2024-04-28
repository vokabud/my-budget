using System.Text.Json;

namespace MyBudget.Core.Tools;

public class JsonReader
{
    public T Read<T>(string filePath)
    {
        string json = File.ReadAllText(filePath);

        var options = new JsonSerializerOptions
        {
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        var result = JsonSerializer.Deserialize<T>(json, options);

        return result;
    }
}
