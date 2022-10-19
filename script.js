"use strict";

//fix: Figure out why click event still occurs between rps buttons
//fix: Hitting reset then start then reset and rps shows up at same time as choose

// Logo and Splash
const logo = document.querySelector(".game__logo");
const splashScreen = document.querySelector(".game__splash");
const splashSpan = splashScreen.querySelectorAll("span");

// Screen
const screenToggle = document.querySelector(".screen-display--toggle");
const screen = document.querySelector(".screen-display");
const gameDisplay = document.querySelector(".screen-display__game");

// Scoreboard
const scoreBd = document.querySelector(".screen-display__scoreboard");
const scoreBdUser = document.querySelector("#scoreboard__user-score");
const scoreBdComputer = document.querySelector("#scoreboard__computer-score");

// Device buttons
const powerBtn = document.querySelector(".power__btn");
const startBtn = document.querySelector("#start__btn");
const resetBtn = document.querySelector("#reset__btn");

// Choosing
const gameText = document.querySelector(".game__text");
const gameImages = document.querySelector(".game__images");

// Game buttons
const controlBtns = document.querySelector(".controls__selection");
const selectionBtns = document.querySelectorAll(".controls__selection-btn");
const compChoice = document.querySelector("#images__computer");
const userChoice = document.querySelector("#images__user");
// ===============================================================================================================

const countdown = ["-ROCK-", "-PAPER-", "-SCISSORS-", "-SHOOT-"];

const pick = [
  '<img src="./rock.png"></img>',
  '<img src="./paper.png"></img>',
  '<img src="./scissors.png"></img>',
];

let devicePower = false;
let booting = false;
let bootingTimeout = null;
let userScore = 0;
let computerScore = 0;

const gameDevice = {};
//note: Functions
const addComputerScore = () => {
  computerScore++;
  scoreBdComputer.innerHTML = computerScore;
};

const addUserScore = () => {
  userScore++;
  scoreBdUser.innerHTML = userScore;
};

const playAgain = () => {
  resetBtn.addEventListener("click", resetGame);
  startBtn.addEventListener("click", startGame);
  gameText.textContent = "PRESS START TO CONTINUE";
};

const gameResults = (clicked, player, random) => {
  if (
    document.querySelector(`.controls__selection-btn--${clicked.dataset.btn}`)
  ) {
    gameImages.classList.remove("hidden");
    userChoice.innerHTML = pick[player];
    compChoice.innerHTML = pick[random];
    console.log(player, random);
  }
  setTimeout(() => {
    gameImages.classList.add("hidden");
    if (player === random) {
      gameText.textContent = "TIE!";
      return setTimeout(playAgain, 3000);
    }

    if (player > random) {
      if (random == 0 && player == 2) {
        gameText.textContent = "YOU LOSE!";
        addComputerScore();
        return setTimeout(playAgain, 3000);
      } else {
        gameText.textContent = "YOU WIN!";
        addUserScore();
        return setTimeout(playAgain, 3000);
      }
    }

    if (random == 2 && player == 0) {
      gameText.textContent = "YOU WIN!";
      addUserScore();
      return setTimeout(playAgain, 3000);
    } else {
      gameText.textContent = "YOU LOSE!";
      addComputerScore();
      return setTimeout(playAgain, 3000);
    }
  }, 2500);
}; // refactoring to check two values

const powering = function () {
  if (!devicePower) {
    devicePower = true;
    screen.classList.add("screen-display--toggle");
    powerBtn.style.transform = "translate(2rem)";
    bootingTimeout = setTimeout(() => {
      booting = true;
      logo.classList.remove("animate");
      splashScreen.classList.add("show");
      startBtn.addEventListener("click", startGame);
    }, 5000);
    logo.classList.add("animate");
  } else {
    booting = false;
    devicePower = false;
    screen.classList.remove("screen-display--toggle");
    powerBtn.style.transform = "translate(0px)";
    splashScreen.classList.remove("show");
    startBtn.removeEventListener("click", startGame);
    resetBtn.removeEventListener("click", resetGame);
    resetGame(false);
    clearTimeout(bootingTimeout);
  }
};

const startGame = () => {
  if (!devicePower) return;
  logo.classList.remove("animate");
  splashScreen.classList.remove("show");
  scoreBd.classList.remove("hidden");
  gameDisplay.style.height = "240px";
  gameText.style.fontSize = "1.5em";
  gameText.classList.remove("hidden");
  gameText.textContent = "-CHOOSE-";
  controlBtns.addEventListener("click", pressBtn);
  resetBtn.addEventListener("click", resetGame);
  startBtn.removeEventListener("click", startGame);
};

const resetGame = (boot) => {
  scoreBdUser.textContent = 0;
  scoreBdComputer.textContent = 0;
  scoreBd.classList.add("hidden");
  gameDisplay.style.height = "280px";
  gameText.textContent = null;
  gameImages.classList.add("hidden");
  controlBtns.removeEventListener("click", pressBtn);

  if (devicePower) {
  }
  logo.classList.remove("animate");
  clearTimeout(bootingTimeout);

  if (!boot) {
    return;
  }
  booting = true;
  setTimeout(() => {
    booting = false;
    startBtn.addEventListener("click", startGame);
    splashScreen.classList.add("show");
  }, 1000);
};

const pressBtn = (e) => {
  countdown.forEach((el, i) => {
    setTimeout(() => {
      if (!devicePower) {
        gameText.classList.add("hidden");
        return;
      }
      gameText.textContent = `${el}`;
    }, i * 1000);
  });

  bootingTimeout = setTimeout(() => {
    if (!devicePower) return;
    gameText.textContent = "";
    const clicked = e.target.closest(".controls__selection-btn");
    if (!clicked) return;

    let player = parseInt(clicked.value);
    let random = Math.floor(Math.random() * 3);

    bootingTimeout = setTimeout(gameResults(clicked, player, random), 2500);
  }, 4000);
  resetBtn.removeEventListener("click", resetGame);
  controlBtns.removeEventListener("click", pressBtn);
};

//important: Event Listeners
powerBtn.addEventListener("click", powering);
