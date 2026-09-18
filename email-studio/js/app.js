/**
 * app.js · Main Application Orchestration for Sundarbans Email Studio
 * State management, rendering, and interaction coordination
 */

class EmailStudioApp {
  constructor() {
    this.data = null;
    this.searchEngine = null;
    this.previewController = null;
    this.templates = [];
    this.categories = [];
    this.studioInfo = {};

    // DOM Elements
    this.templatesGrid = document.getElementById('templates-grid');
    this.resultsCountEl = document.getElementById('results-count');
    this.filterPillsContainer = document.getElementById('filter-pills-container');
    this.searchInput = document.getElementById('search-input');
    this.searchClearBtn = document.getElementById('search-clear-btn');
    this.sortSelect = document.getElementById('sort-select');
    this.customDropdown = document.getElementById('sort-dropdown');
    this.customDropdownBtn = document.getElementById('sort-dropdown-btn');
    this.customDropdownLabel = document.getElementById('sort-dropdown-label');
    this.customDropdownMenu = document.getElementById('sort-dropdown-menu');
    this.resetBtn = document.getElementById('reset-filters-btn');
    this.toastContainer = document.getElementById('toast-container');
  }

  async init() {
    // 1. Initialize Preview Controller
    this.previewController = new StudioPreviewController();

    // 2. Load Metadata (Dual fetch with window fallback)
    await this.loadData();

    // 3. Initialize Search Engine
    this.searchEngine = new TemplateSearchEngine(this.templates);

    // 4. Render Interface Components
    this.renderDynamicMetrics();
    this.renderFeaturedShowcase();
    this.renderCategoryBento();
    this.renderFilterPills();
    this.renderTemplateGrid();

    // 5. Initialize Events & Navigation
    this.initEventListeners();
    this.handleUrlRouting();
  }

