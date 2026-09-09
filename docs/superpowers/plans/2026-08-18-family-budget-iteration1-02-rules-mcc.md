# Rules and Static MCC Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Complete only this plan and stop for review.

**Version-control rule:** The model must not create commits. Leave all changes uncommitted for the user to review and commit manually.
**Goal:** Accept valid rules over HTTP, retain the latest rules in process memory, and load the repository's existing MCC catalog as backend content.

**Architecture:** Singleton stores own process-lifetime state and immutable MCC data. A controller validates the complete rules graph before replacing state.

**Tech Stack:** .NET SDK 10.0.400, .NET 10, ASP.NET Core controllers, System.Text.Json, xUnit 2.9.3.

**Source specification path:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

## Exact prerequisites

- The tracked source `src/my-budget-ui/src/pages/Mcc/mcc.json` exists and parses as a nonempty JSON array. It is the only repository MCC dataset.

## Exact files to read before editing

`MyBudget.Api/Program.cs`, both new project files, all `MyBudget.Core/Models/Rules/*.cs`, `MyBudget.Core/Models/Mmc/*.cs`, `MyBudget.Core/Tools/RuleProcessor.cs`, `src/my-budget-ui/src/types.ts`, `src/my-budget-ui/src/pages/Mcc/mcc.json`, and `src/my-budget-ui/src/pages/RulesConfiguration/RulesConfiguration.tsx`.

## Exact files

- Create `MyBudget.Api/Services/IRulesStateStore.cs`, `InMemoryRulesStateStore.cs`, `IMccProvider.cs`, `MccProvider.cs`
- Create `MyBudget.Api/Controllers/RulesController.cs`
- Create `MyBudget.Api/Contracts/RulesLoadResponse.cs`
- Create `MyBudget.Api/Data/mcc.json` by exact copy of the tracked UI MCC JSON
- Create `MyBudget.Api.Tests/RulesStateStoreTests.cs`, `MccProviderTests.cs`, `RulesEndpointTests.cs`
- Modify `MyBudget.Api/Program.cs`, `MyBudget.Api/MyBudget.Api.csproj`

Paths above are under `src/my-budget-calculation/` unless otherwise stated.

## Exact interfaces consumed and produced

- Existing: `Rules.Rule[] Categories`, `Rule[] SubCategories`; `SubGroup` properties `Mcc`, `Group`, `ShortDescription`, `FullDescription`.
- Produce in namespace `MyBudget.Api.Services`: `void IRulesStateStore.Set(Rules rules)`, `bool IRulesStateStore.TryGet(out Rules? rules)`, `IReadOnlyList<SubGroup> IMccProvider.GetAll()`.
- Produce `public sealed record RulesLoadResponse(int CategoryRulesCount, int SubCategoryRulesCount);` in `MyBudget.Api.Contracts`.
- Consumers searched and recorded: existing `Rules` consumers are Console `Program.cs`, Core `ReportGenerator.cs`, Core tests, UI `types.ts`/`RulesConfiguration.tsx`; this plan changes none of those shared types.

## Canonical contract

| Concern | Exact value |
|---|---|
| Route | `/api/rules/load` |
| Method | `POST` |
| Content-Type | request `application/json`; response `application/json` |
| Request shape | `{"categories":[{"property":"Details","condition":0,"value":"Coffee","result":{"type":0,"value":"Food","property":"Details"}}],"subCategories":[]}`; arrays required; each rule requires nonblank property/value, nonnull result, valid numeric enum, and result value for type 0 or result property for type 1 |
| Success status/body | `200`; `{"categoryRulesCount":1,"subCategoryRulesCount":0}` |
| Error status/body | `400`; ASP.NET `application/problem+json` with nonempty `title` and `errors` object; state remains unchanged |

## Repository-discovery/preflight

- [ ] Run `rg -n "Rules\\b|SubGroup\\b|mcc.json" src -g '*.cs' -g '*.ts' -g '*.tsx' -g '*.csproj'` and reconcile every result with the consumer list above.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] Reopen the Core model files and assert arrays vs lists and exact namespaces before writing code.

## Bite-sized TDD steps

- [ ] Write store tests: empty returns false/null; set returns the identical `Rules` reference; second set replaces first.
- [ ] Write MCC tests using a test output path: `GetAll()` is nonempty, first/last/count match deserialization of the UI source, and a missing configured file throws `FileNotFoundException`.
- [ ] Write endpoint tests with real HTTP JSON: valid payload returns exact count body; `{}` and invalid numeric enum return problem JSON; after invalid replacement, previous valid state remains.
- [ ] Run `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --filter "FullyQualifiedName~RulesStateStoreTests|FullyQualifiedName~MccProviderTests|FullyQualifiedName~RulesEndpointTests" -v minimal`; expect compile failures for absent types.

Hard stop: expected nonzero only for this red step; if it passes, STOP. Record missing-type failures before continuing.

- [ ] Implement thread-safe store with a private lock and nullable `Rules`; validate before `Set`.
- [ ] Implement `MccProvider(IWebHostEnvironment environment)`: read `Path.Combine(environment.ContentRootPath,"Data","mcc.json")` once in constructor using `JsonSerializer.Deserialize<SubGroup[]>`, throw `InvalidDataException` for null/empty, expose `IReadOnlyList<SubGroup>` via `Array.AsReadOnly`.
- [ ] Copy, do not hand-edit, MCC JSON and add `<Content Include="Data\mcc.json" CopyToOutputDirectory="PreserveNewest" />` (use `Update` instead of `Include` if SDK duplicate-item build requires it; record the exact correction).
- [ ] Implement `[ApiController]`, `[Route("api/rules")]`, constructor injection, `[HttpPost("load")]`; explicit graph validation must add `ModelState` errors and return `ValidationProblem(ModelState)` before calling `Set`.
- [ ] Register both services as singleton in `Program.cs`.

## Focused verification commands

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --filter "FullyQualifiedName~RulesStateStoreTests|FullyQualifiedName~MccProviderTests|FullyQualifiedName~RulesEndpointTests" -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet build src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj -v minimal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --list-tests -v normal` and report discovered count; it must include every non-skipped test above.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Broader regression commands

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.sln -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `git diff --check`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

```text
Plan: 02 rules/MCC
Consumers found by rg:
MCC source/copy item count and equality result:
Commands/exit codes; discovered/executed/passed tests:
Contract deviations/unresolved facts:
Independent verifier: PENDING
```
