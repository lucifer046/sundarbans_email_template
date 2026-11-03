# Sundarbans Email Studio

The preview website for every HTML email sent by **Sundarbans House**, IIT Madras BS Degree. Plain HTML, CSS and JavaScript with no build step.

## What it does

- **Live thumbnails.** Each card renders the real email, scaled down. Hover a card to pan through it.
- **Design library.** Patterns C to G from `AGENTS.md` section 12, shown up front as starting points for new emails.
- **Search and filters.** Search titles, filenames and keywords. Filter by collection and by email theme (dark, light, special). Sort by date, title or size.
- **Preview studio.** Full-screen view with Desktop (720px), Breakpoint (560px) and Mobile (375px phone frame) widths, a highlighted HTML source view, previous/next navigation, copy HTML, download, open raw, and shareable `?preview=<id>` links.
- **Light and dark interface.** Toggle in the top bar. The choice is remembered per browser.

Keyboard: `/` search, `←` `→` previous/next, `1` `2` `3` screen width, `C` copy HTML, `Esc` close.

## Files

```text
index.html                  # Studio page (repository root)
email-studio/
├── css/
│   ├── style.css           # Tokens (dark + light), reset, buttons, segmented controls
│   ├── components.css      # Top bar, hero, library, archive grid, cards, drawer, toasts
│   ├── studio.css          # Full-screen preview, device frames, source view, inspector
│   └── responsive.css      # Laptop, tablet and phone breakpoints
├── js/
│   ├── app.js              # Data loading, rendering, filters, theme, routing
│   ├── preview.js          # Preview studio
│   ├── search.js           # Search, filter and sort engine
│   └── templates-data.js   # Generated copy of the index for file:// use
├── data/templates.json     # Generated template index
├── generate_data.py        # Rebuilds the index
└── index.html              # Redirects to the root studio page
```

## Run it locally

Thumbnails, copy and source view need a local server (browsers block reading files over `file://`):

```bash
python -m http.server 3000
```

Then open <http://localhost:3000/>.

## Adding a template

1. Copy the closest layout from `design-library/` (or an existing email) into the right category folder, with a lowercase hyphenated filename.
2. Follow `AGENTS.md`.
3. Rebuild the index from the repository root:

```bash
python email-studio/generate_data.py
```

The generator reads the title, description, date, header pattern and theme from each file. Light or dark is judged from the background colour of the main `.container` table. Design library files are recognised by their `PATTERN X · NAME (...)` comment.

To show a new pattern in the "Design library" section, add it to `DESIGN_LIBRARY` at the top of `js/app.js`.
