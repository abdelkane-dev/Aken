// Aken 2.0 — Blog Engine, Search, Filter & Reader Modal 2.0
(function () {
  "use strict";

  // SVG Icons vectoriels stylisés pour chaque domaine
  function getBlogIcon(key) {
    var icons = {
      rocket: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 4c-6 4-10 14-10 24 0 5 2 9 4 12l6-4 6 4c2-3 4-7 4-12 0-10-4-20-10-24z"/><path d="M14 28l-8 4 3-8"/><path d="M34 28l8 4-3-8"/><circle cx="24" cy="18" r="4"/></svg>',
      creditCard: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="40" height="32" rx="4"/><line x1="4" y1="18" x2="44" y2="18"/><line x1="10" y1="28" x2="22" y2="28"/><circle cx="34" cy="28" r="3"/><circle cx="38" cy="28" r="3"/></svg>',
      satellite: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 32a24 24 0 0 1 32 0"/><path d="M14 36a16 16 0 0 1 20 0"/><circle cx="24" cy="40" r="2.5"/><path d="M24 8v16"/><path d="M18 12l6-6 6 6"/></svg>',
      building: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="6" width="32" height="38" rx="3"/><line x1="16" y1="14" x2="20" y2="14"/><line x1="28" y1="14" x2="32" y2="14"/><line x1="16" y1="22" x2="20" y2="22"/><line x1="28" y1="22" x2="32" y2="22"/><line x1="16" y1="30" x2="20" y2="30"/><line x1="28" y1="30" x2="32" y2="30"/><path d="M21 44v-6h6v6"/></svg>',
      cloud2: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M36 22h-2.2A14 14 0 0 0 8 26a10 10 0 0 0 4 18h24a10 10 0 0 0 0-20z"/><path d="M24 28v10"/><path d="M20 32l4-4 4 4"/></svg>',
      lock: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="20" width="32" height="24" rx="4"/><path d="M16 20V12a8 8 0 0 1 16 0v8"/><circle cx="24" cy="32" r="3"/><line x1="24" y1="35" x2="24" y2="39"/></svg>',
      phone: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="4" width="24" height="40" rx="4"/><line x1="20" y1="10" x2="28" y2="10"/><circle cx="24" cy="38" r="2"/></svg>',
      barChart: '<svg class="blog-card-icon-svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="42" x2="40" y2="42"/><rect x="12" y="22" width="6" height="20" rx="1"/><rect x="22" y="14" width="6" height="28" rx="1"/><rect x="32" y="6" width="6" height="36" rx="1"/><path d="M12 18l10-8 10 4 6-8"/></svg>'
    };
    return icons[key] || icons.rocket;
  }

  // Base des 8 Articles complets
  var ARTICLES = [
    {
      id: 1,
      slug: "automatiser-business-mali",
      title: "Comment automatiser et digitaliser votre entreprise au Mali avec des solutions sur-mesure",
      excerpt: "Découvrez comment les solutions digitales et logicielles sur-mesure transforment les entreprises à Bamako : élimination des erreurs de saisie, gains de temps colossaux et croissance rapide du chiffre d'affaires.",
      category: "Entrepreneurs",
      date: "2026-08-20",
      readTime: 6,
      icon: "rocket",
      cover: "assets/blog/cover-1.svg",
      featured: true,
      tags: ["#Automatisation", "#PME", "#Mali", "#Productivité"],
      content: `
        <h2>Le défi de la gestion manuelle au Mali</h2>
        <p>De nombreuses entreprises à Bamako et dans les régions continuent de gérer leurs opérations sur papier, carnets physiques ou feuilles Excel dispersées. Cette méthode entraîne des erreurs fréquentes, des pertes d'informations et ralentit considérablement la prise de décision.</p>
        
        <h2>Pourquoi choisir une application sur-mesure ?</h2>
        <p>Contrairement aux logiciels génériques souvent rigides et inadaptés aux spécificités locales (modes de paiement locaux, coupures réseau, gestion multi-utilisateurs sur mobile), une application sur-mesure s'adapte précisément à votre façon de travailler.</p>
        
        <ul>
          <li><strong>Gain de temps massif :</strong> Automatisation des factures, relances clients et rapports journaliers sans friction.</li>
          <li><strong>Disponibilité hors-ligne (Offline-First) :</strong> Capacité à continuer à enregistrer les transactions même sans connexion stable.</li>
          <li><strong>Intégration mobile money native :</strong> Réception directe et traçabilité des règlements via Wave et Orange Money.</li>
        </ul>

        <blockquote>« L'automatisation n'est pas un luxe réservé aux multinationales : au Mali, c'est le levier le plus accessible et le plus rapide pour doubler la rentabilité d'une PME. »</blockquote>

        <h2>Par où commencer votre transformation ?</h2>
        <p>Commencez par identifier le goulot d'étranglement qui vous fait perdre le plus de temps chaque semaine (ex : facturation, suivi de stock ou gestion des réservations), et construisez un MVP (Produit Minimum Viable) ciblée et évolutif.</p>
      `
    },
    {
      id: 2,
      slug: "paiement-mobile-mali",
      title: "Paiement mobile au Mali : intégrer Wave et Orange Money dans votre application",
      excerpt: "Guide technique et architectural pour brancher les APIs de paiement mobile indispensables en Afrique de l'Ouest : gestion des webhooks sécurisés, réconciliation et expérience utilisateur fluide.",
      category: "Technique",
      date: "2026-08-15",
      readTime: 8,
      icon: "creditCard",
      cover: "assets/blog/cover-2.svg",
      tags: ["#Wave", "#OrangeMoney", "#Fintech", "#APIs"],
      content: `
        <h2>L'omniprésence du Mobile Money en Afrique de l'Ouest</h2>
        <p>Au Mali et dans la zone UEMOA, plus de 80% des transactions numériques passent par Wave, Orange Money ou Moov Money. Proposer uniquement la carte bancaire exclut la quasi-totalité de vos clients potentiels.</p>

        <h2>Comment intégrer ces paiements dans votre code ?</h2>
        <p>Deux approches principales existent pour brancher les paiements mobiles :</p>
        <ol>
          <li><strong>Passerelles unifiées (CinetPay, PayDunya, TouchPay) :</strong> Une seule API permet d'encaisser Wave, Orange Money et Moov avec gestion automatisée des notifications webhooks.</li>
          <li><strong>APIs directes des opérateurs :</strong> Idéal pour les gros volumes, nécessitant un compte marchand agréé.</li>
        </ol>

        <h2>Bonnes pratiques de sécurité indispensables</h2>
        <p>Ne validez jamais une commande uniquement sur la confirmation renvoyée au frontend de l'utilisateur. Vérifiez toujours la signature cryptographique du webhook côté serveur via HMAC avant de valider un paiement.</p>
        <pre><code>// Exemple de validation de signature webhook
const crypto = require('crypto');
function verifySignature(payload, signature, secret) {
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}</code></pre>
      `
    },
    {
      id: 3,
      slug: "app-connexion-lente",
      title: "Développer une application qui fonctionne sur connexion lente au Mali",
      excerpt: "Techniques et patterns d'ingénierie logicielle pour concevoir des applications web & mobiles ultralégères, résilientes et réactives même sur un réseau 3G/4G intermittent.",
      category: "Technique",
      date: "2026-08-10",
      readTime: 7,
      icon: "satellite",
      cover: "assets/blog/cover-3.svg",
      tags: ["#Performance", "#Offline", "#ServiceWorker", "#WebP"],
      content: `
        <h2>La réalité du réseau : concevoir Mobile-First & Offline-Ready</h2>
        <p>La bande passante peut être intermittente à Bamako et plus encore à l'intérieur du pays. Développer une application moderne pour le Mali exige une discipline stricte sur la taille des bundles et la tolérance aux coupures.</p>

        <h2>Les 4 piliers d'une application résiliente</h2>
        <ul>
          <li><strong>Service Workers & Cache :</strong> Mise en cache de l'App Shell pour un affichage instantané même hors ligne.</li>
          <li><strong>IndexedDB local :</strong> Sauvegarde locale des requêtes en attente et synchronisation en arrière-plan (Background Sync).</li>
          <li><strong>Optimisation des assets :</strong> Utilisation de formats modernes (WebP, SVG) et polices WOFF2 locales.</li>
          <li><strong>Payloads JSON compressés :</strong> Réduire la taille des échanges API au strict nécessaire.</li>
        </ul>
      `
    },
    {
      id: 4,
      slug: "papier-vers-logiciel",
      title: "Passer du papier au logiciel : cas d'une hôtellerie à Bamako",
      excerpt: "Étude de cas réelle : comment un établissement hôtelier de Bamako a éliminé les surréservations et économisé plus de 3 heures par jour grâce à une application dédiée.",
      category: "Études de cas",
      date: "2026-08-05",
      readTime: 5,
      icon: "building",
      cover: "assets/blog/cover-4.svg",
      tags: ["#CaseStudy", "#Hotellerie", "#Django", "#PostgreSQL"],
      content: `
        <h2>La situation initiale</h2>
        <p>L'établissement utilisait un registre papier à la réception et un tableau Excel non partagé. Les doubles réservations arrivaient chaque mois et le calcul des taux d'occupation prenait des heures à la fin du mois.</p>

        <h2>La solution déployée par Aken</h2>
        <p>Mise en place d'une application web centralisée avec backend Django et base de données PostgreSQL, accessible sur tablette à la réception et sur le smartphone du gérant en temps réel.</p>

        <h2>Les résultats après 60 jours</h2>
        <ul>
          <li><strong>Zéro double-réservation</strong> constatée.</li>
          <li><strong>3 heures économisées par jour</strong> sur le traitement administratif et les relances clients.</li>
          <li>Tableau de bord financier automatique disponible en 1 clic.</li>
        </ul>
      `
    },
    {
      id: 5,
      slug: "cloud-vs-vps-mali",
      title: "Cloud vs VPS : quelle solution d'hébergement pour une startup au Mali ?",
      excerpt: "Comparatif pragmatique des options d'infrastructure : coûts cachés des géants du Cloud (AWS, Azure) versus la rentabilité imbattable d'un VPS Linux bien configuré.",
      category: "Infrastructure",
      date: "2026-07-28",
      readTime: 6,
      icon: "cloud2",
      cover: "assets/blog/cover-5.svg",
      tags: ["#DevOps", "#VPS", "#Cloud", "#Docker"],
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
      excerpt: "Les bases indispensables de la cybersécurité pour protéger les données confidentielles de votre entreprise, éviter les ransomwares et sensibiliser vos collaborateurs.",
      category: "Sécurité",
      date: "2026-07-20",
      readTime: 7,
      icon: "lock",
      cover: "assets/blog/cover-6.svg",
      tags: ["#Securite", "#2FA", "#Chiffrement", "#Sauvegarde"],
      content: `
        <h2>Les risques réels pour les entreprises locales</h2>
        <p>Les cyberattaques ne visent pas que les grandes banques : perte de données clients, piratage d'e-mails professionnels et rançongiciels touchent quotidiennement les PME non préparées.</p>

        <h2>5 mesures simples et immédiates</h2>
        <ol>
          <li>Activer systématiquement la double authentification (2FA) sur tous vos comptes clés.</li>
          <li>Mettre en place des sauvegardes automatisées chiffrées hors site (règle du 3-2-1).</li>
          <li>Forcer le HTTPS et des certificats TLS à jour.</li>
          <li>Chiffrer les mots de passe avec des algorithmes robustes (bcrypt/argon2).</li>
          <li>Sensibiliser l'équipe aux arnaques par hameçonnage (phishing WhatsApp/Email).</li>
        </ol>
      `
    },
    {
      id: 7,
      slug: "pwa-vs-app-native",
      title: "PWA vs Application native : quel choix pour votre projet au Mali ?",
      excerpt: "Analyse comparative approfondie : coût de développement, friction au téléchargement, consommation de données mobiles et taux de conversion en contexte africain.",
      category: "Technique",
      date: "2026-07-15",
      readTime: 5,
      icon: "phone",
      cover: "assets/blog/cover-7.svg",
      tags: ["#PWA", "#Mobile", "#WebApps", "#Android"],
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
      excerpt: "Comment passer de fichiers Excel dispersés et corrompus à une base de données relationnelle centralisée avec visualisations interactives accessibles 24h/24.",
      category: "Data",
      date: "2026-07-10",
      readTime: 8,
      icon: "barChart",
      cover: "assets/blog/cover-8.svg",
      tags: ["#Data", "#Analytics", "#BusinessIntelligence", "#SQL"],
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
  var currentSearchQuery = "";

  // Toast Notification System
  function showBlogToast(message, icon) {
    var container = document.getElementById("blog-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "blog-toast-container";
      container.className = "blog-toast-container";
      document.body.appendChild(container);
    }

    var toast = document.createElement("div");
    toast.className = "blog-toast";
    toast.innerHTML = '<span style="font-size:1.1rem;">' + (icon || '⚡') + '</span><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("toast-out");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // Filtrage et recherche dynamique
  function getFilteredArticles() {
    return ARTICLES.filter(function (a) {
      var matchCategory = currentFilter === "all" || a.category.toLowerCase() === currentFilter.toLowerCase();
      var matchSearch = true;
      if (currentSearchQuery.trim() !== "") {
        var q = currentSearchQuery.toLowerCase().trim();
        var inTitle = a.title.toLowerCase().indexOf(q) !== -1;
        var inExcerpt = a.excerpt.toLowerCase().indexOf(q) !== -1;
        var inCategory = a.category.toLowerCase().indexOf(q) !== -1;
        var inTags = a.tags ? a.tags.some(function (t) { return t.toLowerCase().indexOf(q) !== -1; }) : false;
        matchSearch = inTitle || inExcerpt || inCategory || inTags;
      }
      return matchCategory && matchSearch;
    });
  }

  // Rendu de l'article vedette
  function renderFeaturedArticle() {
    var container = document.getElementById("blog-featured-container");
    if (!container) return;

    // Prend l'article tagué featured ou le premier
    var featured = ARTICLES.find(function (a) { return a.featured; }) || ARTICLES[0];
    if (!featured || currentSearchQuery !== "" || currentFilter !== "all") {
      container.style.display = "none";
      return;
    }

    container.style.display = "block";
    var dateFormatted = new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    
    var tagsHTML = "";
    if (featured.tags) {
      featured.tags.forEach(function (t) {
        tagsHTML += '<span class="blog-card-tag">' + t + '</span>';
      });
    }

    container.innerHTML = [
      '<div class="blog-featured-card">',
      '  <div class="blog-featured-cover">',
      '    <img src="' + featured.cover + '" alt="Illustration : ' + featured.title + '" class="blog-cover-img" width="720" height="405" loading="eager" decoding="async">',
      '  </div>',
      '  <div class="blog-featured-body">',
      '    <div class="blog-featured-badge">★ Article Vedette</div>',
      '    <div class="blog-featured-meta">',
      '      <span class="blog-featured-category">' + featured.category + '</span>',
      '      <span>•</span>',
      '      <span>' + dateFormatted + '</span>',
      '      <span>•</span>',
      '      <span>' + featured.readTime + ' min de lecture</span>',
      '    </div>',
      '    <h2 class="blog-featured-title">' + featured.title + '</h2>',
      '    <p class="blog-featured-excerpt">' + featured.excerpt + '</p>',
      '    <div class="blog-card-tags">' + tagsHTML + '</div>',
      '    <div class="blog-featured-footer">',
      '      <div class="blog-card-author">',
      '        <div class="blog-author-avatar">AK</div>',
      '        <span>Par Abdel Kane (Aken)</span>',
      '      </div>',
      '      <a href="#article-' + featured.id + '" class="btn btn-primary btn-small" data-read-id="' + featured.id + '">Lire l\'article complet →</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("\n");
  }

  // Rendu de la grille principale
  function renderBlog() {
    var grid = document.getElementById("blog-grid");
    var pagination = document.getElementById("blog-pagination");
    var countEl = document.getElementById("blog-results-count");
    if (!grid) return;

    var filtered = getFilteredArticles();

    // Mise à jour du compteur
    if (countEl) {
      if (currentSearchQuery !== "" || currentFilter !== "all") {
        countEl.innerHTML = '<strong>' + filtered.length + '</strong> article' + (filtered.length > 1 ? 's' : '') + ' trouvé' + (filtered.length > 1 ? 's' : '');
      } else {
        countEl.innerHTML = '<strong>' + filtered.length + '</strong> articles au total';
      }
    }

    if (filtered.length === 0) {
      grid.innerHTML = [
        '<div class="blog-empty-state">',
        '  <svg class="blog-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
        '  <h3>Aucun article ne correspond à votre recherche</h3>',
        '  <p>Essayez d\'autres mots-clés ou réinitialisez les filtres de catégorie.</p>',
        '  <button class="btn btn-primary btn-small" id="blog-empty-reset">Réinitialiser les filtres</button>',
        '</div>'
      ].join("\n");
      if (pagination) pagination.innerHTML = "";
      return;
    }

    var start = (currentPage - 1) * articlesPerPage;
    var paged = filtered.slice(start, start + articlesPerPage);
    var totalPages = Math.ceil(filtered.length / articlesPerPage);

    var html = "";
    paged.forEach(function (article, index) {
      var dateFormatted = new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      var tagsHTML = "";
      if (article.tags) {
        article.tags.slice(0, 3).forEach(function (t) {
          tagsHTML += '<span class="blog-card-tag">' + t + '</span>';
        });
      }

      html += '<article class="blog-card" data-category="' + article.category + '" data-id="' + article.id + '" style="animation-delay: ' + (index * 0.08) + 's;">';
      html += '  <div class="blog-card-image">';
      html += '    <img src="' + article.cover + '" alt="Illustration : ' + article.title + '" class="blog-cover-img" width="720" height="405" loading="lazy" decoding="async">';
      html += '    <span class="blog-card-category-badge">' + article.category + '</span>';
      html += '    <span class="blog-card-time-badge">';
      html += '      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
      html += '      ' + article.readTime + ' min';
      html += '    </span>';
      html += '    ' + getBlogIcon(article.icon);
      html += '  </div>';
      html += '  <div class="blog-card-body">';
      html += '    <div class="blog-card-date">' + dateFormatted + '</div>';
      html += '    <h3>' + article.title + '</h3>';
      html += '    <p>' + article.excerpt + '</p>';
      html += '    <div class="blog-card-tags">' + tagsHTML + '</div>';
      html += '    <div class="blog-card-footer">';
      html += '      <div class="blog-card-author">';
      html += '        <div class="blog-author-avatar">AK</div>';
      html += '        <span>Aken</span>';
      html += '      </div>';
      html += '      <div class="blog-card-actions">';
      html += '        <button class="blog-card-share-btn" data-share-id="' + article.id + '" title="Partager cet article" aria-label="Partager cet article">';
      html += '          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
      html += '        </button>';
      html += '        <a href="#article-' + article.id + '" class="blog-card-read" data-read-id="' + article.id + '">';
      html += '          <span>Lire</span>';
      html += '          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
      html += '        </a>';
      html += '      </div>';
      html += '    </div>';
      html += '  </div>';
      html += '</article>';
    });

    grid.innerHTML = html;

    // Pagination
    if (pagination) {
      if (totalPages > 1) {
        var paginationHTML = "";
        for (var i = 1; i <= totalPages; i++) {
          paginationHTML += '<button class="' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
        }
        pagination.innerHTML = paginationHTML;
        pagination.style.display = "flex";
      } else {
        pagination.innerHTML = "";
        pagination.style.display = "none";
      }
    }
  }

  // Création du Lecteur Modal 2.0
  function createReaderModal() {
    var modal = document.getElementById("blog-reader-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "blog-reader-modal";
    modal.className = "blog-reader-overlay";
    modal.innerHTML = [
      '<div class="blog-reader-container">',
      '  <div class="blog-reader-progress"><div class="blog-reader-progress-bar" id="reader-progress-bar"></div></div>',
      '  <div class="blog-reader-topbar">',
      '    <div class="blog-reader-topbar-left">',
      '      <span class="blog-reader-category-pill" id="modal-category">Catégorie</span>',
      '      <span id="modal-read-time" style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-muted);">6 min</span>',
      '    </div>',
      '    <div class="blog-reader-topbar-actions">',
      '      <button class="blog-reader-btn-icon" id="modal-share-btn">',
      '        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
      '        <span>Partager</span>',
      '      </button>',
      '      <button class="blog-reader-close" id="modal-close-btn" aria-label="Fermer l\'article">&times;</button>',
      '    </div>',
      '  </div>',
      '  <div class="blog-reader-content">',
      '    <div class="blog-reader-meta" id="modal-meta"></div>',
      '    <h1 class="blog-reader-title" id="modal-title"></h1>',
      '    <div id="blog-reader-body" class="blog-article-content"></div>',
      '    <div class="blog-reader-author-card">',
      '      <img src="assets/mascot.svg" alt="Aken" class="blog-reader-author-avatar">',
      '      <div class="blog-reader-author-info">',
      '        <h4>Abdel Kane (Aken)</h4>',
      '        <p>Ingénieur Solutions Digitales, Web & Applications Mobiles à Bamako. Passionné par l\'architecture résiliente et la transformation digitale en Afrique.</p>',
      '      </div>',
      '    </div>',
      '    <div class="blog-reader-share-row">',
      '      <span class="blog-reader-share-label">Partager cette analyse :</span>',
      '      <div class="blog-reader-share-buttons">',
      '        <a href="#" class="blog-share-btn" id="share-wa" target="_blank" rel="noopener">WhatsApp</a>',
      '        <a href="#" class="blog-share-btn" id="share-tw" target="_blank" rel="noopener">X / Twitter</a>',
      '        <a href="#" class="blog-share-btn" id="share-li" target="_blank" rel="noopener">LinkedIn</a>',
      '        <button class="blog-share-btn" id="share-copy">Copier le lien</button>',
      '      </div>',
      '    </div>',
      '    <div class="blog-article-cta">',
      '      <h3>Vous souhaitez concrétiser un projet similaire ?</h3>',
      '      <p>Bénéficiez d\'un accompagnement sur-mesure pour créer votre site, votre application mobile ou automatiser vos opérations.</p>',
      '      <a href="communaute.html" class="btn btn-outline">Discuter avec la communauté →</a>',
      '      <a href="index.html#devis" class="btn btn-primary">Calculer mon devis gratuit →</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("\n");

    document.body.appendChild(modal);

    // Événements de fermeture
    modal.querySelector("#modal-close-btn").addEventListener("click", closeReader);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeReader();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeReader();
      }
    });

    // Progression de lecture au scroll
    modal.addEventListener("scroll", function () {
      var progressBar = document.getElementById("reader-progress-bar");
      if (!progressBar) return;
      var scrollTop = modal.scrollTop;
      var scrollHeight = modal.scrollHeight - modal.clientHeight;
      var percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = percent + "%";
    });

    return modal;
  }

  function openArticle(articleId) {
    var article = ARTICLES.find(function (a) { return a.id === parseInt(articleId, 10); });
    if (!article) return;

    if (window.AkenAudio && typeof window.AkenAudio.play === "function") {
      window.AkenAudio.play("click");
    }

    var modal = createReaderModal();
    var modalCategory = document.getElementById("modal-category");
    var modalReadTime = document.getElementById("modal-read-time");
    var modalMeta = document.getElementById("modal-meta");
    var modalTitle = document.getElementById("modal-title");
    var modalBody = document.getElementById("blog-reader-body");
    var progressBar = document.getElementById("reader-progress-bar");

    var dateFormatted = new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    modalCategory.textContent = article.category;
    modalReadTime.textContent = article.readTime + " min de lecture";
    modalTitle.textContent = article.title;

    modalMeta.innerHTML = [
      '<span>Par <strong>Abdel Kane (Aken)</strong></span>',
      '<span>•</span>',
      '<span>' + dateFormatted + '</span>',
      '<span>•</span>',
      '<span>' + article.readTime + ' min</span>'
    ].join(" ");

    modalBody.innerHTML = article.content;

    // Ajout bouton copier sur les blocs de code
    modalBody.querySelectorAll("pre").forEach(function (pre) {
      var copyBtn = document.createElement("button");
      copyBtn.className = "blog-kbd-shortcut";
      copyBtn.style.cssText = "position:absolute;top:10px;right:10px;cursor:pointer;background:var(--bg-elev);border:1px solid var(--border);color:var(--text-muted);";
      copyBtn.textContent = "Copier";
      copyBtn.addEventListener("click", function () {
        var code = pre.querySelector("code") ? pre.querySelector("code").innerText : pre.innerText;
        navigator.clipboard.writeText(code).then(function () {
          copyBtn.textContent = "Copié ! ✓";
          setTimeout(function () { copyBtn.textContent = "Copier"; }, 2000);
        });
      });
      pre.appendChild(copyBtn);
    });

    // Liens de partage
    var currentUrl = window.location.origin + window.location.pathname + "#article-" + article.id;
    var shareTitle = encodeURIComponent(article.title + " — Blog Aken");
    var shareUrl = encodeURIComponent(currentUrl);

    var btnWa = document.getElementById("share-wa");
    var btnTw = document.getElementById("share-tw");
    var btnLi = document.getElementById("share-li");
    var btnCopy = document.getElementById("share-copy");
    var btnModalShare = document.getElementById("modal-share-btn");

    if (btnWa) btnWa.href = "https://api.whatsapp.com/send?text=" + shareTitle + "%20" + shareUrl;
    if (btnTw) btnTw.href = "https://twitter.com/intent/tweet?text=" + shareTitle + "&url=" + shareUrl;
    if (btnLi) btnLi.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + shareUrl;

    if (btnCopy) {
      btnCopy.onclick = function () {
        navigator.clipboard.writeText(currentUrl).then(function () {
          showBlogToast("Lien de l'article copié dans le presse-papier !", "🔗");
        });
      };
    }

    if (btnModalShare) {
      btnModalShare.onclick = function () {
        if (navigator.share) {
          navigator.share({ title: article.title, text: article.excerpt, url: currentUrl });
        } else {
          navigator.clipboard.writeText(currentUrl).then(function () {
            showBlogToast("Lien copié dans le presse-papier !", "🔗");
          });
        }
      };
    }

    if (progressBar) progressBar.style.width = "0%";
    modal.scrollTop = 0;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Met à jour l'URL sans recharger
    history.pushState(null, "", "#article-" + article.id);
  }

  function closeReader() {
    var modal = document.getElementById("blog-reader-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      if (window.location.hash.indexOf("#article-") !== -1) {
        history.pushState(null, "", window.location.pathname);
      }
    }
  }

  // Initialisation et gestionnaires d'événements
  function init() {
    // Boutons de filtres
    document.querySelectorAll(".blog-filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentFilter = btn.getAttribute("data-filter");
        currentPage = 1;
        document.querySelectorAll(".blog-filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        if (window.AkenAudio && typeof window.AkenAudio.play === "function") {
          window.AkenAudio.play("toggle");
        }

        renderFeaturedArticle();
        renderBlog();
      });
    });

    // Barre de recherche temps réel
    var searchInput = document.getElementById("blog-search");
    var searchClear = document.getElementById("blog-search-clear");

    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        currentSearchQuery = e.target.value;
        currentPage = 1;

        if (searchClear) {
          if (currentSearchQuery.length > 0) {
            searchClear.classList.add("visible");
          } else {
            searchClear.classList.remove("visible");
          }
        }

        renderFeaturedArticle();
        renderBlog();
      });

      if (searchClear) {
        searchClear.addEventListener("click", function () {
          searchInput.value = "";
          currentSearchQuery = "";
          searchClear.classList.remove("visible");
          searchInput.focus();
          renderFeaturedArticle();
          renderBlog();
        });
      }

      // Raccourci clavier Ctrl+K ou / pour se focaliser sur la recherche
      document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement !== searchInput)) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    // Réinitialisation globale des filtres
    document.addEventListener("click", function (e) {
      if (e.target && (e.target.id === "blog-empty-reset" || e.target.id === "blog-reset-filters")) {
        currentFilter = "all";
        currentSearchQuery = "";
        currentPage = 1;
        if (searchInput) searchInput.value = "";
        if (searchClear) searchClear.classList.remove("visible");
        document.querySelectorAll(".blog-filter-btn").forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-filter") === "all");
        });
        renderFeaturedArticle();
        renderBlog();
      }

      // Clic pagination
      if (e.target.hasAttribute("data-page")) {
        currentPage = parseInt(e.target.getAttribute("data-page"), 10);
        renderBlog();
        var controls = document.getElementById("blog-controls");
        if (controls) {
          controls.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Clic lecture d'article
      var readBtn = e.target.closest("[data-read-id]");
      if (readBtn) {
        e.preventDefault();
        openArticle(readBtn.getAttribute("data-read-id"));
      }

      // Partage rapide depuis la carte
      var shareBtn = e.target.closest("[data-share-id]");
      if (shareBtn) {
        e.preventDefault();
        var aid = shareBtn.getAttribute("data-share-id");
        var art = ARTICLES.find(function (a) { return a.id === parseInt(aid, 10); });
        if (art) {
          var shareLink = window.location.origin + window.location.pathname + "#article-" + art.id;
          if (navigator.share) {
            navigator.share({ title: art.title, text: art.excerpt, url: shareLink });
          } else {
            navigator.clipboard.writeText(shareLink).then(function () {
              showBlogToast("Lien de l'article copié !", "📋");
            });
          }
        }
      }
    });

    // Formulaire Newsletter / Lead Magnet
    var newsletterForm = document.getElementById("blog-newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("blog-newsletter-email");
        if (input && input.value.trim() !== "") {
          showBlogToast("Merci ! Vous êtes bien inscrit(e) aux insights Aken 🚀", "✅");
          input.value = "";
        }
      });
    }

    // Réaction mascotte clic
    var mascot = document.querySelector(".blog-hero-mascot-wrap");
    var speech = document.getElementById("blog-speech-bubble");
    if (mascot && speech) {
      var quotes = [
        "Des questions sur une techno ? Écrivez-nous sur WhatsApp ! 💬",
        "Chaque ligne de code compte pour la performance. ⚡",
        "Au Mali, l'offline-first fait toute la différence ! 📱",
        "Wave & Orange Money : les rois du paiement local. 💳",
        "Bonne lecture de nos retours d'expérience ! 🚀"
      ];
      var qIdx = 0;
      mascot.addEventListener("click", function () {
        qIdx = (qIdx + 1) % quotes.length;
        speech.textContent = quotes[qIdx];
        if (window.AkenAudio && typeof window.AkenAudio.play === "function") {
          window.AkenAudio.play("toggle");
        }
      });
    }

    // Premier affichage
    renderFeaturedArticle();
    renderBlog();

    // Vérifie si un hash est présent dans l'URL (#article-2)
    if (window.location.hash && window.location.hash.indexOf("#article-") === 0) {
      var hashId = window.location.hash.replace("#article-", "");
      if (hashId) {
        setTimeout(function () { openArticle(hashId); }, 300);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
