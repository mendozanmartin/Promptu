const screenWidth = screen.width * 3;
const screenHeight = screen.height * 3;
const circleDiameter = screenWidth / 4;

console.log(circleDiameter)

function setup() {
    var myCanvas = createCanvas(screenWidth, 500);
    myCanvas.parent("drawing-pick")
    drawCircles();
}

function drawCircles() {
    fill(255);
    noStroke();
    circle(screenWidth / 5, 180, circleDiameter);
    circle(screenWidth / 2, 140, circleDiameter);
    circle(screenWidth * 0.8, 180, circleDiameter);
}

function drawSomething(drawing) {
    clear();
    drawCircles();
    var j = 0;
    var yPos = [120, 80, 120];
    var xPos = [screenWidth / 5 - screenWidth / 10, screenWidth / 2 - screenWidth / 10, screenWidth * 0.8 - screenWidth / 10]
    drawing.forEach(element => {
        for (let path of element) {
            noFill();
            stroke(0);
            strokeWeight(5);
            beginShape()
            for (let i = 0; i < path[0].length; i++) {
                let x = (path[0][i] * 0.6) + xPos[j];
                let y = (path[1][i] * 0.6) + yPos[j];
                vertex(x, y);
            }
            endShape();
        }
        j++;
    });
}

function pickPicture(number) {
    console.log(number)
    socket.emit('sendDrawing', {
        number: number
    });
    document.getElementById("defaultCanvas0").style.display = 'none';
    redoIcon.style.display = 'none';
    reloadIcon.style.display = 'none';
    declare.innerHTML = "You picked a ..."
    animalText.style.display = 'none'
    question.innerHTML = animal + "!";
    info.style.display = "grid"
    animalFacts.style.display = "grid"


    switch (animal) {
        case "tiger":
            animalFacts.innerHTML = factsData[0].stats[0];
            animalLinks.innerHTML = factsData[0].help;
            break;
        case "elephant":
            animalFacts.innerHTML = factsData[1].stats[0]; 
            animalLinks.innerHTML = factsData[1].help;

            break;
        case "lion":
            animalFacts.innerHTML = factsData[2].stats[0]; 
            animalLinks.innerHTML = factsData[2].help;

            break;
        case "shark":
            animalFacts.innerHTML = factsData[3].stats[0];
            animalLinks.innerHTML = factsData[3].help;

            break;
        case "sea turtle":
            animalFacts.innerHTML = factsData[4].stats[0];
            animalLinks.innerHTML = factsData[4].help;

            break;
        case "rhinoceros":
            animalFacts.innerHTML = factsData[5].stats[0];
            animalLinks.innerHTML = factsData[5].help;

            break;
    }
}