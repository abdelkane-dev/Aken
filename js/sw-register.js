// Aken — Service Worker Registration + PWA Install Prompt
(function () {
  'use strict';

  // ═══════════════════════════════════════
  // 1. REGISTER SERVICE WORKER
  // ═══════════════════════════════════════
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js')
        .then(function (reg) {
          console.log('[Aken] SW registered, scope:', reg.scope);

          // Check for updates
          reg.addEventListener('updatefound', function () {
            var newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', function () {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  showUpdateBanner();
                }
              });
            }
          });
        })
        .catch(function (err) {
          console.warn('[Aken] SW registration failed:', err);
        });

      // Listen for SW messages
      navigator.serviceWorker.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          showUpdateBanner();
        }
      });
    });
  }

  // ═══════════════════════════════════════
  // 2. PWA INSTALL PROMPT
  // ═══════════════════════════════════════
  var deferredPrompt = null;
  var installBanner = null;
  var INSTALL_DISMISSED_KEY = 'aken-install-dismissed';

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;

    var dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (dismissed) return;

    setTimeout(function () {
      if (deferredPrompt) {
        showInstallBanner();
      }
    }, 45000);
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    removeInstallBanner();
    console.log('[Aken] App installed successfully');
  });

  function showInstallBanner() {
    if (installBanner) return;

    installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.innerHTML = [
      '<div class="pwa-banner-content">',
      '  <div class="pwa-banner-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg></div>',
      '  <div class="pwa-banner-text">',
      '    <strong>Installer Aken sur votre téléphone</strong>',
      '    <span>Accédez rapidement, même hors ligne</span>',
      '  </div>',
      '  <div class="pwa-banner-actions">',
      '    <button class="pwa-install-btn">Installer</button>',
      '    <button class="pwa-dismiss-btn">Plus tard</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = [
      '#pwa-install-banner {',
      '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;',
      '  background: var(--surface, #1A1924); border-top: 2px solid var(--teal, #4FC3BB);',
      '  padding: 14px 24px; box-shadow: 0 -6px 24px rgba(0,0,0,0.3);',
      '  transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);',
      '  font-family: var(--display-font, "Segoe UI", system-ui, sans-serif);',
      '}',
      '#pwa-install-banner.show { transform: translateY(0); }',
      '.pwa-banner-content { display: flex; align-items: center; gap: 16px; max-width: 900px; margin: 0 auto; flex-wrap: wrap; }',
      '.pwa-banner-icon { color: var(--teal); }',
      '.pwa-banner-text { flex: 1; min-width: 200px; }',
      '.pwa-banner-text strong { display: block; font-size: 0.95rem; color: var(--ink, #F0E6D2); }',
      '.pwa-banner-text span { font-size: 0.82rem; color: var(--ink-soft, #C9BC9C); }',
      '.pwa-banner-actions { display: flex; gap: 10px; }',
      '.pwa-install-btn {',
      '  padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;',
      '  background: var(--teal, #4FC3BB); color: var(--paper, #14131A);',
      '  font-weight: 700; font-size: 0.88rem; transition: opacity 0.2s;',
      '}',
      '.pwa-install-btn:hover { opacity: 0.9; }',
      '.pwa-dismiss-btn {',
      '  padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border, rgba(240,230,210,0.14));',
      '  background: transparent; color: var(--ink-soft, #C9BC9C); cursor: pointer;',
      '  font-size: 0.85rem; transition: border-color 0.2s;',
      '}',
      '.pwa-dismiss-btn:hover { border-color: var(--teal, #4FC3BB); }',
      '@media (max-width: 640px) {',
      '  #pwa-install-banner { padding: 12px 16px; }',
      '  .pwa-banner-content { gap: 12px; }',
      '  .pwa-banner-actions { width: 100%; justify-content: flex-end; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
    document.body.appendChild(installBanner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        installBanner.classList.add('show');
      });
    });

    installBanner.querySelector('.pwa-install-btn').addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          console.log('[Aken] Install choice:', choice.outcome);
          deferredPrompt = null;
          removeInstallBanner();
        });
      }
    });

    installBanner.querySelector('.pwa-dismiss-btn').addEventListener('click', function () {
      localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
      removeInstallBanner();
    });
  }

  function removeInstallBanner() {
    if (installBanner) {
      installBanner.classList.remove('show');
      setTimeout(function () {
        if (installBanner && installBanner.parentNode) {
          installBanner.parentNode.removeChild(installBanner);
        }
        installBanner = null;
      }, 400);
    }
  }

  // ═══════════════════════════════════════
  // 3. UPDATE BANNER
  // ═══════════════════════════════════════
  function showUpdateBanner() {
    var existing = document.getElementById('pwa-update-banner');
    if (existing) return;

    var banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.innerHTML = [
      '<div class="pwa-banner-content">',
      '  <div class="pwa-banner-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg></div>',
      '  <div class="pwa-banner-text">',
      '    <strong>Mise à jour disponible</strong>',
      '    <span>Une nouvelle version du site est prête</span>',
      '  </div>',
      '  <div class="pwa-banner-actions">',
      '    <button class="pwa-update-btn">Mettre à jour</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    var style = document.createElement('style');
    style.textContent = [
      '#pwa-update-banner {',
      '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;',
      '  background: var(--surface, #1A1924); border-top: 2px solid var(--ochre, #D9A441);',
      '  padding: 14px 24px; box-shadow: 0 -6px 24px rgba(0,0,0,0.3);',
      '  transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);',
      '  font-family: var(--display-font, "Segoe UI", system-ui, sans-serif);',
      '}',
      '#pwa-update-banner.show { transform: translateY(0); }',
      '.pwa-update-btn {',
      '  padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;',
      '  background: var(--ochre, #D9A441); color: var(--paper, #14131A);',
      '  font-weight: 700; font-size: 0.88rem;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('show');
      });
    });

    banner.querySelector('.pwa-update-btn').addEventListener('click', function () {
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
      });
    });
  }
})();
