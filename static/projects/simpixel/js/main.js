'use strict';

if (!Detector.webgl) Detector.addGetWebGLMessage();

var view = new View('#simpixel-container');
var network = new Network(bpHost(), 1000);
var netStatusDisplay = document.querySelector('#connection');

// network.onConnecting( () => netStatusDisplay.innerHTML = 'Connecting...' );
// network.onError( err => {
//     netStatusDisplay.innerHTML =
//         `Could not connect: ` +
//         network.HOST +
//         '<br\>Trying to reconnect...';
// });
network.onConf(function (conf) {
    view.init(conf);
    netStatusDisplay.innerHTML = '';
});
network.onColor(view.update.bind(view));
network.init();

addHostButton(function () {
    bpHost(true);
    location.reload();
});