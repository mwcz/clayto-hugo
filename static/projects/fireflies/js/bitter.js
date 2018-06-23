'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bitter = function () {
    function Bitter() {
        _classCallCheck(this, Bitter);
    }

    _createClass(Bitter, null, [{
        key: 'scale',
        value: function scale(_ref) {
            var el = _ref.el,
                ctx = _ref.ctx;

            var TOTAL_PIXELS = 4e5;
            var ASPECT = el.width / el.height;
            var NEW_WIDTH = Math.sqrt(TOTAL_PIXELS * ASPECT);
            var NEW_HEIGHT = NEW_WIDTH / ASPECT;
            var img = document.createElement('img');
            img.src = el.toDataURL();
            // el.width = NEW_WIDTH; // this causes the canvas to go blank in firefox
            // el.height = NEW_HEIGHT; // this causes the canvas to go blank in firefox
            // ctx.scale(NEW_WIDTH / el.width, NEW_HEIGHT / el.height); // not sure if this works
            console.log('[bitter] resized image to ' + NEW_WIDTH + ' x ' + NEW_HEIGHT);
            ctx.drawImage(img, 0, 0, NEW_WIDTH, NEW_HEIGHT);
        }
    }, {
        key: 'threshold',
        value: function threshold(_ref2) {
            var el = _ref2.el,
                ctx = _ref2.ctx;

            var THRESHOLD = 129;
            var imagedata = ctx.getImageData(0, 0, el.width, el.height);
            var data = imagedata.data;
            for (var i = data.length - 1; i >= 0; i -= 4) {
                var b = Math.max(data[i - 3], data[i - 2], data[i - 1]);
                data[i - 3] = data[i - 2] = data[i - 1] = b >= THRESHOLD ? 255 : 0;
            }
            console.log('[bitter] thresholded image to black and white');
            ctx.putImageData(imagedata, 0, 0);
        }
    }]);

    return Bitter;
}();