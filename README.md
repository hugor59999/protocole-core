# Protocole Core

Quiz de diagnostic masculin déployé sur [protocole-core.vercel.app](https://protocole-core.vercel.app).

Stack : Next.js (App Router), Tailwind CSS, API Anthropic, Airtable, Resend.

## Flow

1. Page d'accueil avec accroche et CTA "Commencer"
2. 6 scénarios en réponse libre, un par un, avec barre de progression
3. Écran "Analyse en cours..."
4. Diagnostic personnalisé généré par Claude (`claude-sonnet-4-20250514`)
5. Formulaire de collecte (prénom, email, mobile) affiché après le résultat
6. Email automatique avec le diagnostic complet + lien Calendly (via Resend)
7. CTA pour réserver un appel via Calendly

## Dashboard

`/dashboard` (protégé par mot de passe) liste les leads stockés dans Airtable :
prénom, email, mobile, date, statut. Cliquer sur une ligne ouvre le détail
(les 6 réponses + diagnostic complet), avec changement de statut, copie du
numéro en un clic, filtre par statut et tri par date.

## Variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner :

```
ANTHROPIC_API_KEY=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
NEXT_PUBLIC_CALENDLY_URL=
RESEND_API_KEY=
DASHBOARD_PASSWORD=
```

La table Airtable `Leads` doit contenir les champs : `Prénom`, `Email`,
`Mobile`, `Date`, `Réponse 1` à `Réponse 6`, `Diagnostic`, `Statut`
(options : À contacter / Contacté / En cours / Signé).

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Le projet est déployé automatiquement sur Vercel à chaque push sur `main`,
en branchant le dépôt GitHub `hugor59999/protocole-core` sur un projet Vercel
et en renseignant les variables d'environnement ci-dessus dans les
paramètres du projet.
