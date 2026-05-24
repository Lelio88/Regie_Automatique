# Regie 24h Prototype — Contexte d'Opération et Garde-Fous Agentiques

Résolvez les problèmes sans introduire de régression ni de dette technique architecturale.

## I. Finalité

**Application** : regie-24h-prototype — Régie vidéo multi-caméras temps réel
**Objectif métier** : Diffuser et contrôler plusieurs flux vidéo depuis des smartphones vers un dashboard centralisé via WebRTC, avec replay instantané.

## II. Architecture

**Modèle** : Client-serveur monolithique avec signalisation WebSocket et streaming P2P WebRTC.

**Détails complets** : voir [`docs/architecture.md`](./docs/architecture.md).

Topologie rapide :
- `server.js` — Serveur Express + signalisation Socket.IO (offre/réponse/ICE)
- `public/dashboard.html` — Interface de régie (réception des flux, sélection, replay)
- `public/phone_client.html` — Client mobile (capture caméra, émission WebRTC)

## III. Pile Technologique

*Versions contraintes par `package.json`. N'introduisez aucune dépendance alternative sans approbation.*

- **Runtime** : Node.js
- **Serveur HTTP** : Express ^4.18
- **Signalisation** : Socket.IO ^4.7
- **Streaming** : WebRTC (natif navigateur)
- **Frontend** : HTML5, JavaScript vanilla (aucun bundler)

## IV. Garde-Fous non négociables

1. Aucun secret (clé API, token) ne doit être hardcodé — utiliser `process.env`
2. Le serveur ne proxy jamais les flux vidéo — seule la signalisation transite par le serveur
3. HTTPS obligatoire en production (contrainte WebRTC pour `getUserMedia`)
4. Pas de framework frontend — le prototype reste en JS vanilla pour rester léger

## V. Flux de Travail (Explore → Plan → Code → Verify)

1. **Exploration** — lire les fichiers adjacents pour calquer les patterns existants
2. **Planification** — soumettre l'approche pour les changements non triviaux
3. **Implémentation** — code minimal, testable manuellement via navigateur
4. **Vérification** — `npm start` puis tester manuellement dashboard + phone client

## VI. Commandes de Développement

```bash
npm install        # Installer les dépendances
npm start          # Lancer le serveur (port 3000)
# Dashboard : http://localhost:3000/dashboard.html
# Client :    http://localhost:3000/phone_client.html
```

## VII. Maintenance documentaire

**Règle d'or** : le diff du code et le diff de la doc correspondante doivent être dans **le même commit**.

| Modification | Fichier à mettre à jour |
|---|---|
| Nouvel événement Socket.IO | Section « Protocole de signalisation » de `docs/architecture.md` |
| Nouvelle page HTML dans `public/` | Section II de `CLAUDE.md` + topologie dans `docs/architecture.md` |
| Ajout de dépendance | Section III de `CLAUDE.md` + `package.json` |
| Nouvel anti-pattern découvert | Section « Anti-patterns » de `docs/architecture.md` |

## VIII. Contexte de Session

- **Dernier focus** : —
- **Focus immédiat** : —
