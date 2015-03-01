var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');

var fs = require('fs');

var host = process.argv[2] || "http-api.openbloomberg.com";
var port = 443

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
	  });

	  res.on('end', function() {
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
router.get('/bloomberg', function(req, response, next) {
	response.render('bloomberg', { title: 'bloomberg page'});
});

router.get('/bloombergData', function(req, response, next) {
	var options = {
	    host: host,
	    port: port,
	    path: '/request?ns=blp&service=refdata&type=HistoricalDataRequest',
	    method: 'POST',
	    key: fs.readFileSync('public/bloomberg/hacklondon_spring_2015_006.key'),
	    cert: fs.readFileSync('public/bloomberg/hacklondon_spring_2015_006.crt'),
	    ca: fs.readFileSync('public/bloomberg/bloomberg.crt')
	};

	var req = https.request(options, function(res) {
	    console.log("statusCode: ", res.statusCode);
	    console.log("headers: ", res.headers);

	    var bodyChunks = [];
	    res.on('data', function(d) {
	      //process.stdout.write(d);
	      bodyChunks.push(d);
	    });

	    res.on('end', function(data) {
	    	//res.render('bloomberg', { title: 'bloomberg page', bloombergData: data });
	    	var body = Buffer.concat(bodyChunks);
		    console.log('BODY: ' + body);
		    response.json(body);
		    
	    });


	});

	req.on('error', function(e) {
	    console.error(e);
	});

	req.write(JSON.stringify( {
	    "securities": ["ismwhoneyindex"],
	    "fields": ["PX_LAST"],
	    "startDate": "20100101",
	    "endDate": "20150101",
	    "periodicitySelection": "YEARLY"
	}));
	req.end();

});

/* ---------------------------------------------------------------------------------*/



// POST route for the text message reply
router.post('/textMessageReply', function(request,response) {
	var db = request.db;
	var replyObject = request.body;

	var spanishReply = replyObject.Body;


	//Convert spanish reply to english
	var msgToTranslate = spanishReply.replace(/ /g, "+");


	var options = {
		host: 'www.googleapis.com',
		path: '/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q='+msgToTranslate+'&source=es&target=en'
	};

	var req = https.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    bodyChunks.push(chunk);
	  });

	  res.on('end', function() {
		    var body = Buffer.concat(bodyChunks);
		    body = body +"";
		    body = JSON.parse(body);
		    var english = body.data.translations[0].translatedText;

		    //update the replyobject
			replyObject.Body = english;
			console.log(english);
			console.log(replyObject);

			//Get phone number and lookup in the farmers table which farmer has sent the reply
			//then store the farmer id.
			var replyPhoneNumber = replyObject.From;

			db.collection('farmers').find({phoneNumber: replyPhoneNumber}).toArray(function (err, items) {
		       

				//Should only be one item
				var farmerId = items[0]._id;


				//Update reply object
				replyObject.farmer_id = farmerId;

				//If the reply contains information about the profit, update the accounts table
				var profitMatch = english.match(/profit/i);
				var noJarsMatch = english.match(/jars/i);
				var costsMatch = english.match(/costs/i);
				var hoursMatch = english.match(/hours/i);

				if (profitMatch) {
					//Extract value past the semi colon
					var profit = english.split(":")[1];

					//Now we have the profit, save to profits table
					var profitsObjectToInsert = {"farmer_id":farmerId, "profit":profit, "timestamp":Date.now()};

					db.collection('profits').insert(profitsObjectToInsert, function(error,result) {

					});
				}

				if (noJarsMatch) {
					//Extract value past the semi colon
					var jars = english.split(":")[1];

					//Now we have the no jars, save to jars table
					var jarsObjectToInsert = {"farmer_id":farmerId, "noHoneyJarsSold":jars, "timestamp":Date.now()};

					db.collection('jars').insert(jarsObjectToInsert, function(error,result) {

					});
				}

				if (costsMatch) {
					//Extract value past the semi colon
					var costs = english.split(":")[1];

					//Now we have the costs, save to costs table
					var costsObjectToInsert = {"farmer_id":farmerId, "costs":costs, "timestamp":Date.now()};

					db.collection('costs').insert(costsObjectToInsert, function(error,result) {

					});
				}

				if (hoursMatch) {
					//Extract value past the semi colon
					var hours = english.split(":")[1];

					//Now we have the hours, save to hours table
					var hoursObjectToInsert = {"farmer_id":farmerId, "hours":hours, "timestamp":Date.now()};

					db.collection('hours').insert(hoursObjectToInsert, function(error,result) {

					});
				}

				
		       	//Save reply to database
			    db.collection('replies').insert(replyObject, function(error, result) {
			    	//Send to client
			    	fayeClient.publish('/replyReceived', {

			    		twilioResponse: replyObject
			    	});

			    	

			    	response.send(200);
			    })

		    });
		})
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});

});

/* GET route for translating English to Spanish */
router.get('/translateEngToSpa/:message', function(request,response) {

	var msgToTranslate = request.params.message;

	var msgToTranslate = msgToTranslate.replace(/ /g, "+");

	var options = {
		host: 'www.googleapis.com',
		path: '/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q='+msgToTranslate+'&source=en&target=es'
	};

	var req = https.get(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    bodyChunks.push(chunk);
	  });

	  res.on('end', function() {
	    var body = Buffer.concat(bodyChunks);
	    body = body +"";
	    body = JSON.parse(body);
	    var spanish = body.data.translations[0].translatedText;
	    
	
	    
	    response.json({"english": request.params.message,"spanish":spanish});
	    
		})
	});

	req.on('error', function(e) {
	  console.log('ERROR: ' + e.message);
	});

});

/* GET profits */
router.get('/profits', function(req,res,next) {
	var db = req.db;
    db.collection('profits').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* GET jars */
router.get('/jars', function(req,res,next) {
	var db = req.db;
    db.collection('jars').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* GET costs */
router.get('/costs', function(req,res,next) {
	var db = req.db;
    db.collection('costs').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* GET hours */
router.get('/hours', function(req,res,next) {
	var db = req.db;
    db.collection('hours').find().toArray(function (err, items) {
        res.json(items);
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

router.get('/graphs', function(req, res, next) {
  res.render('graphs', { title: 'Hi Ruth' });
});

module.exports = router;
