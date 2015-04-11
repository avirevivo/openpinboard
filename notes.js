var mongojs = require('mongojs');
var url = require('url');

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

var db = mongojs(connection_string, ['notes']);
var notes = db.collection('notes');

//exports.options = function(req,res,next)
//{
//    if(req.route.method == "options")
//    {
//        console.log('!OPTIONS');
//        var headers = {};
//        // the below allows cross site scripting
//        // IE8 does not allow domains to be specified, just the *
//        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
//        // headers["Access-Control-Allow-Origin"] = "*";
//        // headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
//        // headers["Access-Control-Allow-Credentials"] = false;
//        // headers["Access-Control-Max-Age"] = '86400'; // 24 hours
//        // headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
//        res.writeHead(200, headers);
//        res.end();
//    }
//
//    next(); // allow to route for POST, GET and others
//}

exports.addNewNote = function(req, res, io)
{
    var note = req.body;

    console.log('Adding note: ' + JSON.stringify(note));

    db.notes.save(note);

    // sending an event that the board was updated to all registered clients
    var eventName = 'board_'+note['board']; // todo: make prefix constant
    console.log('emiting event: ' + eventName);
    io.sockets.emit(eventName, {});

    res.end();
};

exports.findAllInBoard = function(req, res)
{
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if(query['board'])
    {
        db.notes.find({
            board: query['board']
        }).toArray(function(err, docs) {
                res.send(docs);
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

    var o_id = db.ObjectId(req.params.id);

    console.log('Attempting to delete note: ' + o_id);

    // delete a specific thing.
    db.notes.findAndModify({query: {_id: o_id}, remove:true}, function(err, object, lastErrorObject)
        {
            if (err)
            {
                console.log('An error has occurred - err=' + err + ', lastErrorObject=' + lastErrorObject);
            }
            else if(object)
            {
                console.log('' + object['_id'] + ' document deleted');

                // sending an event that the board was updated to all registered clients
                var eventName = 'board_' + object['board']; // todo: make prefix constant
                io.sockets.emit(eventName, {});
            }

            res.end();
        }
    );
}
