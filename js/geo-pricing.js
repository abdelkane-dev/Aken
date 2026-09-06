// Aken — Geolocation Pricing Module
// Auto-detects user location and adapts pricing/currency
(function() {
  'use strict';

  var REGIONS = {
    westAfrica: {
      currencies: ['XOF', 'XAF', 'GMD', 'SLL', 'LRD', 'GNF'],
      countries: ['ML', 'CI', 'SN', 'BF', 'NE', 'TG', 'BJ', 'GW', 'GM', 'SL', 'LR', 'GN', 'GH', 'CM', 'NG', 'MR', 'CG', 'GA', 'CF', 'TD', 'GQ'],
      currency: 'FCFA',
      rate: 1,
      locale: 'fr',
      label: 'Afrique de l\'Ouest',
      features: { mobileMoney: true, email: true, whatsapp: true }
    },
    eastAfrica: {
      currencies: ['KES', 'UGX', 'TZS', 'RWF', 'BIF'],
      countries: ['KE', 'UG', 'TZ', 'RW', 'BI', 'ET', 'SO', 'DJ'],
      currency: 'Local',
      rate: 0.5,
      locale: 'en',
      label: 'Afrique de l\'Est',
      features: { mobileMoney: true, email: true, whatsapp: true }
    },
    northAfrica: {
      currencies: ['MAD', 'DZD', 'TND', 'EGP', 'LYD'],
      countries: ['MA', 'DZ', 'TN', 'EG', 'LY', 'SD', 'SS'],
      currency: 'Local',
      rate: 0.35,
      locale: 'fr',
      label: 'Afrique du Nord',
      features: { mobileMoney: false, email: true, whatsapp: true }
    },
    europe: {
      currencies: ['EUR', 'GBP', 'CHF'],
      countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'PT', 'NL', 'GB', 'IE', 'AT', 'MC', 'AD'],
      currency: 'EUR',
      rate: 0.22,
      locale: 'fr',
      label: 'Europe',
      features: { mobileMoney: false, email: true, whatsapp: false, stripe: true }
    },
    northAmerica: {
      currencies: ['USD', 'CAD'],
      countries: ['US', 'CA'],
      currency: 'USD',
      rate: 0.25,
      locale: 'en',
      label: 'Amérique du Nord',
      features: { mobileMoney: false, email: true, whatsapp: false, stripe: true }
    },
    other: {
      currency: 'USD',
      rate: 0.25,
      locale: 'en',
      label: 'International',
      features: { mobileMoney: false, email: true, whatsapp: false, stripe: true }
    }
  };

  var basePrices = {
    siteVitrine: 150000,
    audit: 75000,
    express: 0.30,
    urgent: 0.60
  };

  var currentRegion = null;

  function detectRegion(countryCode) {
    for (var key in REGIONS) {
      if (REGIONS[key].countries && REGIONS[key].countries.indexOf(countryCode) > -1) {
        return key;
      }
    }
    return 'other';
  }

  function formatPrice(amount, region) {
    var r = REGIONS[region] || REGIONS.other;
    var converted = Math.round(amount * r.rate);
    
    if (r.currency === 'FCFA') {
      return converted.toLocaleString('fr-FR') + ' FCFA';
    } else if (r.currency === 'EUR') {
      return converted.toLocaleString('fr-FR') + ' EUR';
    } else if (r.currency === 'USD') {
      return '$' + converted.toLocaleString('en-US');
    }
    return converted.toLocaleString() + ' ' + r.currency;
  }

  function init() {
    // Try to detect via browser language first (fast)
    var lang = navigator.language || navigator.userLanguage || '';
    var countryCode = lang.split('-')[1];
    
    if (countryCode && detectRegion(countryCode) !== 'other') {
      setRegion(detectRegion(countryCode));
      return;
    }

    // Try IP-based detection
    fetch('https://ipapi.co/json/')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data && data.country_code) {
          setRegion(detectRegion(data.country_code));
        } else {
          setRegion('westAfrica');
        }
      })
      .catch(function() {
        setRegion('westAfrica');
      });
  }

  function setRegion(regionKey) {
    currentRegion = regionKey;
    var region = REGIONS[regionKey];
    
    // Update all pricing elements
    document.querySelectorAll('[data-price-base]').forEach(function(el) {
      var base = parseInt(el.getAttribute('data-price-base'), 10);
      if (base) {
        el.textContent = formatPrice(base, regionKey);
      }
    });
    
    // Update currency labels
    document.querySelectorAll('[data-currency]').forEach(function(el) {
      el.textContent = region.currency;
    });
    
    // Update region info in footer/about
    var regionEl = document.getElementById('user-region');
    if (regionEl) {
      regionEl.textContent = region.label;
    }
    
    // Dispatch event for other modules
    window.dispatchEvent(new CustomEvent('regionchange', { detail: { region: regionKey, data: region } }));
    
    // Update WhatsApp number based on region
    var whatsappLinks = document.querySelectorAll('[data-whatsapp-region]');
    whatsappLinks.forEach(function(link) {
      var defaultUrl = link.getAttribute('href');
      if (regionKey !== 'westAfrica') {
        link.setAttribute('href', 'mailto:akenkdev@gmail.com');
      }
    });
  }

  window.AkenPricing = {
    formatPrice: formatPrice,
    getRegion: function() { return currentRegion; },
    getRegions: function() { return REGIONS; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
