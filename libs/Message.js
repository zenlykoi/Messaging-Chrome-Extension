Message = (function(){

    const self = this;
    self.extension = '';

    self['content'] = {
        to : {
            background : function(data2send){
                chrome.runtime.sendMessage({
                    command : 'Message',
                    from : 'content',
                    to : 'background',
                    data : data2send
                });
            },
            popup : function(data2send){
                chrome.runtime.sendMessage({
                    command : 'Message',
                    from : 'content',
                    to : 'popup',
                    data : data2send
                });
            }
        },
        listen : {
            background : function(callback){
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.command == 'Message' && request.to == 'content' && request.from == 'background')
                        callback(request.data);
                });
            },
            popup : function(callback){
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.command == 'Message' && request.to == 'content' && request.from == 'popup')
                        callback(request.data);
                });
            }
        }
    }

    self['popup'] = {
        to : {
            background : function(data2send){
                chrome.runtime.sendMessage({
                    command : 'Message',
                    from : 'popup',
                    to : 'background',
                    data : data2send
                });
            },
            content : function(data2send){
                chrome.tabs.query({active: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id,{
                        command : 'Message',
                        from : 'popup',
                        to : 'content',
                        data : data2send
                    });
                });
            }
        },
        listen : {
            background : function(callback){
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.command == 'Message' && request.to == 'popup' && request.from == 'background')
                        callback(request.data);
                });
            },
            content : function(callback){
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.command == 'Message' && request.to == 'popup' && request.from == 'content')
                        callback(request.data);
                });
            }
        }
    }

    self['background'] = {
        to : {
            popup : function(data2send){
                chrome.runtime.sendMessage({
                    command : 'Message',
                    from : 'background',
                    to : 'popup',
                    data : data2send
                });
            },
            content : function(data2send){
                chrome.tabs.query({active: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id,{
                        command : 'Message',
                        from : 'background',
                        to : 'content',
                        data : data2send
                    });
                });
            }
        },
        listen : {
            popup : function(callback){
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.command == 'Message' && request.to == 'background' && request.from == 'popup')
                        callback(request.data);
                });
            },
            content : function(callback){
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if(request.command == 'Message' && request.to == 'background' && request.from == 'content')
                        callback(request.data);
                });
            }
        }
    }

    return {
        init : function(extension){
            self.extension = extension;
            console.log(`Init Messaging-Chrome-Extension - "${extension}" successfully !`);
        },
        listen : function(extension,callback){
            self[self.extension].listen[extension](callback);
        },
        to : function(extension,data2send){
            self[self.extension].to[extension](data2send);
        }
    }

})();
