var express = require('express');
var router = express.Router();
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient
        , assert = require('assert');
// mongo ds062919.mlab.com:62919/mrj1ngles -u <dbuser> -p <dbpassword> 
var url = 'mongodb://admin:pa22w0rd@ds062919.mlab.com:62919/mrj1ngles';

var infoObjects;
var dataArray = [];

// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    console.log("perma");

    // 1 = load data from local file
    // 2 = load data from database
    var option = 1;

    switch (option) {

        case 1:
            console.log("Reading from File2");
            fs.readFile("./InfoObjects.json", 'utf8', function (err, data) {
                infoObjects = JSON.parse(data);
                console.log("infoObjects = " + JSON.stringify(infoObjects));
                console.log("readfile");
                next();
            });
            break;

        case 2:
            console.log("Reading from Database");
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                console.log("Connected correctly to server");
                // Get the documents collection
                var collection = db.collection('infoObjects');

//                //Insert some documents
//                collection.insertMany([
//                    {a: 1}, {a: 2}, {a: 3}
//                ], function (err, result) {
//                    assert.equal(err, null);
//                    assert.equal(3, result.result.n);
//                    assert.equal(3, result.ops.length);
//                    console.log("Inserted 3 documents into the collection");
//                });

                // Find some documents
                collection.find().toArray(function (err, docs) {
                    assert.equal(err, null);
                    infoObjects = docs;
                });
                db.close();
                next();
            });
            break;

        default:
    }
    console.log("infoObjects = " + JSON.stringify(infoObjects));
    console.log("dataArray = " + dataArray);

});

router.get('/insertObject', function (req, res, next) {

    dataArray.push(req.query.StartX, req.query.EndX, req.query.StartY, req.query.EndY, req.query.startTime, req.query.endTime, req.query.Text);

    var infoObject = {
        "positionStartX": req.query.StartX,
        "positionEndY": req.query.EndY,
        "positionStartY": req.query.StartY,
        "positionEndX": req.query.EndX,
        "startTime": req.query.startTime,
        "endTime": req.query.endTime,
        "text": req.query.Text
    };
    infoObjects.push(infoObject);

    fs.writeFile("./InfoObjects.json", JSON.stringify(infoObjects), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
        ;
    });
    res.render('index', {title: 'Home', data: infoObjects, dataGET: dataArray});
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Home', data: infoObjects, dataGET: dataArray});
});

router.use('/deleteInfoObject', function (req, res, next) {
    // Prepare output in JSON format
    var response = {
        IncomingPost: req.body.delObject
    };

    console.log("Writing to File");
    fs.readFile("./InfoObjects.json", 'utf8', function (err, data) {
        json = JSON.parse(data);
        // https://stackoverflow.com/questions/14400609/remove-json-entry-by-value
        // nekman answered Jan  18 '13 at 14:22  
        var filtered = json.filter(function (object) {
            return object.text !== req.body.delObject;
        });
        fs.writeFile('./InfoObjects.json', JSON.stringify(filtered), function (err) {
            if (err)
                throw err;
        })
    });
    res.render('index', {title: 'Home', data: infoObjects, dataGET: dataArray});
});

router.get('/InfoObjects.json', function (req, res, next) {
    fs.readFile("./InfoObjects.json", 'utf8', function (err, data) {
        infoObjects = JSON.parse(data);
        res.send(infoObjects);
        next();
    });
});

router.get('/VR-Tour.apk', function (req, res, next) {
    var file = './public/apk/VR-Tour.apk';
    res.download(file); // Set disposition and send it.
});

module.exports = router;
