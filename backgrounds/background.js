Message.init('background');

Message.listen('popup',function(data){
	Message.to('content',{ mess : 'Hi content!' });
});
