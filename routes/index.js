var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');

// Connection URL
var url = 'mongodb://admin:pa22w0rd@ds062919.mlab.com:62919/mrj1ngles';

/* GET home page. */
router.get('/', function (req, res, next) {

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        // Get the documents collection
        var collection = db.collection('user');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs)
            res.render('index', {title: 'Home', data: docs});
        });
        db.close();
    });
});

module.exports = router;
