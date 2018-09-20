define(["exports", "module", "Phaser", "lodash", "commands/player-play", "commands/player-login-choose-letter", "commands/player-login-choose-name", "commands/powerups/all", "conf"], function (exports, module, _Phaser, _lodash, _commandsPlayerPlay, _commandsPlayerLoginChooseLetter, _commandsPlayerLoginChooseName, _commandsPowerupsAll, _conf) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Phaser = _interopRequire(_Phaser);

    var pull = _lodash.pull;
    var countBy = _lodash.countBy;
    var find = _lodash.find;
    var partial = _lodash.partial;
    var mapValues = _lodash.mapValues;
    var range = _lodash.range;
    var sort = _lodash.sortBy;
    var unique = _lodash.unique;
    var first = _lodash.first;
    var pluck = _lodash.pluck;
    var omit = _lodash.omit;
    var without = _lodash.without;
    var sample = _lodash.sample;
    var keys = _lodash.keys;

    var player_play = _interopRequire(_commandsPlayerPlay);

    var player_login_choose_letter = _interopRequire(_commandsPlayerLoginChooseLetter);

    var player_login_choose_name = _interopRequire(_commandsPlayerLoginChooseName);

    var powerups = _commandsPowerupsAll;
    var conf = _conf;

    var players = {};

    var axes = {
        x: { pos: "right", neg: "left" },
        y: { pos: "down", neg: "up" } };

    var color_names = {
        n: "blue",
        s: "green",
        e: "yellow",
        w: "red" };

    var player = (function () {
        function player(name, pad, axis) {
            _classCallCheck(this, player);

            var axis_dirs = axes[axis];
            this.name = name;
            this.id = "";
            this.color = conf["COLOR_PLAYER_" + this.name.toUpperCase()].toString();
            this.color_name = color_names[this.name];
            this.pad = pad;
            this.state = conf.PLAYER_STATE.INACTIVE;
            this.play = new player_play(this);
            this.choose_letter = new player_login_choose_letter(this);
            this.choose_name = new player_login_choose_name(this);
            this.score = undefined;
            this.axis = axis;
            this.cursed_move = 1; // movement multiplier; can be used for evil
            this.pos = axis_dirs.pos;
            this.neg = axis_dirs.neg;
            this.springiness = 1;
            this.powerup_counts = {};
            this.powerup_count_arrs = {};
            this.powerups_shortnames = [];
            this.selected_powerup_index = 0;
            this.selected_powerup_shortname = "";
            this.update_powerups_meta();
            this.reset_default_powerups();
        }

        player.prototype.update_powerups_meta = function update_powerups_meta() {
            var _this = this;

            this.powerups_shortnames = unique(sort(pluck(this.powerups, "shortname")), true);
            this.powerup_counts = countBy(this.powerups, "shortname");
            this.powerup_count_arrs = mapValues(this.powerup_counts, range);
            this.selected_powerup_shortname = this.powerups_shortnames[this.selected_powerup_index];
            this.selected_powerup = find(this.powerups, function (p) {
                return p.shortname === _this.selected_powerup_shortname;
            });
        };

        player.prototype.add_powerup = function add_powerup(powerup_name) {
            var powerup = new powerups[powerup_name](omit(players, this), this);
            this.powerups.push(powerup);
            this.update_powerups_meta();
            console.log("POWERUPS: " + this.name + " has [" + pluck(this.powerups, "shortname") + "]");
        };

        player.prototype.rotate_powerups = function rotate_powerups() {
            if (this.powerups.length) {
                this.selected_powerup_index += 1;
                this.selected_powerup_index %= this.powerups_shortnames.length;
                this.update_powerups_meta();
                console.log("POWERUPS: " + this.name + " has selected " + this.selected_powerup.shortname);
            }
        };

        player.prototype.execute_powerup = function execute_powerup() {
            if (this.selected_powerup) {
                this.selected_powerup.execute();
                console.log("POWERUPS: " + this.name + " used [" + this.selected_powerup.shortname + "]");
                pull(this.powerups, this.selected_powerup);
                this.update_powerups_meta();
                // if we just used the last of a certain type of powerup, call rotate
                // so the next powerup type can become selected
                if (this.powerup_counts[this.selected_powerup_shortname] === 0) {
                    this.rotate_powerups();
                }
            }
        };

        player.prototype.add_random_powerup = function add_random_powerup() {
            // get a random powerup name from the powerups object (remove babel's __esModule property)
            var pow_name = sample(without(keys(powerups), "__esModule"));
            this.add_powerup(pow_name);
        };

        player.prototype.reset_default_powerups = function reset_default_powerups() {
            this.powerups = [];

            this.add_random_powerup();
            this.add_random_powerup();
            this.add_random_powerup();
            this.add_random_powerup();
            this.add_random_powerup();
            this.add_random_powerup();
            this.add_random_powerup();
        };

        return player;
    })();

    players.n = new player("n", "pad4", "x");
    players.s = new player("s", "pad3", "x");
    players.e = new player("e", "pad2", "y");
    players.w = new player("w", "pad1", "y");

    module.exports = players;
});