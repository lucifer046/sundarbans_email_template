# AGENTS.md — Sundarbans House Email Creation & Design Standards

This document specifies the single source of truth for generating, styling, and maintaining HTML email templates for **Sundarbans House** (IIT Madras BS Degree). Any AI assistant or developer working in this workspace MUST adhere to these instructions without exception.

> [!IMPORTANT]
> **Sundarbans House Direct Focus**: This workspace and design system are created **exclusively for Sundarbans House**. All emails, templates, headers, footers, logos, and signatures MUST default strictly to **Sundarbans House** branding. Do NOT generate templates for other houses or multi-house collectives unless explicitly instructed for a specific inter-house event.

> [!NOTE]
> **Single Source of Truth**: This file merges all email design standards, HTML table architecture, responsive media query frameworks, header/footer patterns, content tone rules, and UI/UX Designer intelligence into one master specification, including the seven-pattern design library in section 12. It supersedes any standalone `design-standards.md`.

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
- **Email Subject Lines (Plain-Text Rule)**: Email subject lines and `<title>` tags do NOT parse HTML entities. Always use the literal Unicode middot character (`·`) in subject lines and subject option comments — never use `&middot;` in subjects, as email clients render it as raw code.
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

    /* Theme Lock Overrides for Outlook, Gmail, Apple Mail */
    [data-ogsc] body, [data-ogsc] table, [data-ogsc] td { background-color: inherit; color: inherit; }
    [data-ogsc] .dark-bg-lock { background-color: #1F1612 !important; }
    [data-ogsc] .light-bg-lock { background-color: #FFFFFF !important; }
    [data-ogsc] .outer-bg-lock { background-color: #F5F0EB !important; }

    @media (prefers-color-scheme: dark) {
        body, table, td, p, a, h1, h2, h3, span, img, div, strong, em {
            color-scheme: only light !important;
            forced-color-adjust: none !important;
            -webkit-filter: none !important;
            filter: none !important;
        }
        .outer-bg-lock { background-color: #F5F0EB !important; }
        .light-bg-lock { background-color: #FFFFFF !important; }
        .dark-bg-lock { background-color: #1F1612 !important; }
    }

    /* CTA Button Hover Effect */
    .cta-btn:hover {
        opacity: 0.92 !important;
    }

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
        .hero-tagline { font-size: 15px !important; }
        .hero-p { font-size: 13px !important; max-width: 100% !important; }
        .list-td { padding: 12px 14px !important; }
        .list-txt { font-size: 13px !important; }
        .num-td { width: auto !important; min-width: 28px !important; }
        .seal-text { font-size: 13px !important; }
        .seal-year { font-size: 9px !important; }
        .footer-pad { padding: 28px 20px 24px !important; }
        .mob-content-p { font-size: 14px !important; }
        .mob-inner-pad { padding: 16px !important; }
        .mob-mt { margin-top: 24px !important; }
        .mob-social { padding: 0 5px !important; }
        .mob-social td { width: 34px !important; height: 34px !important; }
        .grid-td { display: block !important; width: 100% !important; padding-right: 0 !important; padding-bottom: 12px !important; }
        .grid-td-last { display: block !important; width: 100% !important; padding-left: 0 !important; padding-bottom: 0 !important; }
        .spacer-td { display: none !important; width: 0 !important; height: 0 !important; padding: 0 !important; margin: 0 !important; overflow: hidden !important; }
        .mob-center { text-align: center !important; }
        .mob-block { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        .social-table { margin: 12px auto 8px !important; float: none !important; }
        .social-table td { padding: 0 8px !important; }
        .mob-poster-pad { padding: 18px 20px 0 !important; }
        .poster-img { width: 100% !important; max-width: 100% !important; height: auto !important; display: block !important; margin: 0 auto !important; }
        .highlight-card-td { padding: 18px 16px 14px !important; }
        .cta-card-td { padding: 22px 16px !important; }
        .btn-table { width: 100% !important; max-width: 100% !important; }
        .btn-td { width: 100% !important; }
        .cta-btn {
            display: block !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 16px 14px !important;
            font-size: 13.5px !important;
            letter-spacing: 0.5px !important;
            line-height: 1.3 !important;
            text-align: center !important;
        }
        .fallback-link-div { word-break: break-all !important; }
    }
</style>
```

---

## 6. Header Layout Patterns

> [!TIP]
> Patterns A and B are the house letterhead and the inter-house header. For event launches, formal notices, ticket invites, newsletters and reminders, see **section 12 · Email Design Library** (Patterns C to G).

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

### Master Layout Architecture (`rc-onboarding.html` Standard)

Every email template MUST adhere to the following outer-to-inner table hierarchy:
1. **Outer Fluid Background Wrapper**: Full-width `100%` table with theme-lock classes (`.outer-bg-lock`, `data-ogsb="#..."`).
2. **Microsoft Outlook Ghost Table (`<!--[if mso | IE]>`)**: Restricts desktop Outlook to exact `580px` width without flexbox bugs.
3. **Main Content Container**: Responsive `width="100%"` with `style="width:100%;max-width:580px;margin:0 auto;..."` and `.light-bg-lock`.
4. **Mobile Collapse via Media Queries**: When viewport is `<= 560px`, container expands to `100%` width with `border-radius: 0 !important`.

```html
<body bgcolor="#F5F0EB" class="outer-bg-lock" style="margin:0;padding:0;background-color:#F5F0EB;" data-ogsc="" data-ogsc-font="" data-ogsb="#F5F0EB">

<!-- Preheader Text (Invisible snippet for inbox previews) -->
<div style="display:none;font-size:1px;color:#F5F0EB;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Sundarbans House &middot; Brief overview of email content...
</div>

<!-- ══ OUTER BACKGROUND WRAPPER (Fluid 100%) ══ -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#F5F0EB" class="outer-bg-lock" style="background-color:#F5F0EB;" data-ogsc="" data-ogsc-font="" data-ogsb="#F5F0EB">
<tr><td align="center" bgcolor="#F5F0EB" class="outer-bg-lock" style="padding:28px 12px;" data-ogsc="" data-ogsc-font="" data-ogsb="#F5F0EB">

    <!--[if mso | IE]>
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="580" style="width:580px;">
    <tr>
    <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF" class="container light-bg-lock" align="center"
           style="width:100%;max-width:580px;margin:0 auto;background-color:#FFFFFF;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.04);border:1px solid #E2E8F0;" data-ogsc="" data-ogsc-font="" data-ogsb="#FFFFFF">

        <!-- Header / Letterhead Row -->
        ...

        <!-- Main Body Row -->
        <tr>
            <td class="mob-pad" style="padding:36px 36px 28px;background:#FFFFFF;">
                <!-- Content Rows -->
            </td>
        </tr>

        <!-- Footer Row -->
        ...

    </table>
    <!--[if mso | IE]>
    </td>
    </tr>
    </table>
    <![endif]-->

</td></tr>
</table>

</body>
```

### Two-Column Responsive Bento / Grid Pattern

For 2-column cards, bento grids, and highlights, NEVER use `50%/50%` padding hacks. Use the `48%` / `4% spacer` / `48%` table pattern with `.grid-td`, `.spacer-td`, and `.grid-td-last`:

```html
<table data-ogsc="" data-ogsc-font="" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;border-collapse:separate !important;border-spacing:0;">
    <tr data-ogsc="" data-ogsc-font="">
        <!-- Column 1 -->
        <td data-ogsc="" data-ogsc-font="" width="48%" class="grid-td" valign="top" bgcolor="#F8FAFC" style="width:48%;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 18px;box-sizing:border-box;">
            <strong style="font-family:'Inter',sans-serif !important;font-size:11px;font-weight:700;color:#5C3A21;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Title A</strong>
            <p style="font-family:'Inter',sans-serif !important;font-size:12px;color:#475569;line-height:1.6;margin:0;">Description A...</p>
        </td>
        <!-- Spacer (Disappears on mobile) -->
        <td data-ogsc="" data-ogsc-font="" width="4%" class="spacer-td" style="width:4%;padding:0;font-size:1px;line-height:1px;">&nbsp;</td>
        <!-- Column 2 -->
        <td data-ogsc="" data-ogsc-font="" width="48%" class="grid-td-last" valign="top" bgcolor="#F8FAFC" style="width:48%;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 18px;box-sizing:border-box;">
            <strong style="font-family:'Inter',sans-serif !important;font-size:11px;font-weight:700;color:#5C3A21;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:6px;">Title B</strong>
            <p style="font-family:'Inter',sans-serif !important;font-size:12px;color:#475569;line-height:1.6;margin:0;">Description B...</p>
        </td>
    </tr>
</table>
```

*Mobile Behavior:* On `< 560px`, `.grid-td` and `.grid-td-last` convert to `display:block !important; width:100% !important;` while `.spacer-td` collapses to `display:none !important`.

### Bulletproof Mobile CTA Button Pattern

Ensure minimum 44px touch height, high contrast, and automatic full-width conversion on mobile:

```html
<table data-ogsc="" data-ogsc-font="" border="0" cellpadding="0" cellspacing="0" align="center" class="btn-table" style="margin:0 auto 16px;">
    <tr data-ogsc="" data-ogsc-font="">
        <td data-ogsc="" data-ogsc-font="" align="center" bgcolor="#C87D3A" class="btn-td" style="border-radius:8px;background-color:#C87D3A;box-shadow:0 6px 20px rgba(200,125,58,0.25);">
            <a data-ogsc="" data-ogsc-font="" href="https://..." target="_blank" class="cta-btn"
               style="display:inline-block;padding:14px 32px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif !important;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;border-radius:8px;line-height:1;">
                Primary Action &nbsp;&rarr;
            </a>
        </td>
    </tr>
</table>
```

*Mobile Behavior:* `.btn-table` and `.btn-td` expand to `width: 100% !important;` and `.cta-btn` becomes a centered, block-level tap target (`display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 16px 14px !important;`).

### CSS Resets (Include in `<head><style>`)

```css
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
```

---

## 10. Common Pitfalls & Mandatory Fixes

1. **Flexbox Layout Breakage**:
   - *Fix:* Replace all `display:flex` layout rows with HTML `<table>` cells using the `48%` / `4% spacer` / `48%` pattern. On mobile, stack via `.grid-td, .grid-td-last { display:block !important; width:100% !important; }` and `.spacer-td { display:none !important; }`.
2. **Logo Shifting to Top-Left in Outlook**:
   - *Fix:* Use a nested `<table>` with `align="center"` on the table tag, `align="center" valign="middle"` on the inner `<td>`, and `margin:0 auto` on the `<img>` tag.
3. **Emoji Icons Misrendering**:
   - *Fix:* Replace OS emojis with crisp Icons8 PNG images (`16x16px` or `20x20px`) or subtle geometric bullet points.
4. **Dark Mode Inversion Inconsistencies**:
   - *Fix:* Explicitly declare inline `background-color` and `color` on every container/cell, set `<meta name="color-scheme" content="only light">` and `<meta name="supported-color-schemes" content="light only">`, and add `class="darkreader-ignore outer-bg-lock light-bg-lock"` and `data-ogsc="" data-ogsc-font="" data-ogsb="#..."` across tags.
5. **Small Touch Targets on Mobile**:
   - *Fix:* Enforce minimum button dimensions with the `.btn-table`, `.btn-td`, and `.cta-btn` pattern (`padding:14px 28px !important; display:block !important; width:100% !important;` on mobile).

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
├── design-library/             # Reference layouts for Patterns C to G (copy, never edit in place)
│   ├── midnight-editorial.html
│   ├── paper-notice.html
│   ├── admit-pass.html
│   ├── house-digest.html
│   └── live-alert.html
├── email-studio/               # Preview website assets (CSS, JS, template index)
├── index.html                  # Email Studio entry page
└── scratch/                    # Temporary helper scripts & scratch data
```

- **Naming Conventions**: Use lowercase, hyphenated filenames (`rc-onboarding.html`, `technical-team-results.html`). Never use spaces or underscores in new filenames.

---

## 12. Email Design Library (Patterns C to G)

Patterns A and B cover the house letterhead and inter-house mail. They are not the right fit for everything. The design library adds five more layouts, each built for a specific kind of message. Every one of them still follows sections 1 to 10: table-only layout, the 580px Outlook ghost table, the section 5 media queries, the transparent Sundarbans logo, the standard signature (recoloured to the palette), Icons8 icons, no emojis, no em dashes.

**Full reference files live in `design-library/`.** Always copy the matching file as your starting point and replace the content. Do not rebuild a pattern from memory. All of them can be previewed in the Email Studio (`index.html`, "Design library" section).

### 12.1 Which pattern to use

| Message type | Use | Theme | Reference file |
|---|---|---|---|
| Standard house mail, onboarding, POR appointments | **A** House Letterhead | Light or dark | `team-onboarding/rc-onboarding.html` |
| Joint event with all eight houses | **B** Inter-House Header | Forest dark | `events/chai-baarish-season2.html` |
| Cultural night, launch, big event with a poster | **C** Midnight Editorial | Dark | `design-library/midnight-editorial.html` |
| Results, formal notice, appointment letter, policy | **D** Paper Notice | Light | `design-library/paper-notice.html` |
| Invitation with RSVP, meetup pass, confirmed seat | **E** Admit Pass | Warm light | `design-library/admit-pass.html` |
| Monthly newsletter, roundup with 3+ items | **F** House Digest | Light + forest | `design-library/house-digest.html` |
| Reminder, "starting in 15 minutes", "live now" | **G** Live Alert | Dark ember | `design-library/live-alert.html` |

If nothing fits, use Pattern A. Never mix two patterns in one email.

### 12.2 Pattern C · Midnight Editorial (Dark)

A magazine-style dark layout. One big serif title carries the email. Use it when the event has a mood and you want people to feel it before they read the details.

| Token | Value | Notes |
|---|---|---|
| `--email-bg` | `#0E0D0B` | Outer wrapper |
| `--surface` | `#16140F` | Container, `dark-bg-lock` |
| `--surface-overlay` | `#1F1C16` | Poster panel |
| `--text-primary` | `#F2EDE4` | Titles; body copy uses `#D9D1C3` |
| `--text-muted` | `#A39B8C` | Labels, captions (6.3:1 on surface) |
| `--accent` | `#E9B15F` | Kicker, numerals, CTA |
| `--accent-strong` | `#F3AE45` | Hover |
| `--accent-contrast` | `#1A1206` | CTA text |
| `--border-subtle` | `#2E2A22` | Rules, strip dividers |

- **Fonts:** dark theme stack. `DM Serif Display` for title, dek, numerals and the signature name. `Inter` for everything else.
- **Structure:** masthead (40px logo, house name, pill tag on the right) &rarr; centred hero (kicker, 52px title, italic dek) &rarr; poster panel &rarr; three-column meta strip (Date / Time / Where) &rarr; body copy &rarr; numbered running order with serif `01 02 03` &rarr; pill CTA &rarr; dark footer.
- **Poster panel:** a gradient cell with a pull quote. When you have a poster, replace the cell contents with `<img class="poster-img" width="508">`.
- **Meta strip on mobile:** the cells use `.mob-block .meta-cell` and `.meta-cell-last` so they stack and drop the vertical dividers. Add these two classes to the section 5 media query:

```css
.meta-cell { border-left: 0 !important; padding: 12px 0 !important; border-bottom: 1px solid #2E2A22 !important; }
.meta-cell-last { border-left: 0 !important; padding: 12px 0 !important; }
```

```html
<!-- Pattern C hero -->
<p style="margin:0 0 14px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif !important;font-size:10px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:#E9B15F;">The Cultural Community presents</p>
<h1 class="hero-h1" style="margin:0;font-family:'DM Serif Display',Georgia,serif !important;font-weight:400;font-size:52px;line-height:1.02;color:#F2EDE4;">Mehfil<span style="color:#E9B15F;font-style:italic;">.</span></h1>
<p style="margin:12px 0 0;font-family:'DM Serif Display',Georgia,serif !important;font-style:italic;font-size:19px;line-height:1.4;color:#CFC6B6;">An evening of ghazals, nazms and the stories behind them</p>
```

### 12.3 Pattern D · Paper Notice (Light)

A formal letter on warm paper. No decoration beyond ink rules. Use it when the content matters more than the look: results, appointments, rule changes, official replies.

| Token | Value | Notes |
|---|---|---|
| `--email-bg` | `#EFE9DF` | Outer wrapper |
| `--surface` | `#FBF8F2` | Paper, `light-bg-lock`, 4px ink top border |
| `--surface-overlay` | `#F3EEE4` | Zebra rows, note box, footer |
| `--text-primary` | `#1F1B16` | Headings; body copy uses `#3A332B` |
| `--text-muted` | `#6B6257` | Ref line, dates (5.6:1) |
| `--accent` | `#7A4E1D` | Ink brown: kicker, numbering, left rule |
| `--accent-strong` | `#5E3B14` | Hover |
| `--accent-contrast` | `#FFFFFF` | Text on accent |
| `--border-subtle` | `#E3DACB` | Table and footer borders |

- **Fonts:** light theme stack. `Playfair Display` for the house name, title and list numbers.
- **Structure:** centred letterhead (48px round logo, spaced house name, "Office of the Secretary", double ink rule) &rarr; ref number + date row &rarr; subject block with a 3px left rule &rarr; letter body &rarr; results table (ink header row, zebra body) &rarr; "What happens next" numbered list &rarr; dashed note box &rarr; "Issued by" stamp &rarr; footer.
- **Ref numbers:** `SH/<term>/<team>/<serial>`, for example `SH/2026-27/RC/014`.
- **Tables:** keep to two or three columns so they survive 375px screens. Long text goes in a list instead.

```html
<!-- Pattern D subject block -->
<td style="border-left:3px solid #7A4E1D;padding:2px 0 2px 16px;">
    <p style="margin:0 0 6px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif !important;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7A4E1D;">Notice</p>
    <h1 class="hero-h1" style="margin:0;font-family:'Playfair Display',Georgia,serif !important;font-size:30px;font-weight:700;line-height:1.2;color:#1F1B16;">Regional Coordinators for 2026&ndash;27</h1>
</td>
```

### 12.4 Pattern E · Admit Pass (Warm Light)

The email is a ticket: a top half with the event, a perforated tear line, and a stub with the details and a door code. Use it for in-person meetups and anything the reader needs to confirm or show up for.

| Token | Value | Notes |
|---|---|---|
| `--email-bg` | `#EADFCF` | Outer wrapper and the perforation notches |
| `--surface` | `#FFFDF9` | Ticket halves, `light-bg-lock` |
| `--surface-overlay` | `#F4EDE2` | Guest chip, code strip |
| `--text-primary` | `#2A211B` | Headings and values |
| `--text-muted` | `#6E6157` | Labels (5.4:1); body copy uses `#5A4D43` |
| `--accent` | `#B5562B` | Terracotta band and CTA (4.9:1 with white) |
| `--accent-strong` | `#9A4421` | Small accent text and links |
| `--accent-contrast` | `#FFFFFF` | Text on band and CTA |
| `--border-subtle` | `#E6D9C6` | Ticket outline; tear line `#D9C7AE` |

- **Fonts:** light theme stack. `Courier New` (monospace) only for the ticket number and the door code.
- **Structure:** small brand line above the ticket &rarr; ticket top (accent band "Admit one" + ticket number, kicker, two-line title with italic city, guest chip) &rarr; perforation row &rarr; stub (Date / Gates / Ends grid, venue row with marker icon, code strip, CTA + "Can't make it?" link) &rarr; note under the ticket &rarr; footer card.
- **The container has no single surface.** The outer `.container` table uses the outer colour and the two ticket halves are separate rows, so the notches show the page colour through.
- **Perforation row:** three cells. The side cells hold a 14x28 `div` in the outer colour with a half-round radius; the middle cell holds a `2px dashed` top border.

```html
<!-- Pattern E perforation row -->
<tr><td style="font-size:0;line-height:0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate !important;">
        <tr>
            <td width="14" bgcolor="#FFFDF9" style="width:14px;height:28px;background-color:#FFFDF9;border-left:1px solid #E6D9C6;"><div style="width:14px;height:28px;background-color:#EADFCF;border-radius:0 14px 14px 0;">&nbsp;</div></td>
            <td bgcolor="#FFFDF9" valign="middle" style="background-color:#FFFDF9;height:28px;padding:0 6px;"><div style="border-top:2px dashed #D9C7AE;height:0;line-height:0;font-size:0;">&nbsp;</div></td>
            <td width="14" bgcolor="#FFFDF9" style="width:14px;height:28px;background-color:#FFFDF9;border-right:1px solid #E6D9C6;"><div style="width:14px;height:28px;background-color:#EADFCF;border-radius:14px 0 0 14px;">&nbsp;</div></td>
        </tr>
    </table>
</td></tr>
```

### 12.5 Pattern F · House Digest (Light Newsletter)

A newsletter with a forest-green masthead, a contents box, numbered sections and an agenda. Use it when one email carries several unrelated updates.

| Token | Value | Notes |
|---|---|---|
| `--email-bg` | `#E9EEE8` | Outer wrapper |
| `--surface` | `#FFFFFF` | Container, `light-bg-lock` |
| `--surface-overlay` | `#F3F5F1` | Contents box, bento cards, footer |
| `--text-primary` | `#1C2620` | Headings; body copy uses `#33403A` |
| `--text-muted` | `#5B6B61` | Agenda meta (5.6:1) |
| `--accent` | `#1F5A3D` | Masthead, date blocks, CTA, links |
| `--accent-strong` | `#9A6614` | Section kickers and contents numbers (small text) |
| `--accent-contrast` | `#FFFFFF` | Text on forest |
| `--border-subtle` | `#DDE5DE` | Cards and dividers |

Decorative gold `#C98A2B` is only for link underlines and the shoutout rule. It fails 4.5:1 as text on white, so small gold text uses `#9A6614`.

- **Fonts:** light theme stack. `Playfair Display` 800 for the nameplate.
- **Structure:** forest masthead (logo, nameplate, issue row split by thin dividers) &rarr; short editor's note &rarr; "In this issue" box &rarr; section 01 lead story with underlined text link &rarr; section 02 two-column bento (section 9 `48% / 4% / 48%`) &rarr; section 03 agenda with calendar date blocks &rarr; shoutout strip &rarr; CTA &rarr; footer.
- **Sections:** label them `01 &middot; Results`, `02 &middot; Around the house`. Three to five sections at most. More than that belongs on the website.

```html
<!-- Pattern F agenda row: calendar block + text -->
<tr>
    <td width="56" valign="top" style="width:56px;padding:0 0 14px;">
        <table border="0" cellpadding="0" cellspacing="0" width="48" style="width:48px;border-collapse:separate !important;">
            <tr><td align="center" bgcolor="#1F5A3D" style="background-color:#1F5A3D;border-radius:8px 8px 0 0;padding:3px 0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif !important;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#FFFFFF;">Nov</td></tr>
            <tr><td align="center" style="border:1px solid #DDE5DE;border-top:0;border-radius:0 0 8px 8px;padding:5px 0;font-family:'Playfair Display',Georgia,serif !important;font-size:20px;font-weight:700;color:#1C2620;line-height:1;">08</td></tr>
        </table>
    </td>
    <td valign="top" style="padding:2px 0 14px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif !important;font-size:14px;line-height:1.5;color:#1C2620;"><strong>Mehfil</strong><br><span style="font-size:12.5px;color:#5B6B61;">8:00 PM &middot; Google Meet</span></td>
</tr>
```

### 12.6 Pattern G · Live Alert (Dark Ember)

Short, loud and single-purpose. The start time is the biggest thing on screen and there is exactly one button. Use it for reminders sent shortly before something starts.

| Token | Value | Notes |
|---|---|---|
| `--email-bg` | `#0D0607` | Outer wrapper |
| `--surface` | `#170B0C` | Container, `dark-bg-lock` |
| `--surface-overlay` | `#22110F` | Fact tiles; live pill `#2A1210` |
| `--text-primary` | `#FFF4EE` | Title and values; body copy uses `#D7BDB3` |
| `--text-muted` | `#C2A79E` | Tile labels (8:1) |
| `--accent` | `#FF6A3D` | Start time, CTA, bullets |
| `--accent-strong` | `#FF8A63` | Small accent text, links |
| `--accent-contrast` | `#1A0A05` | CTA text |
| `--border-subtle` | `#3A1E1A` | Tiles, top bar, footer |

- **Fonts:** dark theme stack. `DM Serif Display` for the time and title.
- **Structure:** top bar (logo + house name, "In 15 min" pill with a dot on the right) &rarr; 64px start time with smaller "PM IST" &rarr; title + one line &rarr; three fact tiles (Runs for / Mentor / Platform) &rarr; full-width CTA &rarr; plain fallback link &rarr; "Before you join" bullets &rarr; footer.
- **Keep it under 120 words.** If you need more, send a Pattern A or C email earlier and use G only as the reminder.
- **Pill text:** match the timing: `In 15 min`, `Starts at 7`, `Live now`.

```html
<!-- Pattern G start time + title -->
<p style="margin:0;font-family:'DM Serif Display',Georgia,serif !important;font-size:64px;line-height:1;color:#FF6A3D;letter-spacing:-1px;">7:00<span style="font-size:24px;color:#FF8A63;letter-spacing:0;"> PM IST</span></p>
<h1 class="hero-h1" style="margin:16px 0 0;font-family:'DM Serif Display',Georgia,serif !important;font-weight:400;font-size:34px;line-height:1.1;color:#FFF4EE;">Statistics II &middot; Quiz 2 revision</h1>
```

### 12.7 Recolouring the standard footer

Every pattern ends with the section 7 signature. Only the colours change:

| Pattern | Footer background | Name | Muted text | Accent text | Icons8 colour |
|---|---|---|---|---|---|
| C | `#121009` | `#F2EDE4` | `#A39B8C` | `#E9B15F` | `E9B15F` |
| D | `#F3EEE4` | `#1F1B16` | `#6B6257` | `#7A4E1D` | `7A4E1D` |
| E | `#FFFDF9` (separate card) | `#2A211B` | `#6E6157` | `#9A4421` | `B5562B` |
| F | `#F3F5F1` | `#1C2620` | `#5B6B61` | `#1F5A3D` | `1F5A3D` |
| G | `#120809` | `#FFF4EE` | `#C2A79E` | `#FF8A63` | `FF6A3D` |

Swap the colour inside the Icons8 URL, for example `https://img.icons8.com/ios-filled/50/1F5A3D/instagram-new.png`.

### 12.8 Theme locks per pattern

Set the three lock colours in the section 5 stylesheet to match the pattern, both in the `[data-ogsc]` block and inside `@media (prefers-color-scheme: dark)`:

| Pattern | `.outer-bg-lock` | `.light-bg-lock` | `.dark-bg-lock` |
|---|---|---|---|
| C | `#0E0D0B` | `#16140F` | `#16140F` |
| D | `#EFE9DF` | `#FBF8F2` | `#1F1B16` |
| E | `#EADFCF` | `#FFFDF9` | `#2A211B` |
| F | `#E9EEE8` | `#FFFFFF` | `#1F5A3D` |
| G | `#0D0607` | `#170B0C` | `#170B0C` |

### 12.9 Checklist before sending a library email

1. Copied from the right `design-library/` file, not rebuilt.
2. Subject options in the top comment use the literal `·`, not `&middot;`.
3. Preheader rewritten for this email.
4. Every sample name, date, link and code replaced.
5. Contrast still 4.5:1 if any colour changed.
6. Checked at 375px in the Email Studio (Mobile view).
7. Saved in the right category folder with a lowercase hyphenated name, then `python email-studio/generate_data.py` run so the studio picks it up.
