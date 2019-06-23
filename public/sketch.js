const screenWidth = screen.width*3;
const screenHeight = screen.height*3;
const circleDiameter = screenWidth/4;
console.log(circleDiameter)

function setup() {
    var myCanvas = createCanvas(screenWidth, 255);
    myCanvas.parent("drawing-pick")
    drawCircles();
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
}