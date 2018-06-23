define(["exports", "module", "lodash", "conf", "players", "player-state-checkers"], function (exports, module, _lodash, _conf, _players, _playerStateCheckers) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var range = _lodash.range;
    var invoke = _lodash.invoke;
    var STARTING_LIVES = _conf.STARTING_LIVES;
    var STARTING_SCORE = _conf.STARTING_SCORE;

    var players = _interopRequire(_players);

    var playing = _playerStateCheckers.playing;

    var score = (function () {
        function score(starting_score, starting_lives, player_name) {
            _classCallCheck(this, score);

            this.__player_name__ = player_name;
            this.__starting_score__ = starting_score;
            this.score = starting_score;
            this.el = document.querySelector("#player-" + this.__player_name__ + "-status");

            this.__starting_lives__ = starting_lives;
            this.lives = starting_lives;

            this.update_lives_array();
        }

        score.prototype.reset = function reset() {
            this.score = this.__starting_score__;
            this.lives = this.__starting_lives__;
            this.update_lives_array();
        };

        score.prototype.update_lives_array = function update_lives_array() {
            this.lives_arr = range(this.lives);
        };

        score.prototype.add_score = function add_score() {
            var amount = arguments[0] === undefined ? 1 : arguments[0];

            this.score += amount;
            this.update_lives_array();

            if (playing(players[this.__player_name__])) {
                var event = new CustomEvent("score", {
                    detail: {
                        player: players[this.__player_name__],
                        score: this.score
                    }
                });

                document.dispatchEvent(event);
            }

            console.log("SCORE: " + this.__player_name__ + " player gains " + amount + " points, now at " + this.score);
        };

        score.prototype.sub_lives = function sub_lives() {
            var amount = arguments[0] === undefined ? 1 : arguments[0];

            var player = players[this.__player_name__];

            this.lives -= amount;

            if (this.dead()) {
                player.reset_default_powerups();
                player.play.undo();
                this.reset();
            } else {
                this.update_lives_array();
                player.add_random_powerup();
            }
            console.log("LIVES: " + this.__player_name__ + " player loses " + amount + " lives, now at " + this.lives + " lives");
        };

        score.prototype.dead = function dead() {
            return this.lives <= 0;
        };

        return score;
    })();

    var scores = {
        n: new score(STARTING_SCORE, STARTING_LIVES, "n"),
        s: new score(STARTING_SCORE, STARTING_LIVES, "s"),
        e: new score(STARTING_SCORE, STARTING_LIVES, "e"),
        w: new score(STARTING_SCORE, STARTING_LIVES, "w")
    };

    players.n.score = scores.n;
    players.s.score = scores.s;
    players.e.score = scores.e;
    players.w.score = scores.w;

    scores.reset_all = reset_all;

    function reset_all() {
        invoke(scores, "reset");
    }

    reset_all();

    module.exports = scores;
});