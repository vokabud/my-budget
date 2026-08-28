# Console Cleanup and Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. This cleanup is forbidden until Plans 01-05 are independently reviewed and the replacement path is fully green.

**Goal:** Remove the obsolete console project only after the API/UI replacement is proven, and document the exact local workflow.

**Architecture:** This plan changes no runtime contract. It deletes the old adapter, removes its solution membership, and aligns documentation with the verified path.

**Tech Stack:** Git, .NET solution CLI, Markdown.

**Source specification path:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

## Exact prerequisites

- HEAD is reviewed Plan 05 commit `feat(ui): load rules and render converted reports`.
- Independent verifier reports for Plans 01-05 are APPROVE.
- Immediately rerun and pass Plan 05 live contract, UI full tests/build, API direct tests, and solution tests before deleting anything.
- If the replacement path is not fully green, STOP. Cleanup must not run.

## Exact files to read before editing

- `src/my-budget-calculation/MyBudget.sln`
- `src/my-budget-calculation/MyBudget.Console/Program.cs`
- `src/my-budget-calculation/MyBudget.Console/MyBudget.Console.csproj`
- `README.md`, `docs/architecture-analysis.md`, `src/my-budget-ui/README.md`
- `MyBudget.Api/Program.cs`, both API controllers, `scripts/verify-api-ui-contract.ps1`, UI `MonoReport.tsx`

## Exact files

- Delete `src/my-budget-calculation/MyBudget.Console/Program.cs`
- Delete `src/my-budget-calculation/MyBudget.Console/MyBudget.Console.csproj`
- Remove project via `dotnet sln src/my-budget-calculation/MyBudget.sln remove src/my-budget-calculation/MyBudget.Console/MyBudget.Console.csproj`
- Modify `README.md`, `docs/architecture-analysis.md`, `src/my-budget-ui/README.md`

## Interfaces consumed and produced

- Removed consumers: Console calls `new JsonReader()`, `new JsonWriter()`, `new BankReportReader()`, `ImportFromCsv(string)`, `new ReportGenerator(Rules)`, and `Generate(SubGroup[], List<Transaction>)`.
- Core APIs remain unchanged for API consumers. Final solution must list exactly `MyBudget.Api`, `MyBudget.Api.Tests`, `MyBudget.Core`, `MyBudget.Core.Tests`.
- Documentation must state: API command, UI command, rules-first behavior, CSV field/format, port/base URL, restart clears rules, and live verification command.

## Request/response formats

No contract changes. Copy/link the canonical tables from Plans 03/05 accurately; do not introduce new routes or shapes.

## Repository-discovery/preflight

- [ ] `rg -n "MyBudget.Console|Spectre.Console|new JsonReader|new JsonWriter|new BankReportReader|new ReportGenerator" . -g '!**/bin/**' -g '!**/obj/**' -g '!docs/superpowers/plans/2026-08-06-family-budget-iteration1-api-ui.md' -g '!docs/superpowers/plans/2026-08-18-family-budget-iteration1-*.md'` and record every code, solution, and documentation consumer.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Replacement-path hard gate before deletion

- [ ] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify-api-ui-contract.ps1`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui run build`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.sln -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Bite-sized TDD/cleanup steps

- [ ] Run solution remove command, then delete only the two tracked Console files (and empty directory if Git naturally omits it).
- [ ] Update root README project list/workflow with exact `dotnet run --project src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj --urls http://localhost:5080`, `npm --prefix src/my-budget-ui start`, rules JSON then CSV sequence, and verification commands.
- [ ] Update architecture analysis to API/controller/service/Core/UI flow and list exact dependencies; remove claims that console is active.
- [ ] Update UI README with the CRA development proxy, runtime-only rules state, accepted extensions, backend restart behavior, test/build commands, and the unresolved production reverse-proxy prerequisite.

## Focused verification

- [ ] `dotnet sln src/my-budget-calculation/MyBudget.sln list` — assert exactly four paths: `MyBudget.Api\MyBudget.Api.csproj`, `MyBudget.Api.Tests\MyBudget.Api.Tests.csproj`, `MyBudget.Core\MyBudget.Core.csproj`, `MyBudget.Core.Tests\MyBudget.Core.Tests.csproj`.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `powershell -NoProfile -Command "$hits = rg -n 'MyBudget.Console|Spectre.Console' src README.md docs/architecture-analysis.md src/my-budget-ui/README.md; if ($LASTEXITCODE -eq 0) { $hits; exit 1 }; if ($LASTEXITCODE -eq 1) { exit 0 }; exit $LASTEXITCODE"`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet build src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj -v minimal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj --list-tests -v normal` and report discovered count.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.Api.Tests/MyBudget.Api.Tests.csproj -v normal` and report executed/passed count.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Broader regression

- [ ] `dotnet build src/my-budget-calculation/MyBudget.sln -c Release -v minimal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.sln -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui run build`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify-api-ui-contract.ps1`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `git diff --check`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Commit/handoff

Stage: `git add -A src/my-budget-calculation/MyBudget.Console src/my-budget-calculation/MyBudget.sln README.md docs/architecture-analysis.md src/my-budget-ui/README.md`

Commit: `git commit -m "refactor: remove console and document API-first workflow"`

```text
Plan: 06 cleanup
Commit/hash:
Replacement pre-gate results:
Deleted files:
Final exact solution list:
Absence-search result:
All test discovery/execution/pass counts and build exits:
Live contract result:
Independent verifier: PENDING
```
