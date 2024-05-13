// Definerer variabler slik at de blir globale
let bombHole;
let marioHole;
let number;
let score = 0;

// lager en boolsk variabel som forteller om det er "Game Over" eller ikke
let gameOver = false;

let btnEl = document.querySelector('button')

// legger til en lytter på btnEl, med en funksjon som laster inn nettsiden på nytt
btnEl.addEventListener('click', function(){
    location.reload()
})

// Sjekker om det er en nøkkel som heter highscore i localstorage fra før av, og hvis den ikke finnes fra før av, lager jeg den der highscoren starter på 0
if (!localStorage.highscore) {
    localStorage.highscore = 0
}

// Viser Highscoren din
showHighscore()

// Lager en funksjon som viser highscoren din
function showHighscore() {
    document.getElementById('highscore').innerHTML = `Your Highscore: ${localStorage.highscore}`
}

// Starter spillet
setGame()
function setGame() {
    // Lager diver i #board som skal bli hullene. 
    for (let i=0; i<9; i++) {
        console.log(`Making div with id=${i}`)
        let hole = document.createElement("div")
        hole.id = i
        document.getElementById('board').appendChild(hole)
    }

    // Setter intervaller for hvor ofte funksjonene skal kjøres, her settes det til 900 millisekunder
    setInterval(setMario, 900) 
    setInterval(setBomb, 900) 
    console.log("setMario and setBomb are running every 900 milliseconds.")
}

// Funksjon som setter Mario i et hull
function setMario() {
    // Hvis det er "Game Over" skal ikke resten av funksjonen kjøres
    if (gameOver) {
        return
    }
    // Hvis marioHole allerede finnes, skal den tømmes slik at det kan lages et nytt hull for mario
    if (marioHole) {
        marioHole.innerHTML = ""
    }
    // Lager et img element av mario, som skal plasseres tilfeldig blant div-elementene
    /* console.log("Creating an image of mario") */
    let mario = document.createElement('img');
    mario.src = "../../Media/Minigames/Catch-Mario/Mario-jumping.png"
    mario.id = "mario"
    mario.style.marginTop = "25%"

    // Legger til en lytter for når du klikker på mario
    mario.addEventListener('click', selectHole)

    // Henter et tilfeldig tall fra funksjonen getRandomNumber
    number = getRandomNumber()

    // Sjekker bombHole finnes fra før av, og om den samtidig har samme id som tallet vi hentet over
    if (bombHole && bombHole.id == number) {
        // Hvis bombHole allerede finnes og samtidig har samme id som number, skal funksjonen kjøres igjen, helt til de får forskjellige id-er.
        // Dette sørger for at mario og bomben ikke kommer i samme hull, samtidig.
        console.log("The bomb has already got this hole.")
        setMario()
        return
    }

    // Reserverer et hull for mario tilfeldig blant div-elementene, som bomben ikke har.
    marioHole = document.getElementById(number)
    marioHole.appendChild(mario)
}

// En funksjon som lager et tilfeldig tall fra og med 0, til og med 8 (fordi div-elementene i #board har id-er fra og med 0, til og med 8)
function getRandomNumber() {
    number = Math.floor(Math.random() * 9)
    return number
}

// Funksjon som setter en bombe i et hull
function setBomb() {
    // Hvis det er "Game Over" skal ikke resten av funksjonen kjøres
    if(gameOver) {
        return
    }
    // Hvis bombHole allerede finnes, skal den tømmes slik at det kan lages et nytt hull for bomben
    if(bombHole) {
        bombHole.innerHTML = ""
    }

    // Lager et img element av en bombe, som skal plasseres tilfeldig blant div-elementene
    let bombEl = document.createElement('img')
    bombEl.src = "../../Media/Minigames/Catch-Mario/bomb.png"
    bombEl.id = "bomb"
    bombEl.style.marginTop = "20%"

    // Legger til en lytter for når du klikker på bomben
    bombEl.addEventListener('click', selectHole)
    
    // Henter et tilfeldig tall fra funksjonen getRandomNumber
    let number = getRandomNumber()

    // Sjekker marioHole finnes fra før av, og om den samtidig har samme id som tallet vi hentet over
    if (marioHole && marioHole.id == number) {
        // Hvis marioHole allerede finnes og samtidig har samme id som number, skal funksjonen kjøres igjen, helt til de får forskjellige id-er.
        // Dette sørger for at mario og bomben ikke kommer i samme hull, samtidig.
        console.log("Mario has already got this hole.")
        setBomb()
        return
    }

    // Reserverer et hull for bomben tilfeldig blant div-elementene, som mario ikke har.
    bombHole = document.getElementById(number)
    bombHole.appendChild(bombEl)
}

// Lager en funksjon som sjekker hva du trykket på, der parameteren er hendelsen. 
function selectHole(e) {
    //Sjekker om det allerede er "Game Over", for da trenger ikke funksjonen å kjøres.
    if (gameOver) {
        return
    }
    // Sjekker om elementet som ble trykket på, har id-en "mario" (sjekker om du klikket på mario).
    if (e.target.id === "mario") {
        // Hvis elementet som ble trykket på er mario, skal du få et poeng.
        console.log("You clicked on Mario! You get +1 point!")
        score ++ // score+=1
        document.getElementById('score').innerHTML = `Your Points: ${score}`
        // For at du ikke skal kunne trykke flere ganger på samme element for å få ekstra poeng, skal den forsvinne. 
        marioHole.innerHTML = ""
    }
    // Sjekker om elementet som ble trykket på, har id-en "bomb" (sjekker om du klikket på en bombe).
    else if (e.target.id === "bomb") {
        // Hvis elementet som ble trykket på er en bombe, taper du.
        console.log(`It seems like you lost! you got ${score} points!`)
        document.getElementById('points').innerHTML = `
        <h2 style="margin: 10px 0;">You Lost!</h2>
        <h4 style="margin-bottom: 10px;">You successfully clicked on <br>mario ${score} times, and your best score is ${localStorage.highscore}.</h4>
        `

        document.getElementById('board').style.borderColor = "darkred"
        document.getElementById('points').style.backgroundColor = "darkred"
        document.getElementById('points').style.color = "white"
        document.getElementById('points').style.gap = "0"
        document.querySelector('h4').style.marginTop = "0"
        document.getElementById('points').style.flexDirection = "column"

        // Den boolske verdien for gameover settes nå til å bli true
        console.log("Gameover! You lost!")
        gameOver = true
    }
    
    // Sjekker om scoren din er større enn highscoren
    if (score>Number(localStorage.highscore)) {
        // Hvis scoren er større enn highscoren din, så blir den nye highscoren din satt til scoren.
        console.log(`New Highscore: ${score}`)
        localStorage.highscore = score
        showHighscore()
    }
}
