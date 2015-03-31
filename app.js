// loading all relevant component
var express = require('express');
var notes = require('./notes');
var bodyParser = require('body-parser');

var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

// setting up express and its middle-ware
var app = express();
var oneDay = 86400000;

//app.use(express.compress());

var directory = __dirname + '\\..\\OpenNoteboard';
console.log('serving static content from:' + directory);
app.use(express.static(directory,{ maxAge: oneDay }));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// initializing the notes rest api requests
//app.all('/notes', notes.options);
app.post('/notes', function(req,res){
    notes.addNewNote(req,res,io);
});
app.get('/notes', notes.findAllInBoard);
app.delete('/notes/:id', function(req,res)
{
    notes.deleteNote(req,res,io);
});

// start serving static content and start socket.io
var server = app.listen(port);
var io = require('socket.io').listen(server);

console.log('serving on port: ' + port);



