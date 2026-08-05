# Architecture and Coupling Analysis

## Project Structure

### MyBudget.Console (UI Layer)
- CLI entry point that walks the user through file selection and triggers report generation
- References `MyBudget.Core` - specifically uses `ReportGenerator`, `JsonReader`, `BankReportReader`
- Uses Spectre.Console for UI interactions

### MyBudget.Core (Domain Layer)
Contains all business logic and data models:
- **Models** - POCOs for transactions, rules, MMC groups, report structures
- **Tools** - Reusable services that operate on models (JSON I/O, CSV parsing, rule processing, report generation)

### MyBudget.UI (React Frontend)
The UI is a single‑page application built with React and TypeScript.
- Entry point: `src/index.tsx` renders the root `<App />` component.
- Routing: `react-router-dom` defines routes in `src/route/route.tsx`, mapping paths to page components (`MonoReport`, `RulesConfiguration`, `MCC`, `ExpenseReport`).
- Layout: A shared layout component (`src/layout`) wraps all pages, providing consistent navigation and styling.
- Common utilities: `common/FileLoader` (handles file uploads), `common/FlexRow` (layout helper), and `common/Section` (section wrapper).
- Pages are organized under `src/pages`, each representing a distinct feature of the budgeting tool.

## Key Dependencies

| Layer / Module | Primary Responsibility | Key Dependencies |
|----------------|------------------------|------------------|
| **MyBudget.Console** | CLI entry point | *MyBudget.Core* – references `ReportGenerator`, `JsonReader`, `BankReportReader`. Uses Spectre.Console for UI. |
| **MyBudget.Core** | Domain logic & data‑model definitions | • `System.Text.Json` (for JSON serialization/deserialization).<br>• `MyBudget.Core.Models.*` – all tools reference the model classes they manipulate. |
| **Models** | Pure data contracts | No external dependencies; only used by Tools. |
| **Tools** | Business logic operations | • `MyBudget.Core.Models.*` (all models).<br>• `System.Linq`, `System.Globalization`, `System.Text.Json`. |
| **MyBudget.UI** | React frontend | • `react`, `react-dom`, `react-router-dom`.<br>• TypeScript types and JSX support. |

## Coupling Analysis

1. **High coupling between Tools and Models**
   - Every tool class imports multiple model namespaces, especially `ReportGenerator` which pulls in `Mmc`, `Rules`, `Transactions`, and report classes.
   - This is intentional because the tools are thin wrappers around domain data; however it increases compile‑time dependencies.

2. **Console ↔ Core coupling**
   - The console project references only the core project, keeping UI logic separate from business logic.  
   - No direct reference to any external libraries beyond Spectre.Console.

3. **RuleProcessor's dynamic expression building**
   - Uses `System.Linq.Expressions` to construct predicates at runtime. This introduces a moderate level of complexity but keeps rule evaluation flexible.

4. **Minimal cross‑project dependencies**
   - Only two projects exist (`MyBudget.Console`, `MyBudget.Core`).  
   - No third‑party libraries are used inside the core, except for JSON handling and LINQ.

5. **Potential areas to reduce coupling**
   - Extract a dedicated *Domain* project containing only models; let Tools reference Domain instead of Core.  
   - Introduce interfaces (e.g., `IReportGenerator`, `IRuleProcessor`) in Core and inject implementations via the console, enabling easier testing and future UI swaps.

## Summary

The solution follows a clean separation between **UI** (`MyBudget.Console`), **domain logic** (`MyBudget.Core`), and a **React frontend** (`MyBudget.UI`).  
All business rules, data parsing, and report generation are encapsulated within the core, which depends only on .NET base libraries and its own model definitions. The coupling is primarily *model‑centric*—tools depend heavily on the data contracts they manipulate—which is acceptable for a small project but could be refined with interfaces or a dedicated domain layer if scalability becomes an issue.
