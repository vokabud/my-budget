# Family Budget Iteration 1 API + UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the manual console conversion step with a synchronous API flow that the UI uses to upload rules, upload CSV, and render the returned report.

**Architecture:** Add a new ASP.NET Core API project that references the existing core library, keeps rules in process memory, and uses static MCC data. Update the React MonoReport page from local JSON loading to a two-step API flow: load rules first, then convert CSV and render report using existing components.

**Tech Stack:** .NET SDK 10.0.400 / .NET 10 (ASP.NET Core Web API, xUnit 2.9.3), existing MyBudget.Core library, React 19.2.8, TypeScript 7.0.2, Vite 8.2.2, Vitest 4.1.11, MUI 9.4.0, multipart/form-data uploads.

**Modernization baseline:** `main` commit `f4b5e6e` (`chore: Upgrade to .NET 10 LTS, React 19.2, Vite 8`). The iteration plan extends that commit and must not reintroduce .NET 8, Create React App, Jest CLI flags, or `react-scripts`.

## Global Constraints

- Convert endpoint is synchronous and returns report JSON in the response body.
- MCC is backend constant/static data in iteration 1.
- Rules are loaded from UI and stored in backend in-memory state only.
- If conversion is requested before rules load, backend returns HTTP 400 with message Load rules first.
- UI keeps rules state in runtime memory only for iteration 1.
- Console project is removed from solution and repository in iteration 1.
- Every new backend project targets `net10.0`; API test packages mirror `MyBudget.Core.Tests`: Microsoft.NET.Test.Sdk 18.9.0, xunit 2.9.3, xunit.runner.visualstudio 4.0.0, and coverlet.collector 10.0.1.
- Frontend tests run through the existing `npm test` (`vitest run`) script; frontend gates also run `npm run typecheck` and the Vite production build.
- Vite development proxy configuration belongs in `src/my-budget-ui/vite.config.ts`, not in the removed Create React App `package.json` proxy convention.

---

### Task 1: Add API Project Skeleton and Solution Wiring

**Files:**
- Create: `src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj`
- Create: `src/my-budget-calculation/MyBudget.Api/Program.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/appsettings.json`
- Modify: `src/my-budget-calculation/MyBudget.sln`
- Modify: `README.md`

**Interfaces:**
- Consumes: `MyBudget.Core` project reference.
- Produces: running API host on local development URL with DI and controller support.

- [ ] **Step 1: Write the failing API startup test scaffold**

```csharp
// File: src/my-budget-calculation/MyBudget.Api.Tests/ApiSmokeTests.cs
[Fact]
public async Task Health_Endpoint_Responds_Ok()
{
    using var factory = new WebApplicationFactory<Program>();
    using var client = factory.CreateClient();

    var response = await client.GetAsync("/api/health");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal`
Expected: FAIL because API project/tests are not yet wired.

- [ ] **Step 3: Create minimal API project and register in solution**

```xml
<!-- File: src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\MyBudget.Core\MyBudget.Core.csproj" />
  </ItemGroup>
</Project>
```

```csharp
// File: src/my-budget-calculation/MyBudget.Api/Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

var app = builder.Build();
app.MapControllers();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.Run();

public partial class Program;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal`
Expected: PASS for health endpoint.

- [ ] **Step 5: Commit**

```bash
git add src/my-budget-calculation/MyBudget.Api src/my-budget-calculation/MyBudget.sln README.md src/my-budget-calculation/MyBudget.Api.Tests
git commit -m "feat(api): add web api project skeleton and solution wiring"
```

### Task 2: Add Static MCC Provider and In-Memory Rules Store

**Files:**
- Create: `src/my-budget-calculation/MyBudget.Api/Contracts/RulesDto.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Services/IMccProvider.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Services/MccProvider.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Services/IRulesStateStore.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Services/InMemoryRulesStateStore.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Data/mcc.json`
- Modify: `src/my-budget-calculation/MyBudget.Api/Program.cs`
- Test: `src/my-budget-calculation/MyBudget.Api.Tests/RulesStateStoreTests.cs`

**Interfaces:**
- Consumes: `MyBudget.Core.Models.Mmc.SubGroup`, `MyBudget.Core.Models.Rules.Rules`.
- Produces:
  - `IMccProvider.GetAll(): SubGroup[]`
  - `IRulesStateStore.Set(Rules rules): void`
  - `IRulesStateStore.TryGet(out Rules? rules): bool`

