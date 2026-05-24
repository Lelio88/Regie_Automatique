# Regie 24h Prototype

Système de régie vidéo multi-caméras en temps réel. Connectez plusieurs smartphones pour diffuser leurs flux vidéo vers un dashboard centralisé, avec sélection de la caméra principale et replay instantané.

## Fonctionnalités

- **Multi-caméras** : plusieurs téléphones diffusent simultanément
- **Dashboard de contrôle** : visualisez tous les flux et choisissez lequel afficher en grand
- **Replay instantané** : revoyez les 10 dernières secondes à tout moment
- **Reconnexion automatique** : si la connexion coupe, le stream reprend tout seul

## Mise en route

### 1. Installer

Il faut [Node.js](https://nodejs.org/) installé sur l'ordinateur qui servira de serveur.

```bash
npm install
```

### 2. Lancer le serveur

```bash
npm start
```

Le serveur démarre sur le port 3000.

### 3. Trouver l'adresse IP de l'ordinateur

Les téléphones doivent accéder au serveur via l'IP locale de l'ordinateur (pas « localhost »).

- **Windows** : ouvrir un terminal, taper `ipconfig` → chercher « Adresse IPv4 » (ex: `192.168.1.42`)
- **Mac/Linux** : taper `ifconfig` ou `ip addr` → chercher l'adresse en `192.168.x.x`

### 4. Ouvrir le dashboard (sur l'ordinateur)

Aller sur : `http://localhost:3000/dashboard.html`

### 5. Connecter les téléphones

Sur chaque smartphone, ouvrir dans Chrome : `http://192.168.1.42:3000/phone_client.html` (remplacer par votre IP).

**Important** : les navigateurs bloquent la caméra en HTTP (sauf localhost). Deux solutions :

#### Solution A — ngrok (recommandé, 2 minutes)

[ngrok](https://ngrok.com/) crée un tunnel HTTPS gratuit vers votre serveur local :

```bash
# Installer ngrok (une seule fois)
# → télécharger sur https://ngrok.com/download

# Lancer le tunnel
ngrok http 3000
```

ngrok affiche une URL en `https://xxxx.ngrok.io`. Ouvrez cette URL sur les téléphones — la caméra fonctionnera.

#### Solution B — Flag Chrome (Android uniquement)

1. Sur le téléphone, ouvrir Chrome et aller à `chrome://flags`
2. Chercher « Insecure origins treated as secure »
3. Ajouter `http://192.168.1.42:3000` (votre IP)
4. Relancer Chrome

### 6. Lancer le stream

1. Sur chaque téléphone : appuyer sur **« Start stream »**
2. Sur le dashboard : les vignettes apparaissent au fur et à mesure
3. Cliquer sur **« Set as Main Video »** pour choisir la caméra principale
4. Cliquer sur **« Replay Last 10s »** pour revoir les dernières secondes

## En cas de problème

| Symptôme | Cause probable | Solution |
|----------|---------------|----------|
| La page ne charge pas sur le téléphone | Pas sur le même Wi-Fi, ou mauvaise IP | Vérifier l'IP, vérifier le Wi-Fi |
| « Start stream » ne fait rien | Caméra bloquée (pas HTTPS) | Utiliser ngrok ou le flag Chrome |
| Pas de vignette sur le dashboard | Le dashboard n'était pas ouvert avant le phone | Ouvrir le dashboard en premier, puis les phones |
| Le stream se coupe | Wi-Fi instable | Il reprend automatiquement à la reconnexion |
