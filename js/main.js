// Aken — Portfolio 2.0 : Calculateur de devis, compteurs, animations
// Aucune dépendance externe — léger pour connexions lentes

(function () {
  "use strict";

  /* ═══════════════════════════════════════════
     1. THÈME CLAIR / SOMBRE
     ═══════════════════════════════════════════ */
  var root = document.documentElement;
  var toggleBtns = document.querySelectorAll("#theme-toggle, #drawer-theme-toggle");
  var saved = localStorage.getItem("aken-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function updateThemeUI(theme) {
    root.setAttribute("data-theme", theme);
    toggleBtns.forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre");
      btn.title = theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre";
    });
  }

  var initialTheme = saved || (prefersDark ? "dark" : "light");
  updateThemeUI(initialTheme);

  toggleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      localStorage.setItem("aken-theme", next);
      updateThemeUI(next);
    });
  });

  /* ═══════════════════════════════════════════
     2. MENU MOBILE — Tiroir latéral (Drawer)
     ═══════════════════════════════════════════ */
  var navToggle = document.getElementById("nav-toggle");
  var navClose = document.getElementById("nav-drawer-close");
  var navBackdrop = document.getElementById("nav-backdrop");
  var header = document.getElementById("entete") || document.querySelector(".site-header");

  function openNav() {
    if (header) header.classList.add("nav-open");
    document.body.classList.add("nav-open");
    var mainNav = document.getElementById("main-nav");
    if (mainNav) mainNav.classList.add("open");
    if (navBackdrop) navBackdrop.classList.add("open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Fermer le menu");
    }
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    if (header) header.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
    var mainNav = document.getElementById("main-nav");
    if (mainNav) mainNav.classList.remove("open");
    if (navBackdrop) navBackdrop.classList.remove("open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
    document.body.style.overflow = "";
  }

  if (navToggle) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (header && header.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navClose) {
    navClose.addEventListener("click", closeNav);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNav);
  }

  document.querySelectorAll(".main-nav a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeNav();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("nav-open")) {
      closeNav();
    }
  });

  /* ═══════════════════════════════════════════
     3. ANNÉE AUTOMATIQUE FOOTER
     ═══════════════════════════════════════════ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ═══════════════════════════════════════════
     4. FORMULAIRES
     ═══════════════════════════════════════════ */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "✅ Message envoyé ! Je vous réponds sous 24h.";
      form.reset();
    });
  }

  var leadForm = document.getElementById("lead-form");
  var leadStatus = document.getElementById("lead-status");
  if (leadForm && leadStatus) {
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      leadStatus.textContent = "✅ Guide envoyé ! Vérifiez votre boîte mail.";
      leadForm.reset();
    });
  }

  /* ═══════════════════════════════════════════
     5. COMPTEURS D'IMPACT (animation au scroll)
     ═══════════════════════════════════════════ */
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll(".impact-number").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;

      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out quad
        var eased = 1 - (1 - progress) * (1 - progress);
        var current = Math.floor(eased * target);
        el.textContent = current.toLocaleString("fr-FR");
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString("fr-FR");
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Intersection Observer pour les compteurs
  if ("IntersectionObserver" in window) {
    var counterSection = document.querySelector(".impact-strip");
    if (counterSection) {
      var counterObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            counterObs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      counterObs.observe(counterSection);
    }
  } else {
    // Fallback : animer directement
    animateCounters();
  }

  /* ═══════════════════════════════════════════
     6. CALCULATEUR DE DEVIS INTERACTIF
     ═══════════════════════════════════════════ */

  // Tarifs de base (en FCFA) — Prix minimum à partir de 75 000 FCFA
  var BASE_PRICES = {
    "site-vitrine": 75000,
    "app-web": 140000,
    "app-mobile": 220000,
    "systeme-data": 320000,
    "audit": 45000
  };

  // Coût additionnel des fonctionnalités (ajusté et accessible)
  var FEATURE_COSTS = {
    "auth": 25000,
    "paiement": 35000,
    "notification": 20000,
    "admin": 35000,
    "api": 30000,
    "geoloc": 25000,
    "multilingue": 20000,
    "ia": 50000
  };

  // Labels pour le récap
  var PROJECT_LABELS = {
    "site-vitrine": "Site vitrine professionnel",
    "app-web": "Boutique en ligne / Web App",
    "app-mobile": "Application mobile",
    "systeme-data": "Logiciel de gestion & sur-mesure",
    "audit": "Audit & Conseil stratégique"
  };

  var FEATURE_LABELS = {
    "auth": "Comptes utilisateurs",
    "paiement": "Paiement en ligne (Wave, OM)",
    "notification": "Notifications push / SMS",
    "admin": "Panneau d'administration",
    "api": "API intégrations tierces",
    "geoloc": "Géolocalisation & Cartes",
    "multilingue": "Multilingue",
    "ia": "IA & Automatisation"
  };

  var TIMELINE_MULTIPLIERS = {
    "standard": 1.0,
    "express": 1.3,
    "urgent": 1.6
  };

  var TIMELINE_LABELS = {
    "standard": "Standard (4-8 semaines)",
    "express": "Express (2-4 semaines) +30%",
    "urgent": "Urgent (< 2 semaines) +60%"
  };

  var priceEl = document.getElementById("calc-price");
  var detailsEl = document.getElementById("calc-details");
  var whatsappBtn = document.getElementById("calc-whatsapp");
  var depositBtn = document.getElementById("calc-pay-deposit-btn");

  function updateEstimate() {
    // Lire les sélections
    var typeRadio = document.querySelector('input[name="project-type"]:checked');
    var timelineRadio = document.querySelector('input[name="timeline"]:checked');
    var featureChecks = document.querySelectorAll('input[name="features"]:checked');

    if (!typeRadio) {
      if (priceEl) priceEl.textContent = "—";
      if (detailsEl) detailsEl.innerHTML = '<p class="calc-empty-msg">Sélectionnez un type de projet pour voir l\'estimation.</p>';
      return;
    }

    var projectType = typeRadio.value;
    var basePrice = BASE_PRICES[projectType] || 0;
    var featureTotal = 0;
    var featureLines = [];

    featureChecks.forEach(function (cb) {
      var cost = FEATURE_COSTS[cb.value] || 0;
      featureTotal += cost;
      featureLines.push({
        label: FEATURE_LABELS[cb.value] || cb.value,
        cost: cost
      });
    });

    var subtotal = basePrice + featureTotal;
    var multiplier = 1;
    var timelineLabel = "";
    if (timelineRadio) {
      multiplier = TIMELINE_MULTIPLIERS[timelineRadio.value] || 1;
      timelineLabel = TIMELINE_LABELS[timelineRadio.value] || "";
    }

    var totalBrut = Math.round(subtotal * multiplier / 1000) * 1000;
    var discount10 = Math.round(totalBrut * 0.10);
    var totalNet = totalBrut - discount10;
    var deposit30 = Math.round(totalNet * 0.30);

    // Formatter les prix
    var formattedNet = totalNet.toLocaleString("fr-FR");
    var formattedBrut = totalBrut.toLocaleString("fr-FR");
    var formattedDiscount = discount10.toLocaleString("fr-FR");
    var formattedDeposit = deposit30.toLocaleString("fr-FR");

    if (priceEl) {
      priceEl.innerHTML = '<span style="font-size:0.65em;text-decoration:line-through;color:var(--ink-soft);opacity:0.7;margin-right:6px;">' + formattedBrut + '</span>' + formattedNet;
    }

    // Mettre à jour le bouton d'acompte
    if (depositBtn) {
      depositBtn.setAttribute("data-amount", deposit30);
      depositBtn.setAttribute("data-project", projectType);
      depositBtn.innerHTML = 'Régler l\'acompte (' + formattedDeposit + ' FCFA) &rarr;';
    }

    // Détails
    if (detailsEl) {
      var html = "<ul>";
      html += '<li><span>' + PROJECT_LABELS[projectType] + '</span><span>' + basePrice.toLocaleString("fr-FR") + ' FCFA</span></li>';
      featureLines.forEach(function (f) {
        html += '<li><span>' + f.label + '</span><span>+' + f.cost.toLocaleString("fr-FR") + ' FCFA</span></li>';
      });
      if (timelineLabel) {
        html += '<li><span>Délai</span><span>' + timelineLabel + '</span></li>';
      }
      html += '<li style="color:#ffaa33;font-weight:600;"><span>Remise 1er projet (-10%)</span><span>-' + formattedDiscount + ' FCFA</span></li>';
      html += '<li style="color:var(--teal);font-weight:700;border-top:1px solid rgba(255,255,255,0.1);padding-top:6px;margin-top:4px;"><span>Acompte de démarrage (30%)</span><span>' + formattedDeposit + ' FCFA</span></li>';
      html += '</ul>';
      detailsEl.innerHTML = html;
    }

    // WhatsApp message
    if (whatsappBtn) {
      var msg = "Bonjour Aken, je souhaite un devis pour :\n\n";
      msg += "📌 Projet : " + PROJECT_LABELS[projectType] + "\n";
      featureLines.forEach(function (f) {
        msg += "✅ " + f.label + "\n";
      });
      if (timelineLabel) msg += "⏰ Délai : " + timelineLabel + "\n";
      msg += "\n💵 Tarif standard : " + formattedBrut + " FCFA";
      msg += "\n🏷️ Remise 1er projet (-10%) : -" + formattedDiscount + " FCFA";
      msg += "\n⭐ Total estimé remisé : " + formattedNet + " FCFA";
      msg += "\n💳 Acompte 30% : " + formattedDeposit + " FCFA";
      msg += "\n\nPouvons-nous en discuter pour lancer la réalisation ?";
      var encoded = encodeURIComponent(msg);
      whatsappBtn.href = "https://wa.me/22393789916?text=" + encoded;
    }
  }

  // Écouter tous les inputs du calculateur
  document.querySelectorAll('.calc-options input[type="radio"], .calc-options input[type="checkbox"]').forEach(function (input) {
    input.addEventListener("change", updateEstimate);
  });

  /* ═══════════════════════════════════════════
     7. ANIMATIONS AU SCROLL (fade-in)
     ═══════════════════════════════════════════ */
  if ("IntersectionObserver" in window) {
    var fadeEls = document.querySelectorAll(
      ".expertise-card, .case-card, .testimonial-card, .offer-card, .guarantee-banner"
    );

    // CSS pour l'animation
    var style = document.createElement("style");
    style.textContent = ".fade-in-up { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; } .fade-in-up.visible { opacity: 1; transform: translateY(0); }";
    document.head.appendChild(style);

    fadeEls.forEach(function (el) {
      el.classList.add("fade-in-up");
    });

    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) {
      fadeObs.observe(el);
    });
  }

  /* ═══════════════════════════════════════════
     8. STICKY CTA BAR (mobile — show after scroll)
     ═══════════════════════════════════════════ */
  var stickyBar = document.getElementById("sticky-cta");
  if (stickyBar) {
    var lastScroll = 0;
    window.addEventListener("scroll", function () {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      // Show after scrolling past hero
      if (scrollY > 400) {
        stickyBar.style.transform = "translateY(0)";
        stickyBar.style.opacity = "1";
      } else {
        stickyBar.style.transform = "translateY(100%)";
        stickyBar.style.opacity = "0";
      }
      lastScroll = scrollY;
    }, { passive: true });

    // Initially hidden
    stickyBar.style.transform = "translateY(100%)";
    stickyBar.style.opacity = "0";
    stickyBar.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  }

  /* ═══════════════════════════════════════════
     9. SMOOTH SCROLL POUR ANCRES (compat)
     ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });


  /* ═══════════════════════════════════════════
     10. SCROLL PROGRESS BAR
     ═══════════════════════════════════════════ */
  var scrollProgress = document.getElementById("scroll-progress");
  if (scrollProgress) {
    window.addEventListener("scroll", function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = progress + "%";
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     11. REVEAL ANIMATIONS ON SCROLL
     ═══════════════════════════════════════════ */
  if ("IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale");
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ═══════════════════════════════════════════
     12. EXIT INTENT POPUP
     ═══════════════════════════════════════════ */
  var exitPopup = document.getElementById("exit-popup");
  var exitDismissed = localStorage.getItem("aken-exit-dismissed");
  if (exitPopup && !exitDismissed) {
    var exitShown = false;
    document.addEventListener("mouseleave", function (e) {
      if (e.clientY < 10 && !exitShown) {
        exitShown = true;
        exitPopup.classList.add("active");
      }
    });
    exitPopup.querySelector(".exit-popup-close").addEventListener("click", function () {
      exitPopup.classList.remove("active");
      localStorage.setItem("aken-exit-dismissed", "1");
    });
    var exitCta = document.getElementById("exit-cta");
    if (exitCta) {
      exitCta.addEventListener("click", function () {
        exitPopup.classList.remove("active");
      });
    }
  }

  /* ═══════════════════════════════════════════
     13. VISITOR COUNTER (simulated)
     ═══════════════════════════════════════════ */
  var visitorCount = document.getElementById("visitor-count");
  if (visitorCount) {
    var baseVisitors = 8 + Math.floor(Math.random() * 12);
    visitorCount.textContent = baseVisitors + " personnes consultent le site";
    setInterval(function () {
      var change = Math.random() > 0.5 ? 1 : -1;
      baseVisitors = Math.max(3, Math.min(30, baseVisitors + change));
      visitorCount.textContent = baseVisitors + " personnes consultent le site";
    }, 15000);
  }

})();
