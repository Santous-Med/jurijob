# JURIJOB — État du projet au 14 juin 2026

---

## 1. Contexte général

**Objectif fonctionnel :** JURIJOB est une plateforme marocaine de recrutement juridique spécialisée connectant candidats (juristes, avocats, notaires) à des recruteurs (entreprises, cabinets, études notariales) via un système de short-lists supervisé par un administrateur humain avec matching automatique scoré sur 100 points.

**Profil du porteur :** Mohammed Sentissi (Maître Sentissi), avocat non-technique, fondateur de SLA (Sentissi Legal Advisory), Casablanca. Travaille sous Windows avec VS Code + terminal cmd. Déploie via `npm run build` puis `vercel --prod` dans le terminal intégré VS Code.

**Préférences de travail avec Claude :**
- Guidage pas-à-pas, une instruction à la fois
- Préfère les remplacements via Ctrl+H (Rechercher/Remplacer) plutôt que l'édition manuelle de lignes
- Valide chaque étape par capture d'écran
- Ne jamais coller plusieurs commandes terminal sur une seule ligne
- Langue : français exclusivement

---

## 2. Stack technique exacte

**Frontend :**
- React + Vite (version Vite v8.0.16 confirmée en production)
- Pas de TypeScript — JavaScript pur (.jsx)
- Pas de librairie UI externe — tout en CSS-in-JS inline (style={{...}})
- Pas de React Router — navigation par état (`useState` sur `view`)

**Backend :**
- Supabase — Project ID : `agfcmbnncjscupxjzjgv`
- URL : `https://agfcmbnncjscupxjzjgv.supabase.co`
- Edge Function déployée : `notify` (notifications email via Resend)

