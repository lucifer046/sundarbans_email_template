/**
 * preview.js · Sundarbans Email Studio
 * Full-screen preview: device widths, source view, prev/next, copy and download.
 */

const DEVICE_LABELS = { desktop: '720 px', tablet: '560 px · breakpoint', mobile: '375 px' };

class StudioPreview {
  constructor(app) {
    this.app = app;
    this.isOpen = false;
    this.list = [];
    this.index = 0;
    this.current = null;
    this.html = null;
    this.view = 'preview';

    this.el = document.getElementById('studio');
    this.stage = document.getElementById('stage');
    this.device = document.getElementById('device');
    this.frame = document.getElementById('studio-frame');
    this.codeView = document.getElementById('code-view');
    this.codeContent = document.getElementById('code-content');

    this.bind();
  }

  bind() {
    const on = (id, fn) => document.getElementById(id).addEventListener('click', fn);
    on('studio-close', () => this.close());
    on('studio-prev', () => this.step(-1));
    on('studio-next', () => this.step(1));
    on('studio-copy', () => this.copy());
    on('studio-download', () => this.download());
    on('studio-open', () => window.open(this.current.raw_path, '_blank', 'noopener'));
    on('studio-link', () => this.copyLink());
    on('studio-info-toggle', () => this.toggleInspector());

    document.getElementById('device-switch').addEventListener('click', e => {
      const btn = e.target.closest('[data-device]');
      if (btn) this.setDevice(btn.dataset.device);
    });
    document.getElementById('view-switch').addEventListener('click', e => {
      const btn = e.target.closest('[data-view]');
      if (btn) this.setView(btn.dataset.view);
    });

    this.frame.addEventListener('load', () => {
      if (!this.frame.src || this.frame.src === 'about:blank') return;
      this.styleFrame();
      this.stage.classList.remove('loading');
    });

    window.addEventListener('keydown', e => {
      if (!this.isOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      if (!document.getElementById('standards').hidden) return;
      const keys = {
        Escape: () => this.close(),
        ArrowLeft: () => this.step(-1),
        ArrowRight: () => this.step(1),
        '1': () => this.setDevice('desktop'),
        '2': () => this.setDevice('tablet'),
        '3': () => this.setDevice('mobile'),
        c: () => this.copy(),
        C: () => this.copy()
      };
      if (keys[e.key]) {
        e.preventDefault();
        keys[e.key]();
      }
    });
  }

  open(template, list, { fromRoute = false } = {}) {
    this.list = (list && list.length ? list : [template]);
    this.index = Math.max(0, this.list.findIndex(t => t.raw_path === template.raw_path));
    if (this.list[this.index]?.raw_path !== template.raw_path) {
      this.list = [template];
      this.index = 0;
    }

    if (!this.isOpen) {
      this.el.hidden = false;
      this.isOpen = true;
      document.body.classList.add('locked');
      this.lastFocus = document.activeElement;
      document.getElementById('studio-close').focus({ preventScroll: true });
    }
    this.load(template);
    if (!fromRoute) this.pushRoute(template.id);
  }

  close({ fromRoute = false } = {}) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.el.hidden = true;
    this.frame.src = 'about:blank';
    document.body.classList.remove('locked');
    this.lastFocus?.focus?.({ preventScroll: true });
    if (!fromRoute) this.pushRoute(null);
  }

  step(delta) {
    if (this.list.length < 2) return;
    this.index = (this.index + delta + this.list.length) % this.list.length;
    const t = this.list[this.index];
    this.load(t);
    this.pushRoute(t.id, true);
  }

  load(t) {
    this.current = t;
    this.html = null;
    const set = (id, v) => { document.getElementById(id).textContent = v || '-'; };
    set('studio-cat', this.app.categoryName(t.category));
    set('studio-title', this.app.shortTitle(t.title));
    set('meta-path', t.raw_path);
    set('meta-date', t.date_formatted);
    set('meta-size', t.filesize_formatted);
    set('meta-header', t.header_pattern);
    set('meta-theme', t.theme);
    set('meta-desc', t.description);
    set('studio-pos', this.list.length > 1 ? `${this.index + 1} / ${this.list.length}` : '');
    document.getElementById('studio-prev').disabled = this.list.length < 2;
    document.getElementById('studio-next').disabled = this.list.length < 2;

    this.stage.classList.add('loading');
    this.frame.src = t.raw_path;
    if (this.view === 'code') this.renderCode();
  }

  // Thin gold scrollbar inside the preview, matching the studio
  styleFrame() {
    try {
      const doc = this.frame.contentDocument;
      if (!doc || doc.getElementById('studio-scroll')) return;
      const style = doc.createElement('style');
      style.id = 'studio-scroll';
      style.textContent = `
        html{scrollbar-width:thin;scrollbar-color:rgba(243,174,69,.5) transparent}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-thumb{background:rgba(243,174,69,.45);border-radius:9px;border:2px solid transparent;background-clip:padding-box}
        ::-webkit-scrollbar-track{background:transparent}`;
      (doc.head || doc.documentElement).appendChild(style);
      // Links inside emails should never navigate the preview itself
      doc.querySelectorAll('a[href]').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    } catch (e) { /* file:// keeps the frame cross-origin */ }
  }

