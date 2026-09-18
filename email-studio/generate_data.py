#!/usr/bin/env python3
"""
generate_data.py · Sundarbans Email Studio Metadata Generator
Scans the repository for all production HTML email templates and builds:
  1. email-studio/data/templates.json
  2. email-studio/js/templates-data.js (standalone window fallback for direct file:// or offline browsing)
"""

import os
import glob
import re
import json
import html

# Strict AGENTS.md rule: strip all OS emojis and icons
EMOJI_PATTERN = re.compile(
    r'[\U00010000-\U0010ffff]'
    r'|[\u2600-\u27bf]'
    r'|[\u2300-\u23ff]'
    r'|[\u2b50-\u2b55]'
    r'|[\ufe00-\ufe0f]'
    r'|[\u200d]'
    r'|[\u203c\u2049\u2139\u2194-\u21aa\u2934\u2935\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe]'
)

def clean_text(text):
    if not text:
        return ""
    # Strip HTML tags
    clean = re.sub(r'<[^>]+>', ' ', text)
    # Unescape HTML entities
    clean = html.unescape(clean)
    # Strip emojis (Strict AGENTS.md rule: NO EMOJIS)
    clean = EMOJI_PATTERN.sub('', clean)
    # Replace em dashes with middot (Strict AGENTS.md rule: NO EM DASHES)
    clean = re.sub(r'\u2014|&mdash;|&#8212;', ' · ', clean)
    # Normalize double middots or hyphens
    clean = re.sub(r'·\s*·+', '·', clean)
    clean = re.sub(r'\s*·\s*', ' · ', clean)
    # Normalize whitespaces
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def extract_metadata(file_path, repo_root):
    rel_path = os.path.relpath(file_path, repo_root).replace('\\', '/')
    parts = rel_path.split('/')
    category = parts[0]
    filename = os.path.basename(rel_path)
    base_id = os.path.splitext(filename)[0]
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Title detection
    title_m = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    raw_title = title_m.group(1).strip() if title_m else ''
    clean_title = clean_text(raw_title)

    # Look for primary H1 / main hero title
    h1_m = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    h1_text = clean_text(h1_m.group(1)) if h1_m else ''

    # Preheader / preview text
    preheader = ''
    pre_m = re.search(r'class=["\'][^"\']*(?:preheader|preview-text)[^"\']*["\'][^>]*>(.*?)<', content, re.IGNORECASE | re.DOTALL)
    if pre_m:
        preheader = clean_text(pre_m.group(1))
    else:
        hidden_m = re.search(r'style=["\'][^"\']*(?:display:\s*none|max-height:\s*0)[^"\']*["\'][^>]*>(.*?)<', content, re.IGNORECASE | re.DOTALL)
        if hidden_m:
            preheader = clean_text(hidden_m.group(1))

    # Look for first substantive paragraph
    first_p = ''
    p_matches = re.findall(r'<p[^>]*>(.*?)</p>', content, re.IGNORECASE | re.DOTALL)
    for p in p_matches:
        cleaned_p = clean_text(p)
        if len(cleaned_p) > 35 and not any(k in cleaned_p.lower() for k in ['learn · grow · lead', 'warm regards', 'secretary', 'iit madras bs']):
            first_p = cleaned_p
            break

    # Determine human-friendly display title
    display_title = ""
    # Filter out generic titles like "Document", "Untitled", etc.
    if clean_title and clean_title.lower() not in ['document', 'untitled', 'email template', 'sundarbans house']:
        display_title = clean_title
    elif h1_text:
        display_title = h1_text
    else:
        # Fallback to formatting filename
        words = base_id.replace('-', ' ').replace('_', ' ').split()
        display_title = ' '.join(w.capitalize() for w in words)

    # Sanitize title formatting
    display_title = re.sub(r'[\r\n\t]+', ' ', display_title).strip()
    if len(display_title) > 65:
        display_title = display_title[:62] + '...'

    # Refined descriptions based on content
    description = ""
    if preheader and len(preheader) > 20:
        description = preheader
    elif first_p:
        description = first_p
    else:
        description = f"HTML email template for {category.replace('-', ' ').title()} - {display_title}."

    if len(description) > 140:
        description = description[:137] + '...'

    # Detect header layout pattern
    header_pattern = "Pattern A (Sundarbans Letterhead)"
    if "8 HOUSES COLLECTIVE" in content or "8-Houses" in content or "Chai, Baarish aur Baatcheet" in content:
        header_pattern = "Pattern B (8 Houses Collective)"
    elif "letterhead" not in content.lower() and "motto" not in content.lower():
        header_pattern = "Custom / Campaign"

    # Detect theme / mood
    theme_detected = "Dark Theme"
    if 'bgcolor="#ffffff"' in content.lower() or 'background-color:#ffffff' in content.lower() or 'background-color: #ffffff' in content.lower():
        if content.lower().count('#ffffff') > 3 and content.lower().count('#0') < 2:
            theme_detected = "Light Theme"
    if "cyberpunk" in rel_path.lower():
        theme_detected = "Cyberpunk / Special"
    elif "cosmic" in rel_path.lower():
        theme_detected = "Cosmic / Glow"
    elif "ember" in rel_path.lower():
        theme_detected = "Ember / Warm"
    elif "aurora" in rel_path.lower():
        theme_detected = "Aurora / Emerald"

    # Keywords for search
    keywords = set([category, base_id.replace('-', ' '), display_title.lower()])
    if "orientation" in rel_path:
        keywords.update(["freshers", "orientation", "campus", "meetup"])
    if "poetry" in rel_path or "slamoria" in rel_path:
        keywords.update(["poetry", "slamoria", "literature", "creative", "competition"])
    if "cyber" in rel_path:
        keywords.update(["cybersecurity", "tech", "security", "linux", "terminal"])
    if "ubuntu" in rel_path:
        keywords.update(["ubuntu", "linux", "workshop", "os", "desktop"])
    if "recruitment" in rel_path or "onboarding" in rel_path:
        keywords.update(["recruitment", "onboarding", "team", "core", "lead", "head"])
    if "certificate" in rel_path:
        keywords.update(["certificate", "award", "achievement", "merit"])
    if "well-being" in rel_path:
        keywords.update(["mental health", "wellness", "well-being", "mindfulness"])

    # Curate flagship/featured templates
    featured_paths = [
        "events/chai-baarish-season2.html",
        "team-onboarding/webops-team-cyberpunk.html",
        "invitations/well-being-v1-cosmic-calm.html",
        "events/vasant-panchami-launch.html",
        "events/3-am-thoughts.html",
        "poetry-competition/round-1/01-slamoria-announcement.html",
        "ubuntu-session/workshop-beyond-the-terminal.html",
        "team-onboarding/core-team-onboarding.html",
        "orientation/house-orientation-dark.html",
        "events/chess-showdown.html",
        "sessions/01-cyber-fundamentals.html",
        "certificates/winner-certificate.html"
    ]
    is_featured = rel_path in featured_paths

    return {
        "id": base_id,
        "title": display_title,
        "category": category,
        "subcategory": parts[1] if len(parts) > 2 else None,
        "description": description,
        "file": f"../{rel_path}",
        "raw_path": rel_path,
        "filesize_bytes": len(content),
        "filesize_formatted": f"{len(content) / 1024:.1f} KB",
        "header_pattern": header_pattern,
        "theme": theme_detected,
        "keywords": list(keywords),
        "featured": is_featured
    }

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    
    html_files = glob.glob(os.path.join(repo_root, '**', '*.html'), recursive=True)
    templates = []

    for f in sorted(html_files):
        rel = os.path.relpath(f, repo_root).replace('\\', '/')
        # Skip internal folders, tests, or email-studio itself
        if rel.startswith(('.git', 'scratch', 'email-studio')) or 'centering-test' in rel:
            continue
        
        meta = extract_metadata(f, repo_root)
        templates.append(meta)

    # Sort templates by category, then by title
    templates.sort(key=lambda t: (t['category'], t['title']))

    # Prepare categories summary
    categories_dict = {}
    category_labels = {
        "events": {"name": "Events & Gatherings", "icon": "calendar", "desc": "House competitions, cultural nights, open mics, and meetups"},
        "invitations": {"name": "Invitations & Drives", "icon": "envelope", "desc": "Guest speakers, wellness sessions, and recruitment invites"},
        "poetry-competition": {"name": "Poetry Competition", "icon": "quill", "desc": "Slamoria rounds, house reveals, and winner recognitions"},
        "team-onboarding": {"name": "Team Onboarding", "icon": "users", "desc": "POR appointments, executive councils, and core team handbooks"},
        "orientation": {"name": "Orientation", "icon": "compass", "desc": "Freshers welcomes, city-chapter orientations, and doubt clearing"},
        "sessions": {"name": "Academic Sessions", "icon": "book-open", "desc": "Cybersecurity track, exam revisions, and skill-building bootcamps"},
        "ubuntu-session": {"name": "Ubuntu Mastery", "icon": "terminal", "desc": "Linux foundation, power user tools, and desktop customization"},
        "certificates": {"name": "Certificates", "icon": "award", "desc": "Participant recognition, winner certifications, and drive mailers"},
        "participation": {"name": "Participation Callouts", "icon": "user-check", "desc": "Personalized participation notices and engagement highlights"},
        "ghc-recruitment": {"name": "GHC Recruitment", "icon": "briefcase", "desc": "Regional web and design recruitment drives (Chennai, Delhi, Kolkata)"},
        "general": {"name": "General Communications", "icon": "bell", "desc": "Roadmaps, club announcements, and house administrative updates"}
    }

    for t in templates:
        cat = t['category']
        if cat not in categories_dict:
            info = category_labels.get(cat, {"name": cat.replace('-', ' ').title(), "icon": "folder", "desc": f"{cat} emails"})
            categories_dict[cat] = {
                "slug": cat,
                "name": info["name"],
                "icon": info["icon"],
                "description": info["desc"],
                "count": 0
            }
        categories_dict[cat]["count"] += 1

    dataset = {
        "studio": {
            "name": "Sundarbans Email Studio",
            "house": "Sundarbans House",
            "institution": "IIT Madras BS Degree",
            "motto": "Learn · Grow · Lead",
            "tagline": "Every message deserves a thoughtful design.",
            "total_templates": len(templates),
            "total_categories": len(categories_dict),
            "featured_count": sum(1 for t in templates if t['featured'])
        },
        "categories": list(categories_dict.values()),
        "templates": templates
    }

    # Ensure output directories exist
    data_dir = os.path.join(script_dir, 'data')
    js_dir = os.path.join(script_dir, 'js')
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(js_dir, exist_ok=True)

    # 1. Output templates.json
    json_path = os.path.join(data_dir, 'templates.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)
    print(f"Generated {json_path} ({len(templates)} templates)")

    # 2. Output templates-data.js (standalone window global for direct file:// access)
    js_path = os.path.join(js_dir, 'templates-data.js')
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write("/**\n * Auto-generated by generate_data.py\n * Provides standalone data fallback for local and file:// testing\n */\n")
        f.write("window.SUNDARBANS_STUDIO_DATA = ")
        json.dump(dataset, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(f"Generated {js_path} ({len(templates)} templates)")

if __name__ == '__main__':
    main()
