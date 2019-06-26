//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream; //stream from getUserMedia() 
var rec; //Recorder.js object
var input;
var animal = "";
var constraints = {
  audio: true,
  video: false
}
/* Disable the record button until we get a success or fail from getUserMedia() */
var socket = io();
var blob = "";
//new audio context to help us record 
var recordButton = document.getElementById("mic-ready");
var micOn = document.getElementById("mic-on");
var drawingPic = document.getElementById("drawing-pick");
var animalText = document.getElementById("animal-text");
var redoIcon = document.getElementById("redo-icon")
var reloadIcon = document.getElementById("reload-icon");
var newDrawingPick = document.getElementById("defaultCanvas0");
var info = document.getElementById("info");
var display = document.getElementById("display")
var declare = document.getElementById("declare");
var question = document.getElementById("question");
var bodyText = document.getElementById("body-text");
var animalFacts = document.getElementById("animal-fact")
var animalLinks = document.getElementById("animal-links")
//add events to those 3 buttons 
recordButton.addEventListener("click", startRecording);
micOn.addEventListener("click", stopRecording);
redoIcon.addEventListener("click", refreshPage);
//reloadIcon.addEventListener("click", )



function refreshPage() {
  console.log("this executed")
  socket.emit('sendVideo', {
    blob: blob
  });
}

function retry() {
  location.reload();
}

function startRecording() {
  // shim for AudioContext when it's not avb. 
  micOn.style.display = 'grid';
  recordButton.style.display = 'none'
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext;
  console.log("recordButton clicked");
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
    /* assign to gumStream for later use */
    gumStream = stream;
    /* use the stream */
    input = audioContext.createMediaStreamSource(stream);
    /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
    rec = new Recorder(input, {
      numChannels: 2
    })
    //start the recording process 
    rec.record()
    console.log("Recording started");
  }).catch(function (err) {
    //enable the record button if getUserMedia() fails 
    console.log("unable to record")
  });
}

function stopRecording() {
  console.log("stopButton clicked");
  //disable the stop button, enable the record too allow for new recordings 
    recordButton.display = 'none';
    //newDrawingPick.style.visibility = 'visibile';
    document.getElementById("defaultCanvas0").style.visibility = 'visible'
  
  //reset button just in case the recording is stopped while paused 
  //tell the recorder to stop the recording 
  rec.stop(); //stop microphone access 
  gumStream.getAudioTracks()[0].stop();
  //create the wav blob and pass it on to createDownloadLink 
  micOn.style.display = 'none';
  animalText.style.display = 'grid';
  redoIcon.style.display = 'grid';
  reloadIcon.style.display = 'grid';

  
  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var link = document.createElement('a');
  //add controls to the <audio> element 
  au.controls = true;
  au.src = url;
  //link the a element to the blob 
  link.href = url;
  link.download = new Date().toISOString() + '.wav';
  link.innerHTML = link.download;
  //add the new audio and a elements to the li element 
  
  //add the li element to the ordered list 
  socket.emit('sendVideo', {
    blob: blob
  });

  
}
socket.on('result', (data)=> {
  animal = data.animal
  animalText.innerHTML = 'pick a ' + data.animal + '!'
  console.log(data.drawing);
  drawSomething(data.drawing);

})