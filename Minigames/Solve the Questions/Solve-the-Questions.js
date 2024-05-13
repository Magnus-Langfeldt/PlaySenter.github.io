// henter elementer fra DOM
let nextBtn = document.getElementById('nextBtn')
let riddleEl = document.getElementById('riddle')
let inputEl = document.getElementById('inputEl')
let imgEl = document.querySelectorAll("img")
let quizContainerEl = document.getElementById('quiz-container')
let questionContainerEl = document.querySelector('.question-container')
let checkBtn = document.getElementById ('checkBtn')

let data = []
let poeng = 0

// Tellere for hvilket spørsmål du er på, og hvor mange ganger du har tapt
let i = 0
let j = 0

// Legger til en lytter på knappene
nextBtn.addEventListener('click', questions)
checkBtn.addEventListener('click', sjekkSvar)

document.addEventListener('keyup', cheat)

// jukse-kode som markerer riktig svar ved å trykke på C-tasten
function cheat(e) {
    if (e.code === "KeyC") {
        document.querySelector('input[value="c"]').checked = true
        console.log("cheating")
    }
}

// Lager en funksjon som henter spørsmålene i en liste, der verdiene er objekter. 
async function getQuestions(){
    let url = "https://the-trivia-api.com/v2/questions"
    console.log(url)

    let response = await fetch(url)
    console.log(response)

    data = await response.json()
    console.log(data)
    questions()
}

// Funksjon som lager spørsmålene fra arrayet fra forrige funksjon
function questions(){
    if (j===3 || i===10) {
        // Sjekker om du har vunnet eller tapt
        gameOver()
        return
    }
    if (i===9) {
        // På det siste spørsmålet skal det stå "Finish the Quiz!" i steden for "Next Question" 
        nextBtn.innerHTML = "Finish the Quiz!"
    }
    // Forteller brukeren hvilket spørsmål han/hun er på
    document.querySelector("h3").innerHTML = `${i+1}/10`
    console.log(`Question: ${i+1}/10`)

    // Henter ut spørsmålet du er på fra arrayet vi fikk i funksjonen getQuestions
    let categoryEl = data[i]

    // Arrayet fra getQuestions kom med vanskelighetsgrader til spørsmålene, så vi henter dem ut
    document.getElementById("difficulty").innerHTML = `Difficulty: ${categoryEl["difficulty"]}`
    console.log(`Difficulty: ${categoryEl["difficulty"]}`)

    // Lager et spørsmålsobjekt
    let question = {
        query: categoryEl["question"]["text"],
        options: categoryEl["incorrectAnswers"],
        solution: categoryEl["correctAnswer"]
    }

    console.log(question)
    
    console.log(`Your Question: ${question["query"]}`)
    console.log(`Correct Answer: ${question["solution"]}`)
    console.log(`Wrong Answers: ${question["options"][0]}, ${question["options"][1]} and ${question["options"][2]}.`)

    // Henter spørsmålet
    let query = question.query

    // Henter alternativene
    let options = question.options

    // Henter fasit
    let solution = question.solution

    // setter svaret blant alternativene
    console.log("Putting the correct answer among the wrong ones")

    options.splice(Math.floor(Math.random()*(options.length+1)), 0, solution)

    console.log(`Total Options: ${options[0]}, ${options[1]}, ${options[2]} and ${options[3]}`)

    // Tømmer HTML til quiz containeren
    quizContainerEl.innerHTML = ''

    // Fyller quiz-containeren med spørsmålet
    quizContainerEl.innerHTML = `
    <div class="question-container">
        <h3>- ${query}</h3>
    </div> 
    `

    // Skriver kode som fyller inn alternativene i HTML
    // Henter elementet alternativene skal skrives i
    let questionEl = document.querySelector('.question-container')

    // Går gjennom alternativene
    for (let j=0;j<options.length;j++) {
        console.log(`Creating Alternative: ${j+1}`)
        // Lager label element
        let labelEl = document.createElement('label')

        //Lager et input element  
        let radioEl = document.createElement('input')

        // setter typen til input elementet til radio
        radioEl.type = "radio"

        // sørger for at alle alternativene til spørsmålet er i samme gruppe
        radioEl.name = `q1`

        radioEl.style.marginRight = "10px"

        //setter verdi til elementet basert på om alternativet er lik fasit 
        if (options[j] === solution) {
            radioEl.value = "c" // correct
        }
        else {
            radioEl.value = "w" // wrong
        }

        // legger input-elementet med type radio i label elementet
        labelEl.appendChild(radioEl)
        
        // skriver alternativene til HTML
        labelEl.innerHTML += options[j]

        // legger label elementet inn i question elementet
        questionEl.appendChild(labelEl)
    }

    // Gjør at det første alternativet alltid er markert på forhånd
    let radioEls = document.querySelectorAll('input[type="radio"]')
    radioEls[0].checked = true

    // Styler det som er nødvendig
    checkBtn.style.display = "block"
    nextBtn.style.display = "none"
    quizContainerEl.style.backgroundColor = "whitesmoke"
    quizContainerEl.style.color = "black"

    // Øker indeksen til arrayet med spørsmål, med 1, slik at neste gang funksjonen kjøres, brukes det neste spørsmålet fra arrayet fra getQuestions
    i++
}

