define(["exports", "paperclip", "text!templates/scorecards.html", "leaderboard", "conf", "input", "lodash", "player-state-checkers"], function (exports, _paperclip, _textTemplatesScorecardsHtml, _leaderboard, _conf, _input, _lodash, _playerStateCheckers) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    exports.__esModule = true;
    var pc = _paperclip;
    var scorecard_template = _textTemplatesScorecardsHtml;

    var leaderboard = _interopRequire(_leaderboard);

    var conf = _conf;

    var input = _interopRequire(_input);

    var each = _lodash.each;
    var range = _lodash.range;
    var inactive = _playerStateCheckers.inactive;
    var playing = _playerStateCheckers.playing;
    var choosing_letter = _playerStateCheckers.choosing_letter;
    var choosing_name = _playerStateCheckers.choosing_name;
    var logging_in = _playerStateCheckers.logging_in;

    var template = pc.template(scorecard_template, pc);
    var view = undefined;
    var data = undefined;

    var PlayerUI = pc.Component.extend({
        initialize: function initialize() {
            console.log("init LetterPicker");
        },
        update: function update() {
            console.log("updating LetterPicker");
        }
    });

    pc.components.playerui = PlayerUI;

    function create(players) {
        data = {
            players: players,
            leaderboard: leaderboard,
            conf: conf,
            range: range
        };
        view = template.view(data);
        document.querySelector("#game-container").appendChild(view.render());
    }

    function update() {
        each(["n", "s", "e", "w"], function (p) {
            data.players[p].selected_player = leaderboard[p].selected_player;
            data.players[p].current_letter = leaderboard[p].current_letter;
        });
        view.accessor.applyChanges();
    }

    exports.create = create;
    exports.update = update;
});