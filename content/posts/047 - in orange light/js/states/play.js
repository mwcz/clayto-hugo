'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayState = function (_Phaser$State) {
    _inherits(PlayState, _Phaser$State);

    function PlayState() {
        _classCallCheck(this, PlayState);

        return _possibleConstructorReturn(this, (PlayState.__proto__ || Object.getPrototypeOf(PlayState)).apply(this, arguments));
    }

    _createClass(PlayState, [{
        key: 'create',
        value: function create() {
            console.log('[play] starting play state');

            // for easy access to this state for debugging in browser console
            window.state = this;

            this.drawInitialScene();
        }
    }, {
        key: 'update',
        value: function update() {}
    }, {
        key: 'render',
        value: function render() {
            // this.game.debug.body(this.actors.earth);
            // this.game.debug.body(this.actors.barrier);
            // this.actors.asteroids.forEach(this.game.debug.body.bind(this.game.debug));
            // this.actors.comets.forEach(this.game.debug.body.bind(this.game.debug));
            // this.actors.booms.forEach(this.game.debug.body.bind(this.game.debug));
        }
    }, {
        key: 'drawInitialScene',
        value: function drawInitialScene() {
            var _this2 = this;

            this.sprites = {};

            var y = 0;

            this.sprites.sky = this.game.add.sprite(0, y, 'sky');
            this.sprites.sky2 = this.game.add.sprite(0, y, 'sky');
            this.sprites.mountain4 = this.game.add.sprite(0, y, 'mountain4');
            this.sprites.mountain3 = this.game.add.sprite(0, y, 'mountain3');
            this.sprites.mountain2 = this.game.add.sprite(0, y, 'mountain2');
            this.sprites.mountain1 = this.game.add.sprite(0, y, 'mountain1');

            // animate the sky
            this.sprites.sky2.position.y = this.sprites.sky2.height + this.sprites.sky2.position.y;
            var skyTween = this.game.add.tween(this.sprites.sky);
            skyTween.to({ y: -this.sprites.sky.height }, 4 * Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true, 0, -1);
            var sky2Tween = this.game.add.tween(this.sprites.sky2);
            sky2Tween.to({ y: y }, 4 * Phaser.Timer.SECOND, Phaser.Easing.Linear.None, true, 0, -1);

            ['mountain1', 'mountain2', 'mountain3', 'mountain4'].forEach(function (num) {
                var sprite = _this2.sprites[num];
                sprite.blendMode = Phaser.blendModes.MULTIPLY;
            });
        }
    }]);

    return PlayState;
}(Phaser.State);