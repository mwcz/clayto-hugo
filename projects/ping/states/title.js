define(["exports", "module", "conf", "states/state"], function (exports, module, _conf, _statesState) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var conf = _conf;

    var state = _interopRequire(_statesState);

    function go_to_play_state() {
        this.state.start("play");
    }

    var title_state = (function (_state) {
        function title_state() {
            _classCallCheck(this, title_state);

            _state.call(this, "title");
        }

        _inherits(title_state, _state);

        title_state.prototype.create = function create(game) {
            this.title_text = game.add.bitmapText(conf.TITLE_POSITION.x, conf.TITLE_POSITION.y, conf.TEXT_FONT, "", conf.TEXT_SIZE);
            var timer = game.time.create(true);
            timer.add(200, go_to_play_state, game);
            timer.start();
        };

        title_state.prototype.update = function update(game) {
            this.title_text.setText("PING\n  LABS");
            //let timer = game.time.create(true);
            //timer.add(conf.TITLE_FADE_IN,
        };

        return title_state;
    })(state);

    module.exports = title_state;
});