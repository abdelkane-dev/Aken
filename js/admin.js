// ==========================================================================
// AKEN — LOGIQUE DU PORTAIL D'ADMINISTRATION
// Authentification, Gestion des Leads, Pipeline, Partage & Permissions
// ==========================================================================

(function () {
  "use strict";

  // Configuration par défaut (hachage SHA-256 pour aken2026)
  // sha256("aken2026") = "837c4bc9360d85f8888f27d2d59cb4c8c27dae05adfb1e964ac85f7a58e56a79"
  var DEFAULT_ADMIN_HASH = "837c4bc9360d85f8888f27d2d59cb4c8c27dae05adfb1e964ac85f7a58e56a79";

  var state = {
    currentUser: null, // { role: "super_admin" | "collaborateur", name: string }
    currentTab: "dashboard",
    currentFilter: "all",
    searchQuery: "",
    leads: [],
    projects: [],
    notes: [],
    sharedLinks: [],
    collabKeys: []
  };

  // --------------------------------------------------------------------------
  // 1. UTILITAIRES & SÉCURITÉ
  // --------------------------------------------------------------------------
  async function sha256(message) {
    var msgBuffer = new TextEncoder().encode(message);
    var hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function formatFCFA(amount) {
    return (amount || 0).toLocaleString("fr-FR") + " FCFA";
  }

  function formatDate(isoStr) {
    if (!isoStr) return "";
    var d = new Date(isoStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  // --------------------------------------------------------------------------
  // 2. DONNÉES PAR DÉFAUT & PERSISTANCE (localStorage)
  // --------------------------------------------------------------------------
  function initStorage() {
    var storedLeads = localStorage.getItem("aken_admin_leads");
    if (!storedLeads) {
      // Données de bienvenue de démonstration
      var demoLeads = [
        {
          id: "lead_demo_1",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          type: "acompte",
          status: "acompte_recu",
          name: "Mamadou Traoré",
          phone: "+223 76 12 34 56",
          email: "m.traore@business-mali.com",
          company: "Traoré Import-Export",
          projectType: "boutique-web",
          projectName: "Boutique en ligne / Web App",
          projectTitle: "Boutique d'équipements avec paiement Wave",
          paymentMethod: "wave",
          totalAmount: 140000,
          depositAmount: 37800,
          balanceDue: 88200,
          source: "Modal Acompte 30%"
        },
        {
          id: "lead_demo_2",
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          type: "contact",
          status: "nouveau",
          name: "Fatoumata Diarra",
          phone: "+223 91 45 67 89",
          email: "fatou.diarra@consulting.ml",
          company: "Diarra Consulting",
          message: "Bonjour Aken, nous cherchons un site vitrine professionnel pour notre cabinet à Hamdallaye ACI 2000. Pouvez-vous nous envoyer un devis ?",
          source: "Formulaire de contact principal"
        }
      ];
      localStorage.setItem("aken_admin_leads", JSON.stringify(demoLeads));
      state.leads = demoLeads;
    } else {
      try { state.leads = JSON.parse(storedLeads); } catch (e) { state.leads = []; }
    }

    var storedProjects = localStorage.getItem("aken_admin_projects");
    if (!storedProjects) {
      var demoProjects = [
        {
          id: "proj_1",
          title: "Refonte Vitrine & Catalogue",
          client: "Mamadou Traoré (Traoré Import-Export)",
          phone: "+223 76 12 34 56",
          total: 140000,
          paid: 37800,
          status: "en_cours", // cadrage, acompte, en_cours, termine
          progress: 50,
          notes: "Maquettes Figma validées. Intégration en cours.",
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("aken_admin_projects", JSON.stringify(demoProjects));
      state.projects = demoProjects;
    } else {
      try { state.projects = JSON.parse(storedProjects); } catch (e) { state.projects = []; }
    }

    var storedNotes = localStorage.getItem("aken_admin_notes");
    if (!storedNotes) {
      var demoNotes = [
        {
          id: "note_1",
          author: "Abdelkane",
          date: new Date().toISOString(),
          text: "Bienvenue dans l'espace Admin Aken ! Ici vous pouvez gérer tous les leads entrants, suivre les projets de nos clients maliens et internationaux, et générer les devis officiels."
        }
      ];
      localStorage.setItem("aken_admin_notes", JSON.stringify(demoNotes));
      state.notes = demoNotes;
    } else {
      try { state.notes = JSON.parse(storedNotes); } catch (e) { state.notes = []; }
    }

    var storedLinks = localStorage.getItem("aken_admin_links");
    if (!storedLinks) {
      var demoLinks = [
        { id: "link_1", title: "GitHub Aken Repo", url: "https://github.com/abdelkane-dev/Aken", category: "Code" },
        { id: "link_2", title: "Compte WhatsApp Business", url: "https://wa.me/22393789916", category: "Support" }
      ];
      localStorage.setItem("aken_admin_links", JSON.stringify(demoLinks));
      state.sharedLinks = demoLinks;
    } else {
      try { state.sharedLinks = JSON.parse(storedLinks); } catch (e) { state.sharedLinks = []; }
    }

    var storedKeys = localStorage.getItem("aken_admin_collab_keys");
    if (!storedKeys) {
      var demoKeys = [
        { id: "key_1", name: "Collaborateur Développeur", code: "AKEN-DEV-77", role: "collaborateur", createdAt: new Date().toISOString() }
      ];
      localStorage.setItem("aken_admin_collab_keys", JSON.stringify(demoKeys));
      state.collabKeys = demoKeys;
    } else {
      try { state.collabKeys = JSON.parse(storedKeys); } catch (e) { state.collabKeys = []; }
    }
  }

  function persistAll() {
    localStorage.setItem("aken_admin_leads", JSON.stringify(state.leads));
    localStorage.setItem("aken_admin_projects", JSON.stringify(state.projects));
    localStorage.setItem("aken_admin_notes", JSON.stringify(state.notes));
    localStorage.setItem("aken_admin_links", JSON.stringify(state.sharedLinks));
    localStorage.setItem("aken_admin_collab_keys", JSON.stringify(state.collabKeys));
    updateBadges();
  }

  // --------------------------------------------------------------------------
  // 3. AUTHENTIFICATION & SESSIONS
  // --------------------------------------------------------------------------
  async function checkAuthOnLoad() {
    var session = sessionStorage.getItem("aken_admin_session");
    if (session) {
      try {
        var user = JSON.parse(session);
        if (user && user.role) {
          loginSuccess(user);
          return;
        }
      } catch (e) {}
    }
    showLockscreen();
  }

  function showLockscreen() {
    var lock = document.getElementById("admin-lockscreen");
    if (lock) lock.classList.remove("hidden");
  }

  function hideLockscreen() {
    var lock = document.getElementById("admin-lockscreen");
    if (lock) lock.classList.add("hidden");
  }

  function loginSuccess(user) {
    state.currentUser = user;
    sessionStorage.setItem("aken_admin_session", JSON.stringify(user));
    hideLockscreen();

    // Mettre à jour profil dans la sidebar
    var nameEl = document.getElementById("admin-user-name");
    var levelEl = document.getElementById("admin-user-level");
    if (nameEl) nameEl.textContent = user.name;
    if (levelEl) levelEl.textContent = user.role === "super_admin" ? "Super Admin (Fondateur)" : "Collaborateur Autorisé";

    // Cacher les sections sensibles si collaborateur simple
    var permTab = document.querySelector("[data-tab='permissions']");
    if (permTab && user.role !== "super_admin") {
      permTab.style.display = "none";
    }

    renderAllViews();
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    var input = document.getElementById("lockscreen-password");
    var errorEl = document.getElementById("lockscreen-error");
    if (!input || !errorEl) return;

    var val = input.value.trim();
    if (!val) {
      errorEl.textContent = "Veuillez saisir votre clé ou mot de passe.";
      return;
    }

    var hashed = await sha256(val);
    var savedMasterHash = localStorage.getItem("aken_admin_master_hash") || DEFAULT_ADMIN_HASH;

    // 1. Vérification Super Admin (Mot de passe maître)
    if (hashed === savedMasterHash) {
      errorEl.textContent = "";
      input.value = "";
      loginSuccess({ role: "super_admin", name: "Abdelkane" });
      return;
    }

    // 2. Vérification Clés Collaborateurs
    var matchedKey = state.collabKeys.find(function (k) { return k.code === val; });
    if (matchedKey) {
      errorEl.textContent = "";
      input.value = "";
      loginSuccess({ role: matchedKey.role || "collaborateur", name: matchedKey.name });
      return;
    }

    errorEl.textContent = "Code d'accès incorrect ou non autorisé.";
    input.focus();
    input.select();
  }

  function handleLogout() {
    sessionStorage.removeItem("aken_admin_session");
    state.currentUser = null;
    showLockscreen();
  }

  // --------------------------------------------------------------------------
  // 4. NAVIGATION ENTRE ONGLETS
  // --------------------------------------------------------------------------
  function switchTab(tabId) {
    state.currentTab = tabId;

    document.querySelectorAll(".nav-item").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });

    document.querySelectorAll(".admin-view").forEach(function (view) {
      view.classList.toggle("active", view.id === "view-" + tabId);
    });

    var pageTitle = document.getElementById("current-page-title");
    if (pageTitle) {
      var titles = {
        dashboard: "Tableau de bord & Activité",
        inbox: "Boîte de Réception des Demandes",
        pipeline: "Suivi des Projets Clients",
        tools: "Espace d'Échange & Outils",
        permissions: "Gestion des Clés & Sécurité"
      };
      pageTitle.textContent = titles[tabId] || "Administration Aken";
    }

    // Fermer sidebar mobile si ouverte
    var sidebar = document.getElementById("admin-sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }

  function updateBadges() {
    var newLeadsCount = state.leads.filter(function (l) { return l.status === "nouveau" || l.status === "acompte_recu"; }).length;
    var badge = document.getElementById("inbox-badge");
    if (badge) {
      badge.textContent = newLeadsCount;
      badge.style.display = newLeadsCount > 0 ? "inline-block" : "none";
    }
  }

  // --------------------------------------------------------------------------
  // 5. RENDU DU DASHBOARD (STATISTIQUES)
  // --------------------------------------------------------------------------
  function renderDashboard() {
    var totalLeads = state.leads.length;
    var newLeads = state.leads.filter(function (l) { return l.status === "nouveau" || l.status === "acompte_recu"; }).length;
    var activeProjects = state.projects.filter(function (p) { return p.status !== "termine"; }).length;

    var totalRevenue = state.leads
      .filter(function (l) { return l.status === "acompte_recu"; })
      .reduce(function (sum, l) { return sum + (l.depositAmount || 0); }, 0);

    var elNewLeads = document.getElementById("stat-new-leads");
    var elActiveProj = document.getElementById("stat-active-projects");
    var elTotalRev = document.getElementById("stat-total-revenue");
    var elTotalLeads = document.getElementById("stat-total-leads");

    if (elNewLeads) elNewLeads.textContent = newLeads;
    if (elActiveProj) elActiveProj.textContent = activeProjects;
    if (elTotalRev) elTotalRev.textContent = formatFCFA(totalRevenue);
    if (elTotalLeads) elTotalLeads.textContent = totalLeads;

    // Derniers leads récents dans le dashboard
    var recentContainer = document.getElementById("dashboard-recent-leads");
    if (recentContainer) {
      var recent = state.leads.slice(0, 5);
      if (recent.length === 0) {
        recentContainer.innerHTML = '<p style="color:var(--admin-text-dim);padding:16px;">Aucune demande pour l\'instant.</p>';
      } else {
        recentContainer.innerHTML = recent.map(renderLeadCardHtml).join("");
        bindLeadActionButtons(recentContainer);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 6. RENDU DE LA BOÎTE DE RÉCEPTION
  // --------------------------------------------------------------------------
  function renderLeadCardHtml(lead) {
    var isDeposit = lead.type === "acompte";
    var badgeClass = lead.status || "nouveau";
    var badgeLabels = {
      nouveau: "Nouveau",
      contacte: "En contact",
      devis_envoye: "Devis envoyé",
      acompte_recu: "Acompte Réglé",
      archive: "Archivé"
    };

    var waPhone = (lead.phone || "").replace(/[^0-9]/g, "");
    var waMsg = "Bonjour " + (lead.name || "") + ", c'est Abdelkane de l'agence Aken. J'ai bien reçu votre demande sur notre site.";
    var waUrl = waPhone ? "https://wa.me/" + waPhone + "?text=" + encodeURIComponent(waMsg) : "https://wa.me/22393789916";

    var snippet = lead.message || (lead.projectName ? (lead.projectName + (lead.projectTitle ? " — " + lead.projectTitle : "")) : "Demande sans détail");
    if (isDeposit) {
      snippet = "💵 Acompte validé : " + formatFCFA(lead.depositAmount) + " sur un total de " + formatFCFA(lead.totalAmount) + " (" + (lead.paymentMethod || "").toUpperCase() + ")";
    }

    return [
      '<div class="lead-card ' + badgeClass + '" data-id="' + lead.id + '">',
      '  <div class="lead-left">',
      '    <div class="lead-avatar ' + (isDeposit ? "acompte" : "") + '">',
      '      ' + (lead.name ? lead.name.charAt(0).toUpperCase() : "A"),
      '    </div>',
      '    <div class="lead-details">',
      '      <div class="lead-header-row">',
      '        <span class="lead-name">' + (lead.name || "Client Anonyme") + '</span>',
      '        <span class="lead-badge ' + badgeClass + '">' + (badgeLabels[lead.status] || lead.status) + '</span>',
      '        <span class="lead-time">' + formatDate(lead.createdAt) + '</span>',
      '      </div>',
      '      <div class="lead-meta">',
      lead.phone ? '<span>📞 ' + lead.phone + '</span>' : '',
      lead.email ? '<span>✉️ ' + lead.email + '</span>' : '',
      lead.company ? '<span>🏢 ' + lead.company + '</span>' : '',
      '<span>📍 ' + (lead.source || "Site web") + '</span>',
      '      </div>',
      '      <div class="lead-message-snippet">' + snippet + '</div>',
      '    </div>',
      '  </div>',
      '  <div class="lead-actions">',
      lead.phone ? '    <a href="' + waUrl + '" target="_blank" rel="noopener" class="btn-icon-action wa" title="Contacter sur WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 1 1-4.1-7.3L21 3l-1.2 4a8.46 8.46 0 0 1 1.2 4.5z"/></svg></a>' : '',
      lead.email ? '    <a href="mailto:' + lead.email + '" class="btn-icon-action mail" title="Envoyer un e-mail"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>' : '',
      '    <button class="btn-icon-action btn-detail-lead" data-id="' + lead.id + '" title="Voir le détail"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>',
      '    <button class="btn-icon-action del btn-delete-lead" data-id="' + lead.id + '" title="Supprimer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function bindLeadActionButtons(container) {
    container.querySelectorAll(".btn-detail-lead").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        openLeadModal(id);
      });
    });

    container.querySelectorAll(".btn-delete-lead").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (confirm("Confirmer la suppression de cette demande ?")) {
          state.leads = state.leads.filter(function (l) { return l.id !== id; });
          persistAll();
          renderInbox();
          renderDashboard();
        }
      });
    });
  }

  function renderInbox() {
    var container = document.getElementById("inbox-leads-container");
    if (!container) return;

    var filtered = state.leads.filter(function (lead) {
      if (state.currentFilter === "nouveau" && lead.status !== "nouveau") return false;
      if (state.currentFilter === "acompte" && lead.type !== "acompte") return false;
      if (state.currentFilter === "contact" && lead.type !== "contact") return false;
      if (state.currentFilter === "archive" && lead.status !== "archive") return false;

      if (state.searchQuery) {
        var q = state.searchQuery.toLowerCase();
        var matchName = (lead.name || "").toLowerCase().indexOf(q) > -1;
        var matchPhone = (lead.phone || "").toLowerCase().indexOf(q) > -1;
        var matchEmail = (lead.email || "").toLowerCase().indexOf(q) > -1;
        var matchMsg = (lead.message || "").toLowerCase().indexOf(q) > -1;
        var matchCompany = (lead.company || "").toLowerCase().indexOf(q) > -1;
        return matchName || matchPhone || matchEmail || matchMsg || matchCompany;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:48px 20px;color:var(--admin-text-dim);">' +
        '<p style="font-size:1.1rem;margin-bottom:8px;">Aucune demande trouvée.</p>' +
        '<p style="font-size:0.85rem;">Les nouveaux formulaires envoyés depuis le site apparaîtront ici automatiquement.</p>' +
        '</div>';
      return;
    }

    container.innerHTML = filtered.map(renderLeadCardHtml).join("");
    bindLeadActionButtons(container);
  }

  // --------------------------------------------------------------------------
  // 7. MODALE DÉTAIL D'UN LEAD & CONVERSION EN PROJET
  // --------------------------------------------------------------------------
  function openLeadModal(leadId) {
    var lead = state.leads.find(function (l) { return l.id === leadId; });
    if (!lead) return;

    var modal = document.getElementById("admin-modal");
    var body = document.getElementById("admin-modal-body");
    var title = document.getElementById("admin-modal-title");
    if (!modal || !body || !title) return;

    title.textContent = "Détail de la demande — " + (lead.name || "Client");

    body.innerHTML = [
      '<div style="display:flex;flex-direction:column;gap:16px;">',
      '  <div style="display:flex;justify-content:space-between;align-items:center;">',
      '    <span class="lead-badge ' + (lead.status || "nouveau") + '" style="font-size:0.85rem;padding:4px 12px;">' + (lead.status || "Nouveau").toUpperCase() + '</span>',
      '    <span style="font-size:0.8rem;color:var(--admin-text-dim);">' + formatDate(lead.createdAt) + '</span>',
      '  </div>',
      '  <div style="background:rgba(255,255,255,0.03);padding:16px;border-radius:8px;border:1px solid var(--admin-border);">',
      '    <p style="margin-bottom:6px;"><strong>👤 Nom :</strong> ' + (lead.name || "N/A") + '</p>',
      '    <p style="margin-bottom:6px;"><strong>📞 Téléphone :</strong> ' + (lead.phone || "Non renseigné") + '</p>',
      '    <p style="margin-bottom:6px;"><strong>✉️ E-mail :</strong> ' + (lead.email || "Non renseigné") + '</p>',
      '    <p style="margin-bottom:6px;"><strong>🏢 Entreprise :</strong> ' + (lead.company || "Particulier") + '</p>',
      lead.projectName ? '<p style="margin-bottom:6px;"><strong>📌 Type de Projet :</strong> ' + lead.projectName + '</p>' : '',
      lead.totalAmount ? '<p style="margin-bottom:6px;"><strong>💰 Montant total :</strong> ' + formatFCFA(lead.totalAmount) + '</p>' : '',
      lead.depositAmount ? '<p style="margin-bottom:6px;color:var(--admin-mint);"><strong>✅ Acompte (30%) :</strong> ' + formatFCFA(lead.depositAmount) + ' (' + (lead.paymentMethod || "").toUpperCase() + ')</p>' : '',
      '  </div>',
      lead.message ? '<div><h4 style="font-size:0.9rem;margin-bottom:6px;color:var(--admin-text-muted);">Message du client :</h4><div style="background:rgba(255,255,255,0.02);padding:14px;border-radius:8px;border:1px solid var(--admin-border);font-size:0.9rem;line-height:1.5;">' + lead.message + '</div></div>' : '',
      '  <div class="form-group-admin" style="margin-top:10px;">',
      '    <label>Changer le statut :</label>',
      '    <select id="modal-lead-status" class="form-control-admin">',
      '      <option value="nouveau"' + (lead.status === "nouveau" ? " selected" : "") + '>Nouveau</option>',
      '      <option value="contacte"' + (lead.status === "contacte" ? " selected" : "") + '>En contact (WhatsApp/Mail)</option>',
      '      <option value="devis_envoye"' + (lead.status === "devis_envoye" ? " selected" : "") + '>Devis envoyé</option>',
      '      <option value="acompte_recu"' + (lead.status === "acompte_recu" ? " selected" : "") + '>Acompte reçu</option>',
      '      <option value="archive"' + (lead.status === "archive" ? " selected" : "") + '>Archivé</option>',
      '    </select>',
      '  </div>',
      '  <div style="display:flex;gap:12px;margin-top:10px;">',
      '    <button id="modal-save-lead-status" class="btn-action-primary" style="flex:1;">Enregistrer le statut</button>',
      '    <button id="modal-convert-to-project" class="btn-action-light" style="flex:1;">🚀 Convertir en Projet Actif</button>',
      '  </div>',
      '</div>'
    ].join("");

    modal.classList.remove("hidden");

    var saveBtn = document.getElementById("modal-save-lead-status");
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var newStatus = document.getElementById("modal-lead-status").value;
        lead.status = newStatus;
        persistAll();
        renderInbox();
        renderDashboard();
        closeModal();
      });
    }

    var convertBtn = document.getElementById("modal-convert-to-project");
    if (convertBtn) {
      convertBtn.addEventListener("click", function () {
        var newProj = {
          id: "proj_" + Date.now(),
          title: lead.projectTitle || lead.projectName || ("Projet pour " + (lead.name || "Client")),
          client: lead.name + (lead.company ? " (" + lead.company + ")" : ""),
          phone: lead.phone || "",
          total: lead.totalAmount || 75000,
          paid: lead.depositAmount || 0,
          status: lead.status === "acompte_recu" ? "en_cours" : "cadrage",
          progress: lead.status === "acompte_recu" ? 30 : 10,
          notes: lead.message || "Projet créé depuis la boîte de réception",
          updatedAt: new Date().toISOString()
        };
        state.projects.unshift(newProj);
        lead.status = "devis_envoye";
        persistAll();
        renderProjects();
        renderDashboard();
        closeModal();
        alert("✅ Projet créé avec succès ! Consultez l'onglet 'Suivi des Projets'.");
      });
    }
  }

  function closeModal() {
    var modal = document.getElementById("admin-modal");
    if (modal) modal.classList.add("hidden");
  }

  // --------------------------------------------------------------------------
  // 8. PIPELINE DES PROJETS (KANBAN)
  // --------------------------------------------------------------------------
  function renderProjects() {
    var cols = {
      cadrage: document.getElementById("col-cards-cadrage"),
      acompte: document.getElementById("col-cards-acompte"),
      en_cours: document.getElementById("col-cards-en_cours"),
      termine: document.getElementById("col-cards-termine")
    };

    // Nettoyer colonnes
    for (var key in cols) {
      if (cols[key]) cols[key].innerHTML = "";
    }

    var counts = { cadrage: 0, acompte: 0, en_cours: 0, termine: 0 };

    state.projects.forEach(function (proj) {
      var colKey = proj.status || "cadrage";
      if (!cols[colKey]) colKey = "cadrage";
      counts[colKey]++;

      var card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = [
        '<div class="project-card-title">' + (proj.title || "Projet Aken") + '</div>',
        '<div class="project-card-client">👤 ' + (proj.client || "Client") + '</div>',
        '<div class="project-card-pricing">',
        '  <span>Total : <strong>' + formatFCFA(proj.total) + '</strong></span>',
        '  <span style="color:var(--admin-mint);">Reçu : ' + formatFCFA(proj.paid) + '</span>',
        '</div>',
        '<div style="font-size:0.75rem;color:var(--admin-text-dim);margin-bottom:8px;">Avancement : ' + (proj.progress || 0) + '%</div>',
        '<div style="background:rgba(255,255,255,0.06);height:6px;border-radius:3px;overflow:hidden;margin-bottom:10px;">',
        '  <div style="background:var(--admin-teal);height:100%;width:' + (proj.progress || 0) + '%;"></div>',
        '</div>',
        '<div style="display:flex;justify-content:space-between;align-items:center;">',
        '  <button class="btn-action-light btn-proj-status" data-id="' + proj.id + '" style="font-size:0.75rem;padding:4px 8px;">Changer étape</button>',
        '  <button class="btn-action-light btn-proj-del" data-id="' + proj.id + '" style="color:var(--admin-rose);font-size:0.75rem;padding:4px 8px;">✕</button>',
        '</div>'
      ].join("");

      card.querySelector(".btn-proj-status").addEventListener("click", function () {
        var steps = ["cadrage", "acompte", "en_cours", "termine"];
        var nextIdx = (steps.indexOf(proj.status) + 1) % steps.length;
        proj.status = steps[nextIdx];
        if (proj.status === "cadrage") proj.progress = 10;
        if (proj.status === "acompte") proj.progress = 30;
        if (proj.status === "en_cours") proj.progress = 65;
        if (proj.status === "termine") proj.progress = 100;
        proj.updatedAt = new Date().toISOString();
        persistAll();
        renderProjects();
        renderDashboard();
      });

      card.querySelector(".btn-proj-del").addEventListener("click", function () {
        if (confirm("Supprimer ce projet ?")) {
          state.projects = state.projects.filter(function (p) { return p.id !== proj.id; });
          persistAll();
          renderProjects();
          renderDashboard();
        }
      });

      if (cols[colKey]) cols[colKey].appendChild(card);
    });

    // Mettre à jour les compteurs de colonnes
    for (var k in counts) {
      var countEl = document.getElementById("count-" + k);
      if (countEl) countEl.textContent = counts[k];
    }
  }

  function handleNewProjectPrompt() {
    var title = prompt("Titre ou description du projet :");
    if (!title) return;
    var client = prompt("Nom du client et téléphone :");
    if (!client) return;
    var totalStr = prompt("Montant total estimé en FCFA (ex: 140000) :", "75000");
    var total = parseInt(totalStr, 10) || 75000;

    state.projects.unshift({
      id: "proj_" + Date.now(),
      title: title,
      client: client,
      total: total,
      paid: Math.round(total * 0.3),
      status: "cadrage",
      progress: 15,
      updatedAt: new Date().toISOString()
    });
    persistAll();
    renderProjects();
    renderDashboard();
  }

  // --------------------------------------------------------------------------
  // 9. ESPACE D'ÉCHANGE (NOTES, LIENS PARTAGÉS, GÉNÉRATEUR DE DEVIS)
  // --------------------------------------------------------------------------
  function renderNotes() {
    var container = document.getElementById("notes-history");
    if (!container) return;

    if (state.notes.length === 0) {
      container.innerHTML = '<p style="color:var(--admin-text-dim);font-size:0.85rem;">Aucune note d\'équipe pour le moment.</p>';
      return;
    }

    container.innerHTML = state.notes.map(function (note) {
      return [
        '<div class="note-item">',
        '  <div class="note-header">',
        '    <span>✍️ ' + (note.author || "Admin") + '</span>',
        '    <span>' + formatDate(note.date) + '</span>',
        '  </div>',
        '  <div class="note-text">' + note.text + '</div>',
        '</div>'
      ].join("");
    }).join("");
  }

  function handleAddNote() {
    var textarea = document.getElementById("new-note-input");
    if (!textarea || !textarea.value.trim()) return;

    state.notes.unshift({
      id: "note_" + Date.now(),
      author: state.currentUser ? state.currentUser.name : "Admin",
      date: new Date().toISOString(),
      text: textarea.value.trim()
    });
    textarea.value = "";
    persistAll();
    renderNotes();
  }

  function renderSharedLinks() {
    var container = document.getElementById("shared-links-list");
    if (!container) return;

    if (state.sharedLinks.length === 0) {
      container.innerHTML = '<p style="color:var(--admin-text-dim);font-size:0.85rem;">Aucun lien partagé.</p>';
      return;
    }

    container.innerHTML = state.sharedLinks.map(function (link) {
      return [
        '<div class="shared-link-item">',
        '  <div class="shared-link-left">',
        '    <span style="font-size:1.2rem;">🔗</span>',
        '    <div>',
        '      <div class="shared-link-title">' + link.title + ' <span style="font-size:0.7rem;color:var(--admin-text-dim);font-family:var(--font-mono);">[' + (link.category || "Autre") + ']</span></div>',
        '      <a href="' + link.url + '" target="_blank" rel="noopener" class="shared-link-url">' + link.url + '</a>',
        '    </div>',
        '  </div>',
        '  <button class="btn-icon-action del btn-del-link" data-id="' + link.id + '" title="Supprimer" style="width:28px;height:28px;font-size:0.75rem;">✕</button>',
        '</div>'
      ].join("");
    }).join("");

    container.querySelectorAll(".btn-del-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        state.sharedLinks = state.sharedLinks.filter(function (l) { return l.id !== id; });
        persistAll();
        renderSharedLinks();
      });
    });
  }

  function handleAddLink() {
    var title = prompt("Titre du document ou de la ressource :");
    if (!title) return;
    var url = prompt("Lien complet (URL) :");
    if (!url) return;
    var cat = prompt("Catégorie (Figma, GitHub, Drive, Client) :", "Drive");

    state.sharedLinks.unshift({
      id: "link_" + Date.now(),
      title: title,
      url: url,
      category: cat || "Autre"
    });
    persistAll();
    renderSharedLinks();
  }

  // --------------------------------------------------------------------------
  // 10. GÉNÉRATEUR DE DEVIS & FACTURE AKEN
  // --------------------------------------------------------------------------
  function handleGenerateQuote(e) {
    e.preventDefault();
    var clientName = document.getElementById("quote-client-name").value || "Client";
    var clientPhone = document.getElementById("quote-client-phone").value || "";
    var clientCompany = document.getElementById("quote-client-company").value || "";
    var projectType = document.getElementById("quote-project-type").value || "Site Vitrine";
    var amount = parseInt(document.getElementById("quote-amount").value, 10) || 75000;
    var depositRate = parseInt(document.getElementById("quote-deposit-rate").value, 10) || 30;

    var deposit = Math.round(amount * (depositRate / 100));
    var balance = amount - deposit;
    var quoteRef = "AKEN-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

    var printWindow = window.open("", "_blank");
    printWindow.document.write([
      '<!DOCTYPE html>',
      '<html><head><meta charset="utf-8"><title>Devis Aken ' + quoteRef + '</title>',
      '<style>',
      'body { font-family: "Helvetica Neue", Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: auto; }',
      '.header { display: flex; justify-content: space-between; border-bottom: 2px solid #00f0ff; padding-bottom: 20px; margin-bottom: 30px; }',
      '.logo-title { font-size: 26px; font-weight: bold; color: #07090f; }',
      '.ref { font-family: monospace; font-size: 14px; color: #666; }',
      '.section { margin-bottom: 24px; }',
      '.table { width: 100%; border-collapse: collapse; margin-top: 15px; }',
      '.table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }',
      '.table th { background: #f4f6fb; }',
      '.totals { margin-top: 20px; float: right; width: 320px; }',
      '.totals div { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }',
      '.totals div.bold { font-weight: bold; font-size: 16px; border-bottom: 2px solid #00f0ff; }',
      '.footer { margin-top: 80px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 15px; text-align: center; }',
      '</style></head><body>',
      '<div class="header">',
      '  <div>',
      '    <div class="logo-title">AKEN</div>',
      '    <p style="margin:4px 0 0;font-size:13px;color:#555;">Solutions Digitales & Développement Web<br>Bamako, Mali — Tél: +223 93 78 99 16<br>Email: akenkdev@gmail.com</p>',
      '  </div>',
      '  <div style="text-align:right;">',
      '    <div class="ref">RÉF : ' + quoteRef + '</div>',
      '    <div style="font-size:13px;color:#666;margin-top:4px;">Date : ' + new Date().toLocaleDateString("fr-FR") + '</div>',
      '  </div>',
      '</div>',
      '<div class="section">',
      '  <h4 style="margin:0 0 8px;">DESTINATAIRE DU DEVIS :</h4>',
      '  <p style="margin:2px 0;"><strong>' + clientName + '</strong></p>',
      clientCompany ? '<p style="margin:2px 0;">Entreprise : ' + clientCompany + '</p>' : '',
      clientPhone ? '<p style="margin:2px 0;">Téléphone : ' + clientPhone + '</p>' : '',
      '</div>',
      '<table class="table">',
      '  <thead><tr><th>Désignation de la prestation</th><th style="text-align:right;">Montant</th></tr></thead>',
      '  <tbody>',
      '    <tr>',
      '      <td><strong>' + projectType + '</strong><br><small style="color:#666;">Conception sur-mesure, intégration responsive mobile, hébergement optimisé et sécurisation.</small></td>',
      '      <td style="text-align:right;"><strong>' + formatFCFA(amount) + '</strong></td>',
      '    </tr>',
      '  </tbody>',
      '</table>',
      '<div class="totals">',
      '  <div><span>Total Prestation :</span><span>' + formatFCFA(amount) + '</span></div>',
      '  <div style="color:#008080;"><span>Acompte à la commande (' + depositRate + '%) :</span><span><strong>' + formatFCFA(deposit) + '</strong></span></div>',
      '  <div class="bold"><span>Solde à la livraison :</span><span>' + formatFCFA(balance) + '</span></div>',
      '</div>',
      '<div style="clear:both;"></div>',
      '<div style="margin-top:40px;background:#f9fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;font-size:13px;">',
      '  <strong>Modalités de règlement :</strong><br>',
      '  Paiements acceptés par <strong>Wave</strong> et <strong>Orange Money</strong> au numéro : <strong>+223 93 78 99 16</strong> (Aken / Abdelkane).<br>',
      '  Démarrage des travaux dès réception de l\'acompte de ' + depositRate + '%.',
      '</div>',
      '<div class="footer">Aken — Solutions digitales pour développer votre activité. Bamako, Mali.</div>',
      '<script>window.onload = function() { window.print(); };</script>',
      '</body></html>'
    ].join(""));
    printWindow.document.close();
  }

  // --------------------------------------------------------------------------
  // 11. GESTION DES PERMISSIONS & CLÉS COLLABORATEURS
  // --------------------------------------------------------------------------
  function renderCollabKeys() {
    var tbody = document.getElementById("collab-keys-tbody");
    if (!tbody) return;

    if (state.collabKeys.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="color:var(--admin-text-dim);text-align:center;padding:14px;">Aucun code collaborateur actif.</td></tr>';
      return;
    }

    tbody.innerHTML = state.collabKeys.map(function (k) {
      return [
        '<tr>',
        '  <td><strong>' + k.name + '</strong></td>',
        '  <td><span class="key-code">' + k.code + '</span></td>',
        '  <td>' + (k.role === "super_admin" ? "Admin Total" : "Collaborateur") + '</td>',
        '  <td><button class="btn-action-light btn-revoke-key" data-id="' + k.id + '" style="color:var(--admin-rose);padding:4px 8px;font-size:0.75rem;">Révoquer</button></td>',
        '</tr>'
      ].join("");
    }).join("");

    tbody.querySelectorAll(".btn-revoke-key").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        if (confirm("Révoquer l'accès pour ce collaborateur ?")) {
          state.collabKeys = state.collabKeys.filter(function (k) { return k.id !== id; });
          persistAll();
          renderCollabKeys();
        }
      });
    });
  }

  function handleCreateCollabKey(e) {
    e.preventDefault();
    var nameInput = document.getElementById("collab-name-input");
    var roleInput = document.getElementById("collab-role-input");
    if (!nameInput || !nameInput.value.trim()) return;

    var randomCode = "AKEN-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.floor(10 + Math.random() * 90);

    state.collabKeys.push({
      id: "key_" + Date.now(),
      name: nameInput.value.trim(),
      role: roleInput ? roleInput.value : "collaborateur",
      code: randomCode,
      createdAt: new Date().toISOString()
    });

    nameInput.value = "";
    persistAll();
    renderCollabKeys();
    alert("✅ Clé collaborateur générée avec succès :\n\nCode d'accès : " + randomCode + "\n\nPartagez ce code avec le collaborateur pour lui donner accès.");
  }

  async function handleChangeMasterPassword(e) {
    e.preventDefault();
    var newPwd = document.getElementById("new-master-password");
    var confirmPwd = document.getElementById("confirm-master-password");
    if (!newPwd || !confirmPwd) return;

    if (newPwd.value.length < 6) {
      alert("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (newPwd.value !== confirmPwd.value) {
      alert("Les deux mots de passe ne correspondent pas.");
      return;
    }

    var hashed = await sha256(newPwd.value);
    localStorage.setItem("aken_admin_master_hash", hashed);
    newPwd.value = "";
    confirmPwd.value = "";
    alert("✅ Mot de passe maître Super Admin mis à jour avec succès !");
  }

  // --------------------------------------------------------------------------
  // 12. EXPORT & IMPORT DE SAUVEGARDE JSON
  // --------------------------------------------------------------------------
  function exportBackup() {
    var backupData = {
      exportDate: new Date().toISOString(),
      leads: state.leads,
      projects: state.projects,
      notes: state.notes,
      sharedLinks: state.sharedLinks,
      collabKeys: state.collabKeys
    };
    var jsonStr = JSON.stringify(backupData, null, 2);
    var blob = new Blob([jsonStr], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "aken-admin-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        if (data.leads) state.leads = data.leads;
        if (data.projects) state.projects = data.projects;
        if (data.notes) state.notes = data.notes;
        if (data.sharedLinks) state.sharedLinks = data.sharedLinks;
        if (data.collabKeys) state.collabKeys = data.collabKeys;
        persistAll();
        renderAllViews();
        alert("✅ Sauvegarde restaurée avec succès !");
      } catch (err) {
        alert("❌ Erreur lors de la lecture du fichier de sauvegarde.");
      }
    };
    reader.readAsText(file);
  }

  // --------------------------------------------------------------------------
  // 13. RENDU GLOBAL & INITIALISATION DES ÉCOUTEURS
  // --------------------------------------------------------------------------
  function renderAllViews() {
    renderDashboard();
    renderInbox();
    renderProjects();
    renderNotes();
    renderSharedLinks();
    renderCollabKeys();
    updateBadges();
  }

  function initListeners() {
    // Lockscreen
    var lockForm = document.getElementById("lockscreen-form");
    if (lockForm) lockForm.addEventListener("submit", handleLoginSubmit);

    var togglePwd = document.getElementById("toggle-pwd");
    if (togglePwd) {
      togglePwd.addEventListener("click", function () {
        var pwd = document.getElementById("lockscreen-password");
        if (pwd) pwd.type = pwd.type === "password" ? "text" : "password";
      });
    }

    // Déconnexion
    var btnLogout = document.getElementById("btn-logout");
    if (btnLogout) btnLogout.addEventListener("click", handleLogout);

    // Sidebar navigation
    document.querySelectorAll(".nav-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        if (tab) switchTab(tab);
      });
    });

    // Mobile sidebar toggle
    var toggleMobile = document.getElementById("sidebar-toggle-mobile");
    var sidebar = document.getElementById("admin-sidebar");
    if (toggleMobile && sidebar) {
      toggleMobile.addEventListener("click", function () {
        sidebar.classList.toggle("open");
      });
    }

    // Filtres Inbox
    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll(".filter-chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        state.currentFilter = chip.getAttribute("data-filter") || "all";
        renderInbox();
      });
    });

    // Recherche Inbox
    var searchInput = document.getElementById("inbox-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.searchQuery = searchInput.value.trim();
        renderInbox();
      });
    }

    // Bouton Nouveau Projet
    var btnNewProj = document.getElementById("btn-new-project");
    if (btnNewProj) btnNewProj.addEventListener("click", handleNewProjectPrompt);

    // Notes
    var btnAddNote = document.getElementById("btn-add-note");
    if (btnAddNote) btnAddNote.addEventListener("click", handleAddNote);

    // Liens
    var btnAddLink = document.getElementById("btn-add-link");
    if (btnAddLink) btnAddLink.addEventListener("click", handleAddLink);

    // Générateur de devis
    var quoteForm = document.getElementById("quote-generator-form");
    if (quoteForm) quoteForm.addEventListener("submit", handleGenerateQuote);

    // Permissions & Sécurité
    var formCollabKey = document.getElementById("form-create-collab-key");
    if (formCollabKey) formCollabKey.addEventListener("submit", handleCreateCollabKey);

    var formMasterPwd = document.getElementById("form-change-master-password");
    if (formMasterPwd) formMasterPwd.addEventListener("submit", handleChangeMasterPassword);

    // Sauvegarde & Export
    var btnExport = document.getElementById("btn-export-backup");
    if (btnExport) btnExport.addEventListener("click", exportBackup);

    var importInput = document.getElementById("import-backup-file");
    if (importInput) {
      importInput.addEventListener("change", function (e) {
        if (e.target.files && e.target.files[0]) {
          importBackup(e.target.files[0]);
        }
      });
    }

    // Fermeture modale
    var modalClose = document.getElementById("admin-modal-close");
    if (modalClose) modalClose.addEventListener("click", closeModal);

    var modalOverlay = document.getElementById("admin-modal");
    if (modalOverlay) {
      modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) closeModal();
      });
    }
  }

  // Démarrage
  function init() {
    initStorage();
    initListeners();
    checkAuthOnLoad();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
