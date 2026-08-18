# Futura Orb

Crée un composant d'application mobile React complet, stylisé avec Tailwind CSS, basé sur l'image de référence fournie.

Design & Ambiance :

Thème sombre futuriste et épuré (fonds #0d0b10 / zinc-950).

Typographie moderne, sans-serif, lisible et minimale.

Structure de l'Écran Principal (Home) :

Header supérieur : Un bouton menu hamburger (3 traits) à gauche, le titre "VOTRE JOURNÉE" au centre, et une icône profil à droite.

Zone Centrale : Un orbe 3D interactif animé au centre (utilise des animations CSS Tailwind comme animate-pulse ou un canevas stylisé avec ombre portée lumineuse).

Bouton d'Action Principal : Une carte arrondie en bas de l'orbe affichant : "ACCÉDER À MES PROJETS ET TÂCHES" avec une icône de liste.

Microphone Vocal : Tout en bas, un petit bouton micro discret avec le sous-texte "JARVIS VOUS ÉCOUTE".

Menu Latéral Interactif (Drawer à gauche) :

Déclenché lors du clic sur le menu hamburger.

Section 1 : Personnalisation de l'Orbe -> Sélecteur de couleur (Boutons ronds : Rouge, Bleu, Vert, Blanc) et Sélecteur de style (Option A : Classique, Option B : Planétaire).

Section 2 : Navigation -> "Mes Projets et Tâches" et "Réduire les mauvaises habitudes (Dopamine Detox)".

Interactivité requis (State React) :

Le changement de couleur dans le menu doit modifier instantanément la couleur de l'orbe central.

Le clic sur "Accéder à mes projets" doit basculer l'affichage vers une vue sous forme de liste épurée."

2. Décryptage : Pourquoi ce prompt fonctionne ?

Pour faire générer du code par une IA sans qu'elle n'invente n'importe quoi, il faut découper tes consignes selon 4 piliers fondamentaux :

Le Contexte Technique (Stack) : Tu spécifies immédiatement React et Tailwind CSS. Ça force l'IA à utiliser des bibliothèques standardisées.

La Décomposition UI (Layout) : Tu découpes l'écran de haut en bas (Header -> Zone Centrale -> Actions -> Micro). L'IA suit une grille mentale rigide.

La Gestion d'État (React State) : Tu indiques à l'IA quelles variables doivent changer (state de la couleur de l'orbe, ouverture du menu). Sans ça, elle te génère du visuel mort sans interactivité.

L'Alignement visuel : En joignant l'image, l'IA utilise la vision par ordinateur pour extraire les marges, les contrastes et les arrondis exacts.

3. Action immédiate à réaliser

Ouvre Lovable (plan gratuit).

Clique sur l'icône d'import d'image et charge la maquette de ton application.

Copie-colle le prompt ci-dessus et lance la génération.

Une fois le résultat affiché, teste les clics (menu, changement de couleur).

Dès que c'est validé, clique sur "Export to GitHub" pour récupérer le code gratuitement sur ton ordinateur.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://orbe-interactive-core.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/03fa660a-9e12-4ab3-bb46-d39bc4047150).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
