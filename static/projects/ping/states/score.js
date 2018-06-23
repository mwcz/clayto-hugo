define(["exports", "module", "scores", "conf", "states/state"], function (exports, module, _scores, _conf, _statesState) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var scores = _scores;
    var SCORE_POSITION = _conf.SCORE_POSITION;
    var TEXT_FONT = _conf.TEXT_FONT;
    var TEXT_SIZE = _conf.TEXT_SIZE;

    var state = _interopRequire(_statesState);

    function go_to_title_state() {
        this.state.start("title");
    }

    var score_state = (function (_state) {
        function score_state() {
            _classCallCheck(this, score_state);

            _state.call(this, "score");
        }

        _inherits(score_state, _state);

        score_state.prototype.create = function create(game) {
            this.score_text = game.add.bitmapText(SCORE_POSITION.x, SCORE_POSITION.y, TEXT_FONT, "", TEXT_SIZE);
            var timer = game.time.create(true);
            timer.add(3500, go_to_title_state, game);
            timer.start();
        };

        score_state.prototype.update = function update(game) {
            this.score_text.setText("  " + scores.n + "\n\n" + scores.w + "   " + scores.e + "\n\n  " + scores.s);
        };

        return score_state;
    })(state);

    module.exports = score_state;
});