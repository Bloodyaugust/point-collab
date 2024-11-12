# Point Collab

A real-time multiplayer tool for development teams to point stories, a-la "poker" type games.

No accounts, no ads, no nonsense. Just go to the site, enter your name, join or create a team (and invite others), and go!

## Tech Stack

Point Collab uses [Vite](https://vite.dev/) as the build system. It uses React for all SPA functionality. Finally, data persistence and realtime features that make the app work are done with [Pocketbase](https://pocketbase.io/).

## Design Choices

Point Collab was designed to be used without an account of any sort. No email signup, no SSO, no nothing. Each connected client (browser/localstorage instance) generates a uuidv4 to uniquely identify that client, and uses that ID when creating a `UserState` object for a given team. `UserState` contains all relevant session data that is not `Team`-wide, and changes to both of these models are read in realtime by the frontend.

This means that a user, especially admins, will have to consistently use the same device, or just create new teams. This is seen as an acceptable concession in order to not require accounts.

## Development

`npm install`

`npm run dev`

You will also need an accessible and correctly-configured Pocketbase instance (`>=v0.20` for realtime support) for data persistence and realtime. It should be easy to configure a new instance based on the `src/types/` directory.

## Testing

`npm run test`

Testing is handled with [Playwright](https://playwright.dev/). Multiplayer features are tested. Repo is configured to run tests in Github Actions.

## Deployment

Deploy the result of `npm run build` to your static file server of choice. Additionally, a host that can run either the Pocketbase executable _or_ run/host a Dockerfile _and_ offers persistent storage is necessary.

The "canonical" site built from pushes to `main` on this repository runs on [Railway](https://railway.app/), and uses their "Persistent Volumes" feature, as well as [this dockerfile](https://github.com/Bloodyaugust/point-collab-pocketbase).

If you do host this app anywhere that is not the "canonical" site, make sure to change the privacy page to something that makes sense for you.
