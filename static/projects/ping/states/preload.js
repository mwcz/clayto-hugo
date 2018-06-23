define(["exports", "module", "states/state", "sounds", "input"], function (exports, module, _statesState, _sounds, _input) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var state = _interopRequire(_statesState);

    var SOUNDS = _interopRequire(_sounds);

    var input = _interopRequire(_input);

    var preload_state = (function (_state) {
        function preload_state() {
            _classCallCheck(this, preload_state);

            _state.call(this, "preload");
        }

        _inherits(preload_state, _state);

        preload_state.prototype.preload = function preload(game) {
            window.game = game;
            game.load.image("puck", "assets/sprites/puck.png");
            game.load.image("paddle", "assets/sprites/paddle.png");
            game.load.image("paddle-red", "assets/sprites/paddle-red.png");
            game.load.image("paddle-green", "assets/sprites/paddle-green.png");
            game.load.image("paddle-blue", "assets/sprites/paddle-blue.png");
            game.load.image("paddle-yellow", "assets/sprites/paddle-yellow.png");
            game.load.audio("puck-hit-paddle", "assets/sounds/puck-hit-paddle.ogg");
            game.load.audio("puck-oob", "assets/sounds/puck-oob.mp3");
            game.load.bitmapFont("carrier_command", "assets/fonts/carrier_command.png", "assets/fonts/carrier_command.xml");
        };

        preload_state.prototype.create = function create(game) {

            // init sounds
            SOUNDS.PUCK_HIT_PADDLE = game.add.audio("puck-hit-paddle");
            SOUNDS.PUCK_HIT_PADDLE.allowMultiple = true;
            SOUNDS.PUCK_OOB = game.add.audio("puck-oob");

            // init gamepads
            input.init(game);

            game.state.start("title");
        };

        return preload_state;
    })(state);

    module.exports = preload_state;
});