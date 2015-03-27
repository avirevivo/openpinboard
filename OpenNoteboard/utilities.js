define(
{
    loadPageVar: function (name)
    {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    replaceURLWithHTMLLinks: function (text) {
        if (text) {
            text = text.replace(
                /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
                function(url){
                    var full_url = url;
                    if (!full_url.match('^https?:\/\/')) {
                        full_url = 'http://' + full_url;
                    }
                    return '<a target="_blank" href="' + full_url + '">Link</a>';
                }
            );
        }
        return text;

//        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
//        var regex = new RegExp(expression);
//        var split = x.split(" ");
//        for(var i=0; i< split.length; i++){
//            if(split[i].match(regex)){
//                var text = split[i].split(".").slice(1).join(".").split("/")[0];
//
//                split[i] = '<a target="_blank" href=\"' +split[i].replace(/(^,)|(,$)/g, '')+'\">'+text+'</a>';
//            }
//        }
//        return split.join(" ");
    }
});
