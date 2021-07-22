function ChatServiceURL() {
  return 'ws://localhost:8080/gameFlappy';
}
const sky = document.querySelector('.sky')
const bird = document.querySelector('.bird')
const gameDisplay = document.querySelector('.game-container')
const ground = document.querySelector('.ground')
let nicknameInput = document.getElementById("nickname-input");
let updateNicknameBtn = document.getElementById("update-nickname");
let scoreLabel = document.getElementById("score-label");
let topScoreLabel = document.getElementById("top-label");
let scoreList = document.getElementById("score-list");

let birdLeft = 220;
let birdBottom = 350;
let gravity = 2;
let isGameOver = false;
let gap = 450;

let obstacleTimers = [];
let gameStarted = false;
let gameTimerId;
let myScore = 0;
let highScore = 0;
let highScoreNickname = "anonymous bro";
let myNickname;
let myClientId;
let myPublishChannel;
let gameChannel;
let gameChannelName = "flappy-game";
let allBirds = {};
let topScoreChannel;
let topScoreChannelName = "flappy-top-score";


class WSChatChanel {
  constructor(URL, callback) {

    this.URL = URL;
    this.wsocket = new WebSocket(URL);
    this.wsocket.onopen = (evt) => this.onOpen(evt);
    this.wsocket.onmessage = (evt) => this.onMessage(evt);
    this.wsocket.onError = (evt) => this.onError(evt);
    this.received = callback; // Esto me envia a la clase o lugar donde me
    // llamaron
  }

  onOpen(evt) {
    console.log("On Open: ", evt);
  }

  onError(evt) {
    console.log("On Error: ", evt);
  }


  onMessage(evt) {
    console.log("On Message: ", evt);
    if (evt.data != "Connection established.") {
      this.received(evt.data);
    }
  }

  sendToServerBird(tipo, user, room) {
    let msg = `{ "tipo": "${tipo}", "room": "${room}" , "playerName": "${user.nickname}", "playerScore": "${user.score}", "playerBottom": "${user.bottom}" }`;
    //console.log("Estamos en el segundo SendToServerBird HEHEHE", msg);

    this.wsocket.send(msg);

  }

  gameOver(){
    //this.wsocket.close();
    let msg = `{ "tipo": "gameOver" }`;
    alert(msg);
    this.wsocket.send(msg);
  }

  close(){
    this.wsocket.close();
  }
}

const gameContainer = document.getElementById('game-container');

var band =  true

let comunnicationWS = new WSChatChanel(ChatServiceURL(),
  (msg) => {
    //console.log("esto es un MSG: ", msg);
    var mensaje = JSON.parse(msg);
    if(band){
      band = false;
      myClientId = mensaje.birds[0].id;
      console.log("este es el clientID: ", myClientId)
    }
    console.log("El JSON: ", mensaje);
    //console.log("¿Que son los birds?: ", mensaje.birds);
    //console.log("esta es el Aux Bird: ",auxBird);
    if (mensaje.tipo == "pos") {
      //console.log("yeah yeah estamos en el if del ComunicationWS: ", mensaje.birds)
      for (let item in mensaje.birds) {
        //console.log("Esto es solo dentor del FOR: " , item);
        if (mensaje.birds[item].id != myClientId) {
          //console.log("Estoy dentro del if dentro de un for: " , myClientId);
          let newBottom = mensaje.birds[item].bottom;
          let newLeft = mensaje.birds[item].left;
          let isDead = mensaje.birds[item].isDead;
          if (allBirds[item] && !isDead) {
            allBirds[item].targetBottom = newBottom;
            allBirds[item].left = newLeft;
            allBirds[item].isDead = mensaje.birds[item].isDead;
            allBirds[item].nickname = mensaje.birds[item].nickname;
            allBirds[item].score = mensaje.birds[item].score;
          } else if (allBirds[item] && isDead) {
            sky.removeChild(allBirds[item].el);
            delete allBirds[item];
          } else {
            if (!isGameOver && !isDead) {
              allBirds[item] = {};
              allBirds[item].el = document.createElement("div");
              allBirds[item].el.classList.add("other-bird");
              sky.appendChild(allBirds[item].el);
              allBirds[item].el.style.bottom = newBottom + "px";
              allBirds[item].el.style.left = newLeft + "px";
              allBirds[item].isDead = mensaje.birds[item].isDead;
              allBirds[item].nickname = mensaje.birds[item].nickname;
              allBirds[item].score = mensaje.birds[item].score;
            }
          }
        } else if (mensaje.birds[item].id  === myClientId) {
          console.log("AHAHAHAHAHA: " , myClientId);
          //console.log("todas las palomas: " , allBirds);
          allBirds[item] = mensaje.birds[item];
        }
      }
      if (mensaje.highScore > highScore) {
        highScore = mensaje.highScore;
        highScoreNickname = mensaje.highScoreNickname;
        topScoreLabel.innerHTML =
          "Top score - " + highScore + "pts by " + highScoreNickname;
      }
      if (mensaje.launchObstacle === true && !isGameOver) {
        //console.log("mensaje emergente: ", msg);
        generateObstacles(mensaje.obstacleHeight);
      }
    } else if (mensaje.userList) {
      //console.log("NEA NEA estamos en el ELSE IF del ComunicationWS")
      showUserList(mensaje.userList);
    } else {
      //console.log("YOU YOU estamos en el ELSE del ComunicationWS")
    }


  });


function showUserList(userList) {
  users.innerHTML = `${userList.map(usr => `<li>${usr}</li>`).join('')}`;
}

