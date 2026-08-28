# Reusable File Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Complete only this plan and stop for review.

**Goal:** Let `FileLoader` deliver a `File` to API workflows while preserving the rules editor's text-content workflow.

**Architecture:** One component exposes a discriminated union so exactly one callback mode is selected. Both existing consumers remain type-safe.

**Tech Stack:** React 18, TypeScript 4.9.5, CRA/Jest, Testing Library.

**Source specification path:** `docs/superpowers/specs/2026-08-06-family-budget-api-ui-iteration1-design.md`

## Prerequisites

- Reviewed Plan 03 commit is HEAD; all backend gates pass.
- Run commands from repository root unless command begins with `npm --prefix src/my-budget-ui`.

## Exact files to read before editing

- `src/my-budget-ui/package.json`, `tsconfig.json`, `setupTests.ts`
- `src/my-budget-ui/src/common/FileLoader/FileLoader.tsx`, `index.ts`
- `src/my-budget-ui/src/pages/MonoReport/MonoReport.tsx`
- `src/my-budget-ui/src/pages/RulesConfiguration/RulesConfiguration.tsx`

## Exact files

- Modify `src/my-budget-ui/src/common/FileLoader/FileLoader.tsx`
- Create `src/my-budget-ui/src/common/FileLoader/FileLoader.test.tsx`
- Modify `src/my-budget-ui/src/pages/RulesConfiguration/RulesConfiguration.tsx` only if required to make mode explicit
- Do not yet modify MonoReport behavior; its current text mode remains until Plan 05.

## Exact interfaces consumed and produced

```ts
type FileContentProps = { accept?: string; buttonLabel?: string; onFileContent: (content: string) => void; onFileSelected?: never };
type FileSelectedProps = { accept?: string; buttonLabel?: string; onFileSelected: (file: File) => void; onFileContent?: never };
export type FileLoaderProps = FileContentProps | FileSelectedProps;
```

`accept` defaults to `.json`; `buttonLabel` defaults to `Choose File`; selected mode calls its callback once and displays the filename. Existing consumers discovered: `MonoReport.tsx` and `RulesConfiguration.tsx` only.

## Request/response formats

No HTTP boundary changes. Input is browser `File`; output is either that identical `File` object or UTF-8 text from `File.text()`/`FileReader`, according to the discriminated callback.

## Discovery/preflight

- [ ] `rg -n "<FileLoader|onFileContent|onFileSelected" src/my-budget-ui/src -g '*.tsx' -g '*.ts'` and list both existing consumers.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] Reopen `FileLoader.tsx` and both consumers immediately before changing props.

## Bite-sized TDD steps

- [ ] Create `FileLoader.test.tsx` with four named, non-skipped tests: JSON upload asserts text callback/content/name; CSV upload with `accept=".csv"` asserts identical File callback/name; custom label renders; default label renders.
- [ ] Run `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand FileLoader.test.tsx`; expect TypeScript/test failure because `onFileSelected`, `accept`, and `buttonLabel` do not exist.

Hard stop: expected nonzero only at this red step; if it passes, STOP and report why the test did not prove the interface.

- [ ] Implement the exact discriminated union, retain hidden input/ref, set filename before callback, invoke selected callback directly, otherwise read text and invoke content callback. Remove unused imports.
- [ ] Confirm both consumers match the real union; preserve `RulesConfiguration` text behavior and current MonoReport behavior.

## Focused verification

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand --listTests` — report discovered paths and require `FileLoader.test.tsx`.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand FileLoader.test.tsx` — report executed/passed count, at least 4.

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Broader regression

- [ ] `npm --prefix src/my-budget-ui test -- --watchAll=false --runInBand`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `npm --prefix src/my-budget-ui run build`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

- [ ] `git diff --check`

Hard stop: “If this command exits nonzero, STOP immediately. Do not continue to the next step, do not commit, and do not modify unrelated files. Return the complete command, exit code, error output, changed files, and current git diff.”

## Commit/handoff

Stage: `git add src/my-budget-ui/src/common/FileLoader src/my-budget-ui/src/pages/RulesConfiguration/RulesConfiguration.tsx`

Commit: `git commit -m "refactor(ui): support file selection without breaking rules editor"`

```text
Plan: 04 FileLoader
Commit/hash:
All consumers found/checked:
Discovered/executed/passed UI tests:
Production build exit code:
Independent verifier: PENDING
```
