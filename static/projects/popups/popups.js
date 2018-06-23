let PAGE_WIDTH  = window.innerWidth;
let PAGE_HEIGHT = window.innerHeight;

const POP_MAX_WIDTH = 0.8; // percentage of PAGE_WIDTH
const POP_MIN_WIDTH = 0.1; // percentage of PAGE_HEIGHT

const POP_MAX_HEIGHT = 0.8; // percentage of PAGE_HEIGHT
const POP_MIN_HEIGHT = 0.1; // percentage of PAGE_HEIGHT

const POP_INTERVAL_INITIAL = 3000;
const POP_INTERVAL_MIN = 500; // ms. what's the fastest interval between pops
const DIFFICULTY_SCALE_TIME = 48000; // ms.  how long it takes to get to max difficulty
const GAME_DURATION = 58000; // ms.  how long the total game lasts

const WIN_COUNT = 45; // how many pops closed to win

let start_time; // the timestamp when the user clicked play
let time = 0;

let pop_width = PAGE_WIDTH * POP_MAX_WIDTH;
let pop_height = PAGE_HEIGHT * POP_MAX_HEIGHT;

let popup_count = 0;
let popups_closed = 0;

let pop_interval = POP_INTERVAL_INITIAL; // initial; time between pops decreases as game goes on

const el_close_count = document.querySelector('#close-count');
const el_time_left = document.querySelector('#time-left');

const timeout_ids = [];

let playing = false;

const pops = {};

const sfx = {
    mousedown: new Howl({ src: ['mousedown.ogg', 'mousedown.mp3', 'mousedown.wav'] }),
    mouseup: new Howl({ src: ['mouseup.ogg', 'mouseup.mp3', 'mouseup.wav'] }),
    open: new Howl({ src: ['open.ogg', 'open.mp3', 'open.wav'] }),
    close: new Howl({ src: ['close.ogg', 'close.mp3', 'close.wav'] }),
    play_music: new Howl({ src: ['play-music.ogg', 'play-music.mp3', 'play-music.wav'], volume: 0.3 }),
};

function main() {
    setup();
    start();
}

function setup() {
    handlePopupsDisabled();
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', handleUnload);
}

function handlePopupsDisabled() {
    const disabled = !popupsEnabled();
    if (disabled) {
        document.body.setAttribute('data-popups', 'disabled');
    }
    else {
        document.body.removeAttribute('data-popups');
    }
    return disabled;
}

function start() {
    if(handlePopupsDisabled()) return;

    start_time = performance.now();
    update();

    sfx.play_music.play();

    // reveal the stop button
    document.body.setAttribute('data-state', 'playing');
    playing = true;

    // schedule the first pop
    timeout_ids.push(setTimeout(schedulePopup, 1000));

    // schedule game end
    timeout_ids.push(setTimeout(stop, GAME_DURATION));
}

function stop(early) {
    document.body.setAttribute('data-state', 'gameover');
    playing = false;
    showWinScreen(won(), early);
    clearTimeouts();
    closePopups();
    sfx.play_music.fade(sfx.play_music.volume(), 0, 200);
}

function won() {
    return popups_closed >= WIN_COUNT;
}

function schedulePopup() {
    const {x, y} = popPos();
    popup(x, y);
    console.log(`scheduling popup in ${pop_interval} ms`);
    const tid = setTimeout(schedulePopup, pop_interval);
    timeout_ids.push(tid);
}

function popup(x, y) {
    popup_count += 1;

    const id = romanize(popup_count);

    const pop = window.open(
        `./popup.html`,
        `popup-${id}`,
        [
            'scrollbars=no',
            `width=${pop_width}`,
            `height=${pop_height}`,
            'resizable=no',
            'location=no',
            'locationbar=no',
            'personalbar=no',
            'dependent=yes',
            'alwaysRaised=yes',
            'modal=yes',
            'chrome=yes',
            'menubar=no',
            'toolbar=no',
            `left=${x}`,
            `top=${y}`,
        ].join(),
    );

    pop.addEventListener('beforeunload', function(e) { handlePopupClosed(e, id) });

    pop.addEventListener('load', function() {
        // pop.document.body.querySelector('h1').innerText = `POPUP`;
        pop.document.body.querySelector('h2').innerText = id.toUpperCase();
    });

    sfx.open.play();

    pops[id] = pop;
}

