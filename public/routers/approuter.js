/*
define([
    'backbone', '../views/notesview', '../collections/notes'],
    function(Backbone, NotesView, Notes)
{
    // Router
    var AppRouter = Backbone.Router.extend({

        routes:{
            "board/:id":"viewBoard"
        },

        initialize:function () {

        },

        viewBoard:function (id) {

            app_params.boardId = id;
            var notesView = new NotesView();
            $('#notes-app').html(notesView.render().el);
        }

    });

    return new AppRouter;
});*/
