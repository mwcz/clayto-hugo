define(["exports", "module", "Phaser", "states/state", "lodash", "collision", "player-state-checkers", "input", "players", "conf", "scores", "commands/move-paddle", "scorecards"], function (exports, module, _Phaser, _statesState, _lodash, _collision, _playerStateCheckers, _input, _players, _conf, _scores, _commandsMovePaddle, _scorecards) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    var Phaser = _interopRequire(_Phaser);

    var state = _interopRequire(_statesState);

    var each = _lodash.each;
    var any = _lodash.any;
    var invoke = _lodash.invoke;
    var includes = _lodash.includes;
    var hit_world = _collision.hit_world;
    var hit_puck = _collision.hit_puck;
    var reset_puck = _collision.reset_puck;
    var inactive = _playerStateCheckers.inactive;
    var playing = _playerStateCheckers.playing;
    var choosing_letter = _playerStateCheckers.choosing_letter;
    var choosing_name = _playerStateCheckers.choosing_name;
    var logging_in = _playerStateCheckers.logging_in;

    var input = _interopRequire(_input);

    var players = _interopRequire(_players);

    var conf = _conf;
    var scores = _scores;
    var move = _commandsMovePaddle;
    var scorecards = _scorecards;

    var puck = undefined;
    var paddles = {};
    var player_codes = ["n", "s", "e", "w"];
    var paused = false;

    function check_out_of_bounds(game, puck) {
        if (puck.body.position.y < game.world.bounds.top) {
            return "n";
        } else if (puck.body.position.y + puck.body.height > game.world.bounds.bottom) {
            return "s";
        } else if (puck.body.position.x + puck.body.width > game.world.bounds.right) {
            return "e";
        } else if (puck.body.position.x < game.world.bounds.left) {
            return "w";
        } else {
            return;
        }
    }

    function set_body_to_sprite_size(sprite, rotate90) {
        if (rotate90) {
            sprite.body.setSize(sprite.height, sprite.width);
        } else {
            sprite.body.setSize(sprite.width, sprite.height);
        }
    }

    function update_bg_color(game) {
        game.stage.backgroundColor = conf.BG_COLOR_CURRENT.toHexString();
    }

    function log_in_if_start_pressed(player) {
        if (inactive(players[player]) && input.start_pressed(players[player].pad)) {
            players[player].reset_default_powerups();
            players[player].play.execute();
        }
    }

    function log_in_if_start_clicked(player) {
        if (inactive(players[player])) {
            players[player].reset_default_powerups();
            players[player].play.execute();
        }
    }

    function execute_powerup_if_a(player) {
        if (playing(players[player]) && (input.a(players[player].pad) || input.x_kb_once())) {
            players[player].execute_powerup();
        }
    }

    function rotate_powerup_if_b(player) {
        if (playing(players[player]) && (input.b(players[player].pad) || input.z_kb_once())) {
            players[player].rotate_powerups();
        }
    }

    function move_paddle(player) {
        // move the player with gamepad if player is active.  else let AI decide
        // how to move.

        var pl = players[player];
        var pad = paddles[player];

        if (playing(pl)) {
            // handle gamepad controls
            if (input[pl.neg](pl.pad)) {
                move[pl.neg].execute(pl, pad);
            }
            if (input[pl.pos](pl.pad)) {
                move[pl.pos].execute(pl, pad);
            }

            // handle keyboard controls
            if (input.left_kb() || input.up_kb()) {
                move[pl.neg].execute(pl, pad);
            }

            if (input.right_kb() || input.down_kb()) {
                move[pl.pos].execute(pl, pad);
            }
        } else {

            // AI IS HERE!
            // find the distance between the puck and the paddle, but only on the
            // axis of movement
            var on_axis = pl.axis;
            var on_axis_d = puck.body.center[on_axis] - pad.body.center[on_axis];
            var motive_surface = Math.max(pad.body.height, pad.body.width) / (1 / conf.AI_LAZINESS);
            var move_speed = Math.min(conf.AI_UNFAIR_PADDLE_VELOCITY, Math.abs(on_axis_d / motive_surface));

            move[on_axis_d > 0 ? pl.pos : pl.neg].execute(pl, pad, move_speed);
        }
    }

    function press_start_click_handler() {
        if (!any(players, "playing")) {
            var player = this.getAttribute("data-player");
            log_in_if_start_clicked(player);
        }
    }

    function pause_click_handler() {
        paused = !paused;

        if (!paused) {
            this.style.opacity = 0;
            reset_puck(puck);
        } else {
            this.style.opacity = 1;
        }
    }

    function tick() {
        if (!paused) {
            for (var key in players) {
                if (playing(players[key])) {
                    scores[key].add_score();
                }
            }
        }
    }

    var play_state = (function (_state) {
        function play_state() {
            _classCallCheck(this, play_state);

            _state.call(this, "play");
        }

        _inherits(play_state, _state);

        play_state.prototype.create = function create(game) {

            scorecards.create(players);

            game.physics.startSystem(Phaser.Physics.ARCADE);

            scores.reset_all();

            puck = game.add.sprite(game.world.centerX, game.world.centerY, "puck");

            // dangit, players need references to puck, to pass into powerups that affect the puck
            // I shoulda just made everything globa, for a game this size. :)
            players.n.puck = puck;
            players.s.puck = puck;
            players.e.puck = puck;
            players.w.puck = puck;
            // end of dangit

            paddles.n = game.add.sprite(game.world.centerX, conf.PADDLE_PLACEMENT_WORLD_PADDING, "paddle-blue");
            paddles.s = game.add.sprite(game.world.centerX, game.world.height - conf.PADDLE_PLACEMENT_WORLD_PADDING - 20, "paddle-green");
            paddles.e = game.add.sprite(game.world.width - conf.PADDLE_PLACEMENT_WORLD_PADDING, game.world.centerY, "paddle-yellow");
            paddles.w = game.add.sprite(conf.PADDLE_PLACEMENT_WORLD_PADDING + 20, game.world.centerY, "paddle-red");

            paddles.n.addChild(game.make.sprite(0, 0, "paddle-blue"));

            paddles.w.angle = 90;
            paddles.e.angle = 90;

            game.physics.enable([puck, paddles.n, paddles.s, paddles.e, paddles.w], Phaser.Physics.ARCADE);

            puck.name = "PUCK";
            puck.body.setSize(20, 20, puck.height / 2 - 10, puck.width / 2 - 10);

            reset_puck(puck);

            paddles.n.name = "n";
            paddles.s.name = "s";
            paddles.e.name = "e";
            paddles.w.name = "w";
            paddles.n.body.immovable = true;
            paddles.s.body.immovable = true;
            paddles.e.body.immovable = true;
            paddles.w.body.immovable = true;
            paddles.n.body.collideWorldBounds = true;
            paddles.s.body.collideWorldBounds = true;
            paddles.e.body.collideWorldBounds = true;
            paddles.w.body.collideWorldBounds = true;
            set_body_to_sprite_size(paddles.n);
            set_body_to_sprite_size(paddles.s);
            set_body_to_sprite_size(paddles.e, true);
            set_body_to_sprite_size(paddles.w, true);

            // not sure why this offset is needed, but it lines up the hitboxes with
            // the sprites.
            paddles.w.body.offset.x = -20;
            paddles.e.body.offset.x = -20;

            // pad_n.body.offset.y = +20;
            // pad_s.body.offset.y = +20;

            // puck.body.collideWorldBounds = true;
            puck.body.bounce.setTo(1, 1);

            update_bg_color(game);

            // add points to players periodically
            game.time.events.loop(Phaser.Timer.SECOND * conf.SCORING_SEC_PER_POINT, tick, this);

            var press_start_elements = document.querySelectorAll(".press-start");
            invoke(press_start_elements, "addEventListener", "click", press_start_click_handler, false);

            var pause_button = document.querySelector("#pause-btn");
            pause_button.addEventListener("click", pause_click_handler, false);
        };

        play_state.prototype.update = function update(game) {

            game.physics.arcade.collide(puck, [paddles.n, paddles.s, paddles.e, paddles.w], hit_puck, null, this);

            paddles.n.body.velocity.setMagnitude(0);
            paddles.s.body.velocity.setMagnitude(0);
            paddles.e.body.velocity.setMagnitude(0);
            paddles.w.body.velocity.setMagnitude(0);

            update_bg_color(game);

            var oob = check_out_of_bounds(game, puck);
            if (oob) {
                hit_world(puck, oob);
            }

            /*
             * this is weird, let's not forget about this. this should be
             * handled in the pause_click_handler but for some reason the puck
             * is not being placed back in the center of the game
             */
            if (paused) {
                reset_puck(puck, false);
            }

            // check for players pressing start to join the game

            each(player_codes, log_in_if_start_pressed);

            // map input to commands

            each(player_codes, move_paddle);
            each(player_codes, execute_powerup_if_a);
            each(player_codes, rotate_powerup_if_b);

            // update the player status scorecards

            scorecards.update(players);
        };

        play_state.prototype.render = function render(game) {
            if (conf.DEBUG) {
                game.debug.body(puck);
                game.debug.body(paddles.n);
                game.debug.body(paddles.s);
                game.debug.body(paddles.e);
                game.debug.body(paddles.w);
            }
        };

        return play_state;
    })(state);

    module.exports = play_state;
});