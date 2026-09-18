# Sundarbans Email Studio

> **Official Digital Archive & Responsive Preview Studio**  
> Curated HTML email templates for **Sundarbans House**, **IIT Madras BS Degree**.  
> Motto: *Learn &middot; Grow &middot; Lead*

---

##  Overview

**Sundarbans Email Studio** is a standalone, zero-dependency, frontend-only digital design gallery and template explorer hosted inside the repository under `/email-studio/`. It provides an editorial browsing experience and responsive multi-device preview environment for all 129+ production HTML email templates used across house events, team onboarding, poetry competitions, academic sessions, and freshers orientations.

### Key Capabilities

- **Dark Botanical Editorial Aesthetic**: Deep gunmetal and forest charcoal backgrounds, warm Sundarbans gold accents (`#F3AE45`), and refined typography (*Playfair Display* & *Inter*).
- **Real-Time Client-Side Search**: Instant tokenized search across titles, descriptions, categories, filenames, and keywords.
- **11 Structured Categories**: Quick filtering across *Events*, *Invitations*, *Poetry Competition*, *Team Onboarding*, *Orientation*, *Sessions*, *Ubuntu Mastery*, *Certificates*, *Participation*, *GHC Recruitment*, and *General Communications*.
- **Interactive Multi-Device Studio**: Live isolated `<iframe>` rendering with device viewports:
  - **Desktop** (720px standard email bounded frame)
  - **Tablet** (560px · tests the `@media screen and (max-width: 560px)` breakpoint from `AGENTS.md`)
  - **Mobile** (375px phone screen)
- **Developer Actions**: Direct 1-click HTML clipboard copying, raw source code inspection modal, file downloads, and opening in separate tabs.
- **Zero External Bundles**: 100% vanilla HTML5, CSS3, and modern ES6 JavaScript. Compatible with offline browsing, `file://` protocol, and static GitHub Pages hosting.

---

##  Directory Structure

```text
email-studio/
├── index.html               # Main single-page application & gallery
├── generate_data.py         # Automated metadata re-indexing script
├── css/
│   ├── style.css            # Design tokens, typography, reset, buttons
│   ├── components.css       # Nav, hero, bento cards, studio modal, toasts
│   └── responsive.css       # Tablet, mobile, touch optimization, reduced-motion
├── js/
│   ├── app.js               # Application orchestration & dynamic stats
│   ├── search.js            # Client-side multi-field search & sort engine
│   ├── preview.js           # Iframe preview controller & device viewports
│   └── templates-data.js    # Pre-indexed metadata fallback for file:// and offline
├── data/
│   └── templates.json       # JSON database of all 129 templates
└── README.md                # Studio documentation
```

---

##  How to Run Locally

### Option A: Direct Browser File (Zero Setup)
Double-click `email-studio/index.html` or open it in any modern browser (`Chrome`, `Firefox`, `Edge`, `Safari`). The studio automatically falls back to `js/templates-data.js` so it works seamlessly without needing a web server.

### Option B: Local Static Server (Recommended)
You can launch a local web server from the repository root:

```bash
# Using Python
python -m http.server 3000

# Using Node (npx)
npx serve .
```

Then visit:
[http://localhost:3000/email-studio/](http://localhost:3000/email-studio/)

---

##  How to Add New Email Templates

1. Create or place your new HTML email file in the appropriate category folder (e.g., `events/my-new-event.html`).
2. Adhere strictly to the [`AGENTS.md`](file:///c:/Users/praka/OneDrive/Documents/Email%20template%20-%20Sundarbans/AGENTS.md) design standards:
   - Use **Pattern A** (Official Letterhead) or **Pattern B** (8 Houses Inter-House Header).
   - Use the transparent Sundarbans logo asset (`https://lh3.googleusercontent.com/d/1PmhEx2nZ1Xmrea9if3gOvraX63ti2RWi`).
   - Minimum 44x44px touch targets on buttons.
   - Contrast ratio minimum 4.5:1.
   - No OS emojis in body copy (use vector icons or bullet points).
   - No em dashes (`·`). Use middots (`·`).
3. Run the metadata generator from the repository root:
   ```bash
   python email-studio/generate_data.py
   ```
4. Done! Both `email-studio/data/templates.json` and `email-studio/js/templates-data.js` will automatically index your new template.

---

##  Deploying to GitHub Pages

Because the website uses relative paths throughout, it can be deployed directly to GitHub Pages:

1. In your GitHub repository (`https://github.com/lucifer046/sundarbans_email_template`), navigate to **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose the `main` branch and `/ (root)` folder, then click **Save**.
4. Once deployed, the studio is accessible at:  
   `https://lucifer046.github.io/sundarbans_email_template/email-studio/`

*(Optional: If you want the studio to be the repository homepage directly at `https://lucifer046.github.io/sundarbans_email_template/`, you can add a redirect `index.html` at the repository root pointing to `email-studio/`).*

---

##  Standards & Compliance

Maintained by **Divya Prakash** (Secretary &middot; Sundarbans House) and the Sundarbans Executive Team.  
Single Source of Truth: [`AGENTS.md`](file:///c:/Users/praka/OneDrive/Documents/Email%20template%20-%20Sundarbans/AGENTS.md).
