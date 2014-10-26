var currentData = [];
var farts = [new Audio('f1.mp3'), new Audio('f2.mp3'), new Audio('f3.mp3')];
var baseURL = 'http://104.131.5.102/';


$(document).ready(function() {

    updateView();

    $('#inputID').bind('keypress', function(event) {



        //when the user presses any key not enter, play a hillarious fart sound
        if (event.which != 13) {

            var audio = farts[Math.floor(Math.random() * 3)];
            audio.play();
        }

        //if user presses enter
        if (event.which == 13) {

            var inputString = $('#inputID').val();

            //play a fart sound
            var audio = new Audio('crunch.mp3');
            audio.play();

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

                alert("Listen bud, we only use # around here. \n Got it?");
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
        url: baseURL + 'api/twits',
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
        type: "GET",
        dataType: "JSON",
        async: false,
        url: baseURL + '/api/twits',
        success: function(response) {

            alert(data.length);

            for (var i = 0; i < data.length - 10; i++) {
                DELETE(data[i]._id);
            }
        }

    });

    function PUT(tag, message) { //used to replace the message value of a document

        var newDocument = {
            'tag': tag,
            'message': message
        }

        $.ajax({
            type: 'PUT',
            data: newDocument,
            url: baseURL + 'api/twits/' + tag.substr(1),
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
            url: baseURL + 'api/twits/' + _id,
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

        $.getJSON(baseURL + 'api/twits', function(data) {

            $.each(data, function() {
                // console.log(this);
                s += ("<li>" + this.tag + ' ' + this.message + '</li>');

            });
            $('#ul').html(s);
        });


    }

    function doesContain(tag) {

        var result = false;

        $.ajax({
            url: baseURL + 'api/twits',
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