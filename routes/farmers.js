var express = require('express');
var router = express.Router();


//Twilio connect - using test credentials for now
var client = require('twilio')('AC93f083af157194e9e51473461236bbe8','a177df398f82f481ec819a1c828f57cb');

/* GET farmers page. */
router.get('/', function(req, res, next) {

  res.render('farmers', { title: 'Farmers' });

});

/*
 * GET farmerlist.
 */
router.get('/farmerlist', function(req, res) {
    var db = req.db;
    db.collection('farmers').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addfarmer.
 */
router.post('/addfarmer', function(req, res) {
    var db = req.db;
    db.collection('farmers').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * POST to addfarmer.
 */
router.post('/addfarmerimage', function(req, res) {
    var db = req.db;
    db.collection('farmers').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deletefarmer.
 */
router.delete('/deletefarmer/:id', function(req, res) {
    var db = req.db;
    var farmerToDelete = req.params.id;
    db.collection('farmers').removeById(farmerToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * PUT to updatefarmer.
 */
router.put('/updatefarmer/:id', function(req, res) {
    var db = req.db;
    var farmerToUpdate = req.params.id;
    var doc = { $set: req.body};
    db.collection('farmers').updateById(farmerToUpdate, doc ,function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
* POST to message farmer - connect to Twilio
*/
router.post('/messageFarmer', function(req,res) {

	//Extract the request
	var request = req.body;
		
	var message = request.message;
	var phoneNumber = request.farmer_phoneNumber;

	console.log(phoneNumber);
	console.log(message);

	var messageObjectToInsert = {"farmer_id": request.farmer_id, "message_body": message};

	//Save to database
	var db = req.db;
    db.collection('messages').insert(messageObjectToInsert, function(error, result){

    	//Send an SMS text message
		client.sendMessage({

		    to: phoneNumber, // Any number Twilio can deliver to
		    from: '+441384901173', // A number you bought from Twilio and can use for outbound communication
		    body: message // body of the SMS message

		}, function(err, responseData) { //this function is executed when a response is received from Twilio

		    if (!err) { // "err" is an error received during the request, if any

		        // "responseData" is a JavaScript object containing data received from Twilio.
		        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
		        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

		        console.log(responseData.from); // outputs "+14506667788"
		        console.log(responseData.body); // outputs "word to your mother."

		        res.send(200);
		    } else {
		    	console.log(err);
		    }
		});        
    });
});

// GET messages to specified farmer
router.get('/messagesToFarmer/:id', function(req,res) {

	//Lookup in messages table and get messages where id = farmer_id
	var farmerId = req.params.id;

	var db = req.db;
    db.collection('messages').find({farmer_id: farmerId}).toArray(function (err, items) {
        res.json(items);
    });

});

// GET replies to specified farmer
router.get('/repliesToFarmer/:id', function(req,res) {

	//Lookup in messages table and get messages where id = farmer_id
	var ObjectID = require('mongodb').ObjectID;
	farmerId = new ObjectID(req.params.id); 

	var db = req.db;
    db.collection('replies').find({farmer_id: farmerId}).toArray(function (err, items) {
    	console.log(items);
        res.json(items);
    });

});

module.exports = router;