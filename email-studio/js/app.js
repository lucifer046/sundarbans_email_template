/**
 * app.js · Sundarbans Email Studio
 * Loads the template index, renders the hero, design library and archive,
 * and wires up search, filters, theme switching and routing.
 */

// Reference layouts documented in AGENTS.md (section 12). Order matters: it is the display order.
const DESIGN_LIBRARY = [
  { letter: 'C', name: 'Midnight Editorial', use: 'Dark, poster-led launches for cultural nights and big events.', path: 'design-library/midnight-editorial.html', swatches: ['#0E0D0B', '#1A1814', '#E9B15F', '#F2EDE4'] },
  { letter: 'D', name: 'Paper Notice', use: 'Light, formal notices, results and appointments.', path: 'design-library/paper-notice.html', swatches: ['#FBF8F2', '#FFFFFF', '#7A4E1D', '#1F1B16'] },
  { letter: 'E', name: 'Admit Pass', use: 'Ticket-style invitations, RSVPs and confirmed seats.', path: 'design-library/admit-pass.html', swatches: ['#F4EDE2', '#FFFDF9', '#B5562B', '#2A211B'] },
  { letter: 'F', name: 'House Digest', use: 'Newsletters and roundups with several items in one mail.', path: 'design-library/house-digest.html', swatches: ['#F3F5F1', '#FFFFFF', '#1F5A3D', '#C98A2B'] },
  { letter: 'G', name: 'Live Alert', use: 'Short reminders and "starting now" mail with one action.', path: 'design-library/live-alert.html', swatches: ['#14090A', '#1F1012', '#FF6A3D', '#FFF4EE'] }
];

const THEME_TONES = {
  'Light Theme': '#F2EBDD',
  'Dark Theme': '#3B3A33',
  'Cyberpunk / Special': '#22D3EE',
  'Cosmic / Glow': '#A78BFA',
  'Ember / Warm': '#FF7A45',
  'Aurora / Emerald': '#34D399'
};

const THUMB_WIDTH = 680;

