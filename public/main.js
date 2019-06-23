
// function record() {
//   navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//   .then(handleSuccess);
// }

// var handleSuccess = function(stream) {
//   var context = new AudioContext();
//   var source = context.createMediaStreamSource(stream);
//   var processor = context.createScriptProcessor(1024, 1, 1);

//   source.connect(processor);
//   processor.connect(context.destination);

//   processor.onaudioprocess = function(e) {
//     // Do something with the data, i.e Convert this to WAV
//   // console.log(e.inputBuffer);
//   };
//   console.log(stream)
// };

// function stop() {
//   navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//   .then(handleSuccess);
// }

//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 

//new audio context to help us record 
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
//add events to those 3 buttons 
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

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
/* Simple constraints object, for more advanced audio features see

https://addpipe.com/blog/audio-constraints-getusermedia/ */

var constraints = {
  audio: true,
  video: false
}
/* Disable the record button until we get a success or fail from getUserMedia() */

recordButton.disabled = false;
stopButton.disabled = true;
pauseButton.disabled = true

/* We're using the standard promise based getUserMedia()

https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */



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
  var li = document.createElement('li');
  var link = document.createElement('a');
  //add controls to the <audio> element 
  au.controls = true;
  au.src = url;
  //link the a element to the blob 
  link.href = url;
  link.download = new Date().toISOString() + '.wav';
  link.innerHTML = link.download;
  //add the new audio and a elements to the li element 
  li.appendChild(au);
  li.appendChild(link);
  //add the li element to the ordered list 
  recordingsList.appendChild(li);
}