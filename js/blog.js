// Aken — Blog Logic & Article Reader
(function () {
  "use strict";

  function getBlogIcon(key) {
    var icons = {
      rocket: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><path d="M24 4l8 4v8l-8 4-8-4V8z"/><path d="M16 16v8l8 4 8-4v-8"/><path d="M24 28v8"/></svg>',
      creditCard: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><rect x="4" y="8" width="40" height="32" rx="4"/><line x1="4" y1="20" x2="44" y2="20"/></svg>',
      satellite: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><circle cx="24" cy="24" r="4"/><path d="M32.48 15.52l-4.24 12.72-12.72 4.24 4.24-12.72z"/></svg>',
      building: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><rect x="8" y="4" width="32" height="40" rx="4"/><rect x="16" y="12" width="4" height="4"/><rect x="28" y="12" width="4" height="4"/></svg>',
      cloud2: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><path d="M36 20h-2.52A16 16 0 1018 40h18a10 10 0 000-20z"/></svg>',
      lock: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><rect x="6" y="22" width="36" height="22" rx="4"/><path d="M14 22V14a10 10 0 0120 0v8"/></svg>',
      phone: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><rect x="10" y="4" width="28" height="40" rx="4"/><line x1="24" y1="36" x2="24" y2="36.01"/></svg>',
      barChart: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48" opacity="0.6"><line x1="24" y1="40" x2="24" y2="20"/><line x1="36" y1="40" x2="36" y2="8"/><line x1="12" y1="40" x2="12" y2="32"/></svg>'
    };
    return icons[key] || icons.rocket;
  }

  var ARTICLES = [
    {
      id: 1,
      slug: "automatiser-business-mali",
      title: "Comment automatiser et digitaliser votre entreprise au Mali avec des solutions sur-mesure",
      excerpt: "Découvrez comment les solutions digitales et logicielles sur-mesure peuvent transformer votre entreprise au Mali : gains de temps, réduction des erreurs et croissance des ventes.",
      category: "Entrepreneurs",
      date: "2026-08-20",
      readTime: 6,
      icon: "rocket",
      content: `
        <h2>Le défi de la gestion manuelle au Mali</h2>
        <p>De nombreuses entreprises à Bamako et dans les régions continuent de gérer leurs opérations sur papier, carnets physiques ou feuilles Excel dispersées. Cette méthode entraîne des erreurs fréquentes, des pertes d'informations et ralentit considérablement la prise de décision.</p>
        
        <h2>Pourquoi choisir une application sur-mesure ?</h2>
        <p>Contrairement aux logiciels génériques souvent rigides et inadaptés aux spécificités locales (modes de paiement locaux, coupures réseau, gestion multi-utilisateurs sur mobile), une application sur-mesure s'adapte précisément à votre façon de travailler.</p>
        
        <ul>
          <li><strong>Gain de temps massif :</strong> Automatisation des factures, relances clients et rapports journaliers.</li>
          <li><strong>Disponibilité hors-ligne :</strong> Capacité à continuer à enregistrer les transactions même sans connexion stable.</li>
          <li><strong>Intégration mobile money :</strong> Réception directe des règlements via Wave et Orange Money.</li>
        </ul>

        <blockquote>« L'automatisation n'est pas un luxe réservé aux grandes multinationales : au Mali, c'est le levier le plus rapide pour doubler la productivité d'une PME. »</blockquote>

        <h2>Par où commencer votre transformation ?</h2>
        <p>Commencez par identifier le goulot d'étranglement qui vous fait perdre le plus de temps chaque semaine (ex : facturation, suivi de stock ou gestion des réservations), et construisez une première version ciblée.</p>
      `
    },
    {
      id: 2,
      slug: "paiement-mobile-mali",
      title: "Paiement mobile au Mali : intégrer Wave et Orange Money dans votre application",
      excerpt: "Guide pratique pour intégrer les solutions de paiement mobile populaires au Mali dans votre application web ou mobile.",
      category: "Technique",
      date: "2026-08-15",
      readTime: 8,
      icon: "creditCard",
      content: `
        <h2>L'omniprésence du Mobile Money en Afrique de l'Ouest</h2>
        <p>Au Mali et dans l'UEMOA, plus de 80% des transactions numériques passent par Wave, Orange Money ou Moov Money. Proposer uniquement la carte bancaire exclut la quasi-totalité de vos clients potentiels.</p>

        <h2>Comment intégrer ces paiements dans votre code ?</h2>
        <p>Deux approches principales existent pour brancher les paiements mobiles :</p>
        <ol>
          <li><strong>Passerelles unifiées (CinetPay, PayDunya, TouchPay) :</strong> Une seule API permet d'encaisser Wave, Orange Money et Moov avec gestion automatisée des webhooks de notification.</li>
          <li><strong>APIs directes des opérateurs :</strong> Idéal pour les gros volumes, nécessitant un accord marchand préalable.</li>
        </ol>

        <h2>Bonnes pratiques de sécurité</h2>
        <p>Vérifiez toujours le statut de la transaction côté serveur via un webhook sécurisé par clé secrète ou HMAC avant de livrer un produit ou d'activer un compte utilisateur.</p>
      `
    },
    {
      id: 3,
      slug: "app-connexion-lente",
      title: "Développer une application qui fonctionne sur connexion lente au Mali",
      excerpt: "Techniques et bonnes pratiques pour concevoir des applications performantes même sur réseau 3G/4G limité.",
      category: "Technique",
      date: "2026-08-10",
      readTime: 7,
      icon: "satellite",
      content: `
        <h2>La réalité du réseau : concevoir Mobile-First & Offline-Ready</h2>
        <p>La bande passante peut être intermittente à Bamako et plus encore à l'intérieur du pays. Développer une application moderne pour le Mali exige une discipline stricte sur la taille des bundles et la tolérance aux coupures.</p>

        <h2>Les 4 piliers d'une application résiliente</h2>
        <ul>
          <li><strong>Service Workers & Cache :</strong> Mise en cache de l'App Shell pour un affichage instantané même hors ligne.</li>
          <li><strong>IndexedDB local :</strong> Sauvegarde locale des requêtes en attente et synchronisation en arrière-plan (Background Sync).</li>
          <li><strong>Optimisation des assets :</strong> Utilisation de formats modernes (WebP, SVG) et typographies système ou légères.</li>
          <li><strong>Payloads JSON compressés :</strong> Réduire la taille des échanges API au strict nécessaire.</li>
        </ul>
      `
    },
    {
      id: 4,
      slug: "papier-vers-logiciel",
      title: "Passer du papier au logiciel : cas d'une hôtellerie à Bamako",
      excerpt: "Retour d'expérience concret : comment un hôtel à Bamako a gagné 3 heures par jour en digitalisant ses réservations.",
      category: "Études de cas",
      date: "2026-08-05",
      readTime: 5,
      icon: "building",
      content: `
        <h2>La situation initiale</h2>
        <p>L'établissement utilisait un registre papier à la réception et un tableau Excel non partagé. Les doubles réservations arrivaient chaque mois et le calcul des taux d'occupation prenait des heures à la fin du mois.</p>

        <h2>La solution déployée par Aken</h2>
        <p>Mise en place d'une application web centralisée avec backend Django et base de données PostgreSQL, accessible sur tablette à la réception et sur le smartphone du gérant.</p>

        <h2>Les résultats après 60 jours</h2>
        <ul>
          <li><strong>Zéro double-réservation</strong> constatée.</li>
          <li><strong>3 heures économisées par jour</strong> sur le traitement administratif et les relances.</li>
          <li>Tableau de bord financier automatique disponible en 1 clic.</li>
        </ul>
      `
    },
    {
      id: 5,
      slug: "cloud-vs-vps-mali",
      title: "Cloud vs VPS : quelle solution d'hébergement pour une startup au Mali ?",
      excerpt: "Comparatif des options d'hébergement adaptées au contexte africain : coûts, performance et fiabilité.",
      category: "Infrastructure",
      date: "2026-07-28",
      readTime: 6,
      icon: "cloud2",
      content: `
        <h2>Comprendre les coûts réels de l'hébergement</h2>
        <p>Pour une entreprise ou startup locale, les géants du Cloud comme AWS ou Azure peuvent rapidement générer des factures imprévisibles en devises étrangères (dollars/euros).</p>

        <h2>VPS Linux optimisé : le meilleur rapport qualité/prix</h2>
        <p>Un VPS bien configuré (Ubuntu, Docker, Nginx, certificat SSL Let's Encrypt automatique) permet de faire tourner des dizaines de milliers de requêtes par jour pour un coût mensuel fixe et maîtrisé (dès 5 à 15€/mois).</p>
      `
    },
    {
      id: 6,
      slug: "securiser-donnees-mali",
      title: "Sécuriser vos données au Mali : guide pratique pour les PME",
      excerpt: "Les bases de la cybersécurité pour protéger les données de votre entreprise contre les menaces courantes.",
      category: "Sécurité",
      date: "2026-07-20",
      readTime: 7,
      icon: "lock",
      content: `
        <h2>Les risques réels pour les entreprises locales</h2>
        <p>Les cyberattaques ne visent pas que les grandes banques : perte de données clients, piratage d'e-mails professionnels et rançongiciels touchent quotidiennement les PME non préparées.</p>

        <h2>5 mesures simples et immédiates</h2>
        <ol>
          <li>Activer systématiquement la double authentification (2FA).</li>
          <li>Mettre en place des sauvegardes automatisées chiffrées hors site.</li>
          <li>Forcer le HTTPS et les certificats TLS à jour.</li>
          <li>Chiffrer les mots de passe avec des algorithmes robustes (bcrypt/argon2).</li>
          <li>Sensibiliser l'équipe aux arnaques par hameçonnage (phishing WhatsApp/Email).</li>
        </ol>
      `
    },
    {
      id: 7,
      slug: "pwa-vs-app-native",
      title: "PWA vs Application native : quel choix pour votre projet au Mali ?",
      excerpt: "Avantages et inconvénients de chaque approche dans le contexte spécifique du marché malien.",
      category: "Technique",
      date: "2026-07-15",
      readTime: 5,
      icon: "phone",
      content: `
        <h2>Qu'est-ce qu'une PWA (Progressive Web App) ?</h2>
        <p>Une PWA est un site web qui s'installe comme une application sur l'écran d'accueil du smartphone de l'utilisateur, fonctionne hors ligne et envoie des notifications, sans nécessiter de téléchargement lourd depuis le Play Store ou l'App Store.</p>

        <h2>Pourquoi la PWA est particulièrement pertinente au Mali ?</h2>
        <p>Les utilisateurs hésitent souvent à télécharger des applications de 50 Mo sur le Play Store pour préserver leur forfait internet. Une PWA pèse moins de 1 Mo et s'installe en 2 secondes.</p>
      `
    },
    {
      id: 8,
      slug: "ingenierie-donnees-excel",
      title: "Ingénierie des données : transformer vos Excel en tableaux de bord intelligents",
      excerpt: "Comment passer de feuilles de calcul dispersées à un système de données centralisé et utile pour vos décisions.",
      category: "Data",
      date: "2026-07-10",
      readTime: 8,
      icon: "barChart",
      content: `
        <h2>La limite d'Excel dans la croissance d'une entreprise</h2>
        <p>Excel est un excellent outil de démarrage, mais dès que plusieurs collaborateurs l'éditent simultanément, les versions se décalent, les formules se cassent et la sécurité des données devient inexistante.</p>

        <h2>La transition vers une base de données centralisée</h2>
        <p>En migrant vos fichiers vers une base relationnelle (PostgreSQL / MySQL) avec des pipelines automatisés, vous obtenez des tableaux de bord en temps réel, fiables et consultables sur smartphone à tout moment.</p>
      `
    }
  ];

  var currentPage = 1;
  var articlesPerPage = 6;
  var currentFilter = "all";

  function getArticlesHTML() {
    var filtered = currentFilter === "all" ? ARTICLES : ARTICLES.filter(function (a) { return a.category === currentFilter; });
    var start = (currentPage - 1) * articlesPerPage;
    var paged = filtered.slice(start, start + articlesPerPage);
    var totalPages = Math.ceil(filtered.length / articlesPerPage);

    var html = "";
    paged.forEach(function (article) {
      var dateFormatted = new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      html += '<article class="blog-card" data-category="' + article.category + '" data-id="' + article.id + '">';
      html += '  <div class="blog-card-image">' + getBlogIcon(article.icon) + '</div>';
      html += '  <div class="blog-card-body">';
      html += '    <div class="blog-card-meta">';
      html += '      <span class="blog-card-category">' + article.category + '</span>';
      html += '      <span class="blog-card-date">' + dateFormatted + '</span>';
      html += '    </div>';
      html += '    <h3>' + article.title + '</h3>';
      html += '    <p>' + article.excerpt + '</p>';
      html += '    <div class="blog-card-footer">';
      html += '      <a href="#article-' + article.id + '" class="blog-card-read" data-read-id="' + article.id + '">Lire l\'article →</a>';
      html += '      <span class="blog-card-time">' + article.readTime + ' min</span>';
      html += '    </div>';
      html += '  </div>';
      html += '</article>';
    });

    return { html: html, totalPages: totalPages };
  }

  function createReaderModal() {
    var modal = document.getElementById("blog-reader-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "blog-reader-modal";
    modal.className = "blog-reader-overlay";
    modal.innerHTML = [
      '<div class="blog-reader-content">',
      '  <button class="blog-reader-close" aria-label="Fermer l\'article">&times;</button>',
      '  <div id="blog-reader-body" class="blog-article-content"></div>',
      '  <div class="blog-article-cta">',
      '    <h3>Vous avez un projet similaire ?</h3>',
      '    <p>Contactez l\'équipe Aken pour concevoir votre solution sur-mesure.</p>',
      '    <a href="index.html#devis" class="btn btn-primary">Demander un devis gratuit →</a>',
      '  </div>',
      '</div>'
    ].join("\n");

    var style = document.createElement("style");
    style.textContent = [
      '.blog-reader-overlay {',
      '  position: fixed; inset: 0; z-index: 600;',
      '  background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);',
      '  display: flex; align-items: flex-start; justify-content: center;',
      '  opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;',
      '  overflow-y: auto; padding: 40px 16px;',
      '}',
      '.blog-reader-overlay.active { opacity: 1; visibility: visible; }',
      '.blog-reader-content {',
      '  background: var(--surface, #FFFDF8); border: 2px solid var(--teal, #2E8B85);',
      '  border-radius: var(--radius-lg, 16px); padding: 40px 36px; max-width: 780px; width: 100%;',
      '  position: relative; box-shadow: 0 16px 48px rgba(0,0,0,0.3); color: var(--ink);',
      '}',
      '.blog-reader-close {',
      '  position: absolute; top: 16px; right: 20px; background: none; border: none;',
      '  font-size: 2rem; color: var(--ink-soft); cursor: pointer; line-height: 1;',
      '}',
      '.blog-reader-close:hover { color: var(--teal); }',
      '@media (max-width: 640px) {',
      '  .blog-reader-overlay { padding: 16px 8px; }',
      '  .blog-reader-content { padding: 24px 18px; }',
      '}'
    ].join("\n");

    document.head.appendChild(style);
    document.body.appendChild(modal);

    modal.querySelector(".blog-reader-close").addEventListener("click", closeReader);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeReader();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeReader();
      }
    });

    return modal;
  }

  function openArticle(articleId) {
    var article = ARTICLES.find(function (a) { return a.id === parseInt(articleId, 10); });
    if (!article) return;

    var modal = createReaderModal();
    var body = document.getElementById("blog-reader-body");
    var dateFormatted = new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    body.innerHTML = [
      '<div class="blog-article-meta" style="display:flex;gap:12px;margin-bottom:16px;font-family:var(--mono-font);font-size:0.85rem;color:var(--teal);">',
      '  <span>' + article.category + '</span> • <span>' + dateFormatted + '</span> • <span>' + article.readTime + ' min de lecture</span>',
      '</div>',
      '<h1 style="font-size:clamp(1.6rem, 3.5vw, 2.2rem);margin-bottom:24px;line-height:1.2;">' + article.title + '</h1>',
      article.content
    ].join("\n");

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeReader() {
    var modal = document.getElementById("blog-reader-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function renderBlog() {
    var grid = document.getElementById("blog-grid");
    var pagination = document.getElementById("blog-pagination");
    if (!grid) return;

    var result = getArticlesHTML();
    grid.innerHTML = result.html;

    if (pagination) {
      var paginationHTML = "";
      for (var i = 1; i <= result.totalPages; i++) {
        paginationHTML += '<button class="' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }
      pagination.innerHTML = paginationHTML;
    }
  }

  function init() {
    // Filter buttons
    document.querySelectorAll(".blog-filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentFilter = btn.getAttribute("data-filter");
        currentPage = 1;
        document.querySelectorAll(".blog-filter").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderBlog();
      });
    });

    // Pagination & Article clicks
    document.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-page")) {
        currentPage = parseInt(e.target.getAttribute("data-page"), 10);
        renderBlog();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      var readBtn = e.target.closest("[data-read-id]");
      if (readBtn) {
        e.preventDefault();
        openArticle(readBtn.getAttribute("data-read-id"));
      }
    });

    renderBlog();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