- [ ] **Step 1: Write failing tests for rules store and MCC loading**

```csharp
[Fact]
public void RulesStore_Returns_False_When_Empty() { }

[Fact]
public void RulesStore_Returns_Stored_Rules() { }

[Fact]
public void MccProvider_Loads_Static_Mcc_Data() { }
```

- [ ] **Step 2: Run tests to verify failure**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal --filter "FullyQualifiedName~RulesStore|FullyQualifiedName~MccProvider"`
Expected: FAIL because services are not implemented.

- [ ] **Step 3: Implement store/provider with explicit contracts**

```csharp
public interface IRulesStateStore
{
    void Set(Rules rules);
    bool TryGet(out Rules? rules);
}

public sealed class InMemoryRulesStateStore : IRulesStateStore
{
    private Rules? _rules;
    public void Set(Rules rules) => _rules = rules;
    public bool TryGet(out Rules? rules)
    {
        rules = _rules;
        return rules is not null;
    }
}
```

```csharp
public interface IMccProvider
{
    SubGroup[] GetAll();
}
```

```csharp
// MccProvider reads Data/mcc.json once at startup and caches result
```

- [ ] **Step 4: Register dependencies and include mcc.json as content**

Run/verify in `Program.cs`:

```csharp
builder.Services.AddSingleton<IRulesStateStore, InMemoryRulesStateStore>();
builder.Services.AddSingleton<IMccProvider, MccProvider>();
```

And in `.csproj` include:

```xml
<ItemGroup>
  <None Include="Data\mcc.json" CopyToOutputDirectory="PreserveNewest" />
</ItemGroup>
```

- [ ] **Step 5: Run tests to verify pass**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal`
Expected: PASS for added unit tests.

- [ ] **Step 6: Commit**

```bash
git add src/my-budget-calculation/MyBudget.Api src/my-budget-calculation/MyBudget.Api.Tests
git commit -m "feat(api): add static mcc provider and in-memory rules state store"
```

### Task 3: Implement Rules Load Endpoint

**Files:**
- Create: `src/my-budget-calculation/MyBudget.Api/Controllers/RulesController.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Contracts/RulesLoadResponseDto.cs`
- Modify: `src/my-budget-calculation/MyBudget.Api/Program.cs`
- Test: `src/my-budget-calculation/MyBudget.Api.Tests/RulesControllerTests.cs`

**Interfaces:**
- Consumes: `IRulesStateStore`.
- Produces:
  - `POST /api/rules/load`
  - Request body shape compatible with existing rules JSON.
  - Response 200 `{ categoryRulesCount, subCategoryRulesCount }`.
  - Response 400 with validation problem details for invalid payload.

- [ ] **Step 1: Write failing endpoint tests for success and invalid input**

```csharp
[Fact]
public async Task LoadRules_Returns_Ok_And_Counts() { }

[Fact]
public async Task LoadRules_Returns_BadRequest_For_Invalid_Body() { }
```