class EmailStudioApp {
  constructor() {
    this.templates = [];
    this.categories = [];
    this.search = null;
    this.preview = null;

    this.grid = document.getElementById('templates-grid');
    this.chips = document.getElementById('category-chips');
    this.countEl = document.getElementById('results-count');
    this.searchInput = document.getElementById('search-input');
    this.sortSelect = document.getElementById('sort-select');
    this.toasts = document.getElementById('toasts');

    // Thumbnails load only when near the viewport and rescale with their card
    this.thumbLoader = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        this.loadThumb(entry.target);
        this.thumbLoader.unobserve(entry.target);
      });
    }, { rootMargin: '600px 0px' });
    this.thumbSizer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const width = entry.contentRect.width;
        if (width) entry.target.style.setProperty('--s', (width / THUMB_WIDTH).toFixed(4));
      });
    });
  }

  async init() {
    await this.loadData();
    this.search = new TemplateSearchEngine(this.templates);
    this.preview = new StudioPreview(this);

    this.renderStats();
    this.renderHeroStack();
    this.renderLibrary();
    this.renderChips();
    this.renderGrid();
    this.bindEvents();
    this.routeFromUrl();
  }

  async loadData() {
    let data = null;
    try {
      const inStudioDir = window.location.pathname.includes('/email-studio/');
      const res = await fetch(inStudioDir ? 'data/templates.json' : 'email-studio/data/templates.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      // file:// or offline: use the embedded copy
      data = window.SUNDARBANS_STUDIO_DATA || null;
    }
    if (!data) {
      this.grid.innerHTML = `<div class="empty"><h3>Could not load templates</h3><p>Run <code>python email-studio/generate_data.py</code> and reload.</p></div>`;
      return;
    }
    this.categories = data.categories || [];
    this.templates = data.templates || [];
  }

  // ── Rendering ─────────────────────────────────────────

  renderStats() {
    const latest = [...this.templates].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
    this.setText('stat-templates', this.templates.length);
    this.setText('stat-collections', this.categories.length);
    this.setText('stat-latest', latest?.date_formatted ? latest.date_formatted.replace(/ \d{4}$/, '') : '-');
  }

  renderHeroStack() {
    const stack = document.getElementById('hero-stack');
    if (!stack) return;
    const picks = this.search.filterAndSort().filter(t => t.category !== 'design-library').slice(0, 3).reverse();
    stack.innerHTML = picks.map(t => `
      <div class="stack-card" data-id="${this.esc(t.id)}">
        ${this.thumbMarkup(t, { badge: false })}
        <div class="stack-label"><small>${this.esc(this.categoryName(t.category))}</small>${this.esc(this.shortTitle(t.title))}</div>
      </div>`).join('');
    stack.removeAttribute('aria-hidden');
    stack.querySelectorAll('.stack-card').forEach(card => {
      card.addEventListener('click', () => this.openById(card.dataset.id, picks));
    });
    this.observeThumbs(stack);
  }

  renderLibrary() {
    const wrap = document.getElementById('library-grid');
    if (!wrap) return;
    wrap.innerHTML = DESIGN_LIBRARY.map(d => {
      const t = this.findByPath(d.path);
      return `
        <button type="button" class="library-card" data-path="${d.path}">
          ${this.thumbMarkup(t || { raw_path: d.path, theme: '' }, { badge: false })}
          <span class="library-body">
            <span class="library-letter">PATTERN ${d.letter}</span>
            <span class="library-name">${this.esc(d.name)}</span>
            <span class="library-use">${this.esc(d.use)}</span>
            <span class="library-swatches">${d.swatches.map(c => `<span style="background:${c}"></span>`).join('')}</span>
          </span>
        </button>`;
    }).join('');
    const list = DESIGN_LIBRARY.map(d => this.findByPath(d.path) || this.stubTemplate(d));
    wrap.querySelectorAll('.library-card').forEach((card, i) => {
      card.addEventListener('click', () => this.preview.open(list[i], list));
    });
    this.observeThumbs(wrap);
  }

  renderChips() {
    const counts = this.search.getCategoryCounts();
    const items = [{ slug: 'all', name: 'Everything' }, ...this.categories];
    this.chips.innerHTML = items.map(c => {
      const active = this.search.activeCategory === c.slug;
      return `<button type="button" role="tab" aria-selected="${active}" class="chip${active ? ' active' : ''}" data-cat="${c.slug}">
        ${this.esc(c.name)}<span class="count">${counts[c.slug] || 0}</span></button>`;
    }).join('');
  }

  renderGrid() {
    const results = this.search.filterAndSort();
    this.results = results;
    this.countEl.innerHTML = results.length === this.templates.length
      ? `<strong>${results.length}</strong> templates, newest work first by default.`
      : `Showing <strong>${results.length}</strong> of ${this.templates.length} templates.`;

    if (!results.length) {
      this.grid.innerHTML = `<div class="empty"><h3>Nothing matches that</h3><p>Try a shorter search or a different collection.</p><button type="button" class="btn btn-quiet btn-sm" data-reset>Clear filters</button></div>`;
      return;
    }

    this.grid.innerHTML = results.map((t, i) => `
      <article class="card" data-id="${this.esc(t.id)}" style="--d:${Math.min(i * 0.025, 0.4).toFixed(3)}s">
        <button type="button" class="card-hit" data-open="${this.esc(t.id)}" aria-label="Preview ${this.esc(t.title)}"></button>
        <div class="card-quick">
          <button type="button" data-copy="${this.esc(t.id)}" aria-label="Copy HTML" title="Copy HTML">
            <svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>
          </button>
          <a href="${this.esc(t.raw_path)}" target="_blank" rel="noopener noreferrer" aria-label="Open in new tab" title="Open in new tab">
            <svg class="icon" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>
          </a>
        </div>
        ${this.thumbMarkup(t, { badge: true })}
        <div class="card-info">
          <div class="card-meta">
            <span class="card-cat">${this.esc(this.categoryName(t.category))}</span>
            ${t.date_formatted ? `<span class="sep"></span><span class="card-date">${this.esc(t.date_formatted)}</span>` : ''}
          </div>
          <h3 class="card-title">${this.esc(this.shortTitle(t.title))}</h3>
        </div>
      </article>`).join('');

    this.observeThumbs(this.grid);
  }

  thumbMarkup(t, { badge }) {
    const tone = THEME_TONES[t.theme] || 'var(--gold)';
    const themeLabel = (t.theme || '').replace(' Theme', '').split(' / ')[0];
    return `
      <div class="thumb" data-src="${this.esc(t.raw_path)}">
        ${t.featured && badge ? '<span class="badge-featured">Featured</span>' : ''}
        ${badge && themeLabel ? `<span class="thumb-theme" style="--tone:${tone}"><i></i>${this.esc(themeLabel)}</span>` : ''}
      </div>`;
  }

  observeThumbs(root) {
    root.querySelectorAll('.thumb[data-src]').forEach(el => {
      this.thumbSizer.observe(el);
      this.thumbLoader.observe(el);
    });
  }

  loadThumb(el) {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-same-origin');
    frame.setAttribute('tabindex', '-1');
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('scrolling', 'no');
    frame.loading = 'lazy';
    frame.title = '';
    frame.addEventListener('load', () => {
      // Hide scrollbars inside the thumbnail when we can reach the document
      try {
        const doc = frame.contentDocument;
        const style = doc.createElement('style');
        style.textContent = 'html,body{overflow:hidden!important;scrollbar-width:none!important}::-webkit-scrollbar{display:none!important}';
        doc.head?.appendChild(style);
      } catch (e) { /* cross-origin on file:// */ }
      el.classList.add('ready');
    }, { once: true });
    frame.src = el.dataset.src;
    el.appendChild(frame);
  }

  // ── Events ────────────────────────────────────────────

  bindEvents() {
    let debounce;
    this.searchInput.addEventListener('input', e => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        this.search.setSearchQuery(e.target.value);
        this.renderGrid();
      }, 120);
    });

    this.sortSelect.addEventListener('change', e => {
      this.search.setSort(e.target.value);
      this.renderGrid();
    });

    document.getElementById('theme-filter').addEventListener('click', e => {
      const btn = e.target.closest('[data-theme-filter]');
      if (!btn) return;
      e.currentTarget.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-checked', b === btn);
      });
      this.search.setTheme(btn.dataset.themeFilter);
      this.renderGrid();
    });

    this.chips.addEventListener('click', e => {
      const chip = e.target.closest('[data-cat]');
      if (chip) this.selectCategory(chip.dataset.cat);
    });

    this.grid.addEventListener('click', e => {
      const open = e.target.closest('[data-open]');
      const copy = e.target.closest('[data-copy]');
      if (e.target.closest('[data-reset]')) return this.resetFilters();
      if (copy) return this.copyTemplate(this.byId(copy.dataset.copy));
      if (open) this.openById(open.dataset.open, this.results);
    });

    document.getElementById('search-pill').addEventListener('click', () => this.focusSearch());

    document.getElementById('theme-toggle').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('studio-theme', next); } catch (e) {}
    });

    // Standards drawer
    const drawer = document.getElementById('standards');
    document.querySelectorAll('[data-open-standards]').forEach(el => el.addEventListener('click', () => {
      drawer.hidden = false;
      document.body.classList.add('locked');
    }));
    const closeDrawer = () => { drawer.hidden = true; if (!this.preview.isOpen) document.body.classList.remove('locked'); };
    document.getElementById('standards-close').addEventListener('click', closeDrawer);
    drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !drawer.hidden) return closeDrawer();
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName || '');
      if (e.key === '/' && !typing && !this.preview.isOpen && drawer.hidden) {
        e.preventDefault();
        this.focusSearch();
      }
    });

    const topbar = document.getElementById('topbar');
    window.addEventListener('scroll', () => topbar.classList.toggle('scrolled', window.scrollY > 8), { passive: true });

    window.addEventListener('popstate', () => this.routeFromUrl());
  }

  selectCategory(slug) {
    this.search.setCategory(slug);
    this.renderChips();
    this.renderGrid();
  }

  resetFilters() {
    this.searchInput.value = '';
    this.sortSelect.value = 'date-desc';
    this.search.setSearchQuery('');
    this.search.setSort('date-desc');
    this.search.setTheme('all');
    document.querySelectorAll('[data-theme-filter]').forEach(b => {
      const on = b.dataset.themeFilter === 'all';
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
    this.selectCategory('all');
  }

  focusSearch() {
    document.getElementById('archive').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => this.searchInput.focus({ preventScroll: true }), 350);
  }

  routeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || params.get('cat');
    if (cat && cat !== this.search.activeCategory) this.selectCategory(cat);

    const id = params.get('preview') || params.get('id');
    if (id) {
      const t = this.byId(id);
      if (t) this.preview.open(t, this.results, { fromRoute: true });
    } else if (this.preview.isOpen) {
      this.preview.close({ fromRoute: true });
    }
  }

  // ── Helpers ───────────────────────────────────────────

  async copyTemplate(t) {
    if (!t) return;
    try {
      const res = await fetch(t.raw_path);
      if (!res.ok) throw new Error();
      await navigator.clipboard.writeText(await res.text());
      this.toast('HTML copied to clipboard');
    } catch (e) {
      this.toast('Copy needs the studio served over http');
    }
  }

  openById(id, list) {
    const t = this.byId(id);
    if (t) this.preview.open(t, list && list.length ? list : this.results);
  }

  byId(id) { return this.templates.find(t => t.id === id); }
  findByPath(path) { return this.templates.find(t => t.raw_path === path); }
  stubTemplate(d) {
    return { id: d.path.split('/').pop().replace('.html', ''), title: `${d.name} · Pattern ${d.letter}`, category: 'design-library', raw_path: d.path, description: d.use, theme: '', header_pattern: `Pattern ${d.letter}` };
  }

  categoryName(slug) {
    return this.categories.find(c => c.slug === slug)?.name || (slug || '').replace(/-/g, ' ');
  }

  // Titles often end with "· Sundarbans House"; drop that tail on cards
  shortTitle(title) {
    return (title || '').replace(/\s*[·|-]\s*Sundarbans House.*$/i, '').trim() || title;
  }

  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  toast(message) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>${this.esc(message)}</span>`;
    this.toasts.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 250); }, 2400);
  }

  esc(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
}

window.app = new EmailStudioApp();
document.addEventListener('DOMContentLoaded', () => window.app.init());
