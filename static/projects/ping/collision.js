define(["exports", "Phaser", "lodash", "conf", "sounds", "scores", "players", "puck-history"], function (exports, _Phaser, _lodash, _conf, _sounds, _scores, _players, _puckHistory) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    exports.__esModule = true;

    var Phaser = _interopRequire(_Phaser);

    var pick = _lodash.pick;
    var without = _lodash.without;
    var first = _lodash.first;
    var partial = _lodash.partial;
    var delay = _lodash.delay;
    var conf = _conf;

    var SOUNDS = _interopRequire(_sounds);

    var scores = _scores;

    var players = _interopRequire(_players);

    var puck_history = _puckHistory;

    function hit_puck(puck, paddle) {
        console.log("COLLISION: " + puck.name + " (" + puck.body.velocity.x.toFixed(2) + ", " + puck.body.velocity.y.toFixed(2) + "), " + paddle.name + " (" + puck.body.velocity.x.toFixed(2) + ", " + puck.body.velocity.y.toFixed(2) + ")");

        SOUNDS.PUCK_HIT_PADDLE.play();

        puck_history.push(paddle.name);

        // save the puck's current velocity magnitude
        var puck_vel_mag = puck.body.velocity.getMagnitude();

        // if puck overlaps the paddle when they collide (ie, when the puck hits
        // the side of the paddle, not the face), do not apply friction.  this
        // fixes the clinging bug that occurred when the paddle moved much faster
        // than the puck and could convey friction so many times that it clung to
        // the side of the paddle and allowed a free goal.
        if (!overlap(puck, paddle, players[paddle.name].axis)) {
            apply_friction(puck, paddle);
        }

        var vel_mul = players[paddle.name].springiness;

        // set back to default springiness
        players[paddle.name].springiness = conf.PADDLE_SPRINGINESS_DEFAULT;

        // reset the puck's velocity's magnitude, plus a little oomph
        puck.body.velocity.setMagnitude((puck_vel_mag + conf.PUCK_ACCELERATION) * vel_mul);

        // lighten up the background a bit for fun :)
        var tween = puck.game.add.tween(conf.BG_COLOR_CURRENT).to(pick(conf.BG_COLOR_PUCK_PADDLE_HIT, conf.COLOR_TWEEN_PROPS), conf.BG_COLOR_PUCK_PADDLE_HIT_IN, Phaser.Easing.Linear.None).to(pick(conf.BG_COLOR_BASE, conf.COLOR_TWEEN_PROPS), conf.BG_COLOR_PUCK_PADDLE_HIT_OUT, Phaser.Easing.Linear.None).start();
    }

    function overlap(puck, paddle, axis) {
        // if distance between the puck and paddle's coordinates is less than the
        // width/height of the puck, they are overlapping (on the given axis)
        var face = ({ x: "height", y: "width" })[axis];
        var otheraxis = ({ x: "y", y: "x" })[axis];
        var distance = Math.abs(puck.body.position[otheraxis] - paddle.body.position[otheraxis]);
        var is_overlapping = distance < puck.body[face];
        return is_overlapping;
    }

    function apply_friction(puck, paddle) {
        // add a fraction of the paddle's velocity to the puck (for angle shots)
        puck.body.velocity.add(paddle.body.velocity.x * conf.PADDLE_PUCK_FRICTION, paddle.body.velocity.y * conf.PADDLE_PUCK_FRICTION);
    }

    function hit_world(puck, side) {
        console.log("COLLISION: " + puck.name + " (" + puck.body.velocity.x.toFixed() + ", " + puck.body.velocity.y.toFixed() + "), " + side.toUpperCase() + " WALL");

        var scoring_player = puck_history.scoring_player(side);
        var new_bg_color = conf.BG_COLOR_PUCK_WORLD_HIT;

        puck_history.reset();

        scores[side].sub_lives(1);

        // give the scoring player points only if a player actually scored.  this
        // covers the case where the puck went from its starting position (center
        // of screen) to a goal without any players hitting it, or only glancing
        // off the side of the the scored-on player's paddle.
        if (scoring_player) {
            scores[scoring_player].add_score(conf.POINTS_PER_GOAL);
            new_bg_color = conf["BG_COLOR_PLAYER_" + scoring_player.toUpperCase() + "_SCORE"];
        }

        SOUNDS.PUCK_OOB.play();

        reset_puck(puck);

        var tween = puck.game.add.tween(conf.BG_COLOR_CURRENT).to(pick(new_bg_color, conf.COLOR_TWEEN_PROPS), conf.BG_COLOR_PUCK_WORLD_HIT_IN, Phaser.Easing.Linear.None).to(pick(conf.BG_COLOR_BASE, conf.COLOR_TWEEN_PROPS), conf.BG_COLOR_PUCK_WORLD_HIT_OUT, Phaser.Easing.Linear.None).start();
    }

    function reset_puck(puck) {
        var autostart = arguments[1] === undefined ? true : arguments[1];

        // stop the puck from moving completely
        puck.body.velocity.setTo(0, 0);
        puck.body.velocity.setMagnitude(0);

        // put it in the center of the screen
        puck.body.position.set(puck.game.world.centerX - puck.body.width / 2, puck.game.world.centerY - puck.body.height / 2);

        if (autostart) {
            // after a short delay, give it motion again
            delay(partial(puck_initial_motion, puck), conf.PUCK_RESET_MOVEMENT_DELAY);
        }
    }

    function puck_initial_motion(puck) {
        //  This gets it moving
        puck.body.velocity.setTo(Math.random() - 0.5, Math.random() - 0.5);
        puck.body.velocity.setMagnitude(conf.INITIAL_PUCK_VELOCITY_MAG);
        puck.body.maxVelocity.setMagnitude(conf.MAX_PUCK_VELOCITY_MAG);
    }

    exports.hit_puck = hit_puck;
    exports.hit_world = hit_world;
    exports.reset_puck = reset_puck;
});