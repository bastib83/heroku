var express = require('express');
var router = express.Router();
//until DB is connected
var fs = require("fs");
//end

var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');
// mongo ds062919.mlab.com:62919/mrj1ngles -u <dbuser> -p <dbpassword> 
// Connection URL
var url = 'mongodb://admin:pa22w0rd@ds062919.mlab.com:62919/mrj1ngles';


/* GET home page. */
router.get('/', function (req, res, next) {

    // 1 = load data from local file
    // 2 = load data from database
    var option = 2;
    
    switch (option) {

        case 1:
            fs.readFile("./InfoObjects.json", 'utf8', function (err, data) {
                InfoObjects = JSON.parse(data);
                console.log('GET index + Prizes');
                res.render('index', {title: 'Home-Local', data: InfoObjects});
            });
            break;

        case 2:
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");

                // Get the documents collection
                var collection = db.collection('infoObjects');

                // Insert some documents
//        collection.insertMany([
//            {a: 1}, {a: 2}, {a: 3}
//        ], function (err, result) {
//            assert.equal(err, null);
//            assert.equal(3, result.result.n);
//            assert.equal(3, result.ops.length);
//            console.log("Inserted 3 documents into the collection");
//        });

                // Find some documents
                collection.find().toArray(function (err, docs) {
                    assert.equal(err, null);
                    console.log("Found the following records");
                    console.log(docs)
                    res.render('index', {title: 'Home-fromDB', data: docs});
                });
                db.close();
            });
            break;

        default:
    }


});

module.exports = router;