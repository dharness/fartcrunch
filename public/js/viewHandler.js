var currentData = [];
// var farts = [new Audio('./public/sounds/f1.mp3'), new Audio('./public/sounds/f2.mp3'), new Audio('./public/sounds/f3.mp3')];


$(document).ready(function() {

    updateView();

    $('#input').bind('keypress', function(event) {

        if (event.which != 13) {

            console.log('fuvk');
            // var audio = farts[Math.floor(Math.random() * 3)];
            // audio.play();
        }

        if (event.which == 13) {

            // var audio = new Audio('./public/sounds/crunch.mp3');
            // audio.play();

            var inputString = $('#input').val();




            if (inputString.charAt(0) === "#") {

                inputString = inputString.substr(1); //remove the first char
                inputString = sanitizeString(inputString); //sanatize
                inputString = '#' + inputString; //replace the #

                //chop up our input
                inputString = inputString.split(' '); //split into array by spaces
                var tag = inputString[0];
                inputString[0] = '';
                inputString = inputString.join(' ');
                message = inputString.substr(1);

                if (doesContain(tag)) {
                    PUT(tag, message);
                } else {
                    POST(tag, message);
                    GET();
                }

                updateView();
            } else {
                // alertify.log("Listen bud, we only use # around here. \n Got it?");
            }
        }

    });

});

function POST(tag, message) {

    var newDocument = {
        'tag': tag,
        'message': message
    }

    $.ajax({
        type: 'POST',
        data: newDocument,
        url: 'http://localhost:8080/api/twits',
        dataType: 'JSON'
    }).done(function(response) {

        // Check for successful (blank) response
        if (response.msg === '') {
            // Clear the form inputs
            $('#input').val('');

        } else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });

}

function GET() {

    $.ajax({
        url: 'http://localhost:8080/api/twits',
        async: false,
        success: function(data) {

            //if theres more than 10 elements, grab only the last 10
            if (data.length > 10) {

                for (var i = 0; i < data.length - 10; i++) {
                    DELETE(data[i]._id);
                }
            }
        }
    });

}

function PUT(tag, message) { //used to replace the message value of a document

    var newDocument = {
        'tag': tag,
        'message': message
    }

    $.ajax({
        type: 'PUT',
        data: newDocument,
        url: 'http://localhost:8080/api/twits/' + tag.substr(1),
        dataType: 'JSON'
    }).done(function(response) {

        // Check for successful (blank) response
        if (response.msg === '') {
            $('#input').val('');
        } else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });

}

function DELETE(_id) { //used to delete a document by _id

    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/twits/' + _id,
    }).done(function(response) {

        // Check for successful (blank) response
        if (response.msg === '') {

        } else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
}

function updateView() {

    var s = '';

    $.getJSON('http://localhost:8080/api/twits', function(data) {

        $.each(data, function() {
            s += ("<li>" + this.tag + ' ' + this.message + '</li>');

        });
        $('#ul').html(s);
    });


}

function doesContain(tag) {

    var result = false;

    $.ajax({
        url: 'http://localhost:8080/api/twits',
        async: false,
        success: function(data) {

            $.each(data, function() {
                if (this.tag == tag) {
                    result = true;
                }
            });
        }
    });
    return result;

}

function sanitizeString(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
}