//console.log(gameContainer);
gameContainer.addEventListener('click', (e) => {
  //console.log("Le dio click en el game perro !!!")
  //comunnicationWS.sendToServer("userMessage", "Feliponcio", "Sao ChatRoom", "mensaje de entrada");
});

comunnicationWS.onOpen = () => {
  //console.log("Estamos entrando en Comunication WS");
  gameContainer.onclick = function () {
    //console.log("Esta entrando en gamecontainer de WS");
    if (!gameStarted) {
      //console.log("FFFFFFFFFFFFFFF");
      gameStarted = true;
      /*gameChannel.presence.enter({
        nickname: myNickname,
      });*/
      generateObstacles();
      sendPositionUpdates();
      //showOtherBirds();
      document.addEventListener("keydown", control);
      gameTimerId = setInterval(startGame, 20);
    }

  }
}

function startGame() {
  birdBottom -= gravity
  bird.style.bottom = birdBottom + 'px'
  bird.style.left = birdLeft + 'px'
  //console.log("eSTAS SON TODAS LAS PALOMAS PERRO: " , allBirds);
  for (item in allBirds) {
    if (allBirds[item].targetBottom) {
      let tempBottom = parseInt(allBirds[item].el.style.bottom);
      tempBottom += (allBirds[item].targetBottom - tempBottom) * 0.5;
      allBirds[item].el.style.bottom = tempBottom + "px";
    }
  }
}

function control(e) {
  if (e.keyCode === 32 && !isGameOver) {
    jump()
  }
}

function jump() {
  if (birdBottom < 500) birdBottom += 50;
  bird.style.bottom = birdBottom + "px";
}

function sendPositionUpdates() {
  //console.log("Estamos dentro del SendPositionsUpdate");
  let publishTimer = setInterval(() => {
    /*myPublishChannel.publish("pos", {
      bottom: parseInt(bird.style.bottom),
      nickname: myNickname,
      score: myScore,
    });*/
    const pajarraco = {
      bottom: parseInt(bird.style.bottom),
      nickname: myNickname,
      score: myScore,
    }
    //console.log("Este es el pajarraco: ",pajarraco);
    comunnicationWS.sendToServerBird('pos', pajarraco, 'Room1');
    //myNickname, myScore);
    //console.log("Estamos dentro del servior en SendPositionsUpdates y ComunicationsWS")
    if (isGameOver) {
      clearInterval(publishTimer);
      //comunnicationWS.close();
      //myPublishChannel.detach();
    }
  }, 100);
}

function generateObstacles() {
  if (!isGameOver) {
    console.log("Entrando en el generate");
      let obstacleLeft = 500;
      let obstacleBottom = Math.random() * 130;

      const obstacle = document.createElement("div");
      const topObstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      topObstacle.classList.add("topObstacle");
      gameDisplay.appendChild(obstacle);
      gameDisplay.appendChild(topObstacle);
      obstacle.style.left = obstacleLeft + "px";
      obstacle.style.bottom = obstacleBottom + "px";
      topObstacle.style.left = obstacleLeft + "px";
      topObstacle.style.bottom = obstacleBottom + gap + "px";
      let timerId = setInterval(moveObstacle, 20);
      obstacleTimers.push(timerId);
      
      function moveObstacle() {
          obstacleLeft -= 2;
          obstacle.style.left = obstacleLeft + "px";
          topObstacle.style.left = obstacleLeft + "px";
          if (obstacleLeft === 220) {
            myScore++;
            /*setTimeout(() => {
              //sortLeaderboard();
            }, 400);*/
          }
          if (obstacleLeft === -60) {
              clearInterval(timerId);
              gameDisplay.removeChild(obstacle);
              gameDisplay.removeChild(topObstacle);
          }
          if (
              (obstacleLeft > 200 &&
                  obstacleLeft < 280 &&
                  birdLeft === 220 &&
                  (birdBottom < obstacleBottom + 150 ||
                  birdBottom > obstacleBottom + gap - 200)) ||
              birdBottom === 0
          ) {
          for (timer in obstacleTimers) {
              clearInterval(obstacleTimers[timer]);
          }
          //sortLeaderboard();
          gameOver();
          isGameOver = true;
          }
      }
    setTimeout(generateObstacles, 3000);
  }
}

function gameOver(){
  scoreLabel.innerHTML += " | Game Over";
  clearInterval(gameTimerId);
  isGameOver = true;
  document.removeEventListener("keydown", control);
  ground.classList.add("ground");
  ground.classList.remove("ground-moving");
  console.log("Hey mi pana, se acabo el juego, vemos !!");
  const pajarraco = {
    bottom: parseInt(bird.style.bottom),
    nickname: myNickname,
    score: myScore,
  }
  //console.log("ESTO ES UN PAJARRACO: "+pajarraco);
  //comunnicationWS.sendToServerBird("gameOver", pajarraco, 'Room1');
  comunnicationWS.close();
  alert("Cualquier cosa me dijo EDUARD");

  //gameChannel.presence.leave();
  //gameChannel.detach();
  //realtime.connection.close();
}

// Funciona bien pero no imrpime ni muestra alerts.
window.addEventListener('beforeunload', () => {
  console.log("Esta entrando donde era el error");
  //comunnicationWS.sendToServer("ChatBot", username, chatRoom, "has left.");
});

updateNicknameBtn.addEventListener("click", () => {
  myNickname = nicknameInput.value;
  localStorage.setItem("flappy-nickname", myNickname);
  console.log("\n Este es el name del jugador: ", myNickname)
  //filterNickname(nicknameInput.value);
}); 