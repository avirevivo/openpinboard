define(
    ['backbone', 'underscore', '../utilities', 'jquery.confirm'],
    function(Backbone, _, Utils) {

        var NoteView = Backbone.View.extend({

            tagName:  'div',

            template: _.template($('#note-template').html()),

            initialize: function() {
                this.listenTo(this.model, 'destroy', this.remove);
                this.listenTo(this.model, 'remove', this.remove);
            },

            render: function()
            {
                var noteJSON = this.model.toJSON();
                noteJSON['noteText'] =  Utils.replaceURLWithHTMLLinks(noteJSON['noteText']);

                this.$el.html( this.template( noteJSON ));

                var self = this;

                this.$('.note-delete-button').click(function(){

                    $.confirm({
                        'title'		: 'Delete Confirmation',
                        'message'	: 'You are about to delete the following note - <br /><br /><span style="font-style: italic">"' + noteJSON['noteText'] + '"</span><br /><br />It cannot be restored at a later time! Continue?',
                        'buttons'	: {
                            'Yes'	: {
                                'class'	: 'blue',
                                'action': function(){
                                    self.clear();
                                }
                            },
                            'No'	: {
                                'class'	: 'gray',
                                'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
                            }
                        }
                    });

                });

                return this;
            },

            clear: function()
            {
                this.model.destroy();
            }
        });

        return NoteView;
    }
);
