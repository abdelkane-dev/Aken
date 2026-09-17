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

  /* ═══ Interaction mascotte : bulle de réaction (réutilise le pattern blog) ═══ */
  function initMascotPlayful() {
    var stage = document.getElementById("comm-orbit-stage");
    var avatars = document.querySelectorAll(".comm-orbit-avatar");
    if (!stage || !avatars.length) return;

    // Clic sur un avatar : petit toast personnalisé
    avatars.forEach(function (av) {
      av.style.cursor = "pointer";
      av.addEventListener("click", function () {
        var name = av.getAttribute("data-name") || "un membre";
        showCommToast(name + " a rejoint la communauté Aken ✨", "👋");
      });
    });
  }

  /* ═══ Init ═══ */
  function init() {
    initCounters();
    initChannels();
    initNewsletter();
    initMascotPlayful();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
