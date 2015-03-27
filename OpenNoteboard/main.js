require.config({
    paths: {
        'backbone' : './libs/backbone-min',
        'underscore' : './libs/underscore-min',
        'jquery-1.9.1' : './libs/jquery-1.9.1.min',
        'jquery-masonry' : './libs/jquery.masonry.min',
        'sockets.io' : './libs/socket.io.min',
        'jquery.confirm' : './libs/jquery.confirm/jquery.confirm'
    },

    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["underscore", "jquery-1.9.1"],
            exports: "Backbone"
        },
        "jquery-masonry": {
            deps: ['jquery-1.9.1']
        },
        "jquery.confirm" :
        {
            deps: ['jquery-1.9.1']
        }
    }
});

var app_params = app_params || {}; // creating namespace to store global configuration parameters

require(['models/note', 'collections/notes', 'views/notesview', 'backbone', 'utilities', 'sockets'],
    function (NoteModel, Notes, NotesView, Backbone, Utils, Sockets)
    {

        // setting global configuration
        app_params.boardId = Utils.loadPageVar("id"); // checking the page id
        app_params.ENTER_KEY = 13; // enter key
        app_params.boardEventName = 'board_' + app_params.boardId;
        app_params.ioSocketsUrl = '/';

        // creating the view
        var notesView = new NotesView();
        $('#notes-app').html(notesView.render().el);

        // listening to update event on the model
        $.ajaxSetup({ cache: false }); // disabling cache
        Sockets.listenToBoardUpdatedEvent(app_params.boardEventName);

        // initializing the model from the server
        Notes.fetch();
    }
);
