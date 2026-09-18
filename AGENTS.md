# AGENTS.md — Sundarbans House Email Creation & Design Standards

This document specifies the single source of truth for generating, styling, and maintaining HTML email templates for **Sundarbans House** (IIT Madras BS Degree). Any AI assistant or developer working in this workspace MUST adhere to these instructions without exception.

> [!IMPORTANT]
> **Sundarbans House Direct Focus**: This workspace and design system are created **exclusively for Sundarbans House**. All emails, templates, headers, footers, logos, and signatures MUST default strictly to **Sundarbans House** branding. Do NOT generate templates for other houses or multi-house collectives unless explicitly instructed for a specific inter-house event.

> [!NOTE]
> **Single Source of Truth**: This file merges all email design standards, HTML table architecture, responsive media query frameworks, header/footer patterns, content tone rules, and UI/UX Designer intelligence into one master specification. It supersedes any standalone `design-standards.md`.

---

## 1. Core Naming & Branding Directives

- **Primary House Entity**: Always use **Sundarbans House** (never "Sundarban" or "Sundarbans" without House when referring to the house entity).
- **Degree/Institution Name**: Always use **IIT Madras BS Degree** or **IITM BS Degree** (NEVER use "BS Degree Program" or "IITM BS Degree Program").
- **Motto**: "Learn &middot; Grow &middot; Lead"
- **Secretary**: Divya Prakash (Secretary &middot; Sundarbans House)

### Content Tone & Language Rules (Strict)

- **Write in a natural, human tone** — never use ChatGPT-style generic enthusiasm ("Get ready to...", "Join us for an unforgettable...", "We're thrilled to announce..."). Write as a real person speaking in a campus email.
- **Avoid AI-sounding phrases** — no "dive into", "embark on", "unlock your potential", "seamless experience", "game-changer", "revolutionize". Use direct, clear language.
- **No em dashes (`—` or `&mdash;`) for content separation** — use **middots (`&middot;`)** or **bullet points** instead. Em dashes read as robotic and visually heavy in email layouts.
- **Short sentences** — read every line aloud before finalizing.

---

## 2. UI/UX Designer Skill Integration & Guidelines

All email template design work must integrate design intelligence from `uiux-designer/SKILL.md`. When designing or auditing emails, apply these priority-ranked UI/UX principles tailored for HTML email clients:

### Priority-Ranked Email UI/UX Principles

1. **Accessibility (CRITICAL)**:
   - **Contrast Ratio**: Minimum **4.5:1** contrast ratio for all body text against its background. Verify CTA button text, badge text, and footer muted text contrast before finalizing.
   - **Alt Text**: Every `<img>` must contain meaningful `alt` text (e.g. `alt="Sundarbans House Logo"`, `alt="Event Poster"`).
   - **Explicit Text Colors**: Never rely on default browser text colors or inheritance across nested tables.

2. **Touch & Interaction (CRITICAL)**:
   - **Touch Target Size**: Minimum **44x44px** touch area for all interactive elements and CTA buttons (`padding:14px 28px !important; display:block !important;`).
   - **Clickable Styling**: CTA buttons must feature clear visual hierarchy, bold font, and high contrast against container backgrounds.

3. **Icons & Visual Elements (STRICT RULE)**:
   - **NO EMOJI ICONS**: NEVER use OS emojis (🎨, 🚀, 📅, 📍, ⏰) as UI icons in email body, buttons, agenda rows, or feature cards. Emojis render inconsistently across operating systems and email clients.
   - **Use Crisp Vector/Image Icons**: Use high-quality PNG icon assets (e.g. Icons8 filled/line icons in accent colors, `16x16px` or `20x20px`) or bullet points.

4. **Performance & Email Client Protection**:
   - **Dark Mode Safeguards**: Add `data-ogsc=""` and `class="darkreader-ignore"` to all `<img>` tags to prevent Gmail/Outlook/DarkReader auto-inverting image colors.
   - **Dimension Attributes**: Always specify explicit `width` and `height` HTML attributes on `<img>` tags to prevent cumulative layout shift (CLS) during email rendering.

### Using the UI/UX Search Engine for Emails

Before selecting a color palette, font pairing, or layout structure, run the UI/UX search script to retrieve curated design patterns:

```bash
python3 skills/uiux-designer/scripts/search.py "<email_theme_or_event_type> <keywords>" --domain color
```
or run a full design system generation:
```bash
python3 skills/uiux-designer/scripts/search.py "<email_type> <mood>" --design-system -p "Sundarbans Email"
```

---

## 3. Color Palette & Dynamic Theme Engine

