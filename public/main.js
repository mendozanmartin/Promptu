//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream; //stream from getUserMedia() 
var rec; //Recorder.js object
var input;

var constraints = {
  audio: true,
  video: false
}
/* Disable the record button until we get a success or fail from getUserMedia() */
var socket = io();

//new audio context to help us record 
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
//add events to those 3 buttons 
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

recordButton.disabled = false;
stopButton.disabled = true;
pauseButton.disabled = true

function startRecording() {
  // shim for AudioContext when it's not avb. 
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext;
  console.log("recordButton clicked");
  stopButton.disabled = false;
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
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;
  //reset button just in case the recording is stopped while paused 
  pauseButton.innerHTML = "Pause";
  //tell the recorder to stop the recording 
  rec.stop(); //stop microphone access 
  gumStream.getAudioTracks()[0].stop();
  //create the wav blob and pass it on to createDownloadLink 

  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement('audio');
  var link = document.createElement('a');
  var speechTranscription = document.getElementById('speechTranscription')
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

  socket.on('result', (data)=> {
    speechTranscription.innerHTML = data.transcription;

    console.log(data.transcription)

  })
}
