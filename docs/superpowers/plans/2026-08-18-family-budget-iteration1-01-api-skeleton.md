# API Solution and Test Skeleton Implementation Plan

> **For agentic workers:** Complete this plan only, one checkbox at a time, then stop for review.

**Goal:** Add solution-wired API and API-test projects with one real health endpoint test.

**Architecture:** ASP.NET Core minimal hosting exposes health and controllers. `WebApplicationFactory<Program>` exercises the in-process HTTP boundary.

**Tech Stack:** .NET 8, ASP.NET Core, xUnit 2.4.2, Microsoft.NET.Test.Sdk 17.6.0.

**Source specification path:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

## Exact prerequisites

- Run from `G:\Solutions\my-budget-2`.
- No prerequisite feature commit. Preserve untracked `.clinerules/` and do not stage it.

## Exact files to read before editing

- `src/my-budget-calculation/MyBudget.sln`
- `src/my-budget-calculation/MyBudget.Core/MyBudget.Core.csproj`
- `src/my-budget-calculation/MyBudget.Core.Tests/MyBudget.Core.Tests.csproj`
- `src/my-budget-calculation/MyBudget.Core.Tests/GlobalUsings.cs`
- `src/my-budget-calculation/MyBudget.Console/MyBudget.Console.csproj`

## Exact files

- Create `src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj`
- Create `src/my-budget-calculation/MyBudget.Api/Program.cs`
- Create `src/my-budget-calculation/MyBudget.Api/appsettings.json`
- Create `src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj`
- Create `src/my-budget-calculation/MyBudget.Api.Tests/GlobalUsings.cs`
- Create `src/my-budget-calculation/MyBudget.Api.Tests/ApiSmokeTests.cs`
- Modify `src/my-budget-calculation/MyBudget.sln` only through `dotnet sln add`

## Interfaces consumed and produced

- Consumes project `MyBudget.Core/MyBudget.Core.csproj`; no Core API is called yet.
- Produces global `public partial class Program` and `GET /api/health` returning JSON `{"status":"ok"}` with HTTP 200 and `application/json`.

## Canonical contract

| Concern | Exact value |
|---|---|
| Route | `/api/health` |
| Method | `GET` |
| Content-Type | no request body; response `application/json` |
| Request shape | none |
| Success status/body | `200`; `{"status":"ok"}` |
| Error status/body | no feature-defined error response |

## Repository discovery/preflight

- [ ] Run `git status --short` and record pre-existing paths.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] Run `dotnet sln src/my-budget-calculation/MyBudget.sln list` and assert exactly the three current project paths from the index.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Bite-sized TDD steps

- [ ] create the test project a project reference to `..\MyBudget.Api\MyBudget.Api.csproj`. Create `GlobalUsings.cs` containing `global using Xunit;`.
- [ ] Write `ApiSmokeTests.Health_Endpoint_Responds_Ok` using `WebApplicationFactory<Program>`, `GetAsync("/api/health")`, status assertion, and `JsonDocument` assertion that the only named value required is string property `status == "ok"`.
- [ ] Create `MyBudget.Api.csproj` with `Microsoft.NET.Sdk.Web`, `net8.0`, nullable and implicit usings enabled, and the exact Core project reference.
- [ ] Run the focused test and expect failure because `Program`/route is absent: `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --filter FullyQualifiedName~Health_Endpoint_Responds_Ok -v minimal`.

Hard stop: this command is expected nonzero only at this red step; if it passes, STOP because the test is not proving the new behavior. Otherwise record the expected compile/404 failure and continue.

- [ ] Create `Program.cs` exactly with `AddControllers`, `MapControllers`, `MapGet("/api/health", () => Results.Ok(new { status = "ok" }))`, `app.Run()`, and global `public partial class Program;`. Create `appsettings.json` as `{}`.
- [ ] Add both new projects: `dotnet sln src/my-budget-calculation/MyBudget.sln add src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj`.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Focused verification commands

- [ ] `dotnet sln src/my-budget-calculation/MyBudget.sln list` — assert exact paths `MyBudget.Api\MyBudget.Api.csproj` and `MyBudget.Api.Tests\MyBudget.Api.Tests.csproj` appear.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet build src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj -v minimal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --list-tests -v normal` — report one discovered health test; zero fails.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v normal` — report executed/passed count, at least 1.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Broader regression commands

- [ ] `dotnet build src/my-budget-calculation/MyBudget.sln -v minimal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.sln -v normal` — every listed test project must execute tests; a hang/failure in the existing absolute-path PDF test is a blocker, not permission to skip it.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `git diff --check`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Commit gate

Do not commit unless direct API build, direct API tests, solution membership, solution build/tests, test discovery/count, and diff check all pass.

Exact staging command:

`git add src/my-budget-calculation/MyBudget.sln src/my-budget-calculation/MyBudget.Api src/my-budget-calculation/MyBudget.Api.Tests`

One commit command:

`git commit -m "feat(api): add tested API solution skeleton"`

## Handoff report format

```text
Plan: 01 API skeleton
Commit: <hash> feat(api): add tested API solution skeleton
Files changed:
Solution list (exact):
Commands/exit codes:
Discovered tests / executed / passed:
Independent verifier: PENDING
Unresolved facts or deviations: none | <exact blocker>
```
