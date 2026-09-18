/**
 * preview.js · Multi-Device Interactive Preview & Code Inspector
 * Manages isolated iframe rendering, viewport switching, and code actions
 */

class StudioPreviewController {
  constructor() {
    this.currentTemplate = null;
    this.currentHtmlContent = null;
    this.activeDevice = 'desktop'; // 'desktop' | 'tablet' | 'mobile'

    // DOM Elements
    this.modalBackdrop = document.getElementById('studio-modal');
    this.modalTitle = document.getElementById('studio-modal-title');
    this.modalCategory = document.getElementById('studio-modal-category');
    this.modalPath = document.getElementById('studio-modal-path');
    this.deviceFrame = document.getElementById('viewport-device-frame');
    this.widthIndicator = document.getElementById('frame-width-indicator');
    this.iframe = document.getElementById('studio-iframe');
    this.metaSize = document.getElementById('studio-meta-size');
    this.metaPattern = document.getElementById('studio-meta-pattern');

    // Code Modal Elements
    this.codeModal = document.getElementById('code-modal');
    this.codeTitle = document.getElementById('code-modal-title');
    this.codeContainer = document.getElementById('code-view-container');

    // Guidelines Modal Elements
    this.standardsModal = document.getElementById('standards-modal');

    this.initEventListeners();
  }

