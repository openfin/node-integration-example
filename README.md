# OpenFin Node Integration Example

## Quick Start
```javascript
$   npm install
$   npm start
```

This project consists of 2 parts:

1. An OpenFin application
2. A Node service application (for process launching & interapp communication)

## About This Application

1. Running `npm start` will launch the OpenFin app locally on localhost:5000
2. The OpenFin app calls `fin.desktop.System.launchExternalProcess` to launch the Node app
3. Messages from the service app are relayed via the [InterApplicationBus](http://cdn.openfin.co/jsdocs/stable/fin.desktop.module_InterApplicationBus.html)

#### Note
As this version of node is shipped as an .exe, this example is Windows only.