/**
 * search.js · Search, Filtering, and Sorting Engine
 * Fast client-side search across all template metadata
 */

class TemplateSearchEngine {
  constructor(templates = []) {
    this.templates = templates;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'featured';
    this.themeFilter = 'all';
  }

  setTemplates(templates) {
    this.templates = templates;
  }

  setCategory(category) {
    this.activeCategory = category || 'all';
  }

  setSearchQuery(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
  }

  setSort(sortBy) {
    this.sortBy = sortBy || 'featured';
  }

  setTheme(theme) {
    this.themeFilter = theme || 'all';
  }

  filterAndSort() {
    let results = this.templates.filter(template => {
      // 1. Category Filter
      if (this.activeCategory !== 'all' && template.category !== this.activeCategory) {
        return false;
      }

      // 2. Theme Filter
      if (this.themeFilter !== 'all') {
        const themeLower = (template.theme || '').toLowerCase();
        if (this.themeFilter === 'dark' && !themeLower.includes('dark')) return false;
        if (this.themeFilter === 'light' && !themeLower.includes('light')) return false;
        if (this.themeFilter === 'special' && !['cyberpunk', 'cosmic', 'ember', 'aurora'].some(k => themeLower.includes(k))) return false;
      }

      // 3. Search Query
      if (this.searchQuery) {
        const searchPool = [
          template.title,
          template.category,
          template.description,
          template.id,
          template.raw_path,
          template.header_pattern,
          ...(template.keywords || [])
        ].join(' ').toLowerCase();

        // Multi-word search token matching
        const tokens = this.searchQuery.split(/\s+/).filter(Boolean);
        const matchesAllTokens = tokens.every(token => searchPool.includes(token));
        if (!matchesAllTokens) return false;
      }

      return true;
    });

    // Sorting
    results.sort((a, b) => {
      if (this.sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      } else if (this.sortBy === 'category') {
        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) return catCompare;
        return a.title.localeCompare(b.title);
      } else if (this.sortBy === 'filesize') {
        return (b.filesize_bytes || 0) - (a.filesize_bytes || 0);
      }
      return 0;
    });

    return results;
  }

  getCategoryCounts() {
    const counts = { all: this.templates.length };
    this.templates.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }
}

window.TemplateSearchEngine = TemplateSearchEngine;
