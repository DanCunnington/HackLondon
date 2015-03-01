// farmerlist data array for filling in info box
var farmerListData = [];

var farmerIDToUpdate = "";

// DOM Ready =============================================================
$(document).ready(function() {

    // Add farmer button click
    $('#listOfFarmers').on('click', 'li a.linkShowConversation', showConversation);

    // Send message button click
    $('#sendMessage').on('click', sendMessage);


    loadFarmers();

    //Subscribe to faye event when text received
	//create faye client
	var faye_client = new Faye.Client('http://localhost:8000/faye');

	faye_client.subscribe('/replyReceived', function(message) {   
	    

	    appendReply(message.twilioResponse.Body);
	    
	});

});

// Functions =============================================================


function loadFarmers() {
	$.get('/farmers/farmerlist', function(farmers) {

		farmerListData = farmers;
		
		for (var i=0; i<farmers.length; i++) {
			$("#listOfFarmers").append("<li><a rel="+farmers[i]._id+" href='#' class='linkShowConversation'><img src='/images/"+farmers[i].nameOfImage+"', width='50px', height='50px'></img>    "+farmers[i].name+"</a></li>");
		}
		
	});
}

//Displays a conversation for the farmer clicked
function showConversation() {

	// Prevent Link from Firing
    event.preventDefault();

    // Retrieve farmername from link rel attribute
    var thisfarmerId = $(this).attr('rel');

    //Update message send rel
    $("#sendMessage").attr('rel',thisfarmerId);


    //Get messages from the server for the specified farmer
    $.get('/farmers/messagesToFarmer/'+thisfarmerId, function(messages) {

    	for (var i=0; i<messages.length; i++) {
    		appendQuestion(messages[i].message_body);
    	}
    });

    //Get replies from the server for the specified farmer
    $.get('/farmers/repliesToFarmer/'+thisfarmerId, function(replies) {
    	
    	for (var i=0; i<replies.length; i++) {
    		appendReply(replies[i].Body);
    	}
    });

}

//create reply function that appends a div to the conversation window given a message
function appendReply(message) {
  $("#conversationContainer").prepend("<row><div id='reply'>"+message+"</div></row>");
  //$("#conversationContainer").insertBefore( "<row><div id='reply'> Reply from farmer </div></row>" , $("#conversationContainer").firstChild);
};

//create reply function that appends a div to the conversation window given a message
function appendQuestion(message) {
  $("#conversationContainer").prepend("<row><div id='question'>"+message+"</div></row>");
      //$('#conversationContainer').animate({ scrollBottom: $(document).height()-$(window).height() }, 500);
  //$("#conversationContainer").insertBefore( "<row><div id='reply'> Reply from farmer </div></row>" , $("#conversationContainer").firstChild);
};


//Send the text message
function sendMessage() {

	event.preventDefault();

	//Get the message out of the input
	var message = $("#newMessage").val();

	//Clear input field
	$("#newMessage").val("");

	//Translate to spanish
	//get request, append messsage in parameters
	$.get('/translateEngToSpa/'+message, function(json) {

		console.log(json);
		var spanish = json.spanish;

		//Update display
	    appendQuestion(message);

		//Get farmer id from rel of button
		var farmerId = $("#sendMessage").attr('rel');

		//Search through farmerListData to find the farmer clicked
	    var farmer;
	    for (var i=0; i<farmerListData.length; i++) {
	        var temp = farmerListData[i];
	     
	        if (farmerId == temp._id) {
	            farmer = temp;
	        }
	    }

		//Build up JSON to post
	    var messageRequest = {"farmer_id": farmer._id, "farmer_name": farmer.name, "farmer_phoneNumber":farmer.phoneNumber, "message": spanish};

	    
	    // Use AJAX to post the object to our addfarmer service
	    $.ajax({
	        type: 'POST',
	        data: messageRequest,
	        url: '/farmers/messageFarmer',
	        dataType: 'JSON'
	    }).done(function( response ) {

	        // Check for successful (blank) response
	        if (response.msg === '') {

	            alert("Message Sent");

	        }
	        else {

	            // If something goes wrong, alert the error message that our service returned
	            alert('Error: ' + response.msg);

	        }
	    });

	});
    


	

}