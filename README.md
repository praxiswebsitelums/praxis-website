# Praxis Phase 1 — Static HTML/CSS/JavaScript

This is a clean static rebuild of the Praxis Phase 1 website.

## Run locally

No Node.js is required.

Use VS Code + the Live Server extension, or run any simple static server from this folder.

Example with Python:

```bash
python -m http.server 5500
```

Then open:

http://localhost:5500

## Structure

- `index.html` — homepage
- `about.html` — about
- `research.html` — research
- `events.html` — events
- `team.html` — founding members
- `register.html` — interest form
- `css/styles.css` — all styling
- `js/main.js` — slider, navigation, interactions
- `data/site.js` — centralized editable content
- `images/` — all replaceable image assets

## Replacing images

Keep the same filenames and replace:

- `hero-01.svg`
- `hero-02.svg`
- `hero-03.svg`
- `hero-04.svg`
- `what-we-do.svg`
- `founder-01.svg`
- `founder-02.svg`
- `founder-03.svg`
- `praxis-logo.jpg`

You can change the file extension only if you also update the corresponding path in `data/site.js` / HTML.

## Important before public launch

The registration form is currently a front-end demo. It does NOT securely store submissions yet.

Before Phase 1 production deployment, connect it to a real backend/form service with server-side validation, spam protection/rate limiting, private storage, HTTPS and appropriate access controls.

The current site intentionally has no admin/authentication system; those belong to Phase 2.


## Current image files
This build uses the JPG files currently supplied in `images/`: hero-01.jpg through hero-04.jpg, praxis-logo.jpg, and team-01.jpg through team-03.jpg. `what-we-do.jpg` is a temporary copy and can be replaced later.
