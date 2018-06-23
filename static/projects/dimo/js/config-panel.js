/* global define */
/* jshint browser: true */

(function (global) {

var deps = [
    'dimo/config',
    'dimo/particles',
    'dimo/players',
    'dimo/gravity',
    'dimo/particle_colors',
    'dimo/presets',
    'dimo/timer',
    'datgui',
    'underscore',
];

function main(
    config,
    particles,
    players,
    gravity,
    particle_colors,
    presets,
    timer,
    dat,
    _
) {

    var gui = new dat.GUI({
        load: presets
    });

    // for some reason, revert is needed by datgui to fully instantiate all
    // values from the presets
    gui.revert(1);

    // hide it if configured to be hidden
    if (!config.CONFIG_PANEL_VISIBLE) {
        setTimeout(function(){gui.close();}, 500);
    }

    // Gravity

    var grav_folder = gui.addFolder('Gravity');
    grav_folder.add(config, 'MAX_ACCEL', 0.0, 2.0)
        .step(0.01)
        .listen()
        .name('max accel')
        .onChange(_.partial(config.set_value, 'MAX_ACCEL'));

    grav_folder.add(config, 'CYCLE_ACCELERATION')
        .onChange(function(bool) {
            if (bool) timer.start_timer();
            else      timer.stop_timer();
        })
        .name('timed explosions');

    grav_folder.add(config, 'RANDOM_GRAVITY_VARIANCE', 0, 1)
        .step(0.01)
        .name('grav variation')
        .onChange(particles.set_mass_variance);

    // players

    var players_folder = gui.addFolder('Players');

    players_folder.add(players, 'smoothing', 0, 0.99)
        .step(0.01)
        .name('input smoothing')
        .onChange(players.set_smoothing);
    players_folder.add(players, 'size', 0, 256)
        .name('player size')
        .onChange(players.set_size);
    players_folder.add(players, 'count', 1, 3)
        .step(1)
        .name('player count')
        .onChange(players.set_count);
    if (config.INPUT_TYPE === 'mouse') {
        players_folder.add(players, 'activate_next_player')
            .name('Spacebar toggles player');
            document.body.onkeyup = function(e){
                if(e.keyCode == 32){
                    players.activate_next_player();
                }
            };
    }

    // Particles

    var particles_folder = gui.addFolder('Particles');

    // particles_folder.add(particles, 'count', 0, particles.count)
    //     .step(1000)
    //     .onChange(function (value) {
    //         particles.set_count(value);
    //     });
    particles_folder.add(particles, 'MAX_VEL', 0, 16)
        .name('max velocity');
    particles_folder.add(particles, 'MIN_ACCEL_DIST', 0, 200)
        .name('ring size');
    particles_folder.add(particles, 'size', 1, 64)
        .name('particle size')
        .onChange(particles.set_size);

    particles_folder.addColor(particle_colors, 'color0').onChange(particles.set_color0);
    particles_folder.addColor(particle_colors, 'color1').onChange(particles.set_color1);
    particles_folder.addColor(particle_colors, 'color2').onChange(particles.set_color2);

    // Info

    var info_folder = gui.addFolder('Info');
    info_folder.add({
        f: function() { window.open('http://palebluepixel.org/projects/dimo'); }
    }, 'f').name('More about this');
    info_folder.add({
        f: function() { window.open('https://github.com/geekspark-rh/dimo-renderer'); }
    }, 'f').name('View source');
    info_folder.add({
        f: function() { window.open('http://twitter.com/mwcz'); }
    }, 'f').name('Twitter @mwcz');

    grav_folder.open();
    players_folder.open();
    particles_folder.open();
    info_folder.open();

    gui.remember(config);
    gui.remember(players);
    gui.remember(gravity);
    gui.remember(particles);
    gui.remember(particle_colors);

    return gui;

}

define(deps, main);

})(window);
