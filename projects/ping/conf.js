define(["exports", "tinycolor"], function (exports, _tinycolor) {
  "use strict";

  exports.__esModule = true;
  var tinycolor = _tinycolor;
  var NAME = "phaser-canvas-wrapper";
  exports.NAME = NAME;
  var DEBUG = false;

  exports.DEBUG = DEBUG;
  /*********************
   *  Player settings  *
   *********************/

  var STARTING_LIVES = 4;
  exports.STARTING_LIVES = STARTING_LIVES;
  var STARTING_SCORE = 0;
  exports.STARTING_SCORE = STARTING_SCORE;
  var SCORING_SEC_PER_POINT = 3;
  exports.SCORING_SEC_PER_POINT = SCORING_SEC_PER_POINT;
  var POINTS_PER_GOAL = 2;

  exports.POINTS_PER_GOAL = POINTS_PER_GOAL;
  var COLOR_PLAYER_N = tinycolor("#5D9BFE");
  exports.COLOR_PLAYER_N = COLOR_PLAYER_N;
  var COLOR_PLAYER_S = tinycolor("#26BF4A");
  exports.COLOR_PLAYER_S = COLOR_PLAYER_S;
  var COLOR_PLAYER_E = tinycolor("#E7E746");
  exports.COLOR_PLAYER_E = COLOR_PLAYER_E;
  var COLOR_PLAYER_W = tinycolor("#F72C2C");

  exports.COLOR_PLAYER_W = COLOR_PLAYER_W;
  /****************************
   *  Player state constants  *
   ****************************/

  var PLAYER_STATE = {
    LOGIN_CHOOSING_LETTER: "player-state-login-choosing-letter",
    LOGIN_CHOOSING_PLAYER: "player-state-login-choosing-player",
    PLAYING: "player-state-playing",
    INACTIVE: "player-state-inactive"
  };

  exports.PLAYER_STATE = PLAYER_STATE;
  /******************************
   *  Puck and paddle settings  *
   ******************************/

  // the magnitude of the puck's velocity increases by this much every time it
  // hits something
  var PUCK_ACCELERATION = 36;

  exports.PUCK_ACCELERATION = PUCK_ACCELERATION;
  var PUCK_RESET_MOVEMENT_DELAY = 1000;exports.PUCK_RESET_MOVEMENT_DELAY = PUCK_RESET_MOVEMENT_DELAY;
  // ms
  var INITIAL_PUCK_VELOCITY_MAG = 160;exports.INITIAL_PUCK_VELOCITY_MAG = INITIAL_PUCK_VELOCITY_MAG;
  // initial magnitude of puck velocity
  var MAX_PUCK_VELOCITY_MAG = 2000;exports.MAX_PUCK_VELOCITY_MAG = MAX_PUCK_VELOCITY_MAG;
  // max puck velocity magnitude
  var PADDLE_PLACEMENT_WORLD_PADDING = 8;exports.PADDLE_PLACEMENT_WORLD_PADDING = PADDLE_PLACEMENT_WORLD_PADDING;
  // pixels between paddles and wall
  var PADDLE_VELOCITY_FROM_KEYPRESS = 400;exports.PADDLE_VELOCITY_FROM_KEYPRESS = PADDLE_VELOCITY_FROM_KEYPRESS;
  // velocity given to paddle by user's keypress
  var PADDLE_SPRINGINESS_DEFAULT = 1;exports.PADDLE_SPRINGINESS_DEFAULT = PADDLE_SPRINGINESS_DEFAULT;
  // how much to multiply puck velocity on hit

  // the percentage of paddle velocity that is added to puck velocity on hit
  var PADDLE_PUCK_FRICTION = 0.3;

  exports.PADDLE_PUCK_FRICTION = PADDLE_PUCK_FRICTION;
  // the paddle's sprite has a glow, but the puck shouldn't bounce off the glow.
  // this setting determines the width of the glow, so the actual physical body
  // of the paddle is correct.
  var PADDLE_SPRITE_BODY_PADDING = 15;

  exports.PADDLE_SPRITE_BODY_PADDING = PADDLE_SPRITE_BODY_PADDING;
  /***********************
   *  Background colors  *
   ***********************/

  var BG_COLOR_BASE = tinycolor("#000");
  exports.BG_COLOR_BASE = BG_COLOR_BASE;
  var BG_COLOR_PUCK_PADDLE_HIT = tinycolor("#333");
  exports.BG_COLOR_PUCK_PADDLE_HIT = BG_COLOR_PUCK_PADDLE_HIT;
  var BG_COLOR_PUCK_WORLD_HIT = tinycolor("#aaa");
  exports.BG_COLOR_PUCK_WORLD_HIT = BG_COLOR_PUCK_WORLD_HIT;
  var BG_COLOR_CURRENT = tinycolor(BG_COLOR_BASE.toString());

  exports.BG_COLOR_CURRENT = BG_COLOR_CURRENT;
  var BG_COLOR_PLAYER_N_SCORE = tinycolor(COLOR_PLAYER_N.toString()).darken(20);
  exports.BG_COLOR_PLAYER_N_SCORE = BG_COLOR_PLAYER_N_SCORE;
  var BG_COLOR_PLAYER_S_SCORE = tinycolor(COLOR_PLAYER_S.toString()).darken(20);
  exports.BG_COLOR_PLAYER_S_SCORE = BG_COLOR_PLAYER_S_SCORE;
  var BG_COLOR_PLAYER_E_SCORE = tinycolor(COLOR_PLAYER_E.toString()).darken(20);
  exports.BG_COLOR_PLAYER_E_SCORE = BG_COLOR_PLAYER_E_SCORE;
  var BG_COLOR_PLAYER_W_SCORE = tinycolor(COLOR_PLAYER_W.toString()).darken(20);

  exports.BG_COLOR_PLAYER_W_SCORE = BG_COLOR_PLAYER_W_SCORE;
  /******************
   *  Title screen  *
   ******************/

  var TITLE_POSITION = { x: 80, y: 100 };

  exports.TITLE_POSITION = TITLE_POSITION;
  /******************************************
   *  Color tweening, colors and durations  *
   ******************************************/

  var COLOR_TWEEN_PROPS = ["_r", "_g", "_b"];

  exports.COLOR_TWEEN_PROPS = COLOR_TWEEN_PROPS;
  var BG_COLOR_PUCK_WORLD_HIT_IN = 64;
  exports.BG_COLOR_PUCK_WORLD_HIT_IN = BG_COLOR_PUCK_WORLD_HIT_IN;
  var BG_COLOR_PUCK_WORLD_HIT_OUT = 1024;

  exports.BG_COLOR_PUCK_WORLD_HIT_OUT = BG_COLOR_PUCK_WORLD_HIT_OUT;
  var BG_COLOR_PUCK_PADDLE_HIT_IN = 64;
  exports.BG_COLOR_PUCK_PADDLE_HIT_IN = BG_COLOR_PUCK_PADDLE_HIT_IN;
  var BG_COLOR_PUCK_PADDLE_HIT_OUT = 128;

  exports.BG_COLOR_PUCK_PADDLE_HIT_OUT = BG_COLOR_PUCK_PADDLE_HIT_OUT;
  /**********
   *  Text  *
   **********/

  var TEXT_FONT = "carrier_command";
  exports.TEXT_FONT = TEXT_FONT;
  var TEXT_SIZE = 64;
  exports.TEXT_SIZE = TEXT_SIZE;
  var TEXT_COLOR = "#ffffff";
  exports.TEXT_COLOR = TEXT_COLOR;
  var TEXT_ALIGN = "#ffffff";
  exports.TEXT_ALIGN = TEXT_ALIGN;
  var TEXT_STYLE = { font: TEXT_FONT, fill: TEXT_COLOR, align: TEXT_ALIGN };

  exports.TEXT_STYLE = TEXT_STYLE;
  /******************
   *  Score screen  *
   ******************/

  var SCORE_POSITION = { x: 100, y: 100 };

  exports.SCORE_POSITION = SCORE_POSITION;
  /******************
   *  AI Behaviors  *
   ******************/

  // from 0 to 1, how lax the AI is in pursuing the puck
  var AI_LAZINESS = 0.2;
  exports.AI_LAZINESS = AI_LAZINESS;
  var AI_UNFAIR_PADDLE_VELOCITY = 1.1;exports.AI_UNFAIR_PADDLE_VELOCITY = AI_UNFAIR_PADDLE_VELOCITY;
  // AI can move a little faster than players, by this factor

  /**************
   *  Powerups  *
   **************/

  var KICKSTARTER_MULTIPLIER = 1;
  exports.KICKSTARTER_MULTIPLIER = KICKSTARTER_MULTIPLIER;
  var CURSED_VALUE = -1;
  exports.CURSED_VALUE = CURSED_VALUE;
  var UNCURSED_VALUE = 1;
  exports.UNCURSED_VALUE = UNCURSED_VALUE;
  var CURSED_DURATION = 1000;exports.CURSED_DURATION = CURSED_DURATION;
  // ms

  /***********
   *  Login  *
   ***********/

  var LOGIN_ALPHABET_CHUNK_SIZE = 5;exports.LOGIN_ALPHABET_CHUNK_SIZE = LOGIN_ALPHABET_CHUNK_SIZE;
  // a-e, f-j, etc

  /*****************
   *  Leaderboard  *
   *****************/

  var GET_PLAYER_LIST_REFRESH_MS = 30000; // 30 seconds
  exports.GET_PLAYER_LIST_REFRESH_MS = GET_PLAYER_LIST_REFRESH_MS;
});