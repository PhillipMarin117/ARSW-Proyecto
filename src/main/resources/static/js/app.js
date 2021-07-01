document.addEventListener('DOMContentLoaded', () => {
    console.log('Porfa, carga cosa del demonio')
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector ('.ground')

    let birdLeft = 220;
    let birdBottom = 100;
    let gravity = 2;



    function startGame(){
        birdBottom -= gravity
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft +'px'
    }
    let timerId = setInterval(startGame,20);

    function jump(){
        birdBottom += 50
        bird.style.bottom = birdBottom + 'px'
     }
     document.addEventListener('keyup', jump)





    const loki = document.getElementById('abcd')
    loki.addEventListener('click', () => {
        console.log('Sigo sin saber que')
    })

})
