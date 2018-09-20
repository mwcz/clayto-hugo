define(["exports", "module", "lodash", "conf", "players"], function (exports, module, _lodash, _conf, _players) {
    "use strict";

    var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

    /**
     * Confusingly, this module both posts data to the leaderboard when a player
     * scores, AND fetches player names from the leaderboard so new players may
     * select their "account".
     */

    var each = _lodash.each;
    var chunk = _lodash.chunk;
    var groupBy = _lodash.groupBy;
    var first = _lodash.first;
    var sort = _lodash.sortBy;
    var keys = _lodash.keys;
    var without = _lodash.without;
    var indexOf = _lodash.indexOf;
    var get = _lodash.get;
    var conf = _conf;

    var players = _interopRequire(_players);

    var board = {};

    // const alpha_chunks = chunk(alphabet, conf.LOGIN_ALPHABET_CHUNK_SIZE);

    board.player_list = {};
    board.player_list_parts = {};
    board.alphabet = "abcdefghijklmnopqrstuvwxyz";

    reset_player_selections("n");
    reset_player_selections("s");
    reset_player_selections("e");
    reset_player_selections("w");

    function reset_player_selections(playername) {
        board[playername] = {
            selected_player: {},
            current_player_index: 0,
            current_letter: ""
        };
    }

    board.select_next_letter = function select_next_letter(playername) {
        inc_letter(playername, 1);
    };

    board.select_prev_letter = function select_prev_letter(playername) {
        // add length-1 instead of subtracting to avoid ever having to deal with
        // negative numbers
        inc_letter(playername, keys(board.player_list_parts).length - 1);
    };

    function inc_letter(playername) {
        var inc = arguments[1] === undefined ? 0 : arguments[1];

        // get all the letters, sorted
        var letters = sort(keys(board.player_list_parts));

        // find the index of the current letter
        var letter_index = indexOf(letters, board[playername].current_letter);

        // add inc to the index
        letter_index += inc;

        // mod for length
        letter_index %= letters.length;

        // assign current_letter
        board[playername].current_letter = letters[letter_index];

        // assign selected_player
        update_current_player(playername);

        // reset current_player_index
        board[playername].current_player_index = 0;

        console.log("LOGIN: letter '" + board[playername].current_letter + "' selected");
    }

    board.select_next_player = function select_next_player(playername) {
        select_player(playername, 1);
    };

    board.select_prev_player = function select_prev_player(playername) {
        // add length-1 instead of subtracting to avoid ever having to deal with
        // negative numbers
        select_player(playername, board.player_list_parts[board[playername].current_letter].length - 1);
    };

    function select_player(playername) {
        var inc = arguments[1] === undefined ? 0 : arguments[1];

        board[playername].current_player_index += inc;
        board[playername].current_player_index %= board.player_list_parts[board[playername].current_letter].length;
        update_current_player(playername);
        console.log("LOGIN: player '" + board[playername].selected_player.name + "' selected");
    }

    function update_current_player(playername) {
        board[playername].selected_player = board.player_list_parts[board[playername].current_letter][board[playername].current_player_index];
    }

    function score_handler(event) {
        var player = board.player_list[event.detail.player.id],
            score = event.detail.score,

        // xhr = new XMLHttpRequest(),
        updatedPlayer = {};

        if (get(player, "ping.hiscore") && score <= player.ping.hiscore) {
            return;
        }

        updatedPlayer[event.detail.player.id] = {
            ping: {
                hiscore: score,
                color: event.detail.player.color
            }
        };

        // xhr.open('PUT', 'http://summit-games.usersys.redhat.com/users');
        // xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        // xhr.responseType = 'json';

        // xhr.onload = function () {
        //     // console.log(xhr.response);
        // };

        // xhr.onerror = function () {
        //     console.log('error');
        // };

        // xhr.send(JSON.stringify(updatedPlayer));
    }

    /*
     * get the players list every 30 seconds so we can keep
     * the powerups current
     */

    document.addEventListener("score", score_handler);

    module.exports = board;
});