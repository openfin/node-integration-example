const connect = require('js-adapter').connect;

//We get the OpenFin port as a argument.
const port = process.argv[process.argv.indexOf('--port') + 1];
//Incomming message topic.
const toServiceTopic = 'to-service-topic';
//Outgoing message topic.
const toWebTopic = 'to-web-topic';
//The identity of the Web Application.
const webAppIdentity = {
    uuid: 'node-integration-example-web'
};

//Connect to the OpenFin runtime.
connect({
    address: `ws://localhost:${port}`,
    uuid: 'node-integration-example-service'
}).then(fin => {
    console.log('I am now connected to OpenFin.');
    //use the inter application bus.
    fin.InterApplicationBus.subscribe(webAppIdentity, toServiceTopic, (msg, senderIdentity) => {
        console.log(`Received ${msg.data}
            from ${senderIdentity.uuid}, ${senderIdentity.name}
            at: ${new Date(msg.timeStamp).toLocaleTimeString()}`);
    }).then(console.log('I am now subscribed'))
    .catch(err => console.log(err));

    //We just want to send messages at an interval
    setInterval(() => {
        fin.InterApplicationBus.send(webAppIdentity, toWebTopic, {
            data: 'Hello web',
            timeStamp: Date.now()
        });
    }, 1000);
}).catch(err => console.log(err));