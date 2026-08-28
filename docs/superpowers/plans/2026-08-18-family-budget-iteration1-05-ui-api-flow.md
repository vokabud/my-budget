# UI API Report Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Complete only this plan and stop for review.

**Goal:** Load a rules file, enable CSV conversion only after success, call the API, and render the returned report through existing components.

**Architecture:** A small fetch client owns transport/error parsing; MonoReport owns runtime-only state. A live smoke script starts the real API and sends the same contract payloads used by the UI, so mocks are not the compatibility proof.

**Tech Stack:** React 18, TypeScript 4.9.5, browser fetch/FormData, CRA/Jest, PowerShell live HTTP smoke.

**Source specification path:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

## Prerequisites

- Reviewed Plan 04 commit is HEAD and all prior gates pass.
- Browser API paths are relative `/api/...`. The repository has no proxy configuration, so add exact CRA development proxy `"proxy": "http://localhost:5080"` to `package.json`. Production hosting/reverse-proxy configuration is outside the repository and remains an explicitly unresolved deployment prerequisite; do not invent it. If port 5080 is occupied during the live smoke test, STOP.

## Exact files to read before editing

`package.json`, `types.ts`, `FileLoader.tsx`, `MonoReport.tsx`, every `MonoReport/Categories/**.tsx` renderer, `RulesConfiguration.tsx`, backend controllers/contracts/tests/fixtures, and `MyBudget.Api/Program.cs`.

## Exact files

- Create `src/my-budget-ui/src/api/reportApi.ts`, `reportApi.test.ts`
- Create `src/my-budget-ui/src/pages/MonoReport/MonoReport.test.tsx`
- Create `scripts/verify-api-ui-contract.ps1`
- Modify `src/my-budget-ui/package.json`
- Modify `src/my-budget-ui/src/pages/MonoReport/MonoReport.tsx`
- Do not change report interfaces or renderer component signatures unless preflight proves mismatch; any mismatch is a blocker requiring plan revision.

## Exact interfaces produced

```ts
export interface RulesLoadResponse { categoryRulesCount: number; subCategoryRulesCount: number; }
export class ApiError extends Error { constructor(public readonly status: number, message: string) { super(message); } }
export async function loadRules(file: File): Promise<RulesLoadResponse>;
export async function convertCsv(file: File): Promise<IReport>;
```

Both call exact relative paths `/api/rules/load` and `/api/reports/convert`. `loadRules` sends `Content-Type: application/json` and exact file text; `convertCsv` appends key `file` to `FormData` and must not manually set multipart Content-Type. Non-2xx throws `ApiError`; plain text `Load rules first` is preserved, problem JSON chooses first `errors` message then `title`.

## Canonical backend/frontend contract (verbatim from Plan 03)

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

## Discovery/preflight

- [ ] `rg -n "IReport|ICategory|ISubCategory|IExpense|<FileLoader|fetch\\(" src/my-budget-ui/src -g '*.ts' -g '*.tsx'`; list every renderer/type/FileLoader consumer and reopen the actual interfaces.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Bite-sized TDD steps

- [ ] Client tests mock transport only to assert exact URL/method/header/body/FormData key, success return, problem error, and exact plain-text error.
- [ ] Component tests mock `reportApi` only for UI behavior: two labelled controls; CSV disabled initially; valid rules success status/count enables CSV; rules failure keeps disabled; conversion loading state; success renders exact date range, total, category, then user expands category/subcategory and sees expense; failure shows error and leaves prior report; two sequential CSV uploads invoke conversion twice.
- [ ] Run focused tests and expect failure for absent module/controls: `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand reportApi.test.ts MonoReport.test.tsx`.

Hard stop: expected nonzero only at this red step; if it passes, STOP.

- [ ] Implement `reportApi.ts` exact signatures and deterministic error parser.
- [ ] Implement MonoReport state: `rulesLoaded`, separate `isLoading`, `errorMessage`, `report`; no storage APIs; two FileLoaders labelled `Load rules`/`Convert CSV`, accepts `.json`/`.csv`; because FileLoader lacks `disabled`, render CSV control inside a disabled `<fieldset>` (or add `disabled?: boolean` to FileLoader with a failing FileLoader test and update all consumers in this same plan).
- [ ] Create smoke script that starts `dotnet run --project src/my-budget-calculation/MyBudget.Api/MyBudget.Api.csproj --urls http://127.0.0.1:5080 --no-build`, waits for health, posts the tracked test fixtures with `Invoke-RestMethod`, asserts exact count and every report level/value, then stops only the recorded process in `finally`. This is the mandatory real cross-boundary HTTP proof; mock tests are supplementary.

## Focused verification

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand reportApi.test.ts MonoReport.test.tsx`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand --listTests` and report discovered test files/count; both new files required.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify-api-ui-contract.ps1`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Broader regression

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui run build`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `dotnet test src/my-budget-calculation/MyBudget.sln -v normal`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `git diff --check`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Commit/handoff

Stage: `git add src/my-budget-ui/src/api src/my-budget-ui/src/pages/MonoReport src/my-budget-ui/package.json scripts/verify-api-ui-contract.ps1`

Commit: `git commit -m "feat(ui): load rules and render converted reports"`

```text
Plan: 05 UI API flow
Commit/hash:
Exact contract URLs/request bodies observed:
UI test discovery/execution/pass counts:
Live API smoke assertions/exit code:
UI build and solution test exit codes:
Independent verifier: PENDING
```