No template is locked to a single rigid color. Select a palette matching the email's tone, purpose, and theme while preserving Sundarbans House identity.

### Semantic Token Architecture

Every email MUST map its design to these 9 semantic color roles:

| Semantic Token | Purpose in Email Architecture |
|---|---|
| `--email-bg` | Outer email body wrapper background |
| `--surface` | Main container background (e.g. `#121212` for dark, `#FFFFFF` for light) |
| `--surface-overlay` | Bento cards, inner highlight boxes, badge backgrounds |
| `--text-primary` | Main titles, headings, and body paragraph text |
| `--text-muted` | Date lines, captions, subtitles, secondary metadata |
| `--accent` | Key highlights, border lines, icons, and CTA background |
| `--accent-strong` | Hover/active CTA state, primary brand accents |
| `--accent-contrast` | Text placed directly on `--accent` background (e.g. CTA text) |
| `--border-subtle` | Dividers, card borders, signature top border |

*Rule:* Map all template components to these semantic roles. Do not mix uncoordinated colors across cards, badges, CTAs, and footers.

---

## 4. Logo Assets & Table Centering Rules

- **Transparent Sundarbans Logo Asset URL**: `https://lh3.googleusercontent.com/d/1PmhEx2nZ1Xmrea9if3gOvraX63ti2RWi`
- **Strict Rule**: Always use this transparent-background logo asset. Do not replace it with an opaque/colored backdrop box unless explicitly requested.
- **Centering Rule for Outlook/Gmail**:
  - NEVER use `display:flex; align-items:center; justify-content:center` on logo wrappers or headers. Flexbox is NOT supported by Microsoft Outlook or older Gmail rendering engines.
  - ALWAYS use a nested `<table>` with `align="center"` on the logo table, `align="center" valign="middle"` on the inner `<td>`, and `margin:0 auto` on the `<img>` tag.

```html
<table border="0" cellpadding="0" cellspacing="0" align="center" style="width:44px;height:44px;margin:0 auto;">
    <tr>
        <td style="width:44px;height:44px;background:#000000;border-radius:10px;text-align:center;vertical-align:middle;" align="center" valign="middle">
            <img src="https://lh3.googleusercontent.com/d/1PmhEx2nZ1Xmrea9if3gOvraX63ti2RWi"
                 alt="Sundarbans" width="44" height="44" data-ogsc="" class="darkreader-ignore"
                 style="display:block;width:44px;height:44px;margin:0 auto;">
        </td>
    </tr>
</table>
```

---

## 5. Responsive Media Query Framework (`@media screen and (max-width: 560px)`)

Every generated HTML email MUST contain the following responsive CSS stylesheet in `<head><style type="text/css">` to guarantee mobile layout support across iOS Mail, Gmail, Outlook Mobile, and Android clients:

```html
<style type="text/css">
    :root { color-scheme: only light !important; }

    body, table, td, p, a, h1, h2, h3, span, img, div, strong, em, u, s, li, br, blockquote, small, sub, sup { 
        color-scheme: only light !important; 
        forced-color-adjust: none !important; 
        print-color-adjust: exact !important; 
        -webkit-filter: none !important; 
        filter: none !important; 
    }

    .darkreader-ignore, img { 
        filter: none !important; 
        image-rendering: auto !important; 
        forced-color-adjust: none !important; 
        -webkit-filter: none !important; 
    }

    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

    /* Theme Lock Overrides */
    [data-ogsc] body, [data-ogsc] table, [data-ogsc] td { background-color: inherit; color: inherit; }

    @media screen and (max-width: 560px) {
        .container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
        .mob-pad { padding-left: 20px !important; padding-right: 20px !important; }
        .mob-pad-top { padding: 24px 20px 16px !important; }
        .letterhead-td { display: block !important; width: 100% !important; text-align: center !important; }
        .letterhead-name { padding-left: 0 !important; padding-top: 10px !important; }
        .letterhead-name div { font-size: 13px !important; letter-spacing: 1.5px !important; }
        .letterhead-name div + div { font-size: 8px !important; letter-spacing: 1px !important; }
        .letterhead-date { display: block !important; width: 100% !important; text-align: center !important; padding-top: 8px !important; padding-bottom: 0 !important; }
        .hero-h1 { font-size: 26px !important; }
        .hero-h1 span { font-size: 26px !important; }
        .hero-p { font-size: 13px !important; max-width: 100% !important; }
        .list-td { padding: 12px 14px !important; }
        .list-txt { font-size: 13px !important; }
        .footer-pad { padding: 28px 20px 24px !important; }
        .mob-content-p { font-size: 14px !important; }
        .mob-inner-pad { padding: 16px !important; }
        .mob-mt { margin-top: 24px !important; }
        .grid-td { display: block !important; width: 100% !important; padding-right: 0 !important; padding-bottom: 12px !important; }
        .grid-td-last { display: block !important; width: 100% !important; padding-left: 0 !important; padding-bottom: 0 !important; }
        .spacer-td { display: none !important; width: 0 !important; height: 0 !important; padding: 0 !important; margin: 0 !important; overflow: hidden !important; }
        .mob-center { text-align: center !important; }
        .mob-block { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        .social-table { margin: 12px auto 8px !important; float: none !important; }
        .social-table td { padding: 0 8px !important; }
    }
</style>
```

