const scale = 0.3;

const socket = io();

let imgText, imgHashtag;
function preload() {
  imgText = loadImage('./../images/title.png');
  imgHashtag = loadImage('./../images/hashtag.png');
}

// Pre-drawing setup
function setup() {
  // nothing to do here as of yet...
}

function startScene() {
  console.log("STARTING SCENE...")
  createCanvas(screen.width, screen.height);
  background(color(252,219,55));
  image(imgText, 50, screen.height*.8, screen.width*0.4, 100);
  image(imgHashtag, screen.width * 0.67, screen.height*.85, screen.width*0.27, 50)
}

// Actually draws tp the canvas
function drawSomething(item, id, xPos, yPos) {
  console.log('trying to draw a ' + item)
  loadJSON("/" + item + "?id=" + id, (data) => {
    let drawing = data.drawing;
    for (let path of drawing) {
      noFill();
      stroke(255)
      strokeWeight(3)
      beginShape()
      for (let i = 0; i < path[0].length; i++) {
        let x = (path[0][i] * scale) + xPos;
        let y = (path[1][i] * scale) + yPos;
        vertex(x,y)
      }
      endShape()
    }
  })
}

// Enters fullscreen
function enterFullScreen() {
  var elem = document.documentElement;
  console.log("Entering fullscreen...")
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  wipeIntroScreen();
}

socket.on('serverToDisplay', (data) => {
  drawSomething(data.item, data.id, Math.random() * screen.width * 0.8, Math.random() * screen.height * 0.8);
})

function wipeIntroScreen() { $("#introSection").remove(); }
