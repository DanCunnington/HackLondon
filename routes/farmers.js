var express = require('express');
var router = express.Router();

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

module.exports = router;