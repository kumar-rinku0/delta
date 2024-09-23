let h3 = document.querySelector("h3");
let highscoreTag = document.querySelector("#highest-score");
let btns = document.querySelectorAll(".btn");
let gameStared = false;
const key = ["one", "two", "three", "four"];
let gameData = [];
let userData = [];
let max = 0;
let lavel = 0;

function lavelUp() {
  userData = [];
  lavel++;
  h3.innerHTML = `lavel <b>${lavel}</b>`;
  let idx = Math.floor(Math.random() * 4);
  let keyValue = key[idx];
  gameData.push(keyValue);
  console.log("gamedata ", gameData, keyValue);
  let btn = document.querySelector(`.${keyValue}`);
  max = Math.max(max, lavel);
  setTimeout(btnFlash(btn), 1000);
}

function btnFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 250);
}

document.addEventListener("keypress", () => {
  if (!gameStared) {
    gameStared = true;
    highscoreTag.classList.add("hidden");
    lavelUp();
  }
});

function checkInput(idx) {
  if (gameData[idx] === userData[idx]) {
    if (gameData.length === userData.length) {
      setTimeout(lavelUp, 1000);
    }
  } else {
    h3.innerHTML = `Game Over!! press any key to start again. <b><u>score ${lavel}</u></b>`;
    highscoreTag.classList.remove("hidden");
    highscoreTag.innerHTML = `highest score : <b>${max}</b>`;
    reset();
  }
}

function btnPress() {
  if (gameStared) {
    let btn = this;
    btnFlash(btn);
    let id = this.getAttribute("id");
    userData.push(id);
    checkInput(userData.length - 1);
  } else {
    btnFlash(h3);
  }
}

function reset() {
  gameStared = false;
  gameData = [];
  userData = [];
  lavel = 0;
}

for (let btn of btns) {
  btn.addEventListener("click", btnPress);
}