// get the popup size based on current page size and game time
function popSize() {
    const time_scale = 1 - smoothstep(1);
    return {
        width: PAGE_WIDTH * POP_MAX_WIDTH,
        height: PAGE_HEIGHT * POP_MAX_HEIGHT,
    };
}

// popup position is based on popup width and height
function popPos() {
    return {
        x: Math.random() * (PAGE_WIDTH - pop_width) + screenX,
        y: Math.random() * (PAGE_HEIGHT - pop_height) + screenY,
    };
}

function handlePopupClosed(e, id) {
    console.log(`closed popup-${id}`);
    popups_closed += 1;
    sfx.close.play();
    el_close_count.textContent = popups_closed;
}

function romanize(num) {
      var lookup = {m:1000,cm:900,d:500,cd:400,c:100,xc:90,l:50,xl:40,x:10,ix:9,v:5,iv:4,i:1},roman = '',i;
      for ( i in lookup ) {
              while ( num >= lookup[i] ) {
                        roman += i;
                        num -= lookup[i];
                      }
            }
      return roman;
}

function handleResize() {
    PAGE_WIDTH  = window.innerWidth;
    PAGE_HEIGHT = window.innerHeight;
}

function update() {
    requestAnimationFrame(update);
    updateTime();
    updateInterval();
    updateSize();
}

function updateInterval() {
    pop_interval = Math.max(POP_INTERVAL_MIN, POP_INTERVAL_INITIAL * (1 - smoothstep(timeprogress())));
}

function updateTime() {
    time = performance.now() - start_time;
    el_time_left.textContent = Math.ceil((GAME_DURATION - time) / 1000);
}

function timeprogress() {
    return time / DIFFICULTY_SCALE_TIME;
}

function updateSize() {
    pop_width = PAGE_WIDTH * ((POP_MAX_WIDTH - POP_MIN_WIDTH) * (1 - smoothstep(timeprogress()) + POP_MIN_WIDTH));
    pop_height = PAGE_HEIGHT * ((POP_MAX_HEIGHT - POP_MIN_HEIGHT) * (1 - smoothstep(timeprogress()) + POP_MIN_HEIGHT));
}

function smoothstep(n) {
    return Math.min(1, Math.max(0, n*n*n*(6*n*n-15*n+10)));
}

function closePopups() {
    sfx.close.volume(0);
    _.each(pops, function (pop) { pop.close() });
}

function showWinScreen(win, early) {
    if (win && !early) {
        document.body.setAttribute('data-won', '');
    }
    else {
        document.body.setAttribute('data-lost', '');
    }
    if (early) {
        // show crazy number if the player quit early
        document.querySelector('#final-close-count').textContent = -Math.floor(Math.random() * 1e6);
    }
    else {
        document.querySelector('#final-close-count').textContent = popups_closed;
    }
}

function popupsEnabled() {
    const pop = window.open(
        `./popup.html`,
        'test-popup',
        [
            'scrollbars=no',
            `width=${pop_width}`,
            `height=${pop_height}`,
            'resizable=no',
            'location=no',
            'locationbar=no',
            'personalbar=no',
            'dependent=yes',
            'alwaysRaised=yes',
            'modal=yes',
            'chrome=yes',
            'menubar=no',
            'toolbar=no',
            `left=0`,
            `top=0`,
        ].join(),
    );
    let opened = !!pop;
    if (pop) {
        pop.close();
    }
    return opened;
}

function handleUnload(e) {
    let retval;
    if (playing) {
        retval = 'Oh no you closed the game :(';
        e.returnValue = retval;
    }
    return retval;
}

function clearTimeouts() {
    timeout_ids.forEach(clearTimeout);
}

document.querySelector('#start').addEventListener('click', main);
document.querySelector('#stop').addEventListener('click', stop);

[].forEach.call(document.querySelectorAll('button'), function (btn) {
    btn.addEventListener('mousedown', function () { sfx.mousedown.play() });
    btn.addEventListener('mouseup', function () { sfx.mouseup.play() });
});
