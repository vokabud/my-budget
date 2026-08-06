# Family Budget Iteration 3 Design: PostgreSQL Config Persistence

Date: 2026-08-06  
Status: Draft for review

## 1. Context and Goal

Iteration 1 stores active rules in backend memory and loses them on restart. Iteration 2 standardizes local startup with Aspire. Iteration 3 introduces PostgreSQL persistence for configuration so rules are durable and no longer tied to process lifetime.

Goal:
- Persist rules/configuration in PostgreSQL and migrate backend from in-memory rules store to DB-backed store.

## 2. Scope

### In Scope

1. Add PostgreSQL resource to Aspire local stack.
2. Add persistence layer in MyBudget.Api for configuration storage.
3. Persist rules loaded from UI in database.
4. Replace in-memory active rules dependency in convert flow with DB-backed lookup.
5. Keep MCC static on backend in this iteration.
6. Add migrations and startup migration strategy for local development.
7. Update API and UI behavior for durable rules state.

### Out of Scope

1. Full auth/identity system.
2. Multi-tenant security boundaries.
3. MCC editing/storage in DB.
4. Historical analytics/report warehousing.

## 3. Functional Requirements

1. Rules loaded from UI are stored in PostgreSQL.
2. Convert endpoint uses persisted rules, not process-memory-only rules.
3. Backend restart does not lose active rules.
4. If no rules exist yet, convert endpoint returns clear Load rules first error.
5. Rules load endpoint can overwrite active rules for the household profile.

## 4. Data Model

## 4.1 Tables

1. ConfigProfiles
- Id (uuid, primary key)
- Name (text, unique)
- CreatedAtUtc (timestamp)
- UpdatedAtUtc (timestamp)

2. RuleSets
- Id (uuid, primary key)
- ProfileId (uuid, foreign key -> ConfigProfiles.Id)
- RulesJson (jsonb)
- IsActive (boolean)
- Version (int)
- CreatedAtUtc (timestamp)

## 4.2 Baseline Profile Model

1. Use single default profile for family usage in this iteration.
2. Keep schema ready for future multiple profiles without auth.

## 5. Architecture

## 5.1 Backend Components

1. RulesRepository
- Stores and fetches active rules for profile.

2. RulesService
- Validates incoming rules JSON.
- Upserts new active rules version.

3. ConversionService update
- Fetches active rules from repository before conversion.

4. EF Core DbContext (or chosen data access layer)
- Migrations and typed entity mapping.

## 5.2 API Contract Changes

1. POST /api/rules/load
- Persist rules in DB.
- Return profile id or profile name, plus version metadata.

2. POST /api/reports/convert
- No request contract change for v1 UI.
- Server resolves active rules from DB.

3. Optional GET /api/rules/active
- Return current active rules metadata for UI status display.

## 6. Data Flow

1. User uploads rules from UI.
2. API validates rules and writes new active rules row for default profile.
3. User uploads CSV for conversion.
4. API loads active rules from DB and performs conversion.
5. API returns report JSON.
6. UI renders report as before.

## 7. Migration Strategy

1. Add initial migration creating ConfigProfiles and RuleSets.
2. Seed default profile on startup or first write.
3. Remove in-memory rules store from conversion critical path.
4. Keep temporary fallback path disabled by default to avoid ambiguity.

## 8. Error Handling

1. Database unavailable:
- Return service unavailable or 500 with actionable message.
- UI shows retry guidance.

2. No active rules:
- Return 400 Load rules first.

3. Invalid rules payload:
- Return 400 validation details.

## 9. Testing Strategy

## 9.1 Backend

1. Repository tests for active rules read/write behavior.
2. Endpoint tests for rules persistence and convert using persisted rules.
3. Migration tests for schema creation and default profile bootstrap.
4. Restart resilience test: load rules, restart app, convert succeeds.

## 9.2 Integration

1. Local Aspire stack with PostgreSQL starts successfully.
2. End-to-end flow persists rules and converts CSV across restart.

## 10. Acceptance Criteria

1. Rules persist in PostgreSQL and survive API restarts.
2. Convert endpoint uses persisted active rules.
3. End-to-end family flow works without re-uploading rules after restart.
4. API/UI contracts remain backward-compatible for conversion request path.
5. Documentation includes DB migration and local startup instructions.

## 11. Risks and Mitigations

1. Risk: rules JSON schema drift over time.
- Mitigation: store schema version and validate at load time.

2. Risk: migration failures on fresh machines.
- Mitigation: startup checks plus clear migration command/runbook.

3. Risk: accidental multiple active rules versions.
- Mitigation: enforce single-active constraint per profile.

## 12. Deliverables

1. PostgreSQL resource wiring in Aspire.
2. Data schema + migrations.
3. DB-backed rules persistence and conversion lookup.
4. Updated docs and verification steps.
