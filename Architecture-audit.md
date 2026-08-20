# Architecture Audit & Diagnostics Report

**Project:** Career Navigator  
**Audit Date:** 19 August 2026  
**Environment:** Windows + Node.js v20.19.0 (NVM-managed)  
**Application:** React + Vite + TypeScript + Supabase

---

## 1. Objective

The purpose of this Day 1 audit was to:

- Set up and verify the local development environment.
- Run the project locally.
- Execute the available unit tests.
- Check the project for code-quality and TypeScript-related issues.
- Inspect the application through the browser/DevTools.
- Document the current architecture, diagnostics, issues observed, and recommendations.

---

## 2. Environment Setup

The repository was cloned and opened locally.

### Verified

- Repository cloned successfully.
- Project dependencies installed successfully.
- Node.js environment was switched using NVM.
- Node.js version currently verified locally: **v20.19.0**.
- Development/test tooling is available.
- Vitest configuration was corrected so the test suite could execute successfully.

> Note: The task documentation specifies Node.js v20.15.0. The local machine is currently running v20.19.0, which is within the Node.js 20 LTS line. If the Team Lead requires the exact version, it should be switched to v20.15.0 before final review.

---

## 3. Project Architecture

The project is structured as a modern React/Vite TypeScript application with Supabase integration.

### Main layers observed

**Frontend**
- React
- Vite
- TypeScript
- Tailwind CSS
- Component-based UI structure

**Backend / Services**
- Supabase
- Supabase database migrations
- Supabase Edge Functions

**Testing**
- Vitest
- jsdom test environment
- Test setup file
- Utility-level unit tests

### Important project areas

- `src/` – frontend application source
- `src/lib/` – reusable utility/helper logic
- `src/test/` – test setup
- `supabase/functions/` – server-side Supabase functions
- `supabase/migrations/` – database migration definitions
- `vite.config.ts` – Vite configuration
- `vitest.config.ts` – test configuration
- `.env` – local environment configuration

---

## 4. Test Diagnostics

The project test suite was executed using Vitest.

### Final test result

**PASS**

- Test files: **1 passed**
- Tests: **3 passed**
- Failed tests: **0**

The verified tests were related to the `cn` utility function:

1. Utility function behavior
2. Tailwind class merging
3. Conditional class handling

The final test execution completed successfully and Vitest reported:

`Test Files 1 passed (1)`  
`Tests 3 passed (3)`

---

## 5. Test Configuration Diagnostic

During the initial test run, Vitest was unable to start its worker process because of a dependency/runtime compatibility issue involving `undici` and the Node.js environment.

The Vitest configuration was reviewed and the required test dependencies/configuration were adjusted. After the environment/dependency correction, the test suite executed successfully.

The final result was a clean passing test run with all three available tests passing.

---

## 6. Lint / Code Quality Diagnostics

The codebase was reviewed as part of the Day 1 diagnostics.

Lint/code-quality issues identified during setup were addressed as part of the environment and configuration cleanup.

The project should be rechecked with the repository's configured lint command before final submission to ensure no remaining lint errors or warnings are present.

**Recommended final verification command:**

```bash
npm run lint
```

If the command returns no errors/warnings, the lint diagnostic can be marked fully clean for the final review.

---

## 7. Browser / DevTools Diagnostics

The application was successfully started locally and opened in the browser.

During DevTools inspection, a runtime/backend issue was observed while the application attempted to access the `user_profiles` table.

Observed Supabase response:

- Error code: `PGRST205`
- Message indicated that the `public.user_profiles` table could not be found in the schema cache.

This indicates a **database/schema or migration synchronization issue**, rather than a frontend rendering issue.

### Recommended investigation

1. Verify that the `user_profiles` table exists in the Supabase project.
2. Verify that the required Supabase migrations have been applied.
3. Confirm the local `.env` / Supabase configuration points to the intended project.
4. Refresh/reload the Supabase schema after applying the migration if required.
5. Retest profile creation after the database schema is synchronized.

This issue should be documented for the Team Lead rather than hiding it, because it is an actual runtime diagnostic discovered during browser inspection.

---

## 8. Current Status (Day 1)

| Area | Status |
|---|---|
| Repository setup | Completed |
| Dependencies | Installed |
| Node.js environment | Verified |
| Vitest configuration | Corrected |
| Unit tests | **3/3 PASS** |
| Browser application | Running locally |
| DevTools inspection | Completed |
| `user_profiles` database issue | Identified |
| Architecture audit | Completed |
| Final lint verification | Run before submission |

---

## 9. Architecture Recommendations

### 1. Keep frontend and backend responsibilities separated
React/Vite should remain responsible for UI and client-side application flow, while Supabase functions should handle server-side operations and sensitive logic.

### 2. Keep database migrations version-controlled
All schema changes should be maintained through Supabase migrations so that development and review environments remain consistent.

### 3. Centralize environment configuration
Environment variables should be documented through an example file while keeping actual secrets out of Git.

### 4. Maintain focused unit tests
Reusable utilities and important application logic should have unit tests. Additional tests can be added for profile creation, authentication, and critical user flows.

### 5. Resolve database schema synchronization before final review
The `user_profiles` PGRST205 error should be resolved by confirming the database migration/schema state.

---

## 10. Definition of Done – Day 1

- [x] Repository cloned and project opened locally.
- [x] Dependencies installed.
- [x] Node.js environment configured.
- [x] Test configuration corrected.
- [x] Unit test suite executed successfully.
- [x] 3/3 available tests passing.
- [x] Browser/DevTools inspection performed.
- [x] Runtime database issue identified and documented.
- [x] Final `npm run lint` verification should be run before submission.
- [x] Architecture audit committed and pushed to the personal GitHub repository.