---

## 6. Header Layout Patterns

### Pattern A: DEFAULT — Official Sundarbans House Letterhead Header
**Mandatory Default** for all standard house communications, including onboarding, POR appointments, announcements, recruitment results, invitations, academic sessions, and orientation:

```html
<!-- ══ LETTERHEAD (DEFAULT SUNDARBANS HEADER) ══ -->
<tr>
    <td style="border-bottom:3px solid #F3AE45;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr><td class="mob-pad-top" style="padding:32px 36px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <!-- Logo TD -->
                        <td valign="middle" align="center" class="letterhead-td">
                            <table border="0" cellpadding="0" cellspacing="0" align="center" style="width:44px;height:44px;margin:0 auto;">
                                <tr>
                                    <td style="width:44px;height:44px;background:#000000;border-radius:10px;text-align:center;vertical-align:middle;" align="center" valign="middle">
                                        <img src="https://lh3.googleusercontent.com/d/1PmhEx2nZ1Xmrea9if3gOvraX63ti2RWi"
                                             alt="Sundarbans" width="44" height="44" class="darkreader-ignore"
                                             style="display:block;width:44px;height:44px;margin:0 auto;">
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="padding-left:14px;" valign="middle" class="letterhead-td letterhead-name">
                            <div style="font-family:'Playfair Display',Georgia,serif !important;font-weight:700;font-size:16px;color:#F4F4F5;line-height:1;letter-spacing:2px;text-transform:uppercase;margin:0;">Sundarbans House</div>
                            <div style="font-family:'Inter',-apple-system,sans-serif !important;font-size:9px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#F3AE45;line-height:1;margin-top:4px;">IIT Madras BS Degree</div>
                        </td>
                        <td align="right" valign="middle" class="letterhead-td letterhead-date" style="text-align:right;">
                            <div style="font-family:'Inter',-apple-system,sans-serif !important;font-size:10px;color:#A1A1AA;letter-spacing:0.5px;line-height:1.5;font-weight:500;">Term &middot; 2026&ndash;27</div>
                        </td>
                    </tr>
                </table>
            </td></tr>
        </table>
    </td>
</tr>
```

### Pattern B: SPECIAL EXCEPTION &middot; Inter-House Header
Used **ONLY** when explicitly requested for joint inter-house collaborative events:

```html
<!-- TOP INTER-HOUSE LOGO HEADER BAR (EXPLICIT INTER-HOUSE EVENTS ONLY) -->
<tr>
    <td style="background-color:#17291c;background:linear-gradient(135deg, #132317 0%, #1c3322 50%, #25402d 100%);padding:20px 16px 18px;border-bottom:2px solid #c59b53;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center">
                    <!-- OVERLAPPING HOUSES AVATAR CLUSTER (Thin 1px border) -->
                    <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                        <tr>
                            <td align="center" valign="middle">
                                <div style="display:inline-block;white-space:nowrap;margin:0 auto;text-align:center;">
                                    <div class="house-logo-box-first" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.4);position:relative;z-index:1;">
                                        <img src="https://lh3.googleusercontent.com/d/1gVdQqCr7qzsjFFLsmjYnqt3t37ZOab_t" alt="Corbett" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:2;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1RW5mquiwG2MzLsmkXvGNB2y_8p25WqQ8" alt="Kanha" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:3;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1LeZHv-CemYYo_FP8rte3nvrteiTQEt5s" alt="Kaziranga" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:4;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1P55kI5gupk2MsfE0i1U4-xMNkvLqlpea" alt="Namdapha" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:5;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1xJjafu96c5NRkkz3ZcoqNqU6Ye96njkK" alt="Pichavaram" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:6;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1cAKlFEO-YKDp47sjXZ1G8n2ew-fvhz72" alt="Saranda" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#000000;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:7;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1PmhEx2nZ1Xmrea9if3gOvraX63ti2RWi" alt="Sundarbans" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                    <div class="house-logo-box" style="display:inline-block;vertical-align:middle;width:42px;height:42px;border-radius:50%;border:1px solid #c59b53;background-color:#ffffff;overflow:hidden;box-shadow:-3px 0 8px rgba(0,0,0,0.5);position:relative;z-index:8;margin-left:-12px;">
                                        <img src="https://lh3.googleusercontent.com/d/1vvMsnG_Ze69Xk4X0l1Yp9icLwuk5jKgF" alt="Wayanad" width="42" height="42" style="display:block;width:42px;height:42px;object-fit:cover;border:0;border-radius:50%;" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
</tr>
```

