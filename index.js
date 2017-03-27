var recorder;
var mediaStream;

//For cross browser compatibility
    var navigator = window.navigator;
    navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);


//Function to start recording after accessing microphone

function startUserMedia(stream) {

    mediaStream = stream;
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input, {
        workerPath: './recorderWorker.js'
    });

    recorder.record();
}


//On click of the start button, this will start executing
function record()
{
    navigator.getUserMedia({audio: true, video: false}, startUserMedia, function(){
        console.log("Browser not supported")
    });
}


function stop() {

  // stop the media stream
  var track = mediaStream.getTracks()[0];  // if only one media track
  track.stop();

  // stop Recorder.js
  recorder.stop();

  // export it to WAV
  recorder.exportWAV(function (blob) {


    var fd = new FormData();
    fd.append('fname', 'test.wav');
    fd.append('data', blob);
    $.ajax({
     type: 'POST',
     url: 'http://httpbin.org/post', //Test server that returns POST data
     data: fd,
     processData: false,
     contentType: false
    }).done(function(data) {
       console.log("Audio file has been sent.");
    });
  });
}

window.onload = function init() {
   
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        audio_context = new AudioContext();
    } catch (e){
       console.log('Unable to access the microphone');
    }

};
