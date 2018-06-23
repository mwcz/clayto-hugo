'use strict';

if (!Detector.webgl) Detector.addGetWebGLMessage();

// create a dotter

var dotter = new Dotter({
    jitter: 1.0,
    density: 0.095
});

// scale is broken in firefox/safari, disabling for now
// dotter.addFilter(Bitter.scale);
dotter.addFilter(Bitter.threshold);

// create a particle view

var view = new ParticleView({
    size: 14,
    count: 14000,
    color: {
        top: '#FFA317',
        bottom: '#E6141B',
        background: '#252142'
    },
    fidget: {
        speed: 2.4,
        distance: 1.9
    },
    tween: {
        duration: 500, // fps
        xfunc: Tween.easeInOutCubic,
        yfunc: Tween.easeInOutCubic,
        ofunc: Tween.easeInOutCubic
    }
});

// some images to start with

var previewImages = ['masks/fireflies.jpg', 'masks/heart.png', 'masks/spiral.png', 'masks/three.png', 'masks/face.png', 'masks/tux.jpg', 'masks/lorenschmidt.jpg'];

// start the Ui

var ui = new UI(previewImages);

// wire up ui to particleview

ui.onSetImage(function (img) {
    dotter.process(img).then(view.shape.bind(view));
});

// show the first image and start rotation
ui.setImageByIndex(0);
ui.startRotate();

// wirte up the flee from mouse checkbox

ui.onToggleFlee(function (evt) {
    if (evt.node.checked) {
        view.flee.distance = 16;
        view.flee.proximity = 40;
        view.flee.reflex = 0.06;
    } else {
        view.flee.distance = 0;
        view.flee.proximity = 0;
        view.flee.reflex = 0;
    }
});

// wire up drag and drop

var dz = new Drop({
    node: 'body',
    dropEffect: 'copy'
});

dz.ondragenter = function () {
    return console.log('[main] drag enter');
};
dz.ondragleave = function () {
    return console.log('[main] drag leave');
};
dz.ondrop = function (dropData) {
    dropData.files.forEach(function (f) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            var imgIndex = ui.addImage(reader.result);
            ui.stopRotate();
            ui.setImageByIndex(imgIndex);
        });
        reader.readAsDataURL(f.file);
    });
};

document.ondrop = document.ondragover = function (e) {
    e.preventDefault();
};