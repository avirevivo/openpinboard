define([
    'backbone'
    ],function(Backbone){

    var NoteModel = Backbone.Model.extend({

        defaults: {
            noteText: 'empty',
            by: 'John Doe',
            board: -1,
            _id: null
        },
        idAttribute: '_id',
        urlRoot: '/notes',

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
            else if(methodInLowerCase === 'delete')
            {
                options.url += '/' + model.id;
            }

            Backbone.sync(method, model, options);
        }

    });

    return NoteModel;
});