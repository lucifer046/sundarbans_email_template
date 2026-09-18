import glob
import os

files = glob.glob(os.path.join("ghc-recruitment", "*.html"))

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Update Regional Coordinator to RC in footer line
    content = content.replace("Regional Coordinator &middot; Delhi Region", "RC &middot; Delhi Region")
    content = content.replace("Regional Coordinator &middot; Kolkata Region", "RC &middot; Kolkata Region")
    content = content.replace("Regional Coordinator &middot; Chennai Region", "RC &middot; Chennai Region")
    
    # Update deadlines to 20 September
    content = content.replace("by 3 Sept", "by 20 Sept")
    content = content.replace("Apply by 3 September 2026.", "Apply by 20 September 2026.")
    content = content.replace("Sept 3<span style=\"font-size: 13px; color: #666666;\">, 2026</span>", "Sept 20<span style=\"font-size: 13px; color: #666666;\">, 2026</span>")
    content = content.replace("3 September 2026", "20 September 2026")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated files:", len(files))
