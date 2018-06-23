'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.messageLog = [];
window.log = true;
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

var Network = function () {
    function Network(HOST, RECONNECT_TIMEOUT) {
        _classCallCheck(this, Network);

        this.OP_CONF = 0;
        this.OP_COLOR = 1;
        this.HOST = HOST;

        this.confHandler = function () {};
        this.colorHandler = function () {};
        this.errorHandler = function () {};
    }

    _createClass(Network, [{
        key: 'init',
        value: function init() {
            this.handleConnecting();
            try {
                this.ws = new ReconnectingWebSocket(this.HOST, null, {
                    // debug: true,
                    binaryType: 'arraybuffer',
                    reconnectDecay: 1
                });

                this.ws.onopen = this.openHandler.bind(this);
                this.ws.onclose = this.closeHandler.bind(this);
                this.ws.onmessage = this.messageHandler.bind(this);
                this.ws.onerror = this.errorHandler.bind(this);
            } catch (e) {
                this.errorHandler(e);
            }
        }
    }, {
        key: 'openHandler',
        value: function openHandler(fn) {
            console.log("WebSocket connection established and ready.");
        }
    }, {
        key: 'closeHandler',
        value: function closeHandler(fn) {}
    }, {
        key: 'messageHandler',
        value: function messageHandler(msg) {
            if (window.log) window.messageLog.push(_arrayBufferToBase64(msg.data));
            var opcode = new DataView(msg.data).getInt16(0);
            switch (opcode) {
                case this.OP_CONF:
                    console.log('configuration received');
                    this.handleConf(new Int16Array(msg.data, 2));
                    break;
                case this.OP_COLOR:
                    this.handleColor(new Uint8Array(msg.data, 2));
                    break;
                default:
                    console.warn('unrecognized opcode: ' + opcode);
            }
        }
    }, {
        key: 'onConnecting',
        value: function onConnecting(fn) {
            this.connectingHandler = fn;
        }
    }, {
        key: 'onError',
        value: function onError(fn) {
            this.errorHandler = fn;
        }
    }, {
        key: 'onConf',
        value: function onConf(fn) {
            this.confHandler = fn;
        }
    }, {
        key: 'onColor',
        value: function onColor(fn) {
            this.colorHandler = fn;
        }
    }, {
        key: 'handleConnecting',
        value: function handleConnecting() {
            this.connectingHandler();
        }
    }, {
        key: 'handleError',
        value: function handleError(err) {
            this.errorHandler(err);
        }
    }, {
        key: 'handleConf',
        value: function handleConf(confMsg) {
            // const confMsg = mockConfMsg();
            this.confHandler(confMsg);
        }
    }, {
        key: 'handleColor',
        value: function handleColor(colorMsg) {
            // const colorMsg = mockColorMsg();
            this.colorHandler(colorMsg);
        }
    }]);

    return Network;
}();