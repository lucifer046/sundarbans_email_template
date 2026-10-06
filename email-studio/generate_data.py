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
import subprocess
import datetime

MONTHS = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
    'january': 1, 'february': 2, 'march': 3, 'april': 4, 'june': 6,
    'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12
}

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


def extract_date_info(file_path, rel_path, content, file_commit_dates):
    """
    Extracts chronological date (YYYY-MM-DD), formatted display date (DD Mon YYYY),
    and epoch timestamp for sorting.
    """
    header_chunk = content[:3000]
    m_head = re.search(r'(?:Date|Term[^<\n]*\|\s*Date)\s*(?:&middot;|·|:|-)\s*(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})', header_chunk, re.I)
    if m_head:
        d, m, y = m_head.group(1), m_head.group(2).lower()[:3], m_head.group(3)
        if m in MONTHS:
            iso = f"{y}-{MONTHS[m]:02d}-{int(d):02d}"
            fmt = f"{int(d):02d} {m.capitalize()} {y}"
            mtime = os.path.getmtime(file_path)
            return iso, fmt, int(mtime)

    m_labeled = re.search(r'(?:Appointment\s*Date|Event\s*Date|Session\s*Date|Date\s*[:·&middot;-])\s*([0-9]{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+([0-9]{4})', content, re.I)
    if m_labeled:
        d, m, y = m_labeled.group(1), m_labeled.group(2).lower()[:3], m_labeled.group(3)
        if m in MONTHS:
            iso = f"{y}-{MONTHS[m]:02d}-{int(d):02d}"
            fmt = f"{int(d):02d} {m.capitalize()} {y}"
            mtime = os.path.getmtime(file_path)
            return iso, fmt, int(mtime)

    if rel_path in file_commit_dates:
        git_iso = file_commit_dates[rel_path]
        try:
            dt = datetime.datetime.strptime(git_iso, "%Y-%m-%d")
            mtime = os.path.getmtime(file_path)
            return git_iso, dt.strftime("%d %b %Y"), int(mtime)
        except Exception:
            pass

    mtime = os.path.getmtime(file_path)
    dt_m = datetime.datetime.fromtimestamp(mtime)
    return dt_m.strftime("%Y-%m-%d"), dt_m.strftime("%d %b %Y"), int(mtime)

def extract_metadata(file_path, repo_root, file_commit_dates=None):
    if file_commit_dates is None:
        file_commit_dates = {}
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
    if "guidance" in rel_path or "course" in rel_path:
        keywords.update(["course guidance", "degree", "diploma", "foundation", "courses", "academics", "planning"])
    if "statistics" in rel_path or "stats" in rel_path or "tamil" in rel_path:
        keywords.update(["statistics", "stats", "tamil", "academics", "session", "baskaran nadar", "math"])
    if "saavan" in rel_path:
        keywords.update(["saavan", "inter-house", "fest", "competition", "trophy", "sports", "cultural"])
    if "bgmi" in rel_path or "gaming" in rel_path:
        keywords.update(["bgmi", "battlegrounds", "gaming", "esports", "tournament"])
    if "champion" in rel_path or "quiz" in rel_path:
        keywords.update(["quiz", "trivia", "kbc", "kaun banega champion", "competition"])
    if "music" in rel_path or "judge" in rel_path:
        keywords.update(["music", "judge", "invitation", "jury", "evaluation", "cultural"])

    # Curate flagship/featured templates
    featured_paths = [
        "events/chai-baarish-season2.html",
        "sessions/course-guidance-session.html",
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

    date_iso, date_fmt, timestamp = extract_date_info(file_path, rel_path, content, file_commit_dates)

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
        "date": date_iso,
        "date_formatted": date_fmt,
        "timestamp": timestamp,
        "header_pattern": header_pattern,
        "theme": theme_detected,
        "keywords": sorted(list(keywords)),
        "featured": is_featured
    }

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(script_dir)
    
    # Batch fetch git commit dates for fast and accurate commit tracking
    file_commit_dates = {}
    try:
        out = subprocess.check_output(
            ["git", "log", "--name-only", "--format=COMMIT_DATE:%cd", "--date=short"],
            cwd=repo_root,
            text=True
        )
        current_date = None
        for line in out.splitlines():
            line = line.strip()
            if not line:
                continue
            if line.startswith("COMMIT_DATE:"):
                current_date = line.split(":", 1)[1].strip()
            else:
                fpath = line.replace("\\", "/")
                if fpath not in file_commit_dates and current_date:
                    file_commit_dates[fpath] = current_date
    except Exception as e:
        print(f"Warning: could not fetch git commit dates: {e}")

    html_files = glob.glob(os.path.join(repo_root, '**', '*.html'), recursive=True)
    templates = []

    for f in sorted(html_files):
        rel = os.path.relpath(f, repo_root).replace('\\', '/')
        # Skip internal folders, tests, email-studio itself, or root index.html
        if rel.startswith(('.git', 'scratch', 'email-studio')) or 'centering-test' in rel or rel == 'index.html':
            continue
        
        meta = extract_metadata(f, repo_root, file_commit_dates)
        templates.append(meta)

    # Sort templates by date descending (newest first), with timestamp and title as tie-breakers
    templates.sort(key=lambda t: (t.get('date', ''), t.get('timestamp', 0), t.get('title', '')), reverse=True)

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
