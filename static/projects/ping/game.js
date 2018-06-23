define(["exports", "Phaser", "viewport", "conf", "states/play", "states/title", "states/preload", "states/score"], function (exports, _Phaser, _viewport, _conf, _statesPlay, _statesTitle, _statesPreload, _statesScore) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    exports.__esModule = true;

    var Phaser = _interopRequire(_Phaser);

    var viewport = _viewport;
    var conf = _conf;

    var play_state = _interopRequire(_statesPlay);

    var title_state = _interopRequire(_statesTitle);

    var preload_state = _interopRequire(_statesPreload);

    var score_state = _interopRequire(_statesScore);

    function init() {
        var game = new Phaser.Game(viewport.WIDTH, viewport.HEIGHT, Phaser.WEBGL, conf.NAME);
        // game.state.add('boot');
        game.state.add("preload", preload_state);
        game.state.add("title", title_state);
        game.state.add("play", play_state);
        game.state.add("score", score_state);
        game.state.start("preload");
    }

    exports.init = init;
});