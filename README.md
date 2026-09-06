# Portfolio d'Aken — Guide complet

Site statique (HTML / CSS / JS pur, sans framework) : léger, rapide même sur
connexion lente, et facile à modifier même en débutant.

```
aken-portfolio/
├── index.html        → tout le contenu du site (une seule page)
├── css/style.css      → couleurs, typographie, mise en page
├── js/main.js          → thème clair/sombre, menu mobile, formulaires
├── robots.txt          → autorise Google à indexer le site
├── sitemap.xml          → aide Google à découvrir vos pages
├── assets/og-cover.png (à ajouter) → image affichée quand le lien est partagé
└── README.md           → ce guide
```

Le site inclut maintenant un vrai **tunnel de conversion**, pas seulement une
vitrine : bande de confiance, offres avec appel à l'action, études de cas,
témoignages, ressource gratuite (lead magnet), FAQ, et des canaux de contact
visibles partout (bouton WhatsApp flottant, réseaux sociaux en footer,
partage social). La section 7 ci-dessous explique comment vous en servir.

---

## 1. Voir le site immédiatement

Aucune installation nécessaire : ouvrez simplement `index.html` dans votre
navigateur (double-clic dessus). Tout fonctionne déjà.

Pour travailler dessus plus confortablement (rechargement automatique),
si vous avez VS Code : installez l'extension **Live Server**, clic droit sur
`index.html` → *Open with Live Server*.

---

## 2. Ce qu'il faut personnaliser en premier

| Où | Quoi changer |
|---|---|
| `assets/logo.png` | Votre logo KDEV est déjà intégré (en-tête, favicon, aperçu de partage) |
| `index.html`, section `#accueil` | Votre phrase d'accroche si vous voulez la reformuler |
| `index.html`, section `#projets` | Vos coordonnées et projets réels sont déjà en place (DigitalPress, Gestion hôtelière, Transport) — relisez les descriptions et corrigez-les si besoin, et ajoutez vos autres dépôts (ORIANTAML, Mes_delice...) sur le même modèle |
| `index.html`, section `#contact` | Vos vraies coordonnées sont déjà branchées (e-mail, WhatsApp, GitHub) — ajoutez LinkedIn et X dès que vous avez ces profils (dupliquez un `<a class="contact-link">` existant) |
| `index.html`, `<title>` et `<meta name="description">` | Ajustez si besoin pour le référencement Google |
| `css/style.css`, bloc `:root` | Les couleurs : indigo, ochre, teal — changez les codes hexadécimaux si vous voulez une autre ambiance |
| `index.html`, section `#offres` | Vos vraies offres et vos vrais tarifs (ou « sur devis » si vous préférez ne pas afficher de prix) |
| `index.html`, section `#temoignages` | De vrais témoignages (même courts) dès que vous en avez — demandez toujours l'accord de la personne |
| `index.html`, section `#faq` | Adaptez les questions à ce qu'on vous demande vraiment |
| `index.html`, balises `og:*`, `twitter:*`, JSON-LD | Remplacez `https://www.aken.dev/` par votre vraie adresse une fois le site en ligne, et ajoutez une image `assets/og-cover.png` (1200×630px) pour un bel aperçu quand le lien est partagé |
| `robots.txt`, `sitemap.xml` | Remplacez aussi l'URL une fois votre nom de domaine choisi |

Astuce : chaque section du site est clairement commentée dans `index.html`
(`<!-- HERO -->`, `<!-- PROJETS -->`, etc.) pour vous repérer facilement.

---

## 3. Le formulaire de contact

Un site statique ne peut pas envoyer d'e-mails tout seul. Deux solutions simples :

- **Le plus rapide pour débuter** : ne rien faire — les boutons e-mail et
  WhatsApp de la section Contact fonctionnent déjà sans aucune configuration.