  initEventListeners() {
    // Device viewport toggles
    document.querySelectorAll('[data-device]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const device = btn.getAttribute('data-device');
        this.setDeviceViewport(device);
      });
    });

    // Close preview modal
    document.getElementById('studio-close-btn')?.addEventListener('click', () => this.closePreview());
    this.modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop) this.closePreview();
    });

    // Action buttons inside preview modal
    document.getElementById('studio-copy-btn')?.addEventListener('click', () => this.copyCurrentHtml());
    document.getElementById('studio-code-btn')?.addEventListener('click', () => this.viewCurrentSource());
    document.getElementById('studio-download-btn')?.addEventListener('click', () => this.downloadCurrentHtml());
    document.getElementById('studio-tab-btn')?.addEventListener('click', () => this.openInNewTab());

    // Code modal close
    document.getElementById('code-close-btn')?.addEventListener('click', () => this.closeCodeModal());
    document.getElementById('code-copy-btn')?.addEventListener('click', () => this.copyCurrentHtml());
    this.codeModal?.addEventListener('click', (e) => {
      if (e.target === this.codeModal) this.closeCodeModal();
    });

    // Guidelines modal close
    document.getElementById('standards-close-btn')?.addEventListener('click', () => this.closeStandardsModal());
    this.standardsModal?.addEventListener('click', (e) => {
      if (e.target === this.standardsModal) this.closeStandardsModal();
    });

    // Global keyboard listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.codeModal?.classList.contains('open')) {
          this.closeCodeModal();
        } else if (this.standardsModal?.classList.contains('open')) {
          this.closeStandardsModal();
        } else if (this.modalBackdrop?.classList.contains('open')) {
          this.closePreview();
        }
      }
    });
  }

  openPreview(template) {
    if (!template) return;
    this.currentTemplate = template;
    this.currentHtmlContent = null;

    // Update Header Metadata
    if (this.modalTitle) this.modalTitle.textContent = template.title;
    if (this.modalCategory) this.modalCategory.textContent = template.category;
    if (this.modalPath) this.modalPath.textContent = template.raw_path;
    if (this.metaSize) this.metaSize.textContent = template.filesize_formatted;
    if (this.metaPattern) this.metaPattern.textContent = template.header_pattern;

    // Reset device to desktop
    this.setDeviceViewport('desktop');

    // Load template file in isolated iframe with custom botanical scrollbar
    if (this.iframe) {
      this.iframe.classList.add('loading');
      
      const onIframeReady = () => {
        this.injectIframeScrollbar();
        setTimeout(() => {
          this.injectIframeScrollbar();
          this.iframe.classList.remove('loading');
        }, 60);
      };

      this.iframe.onload = onIframeReady;
      // Clear first to trigger clean render
      this.iframe.removeAttribute('srcdoc');
      this.iframe.src = 'about:blank';
      setTimeout(() => {
        this.iframe.src = template.file;
      }, 40);
    }

    // Pre-fetch raw HTML: enables zero-flicker styled srcdoc & clean copy/view actions
    this.fetchAndApplyTemplateHtml(template.file);

    // Open Modal
    this.modalBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.modalBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
    if (this.iframe) {
      this.iframe.removeAttribute('srcdoc');
      this.iframe.src = 'about:blank';
    }
  }

  setDeviceViewport(device) {
    this.activeDevice = device;
    if (!this.deviceFrame) return;

    this.deviceFrame.classList.remove('desktop', 'tablet', 'mobile');
    this.deviceFrame.classList.add(device);

    document.querySelectorAll('[data-device]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-device') === device);
    });

    if (this.widthIndicator) {
      const dimensions = {
        desktop: '720px (Desktop)',
        tablet: '560px (@media Breakpoint)',
        mobile: '375px (Mobile Phone)'
      };
      this.widthIndicator.textContent = dimensions[device] || device;
    }
  }

  async fetchAndApplyTemplateHtml(fileUrl) {
    try {
      const res = await fetch(fileUrl);
      if (res.ok) {
        const rawHtml = await res.text();
        this.currentHtmlContent = rawHtml;

        // Populate srcdoc with pre-injected custom scrollbar for immediate rendering
        if (this.iframe) {
          const styledHtml = this.injectScrollbarIntoHtmlString(rawHtml);
          this.iframe.srcdoc = styledHtml;
          setTimeout(() => {
            this.iframe.classList.remove('loading');
          }, 80);
        }
      }
    } catch (e) {
      console.warn('Could not prefetch raw HTML via fetch, fallback to iframe src:', e);
    }
  }

  injectScrollbarIntoHtmlString(htmlString) {
    const scrollStyle = this.getCustomScrollbarCss();
    const styleTag = `\n<style id="sundarbans-custom-scroll">\n${scrollStyle}\n</style>\n`;
    if (htmlString.includes('</head>')) {
      return htmlString.replace('</head>', `${styleTag}</head>`);
    } else if (htmlString.includes('<body')) {
      return htmlString.replace('<body', `<head>${styleTag}</head><body`);
    }
    return styleTag + htmlString;
  }

  injectIframeScrollbar() {
    try {
      const doc = this.iframe?.contentDocument || this.iframe?.contentWindow?.document;
      if (!doc) return;

      const styleId = 'sundarbans-custom-scroll';
      let style = doc.getElementById(styleId);
      if (!style) {
        style = doc.createElement('style');
        style.id = styleId;
        (doc.head || doc.body || doc.documentElement).appendChild(style);
      }
      style.textContent = this.getCustomScrollbarCss();
    } catch (err) {
      // Handled via srcdoc injection
    }
  }

  getCustomScrollbarCss() {
    return `
      /* Sundarbans Studio Custom Preview Scrollbar · Minimal Dark Botanical */
      html, body {
        scrollbar-width: thin !important;
        scrollbar-color: rgba(243, 174, 69, 0.45) #121815 !important;
      }

      ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
        background-color: #121815 !important;
      }

      ::-webkit-scrollbar-button {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      ::-webkit-scrollbar-track,
      ::-webkit-scrollbar-track-piece {
        background: #121815 !important;
        border-radius: 0 !important;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(243, 174, 69, 0.38) !important;
        border-radius: 9999px !important;
        border: 2px solid #121815 !important;
        min-height: 40px !important;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgba(243, 174, 69, 0.85) !important;
      }

      ::-webkit-scrollbar-thumb:active {
        background: #F3AE45 !important;
      }

      ::-webkit-scrollbar-corner {
        background: #121815 !important;
      }
    `;
  }

  async getHtmlContent() {
    if (this.currentHtmlContent) return this.currentHtmlContent;
    try {
      if (this.currentTemplate?.file) {
        const res = await fetch(this.currentTemplate.file);
        if (res.ok) {
          this.currentHtmlContent = await res.text();
          return this.currentHtmlContent;
        }
      }
      if (this.iframe?.contentDocument?.documentElement) {
        const clone = this.iframe.contentDocument.documentElement.cloneNode(true);
        clone.querySelector('#sundarbans-custom-scroll')?.remove();
        return '<!DOCTYPE html>\n' + clone.outerHTML;
      }
    } catch (e) {
      console.error('Failed to retrieve HTML content:', e);
    }
    return '';
  }

  async copyCurrentHtml() {
    const html = await this.getHtmlContent();
    if (!html) {
      window.app?.showToast('Unable to copy HTML content', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(html);
      window.app?.showToast('HTML template copied to clipboard!');
    } catch (err) {
      // Fallback copy
      const ta = document.createElement('textarea');
      ta.value = html;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      window.app?.showToast('HTML template copied to clipboard!');
    }
  }

  async viewCurrentSource() {
    const html = await this.getHtmlContent();
    if (!html) {
      window.app?.showToast('Could not load source code', 'error');
      return;
    }

    if (this.codeTitle) {
      this.codeTitle.textContent = `${this.currentTemplate.title} · HTML Source`;
    }

    if (this.codeContainer) {
      this.codeContainer.textContent = html;
    }

    this.codeModal?.classList.add('open');
  }

  closeCodeModal() {
    this.codeModal?.classList.remove('open');
  }

  openStandardsModal() {
    this.standardsModal?.classList.add('open');
  }

  closeStandardsModal() {
    this.standardsModal?.classList.remove('open');
  }

  async downloadCurrentHtml() {
    const html = await this.getHtmlContent();
    if (!html || !this.currentTemplate) return;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentTemplate.id || 'email-template'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.app?.showToast(`Downloaded ${this.currentTemplate.id}.html`);
  }

  openInNewTab() {
    if (this.currentTemplate?.file) {
      window.open(this.currentTemplate.file, '_blank');
    }
  }
}

window.StudioPreviewController = StudioPreviewController;
