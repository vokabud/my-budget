# Family Budget Iteration 1 Execution Index

> **For agentic workers:** Execute exactly one linked plan in a fresh context, then stop for independent review.

**Goal:** Replace the console conversion path with a tested API/UI path through six execution-safe commits.

**Source specification:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

**Source plan corrected by this split:** `docs/superpowers/plans/2026-08-06-family-budget-iteration1-api-ui.md`

## Repository facts and corrections

- Solution: `src/my-budget-calculation/MyBudget.sln`; current members are `MyBudget.Console`, `MyBudget.Core`, and `MyBudget.Core.Tests`.
- `BankReportReader.ImportFromCsv(string filePath): List<MyBudget.Core.Models.Transactions.Transaction>` is path-based. No stream overload exists. The API must own a temporary file and delete it in `finally`; the source plan's stream call was invalid.
- `ReportGenerator(Rules rules)` and `ExpenseReport Generate(SubGroup[] mmc, List<Transaction> transactions)` are the exact constructor/method.
- `Rules.Categories` and `Rules.SubCategories` are `Rule[]`, not lists. Report `Categories`, `SubCategories`, and `Expenses` are `List<T>`.
- MCC data already exists at `src/my-budget-ui/src/pages/Mcc/mcc.json`; no separate authoritative dataset exists. Plan 02 copies that exact tracked file and tests equality/count instead of inventing data.
- `FileLoader` currently requires `onFileContent: (content: string) => void` and is consumed by both `MonoReport.tsx` and `RulesConfiguration.tsx`. Plan 04 preserves that consumer and updates both call sites/type-checks.
- Rules JSON enums are numeric (`condition`: 0/1, `result.type`: 0/1), matching TypeScript enums and default `System.Text.Json` enum handling. UI-only `IRule.id` is ignored by ASP.NET JSON binding.
- No API project, API test project, CORS/proxy configuration, CSV/rules fixtures, E2E framework, or frontend tests exist.
- Existing `PdfParserTests.Test1` uses absolute paths outside this repository and may hang. It is not accepted as a green regression result; any baseline failure must be reported and resolved in scope before proceeding.
- In this sandbox, CRA test/build worker spawning returned `spawn EPERM`; plans use `--runInBand` for tests. A production build remains mandatory and must pass in the executor's environment.

## Global execution rules

1. Start from repository root `G:\Solutions\my-budget-2` and a clean worktree except known user-owned `.clinerules/`; never stage `.clinerules/`.
2. Before each plan, verify the prerequisite commit exists with `git log -1 --format=%s` and rerun every listed green command.
3. The next plan must not start unless the previous commit exists, every gate passed, and an independent verifier reviewed that commit against its plan.
4. Empty, skipped, placeholder, comment-only, or zero-discovered-test results fail the gate.
5. Reopen every consumed interface from its repository source immediately before writing a call; do not rely on this index alone.
6. After every verification command, apply this rule verbatim:

> “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Exact order

| Order | Plan | Prerequisite | Expected commit | Required green commands | Handoff |
|---|---|---|---|---|---|
| 01 | [API solution and test skeleton](2026-08-18-family-budget-iteration1-01-api-skeleton.md) | Clean baseline | `feat(api): add tested API solution skeleton` | API direct build/test; test discovery/count; `dotnet sln ... list`; solution build/test | `Program`, API/API-tests project membership, health route |
| 02 | [Rules and MCC vertical slice](2026-08-18-family-budget-iteration1-02-rules-mcc.md) | 01 reviewed | `feat(api): load rules into memory with static MCC` | focused rules/MCC tests; API build; API tests; solution tests | rules store/provider and rules endpoint contract |
| 03 | [Conversion and live HTTP flow](2026-08-18-family-budget-iteration1-03-conversion-integration.md) | 02 reviewed | `feat(api): convert uploaded CSV through live API flow` | focused conversion tests; real load+convert HTTP test; API build/tests; solution tests | canonical API contract and representative fixtures |
| 04 | [Reusable file selection](2026-08-18-family-budget-iteration1-04-file-loader.md) | 03 reviewed | `refactor(ui): support file selection without breaking rules editor` | test discovery/count; focused FileLoader tests; UI full tests/build | compatible `FileLoaderProps` |
| 05 | [UI API report flow](2026-08-18-family-budget-iteration1-05-ui-api-flow.md) | 04 reviewed | `feat(ui): load rules and render converted reports` | client/component tests; UI full tests/build; live API contract script; solution tests | complete replacement UI/API path |
| 06 | [Console cleanup and documentation](2026-08-18-family-budget-iteration1-06-cleanup.md) | 05 reviewed and replacement path green | `refactor: remove console and document API-first workflow` | absence checks; exact solution membership; all backend/UI/live-flow gates | final iteration-1 state |

## Requirement-to-plan/test map

| Original requirement | Plan and proof |
|---|---|
| API project and health | 01 `ApiSmokeTests.Health_Endpoint_Responds_Ok` |
| In-memory last rules | 02 store tests and two successful load requests |
| Static backend MCC | 02 byte-for-byte/counted source-copy test |
| Rules validation | 02 endpoint invalid-body tests |
| Convert before rules | 03 `ConvertBeforeRules...` |
| Synchronous CSV report | 03 `LoadRulesThenConvert...` real HTTP integration test |
| Contract matches `IReport` | 03 JSON assertions; 05 canonical-contract client/component tests and live script |
| Disable convert until rules load | 05 component test |
| Visible errors and reusable page | 05 component tests |
| Multiple CSV uploads | 05 two-conversion component test; 03 repeated endpoint use |
| Existing rendering semantics | 05 date/total/category/subcategory/expense assertions |
| Shared `FileLoader` safety | 04 all-consumer `rg`, tests, TypeScript production build |
| Remove console only after replacement | 06 prerequisite and deletion/absence gates |
| Developer docs | 06 exact API/UI workflow |

## Independent verifier report

```text
Plan/commit reviewed:
Commit hash and subject:
Files inspected:
Required commands rerun with exit codes and executed test counts:
Contract/signature deviations:
Unrelated changes:
Verdict: APPROVE | REJECT
Blocking findings:
```
