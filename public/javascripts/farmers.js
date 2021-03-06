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

    // Message farmer link button
    $('#farmerList table tbody').on('click', 'td a.linkmessagefarmer', messageFarmer);

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
            tableContent += '<td><a href="#" class="linkmessagefarmer" rel="' + this._id + '">message</a></td>';
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
            'phoneNumber': $('#addFarmer fieldset input#inputFarmerPhone').val(),
            'nameOfImage': $('#addFarmer fieldset input#inputFarmerPhoto').val()
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

// // Store Image
// function storeImage(event) {
//     event.preventDefault();

//       // access database
//   $db = $conn->test;

//   // get GridFS files collection
//   $gridfs = $db->getGridFS();
  
//   // store file in collection
//   $id = $gridfs->storeFile('/tmp/img_2312.jpg');
//   echo 'Saved file with ID: ' . $id;

    // var newFileName = "mkyong-java-image";
    // File imageFile = new File("/public/images/icon_bee.png");
    // GridFS gfsPhoto = new GridFS(db, "photo");
    // GridFSInputFile gfsFile = gfsPhoto.createFile(imageFile);
    // gfsFile.setFilename(newFileName);
    // gfsFile.save();

    // var filePath = '/images/BlackLogo2.PNG'

    // if (filePath != "") {
    //   $.ajaxFileUpload({ url: '/farmers/addfarmerimage',
    //     secureuri: false,
    //     fileElementId: 'fileupload',
    //     dataType: 'JSON',
    //     success: function (data, status) {
    //         if (typeof (data.error) != 'undefined') {
    //             if (data.error != '') {
    //                 alert(data.error);
    //             } else {
    //                 alert('Success')
    //             }
    //         }
    //     },
    //     error: function (data, status, e) {
    //         alert(e);
    //     }
    //   }
    //   )
    // }

    // 'image': $('#addFarmer fieldset input#inputFarmerPhoto').val()
//}

function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

// // Show image
// function retrieveImage(str) {
//     event.preventDefault();

//     var img = new Image();
//     img.src = "data:/image/jpeg;base64,"+hexToBase64(getBinary());
//     document.body.appendChild(img);
// }

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
            'phoneNumber': $('#updateFarmer fieldset input#updateFarmerPhone').val(),
            'nameOfImage': $('#updateFarmer fieldset input#inputFarmerPhoto').val()
    
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

//Pops up a js prompt and then sends a text to that particular farmers phone number
function messageFarmer() {

    event.preventDefault();

    var farmerId = $(this).attr('rel');

    //Search through farmerListData to find the farmer clicked
    var farmer;
    for (var i=0; i<farmerListData.length; i++) {
        var temp = farmerListData[i];
     
        if (farmerId == temp._id) {
            farmer = temp;
        }
    }

    var message = prompt("Please enter a message to send to "+farmer.name);

    //Build up JSON to post
    var messageRequest = {"farmer_id": farmer._id, "farmer_name": farmer.name, "farmer_phoneNumber":farmer.phoneNumber, "message": message};

    
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


}

//Subscribe to faye event when text received
//create faye client
var faye_client = new Faye.Client('http://localhost:8000/faye');

faye_client.subscribe('/replyReceived', function(message) {   
    

    console.log(message);
    
});