define(["exports", "module", "commands/command", "conf"], function (exports, module, _commandsCommand, _conf) {
    "use strict";

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var command = _commandsCommand;
    var conf = _conf;

    var player_login_choose_letter = (function (_command) {
        function player_login_choose_letter(player) {
            _classCallCheck(this, player_login_choose_letter);

            _command.call(this, "player-login-choose-letter");
            this.player = player;
            this.prev_state = this.player.state;
        }

        _inherits(player_login_choose_letter, _command);

        player_login_choose_letter.prototype.execute = function execute() {
            console.log("LOGIN: player " + this.player.name + " is choosing letter");
            this.player.state = conf.PLAYER_STATE.LOGIN_CHOOSING_LETTER;
        };

        player_login_choose_letter.prototype.undo = function undo() {
            console.log("LOGIN: player " + this.player.name + " backs out of choosing letter, now inactive");
            this.player.state = conf.PLAYER_STATE.INACTIVE;
        };

        player_login_choose_letter.prototype.done = function done() {
            console.log("LOGIN: player " + this.player.name + " is done choosing letter");
            this.player.choose_name.execute();
        };

        return player_login_choose_letter;
    })(command);

    module.exports = player_login_choose_letter;
});