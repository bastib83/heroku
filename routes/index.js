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

    var InfoObjects;
    var dataArray = [];
    dataArray.push(req.query.StartX, req.query.EndX, req.query.StartY, req.query.EndY, req.query.startTime, req.query.endTime, req.query.Text);
    
    console.log("req.query: "+req.query); 
    console.log("dataArray: "+dataArray); 
    
    // 1 = load data from local file
    // 2 = load data from database
    var option = 2;
    
    switch (option) {

        case 1:
            fs.readFile("./InfoObjects.json", 'utf8', function (err, data) {
                InfoObjects = JSON.parse(data);
                res.render('index', {title: 'Home-Local', data: InfoObjects, dataGET: dataArray});
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
                    InfoObjects = docs;
                    //console.log("Found the following records");
                    //console.log(docs);
                    res.render('index', {title: 'Home-fromDB', data: InfoObjects, dataGET: dataArray});
                });
                db.close();
            });
            break;

        default:
            res.render('index', {title: 'Home-empty', data: InfoObjects, dataGET: dataArray});
    }
});

module.exports = router;