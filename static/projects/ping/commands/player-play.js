define(["exports", "module", "commands/command", "conf"], function (exports, module, _commandsCommand, _conf) {
    "use strict";

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var command = _commandsCommand;
    var conf = _conf;

    /**
     * These are executed when a player presses Start.
     */

    var player_start = (function (_command) {
        function player_start(player) {
            _classCallCheck(this, player_start);

            _command.call(this, "player-start");
            this.player = player;
            this.prev_state = player.state;
        }

        _inherits(player_start, _command);

        player_start.prototype.execute = function execute() {
            // I designed the module layout poorly in some places, so a regular
            // import can't be used here for 'scores' due to a circular dependency.
            // Fall back to RequireJS's circular dependency solution of
            // `require('scores')`.
            var score_obj = require("scores")[this.player.name];
            console.log("JOIN: player " + this.player.name + " joined");
            score_obj.reset();
            this.player.state = conf.PLAYER_STATE.PLAYING;
        };

        player_start.prototype.undo = function undo() {
            // I designed the module layout poorly in some places, so a regular
            // import can't be used here for 'scores' due to a circular dependency.
            // Fall back to RequireJS's circular dependency solution of
            // `require('scores')`.
            var score_obj = require("scores")[this.player.name];
            console.log("JOIN: player " + this.player.name + " left");
            score_obj.reset();
            this.player.state = conf.PLAYER_STATE.INACTIVE;
        };

        return player_start;
    })(command);

    module.exports = player_start;
});