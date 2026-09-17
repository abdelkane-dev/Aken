// Aken 2.0 — Page Communauté : stats animées, toasts canaux, newsletter
(function () {
  "use strict";

  /* ═══ Toasts (même système que le blog) ═══ */
  function showCommToast(message, icon) {
    var container = document.getElementById("comm-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "comm-toast-container";
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
    }, 3400);
  }

  /* ═══ Compteurs animés au scroll ═══ */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var stats = document.getElementById("comm-stats");
    if (!stats) return;
    var counters = stats.querySelectorAll(".comm-stat-value");

    if (!("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
      });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });

    obs.observe(stats);
  }

  /* ═══ Cartes canaux « Bientôt » ═══
     Activation automatique : dès qu'une carte porte un data-url non vide,
     elle devient un lien ouvert dans un nouvel onglet (plus de toast).
     Pour lancer un canal : remplacer le data-url="" dans communaute.html. */
  function initChannels() {
    document.querySelectorAll(".comm-channel-soon").forEach(function (card) {
      var url = (card.getAttribute("data-url") || "").trim();
      if (url) {
        card.setAttribute("data-pending-url", url); /* préservé si retour en arrière */
        var link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
        link.className = "comm-channel-card comm-channel-live";
        link.setAttribute("aria-label", "Rejoindre " + (card.getAttribute("data-channel") || "le canal"));
        while (card.firstChild) link.appendChild(card.firstChild);
        var arrow = document.createElement("span");
        arrow.className = "comm-channel-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        link.appendChild(arrow);
        var badge = link.querySelector(".comm-soon-badge");
        if (badge) badge.remove();
        card.parentNode.replaceChild(link, card);
        return;
      }
      card.addEventListener("click", function () {
        var channel = card.getAttribute("data-channel") || "ce canal";
        showCommToast("Rejoignez-nous très bientôt sur " + channel + " ! 🚀", "🔔");
        if (window.AkenFX && typeof window.AkenFX.confirm === "function") {
          window.AkenFX.confirm();
        }
      });
    });

    // Feedback sur les canaux réellement ouverts
    document.querySelectorAll(".comm-channel-live").forEach(function (card) {
      card.addEventListener("click", function () {
        if (window.AkenFX && typeof window.AkenFX.confirm === "function") {
          window.AkenFX.confirm();
        }
      });
    });
  }

  /* ═══ Newsletter partagée ═══ */
  function initNewsletter() {
    var form = document.getElementById("comm-newsletter-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("comm-newsletter-email");
      if (input && input.value.trim() !== "") {
        showCommToast("Merci ! Vous êtes bien inscrit(e) aux insights Aken 🚀", "✅");
        if (window.AkenFX && typeof window.AkenFX.confirm === "function") {
          window.AkenFX.confirm();
        }
        input.value = "";
      }
    });
  }

  /* ═══ Interaction Orbite Canaux (logos + noms + actions) ═══ */
  function initOrbitNodes() {
    var stage = document.getElementById("comm-orbit-stage");
    var nodes = document.querySelectorAll(".comm-orbit-node");
    var coreGlow = document.querySelector(".comm-core-glow");
    var mascot = document.querySelector(".comm-mascot");
    if (!stage || !nodes.length) return;

    var defaultGlow = "radial-gradient(circle, rgba(255, 107, 0, 0.35) 0%, rgba(255, 170, 0, 0.1) 45%, transparent 70%)";

    nodes.forEach(function (node) {
      var channel = node.getAttribute("data-channel") || "ce canal";
      var brand = node.style.getPropertyValue("--brand") || "#FF6B00";
      var targetId = node.getAttribute("data-target");

      // Survol : le halo central prend la couleur de marque du canal et la mascotte réagit
      node.addEventListener("mouseenter", function () {
        if (coreGlow) {
          coreGlow.style.background = "radial-gradient(circle, " + brand + "55 0%, " + brand + "20 45%, transparent 70%)";
        }
        if (mascot) {
          mascot.style.transform = "translateY(-6px) scale(1.04)";
          mascot.style.transition = "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)";
        }
      });

      node.addEventListener("mouseleave", function () {
        if (coreGlow) {
          coreGlow.style.background = defaultGlow;
        }
        if (mascot) {
          mascot.style.transform = "";
        }
      });

      // Clic : feedback sonore + redirection ou scroll vers la carte avec flash lumineux
      node.addEventListener("click", function (e) {
        if (window.AkenSound && typeof window.AkenSound.playClick === "function") {
          window.AkenSound.playClick();
        }

        // Si c'est un bouton "Bientôt" (sans lien direct)
        if (node.tagName.toLowerCase() === "button") {
          var pendingUrl = (node.getAttribute("data-url") || "").trim();
          if (pendingUrl) {
            window.open(pendingUrl, "_blank", "noopener");
            return;
          }

          // Pas d'URL active : toast informatif + scroll vers la carte correspondante
          showCommToast("Rejoignez-nous très bientôt sur " + channel + " ! 🚀", "🔔");
          if (targetId) {
            var targetCard = document.querySelector(targetId);
            if (targetCard) {
              targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
              targetCard.classList.remove("comm-card-highlight");
              void targetCard.offsetWidth; // trigger reflow
              targetCard.classList.add("comm-card-highlight");
              setTimeout(function () {
                targetCard.classList.remove("comm-card-highlight");
              }, 2200);
            }
          }
        } else {
          // Lien direct (WhatsApp, GitHub) : petit toast de bienvenue
          showCommToast("Redirection vers " + channel + "… ✨", "🚀");
        }
      });
    });
  }

  /* ═══ Init ═══ */
  function init() {
    initCounters();
    initChannels();
    initNewsletter();
    initOrbitNodes();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
