// loading all relevant component
var express = require('express');
var notes = require('./notes');
var mongo = require('mongodb');
var socket = require('socket.io');
var http = require('http');
var path = require('path');

// setting up express and its middle-ware
var app = express();
var publicContentPath = path.join(__dirname, 'public');
var oneDay = 86400000;
app.configure(function () {
    app.use(express.logger('default'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.compress());
    // serving static content
    //app.use('/', express.static(publicContentPath, { maxAge: oneDay }));
    app.use('/', express.static('..\\OpenNoteboard', { maxAge: oneDay }));
});

// opening for web sockets
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// initializing the notes rest api requests
app.all('/notes', notes.options);
app.post('/notes', function(req,res){
    notes.addNewNote(req,res,io);
});
app.get('/notes', notes.findAllInBoard);
app.delete('/notes/:id', function(req,res)
{
    notes.deleteNote(req,res,io);
});

// starting to listen to http requests
var portToListen = process.env.PORT || 8080;
server.listen(portToListen);

console.log('serving on port: ' + portToListen + ', public folder: ' + publicContentPath);



