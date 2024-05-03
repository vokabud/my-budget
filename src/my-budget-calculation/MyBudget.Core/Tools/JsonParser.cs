using System.Text.Json;

namespace MyBudget.Core.Tools;

public class JsonWriter
{
    public void Write<T>(T data, string filePath)
    {
        var options = new JsonSerializerOptions
        {
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        };

        var result = JsonSerializer.Serialize<T>(data, options);

        File.WriteAllText(filePath, result);
    }
}
