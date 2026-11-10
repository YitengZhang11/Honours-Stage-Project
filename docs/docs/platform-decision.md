# Platform Decision

Date: 10 November 2026
Status: Selected provisionally; reminder feasibility is not yet verified.

## Proposed target

- Platform: Mobile-first Progressive Web App (PWA)
- Main test device: iPhone using Safari, with the PWA added to the Home Screen
- Development and additional testing: computer browser
- Main technologies: HTML, CSS and JavaScript

## Decision reasons

- I have studied web technologies and have some JavaScript experience.
- I can test the interface on both a computer and an iPhone.
- A responsive PWA can support workout planning, logging, the exercise library and progress views.

## Reminder feasibility risk

The current PDD requires device-local reminders and excludes cloud deployment.
Apple documents Web Push for web apps added to the Home Screen, with notifications
sent through a server. This may not meet the current device-local reminder requirement.

Before building the main features, test notification permission and delivery on the
iPhone. Record the iPhone model, iOS version, test steps and result. If the PWA
cannot meet the approved reminder requirement without changing project scope,
discuss the options with the project supervisor and update the requirements before
claiming the reminder objective is feasible.

## Scope

- Build for one PWA target; do not build separate native iOS and Android apps.
- Keep the application single-user unless the approved requirements change.
- Do not claim reminders are complete until they have been tested on the target device.
