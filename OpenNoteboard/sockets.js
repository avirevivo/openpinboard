define(['collections/notes', 'sockets.io'], function(Notes)
{
    var instance = null;

    function MySingleton(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        }

        this.initialize();
    }
    MySingleton.prototype = {
        initialize: function(){
            this.server = io.connect('/');
        },
        listenToBoardUpdatedEvent: function(eventName)
        {
            this.server.on(eventName, function () {
                Notes.fetch();
            });
        }
    };
    MySingleton.getInstance = function(){
        // summary:
        //      Gets an instance of the singleton. It is better to use
        if(instance === null){
            instance = new MySingleton();
        }
        return instance;
    };

    return MySingleton.getInstance();
});