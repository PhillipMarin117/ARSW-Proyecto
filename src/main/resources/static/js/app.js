const profanityBaseURL = "https://www.purgomalum.com/service/plain?text=";
const nickNamesDictionary = [
  "pink crow",
  "green pigeon",
  "brown robin",
  "blue woodpecker",
  "purple sparrow",
  "yellow kingfisher",
  "gray warbler",
  "orange bulbul",
  "black drongo",
  "red seagulls",
  "beige flamingo",
  "frost eagles",
  "fuscia owl",
  "mint kite",
  "hickory parakeet",
  "tortilla beeeater",
  "wood munia",
  "violet dove",
  "eggplant peacock",
  "golden oriole",
  "magenta flycatcher",
  "mulberry quail",
  "slate magpie",
  "navy roller",
  "azure emu",
  "arctic sunbird",
  "iris starling",
  "olive rockthrush",
  "pecan barnowl",
  "carob goose",
  "coal duck",
  "grease trogon",
  "raven nightjar",
  "sepia barbet",
];
let obstacleTimers = [];
let gameStarted = false;
let gameTimerId;
let myScore = 0;
let highScore = 0;
let highScoreNickname = "anonymous panda";
let myNickname;

if (localStorage.getItem("flappy-nickname")) {
  myNickname = localStorage.getItem("flappy-nickname");
} else {
  myNickname = nickNamesDictionary[Math.floor(Math.random() * 34)];
  localStorage.setItem("flappy-nickname", myNickname);
}

/**/

document.addEventListener('DOMContentLoaded', () => {
    console.log('Porfa, carga cosa del demonio')
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector ('.ground')
    let nicknameInput = document.getElementById("nickname-input");
    let updateNicknameBtn = document.getElementById("update-nickname");
    let scoreLabel = document.getElementById("score-label");
    let topScoreLabel = document.getElementById("top-label");
    let scoreList = document.getElementById("score-list");


    let birdLeft = 220;
    let birdBottom = 100;
    let gravity = 2;
    let isGameOver = false;
    let gap = 430;



    function startGame(){
        birdBottom -= gravity
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft +'px'
    }
    let gametimerId = setInterval(startGame,20);

    function control(e){
        if (e.keyCode === 32){
            jump()
        }
    }

    function jump(){
        if (birdBottom < 500) birdBottom += 50
        bird.style.bottom = birdBottom + 'px'
        console.log(birdBottom)
     }
     document.addEventListener('keyup', control)


     function generateObstacle(){
         let obstacleLeft =  500
         let randomHeight = Math.random()*60
         let obstacleBottom = randomHeight
         const obstacle = document.createElement('div')
         const topObstacle = document.createElement('div')
         if (!isGameOver) {
             obstacle.classList.add('obstacle')
             topObstacle.classList.add('topObstacle')
         }     
         gameDisplay.appendChild(obstacle)
         gameDisplay.appendChild(topObstacle)
         obstacle.style.left = obstacleLeft + 'px'
         topObstacle.style.left = obstacleLeft + 'px'
         obstacle.style.bottom = obstacleBottom + 'px'
         topObstacle.style.bottom = obstacleBottom + gap +'px'


         function moveObstacle(){
             obstacleLeft -=  2
             obstacle.style.left =obstacleLeft + 'px'
             topObstacle.style.left = obstacleLeft + 'px'

             if(obstacleLeft === -60){
                 clearInterval(timerId)
                 gameDisplay.removeChild(obstacle)
                 gameDisplay.removeChild(topObstacle)

             }
             if (
                obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 &&
                (birdBottom < obstacleBottom + 150 || birdBottom > obstacleBottom + gap -200)||
                birdBottom === 0){
                 gameOver()
                 clearInterval(timerId)
             }

         }
         let timerId = setInterval(moveObstacle, 20)
         if (!isGameOver) setTimeout(generateObstacle, 3000)
     }
     generateObstacle()

     function gameOver(){
         clearInterval(gametimerId)
         console.log('Game Over Mi Pana')
         isGameOver = true
         document.removeEventListener('keyup', control)
         const resul = {
             puntaje: 10,
             nombre: 'Feliponsio' 
         }
         $.ajax({
            url : 'http://localhost:8080/save',
            data : JSON.stringify(resul),
            type : 'POST', //en este caso
            ContentType : 'application/json',
            success : function(response){
                alert("funciona bien");
            },
            error: function(error){
                alert("No funciona: ",  error);
            }
        });
     }





    const loki = document.getElementById('abcd')
    loki.addEventListener('click', () => {
        console.log('Sigo sin saber que')
    })

})