- [ ] **Step 2: Run tests to verify failure**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal --filter "FullyQualifiedName~RulesControllerTests"`
Expected: FAIL because endpoint does not exist yet.

- [ ] **Step 3: Implement controller and validation**

```csharp
[ApiController]
[Route("api/rules")]
public class RulesController : ControllerBase
{
    [HttpPost("load")]
    public IActionResult Load([FromBody] Rules rules)
    {
        if (rules.Categories is null || rules.SubCategories is null)
            return ValidationProblem("Rules payload is invalid.");

        _rulesStore.Set(rules);
        return Ok(new RulesLoadResponseDto(rules.Categories.Length, rules.SubCategories.Length));
    }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal --filter "FullyQualifiedName~RulesControllerTests"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/my-budget-calculation/MyBudget.Api src/my-budget-calculation/MyBudget.Api.Tests
git commit -m "feat(api): add rules load endpoint with validation and summary response"
```

### Task 4: Implement Synchronous CSV Convert Endpoint

**Files:**
- Create: `src/my-budget-calculation/MyBudget.Api/Controllers/ReportsController.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Services/ICalculationService.cs`
- Create: `src/my-budget-calculation/MyBudget.Api/Services/CalculationService.cs`
- Test: `src/my-budget-calculation/MyBudget.Api.Tests/ReportsControllerTests.cs`

**Interfaces:**
- Consumes: `IRulesStateStore`, `IMccProvider`, `BankReportReader`, `ReportGenerator`.
- Produces:
  - `POST /api/reports/convert` with multipart file field name `file`.
  - `400` when rules absent with message `Load rules first`.
  - `200` with response shape matching UI `IReport` fields.

- [ ] **Step 1: Write failing endpoint tests (rules missing, success, malformed CSV)**

```csharp
[Fact]
public async Task Convert_Returns_BadRequest_When_Rules_Not_Loaded() { }

[Fact]
public async Task Convert_Returns_Report_When_Request_Is_Valid() { }

[Fact]
public async Task Convert_Returns_BadRequest_For_Invalid_Csv() { }
```

- [ ] **Step 2: Run tests to verify failure**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal --filter "FullyQualifiedName~ReportsControllerTests"`
Expected: FAIL because endpoint/service not implemented.

- [ ] **Step 3: Implement calculation service and controller**

```csharp
public interface ICalculationService
{
    ExpenseReport Convert(Stream csvStream, Rules rules);
}
```

```csharp
// Controller behavior
// 1) check rules store -> 400 "Load rules first"
// 2) copy uploaded file to temp path/stream
// 3) call service
// 4) return Ok(report)
```

- [ ] **Step 4: Register service in DI and add robust request checks**

Run/verify in `Program.cs`:

```csharp
builder.Services.AddScoped<ICalculationService, CalculationService>();
```

Handle:
- missing file -> 400
- empty file -> 400
- parse exceptions -> 400 with actionable message

- [ ] **Step 5: Run tests to verify pass**

Run: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v minimal --filter "FullyQualifiedName~ReportsControllerTests"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/my-budget-calculation/MyBudget.Api src/my-budget-calculation/MyBudget.Api.Tests
git commit -m "feat(api): add synchronous csv conversion endpoint"
```

### Task 5: Update UI API Client and MonoReport Two-Step Flow

**Files:**
- Create: `src/my-budget-ui/src/api/client.ts`
- Create: `src/my-budget-ui/src/api/reportApi.ts`
- Modify: `src/my-budget-ui/vite.config.ts`
- Modify: `src/my-budget-ui/src/pages/MonoReport/MonoReport.tsx`
- Modify: `src/my-budget-ui/src/common/FileLoader/FileLoader.tsx`
- Modify: `src/my-budget-ui/src/types.ts`
- Test: `src/my-budget-ui/src/pages/MonoReport/MonoReport.test.tsx`

**Interfaces:**
- Consumes:
  - `POST /api/rules/load`
  - `POST /api/reports/convert`
- Produces:
  - UI state fields: `rulesLoaded: boolean`, `isLoading: boolean`, `errorMessage: string | null`, `report: IReport | null`.
  - FileLoader support for configurable accepted file types and `onFileSelected(file: File)` callback.

- [ ] **Step 1: Write failing UI tests for two-step behavior**

```tsx
it("disables csv convert until rules are loaded", async () => { /* ... */ });
it("renders report after successful conversion", async () => { /* ... */ });
it("shows load rules first error from backend", async () => { /* ... */ });
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm --prefix src/my-budget-ui test -- MonoReport.test.tsx`
Expected: FAIL because UI logic does not exist.

- [ ] **Step 3: Implement API utilities and update MonoReport state flow**

```ts
export async function loadRules(file: File): Promise<void> { /* POST /api/rules/load */ }
export async function convertCsv(file: File): Promise<IReport> { /* POST /api/reports/convert */ }
```

```tsx
// MonoReport
// - Rule upload action
// - CSV upload action disabled until rulesLoaded
// - Existing rendering reused when report state is set
```

Extend `vite.config.ts` with a development proxy from `/api` to `http://localhost:5080`, preserving the existing React plugin, path resolution, and Vitest configuration.

- [ ] **Step 4: Update FileLoader for reusable file selection**

```tsx
interface IProps {
  accept?: string;
  buttonLabel?: string;
  onFileSelected?: (file: File) => void;
  onFileContent?: (content: string) => void;
}
```

Use `onFileSelected` in new API flow and keep `onFileContent` compatibility for incremental migration.

- [ ] **Step 5: Run UI tests to verify pass**

Run: `npm --prefix src/my-budget-ui test`
Expected: PASS for updated MonoReport tests.

Run: `npm --prefix src/my-budget-ui run typecheck`
Expected: PASS with no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/my-budget-ui/src/api src/my-budget-ui/src/pages/MonoReport src/my-budget-ui/src/common/FileLoader src/my-budget-ui/src/types.ts
git commit -m "feat(ui): integrate rules upload and csv conversion api flow"
```

### Task 6: Remove Console Project and Clean References

**Files:**
- Delete: `src/my-budget-calculation/MyBudget.Console/Program.cs`
- Delete: `src/my-budget-calculation/MyBudget.Console/MyBudget.Console.csproj`
- Modify: `src/my-budget-calculation/MyBudget.sln`
- Modify: `README.md`
- Modify: `docs/architecture-analysis.md`

**Interfaces:**
- Consumes: existing solution/project structure.
- Produces: solution without console project and docs aligned to API-first flow.

- [ ] **Step 1: Write failing verification check for removed console references**

```powershell
# Assert no MyBudget.Console entry in solution
Select-String -Path "src/my-budget-calculation/MyBudget.sln" -Pattern "MyBudget.Console"
```

- [ ] **Step 2: Run check to verify it currently fails (match exists)**

Run: `Select-String -Path src/my-budget-calculation/MyBudget.sln -Pattern "MyBudget.Console"`
Expected: match found before removal.

- [ ] **Step 3: Remove project and update docs**

Actions:
- Remove console project from solution.
- Delete console project files.
- Update root README flow description to UI -> API.
- Update architecture doc project structure and coupling notes.

- [ ] **Step 4: Re-run verification check**

Run: `Select-String -Path src/my-budget-calculation/MyBudget.sln -Pattern "MyBudget.Console"`
Expected: no match.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove console project and document api-first workflow"
```

### Task 7: End-to-End Verification and Final Documentation Pass

**Files:**
- Modify: `README.md`
- Modify: `docs/architecture-analysis.md`
- Modify: `src/my-budget-ui/README.md`
- Test: `src/my-budget-calculation/MyBudget.Api.Tests/*`
- Test: `src/my-budget-ui/src/pages/MonoReport/MonoReport.test.tsx`

**Interfaces:**
- Consumes: completed API and UI flows.
- Produces: verified local developer workflow and updated docs.

- [ ] **Step 1: Add run instructions for API + UI local development**

```md
1. Start API from src/my-budget-calculation/MyBudget.Api
2. Start UI from src/my-budget-ui
3. Load rules JSON in UI
4. Upload CSV in UI and view report
```

- [ ] **Step 2: Run backend tests**

Run: `dotnet test src/my-budget-calculation/MyBudget.sln -v minimal`
Expected: PASS including API tests and core tests.

- [ ] **Step 3: Run UI tests**

Run: `npm --prefix src/my-budget-ui test`
Expected: PASS.

Run: `npm --prefix src/my-budget-ui run typecheck`
Expected: PASS.

- [ ] **Step 4: Run production build smoke checks**

Run: `dotnet build src/my-budget-calculation/MyBudget.sln -c Release`
Expected: SUCCESS.

Run: `npm --prefix src/my-budget-ui run build`
Expected: SUCCESS.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/architecture-analysis.md src/my-budget-ui/README.md
git commit -m "docs: finalize api-ui local workflow and verification notes"
```

## Self-Review Results

1. Spec coverage:
- API wrapper and synchronous conversion: covered by Tasks 1, 3, 4.
- Static MCC + in-memory rules: covered by Task 2.
- UI two-step flow and rendering: covered by Task 5.
- Remove console project: covered by Task 6.
- Testing requirements: covered by Tasks 1 through 7.
- Iteration boundary (no Aspire/DB): enforced in Global Constraints and task scope.

2. Placeholder scan:
- No unfinished placeholder markers or deferred implementation notes remain.

3. Type consistency:
- API endpoint names are consistent across tasks: `/api/rules/load`, `/api/reports/convert`.
- Rules store and provider interfaces are consistent and reused.
- UI output type target is consistently `IReport`.
