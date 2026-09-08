using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace MyBudget.Api.Tests;

public class ApiSmokeTests
{
    [Fact]
    public async Task Health_Endpoint_Responds_Ok()
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/health");

        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        Assert.Equal("ok", doc.RootElement.GetProperty("status").GetString());
    }
}
