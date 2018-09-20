'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
    function Network(HOST, RECONNECT_TIMEOUT) {
        _classCallCheck(this, Network);

        this.OP_CONF = 0;
        this.OP_COLOR = 1;
        this.HOST = HOST;

        this.connectingHandler = function () {};
        this.confHandler = function () {};
        this.colorHandler = function () {};
        this.errorHandler = function () {};

        this.recording = undefined;
        this.messageIndex = 0;
    }

    _createClass(Network, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.handleConnecting();

            fetch('/static/projects/simpixel/recordings/vis.json').then(function (rsp) {
                return rsp.json();
            }).then(function (json) {
                _this.recording = json.map(_this.base64ToArrayBuffer);
                _this.openHandler();
            }).catch(this.errorHandler);
        }
    }, {
        key: 'openHandler',
        value: function openHandler(fn) {
            console.log("Recording downloaded and ready.");
            this.nextMessageLoop();
        }
    }, {
        key: 'closeHandler',
        value: function closeHandler(fn) {}
    }, {
        key: 'nextMessageLoop',
        value: function nextMessageLoop() {
            requestAnimationFrame(this.nextMessageLoop.bind(this));

            this.messageHandler(this.recording[this.messageIndex]);

            this.messageIndex += 1;
            this.messageIndex %= this.recording.length;

            // only let the configuration frame run once
            if (this.messageIndex === 0) {
                this.messageIndex = 1;
            }
        }
    }, {
        key: 'messageHandler',
        value: function messageHandler(data) {
            if (window.log) window.messageLog.push(_arrayBufferToBase64(data));
            var opcode = new DataView(data).getInt16(0);
            switch (opcode) {
                case this.OP_CONF:
                    console.log('configuration received');
                    this.handleConf(new Int16Array(data, 2));
                    break;
                case this.OP_COLOR:
                    this.handleColor(new Uint8Array(data, 2));
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
        // used to convert recordings from base64 strings back into arraybuffers

    }, {
        key: 'base64ToArrayBuffer',
        value: function base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
    }]);

    return Network;
}();
