// Aken — i18n System v6 (bulletproof, self-contained)
(function () {
  "use strict";

  var currentLang = localStorage.getItem("aken-lang") || "fr";
  var dict = null;

  function loadDictionary(lang) {
    var path = "lang/" + lang + ".json";
    return fetch(path)
      .catch(function () {
        return fetch("/" + path);
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        dict = data;
        return data;
      })
      .catch(function (err) {
        console.warn("[Aken] Failed to load lang:", lang, err);
        return null;
      });
  }

  function translateElement(el, data) {
    var key = el.getAttribute("data-aken-text");
    if (!key) return;
    var parts = key.split(".");
    var val = data;
    for (var i = 0; i < parts.length; i++) {
      if (val && val[parts[i]] !== undefined) {
        val = val[parts[i]];
      } else {
        return;
      }
    }
    if (typeof val === "string") {
      var svg = el.querySelector("svg");
      if (svg) {
        // If element has an svg icon, preserve it and update text only
        var textNode = null;
        for (var n = 0; n < el.childNodes.length; n++) {
          if (el.childNodes[n].nodeType === Node.TEXT_NODE && el.childNodes[n].textContent.trim().length > 0) {
            textNode = el.childNodes[n];
            break;
          }
        }
        if (textNode) {
          textNode.textContent = " " + val;
        } else {
          el.appendChild(document.createTextNode(" " + val));
        }
      } else {
        el.textContent = val;
      }
    }
  }

  function translateHtmlElement(el, data) {
    var key = el.getAttribute("data-aken-html");
    if (!key) return;
    var parts = key.split(".");
    var val = data;
    for (var i = 0; i < parts.length; i++) {
      if (val && val[parts[i]] !== undefined) {
        val = val[parts[i]];
      } else {
        return;
      }
    }
    if (typeof val === "string") {
      el.innerHTML = val;
    }
  }

  function applyTranslations(data) {
    if (!data) return;

    // data-aken-text: textContent
    var textEls = document.querySelectorAll("[data-aken-text]");
    for (var i = 0; i < textEls.length; i++) {
      translateElement(textEls[i], data);
    }

    // data-aken-html: innerHTML
    var htmlEls = document.querySelectorAll("[data-aken-html]");
    for (var j = 0; j < htmlEls.length; j++) {
      translateHtmlElement(htmlEls[j], data);
    }

    // data-aken-placeholder
    var placeholders = document.querySelectorAll("[data-aken-placeholder]");
    for (var k = 0; k < placeholders.length; k++) {
      var pk = placeholders[k].getAttribute("data-aken-placeholder");
      var pparts = pk.split(".");
      var pval = data;
      for (var pi = 0; pi < pparts.length; pi++) {
        if (pval && pval[pparts[pi]] !== undefined) pval = pval[pparts[pi]];
        else { pval = null; break; }
      }
      if (typeof pval === "string") placeholders[k].placeholder = pval;
    }

    // data-aken-aria
    var ariaEls = document.querySelectorAll("[data-aken-aria]");
    for (var a = 0; a < ariaEls.length; a++) {
      var ak = ariaEls[a].getAttribute("data-aken-aria");
      var aparts = ak.split(".");
      var aval = data;
      for (var ai = 0; ai < aparts.length; ai++) {
        if (aval && aval[aparts[ai]] !== undefined) aval = aval[aparts[ai]];
        else { aval = null; break; }
      }
      if (typeof aval === "string") ariaEls[a].setAttribute("aria-label", aval);
    }
  }

  function switchLang(lang) {
    currentLang = lang;
    localStorage.setItem("aken-lang", lang);

    loadDictionary(lang).then(function (data) {
      if (data) {
        applyTranslations(data);
      }

      // Update og:locale
      var og = document.querySelector('meta[property="og:locale"]');
      if (og) og.setAttribute("content", lang === "fr" ? "fr_FR" : "en_US");

      // Update button text
      var btns = document.querySelectorAll("#lang-toggle, #drawer-lang-toggle");
      btns.forEach(function (b) {
        b.textContent = lang === "fr" ? "EN" : "FR";
        b.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer en français");
      });

      // Update html lang
      document.documentElement.lang = lang;

      window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
    });
  }

  function init() {
    loadDictionary(currentLang).then(function (data) {
      if (data) {
        applyTranslations(data);
      }

      var btns = document.querySelectorAll("#lang-toggle, #drawer-lang-toggle");
      btns.forEach(function (b) {
        b.textContent = currentLang === "fr" ? "EN" : "FR";
        b.addEventListener("click", function () {
          switchLang(currentLang === "fr" ? "en" : "fr");
        });
      });
    });
  }

  window.AkenI18n = {
    switchLang: switchLang,
    getLang: function () { return currentLang; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
