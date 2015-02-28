var express = require('express');
var router = express.Router();
var http = require('https');



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
router.get('bloomberg', function(req, res, next) {
// change HOST and PORT to where the blpapi-http web server is running
var HOST = 'http-api.openbloomberg.com';
var PORT = '/request';

var histDataReqPayload = {
    securities: ['AAPL US Equity', 'VOD LN Equity'],
    fields: ['PX_LAST', 'OPEN'],
    startDate: "20120101",
    endDate: "20120301",
    periodicitySelection: "DAILY"
};

var connectReqOpts = {
    host: HOST,
    port: PORT,
    method: 'POST',
    path: '/v1.0/connect'
};

var req = http.request(connectReqOpts, function(resp) {
    console.log('RESPONSE: /v1.0/connect');
    console.log('STATUS: ' + resp.statusCode);
    console.log('HEADERS: ' + JSON.stringify(resp.headers))

    var data = "";
    resp.on('data', function(chunk) {
        data += chunk;
    });

    resp.on('end', function() {
        data = JSON.parse(data);
        var sessionId = data.sessid;

        var histDataRequestOpts = {
            host: HOST,
            port: PORT,
            method: 'POST',
            path: '/v1.0/request/blp/refdata/HistoricalData?sessid=' + sessionId
        };
        console.log(histDataRequestOpts);

        req = http.request(histDataRequestOpts, function(resp) {
            console.log('RESPONSE: /v1.0/request/blp/refdata/HistoricalData');
            console.log('STATUS: ' + resp.statusCode);
            console.log('HEADERS: ' + JSON.stringify(resp.headers))

            data = "";
            resp.on('data', function(chunk) {
                data += chunk;
            });

            resp.on('end', function() {
                console.log(data);
            });

        });
        req.write(JSON.stringify(histDataReqPayload));
        req.end();
    });
});

req.on('error', function(e) {
    console.log('Request error: ' + e.message);
});

req.end();

  res.render('bloomberg', { title: 'bloomberg page' });

});

/* ---------------------------------------------------------------------------------*/

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


	        res.render('index', { title: 'Message Sent' });
	    }
	});

});


// POST route for the text message reply
router.post('/textMessageReply', function(req,res) {
	var replyObject = req.body;
	console.log(replyObject.From);
	console.log(replyObject.Body);


	//Save reply to database

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

