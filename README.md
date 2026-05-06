# Yuranka Games

React app for the Yuranka Games website, deployed to GitHub Pages.

## Scripts

`npm start`

Starts the Vite dev server.

`npm run build`

Builds the production site into the `build/` directory.

`npm test`

Runs the Vitest test suite.

`npm run deploy`

Builds the app and publishes `build/` to GitHub Pages through `gh-pages`.

## Notes

- Routing uses `HashRouter`, which keeps navigation compatible with GitHub Pages static hosting.
- Static public assets live in `public/`.
