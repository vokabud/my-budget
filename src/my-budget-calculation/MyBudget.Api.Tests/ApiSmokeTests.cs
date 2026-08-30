using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

public class ApiSmokeTests
{
    [Fact]
    public async Task Health_Endpoint_Responds_Ok()
    {
        using var factory = new WebApplicationFactory<Program>();
        using var client = factory.CreateClient();

        using var response = await client.GetAsync("/api/health");
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        using var doc = JsonDocument.Parse(body);
        Assert.Equal("ok", doc.RootElement.GetProperty("status").GetString());
    }
}
