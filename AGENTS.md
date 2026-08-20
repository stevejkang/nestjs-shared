# AGENTS.md

This file provides guidance for AI agents (Claude Code, Codex, etc.) working in this repository.

---

## Table of Contents

- [Work Cycle Rules](#work-cycle-rules)
- [Commit & PR Rules](#commit--pr-rules)
- [Monorepo Structure](#monorepo-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Adding a New Package](#adding-a-new-package)

---

## Work Cycle Rules

> These rules apply to **every work session** without exception.

### 1. Keep AGENTS.md Up to Date

If a conversation or mid-task decision causes a direction change significant enough to affect `AGENTS.md`, the file must be updated to reflect the latest state.

- **This MD update must be a separate, isolated commit** — never bundled with feature, fix, or refactor commits.
- AGENTS.md is the source of truth for implementation conventions.
- When in doubt whether a change is "significant enough": if it would cause a future agent to make a wrong decision, it is significant enough.

### 2. Pre-Commit / Pre-PR Checklist

Before committing or opening a PR, verify the following:

1. **Conventions followed** — all changes comply with the guidelines defined in this file (Monorepo Structure, Code Style, Testing, etc.)
2. **Tests added** — appropriate unit tests are written for new or changed logic
3. **Commit discipline** — commits follow the rules in Commit & PR Rules (meaningful units, signed, proper messages)
4. **CI expected to pass** — all checks that run in CI workflows (build, lint, typecheck, tests) pass locally before pushing

### 3. Respect .gitignore

**Never `git add -f` or force-commit a gitignored file.** If a file is in `.gitignore`, it is excluded from version control by design. This applies to all files without exception — `.env`, build artifacts, etc.

---

## Commit & PR Rules

### Commit Discipline

> These rules are critical. Agents must follow them strictly.

- **Keep commits semantic and focused** — each commit should represent one logically complete unit of work. Do not batch unrelated changes.
- **Commit immediately when a unit of work is done** — do not accumulate changes across multiple tasks. As soon as an individual piece of work is complete and passes verification, commit it.
- **Every commit must be CI-passing** — each individual commit must be in a state where the CI pipeline (build, lint, typecheck, tests) would pass. Never create a commit that would break CI, even if a subsequent commit would fix it.
- **Commits are merged as-is** — PRs use rebase merge (no squash). Every commit lands on `main` individually, so each must be a meaningful, self-contained unit that makes sense on its own in the main branch history. Commit messages and code comments should be written from the perspective of the final state (post-merge to main) — avoid intermediate decisions, session-specific context, or planning artifacts that lose meaning once merged.
- **Single author per commit** — always commit under the configured repository author. Co-authored commits (`Co-authored-by:`) are not allowed except in explicitly agreed exceptional cases.
- **All commits must be signed** (`git commit -S`). Unsigned commits will not be accepted.

### Commit Messages

Use **GitHub style**: imperative mood, capitalize first word, no period at end.

```
Add user TOTP enrollment endpoint
Fix refresh token expiry validation
Update user creation DTO validation rules
Remove unused Redis cache keys
```

- Keep subject line under 72 characters.
- Always add a body when possible (blank line after subject). Explain **why** the change was made, not just what. The more context, the better.
- **Never include internal planning references** (e.g., `Wave 1`, `T-3`, `Task 2`) in commit messages or bodies. These are ephemeral planning artifacts that lose meaning once merged to main. Only real issue/ticket numbers (e.g., `#123`, `PROJ-456`) belong in commits.

### Commit Squashing / Rebasing

- When commits within a branch need to be consolidated, use interactive rebase (`git rebase -i`).
- **Only adjacent commits may be squashed** without explicit user approval. Non-adjacent squashing reorders history and must be confirmed with the user first.
- Avoid trivially small commits (e.g., fixing a typo you just introduced) — amend the previous commit or squash before pushing.

### Pull Requests

- **Merge strategy**: Rebase merge (no merge commits, no squash).
- Keep PRs focused — one concern per PR.
- PR title follows the same commit message style.
- Reference related issues in the PR description.
- All checks (lint, type-check, tests) must pass before merging.

### Merge Rules

- **Always check for open PRs first** — before merging, check if there is an open PR on the upstream for the branch being merged.
- **Local fast-forward merge + push** — if an open PR exists, do NOT merge via `gh pr merge` or GitHub MCP tools. Instead, perform a local fast-forward merge (`git merge --ff-only`) on the base branch and push. This closes the upstream PR naturally via push and preserves a clean linear history.
- **Multiple branches → merge one at a time** — when merging several branches in sequence (e.g., `feature-a` → `develop` → `main`), do NOT merge all at once locally. Merge and push each base/destination pair sequentially so that each upstream PR is closed by the corresponding push. Merging everything locally before pushing leaves dangling open PRs on the upstream.

---

## Monorepo Structure

This is a pnpm monorepo managed with Turborepo. All packages live under `packages/`.

### Package Layout

Use an existing package as the template for package layout and configuration.

### Dependencies

- **Workspace dependencies**: Use `workspace:^` for cross-package references (e.g., pipes → common). `pnpm pack` and `changeset publish` rewrite these to real semver ranges automatically.
- **Peer dependencies**: Each package declares its runtime peers. All peers are mirrored in `devDependencies` using `catalog:` references.
- **Catalog**: All shared dependency versions are pinned in `pnpm-workspace.yaml` `catalog:` section. New dependencies should be added to the catalog first.

---

## Code Style Guidelines

### TypeScript

- **Strict mode** — see `tsconfig.base.json` for the full set of compiler options
- **No `any` type** — use `unknown` if type is truly unknown. Enforced by Biome `noExplicitAny: error`
- **Explicit return types** for all functions/methods
- Use `interface` for object contracts, `type` for unions/aliases
- Use `enum` keyword for constants with semantic meaning
- **`as any` / `@ts-ignore` / `@ts-expect-error` are banned** — never suppress type errors. If an external library has a type mismatch, fix the type or use `unknown` with proper narrowing.

### Formatting

Biome handles formatting and import organization. See `biome.json` for the full configuration. Do not add ESLint configs or `eslint-disable` comments. Use `biome-ignore` when suppression is genuinely necessary.

---

## Testing

- **Framework**: Vitest with SWC plugin for decorator metadata support
- **Test location**: `test/` directory only (never in `src/`). Enforced by `vitest.config.mts` include pattern: `test/**/*.spec.ts`
- **Test files**: Named `{FileName}.spec.ts`
- Use `describe()` blocks for grouping, `it()` for individual cases
- No Jest APIs — this repo uses Vitest exclusively

### Pre-Commit Verification

Before every commit: `pnpm turbo build lint typecheck test` must pass repo-wide.

---

## Adding a New Package

1. Copy an existing package as the template and adapt its source, tests, exports, metadata, and dependencies.
2. Keep test files under `test/` and export all consumer-facing values and types from `src/index.ts`.
3. Add peer dependencies and mirror them in `devDependencies` with `catalog:`.
4. Keep the package README and `package.json` description aligned.
5. Run `pnpm install` then `pnpm turbo build lint typecheck test`.
