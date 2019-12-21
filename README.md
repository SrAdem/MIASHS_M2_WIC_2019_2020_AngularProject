# MIASHS Master 2 - Projet Angular

## Installation

Afin d'installer la todolist, il vous faut cloner le répertoire et installer toutes les dépendances.
Pour ce faire, il vous suffit d'éffectuer les commandes suivantes :
```
git clone https://github.com/SrAdem/MIASHS_M2_WIC_2019_2020_AngularProject.git
cd MIASHS_M2_WIC_2019_2020_AngularProject
npm install
```
 
## Utilisation
 
Tout en restant dans le répertoire du projet, exécuter la commande suivante :
```
ng serve -o
```
Ensuite, à l'aide de votre navigateur préféré (de préférence Chrome) aller sur la page `http://localhost:4200/`.

---
## Fonctionnalités

Ici sont listées toutes les fonctionnalités supplémentaires de l'application.

### Édition du nom de la liste

Il est possible de modifier le titre de la todolist à l'aide d'un double clic sur le titre.
Une zone pré-complété avec le titre actuel apparaitra avec le focus dessus. Plus qu'à modifier et appuyer sur la touche "entré".

### Effacer Tout

Un bouton permettant d'effacer toute la todolist. Il ne réinitialise pas le nom de la liste pour autant.

### Undo Redo

Deux boutons ont été ajoutés, un pour défaire toutes les actions possibles sur l'application (y compris les fonctionnalités précédentes), l'autre refaire ce qui a été défait. Si on défait une action, ce qui a été défait peut être refait, sauf si l'utilisateur effectue une nouvelle action hormis le "redo".

### Local Storage 

Cette fonctionnalité permet d'enregistrer sa todolist afin de pouvoir y accéder plus tard, en fermant et en redémarrant son navigateur. Si on change de navigateur, la todolist sera différente.
De plus, les undo et redo sont aussi enregistrer, ce qui veut dire qu'on peut défaire une action, même après avoir relancé sa page de todolist ultérieurement.

### Reconnaissance Vocale

> Cette fonctionnalité n'est utilisable que sur le navigateur chrome !

Il est possible d'ajouter un élément à la liste à partir d'un bouton qui active la reconnaissance vocal. La fonctionnalité ne reconnait que le français, de plus ce qui a été énoncé par l'utilisateur est affiché dans la barre de complétion d'élément pour que l'utilisateur puisse modifier le texte s'il y a eu une incompréhension de la détection vocale.
