$(document).ready(function() {

    $('#input').bind('keypress', function(event) {
        if(event.which == 13) {
        	POST($('#input').val());
        	// PUT('#ellie', 'lovely');
        }
    });

});

function POST(inputString) {
  
    if(inputString.charAt(0) === "#"){
        
        inputString = inputString.split(' ');//split into array by spaces
        var tag = inputString[0];
        inputString[0] = '';
        inputString = inputString.join(' ');
        message = inputString.substr(1);


        var newDocument = {'tag': tag, 'message': message}

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newDocument,
            url: 'http://localhost:8080/api/twits',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#input').val('');
                GET();
            }

            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
			}); 
    } else {
        alert ("YOU FUCKING IDIOT");
    }
}

function GET () {
	$.getJSON( 'http://localhost:8080/api/twits', function( data ) {

    //if theres more than 10 elements, grab only the last 10
    if(data.length >= 10){
        
        console.log ("EXTRAS:");
        for (var i =0; i < data.length - 9; i++) {
        	DELETE(data[i]._id);
        }
    }

    console.log ("DATA:");

	$.each(data, function() {
        console.log(this.tag) + ' ' + this.message;
        console.log(data.length);
    	});
	});		
}

function PUT (tag, message) { //used to replace the message value of a document

	var newDocument = {'tag': tag, 'message': message}

        $.ajax({
        type: 'PUT',
        data: newDocument,
        url: 'http://localhost:8080/api/twits/' + tag,
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
        	alert ('suceeeess');
        }

        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
		});

}

function DELETE (_id) { //used to delete a document by _id

	    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:8080/api/twits/' + _id,
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
        	
        }

        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
		});

}