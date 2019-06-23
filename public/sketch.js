function setup() {
    createCanvas(255, 255);
    background(200);
}

function drawSomething(drawing) {
    for (let path of drawing) {
        noFill();
        stroke(0);
        strokeWeight(3);
        beginShape()
        for (let i = 0; i < path[0].length; i++) {
            let x = path[0][i];
            let y = path[1][i];
            vertex(x, y);
        }
        endShape();
    }
}