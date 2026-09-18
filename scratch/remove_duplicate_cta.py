import glob
import os
import re

files = glob.glob(os.path.join("ghc-recruitment", "*.html"))

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Regex to catch duplicate CTA block before footer signature
    duplicate_pattern = re.compile(
        r'(\s*<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">\s*<tr>\s*<td align="center">\s*<a href="[^"]+" target="_blank" class="btn font-sans">Apply for GHC &nbsp;&rarr;</a>.*?Application Deadline: <strong style="color: #111111;">20 September 2026</strong>\s*</p>\s*</td>\s*</tr>\s*</table>)',
        re.DOTALL
    )
    
    new_content = duplicate_pattern.sub("", content)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

print("Removed duplicate CTA blocks from templates.")