  async loadData() {
    try {
      const isStudioDir = window.location.pathname.includes('/email-studio');
      const dataUrl = isStudioDir ? 'data/templates.json' : 'email-studio/data/templates.json';
      const res = await fetch(dataUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.data = await res.json();
    } catch (e) {
      console.warn('Direct fetch failed, falling back to embedded dataset:', e);
      if (window.SUNDARBANS_STUDIO_DATA) {
        this.data = window.SUNDARBANS_STUDIO_DATA;
      }
    }

    if (!this.data) {
      console.error('Fatal: Could not load template dataset.');
      return;
    }

    this.studioInfo = this.data.studio || {};
    this.categories = this.data.categories || [];
    this.templates = this.data.templates || [];
  }

  renderDynamicMetrics() {
    const totalCount = this.templates.length;
    const catCount = this.categories.length;
    const featuredCount = this.templates.filter(t => t.featured).length;

    const elTotal = document.getElementById('stat-total-templates');
    const elCats = document.getElementById('stat-total-categories');
    const elFeatured = document.getElementById('stat-featured');

    if (elTotal) elTotal.textContent = totalCount;
    if (elCats) elCats.textContent = catCount;
    if (elFeatured) elFeatured.textContent = `${featuredCount}+`;
  }

  renderFeaturedShowcase() {
    const container = document.getElementById('featured-grid');
    if (!container) return;

    const featuredList = this.templates.filter(t => t.featured);
    if (!featuredList.length) return;

    container.innerHTML = featuredList.slice(0, 6).map((t, idx) => {
      const delay = (idx * 0.04).toFixed(2);
      return `
        <article class="featured-card" data-id="${t.id}" style="animation-delay: ${delay}s;">
          <div class="card-preview-thumb">
            <div class="thumb-decor-grid"></div>
            <div class="thumb-preview-mini">
              <div class="mini-header-bar">
                <div class="mini-crest"></div>
                <div class="mini-rule"></div>
              </div>
              <div class="mini-body-lines">
                <div class="mini-line"></div>
                <div class="mini-line short"></div>
                <div class="mini-line gold"></div>
              </div>
              <div class="mini-cta"></div>
            </div>
            <div class="card-preview-overlay">
              <button class="btn btn-primary btn-sm preview-trigger-btn" data-id="${t.id}">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                Launch Studio
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="card-meta-row">
              <span class="badge badge-gold">${this.escapeHtml(t.category)}</span>
              <span class="badge badge-muted">${this.escapeHtml(t.theme)}</span>
            </div>
            <h3 class="card-title" title="${this.escapeHtml(t.title)}">${this.escapeHtml(t.title)}</h3>
            <p class="card-desc">${this.escapeHtml(t.description)}</p>
            <div class="card-footer">
              <span class="card-path-tag">${this.escapeHtml(t.raw_path)}</span>
              <span>${this.escapeHtml(t.filesize_formatted)}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click triggers
    container.querySelectorAll('.preview-trigger-btn, .featured-card').forEach(item => {
      item.addEventListener('click', (e) => {
        const id = item.getAttribute('data-id');
        const tmpl = this.templates.find(t => t.id === id);
        if (tmpl) this.previewController.openPreview(tmpl);
      });
    });
  }

  renderCategoryBento() {
    const container = document.getElementById('categories-grid');
    if (!container) return;

    container.innerHTML = this.categories.map((c, idx) => {
      const delay = (idx * 0.02).toFixed(2);
      return `
        <div class="category-bento-card" data-category="${c.slug}" style="animation-delay: ${delay}s;">
          <div class="cat-icon-row">
            <div class="cat-icon-wrapper">
              ${this.getCategoryIcon(c.icon)}
            </div>
            <span class="cat-badge-count">${c.count}</span>
          </div>
          <h3 class="cat-name">${this.escapeHtml(c.name)}</h3>
          <p class="cat-desc">${this.escapeHtml(c.description)}</p>
          <div class="cat-explore-link">
            <span>Explore Templates</span>
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>
      `;
    }).join('');

    // Category click handler: filters the catalog and scrolls down
    container.querySelectorAll('.category-bento-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const cat = card.getAttribute('data-category');
        this.selectCategory(cat);
        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  renderFilterPills() {
    if (!this.filterPillsContainer) return;

    const counts = this.searchEngine.getCategoryCounts();
    const allPills = [
      { slug: 'all', name: 'All Templates', count: counts['all'] || 0 },
      ...this.categories.map(c => ({ slug: c.slug, name: c.name, count: counts[c.slug] || 0 }))
    ];

    this.filterPillsContainer.innerHTML = allPills.map(p => {
      const isActive = this.searchEngine.activeCategory === p.slug;
      return `
        <button class="filter-pill ${isActive ? 'active' : ''}" data-category="${p.slug}">
          <span>${this.escapeHtml(p.name)}</span>
          <span class="pill-count">${p.count}</span>
        </button>
      `;
    }).join('');

    this.filterPillsContainer.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-category');
        this.selectCategory(cat);
      });
    });
  }

  selectCategory(category) {
    this.searchEngine.setCategory(category);
    this.renderFilterPills();
    this.renderTemplateGrid();
  }

  renderTemplateGrid() {
    if (!this.templatesGrid) return;

    const results = this.searchEngine.filterAndSort();

    // Update count display
    if (this.resultsCountEl) {
      this.resultsCountEl.innerHTML = `Showing <strong>${results.length}</strong> of <strong>${this.templates.length}</strong> templates`;
    }

    if (results.length === 0) {
      this.templatesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon-box">
            <svg class="icon icon-lg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <h3 class="empty-title">No templates matched</h3>
          <p class="empty-desc">We couldn't find any templates matching your current search criteria or category filter.</p>
          <button class="btn btn-secondary btn-sm" id="empty-reset-btn">Reset All Filters</button>
        </div>
      `;
      document.getElementById('empty-reset-btn')?.addEventListener('click', () => this.resetFilters());
      return;
    }

    this.templatesGrid.innerHTML = results.map((t, idx) => {
      const isFeatured = t.featured ? 'featured-card-style' : '';
      const delay = Math.min(idx * 0.012, 0.18).toFixed(3);
      return `
        <article class="template-card ${isFeatured}" data-id="${t.id}" style="animation-delay: ${delay}s;">
          <div class="card-top-strip">
            <span class="badge ${t.featured ? 'badge-gold' : 'badge-forest'}">${this.escapeHtml(t.category)}</span>
            <span class="badge badge-muted">${this.escapeHtml(t.theme)}</span>
          </div>
          <div class="card-main-content">
            <h3 class="card-heading" title="${this.escapeHtml(t.title)}">${this.escapeHtml(t.title)}</h3>
            <p class="card-snippet">${this.escapeHtml(t.description)}</p>
            <div class="card-tags-row">
              <span class="card-tag">${this.escapeHtml(t.header_pattern)}</span>
              <span class="card-tag">${this.escapeHtml(t.filesize_formatted)}</span>
            </div>
          </div>
          <div class="card-actions-bar">
            <button class="btn btn-primary btn-sm preview-btn" data-id="${t.id}">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </button>
            <div style="display:flex;gap:0.4rem;">
              <button class="btn btn-ghost btn-sm code-btn" data-id="${t.id}" title="View HTML Source">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </button>
              <a href="${t.file}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm" title="Open Raw in New Tab">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card event triggers
    this.templatesGrid.querySelectorAll('.preview-btn, .card-heading').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id') || btn.closest('.template-card')?.getAttribute('data-id');
        const tmpl = this.templates.find(t => t.id === id);
        if (tmpl) this.previewController.openPreview(tmpl);
      });
    });

    this.templatesGrid.querySelectorAll('.code-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const tmpl = this.templates.find(t => t.id === id);
        if (tmpl) {
          this.previewController.openPreview(tmpl);
          setTimeout(() => this.previewController.viewCurrentSource(), 150);
        }
      });
    });
  }

  initEventListeners() {
    // Search input typing with debounce
    let searchDebounce = null;
    this.searchInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      if (this.searchClearBtn) {
        this.searchClearBtn.classList.toggle('visible', val.length > 0);
      }
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        this.searchEngine.setSearchQuery(val);
        this.renderTemplateGrid();
      }, 120);
    });

    // Clear search button
    this.searchClearBtn?.addEventListener('click', () => {
      if (this.searchInput) {
        this.searchInput.value = '';
        this.searchClearBtn.classList.remove('visible');
        this.searchEngine.setSearchQuery('');
        this.renderTemplateGrid();
        this.searchInput.focus();
      }
    });

    // Custom sort dropdown initialization
    this.initCustomDropdown();

    // Fallback native sort select change
    this.sortSelect?.addEventListener('change', (e) => {
      this.searchEngine.setSort(e.target.value);
      this.renderTemplateGrid();
    });

    // Reset filters
    this.resetBtn?.addEventListener('click', () => this.resetFilters());

    // Search trigger button in header
    document.getElementById('header-search-btn')?.addEventListener('click', () => {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => this.searchInput?.focus(), 400);
    });

    // Standards guide triggers
    document.querySelectorAll('[data-open-standards]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.previewController.openStandardsModal();
      });
    });

    // Mobile nav toggle
    const menuBtn = document.getElementById('menu-toggle-btn');
    const navLinks = document.getElementById('nav-links');
    menuBtn?.addEventListener('click', () => {
      navLinks?.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    // Sticky nav scroll shadow
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 30);
      }
    });

    // Global keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== this.searchInput && !document.querySelector('.studio-modal-backdrop.open')) {
        e.preventDefault();
        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => this.searchInput?.focus(), 300);
      }
    });
  }

  initCustomDropdown() {
    if (!this.customDropdown || !this.customDropdownBtn || !this.customDropdownMenu) return;

    // Toggle dropdown open/close on button click
    this.customDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = this.customDropdown.classList.toggle('open');
      this.customDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Option selection
    const options = this.customDropdownMenu.querySelectorAll('.custom-dropdown-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.querySelector('span')?.textContent || '';

        // Update selected class and aria attributes
        options.forEach(opt => {
          opt.classList.remove('selected');
          opt.setAttribute('aria-selected', 'false');
        });
        option.classList.add('selected');
        option.setAttribute('aria-selected', 'true');

        // Update trigger button label
        if (this.customDropdownLabel) {
          this.customDropdownLabel.textContent = text;
        }

        // Close dropdown
        this.customDropdown.classList.remove('open');
        this.customDropdownBtn.setAttribute('aria-expanded', 'false');

        // Sync native select value
        if (this.sortSelect) {
          this.sortSelect.value = value;
        }

        // Trigger sort in search engine & re-render
        this.searchEngine.setSort(value);
        this.renderTemplateGrid();
      });
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!this.customDropdown.contains(e.target)) {
        this.customDropdown.classList.remove('open');
        this.customDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard navigation (Escape closes dropdown)
    this.customDropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.customDropdown.classList.remove('open');
        this.customDropdownBtn.setAttribute('aria-expanded', 'false');
        this.customDropdownBtn.focus();
      }
    });
  }

  resetFilters() {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchClearBtn?.classList.remove('visible');
    }
    if (this.sortSelect) this.sortSelect.value = 'featured';

    // Reset custom dropdown state
    if (this.customDropdownLabel) {
      this.customDropdownLabel.textContent = 'Featured First';
    }
    if (this.customDropdownMenu) {
      this.customDropdownMenu.querySelectorAll('.custom-dropdown-option').forEach(opt => {
        const isFeatured = opt.getAttribute('data-value') === 'featured';
        opt.classList.toggle('selected', isFeatured);
        opt.setAttribute('aria-selected', isFeatured ? 'true' : 'false');
      });
    }
    this.customDropdown?.classList.remove('open');
    this.customDropdownBtn?.setAttribute('aria-expanded', 'false');

    this.searchEngine.setSearchQuery('');
    this.searchEngine.setCategory('all');
    this.searchEngine.setSort('featured');
    this.searchEngine.setTheme('all');

    this.renderFilterPills();
    this.renderTemplateGrid();
    this.showToast('All filters have been reset.');
  }

  handleUrlRouting() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category') || params.get('cat');
    const previewId = params.get('preview') || params.get('id');

    if (catParam) {
      this.selectCategory(catParam);
    }

    if (previewId) {
      const tmpl = this.templates.find(t => t.id === previewId);
      if (tmpl) {
        setTimeout(() => this.previewController.openPreview(tmpl), 300);
      }
    }
  }

  showToast(message, type = 'success') {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${this.escapeHtml(message)}</span>
    `;
    this.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  getCategoryIcon(iconName) {
    const icons = {
      calendar: `<svg class="icon" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
      envelope: `<svg class="icon" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
      quill: `<svg class="icon" viewBox="0 0 24 24"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
      users: `<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      compass: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
      'book-open': `<svg class="icon" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      terminal: `<svg class="icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
      award: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
      'user-check': `<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`,
      briefcase: `<svg class="icon" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      bell: `<svg class="icon" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
      folder: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`
    };
    return icons[iconName] || icons.folder;
  }
}

// Instantiate and attach globally
window.app = new EmailStudioApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
