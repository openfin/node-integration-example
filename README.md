# node-integration-example

This is a simple example that shows NodeJS to OpenFin integration. We co-deploy a NodeJS service with our OpenFin application (see the [app.json](public/app,json) file for specifics) and use the Inter Application Bus on both side to demonstrate connectivity.

## Running the example

`npm install && npm start`

## What is happening ?
On an `npm start` command the "node-service" folder will be zipped up and moved to the public folder, simulating a remote web server `grunt:connect` will serve the public folder and the OpenFin `grunt:openfin` plugin will launch the node-integration-example application from public/app.json. see the [Gruntfile](Gruntfile.js) for specifics.

On a successfull launch, the contents of the "node-service" folder will be deployed onto OpenFin and launched by `main.js`: 

```javascript
fin.desktop.System.launchExternalProcess({
    alias: nodeServiceAlias,
    arguments: 'index.js --port ' + port,
    lifetime: 'window'
}, payload => resolve(payload)
, (reason, error) => reject(error));
``` 

## Inter Application bus

Both the NodeJS service and the OpenFin application publish/subscribe to messages over the Inter Application Bus: 

#### NodeJS side: [index.js](node-service/index.js)
```javascript
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
```

#### OpenFin side: [main.js](public/main.js)
```javascript
fin.desktop.InterApplicationBus.subscribe(serviceUuid, toWebTopic, function(msg, uuid) {
    messageCtrl.innerText = `Received ${msg.data} from ${uuid}`;
    timeStampCtrl.innerText = new Date(msg.timeStamp).toLocaleTimeString();
});

setInterval(() => {
    fin.desktop.InterApplicationBus.send(serviceUuid, toServiceTopic, {
        data: 'Hello Service',
        timeStamp: Date.now()
    });
}, 1000);
```
