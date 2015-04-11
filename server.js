#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var io = require('socket.io');
var notes = require('./notes');
var bodyParser = require('body-parser');

/**
 *  Open pinboard
 */
var OpenPinboardApp = function() {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            // self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        //self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };
        self.routes.get = { };
        self.routes.post = { };
        self.routes.delete = { };

        // init post requests
        self.routes.post['/notes'] = function(req, res) {
            notes.addNewNote(req,res,io);
        };

        // init get handlers
        self.routes.get['/notes'] = notes.findAllInBoard;

        // init delete handlers
        self.routes.delete['/notes/:id'] = function(req,res)
        {
            notes.deleteNote(req,res,io);
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        // init static server
        var directory = __dirname + '/public';
        console.log('serving static content from:' + directory);
        self.app.use(express.static(directory,{ maxAge: 86400000 }));
        self.app.use(bodyParser.json());       // to support JSON-encoded bodies
        self.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true
        }));

        //  Add handlers for the app (from the routes).
        for (var r in self.routes.get) {
            self.app.get(r, self.routes.get[r]);
        }
        for (var r in self.routes.post) {
            self.app.post(r, self.routes.post[r]);
        }
        for (var r in self.routes.delete) {
            self.app.delete(r, self.routes.delete[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        // self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        var server = self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });

        // init socket.io
        io.listen(server);
    };

};

/**
 *  main():  Main code.
 */
var opApp = new OpenPinboardApp();
opApp.initialize();
opApp.start();

