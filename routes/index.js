var express = require('express');
var router = express.Router();
var http = require('https');

//Faye - for sending text message replies to the client
var faye = require('faye');
var faye_server = new faye.NodeAdapter({mount: '/faye', timeout: 120});

console.log('Firing up faye server. . . ');
faye_server.listen(8089);


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


//GET Request that sends the text message via twilio
router.get('/sendTextMessage', function(req, res, next) {
	
	//Send an SMS text message
	client.sendMessage({

	    to:'+447961708658', // Any number Twilio can deliver to
	    from: '+441384901173', // A number you bought from Twilio and can use for outbound communication
	    body: 'Hey Farmer, please send us some data' // body of the SMS message

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

	    if (!err) { // "err" is an error received during the request, if any

	        // "responseData" is a JavaScript object containing data received from Twilio.
	        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	        // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	        console.log(responseData.from); // outputs "+14506667788"
	        console.log(responseData.body); // outputs "word to your mother."
	    }
	});

});


// POST route for the text message reply
router.post('/textMessageReply', function(req,res) {
	var replyObject = req.body;
	console.log(replyObject.From);
	console.log(replyObject.Body);


	//Save reply to database

	//Send to client

    faye_server.getClient().publish('/replyReceived', {
        
        twilioResponse: replyObject

	});


    res.render('index', { title: 'Message Sent' });

	// Create a TwiML response
    var resp = new client.TwimlResponse();
	res.writeHead(200, {
        'Content-Type':'text/xml'
    });
   
    res.end(resp.toString());
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