---

## 7. Standard Footer Signature Pattern & Social Links

Every email MUST conclude with this responsive 2-column signature layout defaulting to **Sundarbans House**:

```html
<!-- ══ FOOTER (SUNDARBANS HOUSE DEFAULT SIGNATURE) ══ -->
<tr>
    <td class="footer-pad" style="padding:16px 36px 24px;border-top:1px solid #E2E8F0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td class="mob-block mob-center" width="50%" valign="middle" style="padding-bottom:12px; text-align:left;">
                    <p style="margin:0 0 2px;font-family:'Playfair Display',Georgia,serif !important;font-size:12px;color:#8a7e75;font-style:italic;line-height:1.5;">Warm Regards,</p>
                    <p style="margin:0 0 4px;font-family:'Playfair Display',Georgia,serif !important;font-size:16px;font-weight:700;color:#2c2c2c;line-height:1.3;">Divya Prakash</p>
                    <p style="margin:0 0 2px;font-family:'Inter','Segoe UI',sans-serif !important;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#F3AE45;line-height:1.4;">Secretary &middot; Sundarbans House</p>
                    <p style="margin:0 0 4px;font-family:'Inter','Segoe UI',sans-serif !important;font-size:10px;font-weight:500;color:#8a7e75;line-height:1.4;">IIT Madras BS Degree</p>
                    <p style="margin:0;font-family:'Inter','Segoe UI',sans-serif !important;font-size:9px;font-weight:600;letter-spacing:1px;color:#F3AE45;text-transform:uppercase;">Learn &middot; Grow &middot; Lead</p>
                </td>
                <td class="mob-block mob-center" width="50%" valign="middle" align="right" style="text-align:right;">
                    <table border="0" cellpadding="0" cellspacing="0" class="social-table" style="margin:0 0 8px auto;" align="right">
                        <tr>
                            <td style="padding:0 0 0 10px;">
                                <a href="https://www.instagram.com/sundarbansiitm" target="_blank" style="text-decoration:none;">
                                    <img src="https://img.icons8.com/ios-filled/50/F3AE45/instagram-new.png" alt="Instagram" width="16" height="16" style="display:block;border:0;" />
                                </a>
                            </td>
                            <td style="padding:0 0 0 10px;">
                                <a href="https://www.linkedin.com/company/sundarbans-iitm" target="_blank" style="text-decoration:none;">
                                    <img src="https://img.icons8.com/ios-filled/50/F3AE45/linkedin.png" alt="LinkedIn" width="16" height="16" style="display:block;border:0;" />
                                </a>
                            </td>
                            <td style="padding:0 0 0 10px;">
                                <a href="https://sundarbans.iitmbs.org/#/" target="_blank" style="text-decoration:none;">
                                    <img src="https://img.icons8.com/ios-filled/50/F3AE45/domain.png" alt="Website" width="16" height="16" style="display:block;border:0;" />
                                </a>
                            </td>
                            <td style="padding:0 0 0 10px;">
                                <a href="https://whatsapp.com/channel/0029Vb83wumAzNc2qMQOQX0b" target="_blank" style="text-decoration:none;">
                                    <img src="https://img.icons8.com/ios-filled/50/F3AE45/whatsapp.png" alt="WhatsApp" width="16" height="16" style="display:block;border:0;" />
                                </a>
                            </td>
                        </tr>
                    </table>
                    <div style="clear:both;"></div>
                    <p style="margin:6px 0 0;font-family:'Inter','Segoe UI',sans-serif !important;font-size:10px;font-weight:500;color:#8a7e75;line-height:1.6;">
                        &copy; 2026 Sundarbans House
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>
```

### Official Social Links & Asset Directory

