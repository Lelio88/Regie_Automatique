# Regie 24h Prototype

Système de régie vidéo multi-caméras en temps réel. Connectez plusieurs smartphones pour diffuser leurs flux vidéo vers un dashboard centralisé, avec sélection de la caméra principale et replay instantané.

## Fonctionnalités

- **Multi-caméras** : plusieurs téléphones diffusent simultanément
- **Dashboard de contrôle** : visualisez tous les flux et choisissez lequel afficher en grand
- **Replay instantané** : revoyez les 10 dernières secondes à tout moment

## Démarrage rapide

```bash
npm install
npm start
```

Puis ouvrez dans votre navigateur :
- **Dashboard** (sur ordinateur) : http://localhost:3000/dashboard.html
- **Client téléphone** (sur mobile) : http://localhost:3000/phone_client.html

## Utilisation

1. Ouvrir le dashboard sur un ordinateur
2. Ouvrir le client sur un ou plusieurs smartphones (même réseau Wi-Fi)
3. Appuyer sur « Start stream » sur chaque téléphone
4. Cliquer sur « Set as Main Video » sous la vignette souhaitée
5. Utiliser « Replay Last 10s » pour revoir un moment

## Prérequis

- Node.js installé
- Tous les appareils sur le même réseau local
- En production : HTTPS requis (les navigateurs bloquent l'accès caméra sans HTTPS)
