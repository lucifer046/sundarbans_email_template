import glob
import os
import re

files = glob.glob(os.path.join("ghc-recruitment", "*.html"))

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Fix Commitment Box and CTA Spacing
    # Replace commitment box and CTA transition with explicit height spacers that email clients respect
    old_commitment_cta = re.compile(
        r'<!-- ══ 6\. COMMITMENT CALLOUT BOX ══ -->.*?'
        r'<!-- ══ 7\. CALL TO ACTION & DEADLINE ══ -->',
        re.DOTALL
    )
    
    # We will build a clean, robust markup for sections 6 and 7
    # First, let's extract the form link if present in the file
    form_link_match = re.search(r'href="(https://forms\.gle/[^"]+|\[Form Link\])"', content)
    form_link = form_link_match.group(1) if form_link_match else "[Form Link]"
    
    # Check region to maintain region-specific values
    if "Delhi" in filepath:
        region_name = "Delhi Region"
        rc_name = "Mohammad Faizan Khan"
    elif "Kolkata" in filepath:
        region_name = "Kolkata Region"
        rc_name = "Abhisekh Chowdhury"
    else:
        region_name = "Chennai Region"
        rc_name = "DHANYA R"

    # Improve subtitle readability
    content = re.sub(
        r'<p class="subtitle font-sans">\s*Applications for the <strong>General House Council \(GHC\), Sundarbans House</strong> are now open! Step into student leadership, connect students across the (\w+ region), and help shape our house community\.\s*</p>',
        r'<p class="subtitle font-sans" style="font-size: 15px; font-weight: 400; color: #2c2c2c; text-align: center; line-height: 1.8; margin-bottom: 35px; padding: 0 10px;">Applications for the <strong style="color: #111111;">General House Council (GHC), Sundarbans House</strong> are now open! Step into student leadership, connect students across the \1, and help shape our house community.</p>',
        content
    )

    # Improve Responsibilities & Benefits text contrast & font sizes
    content = content.replace(
        'color: #111111; line-height: 1.65;',
        'color: #1a1a1a; line-height: 1.75; font-weight: 400;'
    )

    # Make section kickers sharper
    content = content.replace(
        'font-size: 9px;\n            letter-spacing: 4px;',
        'font-size: 10px;\n            letter-spacing: 4px;'
    )

    # Make commitment box and CTA button separation 100% robust with explicit 36px table spacer
    new_commitment_cta_block = f'''<!-- ══ 6. COMMITMENT CALLOUT BOX ══ -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 0px;">
                                    <tr>
                                        <td align="center">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf9f5; border: 1px solid #e5dfcf; border-radius: 4px; max-width: 480px; margin: 0 auto;">
                                                <tr>
                                                    <td style="padding: 22px 28px; text-align: center;">
                                                        <p class="font-sans" style="font-size: 9.5px; letter-spacing: 3px; text-transform: uppercase; color: #8a7e75; margin-bottom: 8px; font-weight: 600;">Time &amp; Dedication</p>
                                                        <p class="font-serif" style="font-size: 18.5px; color: #111111; line-height: 1.6; font-weight: 500; margin: 0;">
                                                            Commitment: <i class="gold" style="font-style: italic; font-weight: 600;">~2–3 hours/day</i> on average, depending on activities.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- ══ SPACER TO PREVENT BOXES TOUCHING IN WEBMAIL CLIENTS ══ -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td height="36" style="height: 36px; line-height: 36px; font-size: 1px;">&nbsp;</td>
                                    </tr>
                                </table>

                                <!-- ══ 7. CALL TO ACTION & DEADLINE ══ -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px;">
                                    <tr>
                                        <td align="center">
                                            <a href="{form_link}" target="_blank" class="btn font-sans" style="display: inline-block; background-color: #111111; color: #ffffff !important; text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; padding: 18px 46px; border: 1px solid #111111; border-radius: 3px;">Apply for GHC &nbsp;&rarr;</a>
                                        </td>
                                    </tr>
                                </table>

                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 45px;">
                                    <tr>
                                        <td align="center">
                                            <p class="font-sans" style="font-size: 11.5px; color: #555555; line-height: 1.85; letter-spacing: 0.5px; margin: 0;">
                                                Direct Link: <a href="{form_link}" target="_blank" style="color: #b8941f; text-decoration: underline; word-break: break-all; font-weight: 500;">{form_link}</a><br>
                                                Application Deadline: <strong style="color: #111111; font-weight: 700;">20 September 2026</strong>
                                            </p>
                                        </td>
                                    </tr>
                                </table>'''

    # Apply replacement for commitment + CTA section
    content = old_commitment_cta.sub(new_commitment_cta_block + '\n\n                                ', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated templates with layout fix and readability improvements.")
