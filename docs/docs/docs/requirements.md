# Requirements Baseline

Date: 10 November 2026
Project: RK-26-1235 Personal Fitness and Workout Planner App
Target: Mobile-first PWA, initially tested on iPhone

## Primary requirements

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR1 | The user can create, view, edit and delete a weekly workout plan. | Test each operation, including invalid input and cancellation. |
| FR2 | The user can browse at least 10 reviewed exercises, with instructions and correctly credited media where used. | Exercise count and media/source register are checked. |
| FR3 | The user can log, view, edit and delete completed workout sessions. | Records remain correct after closing and reopening the app. |
| FR4 | The app shows completed sessions per week, weekly plan-completion percentage, and resistance-training volume where applicable. | Results match hand-calculated test data; show N/A when no sessions are planned. |
| FR5 | The user can create, edit and cancel workout reminders. | Reminder permission, scheduling, cancellation and delivery are tested on the target iPhone. Feasibility is currently unverified. |
| FR6 | The user can reset or delete profile and workout data. | Reset removes the test data and the app displays an appropriate confirmation. |

## Non-functional requirements

- The interface is responsive and readable on the target iPhone and a computer browser.
- Essential actions do not depend on gesture-only interaction.
- Use synthetic test profiles; do not collect diagnoses, injury details or body measurements.
- Record the source and licence for external exercise images or videos.
- Provide understandable errors and protect users from accidental deletion where practical.

## Project success measures

- At least 20 requirements-linked acceptance tests are executed.
- Every test marked critical passes.
- At least 90% of all acceptance tests pass after fixes.
- Every predefined analytics test case matches its expected result.
- No unresolved critical defect blocks the core plan, logging or progress workflow.
- Reminder feasibility and limitations are documented honestly.

## Out of scope for the initial version

- Separate native iOS and Android applications
- Cloud account synchronisation
- Medical advice, diagnosis or rehabilitation plans
- Machine-learning model training
- Cross-zone push delivery
- Optional rule-based suggestions and CSV export until primary requirements pass
