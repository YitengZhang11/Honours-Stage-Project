# Platform Decision

Date: 10 November 2026
Status: PWA selected; reminder feasibility remains unverified.

## Target

- Build a mobile-first Progressive Web App (PWA).
- Use an iPhone with Safari as the primary mobile test device.
- Use a computer browser for development and additional testing.
- Use HTML, CSS and JavaScript.

## Reasons

- I have studied web technologies and have some JavaScript experience.
- I can test on both a computer and an iPhone.
- A responsive PWA fits the project brief's mobile/web options.

## Reminder feasibility risk

The current PDD requires device-local reminders and excludes cloud deployment.
The iPhone PWA notification approach may require a Home Screen web app and a
server to send Web Push notifications. This has not been tested.

Before building the main features, test notification permission and delivery
on the iPhone. Record the device, iOS version, test steps and result. If this
approach cannot meet the approved requirement, discuss a scope change with the
project supervisor.

## Scope

- Target one PWA; do not build separate native iOS and Android apps.
- Do not claim reminders are complete until tested on the iPhone.
- Keep the app single-user unless the approved requirements change.