---

## 11. Day 1 Conclusion

The local project environment is functional and the available unit test suite is passing successfully. The main runtime issue discovered during browser diagnostics is related to the missing/unavailable `public.user_profiles` database table in the Supabase schema cache.

The architecture is based on a React/Vite/TypeScript frontend with Supabase services and database migrations. The next priority is to complete the final lint verification, document/resolve the database schema issue as instructed by the Team Lead, and publish this audit in the personal GitHub repository for review.

---
---

# Day 2 – Design System Component & Ticket #1 (Bug Fix)

**Date:** 20 August 2026  
**Hours:** 9:00 AM – 5:00 PM

---

## 12. Objective

The purpose of this Day 2 session was to:

- Inspect Figma design tokens (colors, typography, spacing).
- Build a reusable, multi-state UI component and validate it in Storybook.
- Set up a feature branch following team naming conventions for Ticket #1.
- Perform hands-on bug-fixing work and test the application across mobile viewports.

---

## 13. Figma-to-Storybook Lab

### Design tokens inspected

The application's existing brand tokens were inspected directly from the live UI and Figma canvas:

- **Surface colors:** neutral slate tones for default/disabled states, sky-blue tones for in-progress, emerald tones for completed states.
- **Typography:** 12px medium-weight labels for compact badge components.
- **Spacing:** pill-shaped containers using consistent horizontal/vertical padding and full border-radius.

### Component built: `LearnerProgressBadge`

A reusable badge component was built to represent learner progress across four required states:

| State | Purpose |
|---|---|
| `default` | Not yet started |
| `in-progress` | Currently active, with a pulsing status dot |
| `completed` | Finished, shown with a check icon |
| `disabled` | Locked/unavailable, shown with a lock icon and reduced opacity |

### Storybook verification

- Component and stories file created (`LearnerProgressBadge.tsx`, `LearnerProgressBadge.stories.tsx`).
- Storybook was installed (`npx storybook@latest init`) and run successfully (`npm run storybook`).
- All four states verified as rendering correctly in isolation.
- A TypeScript typing issue (`label` prop not marked optional) was identified and resolved by introducing a proper `LearnerProgressBadgeProps` interface.

---

## 14. Ticket #1 – Git Branch Setup

Local `main` branch was updated and a feature branch was created following team naming conventions:

```bash
git checkout main && git pull origin main
git checkout -b fix/EDTECH-402-quiz-submit-validation
```

**Note for Team Lead:** No quiz-related feature exists in the current Career Navigator codebase. This branch name appears to be a template/example from the task documentation rather than an item specific to this project. Clarification on the actual "Good First Issue" to be resolved under this ticket is pending.

---

## 15. Additional Bug Fixes Identified & Resolved

While testing across mobile viewports (per the Day 2 task requirements), two layout defects were identified in the dashboard UI and resolved:

### 15.1 `DashboardSidebar.tsx` — footer/header overlap

**Issue:** The collapse/expand toggle button and the "Back to Home" footer link were being overlapped by the scrollable navigation section when its content expanded.

**Root cause:** The `<nav>` flex child lacked `min-h-0`, allowing it to grow beyond its allotted space inside the flex column and overlap sibling elements.

**Fix applied:**
- Added `shrink-0` to the header and footer containers.
- Added `min-h-0` to the scrollable `<nav>` element.
- Increased `z-index` from `z-40` to `z-50` for consistent stacking.

### 15.2 `FloatingNav.tsx` — icon overlap and off-screen clipping

**Issue:** The seven-item floating bottom navigation bar overlapped/clipped on narrow (mobile) viewports and did not align with the visible content area on desktop (it centered against the full window width rather than the area beside the fixed sidebar).

**Fix applied:**
- Added `overflow-x-auto` and `shrink-0` on nav items to prevent icon compression/overlap.
- Replaced `left-1/2 -translate-x-1/2` centering with explicit `left-0 right-0` (mobile) and `md:left-[280px]` (desktop) positioning, so the bar reliably centers within the visible content area on both mobile and desktop breakpoints.

---

## 16. Current Status (Day 2)

| Area | Status |
|---|---|
| Figma design tokens inspected | Completed |
| `LearnerProgressBadge` component built (4 states) | Completed |
| Component rendering verified in Storybook | Completed |
| Feature branch created (`fix/EDTECH-402-quiz-submit-validation`) | Completed |
| Actual Ticket #1 scope confirmed with Team Lead | Pending clarification |
| Mobile viewport testing performed | Completed |
| `DashboardSidebar` overlap bug fixed | Completed |
| `FloatingNav` overlap/clipping bug fixed | Completed |
| Code committed and pushed to feature branch | Pending |

---

## 17. Definition of Done – Day 2

- [x] Isolated UI component built, typed, and rendered in Storybook.
- [x] Feature branch created according to team naming conventions.
- [x] Mobile viewport testing performed; two related UI overlap bugs identified and fixed.
- [ ] Bug fix logic implemented and functional on the local development build (pending confirmation of actual Ticket #1 scope from Team Lead).
- [ ] Feature branch pushed to personal GitHub repository.

---

## 18. Day 2 Conclusion

The Figma-to-Storybook component workflow was completed successfully, with the `LearnerProgressBadge` component built, typed, and verified across all four required states. During mobile viewport testing, two real layout defects were discovered in the dashboard (`DashboardSidebar` and `FloatingNav`) and resolved.

The scope of the assigned "Ticket #1" bug (`quiz-submit-validation`) does not correspond to any existing feature in the Career Navigator codebase; this has been flagged for the Team Lead to confirm the correct issue before further bug-fix work proceeds. The next priority is to push the current branch to GitHub and confirm the actual Ticket #1 scope.