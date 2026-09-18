# Sundarbans House Email Template System

Welcome to the official HTML Email Template & Design System repository for **Sundarbans House** (IIT Madras BS Degree). This workspace provides responsive, email-client compliant HTML email templates for campus announcements, house events, student onboarding, inter-house collaborations, and academic sessions.

---

## Workspace Directory Structure

The repository is organized cleanly by email intent and category:

```text
Email template - Sundarbans/
├── AGENTS.md                   # Single source of truth for design & AI instructions
├── .agents/
│   └── AGENTS.md               # Mirrored master specification for IDE agent auto-loading
├── events/                     # Major house & inter-house event templates
│   ├── chai-baarish-season2.html
│   ├── cyber-quiz-reminder.html
│   └── Unity_tricolour_mail.html
├── team-onboarding/            # POR appointments & team announcements
│   └── tech-team-announcement.html
├── orientation/                # House & freshers orientation emails
├── invitations/                # Guest speaker & event invitation emails
├── poetry-competition/         # Literary & creative competition templates
├── ubuntu-session/             # Linux & technical workshop templates
├── sessions/                   # Academic & skill-building session emails
├── certificates/               # Certificate distribution announcements
├── participation/              # Event participation reminders & callouts
├── ghc-recruitment/            # Web development & core team recruitment
├── general/                    # General house announcements & updates
├── scratch/                    # Temporary scripts, helper tools, and draft code
└── uiux-designer/              # UI/UX design intelligence skill assets & search tools
```

---

## How to Use `AGENTS.md` (AI & Developer Guide)

The [`AGENTS.md`](file:///c:/Users/praka/OneDrive/Documents/Email%20template%20-%20Sundarbans/AGENTS.md) file (located in the workspace root and mirrored at `.agents/AGENTS.md`) is the **Single Source of Truth** for all email template creation, styling rules, and layout standards.

### Instructions for AI Assistants (Antigravity, Claude, ChatGPT, Cursor, Copilot)
- **Automatic Loading**: Any AI assistant operating in this workspace must automatically read and enforce the directives in `AGENTS.md`.
- **Branding Defaults**: Default strictly to **Sundarbans House** branding, colors, logos, and signatures unless explicitly instructed to build an inter-house event email.
- **UI/UX Design Rules**: Follow the priority-ranked design system in `AGENTS.md` (contrast ratios minimum 4.5:1, touch targets minimum 44x44px, no OS emojis rule, table-only centering).
- **No Em Dashes**: Never use em dashes (`—` or `&mdash;`) in text content or code comments. Use middots (`·`) or hyphens (`-`).

### Instructions for Developers & Designers
1. **Review Standards First**: Before creating a new email template, read [`AGENTS.md`](file:///c:/Users/praka/OneDrive/Documents/Email%20template%20-%20Sundarbans/AGENTS.md) to check color tokens, header layouts, and footer signature patterns.
2. **Select the Header Pattern**:
   - **Pattern A (Default)**: Official Sundarbans House Letterhead for standard house emails.
   - **Pattern B (Exception)**: 8 Houses Collective Header for joint inter-house events like *Chai, Baarish aur Baatcheet*.
3. **Logo Centering**: Never use CSS Flexbox on logos or table headers. Use nested `<table>` blocks with `align="center"` and `valign="middle"`.
4. **Google Drive Asset Protection**: Always include `referrerpolicy="no-referrer"`, `data-ogsc=""`, and `class="darkreader-ignore"` on all Google Drive image tags (`lh3.googleusercontent.com/d/...`).

---

## Core Branding Directives

- **Primary House Entity**: Sundarbans House
- **Degree / Institution**: IIT Madras BS Degree (never use "BS Degree Program" or "IITM BS Degree Program")
- **House Motto**: Learn &middot; Grow &middot; Lead
- **House Secretary**: Divya Prakash (Secretary &middot; Sundarbans House)

---

## Writing Tone & Language Guidelines

- **Natural & Human Tone**: Write as a real student leader speaking directly to house members. Avoid artificial enthusiasm or corporate buzzwords ("embark on", "unlock your potential", "seamless experience").
- **No Em Dashes**: Do not use em dashes for content separation. Use middots (`&middot;`) or bullet points.
- **Concise & Direct**: Keep sentences short, clear, and easy to read on mobile screens.

---

## License & Maintenance

Maintained by the **Sundarbans House Executive Team** &middot; IIT Madras BS Degree.
