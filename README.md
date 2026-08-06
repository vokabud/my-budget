# MyBudget

Parse Monobank expense reports and view categorized expenses in CLI and web interfaces.

## Repository Structure

- `src/my-budget-calculation` - .NET solution for report processing.
- `src/my-budget-ui` - React + TypeScript web UI for loading and exploring generated reports.
- `docs` - architecture and project notes.

## Backend Projects (`src/my-budget-calculation`)

- `MyBudget.Console` - CLI entry point for selecting input files and generating a JSON report.
- `MyBudget.Core` - domain models and processing tools (CSV import, rules processing, report generation, JSON read/write, PDF parser experiments).
- `MyBudget.Core.Tests` - xUnit tests for core behavior.

## Console Workflow

The console app expects a selected folder to contain:

- `MCC.json`
- `Rules.json`
- one CSV transaction file

After selecting a CSV file, it produces `<selected-file-name>.json` in the same folder.

## Frontend

The React app includes pages for:

- mono report view
- rules configuration
- MCC lookup
- expense report table

Run it from `src/my-budget-ui` with the standard CRA commands (`npm start`, `npm test`, `npm run build`).

# Status

In progress