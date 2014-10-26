// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// configure app
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 80; // set our port

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodetest2'); // connect to our database
var Twit = require('./app/models/twit');

// ROUTES FOR OUR API
// =============================================================================

app.use(express.static(__dirname + '/public'));

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});


router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// on routes that end in /twit
// ----------------------------------------------------
router.route('/twits')

// create a twit (accessed at POST http://localhost:8080/twits)
.post(function(req, res) {

    var twit = new Twit(); // create a new instance of the Twit model
    twit.tag = req.body.tag; // set the tag (comes from the request)
    twit.message = req.body.message;

    twit.save(function(err) {
        //send nothing for sucess, err for err
        res.send((err === null) ? {
            msg: ''
        } : {
            msg: err
        });
    });


})

// get all the twits (accessed at GET http://localhost:8080/api/twits)
.get(function(req, res) {
    Twit.find(function(err, twits) {
        if (err)
            res.send(err);

        res.json(twits);
    });
});

// on routes that end in /twits/:twit_id
// ----------------------------------------------------
router.route('/twits/:twit_tag')

// get the twit with that id
.get(function(req, res) {
    Twit.findOne({
        'tag': req.params.twit_tag
    }, function(err, twit) {
        if (err)
            res.send(err);
        res.json(twit.message);
    });
})

// update the twit with this id
.put(function(req, res) {
    Twit.findOne({
        'tag': '#' + req.params.twit_tag
    }, function(err, twit) {

        if (err)
            res.send(err);

        twit.message = req.body.message;
        twit.save(function(err) {
            res.send((err === null) ? {
                msg: ''
            } : {
                msg: err
            });
        });

    });
})

// delete the twit with this id
.delete(function(req, res) {
    Twit.remove({
        '_id': req.params.twit_tag
    }, function(err, twit) {
        res.send((err === null) ? {
            msg: ''
        } : {
            msg: err
        });
    });
});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);