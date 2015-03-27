var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = require('url');

var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/open';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

var BSON = MongoClient.BSONPure;

//var server = new Server('mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/', 27017, {auto_reconnect: true});
//db = new Db('notesdb', server);
//db.open(function(err, db) {
//    if(!err) {
//        console.log("Connected to 'notesdb' database");
//    }
//});

console.log(connection_string);

// Use connect method to connect to the Server
MongoClient.connect(connection_string, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    exports.options = function(req,res,next)
    {
        if(req.route.method == "options")
        {
            console.log('!OPTIONS');
            var headers = {};
            // the below allows cross site scripting
            // IE8 does not allow domains to be specified, just the *
            // headers["Access-Control-Allow-Origin"] = req.headers.origin;
            // headers["Access-Control-Allow-Origin"] = "*";
            // headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            // headers["Access-Control-Allow-Credentials"] = false;
            // headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            // headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
            res.writeHead(200, headers);
            res.end();
        }

        next(); // allow to route for POST, GET and others
    }

    exports.addNewNote = function(req, res, io)
    {
        var note = req.body;

        console.log('Adding note: ' + JSON.stringify(note));

        db.collection('notes', function(err, collection) {
            collection.insert(note, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    res.send(result[0]);
                }
            });
        });

        // sending an event that the board was updated to all registered clients
        var eventName = 'board_'+note['board']; // todo: make prefix constant
        io.sockets.emit(eventName, {});
    };

    exports.findAllInBoard = function(req, res)
    {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        if(query['board'])
        {
            db.collection('notes', function(err, collection) {
                collection.find({ board: query['board'] }).toArray(function(err, items) {
                    res.send(items);
                });
            });
        }
        else
        {
            // closing response if no specific board was requested.
            // Not enabling someone querying for all existing boards.
            res.end();
        }
    };

    exports.deleteNote = function(req, res, io) {

        var id = req.params.id;

        console.log('Attempting to delete note: ' + id);
        db.collection('notes', function(err, collection) {

            var o_id = new BSON.ObjectID(id);
            collection.findAndModify({'_id': o_id}, [], {}, {remove:true}, function(err, object)
                {
                    if (err)
                    {
                        res.send({'error':'An error has occurred - ' + err});
                    }
                    else if(object)
                    {
                        console.log('' + object['_id'] + ' document deleted');
                        res.send(req.body);

                        // sending an event that the board was updated to all registered clients
                        var eventName = 'board_' + object['board']; // todo: make prefix constant
                        io.sockets.emit(eventName, {});
                    }
                    else if(!object)
                    {
                        res.end();
                    }
                }
            );
        });
    }

    db.close();
});