  setDevice(device) {
    this.device.className = `device ${device}`;
    document.querySelectorAll('#device-switch [data-device]').forEach(b => {
      b.classList.toggle('active', b.dataset.device === device);
      b.setAttribute('aria-checked', b.dataset.device === device);
    });
    document.getElementById('device-width').textContent = DEVICE_LABELS[device];
    if (this.view === 'code') this.setView('preview');
  }

  setView(view) {
    this.view = view;
    document.querySelectorAll('#view-switch [data-view]').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
      b.setAttribute('aria-checked', b.dataset.view === view);
    });
    this.codeView.hidden = view !== 'code';
    this.device.style.visibility = view === 'code' ? 'hidden' : '';
    if (view === 'code') this.renderCode();
  }

  toggleInspector() {
    const narrow = window.matchMedia('(max-width: 980px)').matches;
    const cls = narrow ? 'show-inspector' : 'no-inspector';
    const nowHidden = narrow ? !this.el.classList.toggle(cls) : this.el.classList.toggle(cls);
    document.getElementById('studio-info-toggle').setAttribute('aria-pressed', String(!nowHidden));
  }

  async getHtml() {
    if (this.html) return this.html;
    try {
      const res = await fetch(this.current.raw_path);
      if (res.ok) return (this.html = await res.text());
    } catch (e) { /* fall through to the frame */ }
    try {
      const clone = this.frame.contentDocument.documentElement.cloneNode(true);
      clone.querySelector('#studio-scroll')?.remove();
      return (this.html = '<!DOCTYPE html>\n' + clone.outerHTML);
    } catch (e) {
      return '';
    }
  }

  async renderCode() {
    const forPath = this.current.raw_path;
    this.codeContent.innerHTML = '<span class="ln">Loading…</span>';
    const html = await this.getHtml();
    if (forPath !== this.current.raw_path) return;
    this.codeContent.innerHTML = html ? this.highlight(html) : '<span class="ln">Source is only available when the studio is served over http.</span>';
    this.codeView.scrollTop = 0;
  }

  // Small line-by-line HTML highlighter: comments, tag names, attributes and strings.
  // Works per line so every span closes on the line it opens, even for multi-line tags.
  highlight(src) {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const markup = s => s
      .replace(/([\w:-]+)=("[^"]*"|'[^']*')/g, '<span class="tok-attr">$1</span>=<span class="tok-str">$2</span>')
      .replace(/(&lt;\/?)([a-zA-Z][\w:-]*)/g, '<span class="tok-tag">$1$2</span>')
      .replace(/(\/?&gt;)/g, '<span class="tok-tag">$1</span>');
    let inComment = false;

    return src.split(/\r?\n/).map(raw => {
      let line = esc(raw);
      let out = '';
      while (line) {
        if (inComment) {
          const end = line.indexOf('--&gt;');
          if (end === -1) { out += `<span class="tok-com">${line}</span>`; line = ''; break; }
          out += `<span class="tok-com">${line.slice(0, end + 6)}</span>`;
          line = line.slice(end + 6);
          inComment = false;
        } else {
          const start = line.indexOf('&lt;!--');
          if (start === -1) { out += markup(line); line = ''; break; }
          out += markup(line.slice(0, start));
          line = line.slice(start);
          inComment = true;
        }
      }
      return `<span class="ln">${out || ' '}</span>`;
    }).join('');
  }

  async copy() {
    const html = await this.getHtml();
    if (!html) return this.app.toast('Copy needs the studio served over http');
    try {
      await navigator.clipboard.writeText(html);
    } catch (e) {
      const ta = Object.assign(document.createElement('textarea'), { value: html });
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    this.app.toast('HTML copied to clipboard');
  }

  async download() {
    const html = await this.getHtml();
    if (!html) return this.app.toast('Download needs the studio served over http');
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${this.current.id}.html` });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    this.app.toast(`Saved ${this.current.id}.html`);
  }

  async copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set('preview', this.current.id);
    try {
      await navigator.clipboard.writeText(url.toString());
      this.app.toast('Link copied');
    } catch (e) {
      this.app.toast(url.toString());
    }
  }

  pushRoute(id, replace = false) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('preview', id);
    else url.searchParams.delete('preview');
    url.searchParams.delete('id');
    const method = replace || (id && new URLSearchParams(window.location.search).has('preview')) ? 'replaceState' : 'pushState';
    history[method](null, '', url);
  }
}

window.StudioPreview = StudioPreview;
