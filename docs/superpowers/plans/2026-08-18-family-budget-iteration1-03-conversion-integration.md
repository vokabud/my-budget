# Conversion and Live HTTP Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Complete only this plan and stop for review.

**Goal:** Load rules and convert a representative CSV through real HTTP, returning the exact UI report shape.

**Architecture:** The API adapter writes the uploaded CSV to a unique temp file because Core is path-only, invokes existing Core types unchanged, and deletes the file in `finally`. An integration test sends both requests through `WebApplicationFactory` without mocking the calculation path.

**Tech Stack:** .NET 8, ASP.NET multipart binding, existing Core.

**Source specification path:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

## Exact prerequisites

- Reviewed Plan 02 commit is HEAD and green.
## Exact files to read before editing

- `src/my-budget-calculation/MyBudget.Core/Tools/BankReportReader.cs`
- `src/my-budget-calculation/MyBudget.Core/Tools/ReportGenerator.cs`
- Every `.cs` under Core `Models/Transaction`, `Models/Report`, `Models/Rules`, and `Models/Mmc`
- Plan 02 service interfaces, controllers, and tests
- `src/my-budget-ui/src/types.ts` and every `.tsx` below `src/my-budget-ui/src/pages/MonoReport`

## Exact files to create or modify

- Create `MyBudget.Api/Services/ICalculationService.cs`, `CalculationService.cs`, `Controllers/ReportsController.cs`.
- Create `MyBudget.Api.Tests/ReportsEndpointTests.cs`, `Fixtures/rules.json`, `Fixtures/report.csv`.
- Modify `MyBudget.Api/Program.cs`, `MyBudget.Api.Tests.csproj` to copy fixtures.

## Exact interfaces

- Consume `List<Transaction> BankReportReader.ImportFromCsv(string filePath)`, `new ReportGenerator(Rules rules)`, and `ExpenseReport Generate(SubGroup[] mmc, List<Transaction> transactions)`; convert `IMccProvider.GetAll()` to `.ToArray()` because Core requires `SubGroup[]`.
- Produce `ExpenseReport ICalculationService.Convert(string csvFilePath, Rules rules)`; implementation constructor is `CalculationService(IMccProvider mccProvider)`.
- `ReportsController(IRulesStateStore rulesStateStore, ICalculationService calculationService)` accepts `[FromForm] IFormFile file`.

## Canonical backend/frontend contract (copy verbatim into Plan 05)

| Concern | Exact value |
|---|---|
| Route | `/api/rules/load` |
| Method | `POST` |
| Content-Type | request `application/json`; response `application/json` |
| Request shape | `{"categories":[{"property":"Details","condition":0,"value":"Coffee","result":{"type":0,"value":"Food","property":"Details"}}],"subCategories":[]}`; numeric enums 0/1 |
| Success status/body | `200`; `{"categoryRulesCount":1,"subCategoryRulesCount":0}` |
| Error status/body | `400`; `application/problem+json` with nonempty `title` and `errors` |
| Route | `/api/reports/convert` |
| Method | `POST` |
| Content-Type | request `multipart/form-data` with exactly one field named `file`; response `application/json` |
| Request shape | nonempty `.csv` file; Monobank columns 0..9 are date `dd.MM.yyyy H:mm:ss`, details, MCC, card amount, decimal transaction amount, currency, exchange rate, commission, cashback, balance |
| Success status/body | `200`; `{"startDate":"YYYY-MM-DD","endDate":"YYYY-MM-DD","total":number,"categories":[{"name":string,"total":number,"subCategories":[{"name":string,"total":number,"expenses":[{"date":"ISO-8601","transactionAmount":number,"details":string}]}]}]}` |
| Error status/body | no rules: `400` text/plain body exactly `Load rules first`; missing/empty/wrong extension or parse/generation failure: `400` `application/problem+json` with safe nonempty `title`; unexpected failures remain `500` |

## Repository-discovery/preflight

- [ ] `rg -n "BankReportReader|ImportFromCsv|ReportGenerator|Generate\\(" src/my-budget-calculation -g '*.cs' -g '!**/obj/**'` and list Console plus Core definitions; reopen each definition.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Bite-sized TDD steps

- [ ] Create a two-row CSV fixture: header plus `01.08.2026 10:00:00,Coffee,5812,0,-100,UAH,1,0,0,0`; rules fixture maps Details equals Coffee to category Food and subcategory Cafe. Use MCC 5812 only after asserting it exists in copied MCC JSON.
- [ ] Create `ReportsEndpointTests.cs` with named, non-skipped `[Fact]` methods for: convert before rules exact text; missing/empty/non-CSV rejection; load then convert asserting every JSON property/type/value including total `-100`; second conversion in one factory; malformed decimal problem response; injected throwing calculation service safe 500; and no temp file with the controller's unique prefix after success or failure.
- [ ] Run focused tests; expect compile/404 failure: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --filter FullyQualifiedName~ReportsEndpointTests -v minimal`.

Hard stop: expected nonzero only at this red step; if it passes, STOP. Record exact expected missing types/404.

- [ ] Implement calculation service with the exact existing APIs and `.ToArray()`.
- [ ] Implement controller checks in order: rules, nonnull file, length, `.csv` ordinal-ignore-case; create temp path with a stable `mybudget-upload-` prefix; `CopyToAsync`; call service; catch `FormatException`, `InvalidDataException`, `InvalidOperationException`, `ArgumentException` into `ValidationProblem`; delete in `finally`. Do not catch all exceptions.
- [ ] Register scoped calculation service. Configure tests so each factory gets a fresh rules store.

## Focused verification

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --filter FullyQualifiedName~ReportsEndpointTests -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet build src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj -v minimal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --list-tests -v normal` and report nonzero discovery and executed count.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Broader regression

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.sln -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `git diff --check`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Commit/handoff

Stage: `git add src/my-budget-calculation/MyBudget.Api src/my-budget-calculation/MyBudget.Api.Tests`

Commit: `git commit -m "feat(api): convert uploaded CSV through live API flow"`

```text
Plan: 03 conversion
Commit/hash:
Core consumers and exact signatures reopened:
Focused/API/solution test counts:
Real HTTP assertions passed:
Temporary-file leak check:
Contract deviations/unresolved facts:
Independent verifier: PENDING
```
