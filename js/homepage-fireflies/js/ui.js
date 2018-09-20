'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = function () {
    function UI(images) {
        _classCallCheck(this, UI);

        this.init(images);
    }

    _createClass(UI, [{
        key: 'init',
        value: function init(images) {
            var _this = this;

            this.toggleText = ['Show menu', 'Hide menu'];
            this.playPause = ['&#9654;', '&nbsp;&#9612; &#9612;'];

            this.playTimeouts = [];

            this.engine = new Ractive({
                // The `el` option can be a node, an ID, or a CSS selector.
                el: '#container',

                // We could pass in a string, but for the sake of convenience
                // we're passing the ID of the <script> tag above.
                template: '#template',

                // Here, we're passing in some initial data
                data: {
                    name: 'world',
                    activeImage: 0,
                    images: images,
                    toggleText: this.toggleText[1],
                    show: true,
                    playText: this.playPause[1]
                }
            });

            this.engine.on('setImage', function (img) {
                _this.engine.set('activeImage', _this.engine.get('images').indexOf(_this._getRelativeSrc(img)));
            });

            this.engine.on('setImageButton', function (img) {
                _this.stopRotate();
                _this.setImage(img);
            });

            this.engine.on('toggle', function () {
                _this.engine.set('show', !_this.engine.get('show'));
                _this.engine.set('toggleText', _this.toggleText[~~_this.engine.get('show')]);
            });

            this.engine.on('togglePlay', function () {
                _this.playTimeouts.forEach(clearTimeout);
                _this.playTimeouts = [];
                _this.engine.set('playText', _this.playPause[~~!_this.engine.get('rotating')]);
                if (_this.engine.get('rotating')) {
                    _this.stopRotate();
                } else {
                    _this.engine.set('rotating', true);
                    var tid = setTimeout(function () {
                        _this.setImageByIndex(_this.engine.get('activeImage') + 1);
                        _this.startRotate();
                    }, 800);
                    _this.playTimeouts.push(tid);
                }
            });
        }
    }, {
        key: 'setImage',
        value: function setImage(img) {
            this.engine.fire('setImage', img);
        }
    }, {
        key: '_getRelativeSrc',
        value: function _getRelativeSrc(img) {
            var path = void 0;
            if (img.node) {
                path = img.node.src;
            } else {
                path = img;
            }
            console.log('[ui] ' + path.replace(location.href, ''));
            return path.replace(location.href, '');
        }
    }, {
        key: 'onSetImage',
        value: function onSetImage(f) {
            var _this2 = this;

            this.engine.on('setImage', function (evt) {
                f(_this2._getRelativeSrc(evt));
            });
        }
    }, {
        key: 'onToggleFlee',
        value: function onToggleFlee(f) {
            this.engine.on('toggleFlee', f);
        }
    }, {
        key: 'setImageByIndex',
        value: function setImageByIndex(index) {
            var imageCount = this.engine.get('images').length;
            if (index === -1) {
                index = imageCount - 1;
            }
            var newIndex = index % imageCount;
            var newImage = this.engine.get('images')[newIndex];
            this.engine.set('activeImage', newIndex);
            this.setImage(newImage);
        }
    }, {
        key: 'startRotate',
        value: function startRotate() {
            var _this3 = this;

            var INTERVAL = 6900;

            this._intervalId = setInterval(function () {
                _this3.setImageByIndex(_this3.engine.get('activeImage') + 1);
            }, INTERVAL);

            this.engine.set('playText', this.playPause[1]);
            this.engine.set('rotating', true);
        }
    }, {
        key: 'stopRotate',
        value: function stopRotate() {
            clearInterval(this._intervalId);
            this.engine.set('playText', this.playPause[0]);
            this.engine.set('rotating', false);
        }
    }, {
        key: 'addImage',
        value: function addImage(img) {
            var images = this.engine.get('images');
            var index = images.indexOf(img);
            if (index === -1) {
                images.push(img);
                this.engine.set('images', images);
                index = images.length - 1;
            }
            return index;
        }
    }]);

    return UI;
}();