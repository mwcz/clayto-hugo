/* global requirejs */

// For any third party dependencies, like jQuery, place them in the lib folder.
// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

requirejs.config({
    baseUrl: '.',
    paths: {
        shaders    : 'shaders',
        text       : 'lib/requirejs/plugins/text',
        three      : 'lib/threejs/three',
        stats      : 'lib/threejs/stats.min',
        underscore : 'lib/underscore/underscore',
        glmatrix   : 'lib/glMatrix/gl-matrix',
        datgui     : 'lib/dat.gui/dat.gui',
    },
    shim: {
        'three'  : { exports: 'THREE', },
        'stats'  : { exports: 'Stats', deps: ['three'] },
        'datgui' : { exports: 'dat' },
    },
    packages: [
        {
            name     : 'dimo',
            location : 'js',
            main     : 'main.min',
        },
    ],
});

// This is just a config file, but it's also the main entry point for the app
// (via requirejs's data-main script attribute), so we'll go ahead and launch
// the app from here.

requirejs(['dimo']);

