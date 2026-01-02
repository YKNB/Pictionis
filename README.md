# Pictlonis
# architecture auth 
![1_mJpDhhE-fOLnPzQhpKin4w.png](https://www.dropbox.com/scl/fi/ezgur1njf2hvm9rdowfly/1_mJpDhhE-fOLnPzQhpKin4w.png?rlkey=b24nvw9pkfua14ea46yzl7ylu&dl=0&raw=1)
# architecture fonctionnelle 
                       +--------------+
                       | WelcomeScreen|
                       +--------------+
                               |
                               | Navigation (Login / Register)
                               |
                      +------------------+
                      | RegisterScreen   |
                      +------------------+
                               |
                               | Navigation (Login)
                               |
                      +------------------+
                      | LoginScreen      |
                      +------------------+
                               |
                               | Navigation (Home)
                               |
                      +------------------+
                      | HomeScreen       |
                      +------------------+
                               |
                               | Navigation (CreateGame / Game / GameAuth)
                               |
               +---------------------+-------------------+
               | CreateGameScreen    | GameScreen        |
               +---------------------+-------------------+
                               |
                               | Navigation (Home)
                               |
                       +------------------+
                       | GameWinScreen    |
                       +------------------+

Ce diagramme représente la navigation entre les écrans principaux de l'application. 
Il montre comment les utilisateurs peuvent passer d'un écran à un autre en fonction de leurs actions et des interactions avec l'application.

# Description des Écrans
- WelcomeScreen: Cet écran est affiché lorsque l'utilisateur lance l'application pour la première fois. Il permet à l'utilisateur de se connecter ou de s'inscrire.

- RegisterScreen: Sur cet écran, l'utilisateur peut créer un nouveau compte en fournissant son nom, son adresse e-mail et son mot de passe.

- LoginScreen: Cet écran permet à l'utilisateur de se connecter en utilisant son adresse e-mail et son mot de passe.

- HomeScreen: Après s'être connecté, l'utilisateur est dirigé vers cet écran, où il peut voir un aperçu de son profil et des jeux disponibles.

- CreateGameScreen: Sur cet écran, l'utilisateur peut créer un nouveau jeu en fournissant un nom pour le jeu, un mot à deviner et éventuellement un mot de passe pour restreindre l'accès.

- GameScreen: Cet écran affiche le jeu en cours, où l'utilisateur peut dessiner ou deviner le mot.

- GameWinScreen: Lorsqu'un joueur gagne une partie, cet écran affiche le vainqueur et lui permet de revenir à l'écran d'accueil.

# Fonctionnement basé sur la navigation entre les Écrans

L'utilisateur peut passer du WelcomeScreen au RegisterScreen pour créer un nouveau compte.
Après s'être inscrit, l'utilisateur peut revenir au LoginScreen pour se connecter.
Une fois connecté, l'utilisateur est redirigé vers le HomeScreen, où il peut voir les jeux disponibles.
À partir de là, l'utilisateur peut créer un nouveau jeu en accédant au CreateGameScreen.
Une fois qu'un jeu est créé, l'utilisateur peut le rejoindre et jouer sur le GameScreen.
Lorsqu'un jeu est terminé, l'utilisateur peut voir le résultat sur le GameWinScreen et revenir à l'écran d'accueil.


# installation et execution 

* npm install --legacy-peer-deps
* npm run start