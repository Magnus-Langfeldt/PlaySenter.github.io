// bakgrunn kode
// Henter canvas fra DOM 
const canvas = document.querySelector('canvas')

let backgroundWidth = 500;
let backgroundHeight = 500;

// ctx står for context
let ctx = canvas.getContext("2d") // Trengs for å tegne på bakgrunnen

// Setter en lytter på alle knappene som dukker opp med lav skjermbredde
let btnEls = document.querySelectorAll('button')
for (let i=0; i<btnEls.length; i++) {
    btnEls[i].addEventListener('click', movePlayer)
}

// kode for spillere
let playerWidth = 10;
let playerHeight = 50;
let playerMovementY = 0;

let player1 = {
    x : 10,
    y : (backgroundHeight/2)-(playerHeight/2),
    width : playerWidth,
    height : playerHeight,
    MovementY : playerMovementY
}
let player2 = {
    x : backgroundWidth-playerWidth-10,
    y : (backgroundHeight/2)-(playerHeight/2),
    width : playerWidth,
    height : playerHeight,
    MovementY : playerMovementY
}
//Ballen som spilles
let ballWidth = 15
let ballHeight = 15
let ball = {
    x : (backgroundWidth/2)-(ballWidth/2),
    y : (backgroundHeight/2)-(ballHeight/2),
    width : ballWidth,
    height : ballHeight,
    MovementX : 1,
    MovementY : 2
}

let player1Score = 0;
let player2Score = 0;

window.onload = function () {
    canvas.height = backgroundHeight
    canvas.width = backgroundWidth
    requestAnimationFrame(update)
    document.addEventListener('keyup', movePlayer)
}

function update() {
    requestAnimationFrame(update)

    // Sjekker om en av spillerne har vunnet  
    if (player1Score>=10 || player2Score>=10) {
        document.querySelector('h3').style.lineHeight = "1.5"
        document.querySelector('h3').style.cursor = "pointer"

        document.querySelector('h3').addEventListener('click', refresh)
        document.getElementById('winText').addEventListener('click', refresh)
        function refresh(){
            location.reload()
        }
        if (player1Score>=10) {
            document.querySelector('h3').style.fontSize="19.55px"

            // Velger hvor teksten skal stå etter hvor bred skjermen er.
            if (window.innerWidth>=1025) {
                document.getElementById('winText').style.display = "block"
                document.getElementById('winText').innerHTML = "Player 1 (left player) has won! <br><u>Click on this box to try again.</u>"
            }
            else {
                document.querySelector('h3').innerHTML = "Player 1 (left player) has won! <br>Click on this box to try again."
            }
        }
        else if (player2Score>=10) {
            document.querySelector('h3').style.fontSize="18.55px"

            // Velger hvor teksten skal stå etter hvor bred skjermen er.
            if (window.innerWidth>=1025) {
                document.getElementById('winText').style.display = "block"
                document.getElementById('winText').innerHTML = "Player 2 (right player) has won! <br> <u>Click on this box to try again.</u>"
            }
            else {
                document.querySelector('h3').innerHTML = "Player 2 (right player) has won! <br>Click on this box to try again."
            }
        }
        return
    }

    // Tømmer canvas elementet hver gang funksjonen kjøres, og tegner på nytt
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "white"

    // Oppdaterer spiller 1
    let nextPlayer1Y = player1.y + player1.MovementY
    if(!outsideOfBorders(nextPlayer1Y)) {
        player1.y = nextPlayer1Y
    }
    // Tegner spiller 1
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height)

    // Oppdaterer spiller 2
    let nextPlayer2Y = player2.y + player2.MovementY
    if (!outsideOfBorders(nextPlayer2Y)) {
        player2.y = nextPlayer2Y
    }

    // Tegner spiller 2
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height)

    // ballen
    ball.x += ball.MovementX
    ball.y += ball.MovementY
    ctx.fillRect(ball.x, ball.y, ball.width, ball.height)

    // Hvis ballen treffer toppen eller bunnen, skal den reflekteres slik at den beveger seg langs x-aksen med samme hastighet, men den skal gå like fort i motsatt retning langs y-aksen. Så vi ganger med -1 for å bytte fortegn og dermed retning langs y-aksen. 
    if (ball.y <= 0 || ball.y + ball.height >= backgroundHeight) {
        ball.MovementY = ball.MovementY * -1
    }

    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.MovementX = ball.MovementX * -1 
            // endrer ballen sin retning langs x-aksen, men beholder farten.
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) {
            ball.MovementX = ball.MovementX * -1 //endrer ballen sin retning langs x-aksen, men beholder farten.
        }
    }

    // En av spillerne får poeng om baller går ut av canvas elementet på høyre- eller venstre-siden.
    if (ball.x < 0) {
        player2Score ++
        gameOver(1)
    }
    else if (ball.x + ballWidth > backgroundWidth) {
        player1Score ++
        gameOver(-1)
    }

    // Tegner opp poengene
    ctx.font = "45px sans-serif"
    ctx.fillText(player1Score, backgroundWidth/5, 45)
    ctx.fillText(player2Score, backgroundWidth * 4/5 - 45, 45)

    // nettet i midten (for pynt)
    for (let i=10; i<canvas.height; i+=25) {
        ctx.fillRect(canvas.width/2 - 10, i, 5, 5)
    }
}

// Funksjon som sjeker om spillerens høyde er mindre enn høyden av canvas eller større enn høyden av canvas
function outsideOfBorders(yAxisPosition) {
    return (yAxisPosition < 0 || yAxisPosition + playerHeight > backgroundHeight)
}

// Funksjon for å bevege på rekkertene.
function movePlayer(e) {
    // Spiller 1
    if (e.code === "KeyW" || e.target.id === "upLeft") {
        player1.MovementY = -3
    }
    else if (e.code === "KeyS" || e.target.id === "downLeft") {
        player1.MovementY = 3
    }

    // Spiller 2
    if (e.code === "KeyK" || e.target.id === "upRight") {
        player2.MovementY = -3
    }
    else if (e.code === "KeyM" || e.target.id === "downRight") {
        player2.MovementY = 3
    }
}

// Funksjon som sjekker om det har skjedd en kollisjon mellom ballen og en spiller.
function detectCollision (a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

// Baller starter i midten igjen og går mot spilleren som tapte.
function gameOver (ballDirection) {
    ball = {
        x : (backgroundWidth/2)-(ballWidth/2),
        y : (backgroundHeight/2)-(ballHeight/2),
        width : ballWidth,
        height : ballHeight,
        MovementX : ballDirection,
        MovementY : ball.MovementY
    }
}