define(
    ['backbone','../models/note'],
    function(Backbone, NoteModel){

        var NotesCollection = Backbone.Collection.extend({

            model: NoteModel,
            url: '/notes',
            idAttribute: "_id",

            methodToURL: {
                'read': '/notes?board=',
                'create': '/notes',
                'update': '/notes',
                'delete': '/notes'
            },

            sync: function(method, model, options) {
                options = options || {};
                var methodInLowerCase = method.toLowerCase();
                options.url = model.methodToURL[methodInLowerCase];

                if(methodInLowerCase === 'read')
                {
                    options.url += app_params.boardId;
                }

                Backbone.sync(method, model, options);
            }

        });

        return new NotesCollection();
});

