// farmerlist data array for filling in info box
var textData = [];

var farmerIDToUpdate = "";

// DOM Ready =============================================================
$(document).ready(function() {

    // Add farmer button click
    $('#farmer1').on('click', loadFarmer1);

});

// Functions =============================================================

// Fill table with data
function loadFarmer1() {
  

  document.getElementById('conversationContainer').innerHTML = 'New Header';

};

//create reply function that appends a div to the conversation window given a message
function appendReply(message) {
  $("#conversationContainer").prepend("<row><div id='reply'> Reply from farmer </div></row>");
  //$("#conversationContainer").insertBefore( "<row><div id='reply'> Reply from farmer </div></row>" , $("#conversationContainer").firstChild);
};

//create reply function that appends a div to the conversation window given a message
function appendQuestion(message) {
  $("#conversationContainer").prepend("<row><div id='question'> Question to farmer </div></row>");
      //$('#conversationContainer').animate({ scrollBottom: $(document).height()-$(window).height() }, 500);
  //$("#conversationContainer").insertBefore( "<row><div id='reply'> Reply from farmer </div></row>" , $("#conversationContainer").firstChild);
};