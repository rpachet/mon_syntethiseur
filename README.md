# 🎹 Mon Synthétiseur — Guide pour l'enseignant

> Un synthétiseur modulaire éducatif pour explorer les sons dans le navigateur.
> Conçu pour les enfants, simple à utiliser pour les enseignants.

---

## 🚀 Démarrage rapide (2 étapes)

1. **Téléchargez** le dossier `Synth-web` (ou décompressez le fichier `.zip`)
2. **Double-cliquez** sur le fichier `index.html`

C'est tout ! Pas d'installation, pas de mot de passe, pas de compte.

> ✅ Fonctionne avec **Chrome**, **Firefox**, **Edge** (versions récentes)
> ⚠️ Ne fonctionne pas hors-ligne si vous bloquez les CDN. Pour une utilisation 100% hors ligne, ouvrez le dossier via un serveur local (voir ci-dessous).

---

## 🎮 Comment ça marche ?

### Le clavier
- Cliquez sur les touches du piano avec la souris
- Ou utilisez le clavier de l'ordinateur : `A Z E R T Y U I O P` pour les touches blanches

### Les modules (le rack)
L'application fonctionne comme un vrai synthétiseur analogique : vous assemblez des **modules** en les **glissant-déposant** dans le rack.

| Module | Ce qu'il fait |
|--------|--------------|
| 🎵 **Oscillateur** | Crée le son de base. Choisissez la forme du son. |
| 🔮 **Filtre** | Rend le son plus grave ou plus aigu. |
| 📈 **Enveloppe** | Contrôle comment le son démarre et s'arrête. |
| 🌊 **LFO (Vibrato)** | Fait trembler le son (vibrato). |
| 🏔️ **Réverb** | Ajoute un effet de grande salle. |
| 🔁 **Écho** | Répète le son en écho. |
| 🔊 **Volume** | Contrôle le volume général. |

**Pour ajouter un module :** glissez-le depuis la colonne de gauche vers le rack.
**Pour le retirer :** cliquez sur le ✕ en haut du module.
**Pour changer l'ordre :** glissez le module à un autre endroit dans le rack.

### Le mode « Apprendre »
Cliquez sur **🎓 Mode Apprendre**, choisissez une mélodie, et laissez-vous guider : la touche à appuyer s'allume en vert !

---

## 🛜 Utilisation sans connexion internet

Le synthétiseur charge les potards (knobs) depuis internet. Pour l'utiliser **complètement hors ligne** :

1. Installez [Deno](https://deno.land/) (une seule commande, voir leur site)
2. Dans le dossier du projet, ouvrez un terminal et tapez :
   ```
   deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts .
   ```
3. Ouvrez `http://localhost:4507` dans le navigateur

---

## 🍺 Licence

Distribué sous la **Beerware License** (Revision 42).
Vous pouvez faire ce que vous voulez avec ce code.
Si on se croise un jour et que vous pensez que ça valait le coup, offrez-moi une bière. 🍺
