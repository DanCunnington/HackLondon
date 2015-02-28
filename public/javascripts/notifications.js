// farmerlist data array for filling in info box
var farmerListData = [];

var farmerIDToUpdate = "";

// DOM Ready =============================================================
$(document).ready(function() {

    // farmername link click
    $('#farmerList table tbody').on('click', 'td a.linkshowfarmer', showfarmerInfo);

    // Add farmer button click
    $('#btnAddfarmer').on('click', addfarmer);

    // Delete farmer link click
    $('#farmerList table tbody').on('click', 'td a.linkdeletefarmer', deletefarmer);

    // Update farmer link click
    $('#farmerList table tbody').on('click', 'td a.linkupdatefarmer', updatefarmerRetrieve);

    // Update farmer update button
     $('#btnUpdatefarmer').on('click', updatefarmerSubmit);

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
            tableContent += '<td><a href="#" class="linkshowfarmer" rel="' + this.farmername + '">' + this.farmername + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeletefarmer" rel="' + this._id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdatefarmer" rel="' + this._id + '">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#farmerList table tbody').html(tableContent);
    });
};