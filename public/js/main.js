//Incomming message topic.
const toWebTopic = 'to-web-topic';
//OutGoing message topic.
const toServiceTopic = 'to-service-topic';
//The identity of the Node Service.
const serviceUuid = 'node-integration-example-service';

document.addEventListener('DOMContentLoaded', function() {
    const messageCtrl = document.querySelector('#message');
    const timeStampCtrl = document.querySelector('#time');

    fin.desktop.InterApplicationBus.subscribe(serviceUuid, toWebTopic, function(msg, uuid) {
        messageCtrl.innerText = `Received ${msg.data} from ${uuid}`;
        timeStampCtrl.innerText = new Date(msg.timeStamp).toLocaleTimeString();
    });

    fin.desktop.System.launchExternalProcess({
        alias: 'node-service',
        arguments: 'index.js --port 9696',
        lifetime: 'window',
        listener: function (result) {
            console.log('the exit code', result.exitCode);
        }
    }, function (payload) {
        console.log('Success:', payload.uuid);
    }, function (reason, error) {
        console.log('Error:', error);
    });

    //We just want to send messages at an interval
    setInterval(() => {
        console.log('I am here bro');
        fin.desktop.InterApplicationBus.send(serviceUuid, toServiceTopic, {
            data: 'Hello Service',
            timeStamp: Date.now()
        });
    }, 1000);
});
