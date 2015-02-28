var express = require('express');
var router = express.Router();

//Twilio connect - using test credentials for now
var client = require('twilio')('AC93f083af157194e9e51473461236bbe8','a177df398f82f481ec819a1c828f57cb');

/* GET home page. */
router.get('/', function(req, res, next) {

	var out_message = "Hey please send us some data";
	www.googleapis.com/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q="+out_message+"&source=en&target=es;

	$.get("www.googleapis.com/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q="+out_message+"&source=en&target=es;", function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
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


	        res.render('index', { title: 'Message Sent' });
	    }
	});

});

module.exports = router;
