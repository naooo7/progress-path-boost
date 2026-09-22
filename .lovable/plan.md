# FastLearner UI/UX Polish and Real User Data

## Goal
Improve the existing FastLearner app incrementally, preserving its TanStack architecture, local-first persistence, question flow, taxonomy, institution themes, and working features. Replace every template metric and chart with values derived from the learner’s stored attempts.

## What the audit found
- The repository already has a good single activity store that persists attempts, answer result, timing, daily activity, per-question stats, mastery, review flags, weak materials, and streak calculations in the browser.
- Question submission already writes through that store, and Learn/material pages already use part of it.
- Home, Progress, Profile, and the material performance chart still contain hardcoded/template values.
- Institution selection, theme on/off, Light/Dark/System, and all four institution palettes already persist and will be preserved.
- No backend, authentication service, external database, or provider migration is needed; the requested local-first model remains intact.

## Implementation

### 1. Preserve and strengthen the activity source of truth
- Keep the existing persisted `user-data` service and storage abstraction.
- Add focused selectors for completion, range-based daily series, accuracy trends, study time, scope performance, recent attempts, mistakes, review counts, and recommended weak material.
- Make selectors handle no activity cleanly and never fabricate values.
- Keep attempt recording as the single update path so Home, Learn, Progress, Profile, mistakes/review, mastery, streaks, and graphs update together immediately.

### 2. Personalize Home without crowding it
- Keep the current structure and selected-institution frosted logo treatment.
- Replace the fixed greeting metrics, streak, Today’s Drill, Continue Learning, review count, weekly totals, and trend with persisted user activity.
- Make the strongest action Continue Learning, targeting the latest practiced material; use a sensible first material only when no history exists.
- Recommend Today’s Focus from actual weak materials, with a useful new-user empty state.
- Add compact Quick Start actions for 10, 15, 20 questions and the 60-second Challenge.
- Fix the Light Mode frosted-panel text contrast using the existing semantic theme system.

### 3. Add learning context at every Learn level
- Exam cards: attempted/completed questions and completion percentage.
- Subtest cards: progress and accuracy.
- Material rows/pages: completed questions, accuracy, and mastery.
- Preserve Exam → Subtest → Material navigation and current taxonomy.
- Replace the material page’s fake seven-session line with real recent performance or an honest empty state.

### 4. Refine Drill as a six-step guided setup
- Keep every existing filter and selection behavior.
- Present the existing controls as six clearly numbered steps: exam, subtest, materials, question count, difficulty/status, and optional 60-second Challenge.
- Add a concise live summary with available question count, selected materials, difficulty/status, challenge state, and estimated duration.
- Preserve validation when no questions match.

### 5. Polish the question experience
- Preserve question selection, scoring, timing, timeout, review, explanation, and completion logic.
- Clarify exam/subtest/material context, question count, progress, and challenge timer.
- Improve option sizing, touch targets, selected/correct/incorrect states, explanation hierarchy, review action, and Next/Finish action.
- Add only subtle state transitions and press feedback, respecting reduced-motion settings.

### 6. Replace Progress and Profile templates with real analytics
- Show totals for answered, correct, incorrect, accuracy, study time, average time, attempts, last practiced, current streak, and longest streak from stored attempts.
- Build live 7D, 30D, and All views for:
  - questions practiced over time
  - accuracy trend
  - study time
  - exam/subtest/material performance and weak areas
- Keep mistakes and needs-review counts tied to the same question stats.
- Show clear empty states when no history exists.
- Replace Profile’s fixed totals and streak with live values while preserving profile and theme settings.

### 7. Responsive and theme verification
- Verify Home, Drill, question options, graphs, and progress cards at 320px, 375px, 390px, and desktop.
- Verify Light and Dark presentation plus System behavior.
- Verify PKN STAN, UNPAD, UI, and ITB logos/palettes, immediate Home updates, theme-off restoration, and refresh persistence.

## Technical details
- Import the reviewed repository into this project rather than recreating pages.
- Keep TanStack Start, existing routes, design tokens, UI components, local storage keys, catalog, and question data.
- Remove UI imports from the legacy mock-data module where they produce analytics.
- Use the existing chart dependency for accessible responsive charts; chart inputs come only from activity selectors.
- Keep all visual changes token-based in the existing design system.

## QA and completion criteria
- Complete the full journey: choose institution → Home updates → build/start drill → answer → explanation → finish → activity/streak/progress/charts/mastery/mistakes/review update → refresh → data remains consistent.
- Verify there are no hardcoded analytics, fake chart series, or fake streaks in rendered screens.
- Check build output, browser console, navigation, Learn flow, Drill flow, question flow, empty states, mobile sizes, desktop, themes, and all institution variants.
- Final report will list UI/UX improvements, real-data analytics, streak status, graph status, bugs fixed, and any genuine remaining blocker.
