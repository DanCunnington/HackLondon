var express = require('express');
var router = express.Router();
var http = require('https');

//Faye - for sending text message replies to the client
var faye = require('faye');
var fayeClient = new faye.Client('http://localhost:8000/faye');

//Twilio connect - using test credentials for now
var client = require('twilio')('AC93f083af157194e9e51473461236bbe8','a177df398f82f481ec819a1c828f57cb');

/* GET home page. */
router.get('/', function(req, res, next) {

	var outMessage = "Hello+ellie";

	var options = {
	  host: 'www.googleapis.com',
	  path: '/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q='+outMessage+'&source=en&target=es'
	};

	var req = http.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    bodyChunks.push(chunk);
	  }).on('end', function() {
	    var body = Buffer.concat(bodyChunks);
	    console.log('BODY: ' + body);
	    // ...and/or process the entire body here.
	  })
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});


	  res.render('index', { title: 'Hi Ellie' });

});

/* ------------------------------------------------------------------------- */


/* GET BLOOMBERG PAGE. */
router.get('/bloomberg', function(req, res, next) {

  res.render('bloomberg', { title: 'bloomberg page' });

});

/* ---------------------------------------------------------------------------------*/



// POST route for the text message reply
router.post('/textMessageReply', function(req,res) {
	var replyObject = req.body;

	//Save reply to database
	var db = req.db;
    db.collection('replies').insert(replyObject, function(error, result){
    	//Send to client
		fayeClient.publish('/replyReceived', {
        
        	twilioResponse: replyObject

		});
    	res.send(200);
    });

});

/* GET notificatons page. */
router.get('/notifications', function(req, res, next) {
  res.render('notifications', { title: 'Hi Ruth' });
});

/* GET bloomberg page. */
router.get('/bloomberg', function(req, res, next) {
  res.render('bloomberg', { title: 'Hi Ruth' });
});

module.exports = router;

