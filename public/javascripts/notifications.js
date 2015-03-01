// farmerlist data array for filling in info box
var textData = [];

var farmerIDToUpdate = "";

// DOM Ready =============================================================
$(document).ready(function() {

    // Add farmer button click
    $('#listOfFarmers').on('click', 'li a.linkShowConversation', showConversation);


    loadFarmers();

});

// Functions =============================================================


function loadFarmers() {
	$.get('/farmers/farmerlist', function(farmers) {
		
		for (var i=0; i<farmers.length; i++) {
			$("#listOfFarmers").append("<li><a rel="+farmers[i]._id+" href='#' class='linkShowConversation'>"+farmers[i].name+"</a></li>");
		}
		
	});
}

//Displays a conversation for the farmer clicked
function showConversation() {

	// Prevent Link from Firing
    event.preventDefault();

    // Retrieve farmername from link rel attribute
    var thisfarmerId = $(this).attr('rel');


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