// Funksjon som sjekker om svaret er riktig eller feil
function sjekkSvar() {
    // Henter alle radio elementene 
    let radioEls = document.querySelectorAll('input[type="radio"]')

    // Traverserer radio elementene
    for (let i=0; i<radioEls.length; i++) {
        // Sjekker om alternativet er krysset av 
        if (radioEls[i].checked) {
            console.log(`You marked alternative number: ${i+1}`)
            // Sjekker om alternativet er korrekt 
            if (radioEls[i].value==="c"){
                // Riktig svar
                quizContainerEl.style.backgroundColor = "green"
                quizContainerEl.style.color = "white"

                // Øker antall poeng du har
                poeng++

                console.log("Correct Answer!")
                console.log(`You have ${poeng} point(s)!`)
            }
            else {
                // Feil svar
                console.log("Wrong Answer!")
                quizContainerEl.style.backgroundColor = "darkred"
                quizContainerEl.style.color = "white"
                
                // Øker variabelen for antall ganger du har svart feil
                j++

                if (j>=1) {
                    // Hvis du har svart feil 1 gang eller mer, blir det første krysset rødt
                    imgEl[0].style.filter = "grayscale(0%)"
                    if(j>=2) {
                        // Hvis du har svart feil 2 ganger eller mer, blir det første OG det andre krysset rødt
                        imgEl[1].style.filter = "grayscale(0%)"  
                        if (j===3) {
                            // Hvis du har svart feil 3 ganger, blir det første, andre OG det tredje krysset rødt, og det er "Game Over"
                            imgEl[2].style.filter = "grayscale(0%)"

                            // Gjør at knapen sier "Game Over!" i steden for "Next Question"
                            nextBtn.innerHTML = "Game Over!"
                        }
                    }
                }
                console.log(`Lives left: ${3-j}`)
            }
        }
    }
    
    // Markerer svaret som var riktig
    document.querySelector('input[value="c"]').checked = true

    // Nødvendig styling
    checkBtn.style.display = "none"
    nextBtn.style.display = "block"
}

// Funksjon for når du har fått 3 feil eller har kommet gjennom alle 10 spørsmål.
function gameOver() {
    // Erstatter innholdet i quiz containeren med en tilbakemelding basert på om du vant eller tapte
    quizContainerEl.innerHTML = `<h3 id="resultat">${kontroll()}</h3>
    <h3 id=kommentar>Click on the button below to try again.`

    nextBtn.innerHTML = "Try again"

    // I steden for å lage en ny knapp, laster den samme knappen inn siden på nytt
    nextBtn.removeEventListener("click", questions)
    nextBtn.addEventListener("click", function(){
        location.reload()
    })
}

// Funksjon som avgjør hva som skal skrives hvis du har vunnet eller tapt i forrige funksjon.
function kontroll() {
    if (j===3) {
        // Du tapte
        console.log("You lost")
        document.getElementById("difficulty").innerHTML = 'Try harder next time!!!'

        return "You Lost!"
    }
    else if (i===10) {
        // Du vant
        console.log("You won")
        document.getElementById("difficulty").innerHTML = 'Well done!!!!!'

        quizContainerEl.style.backgroundColor = "green"
        quizContainerEl.style.color = "white"

        return `You have completed all the questions! You got ${poeng} out of 10 questions right!`
    }
}

// Henter første spørsmål
getQuestions()