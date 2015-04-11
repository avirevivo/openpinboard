define([
    'backbone',
    'underscore',
    '../views/noteview',
    '../collections/notes',
    '../views/addnoteview',
    'jquery-masonry'
], function(Backbone, _,NoteView, Notes, AddNoteView) {

        var NotesView = Backbone.View.extend({

            template: _.template($('#app-template').html()),

            initialize: function() {
                this.listenTo(Notes, 'add', this.addNote);
                this.listenTo(Notes, 'remove', this.removeNote);
            },

            render: function() {
                this.$el.html(this.template({}));

                var addNoteView = new AddNoteView({});
                this.$('#add-note').html(addNoteView.render().el);
                addNoteView.focusOnInput();

                var self = this;
                $(function(){
                    self.$('#notes-list').masonry({
                        // options
                        itemSelector : '.note',
                        isAnimated: true
                    });
                });

                return this;
            },

            addNote: function(note)
            {
                var noteView = new NoteView({ model: note });
                var $content = $(noteView.render().el);
                this.$('#notes-list').prepend($content).masonry('reload');
            },

            removeNote: function(note)
            {
                this.$('#notes-list').masonry('reload');
            }


        });

       return NotesView;
});