- **Pour activer le formulaire** : créez un compte gratuit sur
  [Formspree](https://formspree.io) (ou Getform), puis dans `index.html`,
  changez la balise `<form>` :
  ```html
  <form class="contact-form" id="contact-form" action="https://formspree.io/f/VOTRE_ID" method="POST">
  ```
  Vous recevrez alors chaque message directement dans votre boîte mail.

---

## 4. Déploiement — hébergement adapté au Mali / à l'Afrique

Le site est volontairement léger (pas de framework lourd, polices limitées,
pas d'images inutiles) pour bien fonctionner sur des connexions 3G/4G
instables. Trois options d'hébergement, gratuites, avec un bon temps de
réponse en Afrique de l'Ouest grâce à leur CDN mondial :

1. **GitHub Pages** (recommandé pour débuter, gratuit, simple)
   - Créez un compte GitHub, un dépôt nommé `abdelkane-dev.github.io`
   - Déposez-y ces fichiers, activez *Pages* dans les paramètres du dépôt
   - Votre site est en ligne à `https://abdelkane-dev.github.io`

2. **Netlify** ou **Vercel** (gratuit, glisser-déposer le dossier, très rapide)
   - Créez un compte, glissez le dossier `aken-portfolio` sur leur interface
   - Vous obtenez un lien HTTPS immédiatement, avec CDN mondial (bon en Afrique)

3. **Nom de domaine local `.ml`**
   - Une fois le site en ligne sur Netlify/GitHub Pages, vous pouvez pointer
     un domaine `.ml` (registre malien) ou `.com` vers votre hébergement pour
     une adresse plus professionnelle, ex. `aken.ml` ou `aken-dev.com`.

Dans tous les cas, activez le **HTTPS automatique** (proposé par défaut sur
les trois plateformes) — important pour la confiance des visiteurs.

---

## 5. Pourquoi ce site est pensé pour votre contexte réseau

- Deux polices seulement, chargées une fois et mises en cache par le navigateur
- Pas de bibliothèque JavaScript externe (aucun téléchargement supplémentaire)
- Graphique d'en-tête en SVG (quelques Ko) plutôt qu'une image lourde
- Aucune requête bloquante : le site reste utilisable même si une ressource
  tarde à charger
- Design responsive « mobile d'abord », car la majorité du trafic web en
  Afrique se fait sur smartphone

---

## 6. Stratégie marketing — faire vivre le tunnel de vente

Un site ne génère rien tout seul : il a besoin d'être **alimenté** par du
trafic, et de **convertir** ce trafic en contacts. Voici la logique du
tunnel déjà construit dans le site, et comment l'activer.

### Le tunnel, étape par étape

1. **Visibilité (avant le site)** — LinkedIn, X, un post GitHub, un groupe
   WhatsApp/Facebook pro : c'est là que les gens découvrent votre travail et
   cliquent vers votre site. Publiez régulièrement (même 1×/semaine) : un
   projet terminé, une leçon apprise, une astuce technique.
2. **Intérêt (bande de confiance + expertise)** — dès l'arrivée sur le site,
   la bande « Ils me font confiance » et la section Expertise rassurent le
   visiteur qu'il est au bon endroit.
3. **Considération (projets + témoignages + offres)** — les études de cas
   avec un résultat chiffré, les témoignages et les offres claires aident le
   visiteur à se projeter et à comparer.
4. **Capture (ressource gratuite)** — un visiteur pas encore prêt à payer peut
   laisser son e-mail contre le guide gratuit. Vous gardez le contact au lieu
   de perdre le visiteur définitivement.
5. **Action (contact / devis)** — bouton WhatsApp flottant, formulaire et
   e-mail direct : plusieurs façons de vous écrire, adaptées aux habitudes
   locales (WhatsApp est souvent plus utilisé que l'e-mail au Mali).

### Outils simples pour activer chaque étape

| Besoin | Outil gratuit ou pas cher, adapté à l'Afrique |
|---|---|
| Recevoir les e-mails du lead magnet et programmer des relances | [Brevo](https://www.brevo.com) (ex-Sendinblue) — gratuit jusqu'à un bon volume, interface en français |
| Programmer vos publications LinkedIn/X à l'avance | [Buffer](https://buffer.com) ou [Swello](https://swello.com) |
| Mesurer les visites sans data lourde à charger | [Plausible](https://plausible.io) ou [Umami](https://umami.is) (script très léger) |
| Réserver un appel avec un prospect sans échange de messages | [Cal.com](https://cal.com) (gratuit) — ajoutez le lien dans la section Contact |
| Recevoir des paiements en Afrique de l'Ouest | Orange Money, Wave, ou une passerelle comme [CinetPay](https://cinetpay.com) |

### Réflexes de contenu qui nourrissent le tunnel

- Chaque projet terminé = un post LinkedIn/X qui renvoie vers `#projets`
- Chaque astuce apprise = un contenu court, qui construit votre crédibilité
  avant même que le prospect n'ait besoin de vos services
- Reliez toujours vos réseaux sociaux au site, et le site à vos réseaux
  (c'est déjà fait dans le header, le footer et le bouton WhatsApp flottant)

## 7. Pour aller plus loin (quand vous serez à l'aise)

- **Blog / articles techniques** : ajoutez une page `blog.html` pour publier
  sur la donnée, le cloud, la cybersécurité — bon pour votre crédibilité pro
- **Multilingue** : dupliquer `index.html` en `index.en.html` pour une version
  anglaise, utile pour le marché panafricain anglophone
- **Analytics respectueux de la vie privée** : [Plausible](https://plausible.io)
  ou [Umami](https://umami.is), plus légers que Google Analytics
- **Version dynamique** : si un jour vous voulez un blog avec base de données,
  votre stack Django (vu sur DigitalPress) conviendrait bien pour la partie
  backend, avec ce même design en frontend

---

Bon développement, Aken 🇲🇱
