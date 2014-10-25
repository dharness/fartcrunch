$(document).ready(function() {

    $('#input').bind('keypress', function(event) {
        var audio = new Audio('audio_file.mp3');
        audio.play();
    });
});