# Requirements Baseline

Date: 10 November 2026
Project: RK-26-1235 Personal Fitness and Workout Planner App
Target: Mobile-first PWA, initially tested on iPhone

## Primary functional requirements

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR1 | The user can create, view, edit and delete a weekly workout plan. | Test each operation, invalid input and cancellation. |
| FR2 | The user can browse at least 10 reviewed exercises, with instructions and correctly credited media where used. | Check the exercise count and media/source register. |
| FR3 | The user can log, view, edit and delete completed workout sessions. | Confirm records remain correct after closing and reopening the app. |
| FR4 | The app shows completed sessions per week, weekly plan-completion percentage, and resistance-training volume where applicable. | Compare results with hand-calculated test data. Show N/A when no sessions are planned. |
| FR5 | The user can create, edit and cancel workout reminders. | Test on the iPhone. Feasibility is not yet verified; record permission, scheduling, cancellation and delivery results separately. |
| FR6 | The user can reset or delete profile and workout data. | Confirm reset removes test data and shows an appropriate confirmation. |

## Non-functional requirements

- The interface is responsive and readable on the target iPhone and a computer browser.
- Essential actions do not depend on gesture-only interaction.
- Use synthetic test profiles; do not collect diagnoses, injury details or body measurements.
- Record the source and licence for external exercise images or videos.
- Provide understandable errors and protect users from accidental deletion where practical.

## Project success measures

- Execute at least 20 requirements-linked acceptance tests.
- Pass every test marked critical.
- Pass at least 90% of all acceptance tests after fixes.
- Match every predefined analytics test case to its expected result.
- Have no unresolved critical defect blocking plan creation, workout logging or progress review.
- Document reminder feasibility and limitations honestly.

## Out of scope for the initial version

- Separate native iOS and Android applications
- Cloud account synchronisation
- Medical advice, diagnosis or rehabilitation plans
- Machine-learning model training
- Cross-zone push delivery
- Optional rule-based suggestions and CSV export until primary requirements pass
