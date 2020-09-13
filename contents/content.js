Message.init('content');

Message.listen('background',function(data){
	alert('background : ' + data.mess)
});