| Platform / Asset | Direct Link / URL |
|---|---|
| **Sundarbans Transparent Logo** | `https://lh3.googleusercontent.com/d/1PmhEx2nZ1Xmrea9if3gOvraX63ti2RWi` |
| **Instagram** | `https://www.instagram.com/sundarbansiitm` |
| **LinkedIn** | `https://www.linkedin.com/company/sundarbans-iitm` |
| **Website** | `https://sundarbans.iitmbs.org/#/` |
| **WhatsApp Channel** | `https://whatsapp.com/channel/0029Vb83wumAzNc2qMQOQX0b` |

---

## 8. Typography & Font Locking Standards (Critical)

### Font Stack Rules

Every `font-family` declaration **must** have `!important` appended. Without it, Gmail, Outlook, and Yahoo override the font with system defaults.

| Use Case | Font Stack | `!important` |
|---|---|---|
| **Headings / Brand (Light Theme)** | `'Playfair Display', Georgia, serif` | ✅ Always |
| **Headings / Brand (Dark Theme)** | `'DM Serif Display', Georgia, serif` | ✅ Always |
| **Body Text** | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | ✅ Always |
| **Signature Text** | `Georgia, 'Times New Roman', serif` | ✅ Always |

### Google Fonts Preconnect & Links

Add these in `<head>` with `display=swap` for robust cross-client loading:

```html
<!-- Light Theme Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```html
<!-- Dark Theme Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 9. Table-Only Layout Architecture & Email Client Resets

### Table-Only Rule (NO Flexbox / NO CSS Grid)

Gmail and Outlook break CSS Flexbox and Grid. Every layout grid, bento box, two-column section, or badge MUST be constructed using nested `<table>` elements with `width` attributes and `align="center"`.

```html
<!-- Main outer container (580px desktop, 100% mobile) -->
<table border="0" cellpadding="0" cellspacing="0" width="580" class="container" align="center"
       style="width:580px;max-width:580px;margin:0 auto;background-color:#121212;border-radius:16px;overflow:hidden;">
    <tr>
        <td class="mob-pad" style="padding:36px;">
            <!-- Content rows -->
        </td>
    </tr>
</table>
```

### CSS Resets (Include in `<head><style>`)

```css
body, table, td, p, a, h1, h2, h3, span, img { color-scheme: light dark; }
.darkreader-ignore, img {
    filter: none !important; image-rendering: auto !important;
    forced-color-adjust: none !important; -webkit-filter: none !important;
}
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
table { border-collapse: collapse !important; }
body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
```

---

## 10. Common Pitfalls & Mandatory Fixes

1. **Flexbox Layout Breakage**:
   - *Fix:* Replace all `display:flex` layout rows with HTML `<table>` cells (`<td width="50%">`). On mobile, stack via `.grid-td { display:block !important; width:100% !important; }`.
2. **Logo Shifting to Top-Left in Outlook**:
   - *Fix:* Use a nested `<table>` with `align="center"` on the table tag, `align="center" valign="middle"` on the inner `<td>`, and `margin:0 auto` on the `<img>` tag.
3. **Emoji Icons Misrendering**:
   - *Fix:* Replace OS emojis with crisp Icons8 PNG images (`16x16px` or `20x20px`) or subtle geometric bullet points.
4. **Dark Mode Inversion Inconsistencies**:
   - *Fix:* Explicitly declare inline `background-color` and `color` on every container/cell, set `<meta name="color-scheme" content="only light">` or `only dark`, and add `class="darkreader-ignore"` and `data-ogsc=""` to image tags.
5. **Small Touch Targets on Mobile**:
   - *Fix:* Enforce minimum button dimensions (`padding:14px 28px !important; display:block !important; border-radius:8px;`).

---

## 11. Folder Structure & Placement Rules

Maintain the workspace folder hierarchy:

```
Email template - Sundarbans/
├── AGENTS.md                   # Master AI Instruction Document & Design Standards
├── assets/                     # Shared images, posters, banners
│   └── Chai_baarish.png
├── events/                     # Major events & inter-house meetups
│   ├── chai-baarish-season2.html
│   └── Unity_tricolour_mail.html
├── team-onboarding/            # Official POR & core team onboarding
│   ├── rc-onboarding.html
│   ├── technical-team-onboarding.html
│   ├── technical-team-results.html
│   └── rc_results_email.html
├── invitations/                # Speaker & guest invitations
├── orientation/                # House orientation templates
├── sessions/                   # Revision & academic sessions
├── certificates/               # Certificate email templates
└── scratch/                    # Temporary helper scripts & scratch data
```

- **Naming Conventions**: Use lowercase, hyphenated filenames (`rc-onboarding.html`, `technical-team-results.html`). Never use spaces or underscores in new filenames.
