# Requirements Baseline

**Date:** 22 November 2026  
**Project:** RK-26-1235 Personal Fitness and Workout Planner App  
**Platform:** Mobile-first Progressive Web App (PWA), designed for a phone and desktop browser; initial device testing on iPhone 14 Pro (iOS 26.6).  
**Baseline note:** The original project remains focused on convenient workout planning, exercise guidance, workout logging, progress insights and reminders. The supervisor's registration/profile demonstration has been added as a small, local prototype requirement. It does not turn this project into a cloud account service.

## Project scope and convenience

The app makes fitness more convenient by keeping a user's weekly plan, exercise instructions, workout log, progress summary, goals and reminders together in one responsive interface. A user should be able to choose a planned session, see how to perform its exercises, record what was completed and review progress without maintaining separate paper notes or spreadsheets.

The first release is a single-device educational prototype. Account and profile details are stored on the device for demonstration; there is no cloud synchronisation, password recovery or multi-user service. Only fictional test data will be used in demonstrations. The app is not a medical product and must not present recommendations as medical advice.

## Functional requirements

| ID | Requirement | Acceptance evidence |
|---|---|---|
| FR1 | The user can register a local demo account, log in and log out, then view and update a profile containing a display name, age, height, weight and fitness goal. Profile fields must be editable; age, height and weight are optional and use fictional test values during evaluation. | Demonstrate registration, successful login/logout and profile updates. Check validation and confirm that saved profile data remains after closing and reopening the PWA on the same device. State clearly that this is local prototype authentication, not production-grade account security. |
| FR2 | The user can create, view, edit and delete a weekly workout plan by choosing exercises and days, and setting duration, repetitions/sets where relevant and a schedule. | Demonstrate creating and modifying a weekly plan. Check required fields, invalid values, saving and cancellation. |
| FR3 | The user can search and browse an exercise library of at least 10 reviewed exercises. Each entry includes its name, description, instructions and difficulty level; relevant media may be included where its source and licence can be recorded. | Search by exercise name or keyword and open an exercise to view its instructions and difficulty. Check the minimum library size and the source register for any external media. |
| FR4 | The user can record a completed workout, including its date and the planned/completed exercises and relevant performance details, then view, edit or delete that log. | Record a sample workout and verify that it is shown correctly after navigating away and reopening the PWA. Test editing and deletion with fictional data. |
| FR5 | The app presents progress summaries or charts, including completed sessions per week, workout frequency and weekly plan-completion percentage. Resistance-training volume may be shown where the logged data supports it. | Compare chart and summary values with hand-calculated sample records. Show a clear empty state or N/A when there is not enough data. |
| FR6 | The user can set and update a personal fitness goal and view progress towards it. The user can create, edit and cancel reminders for scheduled workouts and, where practical, outstanding goals. | Demonstrate a goal and its progress. Demonstrate a reminder arriving on the target iPhone, and record whether delivery works with the PWA open, in the background or closed. Record permission, scheduling, cancellation and delivery separately. |
| FR7 | The user can reset or delete locally stored profile, plan, workout, goal and reminder data. | Use fictional test data, confirm the action, and verify that the selected data is removed. |

## Supervisor demonstration checklist

1. Demonstrate local registration, login and profile updates (FR1).
2. Demonstrate creation and modification of a weekly workout plan (FR2).
3. Demonstrate searching the exercise library and viewing instructions (FR3).
4. Demonstrate recording a workout and displaying its progress chart (FR4–FR5).
5. Demonstrate setting a fitness goal and receiving a workout reminder (FR6).

## Non-functional requirements and constraints

- The interface is responsive, readable and usable on the target iPhone and a desktop browser.
- Core tasks must have visible buttons and forms; they must not depend on gesture-only interaction. Gesture-based logging remains optional unless later confirmed as mandatory.
- Use fictional profiles and workout records during development and evaluation. Although the supervisor's demo asks for age, height and weight fields, do not enter real personal measurements into the public prototype.
- Keep profile and workout data on the device for this prototype. Explain that clearing browser/PWA site data may remove it and that local demo sign-in is not equivalent to a production authentication service.
- Provide understandable validation and error messages and protect against accidental deletion where practical.
- Record the source and licence for any externally sourced exercise image or video. Prefer text instructions or media that can be properly credited.
- Reminder delivery must be tested on the iPhone. A permission prompt alone is not evidence that a scheduled notification was delivered. Report the delivery mode and any iOS/PWA limitations honestly. Web Push server delivery is a feasibility/deployment dependency, not assumed to work until demonstrated.
- This is a fitness-planning and tracking prototype, not a source of medical advice, diagnosis, treatment or rehabilitation plans.

## Project success measures

- Complete all five supervisor demonstration scenarios above using fictional test data.
- Execute at least 25 requirements-linked acceptance checks, including input validation, persistence, edit/delete behaviour and empty states.
- Pass every check marked critical and at least 90% of all checks after fixes.
- Match every predefined chart/summary test case to its hand-calculated expected result.
- Have no unresolved critical defect preventing plan creation, workout logging or progress review.
- Demonstrate an actual workout reminder on the target iPhone, or document the specific blocker and evidence; do not count a permission prompt alone as success.
- Record usability observations from the developer's own task walkthrough. Any external participant testing must only occur after appropriate supervisor/module approval and an ethics check.

## Out of scope for the initial release

- Native iOS or Android applications separate from the PWA
- Cloud account synchronisation, multi-user hosting or account recovery
- Production-grade authentication or storage of real personal/health data
- Medical advice, diagnosis, rehabilitation or injury-related features
- Training a machine-learning model; rule-based suggestions remain optional after core requirements
- Guaranteed background/cross-time-zone notification delivery before it has been tested on the target device and the required server is available
- Large external user studies unless separately approved

## Change control

This baseline incorporates the supervisor's functional requirements while retaining the original project's core scope. If implementation evidence shows that local account handling or closed-app reminders require a server or significantly expand the work, discuss the change with the supervisor and update the PDD and this baseline before claiming full compliance.
