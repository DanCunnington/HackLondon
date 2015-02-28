var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {


	var out_message = "Hey please send us some data";
	www.googleapis.com/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q="+out_message+"&source=en&target=es;

	$.get("www.googleapis.com/language/translate/v2?key=AIzaSyBxO4Dar2Q_4zTurAGYfWOgeu4Ngewb4SE&q="+out_message+"&source=en&target=es;", function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });

  res.render('index', { title: 'Hi Ellie' });
});

module.exports = router;
