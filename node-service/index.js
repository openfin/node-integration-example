const connect = require('js-adapter').connect;

//get the OpenFin port as a argument.
const port = process.argv[process.argv.indexOf('--port') + 1];
//incomming message topic.
const toServiceTopic = 'to-service-topic';
//Outgoing message topic.
const toWebTopic = 'to-web-topic';
//The identity of the Web Application.
const webAppIdentity = {
    uuid: 'node-integration-example-web'
};
//conection options
const connectionOptions = {
    address: `ws://localhost:${port}`,
    uuid: 'node-integration-example-service',
    nonPersistant: true
};

//connect to the OpenFin runtime.
connect(connectionOptions).then(fin => {

    //use the inter application bus.
    fin.InterApplicationBus.subscribe(webAppIdentity, toServiceTopic, (msg, senderIdentity) => {
        console.log(`Received ${msg.data}
            from ${senderIdentity.uuid}, ${senderIdentity.name}
            at: ${new Date(msg.timeStamp).toLocaleTimeString()}`);
    }).catch(err => console.log(err));

    //send messages every second.
    setInterval(() => {
        fin.InterApplicationBus.send(webAppIdentity, toWebTopic, {
            data: 'Hello web',
            timeStamp: Date.now()
        });
    }, 1000);
}).catch(err => console.log(err));