'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dotter = function () {
    function Dotter() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$density = _ref.density,
            density = _ref$density === undefined ? 0.15 : _ref$density,
            _ref$jitter = _ref.jitter,
            jitter = _ref$jitter === undefined ? 1.0 : _ref$jitter;

        _classCallCheck(this, Dotter);

        this.density = density;
        this.jitter = jitter;
        this.filters = [];
        this.imgCache = {};
        this.dotCache = {};
    }

    _createClass(Dotter, [{
        key: 'process',
        value: function process(src) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this._fetchImage(src).then(function (img) {
                    resolve(_this._processImage(img));
                }).catch(reject);
            });
        }
    }, {
        key: '_fetchImage',
        value: function _fetchImage(src) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                // use cached image if available
                if (_this2.imgCache[src]) {
                    resolve(_this2.imgCache[src]);
                } else if (typeof src === 'string') {
                    var img = new Image();
                    img.addEventListener('load', function (evt) {
                        return resolve(evt.target);
                    });
                    img.addEventListener('error', reject);
                    console.log('[dotter] setting img.src');
                    img.src = src;

                    // cache the image
                    _this2.imgCache[src] = img;
                } else {
                    resolve(src);
                }
            });
        }
    }, {
        key: '_processImage',
        value: function _processImage(image) {
            // use cached dots if available
            if (this.dotCache[image.src]) {
                console.log('[dotter] using cached dots for ' + image.src);
                return this.dotCache[image.src];
            }

            console.log('[dotter] processing dots for ' + image.src);
            var canvas = this._drawCanvas(image);
            var pixels = this._getPixels(canvas);
            var dots = this._sample(canvas, pixels);

            var dotObj = {
                dots: dots,
                original: {
                    image: image,
                    pixels: pixels,
                    canvas: canvas,
                    aspect: canvas.width / canvas.height
                }
            };

            // cache the dots
            this.dotCache[image.src] = dotObj;

            return dotObj;
        }
    }, {
        key: '_drawCanvas',
        value: function _drawCanvas(img) {
            console.log('[dotter] drawing image onto canvas');
            var el = document.createElement('canvas');
            var ctx = el.getContext('2d');
            el.width = img.width;
            el.height = img.height;
            ctx.drawImage(img, 0, 0);

            // call any registered filters on this canvas

            this.filters.forEach(function (filter) {
                return filter({ el: el, ctx: ctx });
            });

            return { el: el, ctx: ctx };
        }
    }, {
        key: '_getPixels',
        value: function _getPixels(canvas) {
            console.log('[dotter] getting pixels from canvas');
            return canvas.ctx.getImageData(0, 0, canvas.el.width, canvas.el.height);
        }
    }, {
        key: '_sample',
        value: function _sample(canvas, pixels) {
            if (this.density <= 0) return [];

            var points = [];

            var w = canvas.el.width;
            var h = canvas.el.height;

            var step = Math.floor(1 / this.density);

            console.log('[dotter] step: ' + step);

            var i = 0;
            var r = 0;
            var g = 0;
            var b = 0;
            var a = 0;

            for (var x = 0; x < w; x += step) {
                for (var y = 0; y < h; y += step) {
                    i = Math.floor((x + y * w) * 4);
                    r = pixels.data[i];
                    g = pixels.data[i + 1];
                    b = pixels.data[i + 2];
                    a = pixels.data[i + 3];

                    // look for black pixels or totally transparent pixels
                    if (r + g + b === 0 && a !== 0) {
                        var xJitter = Math.floor(Math.random() * this.jitter * step);
                        var yJitter = Math.floor(Math.random() * this.jitter * step);
                        points.push((x + xJitter) / w);
                        points.push((y + yJitter) / h);
                    }
                }
            }

            console.log('[dotter] ' + points.length / 2 + ' points found');
            this._drawPoints(canvas, points);
            // document.body.appendChild(canvas.el);
            // canvas.el.style.bottom = '0px';
            // canvas.el.style.right = '0px';
            // canvas.el.style.zIndex = '10000';
            // canvas.el.style.border = '2px solid red';
            // canvas.el.style.width = '400px';
            // canvas.el.style.height = '400px';

            return points;
        }

        // for debugging, draw the found points on a canvas

    }, {
        key: '_drawPoints',
        value: function _drawPoints(canvas, points) {
            canvas.ctx.fillStyle = '#47CD36';

            for (var i = 0; i < points.length; i += 2) {
                var x = points[i];
                var y = points[i + 1];
                canvas.ctx.fillRect(x * canvas.el.width, y * canvas.el.height, 1, 1);
            }
        }
    }, {
        key: 'addFilter',
        value: function addFilter(filterFunc) {
            this.filters.push(filterFunc);
        }
    }]);

    return Dotter;
}();