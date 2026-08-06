# Family Budget Iteration 2 Design: .NET Aspire Local One-Go Run

Date: 2026-08-06  
Status: Draft for review

## 1. Context and Goal

Iteration 1 delivers API + UI conversion flow without console. Iteration 2 adds local orchestration so the full stack starts with one command and has a predictable developer experience.

Goal:
- Run API and UI together in one local startup flow using .NET Aspire.

## 2. Scope

### In Scope

1. Add Aspire AppHost and ServiceDefaults projects.
2. Register MyBudget API service in AppHost.
3. Register UI service in AppHost.
4. Configure service discovery/environment wiring so UI can call API.
5. Provide one-command local startup for both services.
6. Add health checks and readiness wiring used by Aspire dashboard.
7. Update docs for local run workflow.

### Out of Scope

1. Database introduction.
2. Persisted config/rules storage.
3. Authentication/authorization.
4. Production deployment topology.

## 3. Functional Requirements

1. Developer can start the app stack from Aspire AppHost and both API and UI come up.
2. UI successfully calls API without manual URL edits in source.
3. Health endpoints are visible in Aspire and reflect service state.
4. Existing iteration 1 behavior remains unchanged functionally.

## 4. Architecture

## 4.1 Projects

1. Add MyBudget.AppHost project.
2. Add MyBudget.ServiceDefaults project.
3. Keep existing MyBudget.Api and my-budget-ui projects.

## 4.2 Orchestration Model

1. AppHost defines two app resources:
- api resource mapped to MyBudget.Api
- ui resource mapped to my-budget-ui dev server

2. Shared defaults:
- OpenTelemetry and health defaults via ServiceDefaults for .NET services.
- Environment variable injection for UI API base URL.

3. Networking:
- Internal service names used by AppHost.
- External endpoints exposed for browser use.

## 4.3 Configuration Contract

1. API exposes base HTTP endpoint and health endpoint.
2. UI reads API base URL from environment at runtime/build-time bridge.
3. No hardcoded localhost port dependency in UI source files.

## 5. Data Flow

1. Developer starts AppHost.
2. AppHost starts API and UI resources.
3. UI gets API base URL from AppHost-provided configuration.
4. User loads rules and converts CSV as in iteration 1.
5. API responds synchronously and UI renders report.

## 6. Error Handling and Observability

1. API startup failure should appear in Aspire dashboard with logs.
2. UI startup failure should appear in AppHost output/dashboard.
3. Health endpoint failures should mark resource unhealthy.
4. UI should show API connectivity error if API is unavailable.

## 7. Testing Strategy

## 7.1 Automated

1. API tests from iteration 1 must still pass.
2. UI tests from iteration 1 must still pass.
3. Optional smoke test for configuration binding in AppHost.

## 7.2 Manual Smoke

1. Start AppHost with one command.
2. Confirm both services are running.
3. Load rules in UI.
4. Convert CSV in UI.
5. Confirm report renders.

## 8. Acceptance Criteria

1. One startup command launches API + UI locally via Aspire.
2. UI can call API without manual per-machine URL edits.
3. Existing conversion flow works end-to-end unchanged.
4. Documentation describes the new single local startup flow.

## 9. Risks and Mitigations

1. Risk: UI runtime config mismatch with React tooling.
- Mitigation: choose one explicit config pattern and test cold startup.

2. Risk: Hidden port collisions on local machine.
- Mitigation: let Aspire allocate or centralize port settings in one place.

3. Risk: Added complexity for developers unfamiliar with Aspire.
- Mitigation: add short runbook section with prerequisites and commands.

## 10. Deliverables

1. Aspire AppHost project and ServiceDefaults project.
2. Updated wiring between API and UI.
3. Updated local run instructions in documentation.
4. Verification notes for one-command startup and end-to-end conversion.
