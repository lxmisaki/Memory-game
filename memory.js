'use strict'; // Active le mode strict pour éviter les erreurs silencieuses et améliorer la qualité du code.

// Sélection des éléments DOM nécessaires
const moves = document.getElementById("moves-count"); // Affiche le nombre de coups effectués
const timeValue = document.getElementById("time"); // Affiche le temps écoulé
const startButton = document.getElementById("start"); // Bouton pour démarrer la partie
const stopButton = document.getElementById("stop"); // Bouton pour arrêter la partie
const gameContainer = document.querySelector(".game-container"); // Conteneur du plateau de jeu
const result = document.getElementById("result"); // Affiche le résultat (victoire ou autres)
const controls = document.querySelector(".controls-container"); // Conteneur pour les boutons de contrôle

// Variables globales pour la gestion du jeu
let cards; // Contient toutes les cartes du jeu
let interval; // Variable pour gérer le timer
let firstCard = false; // Indique si une première carte est sélectionnée
let secondCard = false; // Indique si une deuxième carte est sélectionnée
let firstCardValue = ""; // Stocke la valeur de la première carte sélectionnée

// Liste des objets (cartes) pour le jeu avec leurs noms et images
const items = [
  { name: "arbre", image: "1.jpg" },
  { name: "cerise", image: "2.jpg" },
  { name: "jaune", image: "3.jpg" },
  { name: "poisson", image: "4.jpg" },
  { name: "dessert", image: "5.jpg" },
  { name: "monkey", image: "6.jpg" },
  { name: "kitty", image: "7.jpg" },
  { name: "house", image: "8.jpg" },
  { name: "house2", image: "9.jpg" },
  { name: "poussin", image: "10.jpg" },
  { name: "fleurs", image: "11.jpg" },
  { name: "parc", image: "12.jpg" },
];

// Variables pour le chronomètre
let seconds = 0, // Nombre de secondes écoulées
  minutes = 0; // Nombre de minutes écoulées

// Variables pour le suivi des coups et des paires trouvées
let movesCount = 0, // Compteur de coups effectués
  winCount = 0; // Compteur de paires correctement associées

// Fonction pour gérer le chronomètre
const timeGenerator = () => {
  seconds += 1; // Incrémente les secondes
  if (seconds >= 60) {
    minutes += 1; // Ajoute une minute si les secondes atteignent 60
    seconds = 0; // Réinitialise les secondes
  }
  // Formatage pour afficher les minutes et secondes avec deux chiffres
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Temps:</span> ${minutesValue}:${secondsValue}`; // Met à jour l'affichage
};

// Fonction pour compter les coups
const movesCounter = () => {
  movesCount += 1; // Incrémente le compteur de coups
  moves.innerHTML = `<span>Coups:</span> ${movesCount}`; // Met à jour l'affichage
};

// Fonction pour sélectionner des objets aléatoires pour les cartes
const generateRandom = (size = 4) => {
  let tempArray = [...items]; // Copie de la liste des items
  let cardValues = []; // Liste pour stocker les cartes sélectionnées
  size = (size * size) / 2; // Nombre de paires nécessaires
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length); // Sélection aléatoire
    cardValues.push(tempArray[randomIndex]); // Ajoute l'objet à la liste des cartes
    tempArray.splice(randomIndex, 1); // Supprime l'objet sélectionné pour éviter les doublons
  }
  return cardValues; // Retourne les cartes sélectionnées
};

// Fonction pour générer le plateau de jeu
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = ""; // Réinitialise le conteneur de jeu
  cardValues = [...cardValues, ...cardValues]; // Duplique les cartes pour former des paires
  cardValues.sort(() => Math.random() - 0.5); // Mélange les cartes aléatoirement
  for (let i = 0; i < size * size; i++) {
    // Génère la structure HTML pour chaque carte
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${cardValues[i].image}" class="image" />
        </div>
      </div>
    `;
  }
  // Définit la grille de cartes
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

  // Sélectionne toutes les cartes et leur ajoute un événement de clic
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped"); // Retourne la carte
        if (!firstCard) {
          // Si c'est la première carte sélectionnée
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Si c'est la deuxième carte
          movesCounter(); // Incrémente le compteur de coups
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue === secondCardValue) {
            // Si les deux cartes correspondent
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1; // Incrémente le compteur de paires trouvées
            if (winCount === Math.floor(cardValues.length / 2)) {
              // Si toutes les paires sont trouvées
              result.innerHTML = `
                <h2>Tu as gagne!</h2>
                <h4>Coups: ${movesCount}</h4>
              `;
              stopGame(); // Arrête le jeu
            }
          } else {
            // Si les cartes ne correspondent pas
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            setTimeout(() => {
              // Retourne les cartes face cachée après un délai
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Démarre le jeu
startButton.addEventListener("click", () => {
  movesCount = 0; // Réinitialise le compteur de coups
  seconds = 0; // Réinitialise les secondes
  minutes = 0; // Réinitialise les minutes
  controls.classList.add("hide"); // Masque les contrôles de démarrage
  stopButton.classList.remove("hide"); // Affiche le bouton d'arrêt
  startButton.classList.add("hide"); // Masque le bouton de démarrage
  interval = setInterval(timeGenerator, 1000); // Lance le chronomètre
  moves.innerHTML = `<span>Coups:</span> ${movesCount}`;
  timeValue.innerHTML = `<span>Temps:</span> 00:00`;
  initializer(); // Initialisation du jeu
});

// Ajoute un événement de clic au bouton Arrêter
stopButton.addEventListener("click", () => {
  stopGame(); // Appelle la fonction pour arrêter le jeu
});

// Arrête le jeu
const stopGame = () => {
  controls.classList.remove("hide"); // Affiche les contrôles de démarrage
  stopButton.classList.add("hide"); // Masque le bouton d'arrêt
  startButton.classList.remove("hide"); // Affiche le bouton de démarrage
  clearInterval(interval); // Arrête le chronomètre
};

// Initialisation des valeurs et du jeu
const initializer = () => {
  result.innerText = ""; // Réinitialise l'affichage du résultat
  winCount = 0; // Réinitialise le compteur de paires trouvées
  let cardValues = generateRandom(); // Génère des cartes aléatoires
  matrixGenerator(cardValues); // Génère le plateau de jeu
};
