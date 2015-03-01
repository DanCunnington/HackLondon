//create faye client
var faye_client = new Faye.Client('http://localhost:8000/faye');

faye_client.subscribe('/replyReceived', function(message)
{   
    //record the time message was received
    var receiveTime_secSinceEpoch = new Date().getTime() / 1000;

    console.log(message.twilioResponse.Body);
});