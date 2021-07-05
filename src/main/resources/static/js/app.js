document.addEventListener('DOMContentLoaded', () => {
    console.log('Porfa, carga cosa del demonio')
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector ('.ground')

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
        /*var data = $.ajax({
            url: "https://backendservicioseci.herokuapp.com/login/",
            //url: "http://localhost:8080/login/",
            type: "POST",
            data: JSON.stringify(loginRequest),
            contentType: "application/json",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            error: function (request){
                alert(request.responseText);
            }
        });*/
     }





    const loki = document.getElementById('abcd')
    loki.addEventListener('click', () => {
        console.log('Sigo sin saber que')
    })

})
