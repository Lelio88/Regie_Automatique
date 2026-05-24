# Architecture — Regie 24h Prototype

## Vue d'ensemble

Prototype de régie vidéo multi-caméras utilisant WebRTC pour le streaming peer-to-peer et Socket.IO pour la signalisation. Le serveur Node.js ne traite aucun flux média — il se limite à relayer les messages de signalisation (offer/answer/ICE candidates) entre les clients phone et le dashboard.

## Diagramme des couches

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                                │
│                                                                 │
│  ┌──────────────────┐         ┌──────────────────────────────┐  │
│  │  phone_client    │         │        dashboard             │  │
│  │  ─────────────   │         │  ────────────────────────    │  │
│  │  getUserMedia()  │◄═══════►│  RTCPeerConnection (recv)    │  │
│  │  RTCPeerConn     │  WebRTC │  MediaRecorder (buffer 10s)  │  │
│  │  (send tracks)   │  P2P    │  Mini-vignettes + main video │  │
│  └────────┬─────────┘         └──────────────┬───────────────┘  │
│           │ Socket.IO                         │ Socket.IO        │
└───────────┼───────────────────────────────────┼─────────────────┘
            │                                   │
            ▼                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     server.js (Node.js)                          │
│  ─────────────────────────────────────────────────────────────  │
│  Express : sert les fichiers statiques (public/)                │
│  Socket.IO : relaye offer, answer, ice-candidate                │
│  État : dashboardSocketId (un seul dashboard actif)             │
└─────────────────────────────────────────────────────────────────┘
```

## Protocole de signalisation

| Événement | Direction | Payload | Rôle |
|---|---|---|---|
| `identify` | Client → Serveur | `'dashboard'` ou `'phone'` | Enregistre le rôle du socket |
| `phone-joined` | Serveur → Dashboard | `{ phoneId }` | Notifie l'arrivée d'un téléphone |
| `phone-left` | Serveur → Dashboard | `{ phoneId }` | Notifie la déconnexion |
| `offer` | Phone → Serveur → Dashboard | `{ targetId, sdp }` | SDP offer WebRTC |
| `answer` | Dashboard → Serveur → Phone | `{ targetId, sdp }` | SDP answer WebRTC |
| `ice-candidate` | Bidirectionnel via serveur | `{ targetId, candidate }` | Candidat ICE |

## Flux typique d'une connexion

1. Le **phone** se connecte via Socket.IO et émet `identify('phone')`
2. Le serveur notifie le dashboard via `phone-joined`
3. Le phone capture la caméra (`getUserMedia`), crée un `RTCPeerConnection`, ajoute les tracks
4. Le phone crée une **offer SDP** et l'envoie via `socket.emit('offer', { targetId: null, sdp })`
5. Le serveur relaye l'offer au dashboard (routée vers `dashboardSocketId`)
6. Le dashboard crée un `RTCPeerConnection`, applique l'offer, génère une **answer SDP**
7. L'answer est relayée au phone via le serveur
8. Les deux pairs échangent les **ICE candidates** via le serveur
9. La connexion WebRTC P2P est établie — le flux vidéo transite directement entre les pairs
10. Le dashboard affiche le flux dans une vignette et permet de le sélectionner comme vidéo principale

## Fonctionnalité Replay

Le dashboard utilise `MediaRecorder` sur le `captureStream()` de la vidéo principale pour bufferiser les 10 dernières secondes en blobs WebM. Le bouton « Replay Last 10s » assemble ces blobs et les lit dans un élément vidéo flottant en overlay.

## Anti-patterns à éviter

- ❌ Faire transiter les flux vidéo par le serveur (le serveur ne fait que la signalisation)
- ❌ Stocker l'état des pairs autrement que par socket ID (pas de persistance)
- ❌ Ajouter un bundler ou un framework frontend (le prototype doit rester déployable sans build)
- ❌ Utiliser `targetId: null` sans que le serveur le résolve (risque de messages perdus)
- ❌ Oublier HTTPS en déploiement (bloque `getUserMedia` sur les navigateurs)

## Limites connues du prototype

- Un seul dashboard supporté simultanément (`dashboardSocketId` est un scalaire)
- Pas de TURN/STUN configuré — ne fonctionne qu'en réseau local ou avec des pairs sans NAT restrictif
- Le routage `targetId: null` côté phone est un hack : le serveur redirige implicitement vers le dashboard
- Pas de gestion de reconnexion (si le WebSocket tombe, la session est perdue)
- Pas de fichier CSS (`style.css` référencé mais absent)

## Dépendances externes

| Package | Version | Rôle |
|---|---|---|
| `express` | ^4.18.2 | Serveur HTTP + fichiers statiques |
| `socket.io` | ^4.7.2 | Signalisation WebSocket bidirectionnelle |
