define([
    'backbone',
    'underscore',
    '../collections/notes',
    '../models/note'
], function(Backbone, _, Notes, Note) {

    var AddNoteView = Backbone.View.extend({

        template: _.template($('#add-note-template').html()),

        events: {
          'click .add-note-button': 'addNote',
          'keypress #add-note-text': 'addNoteOnEnter',
          'keypress #by-text': 'addNoteOnEnter'
        },

        initialize: function()
        {
        },

        render: function()
        {
            this.$el.html(this.template({}));

            return this;
        },

        addNote: function()
        {
            var $input = this.$('#add-note-text');
            var noteText = $input.val();

            if(noteText)
            {
                // create note "by" text
                var $by = this.$('#by-text');
                var by = $by.val();
                if(by){
                    by = 'by&nbsp;' + by;
                }

                // create note in collection
                var noteToCreate = { noteText: noteText,
                                     by: by,
                                     board: app_params.boardId };
                Notes.create(noteToCreate);

                // clear note fields
                $input.val('');
            }

            // put focus on main input
            this.focusOnInput();
        },

        addNoteOnEnter: function (e) {
            if (e.which !== app_params.ENTER_KEY || !this.$('#add-note-text').val().trim()) {
                return;
            }

            this.addNote();
        },

        focusOnInput: function()
        {
            this.$('#add-note-text').focus();
        }
    });

    return AddNoteView;

});