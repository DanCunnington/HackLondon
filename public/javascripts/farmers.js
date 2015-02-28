// farmerlist data array for filling in info box
var farmerListData = [];

var farmerIDToUpdate = "";

// DOM Ready =============================================================
$(document).ready(function() {

    // farmername link click
    $('#farmerList table tbody').on('click', 'td a.linkshowfarmer', showfarmerInfo);

    // Add farmer button click
    $('#btnAddFarmer').on('click', addfarmer);

    // Delete farmer link click
    $('#farmerList table tbody').on('click', 'td a.linkdeletefarmer', deletefarmer);

    // Update farmer link click
    $('#farmerList table tbody').on('click', 'td a.linkupdatefarmer', updatefarmerRetrieve);

    // Update farmer update button
     $('#btnUpdateFarmer').on('click', updatefarmerSubmit);

    // Populate the farmer table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/farmers/farmerlist', function( data ) {
        
        // Stick our farmer data array into a farmerlist variable in the global object
        farmerListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowfarmer" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.phoneNumber + '</td>';
            tableContent += '<td><a href="#" class="linkdeletefarmer" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdatefarmer" rel="' + this._id + '">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#farmerList table tbody').html(tableContent);
    });
};

// Show farmer Info
function showfarmerInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve farmername from link rel attribute
    var thisfarmerName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = farmerListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisfarmerName);
    
    // Get our farmer Object
    var thisfarmerObject = farmerListData[arrayPosition];

    //Populate Info Box
    $('#farmerInfoName').text(thisfarmerObject.name);
    $('#farmerInfoPhoneNumber').text(thisfarmerObject.phoneNumber);

};

// Add farmer
function addfarmer(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addfarmer input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all farmer info into one object
        var newfarmer = {
            'name': $('#addFarmer fieldset input#inputFarmerName').val(),
            'phoneNumber': $('#addFarmer fieldset input#inputFarmerPhone').val()
        }
        
        // Use AJAX to post the object to our addfarmer service
        $.ajax({
            type: 'POST',
            data: newfarmer,
            url: '/farmers/addfarmer',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addFarmer fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete farmer
function deletefarmer(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this farmer?');

    // Check and make sure the farmer confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/farmers/deletefarmer/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

//Update farmer
function updatefarmerRetrieve(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve farmername from link rel attribute
    var thisID = $(this).attr('rel');
    farmerIDToUpdate = thisID;

    // Get Index of object based on id value
    var arrayPosition = farmerListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisID);

    // Get our farmer Object
    var thisfarmerObject = farmerListData[arrayPosition];

    //Populate Info Box
    $('#updateFarmerName').val(thisfarmerObject.name);
    $('#updateFarmerPhone').val(thisfarmerObject.phoneNumber);


}

//When button is clicked
function updatefarmerSubmit(event) {

    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#updatefarmer input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all farmer info into one object
        var updatedfarmer = {
            'name': $('#updateFarmer fieldset input#updateFarmerName').val(),
            'phoneNumber': $('#updateFarmer fieldset input#updateFarmerPhone').val()
    
        }

        
        // Use AJAX to post the object to our addfarmer service
        $.ajax({
            type: 'PUT',
            data: updatedfarmer,
            url: '/farmers/updatefarmer/'+farmerIDToUpdate,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#updateFarmer fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }

}

//Subscribe to faye event when text received
//create faye client
var faye_client = new Faye.Client('http://localhost:8000/faye');

faye_client.subscribe('/replyReceived', function(message) {   
    

    console.log(message);
    
});