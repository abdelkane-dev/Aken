// Aken — Module de Paiement d'Acompte Multi-Étapes Adaptatif
// Intégration complète : Informations projet, Client, Mode de paiement dynamique & Remise 10%
(function () {
  "use strict";

  var PROJECT_PRICING = {
    "site-vitrine": { name: "Site Vitrine Professionnel", price: 75000 },
    "boutique-web": { name: "Boutique en ligne / Web App", price: 140000 },
    "app-mobile": { name: "Application Mobile (iOS & Android)", price: 220000 },
    "gestion-surmesure": { name: "Système de Gestion / Sur-mesure", price: 320000 },
    "audit-conseil": { name: "Audit & Optimisation Digitale", price: 45000 }
  };

  var state = {
    currentStep: 1,
    projectType: "site-vitrine",
    projectTitle: "",
    isFirstProject: true,
    customTotal: 75000,
    depositAmount: 20250, // 30% de 67 500
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientCompany: "",
    clientCity: "Bamako, Mali",
    paymentMethod: "wave",
    paymentDetails: {}
  };

  function calculateAmounts() {
    var base = PROJECT_PRICING[state.projectType] ? PROJECT_PRICING[state.projectType].price : (state.customTotal || 75000);
    var discount = state.isFirstProject ? Math.round(base * 0.10) : 0;
    var netTotal = base - discount;
    var deposit = Math.round(netTotal * 0.30); // 30% d'acompte
    return {
      basePrice: base,
      discountAmount: discount,
      netTotal: netTotal,
      depositAmount: deposit,
      balanceDue: netTotal - deposit
    };
  }

  function createPaymentModal() {
    var existing = document.getElementById("payment-overlay");
    if (existing) existing.remove();

    var overlay = document.createElement("div");
    overlay.id = "payment-overlay";
    overlay.className = "payment-overlay";

    overlay.innerHTML = [
      '<div class="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">',
      '  <button class="payment-close-btn" id="payment-close-btn" aria-label="Fermer">&times;</button>',
      '  <div class="payment-header">',
      '    <h3 id="payment-modal-title">',
      '      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      '      Démarrer un projet — Payer un acompte',
      '    </h3>',
      '    <p>Sécurisez la planification de votre projet avec un acompte transparent de 30%</p>',
      '  </div>',
      '  <div class="payment-stepper">',
      '    <div class="stepper-step active" id="step-nav-1">',
      '      <span class="stepper-num">1</span>',
      '      <span class="stepper-label">Projet</span>',
      '    </div>',
      '    <div class="stepper-line" id="step-line-1"></div>',
      '    <div class="stepper-step" id="step-nav-2">',
      '      <span class="stepper-num">2</span>',
      '      <span class="stepper-label">Client</span>',
      '    </div>',
      '    <div class="stepper-line" id="step-line-2"></div>',
      '    <div class="stepper-step" id="step-nav-3">',
      '      <span class="stepper-num">3</span>',
      '      <span class="stepper-label">Paiement</span>',
      '    </div>',
      '    <div class="stepper-line" id="step-line-3"></div>',
      '    <div class="stepper-step" id="step-nav-4">',
      '      <span class="stepper-num">4</span>',
      '      <span class="stepper-label">Confirmation</span>',
      '    </div>',
      '  </div>',
      '  <div class="payment-body">',

      // ÉTAPE 1 : PROJET
      '    <div class="step-panel active" id="step-panel-1">',
      '      <div class="promo-toggle-card" id="promo-card-toggle">',
      '        <div class="promo-toggle-left">',
      '          <input type="checkbox" id="check-first-project" checked>',
      '          <div class="promo-toggle-text">',
      '            <strong>Premier projet avec Aken ?</strong>',
      '            <span>Bénéficiez automatiquement de 10% de réduction immédiate</span>',
      '          </div>',
      '        </div>',
      '        <span class="promo-tag-pill">-10% ACTIF</span>',
      '      </div>',
      '      <div class="form-group">',
      '        <label for="input-project-type">Type de solution digitale <span class="req">*</span></label>',
      '        <select id="input-project-type" class="form-control">',
      '          <option value="site-vitrine" selected>Site Vitrine Professionnel (dès 75 000 FCFA)</option>',
      '          <option value="boutique-web">Boutique en ligne / Web App (dès 140 000 FCFA)</option>',
      '          <option value="app-mobile">Application Mobile Android / iOS (dès 220 000 FCFA)</option>',
      '          <option value="gestion-surmesure">Logiciel de Gestion / Sur-Mesure (dès 320 000 FCFA)</option>',
      '          <option value="audit-conseil">Audit, Refonte ou Conseil Stratégique (dès 45 000 FCFA)</option>',
      '        </select>',
      '      </div>',
      '      <div class="form-group">',
      '        <label for="input-project-title">Description sommaire de votre besoin</label>',
      '        <input type="text" id="input-project-title" class="form-control" placeholder="Ex: Boutique de cosmétiques avec Wave et catalogue WhatsApp">',
      '      </div>',
      '      <div class="payment-summary-box" style="margin-bottom:0;">',
      '        <div class="summary-row">',
      '          <span>Budget initial estimé :</span>',
      '          <strong id="live-base-price">75 000 FCFA</strong>',
      '        </div>',
      '        <div class="summary-row discount-row" id="live-discount-row">',
      '          <span>Réduction de bienvenue (10%) :</span>',
      '          <strong id="live-discount-price">-7 500 FCFA</strong>',
      '        </div>',
      '        <div class="summary-row total-row">',
      '          <span>Total projet remisé :</span>',
      '          <strong id="live-net-price">67 500 FCFA</strong>',
      '        </div>',
      '        <div class="summary-row deposit-row">',
      '          <span>Acompte à régler aujourd\'hui (30%) :</span>',
      '          <strong id="live-deposit-price">20 250 FCFA</strong>',
      '        </div>',
      '      </div>',
      '      <div class="modal-nav-buttons">',
      '        <button type="button" class="btn btn-primary" id="btn-next-step-1">Continuer vers mes coordonnées &rarr;</button>',
      '      </div>',
      '    </div>',

      // ÉTAPE 2 : CLIENT
      '    <div class="step-panel" id="step-panel-2">',
      '      <div class="form-row">',
      '        <div class="form-group">',
      '          <label for="input-client-name">Nom complet & Prénom <span class="req">*</span></label>',
      '          <input type="text" id="input-client-name" class="form-control" placeholder="Ex: Ousmane Traoré" required>',
      '        </div>',
      '        <div class="form-group">',
      '          <label for="input-client-phone">Téléphone / WhatsApp <span class="req">*</span></label>',
      '          <input type="tel" id="input-client-phone" class="form-control" placeholder="+223 XX XX XX XX" required>',
      '        </div>',
      '      </div>',
      '      <div class="form-row">',
      '        <div class="form-group">',
      '          <label for="input-client-email">Adresse Email professionnelle <span class="req">*</span></label>',
      '          <input type="email" id="input-client-email" class="form-control" placeholder="ousmane@exemple.com" required>',
      '        </div>',
      '        <div class="form-group">',
      '          <label for="input-client-company">Entreprise / Nom commercial</label>',
      '          <input type="text" id="input-client-company" class="form-control" placeholder="Ex: Traoré Négoce SARL">',
      '        </div>',
      '      </div>',
      '      <div class="form-group">',
      '        <label for="input-client-city">Ville & Pays</label>',
      '        <input type="text" id="input-client-city" class="form-control" value="Bamako, Mali">',
      '      </div>',
      '      <div class="modal-nav-buttons">',
      '        <button type="button" class="btn btn-outline" id="btn-prev-step-2">&larr; Retour</button>',
      '        <button type="button" class="btn btn-primary" id="btn-next-step-2">Choisir le mode de paiement &rarr;</button>',
      '      </div>',
      '    </div>',

      // ÉTAPE 3 : MODE DE PAIEMENT ADAPTATIF
      '    <div class="step-panel" id="step-panel-3">',
      '      <label style="font-size:0.86rem;font-weight:600;margin-bottom:10px;display:block;">Sélectionnez votre moyen de paiement :</label>',
      '      <div class="payment-methods-grid">',
      '        <label class="method-option">',
      '          <input type="radio" name="pay-method" value="wave" checked>',
      '          <div class="method-card">',
      '            <div class="method-icon" style="color:#1da1f2;">🌊</div>',
      '            <div class="method-info">',
      '              <span class="method-name">Wave</span>',
      '              <span class="method-sub">0% de frais • Instantané</span>',
      '            </div>',
      '          </div>',
      '        </label>',
      '        <label class="method-option">',
      '          <input type="radio" name="pay-method" value="orangemoney">',
      '          <div class="method-card">',
      '            <div class="method-icon" style="color:#ff6600;">🍊</div>',
      '            <div class="method-info">',
      '              <span class="method-name">Orange Money</span>',
      '              <span class="method-sub">Code marchand #144#</span>',
      '            </div>',
      '          </div>',
      '        </label>',
      '        <label class="method-option">',
      '          <input type="radio" name="pay-method" value="card">',
      '          <div class="method-card">',
      '            <div class="method-icon" style="color:#ffaa33;">💳</div>',
      '            <div class="method-info">',
      '              <span class="method-name">Carte Bancaire</span>',
      '              <span class="method-sub">Visa & Mastercard</span>',
      '            </div>',
      '          </div>',
      '        </label>',
      '        <label class="method-option">',
      '          <input type="radio" name="pay-method" value="virement">',
      '          <div class="method-card">',
      '            <div class="method-icon" style="color:#14b8a6;">🏛️</div>',
      '            <div class="method-info">',
      '              <span class="method-name">Virement Bancaire</span>',
      '              <span class="method-sub">Compte Société Mali</span>',
      '            </div>',
      '          </div>',
      '        </label>',
      '      </div>',

      // CHAMPS ADAPTATIFS
      '      <div class="adaptive-fields">',
      // Panel Wave
      '        <div class="adaptive-panel active" id="panel-wave">',
      '          <div class="form-group">',
      '            <label for="pay-wave-phone">Numéro Wave du payeur <span class="req">*</span></label>',
      '            <input type="tel" id="pay-wave-phone" class="form-control" placeholder="+223 XX XX XX XX">',
      '          </div>',
      '          <p style="font-size:0.8rem;color:var(--ink-soft);margin:0;">Une demande de validation Wave de <strong><span class="display-deposit-text">20 250 FCFA</span></strong> sera générée directement vers votre application.</p>',
      '        </div>',
      // Panel Orange Money
      '        <div class="adaptive-panel" id="panel-orangemoney">',
      '          <div class="form-group">',
      '            <label for="pay-om-phone">Numéro Orange Money <span class="req">*</span></label>',
      '            <input type="tel" id="pay-om-phone" class="form-control" placeholder="+223 XX XX XX XX">',
      '          </div>',
      '          <div class="form-group" style="margin-bottom:0;">',
      '            <label for="pay-om-otp">Code d\'autorisation éphémère (généré via #144#399#)</label>',
      '            <input type="text" id="pay-om-otp" class="form-control" placeholder="Code à 6 chiffres">',
      '          </div>',
      '        </div>',
      // Panel Carte
      '        <div class="adaptive-panel" id="panel-card">',
      '          <div class="form-group">',
      '            <label for="pay-card-name">Nom figurant sur la carte <span class="req">*</span></label>',
      '            <input type="text" id="pay-card-name" class="form-control" placeholder="OUSMANE TRAORE">',
      '          </div>',
      '          <div class="form-group card-input-wrap">',
      '            <label for="pay-card-number">Numéro de carte Visa / Mastercard <span class="req">*</span></label>',
      '            <input type="text" id="pay-card-number" class="form-control" placeholder="4000 1234 5678 9010" maxlength="19">',
      '            <span class="card-type-icon">💳</span>',
      '          </div>',
      '          <div class="form-row" style="margin-bottom:0;">',
      '            <div class="form-group">',
      '              <label for="pay-card-exp">Date d\'expiration <span class="req">*</span></label>',
      '              <input type="text" id="pay-card-exp" class="form-control" placeholder="MM/AA" maxlength="5">',
      '            </div>',
      '            <div class="form-group">',
      '              <label for="pay-card-cvv">CVV / CVC <span class="req">*</span></label>',
      '              <input type="password" id="pay-card-cvv" class="form-control" placeholder="123" maxlength="4">',
      '            </div>',
      '          </div>',
      '        </div>',
      // Panel Virement
      '        <div class="adaptive-panel" id="panel-virement">',
      '          <div style="font-size:0.84rem;line-height:1.6;color:var(--ink-soft);">',
      '            <p style="margin:0 0 6px 0;"><strong style="color:#fff;">Coordonnées Bancaires Aken :</strong></p>',
      '            <p style="margin:0;">Banque : <strong>BDM-SA (Banque de Développement du Mali)</strong></p>',
      '            <p style="margin:0;">Titulaire : <strong>AKEN DIGITAL SOLUTIONS</strong></p>',
      '            <p style="margin:0;">RIB : <strong>ML016 01201 02548796301 44</strong></p>',
      '            <p style="margin:6px 0 0 0;font-size:0.78rem;color:#ffaa33;">Mentionnez votre nom complet en motif de virement.</p>',
      '          </div>',
      '        </div>',
      '      </div>',

      '      <div class="modal-nav-buttons">',
      '        <button type="button" class="btn btn-outline" id="btn-prev-step-3">&larr; Retour</button>',
      '        <button type="button" class="btn btn-primary" id="btn-next-step-3">Vérifier le récapitulatif &rarr;</button>',
      '      </div>',
      '    </div>',

      // ÉTAPE 4 : RÉCAPITULATIF & VALIDATION
      '    <div class="step-panel" id="step-panel-4">',
      '      <div class="payment-summary-box">',
      '        <div class="summary-row">',
      '          <span>Projet retenu :</span>',
      '          <strong id="recap-project-name">Site Vitrine Professionnel</strong>',
      '        </div>',
      '        <div class="summary-row">',
      '          <span>Client & Contact :</span>',
      '          <strong id="recap-client-info">—</strong>',
      '        </div>',
      '        <div class="summary-row">',
      '          <span>Méthode de paiement :</span>',
      '          <strong id="recap-payment-method">Wave</strong>',
      '        </div>',
      '        <div class="summary-row">',
      '          <span>Tarif officiel de base :</span>',
      '          <span id="recap-base-price">75 000 FCFA</span>',
      '        </div>',
      '        <div class="summary-row discount-row" id="recap-discount-row">',
      '          <span>Remise 1er projet (-10%) :</span>',
      '          <strong id="recap-discount-amount">-7 500 FCFA</strong>',
      '        </div>',
      '        <div class="summary-row total-row">',
      '          <span>Montant Total Contractuel :</span>',
      '          <strong id="recap-net-total">67 500 FCFA</strong>',
      '        </div>',
      '        <div class="summary-row deposit-row">',
      '          <span>Acompte de démarrage (30%) :</span>',
      '          <strong id="recap-deposit-amount">20 250 FCFA</strong>',
      '        </div>',
      '        <div class="summary-row" style="padding-top:8px;font-size:0.78rem;color:var(--ink-soft);">',
      '          <span>Solde restant (à la livraison finale) :</span>',
      '          <span id="recap-balance-amount">47 250 FCFA</span>',
      '        </div>',
      '      </div>',

      '      <p style="font-size:0.8rem;color:var(--ink-soft);text-align:center;margin-bottom:18px;">',
      '        En validant, un reçu officiel vous est délivré et notre équipe technique est notifiée immédiatement.',
      '      </p>',

      '      <div class="modal-nav-buttons">',
      '        <button type="button" class="btn btn-outline" id="btn-prev-step-4">&larr; Modifier</button>',
      '        <button type="button" class="btn btn-primary" id="btn-final-confirm">',
      '          Confirmer et Régler l\'Acompte',
      '        </button>',
      '      </div>',
      '    </div>',

      // SUCCÈS & VALIDATION
      '    <div class="payment-success" id="payment-success" style="display:none;text-align:center;padding:32px 16px;">',
      '      <div style="font-size:3.5rem;margin-bottom:12px;">✅</div>',
      '      <h3 style="font-size:1.4rem;color:#fff;margin-bottom:8px;">Acompte & Projet Enregistrés !</h3>',
      '      <p style="font-size:0.9rem;color:var(--ink-soft);line-height:1.6;margin-bottom:24px;">',
      '        Félicitations <strong id="success-client-name" style="color:#fff;"></strong> ! Votre dossier a été créé avec succès avec la remise de 10% premier projet appliquée. Notre équipe prend contact avec vous sous 24h.',
      '      </p>',
      '      <div style="display:flex;flex-direction:column;gap:10px;">',
      '        <a href="#" class="btn btn-primary" id="success-whatsapp-link" target="_blank" rel="noopener">',
      '          Transmettre le récapitulatif sur WhatsApp &rarr;',
      '        </a>',
      '        <button type="button" class="btn btn-outline" id="success-close-btn">Terminer</button>',
      '      </div>',
      '    </div>',

      '  </div>',
      '</div>'
    ].join("\n");

    document.body.appendChild(overlay);
    bindModalEvents(overlay);
    return overlay;
  }

  function goToStep(step) {
    state.currentStep = step;
    for (var i = 1; i <= 4; i++) {
      var panel = document.getElementById("step-panel-" + i);
      var nav = document.getElementById("step-nav-" + i);
      var line = document.getElementById("step-line-" + (i - 1));

      if (panel) panel.classList.toggle("active", i === step);
      if (nav) {
        nav.classList.toggle("active", i === step);
        nav.classList.toggle("completed", i < step);
      }
      if (line) {
        line.classList.toggle("completed", i <= step);
      }
    }
  }

  function refreshLivePricing() {
    var amounts = calculateAmounts();
    var liveBase = document.getElementById("live-base-price");
    var liveDiscountRow = document.getElementById("live-discount-row");
    var liveDiscount = document.getElementById("live-discount-price");
    var liveNet = document.getElementById("live-net-price");
    var liveDeposit = document.getElementById("live-deposit-price");
    var depositTexts = document.querySelectorAll(".display-deposit-text");

    if (liveBase) liveBase.textContent = amounts.basePrice.toLocaleString("fr-FR") + " FCFA";
    if (liveDiscountRow) liveDiscountRow.style.display = state.isFirstProject ? "flex" : "none";
    if (liveDiscount) liveDiscount.textContent = "-" + amounts.discountAmount.toLocaleString("fr-FR") + " FCFA";
    if (liveNet) liveNet.textContent = amounts.netTotal.toLocaleString("fr-FR") + " FCFA";
    if (liveDeposit) liveDeposit.textContent = amounts.depositAmount.toLocaleString("fr-FR") + " FCFA";

    depositTexts.forEach(function (el) {
      el.textContent = amounts.depositAmount.toLocaleString("fr-FR") + " FCFA";
    });
  }

  function updateRecap() {
    var amounts = calculateAmounts();
    var projInfo = PROJECT_PRICING[state.projectType] || { name: "Projet Sur-Mesure", price: amounts.basePrice };

    var recapProj = document.getElementById("recap-project-name");
    var recapClient = document.getElementById("recap-client-info");
    var recapMethod = document.getElementById("recap-payment-method");
    var recapBase = document.getElementById("recap-base-price");
    var recapDiscRow = document.getElementById("recap-discount-row");
    var recapDisc = document.getElementById("recap-discount-amount");
    var recapNet = document.getElementById("recap-net-total");
    var recapDeposit = document.getElementById("recap-deposit-amount");
    var recapBalance = document.getElementById("recap-balance-amount");

    if (recapProj) recapProj.textContent = projInfo.name + (state.projectTitle ? " (" + state.projectTitle + ")" : "");
    if (recapClient) recapClient.textContent = (state.clientName || "Client") + " • " + (state.clientPhone || "Non renseigné");

    var methodLabels = {
      wave: "Wave Mobile Money",
      orangemoney: "Orange Money Mali",
      card: "Carte Bancaire (Visa/Mastercard)",
      virement: "Virement Bancaire Société"
    };
    if (recapMethod) recapMethod.textContent = methodLabels[state.paymentMethod] || state.paymentMethod;

    if (recapBase) recapBase.textContent = amounts.basePrice.toLocaleString("fr-FR") + " FCFA";
    if (recapDiscRow) recapDiscRow.style.display = state.isFirstProject ? "flex" : "none";
    if (recapDisc) recapDisc.textContent = "-" + amounts.discountAmount.toLocaleString("fr-FR") + " FCFA";
    if (recapNet) recapNet.textContent = amounts.netTotal.toLocaleString("fr-FR") + " FCFA";
    if (recapDeposit) recapDeposit.textContent = amounts.depositAmount.toLocaleString("fr-FR") + " FCFA";
    if (recapBalance) recapBalance.textContent = amounts.balanceDue.toLocaleString("fr-FR") + " FCFA";
  }

  function bindModalEvents(overlay) {
    // Close modal
    var closeBtn = overlay.querySelector("#payment-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closePaymentModal);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closePaymentModal();
    });

    // Étape 1 : Type de projet
    var selectType = overlay.querySelector("#input-project-type");
    if (selectType) {
      selectType.addEventListener("change", function () {
        state.projectType = selectType.value;
        refreshLivePricing();
      });
    }

    // Étape 1 : Checkbox premier projet
    var checkPromo = overlay.querySelector("#check-first-project");
    if (checkPromo) {
      checkPromo.addEventListener("change", function () {
        state.isFirstProject = checkPromo.checked;
        var tag = overlay.querySelector(".promo-tag-pill");
        if (tag) {
          tag.textContent = state.isFirstProject ? "-10% ACTIF" : "DÉSACTIVÉ";
          tag.style.background = state.isFirstProject ? "#ffaa33" : "rgba(255,255,255,0.15)";
        }
        refreshLivePricing();
      });
    }

    // Bouton Étape 1 -> 2
    var btnStep1 = overlay.querySelector("#btn-next-step-1");
    if (btnStep1) {
      btnStep1.addEventListener("click", function () {
        var titleInput = overlay.querySelector("#input-project-title");
        if (titleInput) state.projectTitle = titleInput.value.trim();
        goToStep(2);
      });
    }

    // Boutons Étape 2
    var btnPrev2 = overlay.querySelector("#btn-prev-step-2");
    if (btnPrev2) btnPrev2.addEventListener("click", function () { goToStep(1); });

    var btnStep2 = overlay.querySelector("#btn-next-step-2");
    if (btnStep2) {
      btnStep2.addEventListener("click", function () {
        var nameInp = overlay.querySelector("#input-client-name");
        var phoneInp = overlay.querySelector("#input-client-phone");
        var emailInp = overlay.querySelector("#input-client-email");
        var compInp = overlay.querySelector("#input-client-company");
        var cityInp = overlay.querySelector("#input-client-city");

        if (!nameInp || !nameInp.value.trim()) {
          alert("Veuillez indiquer votre nom complet.");
          if (nameInp) nameInp.focus();
          return;
        }
        if (!phoneInp || !phoneInp.value.trim()) {
          alert("Veuillez indiquer votre numéro de téléphone / WhatsApp.");
          if (phoneInp) phoneInp.focus();
          return;
        }

        state.clientName = nameInp.value.trim();
        state.clientPhone = phoneInp.value.trim();
        state.clientEmail = emailInp ? emailInp.value.trim() : "";
        state.clientCompany = compInp ? compInp.value.trim() : "";
        state.clientCity = cityInp ? cityInp.value.trim() : "Bamako, Mali";

        refreshLivePricing();
        goToStep(3);
      });
    }

    // Étape 3 : Changement de moyen de paiement adaptatif
    var methodRadios = overlay.querySelectorAll('input[name="pay-method"]');
    methodRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        state.paymentMethod = radio.value;
        // Basculer les panels
        overlay.querySelectorAll(".adaptive-panel").forEach(function (p) {
          p.classList.remove("active");
        });
        var activePanel = overlay.querySelector("#panel-" + radio.value);
        if (activePanel) activePanel.classList.add("active");
      });
    });

    // Formatage auto numéro de carte (4x4)
    var cardNumInput = overlay.querySelector("#pay-card-number");
    if (cardNumInput) {
      cardNumInput.addEventListener("input", function (e) {
        var val = e.target.value.replace(/\D/g, "").substring(0, 16);
        var formatted = val.match(/.{1,4}/g)?.join(" ") || val;
        e.target.value = formatted;
      });
    }

    // Formatage expiration MM/AA
    var cardExpInput = overlay.querySelector("#pay-card-exp");
    if (cardExpInput) {
      cardExpInput.addEventListener("input", function (e) {
        var val = e.target.value.replace(/\D/g, "").substring(0, 4);
        if (val.length >= 2) {
          e.target.value = val.substring(0, 2) + "/" + val.substring(2);
        } else {
          e.target.value = val;
        }
      });
    }

    // Boutons Étape 3
    var btnPrev3 = overlay.querySelector("#btn-prev-step-3");
    if (btnPrev3) btnPrev3.addEventListener("click", function () { goToStep(2); });

    var btnStep3 = overlay.querySelector("#btn-next-step-3");
    if (btnStep3) {
      btnStep3.addEventListener("click", function () {
        updateRecap();
        goToStep(4);
      });
    }

    // Boutons Étape 4
    var btnPrev4 = overlay.querySelector("#btn-prev-step-4");
    if (btnPrev4) btnPrev4.addEventListener("click", function () { goToStep(3); });

    // Confirmation finale
    var btnFinal = overlay.querySelector("#btn-final-confirm");
    if (btnFinal) {
      btnFinal.addEventListener("click", function () {
        var amounts = calculateAmounts();
        var projInfo = PROJECT_PRICING[state.projectType] || { name: "Projet Web" };

        btnFinal.disabled = true;
        btnFinal.innerHTML = "Traitement et sécurisation...";

        setTimeout(function () {
          // Masquer panels et stepper
          overlay.querySelectorAll(".step-panel").forEach(function (p) { p.style.display = "none"; });
          var stepper = overlay.querySelector(".payment-stepper");
          if (stepper) stepper.style.display = "none";

          var successPanel = overlay.querySelector("#payment-success");
          if (successPanel) successPanel.style.display = "block";

          var clientNameEl = overlay.querySelector("#success-client-name");
          if (clientNameEl) clientNameEl.textContent = state.clientName;

          // Message WhatsApp
          var waMsg = "Bonjour Aken ! Je viens de valider mon acompte de projet sur votre site :\n\n";
          waMsg += "📌 Projet : " + projInfo.name + "\n";
          if (state.projectTitle) waMsg += "📝 Détails : " + state.projectTitle + "\n";
          waMsg += "👤 Client : " + state.clientName + "\n";
          waMsg += "📞 Téléphone : " + state.clientPhone + "\n";
          if (state.clientCompany) waMsg += "🏢 Entreprise : " + state.clientCompany + "\n";
          waMsg += "💰 Mode : " + state.paymentMethod.toUpperCase() + "\n";
          waMsg += "🏷️ Remise 1er projet : " + (state.isFirstProject ? "-10% (-" + amounts.discountAmount.toLocaleString("fr-FR") + " FCFA)" : "Non") + "\n";
          waMsg += "💵 Total Net : " + amounts.netTotal.toLocaleString("fr-FR") + " FCFA\n";
          waMsg += "✅ Acompte Réglé (30%) : " + amounts.depositAmount.toLocaleString("fr-FR") + " FCFA\n\n";
          waMsg += "Merci de me confirmer la bonne réception et le planning de démarrage !";

          var waLink = overlay.querySelector("#success-whatsapp-link");
          if (waLink) {
            waLink.href = "https://wa.me/22393789916?text=" + encodeURIComponent(waMsg);
          }
        }, 1200);
      });
    }

    // Fermeture après succès
    var successClose = overlay.querySelector("#success-close-btn");
    if (successClose) {
      successClose.addEventListener("click", closePaymentModal);
    }
  }

  function openPaymentModal(initialAmount, projectKey) {
    var overlay = document.getElementById("payment-overlay");
    if (!overlay) overlay = createPaymentModal();

    if (projectKey && PROJECT_PRICING[projectKey]) {
      state.projectType = projectKey;
      var selectType = overlay.querySelector("#input-project-type");
      if (selectType) selectType.value = projectKey;
    }

    // Réinitialiser à l'étape 1
    goToStep(1);
    refreshLivePricing();

    overlay.querySelectorAll(".step-panel").forEach(function (p) { p.style.display = ""; });
    var stepper = overlay.querySelector(".payment-stepper");
    if (stepper) stepper.style.display = "";
    var successPanel = overlay.querySelector("#payment-success");
    if (successPanel) successPanel.style.display = "none";
    var btnFinal = overlay.querySelector("#btn-final-confirm");
    if (btnFinal) {
      btnFinal.disabled = false;
      btnFinal.textContent = "Confirmer et Régler l'Acompte";
    }

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closePaymentModal() {
    var overlay = document.getElementById("payment-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  function init() {
    // Boutons déclencheurs
    document.querySelectorAll("[data-payment-open]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var amount = parseInt(btn.getAttribute("data-amount"), 10) || 20250;
        var proj = btn.getAttribute("data-project") || "site-vitrine";
        openPaymentModal(amount, proj);
      });
    });

    // Touche Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePaymentModal();
    });

    // Exposer globalement pour intégrations
    window.AkenPayment = {
      open: openPaymentModal,
      close: closePaymentModal
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