**Auth :**
- Candidats : Google OAuth OU email/password via Supabase Auth
- Recruteurs : email/password via Supabase Auth uniquement
- Admin : mot de passe fixe local `SLA@jurijob2026` (pas de Supabase Auth pour l'admin)
- Google OAuth : configuré, publié en mode Production (pas seulement test)
- Reset password : implémenté pour candidats et recruteurs (`resetPasswordForEmail` + composant `ResetPassword`)
- Confirmation email obligatoire à l'inscription (toggle Supabase activé)

**Emails :**
- Fournisseur : Resend
- Domaine vérifié : `jurijob.ma` (4 DNS records ajoutés via Vercel DNS : DKIM TXT, MX, SPF TXT, DMARC)
- Expéditeur : `noreply@jurijob.ma`
- Supabase SMTP custom configuré : host `smtp.resend.com`, port 465, username `resend`
- Secret Supabase Edge Function : `RESEND_API_KEY` (À VÉRIFIER — valeur dans Supabase Edge Functions > Secrets)

**Hosting :**
- Vercel — compte `sentissi-9667`
- Projet Vercel : `jurijob`
- Domaine : `www.jurijob.ma` (DNS MyVala → Vercel, À VÉRIFIER si propagation complète)
- URL de secours : `https://jurijob.vercel.app` (À VÉRIFIER — URL exacte du dernier déploiement)

**Repo GitHub :**
- Organisation/compte : `Santous-Med`
- Repo : `Santous-Med/jurijob`
- Branche de travail : `main`

**Variables d'environnement (.env à la racine du projet) :**
```
VITE_SUPABASE_URL
VITE_SUPABASE_KEY
VITE_SITE_URL
```

---

## 3. Architecture du code

**Arborescence :**
```
jurijob/
├── src/
│   ├── App.jsx          ← Landing page + EspaceCandidат + EspaceRecruteur + ResetPassword
│   ├── Admin.jsx        ← AdminDashboard (TDB admin complet)
│   ├── supabase.js      ← createClient Supabase
│   ├── App.css          ← vide (vidé intentionnellement)
│   ├── index.css        ← vide (vidé intentionnellement)
│   └── main.jsx         ← point d'entrée React (non modifié)
├── .env                 ← à la RACINE (pas dans src/)
├── .gitignore
├── package.json
├── vite.config.js
└── CONTEXTE.md          ← document de contexte (créé en session)
```

**Routing (navigation par état dans App.jsx) :**
- `view === "landing"` → composant `Landing`
- `view === "candidat"` → composant `EspaceCandidат`
- `view === "recruteur"` → composant `EspaceRecruteur`
- `view === "admin"` → composant `AdminDashboard` (importé depuis `./Admin`)
- Détection `type=recovery` dans URL hash → composant `ResetPassword`

**Logique de rôle (RoleMismatch) :**
- État `intendedRole` comparé au rôle réel du compte Supabase Auth
- Si mismatch (ex: email recruteur utilisé dans espace candidat) → écran `RoleMismatch` avec options "aller au bon espace" ou "se déconnecter"

---

## 4. Tables Supabase — colonnes exactes

### Table `candidats`
```
id               uuid (PK, gen_random_uuid())
created_at       timestamptz (default now())
prenom           text NOT NULL
nom              text NOT NULL
email            text UNIQUE NOT NULL
tel              text
ville            text
titre            text
formations       jsonb (default '[]')
experiences      jsonb (default '[]')
specs            text[] (default '{}')
langues          jsonb (default '[]')
contrats         text[] (default '{}')
disponibilite    text
salaire          text
salaire_note     text
salaire_actuel   text           ← ajouté en session
statut           text (default 'en_attente')
```

### Table `recruteurs`
```
id               uuid (PK)
created_at       timestamptz
entreprise       text NOT NULL
contact          text
email            text UNIQUE NOT NULL
tel              text
statut           text (default 'actif')
```

### Table `demandes`
```
id                   uuid (PK)
created_at           timestamptz
recruteur_id         uuid (FK → recruteurs.id)
entreprise           text NOT NULL
contact              text
poste                text NOT NULL
niveau               text
diplome              text
specs                text[]
langues              text[]
nb_cv                integer (default 3)
urgence              text (default 'normal')
notes                text
budget               text                    ← ajouté en session
budget_confidentiel  boolean (default false) ← ajouté en session
statut               text (default 'en_cours')
```

### Table `shortlists`
```
id            uuid (PK)
created_at    timestamptz
demande_id    uuid (FK → demandes.id)
candidat_ids  uuid[]
statut        text (default 'envoyee')
```

---

## 5. Fonctionnalités — état d'avancement

| Fonctionnalité | Statut | Notes |
|---|---|---|
| Landing page (hero, cartes candidat/recruteur, stats, footer) | ✅ FAIT | Bouton "Accès Admin" discret en footer |
| Inscription candidat email/password | ✅ FAIT | Avec confirmation email obligatoire |
| Connexion candidat email/password | ✅ FAIT | |
| Connexion candidat Google OAuth | ✅ FAIT | Mode Production publié |
| Reset password candidat | ✅ FAIT | `resetPasswordForEmail` + composant `ResetPassword` |
| Inscription recruteur email/password | ✅ FAIT | Avec confirmation email |
| Connexion recruteur email/password | ✅ FAIT | |
| Reset password recruteur | ✅ FAIT | |
| Détection mismatch de rôle | ✅ FAIT | Composant `RoleMismatch`, état `intendedRole` |
| Formulaire candidat 7 étapes (CV builder) | ✅ FAIT | Identité, Formation, Expériences, Spécialisations, Langues, Préférences, Aperçu |
| Salaire actuel dans formulaire candidat (étape 6) | ✅ FAIT | Champ `salaireActuel`, colonne `salaire_actuel` en BDD |
| Sauvegarde profil candidat → Supabase | ✅ FAIT | Fonction `sauvegarderProfil` async |
| Module recruteur "Entrez Vos Critères" 5 étapes | ✅ FAIT | |
| Budget poste dans module recruteur (étape 3) | ✅ FAIT | Fourchettes + case "confidentiel" |
| Sauvegarde demande recruteur → Supabase | ✅ FAIT | Fonction `sauvegarderDemande` async |
| TDB Admin — Vue d'ensemble (KPIs) | ✅ FAIT | Stats temps réel depuis Supabase |
| TDB Admin — Demandes recruteurs | ✅ FAIT | |
| TDB Admin — CVthèque + modération | ✅ FAIT | Valider / Refuser / Remettre / Archiver → Supabase |
| TDB Admin — Algorithme de matching automatique | ✅ FAIT | Score /100 : specs 40 + langues 25 + niveau 20 + diplôme 15 |
| TDB Admin — Génération short-list | ✅ FAIT | Sauvegardée dans table `shortlists` |
| TDB Admin — Historique short-lists | ✅ FAIT | État local (non rechargé depuis Supabase au refresh) |
| Verrouillage Admin par mot de passe | ✅ FAIT | `SLA@jurijob2026`, état `auth` local |
| Chargement données réelles depuis Supabase (Admin) | ✅ FAIT | `useEffect` conditionnel sur `auth` |
| Notification email candidat (profil validé) | ✅ FAIT | Via Edge Function `notify` + Resend |
| Notification email recruteur (short-list prête) | 🟡 EN COURS | Implémentée dans Admin.jsx mais **Test 2 non confirmé** — à vérifier |
| Email reset password en français + branding JURIJOB | ⛔ NON FAIT | Template Supabase encore en anglais/générique |
| Facebook OAuth | ⛔ NON FAIT | Pas de compte Facebook Developers créé |
| LinkedIn OAuth | ⛔ NON FAIT | Pas de compte LinkedIn Developers créé |
| Refonte design visuel | ⛔ NON FAIT | Explicitement demandé par Mohammed, planifié |
| Supabase custom domain (Pro) | ⛔ NON FAIT | Nécessaire pour afficher jurijob.ma sur écran consentement Google |
| Historique short-lists rechargé depuis Supabase | ⛔ NON FAIT | Actuellement état local perdu au refresh |
| Espace recruteur connecté (dashboard demandes existantes) | ⛔ NON FAIT | Après login, le recruteur repart sur le formulaire — pas de dashboard "mes demandes" |
| Espace candidat connecté (édition profil existant) | ⛔ NON FAIT | Après login, le candidat peut re-soumettre un profil dupliqué |

---

## 6. Décisions d'architecture prises

1. **Pas de TypeScript** — choix de simplicité pour un porteur non-technique. Tout en `.jsx` vanilla.
2. **Pas de React Router** — navigation par `useState` sur `view`. Simple, sans configuration.
3. **CSS-in-JS inline** — pas de Tailwind, pas de styled-components. Tout `style={{...}}` pour rester dans un seul fichier.
4. **Admin non-Supabase** — le compte admin n'est pas un utilisateur Supabase Auth. Mot de passe fixe local pour simplicité. Décision assumée.
5. **Supabase comme BDD + API + Auth** — pas de backend Node.js séparé. Tout passe par le client Supabase JS côté navigateur, sauf les emails (Edge Function).
6. **Resend via Edge Function** — la clé API Resend ne doit jamais être dans le `.env` frontend (sécurité). Elle est dans les secrets Supabase Edge Functions.
7. **RLS désactivé** sur les tables — choix délibéré en phase prototype. À activer avec politiques avant mise en production réelle.
8. **Un seul `App.jsx`** contenant toute la logique frontend — décision de simplicité, au prix d'un fichier très long (~500 lignes).
9. **Matching temps réel** — le scoring se fait côté client à chaque ouverture de demande, pas stocké en BDD.
10. **`useEffect` conditionnel sur `auth`** dans Admin.jsx — `useEffect(()=>{ if(auth) chargerDonnees(); },[auth])` — pour ne pas appeler Supabase avant authentification admin.

---

## 7. Conventions de code

- **JavaScript** : camelCase pour variables/fonctions, PascalCase pour composants React
- **Supabase (BDD)** : snake_case pour noms de colonnes (`salaire_actuel`, `nb_cv`, `budget_confidentiel`)
- **Couleurs constantes** en haut de chaque fichier :
  ```js
  const NAVY="#0B2545", GOLD="#C8A046", CREAM="#F8F5ED", GOLD_LIGHT="#F5EDD6"
  ```
- **Composants helpers** définis hors du composant principal (pour éviter le bug de perte de focus) : `Inp`, `Lbl`, `Pill`, `SecTitle`, `Badge`, `Avatar`
- **Pas de hooks dans des boucles ou conditions**
- **Async/await** pour tous les appels Supabase
- **Gestion d'erreur** : `alert('Erreur : ' + error.message)` (simple, à améliorer)

---

## 8. Points fragiles / à ne pas casser

1. **`Inp` composant défini HORS du composant principal** — si redéfini à l'intérieur, chaque frappe perd le focus (bug vécu et corrigé difficilement).
2. **`.env` à la RACINE du projet** (pas dans `src/`) — erreur commise et corrigée.
3. **`useEffect(()=>{ if(auth) chargerDonnees(); },[auth])`** dans Admin.jsx — la condition `if(auth)` est critique. Sans elle, Supabase est appelé avant auth et provoque un écran blanc.
4. **Import `AdminDashboard`** dans App.jsx ligne 1-2 — si supprimé ou mal orthographié, l'espace admin disparaît sans erreur visible.
5. **`vimport`** au lieu de `import` — erreur récurrente lors de copier-coller. Toujours vérifier la ligne 1 des fichiers après modification.
6. **`npm install --legacy-peer-deps`** — obligatoire sur ce projet à cause d'un conflit vite/plugin-react. Ne jamais faire `npm install` seul.
7. **PowerShell bloqué** sur la machine de Mohammed — toujours utiliser le terminal **cmd** dans VS Code, pas PowerShell.
8. **Vercel token expirant** — si `vercel --prod` échoue avec "token not valid", faire `vercel login` puis réessayer.
9. **Table `shortlists`** : l'historique des short-lists n'est pas rechargé depuis Supabase au refresh — état local `shortlistSent` perdu. Ne pas promettre que "l'historique persiste" au recruteur.

---

## 9. Prochaine étape immédiate

**Tester la notification email au recruteur lors de l'envoi d'une short-list (Test 2) :**

1. Dans le TDB Admin, aller dans **Demandes** → ouvrir une demande "en cours" qui a un email recruteur réel dans le champ `contact` (À VÉRIFIER — le champ utilisé par la fonction `notify` pour le recruteur est `selectedDem.recruteur_email` ou `selectedDem.contact`, À VÉRIFIER dans Admin.jsx)
2. Sélectionner des candidats validés
3. Cliquer **"Générer et envoyer la short-list"**
4. Vérifier que le recruteur reçoit un email "Votre short-list est prête"

Si ce test échoue, déboguer la fonction Edge `notify` via **Supabase → Edge Functions → notify → Logs**.

---

## 10. Backlog ordonné

1. ✅ **[IMMÉDIAT]** Confirmer Test 2 — notification email recruteur short-list
2. **Traduire l'email de réinitialisation** en français + branding JURIJOB (Supabase → Authentication → Emails → Reset Password template)
3. **Refonte design visuel** — logo, typographie, palette, layout (Mohammed a explicitement demandé une session dédiée)
4. **Historique short-lists depuis Supabase** — recharger `shortlistSent` depuis la table `shortlists` au chargement Admin
5. **Dashboard recruteur** — après login, afficher "mes demandes" plutôt que re-formulaire
6. **Dashboard candidat** — après login, afficher profil existant éditable plutôt que formulaire vide (éviter doublons en BDD)
7. **Facebook OAuth** — créer app sur Facebook Developers, configurer dans Supabase
8. **LinkedIn OAuth** — idem LinkedIn Developers
9. **RLS Supabase** — activer Row Level Security sur toutes les tables avant ouverture publique
10. **Supabase Pro + custom domain** — pour afficher `jurijob.ma` sur l'écran de consentement Google
11. **Passer Supabase en Pro** — éviter la mise en pause automatique du projet (plan gratuit = pause après 1 semaine d'inactivité)

---

## 11. Questions ouvertes / décisions en attente

1. **Champ email recruteur pour notifications** : dans la table `demandes`, le recruteur est identifié par `recruteur_id` (FK) mais l'email est dans la table `recruteurs`. La fonction `notify` pour la short-list utilise quel champ exactement ? (`selectedDem.contact` ? `selectedDem.recruteur_email` ?) — À VÉRIFIER dans Admin.jsx avant de déboguer Test 2.

2. **Doublons candidats** : un candidat peut soumettre plusieurs fois le formulaire → plusieurs lignes dans `candidats` avec le même email. Faut-il bloquer à l'insertion (contrainte UNIQUE sur email + logique upsert) ou laisser l'admin gérer manuellement ?

3. **Modèle économique côté recruteur** : le prix de 1 490 MAD par short-list est décidé mais pas implémenté. Par quel moyen de paiement ? (virement, CIH Money, carte bancaire via Stripe ?) — Décision Mohammed requise avant implémentation.

4. **Rôle dans Supabase Auth** : comment distinguer un candidat d'un recruteur dans Supabase Auth ? Actuellement via `user_metadata.role` (À VÉRIFIER) ou via une table séparée ? La logique `intendedRole` / `RoleMismatch` dépend de cette réponse.

5. **DNS jurijob.ma** : MyVala a répondu favorablement au ticket. La propagation DNS est-elle complète ? `www.jurijob.ma` est-il accessible sans erreur ?

6. **Design visuel** : Mohammed veut une refonte. Faut-il garder les couleurs Navy/Gold/Cream ou tout repenser ? A-t-il des références visuelles (sites, logos) ?