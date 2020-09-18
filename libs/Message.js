Message = (function(){

  const self = { SCRIPT_TYPE : '', VERSION : '1.0'};

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



  function init(self){

    self.SCRIPT_TYPE = (function(){
      if (chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window) {
            return 'background';
        } else if (chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() !== window) {
            return 'popup';
        } else if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) {
            return 'content';
        } else {
            return 'content';
        }
    })();

    console.log(`Init Messaging - Chrome Extension (v${self.VERSION}) - "${self.SCRIPT_TYPE}" successfully !`);
  }

  init(self);


  return {
    
    SCRIPT_TYPE : self.SCRIPT_TYPE,
    
    VERSION : self.VERSION,

    listen : function(SCRIPT_TYPE,callback){
      self[self.SCRIPT_TYPE].listen[SCRIPT_TYPE](callback);
    },

    to : function(SCRIPT_TYPE,data2send){
      self[self.SCRIPT_TYPE].to[SCRIPT_TYPE](data2send);
    }

  }

})();
