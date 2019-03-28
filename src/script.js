var width = 1280;
var height = 720;
var video = document.getElementById('camera');
var canvas = document.getElementById('canvas');
var lastPictureJpeg = null;
var ipc = require('electron').ipcRenderer;

canvas.style.display = 'none';

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
    console.log('エラー!', error);
});

ipc.on('save', function (event, arg) {
    if (canvas.style.display === 'none') {
        takePicture();
    }

    savePicture();
});

ipc.on('pause', function (event, arg) {
    if (canvas.style.display === 'none') {
        takePicture();
    } else {
        canvas.style.display = 'none';
    }
});

var takePicture = function () {
    canvas.style.display = 'block';
    createJpegData();
    displaySavedPicture();
}

var recordMovie = function () {
    alert('double clicked');
}

function createJpegData() {
    var ctx = canvas.getContext('2d');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    ctx.drawImage(video, 0, 0, width, height);
    lastPictureJpeg = canvas.toDataURL('image/jpeg');
}

function displaySavedPicture() {
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
    canvas.onclick = function () {
        canvas.style.display = 'none';
    };
}

function savePicture() {
    var dateString = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().replace(/([\-T:.Z])/g, '');
    var a = document.createElement('a');
    a.href = lastPictureJpeg;
    a.download = 'image_' + dateString + '.jpg';
    document.body.appendChild(a);
    a.click();
}