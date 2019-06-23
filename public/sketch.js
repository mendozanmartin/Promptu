const screenWidth = screen.width;
const screenHeight = screen.height;
const circleDiameter = screenWidth / 4;

function setup() {
    var myCanvas = createCanvas(screenWidth, 255);
    myCanvas.parent("myCanvas")
    drawCircles()
}

function drawCircles() {
    fill(255);
    noStroke();
    circle(screenWidth / 5, 140, circleDiameter);
    circle(screenWidth / 2, 100, circleDiameter);
    circle(screenWidth * 0.8, 140, circleDiameter);
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
            strokeWeight(3);
            beginShape()
            for (let i = 0; i < path[0].length; i++) {
                let x = (path[0][i] * 0.3) + xPos[j];
                let y = (path[1][i] * 0.3) + yPos[j];
                vertex(x, y);
            }
            endShape();
        }
        j++;
    });
}

// function touchStarted() {

//     if (mouseX > 0 && mouseX < screenWidth/3 && mouseY < 170 && mouseY > 110) {
//         socket.emit('sendDrawing', {
//             index: 1
//         });
//         console.log("okayy boi");
//     }

//     console.log("mouseX:  " + mouseX + " || " + "mouseY: " + mouseY)
//     return false;
// }

function pickPicture(number) {
    console.log(number)
    socket.emit('sendDrawing', {
        number: number
    });
}