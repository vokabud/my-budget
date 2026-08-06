# Family Budget Iteration 1 Design

Date: 2026-08-06  
Status: Draft for review

## 1. Context and Goal

Today the family budget flow is two-step:
1. Convert bank CSV to report JSON using console app.
2. Load report JSON in UI to render categories and totals.

Iteration 1 goal is to remove the manual console step and move to one UI-driven flow:
1. Upload rules in UI.
2. Upload CSV in UI.
3. Backend converts synchronously.
4. UI renders returned report immediately.

## 2. Scope

### In Scope

1. Add a backend HTTP API wrapper around current calculation logic.
2. Keep MCC catalog as backend constant/static data.
3. Accept Rules JSON from UI and keep active rules in backend memory.
4. Accept CSV upload from UI, convert synchronously, return report JSON.
5. Update UI to call backend instead of loading report JSON from disk.
6. Show report on screen using existing report rendering components.
7. Remove console project from solution and repository as active path.

### Out of Scope

1. .NET Aspire orchestration.
2. Database persistence.
3. Multi-user auth and identity.
4. Durable session storage across backend restarts.

## 3. Functional Requirements

1. User can upload Rules JSON once per app runtime and receive validation feedback.
2. Backend stores last loaded rules in memory.
3. User can upload multiple CSV files after rules are loaded.
4. Convert endpoint is synchronous and returns report JSON in response body.
5. If convert is called before rules are loaded, backend returns clear error: Load rules first.
6. UI disables convert action until rules load succeeds.
7. UI renders report exactly as current report page does (date range, total, categories, subcategories, expenses).

## 4. Architecture

## 4.1 Projects

1. Add new project: MyBudget.Api (ASP.NET Core Web API).
2. Keep MyBudget.Core as domain/calculation library.
3. Remove MyBudget.Console project from solution and repo.
4. Keep UI project and connect it to API.

## 4.2 Backend Components

1. RulesStateStore (in-memory)
- Holds current active rules object.
- Lifecycle: process lifetime only.

2. MccProvider (static)
- Provides MCC mapping used by calculation.
- Source is a backend-shipped static JSON asset (treated as constant in v1).

3. CalculationService
- Inputs: CSV stream and active rules.
- Uses existing core tools to parse and generate ExpenseReport.
- Output: report object serialized to JSON.

4. API Controllers/Endpoints
- Rules loading endpoint.
- CSV conversion endpoint.
- Optional health endpoint.

## 4.3 API Contract (v1)

1. POST /api/rules/load
- Request: JSON body matching current rules schema.
- Response success: 200 with summary (for example category and subcategory rule counts).
- Response failure: 400 with validation details.

2. POST /api/reports/convert
- Request: multipart/form-data with one CSV file.
- Preconditions: active rules must exist in memory.
- Response success: 200 with report JSON matching UI IReport shape.
- Response failure:
  - 400 Load rules first when no active rules.
  - 400 invalid CSV/rules input.
  - 500 unexpected server error.

3. GET /api/health (optional in iteration 1)
- Response success: 200 OK.

## 5. Data Flow

1. UI starts with no report and no loaded-rules status.
2. User uploads Rules JSON.
3. UI sends rules to POST /api/rules/load.
4. Backend validates and stores rules in memory.
5. UI marks state as rules loaded.
6. User uploads CSV.
7. UI sends CSV to POST /api/reports/convert.
8. Backend checks rules presence.
9. Backend parses CSV, applies rules and MCC, builds report.
10. Backend returns report JSON.
11. UI sets report state and renders current report view.

Behavior note:
- Backend restart clears in-memory rules and requires loading rules again.

## 6. UI Changes

1. Replace local report JSON file loading flow on mono report page with API-driven conversion flow.
2. Keep existing report rendering components unchanged where possible.
3. Add explicit two-step controls:
- Step A: Load rules file.
- Step B: Convert CSV file.
4. Add visible status and error messages for both steps.
5. Keep rules only in runtime memory state in UI (no localStorage/sessionStorage in v1).
6. Optional UX rule: keep previously rendered report visible if a new convert request fails.

## 7. Error Handling

1. Rules validation errors:
- Return structured validation error from API.
- Show message in UI near rules step.

2. Missing rules on convert:
- API returns 400 Load rules first.
- UI shows clear action hint.

3. CSV format errors:
- API returns 400 with parse context (line/column when practical).
- UI shows concise message and keeps page usable.

4. Unexpected failures:
- API returns 500 with safe message.
- UI shows retry guidance.

## 8. Testing Strategy

## 8.1 Backend

1. Rules load endpoint success and invalid payload cases.
2. Convert endpoint returns 400 when rules are not loaded.
3. Convert endpoint success with representative fixtures.
4. Convert endpoint returns 400 for malformed CSV.
5. Contract test verifying response JSON matches expected report structure.

## 8.2 UI

1. Convert action is disabled until rules are loaded.
2. Successful rules upload updates status.
3. Successful CSV conversion renders report details.
4. API error paths render useful messages.

## 8.3 Integration

1. End-to-end API flow test: load rules then convert CSV.
2. Negative flow: convert before load rules.

## 9. Migration and Compatibility

1. This iteration intentionally removes console flow from active architecture.
2. Core calculation logic remains reusable and shared by API.
3. Future iterations will add Aspire orchestration and PostgreSQL-backed configuration.

## 10. Acceptance Criteria

1. User can run UI and API, load rules, upload CSV, and see rendered report without console usage.
2. Convert before rules load returns Load rules first and UI shows it.
3. Report rendering content matches current semantics (date range, totals, category tree).
4. Console project is removed from solution and repository.
5. Automated tests cover critical success and failure paths.

## 11. Risks and Mitigations

1. Risk: Hidden coupling to console file assumptions.
- Mitigation: Isolate file handling in API adapters and keep core contracts explicit.

2. Risk: In-memory rules lost on restart can confuse users.
- Mitigation: Show clear UI status and first-action hint after backend restart.

3. Risk: CSV parsing format variance from bank exports.
- Mitigation: Add representative test fixtures and strict error messages.

## 12. Iteration Roadmap

1. Iteration 1 (this spec): API wrapper + UI integration + console removal.
2. Iteration 2: .NET Aspire one-command local orchestration.
3. Iteration 3: PostgreSQL persistence for rules/configuration and migration from in-memory store.

## 13. Open Decisions Deferred to Later Iterations

1. Database schema for rules versioning and history.
2. Session/user model for concurrent usage.
3. Observability dashboards and distributed tracing through Aspire.
