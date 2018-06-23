define(["exports", "module", "commands/command", "conf", "leaderboard", "lodash", "players", "commands/powerups/all"], function (exports, module, _commandsCommand, _conf, _leaderboard, _lodash, _players, _commandsPowerupsAll) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var command = _commandsCommand;
    var conf = _conf;
    var leaderboard = _leaderboard;
    var findKey = _lodash.findKey;

    var players = _interopRequire(_players);

    var powerups = _commandsPowerupsAll;

    var powerupHash = {
        kickstart: "kickstarter",
        security: "shellshock",
        samba: "puck_reverse"
    };

    function add_powerups(player, powerup, number) {
        var i = 0;

        for (i; i < number; i += 1) {
            player.add_powerup(powerup);
        }
    }

    var player_login_choose_name = (function (_command) {
        function player_login_choose_name(player) {
            _classCallCheck(this, player_login_choose_name);

            _command.call(this, "player-login-choose-name");
            this.player = player;
            this.prev_state = this.player.state;
        }

        _inherits(player_login_choose_name, _command);

        player_login_choose_name.prototype.execute = function execute() {
            console.log("LOGIN: player " + this.player.name + " is choosing name");
            this.player.state = conf.PLAYER_STATE.LOGIN_CHOOSING_PLAYER;
        };

        player_login_choose_name.prototype.undo = function undo() {
            console.log("LOGIN: player " + this.player.name + " backs out of choosing name, now choosing letter");
            this.player.state = conf.PLAYER_STATE.LOGIN_CHOOSING_LETTER;
        };

        player_login_choose_name.prototype.done = function done() {
            console.log("LOGIN: player " + this.player.name + " is done choosing name");
            this.player.id = findKey(leaderboard.player_list, leaderboard[this.player.name].selected_player);

            /*
             * assign powerups here. the player is assigned as many powerups
             * as the games object specifies for each key
             *
             * kickstart = kick (kickstarter)
             * security = hack (shellshock)
             * samba = flip (puck_reverse)
             */
            this.player.powerups = [];

            if (leaderboard[this.player.name].selected_player.games) {
                for (var _iterator = Object.keys(leaderboard[this.player.name].selected_player.games), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var key = _ref;

                    var number = leaderboard[this.player.name].selected_player.games[key];
                    add_powerups(this.player, powerupHash[key], number);
                }
            }

            this.player.play.execute();
        };

        return player_login_choose_name;
    })(command);

    module.exports = player_login_choose_name;
});