var width = 1280;
var height = 720;

var video = document.getElementById('camera');
var canvas = document.getElementById('canvas');

var lastPictureJpeg = null;
var lastPictureDateString = '';

var ipc = require('electron').ipcRenderer;
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();

video.onclick = function () {
    event.emit('pause');
}

canvas.onclick = function () {
    event.emit('pause');
};

canvas.style.display = 'none';

ipc.on('save', function (ev, arg) {
    event.emit('save');
});

ipc.on('pause', function (ev, arg) {
    event.emit('pause');
});

event.on('save', function (ev, arg) {
    if (canvas.style.display === 'none') {
        takePicture();
    }

    saveDataUrl();
});

event.on('pause', function (ev, arg) {
    if (canvas.style.display === 'none') {
        takePicture();
    } else {
        canvas.style.display = 'none';
    }
});

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
navigator.getUserMedia({
    video: {
        width: {
            exact: width
        },
        height: {
            exact: height
        }
    }
}, function (stream) {
    video.srcObject = stream;
}, function (error) {
    console.log('error : ', error);
});

function takePicture() {
    canvas.style.display = 'block';
    takeLiveViewSnapShot();
    saveCanvasAsDataUrl();
    resizeCanvasToFitScreen();
}

function takeLiveViewSnapShot() {
    var ctx = canvas.getContext('2d');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    ctx.drawImage(video, 0, 0, width, height);
}

function saveCanvasAsDataUrl() {
    lastPictureJpeg = canvas.toDataURL('image/jpeg');
    lastPictureDateString = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().replace(/([\-T:.Z])/g, '');
}

function resizeCanvasToFitScreen() {
    var videoWidth = video.offsetWidth;
    var videoHeight = video.offsetHeight;

    var canvasWidth;
    var canvasHeight;

    if (parseFloat(videoWidth) / parseFloat(videoHeight) > parseFloat(width) / parseFloat(height)) {
        canvasWidth = videoHeight * width / height + 1;
        canvasHeight = videoHeight;
    } else {
        canvasWidth = videoWidth;
        canvasHeight = videoWidth * height / width + 1;
    }

    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
}

function saveDataUrl() {
    var a = document.createElement('a');
    a.href = lastPictureJpeg;
    a.download = 'image_' + lastPictureDateString + '.jpg';
    document.body.appendChild(a);
    a.click();
}