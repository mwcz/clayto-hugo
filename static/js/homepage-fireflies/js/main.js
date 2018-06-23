'use strict';

if (!Detector.webgl) Detector.addGetWebGLMessage();

// create a dotter

var dotter = new Dotter({
    jitter: 0.8,
    density: 0.195
});

// scale is broken in firefox/safari, disabling for now
// dotter.addFilter(Bitter.scale);
// dotter.addFilter(Bitter.threshold);

// create a particle view

var view = new ParticleView({
    size: {
        max: 12,
        min: 20,
        maxWidth: 1920,
        minWidth: 400,
        spread: 4
    },
    count: 6000,
    color: {
        top: '#ADCFFF',
        bottom: '#27508A',
        background: '#000000'
        // background: '#121212',
    },
    fidget: {
        speed: 2.4,
        distance: 1.8
    },
    tween: {
        duration: 400, // fps
        xfunc: Tween.easeInOutCubic,
        yfunc: Tween.easeInOutCubic,
        ofunc: Tween.easeInOutCubic
    },
    canvas: {
        width: 1920,
        height: 640,
        domElement: document.querySelector('#fireflies-canvas')
    },
    sprite: '/static/js/homepage-fireflies/pixel.png'
    // flee: {
    //     distance: 5,
    //     proximity: 40,
    //     reflex: 0.03,
    // },
});

// rotate through these pictures

var masks = ['/static/js/homepage-fireflies/masks/pbp.png', '/static/js/homepage-fireflies/masks/js.png', '/static/js/homepage-fireflies/masks/wasm.png', '/static/js/homepage-fireflies/masks/tux.png'];

// wire up ui to particleview

// process first mask
// rotate through subsequent masks on a timer
var i = 0;
var tid = 0;
var next = function next() {
    dotter.process(masks[i]).then(view.shape.bind(view));
    i += 1;
    i %= masks.length;
    if (tid) {
        clearTimeout(tid);
        console.log('[main] cleared pending mask (tid: ' + tid + ')');
    }
    tid = setTimeout(next, 10000);
};
next();
view.renderer.domElement.addEventListener('click', next);