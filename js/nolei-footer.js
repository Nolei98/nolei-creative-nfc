/**
 * ==============================================================================
 * NOLEI CREATIVE — SHARED MODULAR FOOTER COMPONENT
 * Footer institucional padronizado para todas as páginas internas da plataforma.
 * Conecta todas as páginas ao portfólio oficial do criador:
 * https://portfolio-jr-lilac.vercel.app/
 * ==============================================================================
 */

(function() {
  'use strict';

  const PORTFOLIO_URL = 'https://portfolio-jr-lilac.vercel.app/';
  const WHATSAPP_URL = 'https://wa.me/5587999099937?text=Ol%C3%A1!%20Gostaria%20de%20um%20projeto%20personalizado%20com%20a%20GetKoda.'; 

  const footerStyle = `
    .nolei-unified-footer {
      background: #0A0A0C;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 32px 20px 36px;
      color: #A2937E;
      font-size: 0.82rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      width: 100%;
      margin-top: auto;
      box-sizing: border-box;
    }
    .nolei-unified-footer * {
      box-sizing: border-box;
    }
    .nolei-footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
    }
    .nolei-footer-brand {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nolei-footer-creator-link {
      color: #F2EADF;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: color 0.15s ease;
    }
    .nolei-footer-creator-link span {
      color: #0055FF;
    }
    .nolei-footer-creator-link:hover {
      color: #0055FF;
    }
    .nolei-footer-sub {
      color: #6E6355;
      font-size: 0.74rem;
      font-family: 'Inter', sans-serif;
    }
    .nolei-footer-nav {
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
      font-size: 0.8rem;
    }
    .nolei-footer-nav a {
      color: #A2937E;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .nolei-footer-nav a:hover {
      color: #F2EADF;
    }
    .nolei-footer-nav a.highlight {
      color: #0055FF;
      font-weight: 600;
    }
    .nolei-footer-nav a.highlight:hover {
      color: #38BDF8;
    }
  `;

  function renderFooterHtml() {
    return `
      <div class="nolei-footer-container">
        <div class="nolei-footer-brand">
          <div>
            Desenvolvido por 
            <a href="${PORTFOLIO_URL}" target="_blank" rel="noopener noreferrer" class="nolei-footer-creator-link" title="Acessar portfólio oficial do desenvolvedor">
              GetKoda <span style="background:linear-gradient(90deg, #38BDF8 0%, #2DD4BF 50%, #A78BFA 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Phygital</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>
          <div class="nolei-footer-sub">
            Ecossistemas Físico-Digitais • Tecnologia NFC de Alta Performance
          </div>
        </div>

        <nav class="nolei-footer-nav" aria-label="Links institucionais do rodapé">
          <a href="/login">Login</a>
          <a href="/termos">Termos & LGPD</a>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">Entrar em contato</a>
          <a href="${PORTFOLIO_URL}" target="_blank" rel="noopener noreferrer" class="highlight">
            Portfólio do Criador →
          </a>
        </nav>
      </div>
    `;
  }

  function injectStyleOnce() {
    if (document.getElementById('nolei-footer-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'nolei-footer-styles';
    styleEl.textContent = footerStyle;
    document.head.appendChild(styleEl);
  }

  function mountFooter() {
    // Não renderiza em páginas de demonstração
    if (window.location.pathname.includes('/demo/') || window.location.pathname.startsWith('/demo')) return;
    injectStyleOnce();

    // 1. Elemento com ID explícito #nolei-footer
    let target = document.getElementById('nolei-footer');
    if (target) {
      target.className = 'nolei-unified-footer';
      target.innerHTML = renderFooterHtml();
      return;
    }

    // 2. Se a página já possui uma tag footer (exceto a home-page que tem classe .home-footer)
    const existingFooters = document.querySelectorAll('footer.footer, footer.site-footer');
    if (existingFooters.length > 0) {
      existingFooters.forEach(f => {
        if (!f.classList.contains('home-footer') && !f.closest('.hero')) {
          f.className = 'nolei-unified-footer';
          f.innerHTML = renderFooterHtml();
        }
      });
      return;
    }

    // 3. Se não houver footer existente, adiciona ao final do body
    const footerEl = document.createElement('footer');
    footerEl.id = 'nolei-footer';
    footerEl.className = 'nolei-unified-footer';
    footerEl.innerHTML = renderFooterHtml();
    document.body.appendChild(footerEl);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();
