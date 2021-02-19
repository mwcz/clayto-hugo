"use strict";
Detector.webgl || Detector.addGetWebGLMessage();
var dotter = new Dotter({ jitter: 1.2, density: 0.28 });
dotter.addFilter(Bitter.scale);
var view = new ParticleView({
    size: { min: 12, max: 20 },
    count: 18e3,
    color: {
      top: "#FFEC21",
      bottom: "#39AD10",
      background: "#191F16",
      opacity: 0.9,
    },
    fidget: { speed: 1, distance: 0.6 },
    tween: {
      duration: 300,
      xfunc: Tween.easeInOutCubic,
      yfunc: Tween.easeInOutCubic,
      ofunc: Tween.easeInOutCubic,
    },
    canvas: {
      width: 1920,
      height: 1080,
      domElement: document.querySelector("#fireflies-canvas"),
    },
    sprite: "hand.png",
    flee: { distance: 5, proximity: 40, reflex: 0.03 },
  }),
  masks = [
    "masks/ian/1.png",
    "masks/ian/2.png",
    "masks/ian/3.png",
    "masks/ian/4.png",
    "masks/ian/5.png",
    "masks/ian/6.png",
    "masks/ian/7.png",
    "masks/ian/8.png",
    "masks/ian/9.png",
  ],
  i = 0,
  tid = 0,
  next = function next() {
    dotter.process(masks[i]).then(view.shape.bind(view)),
      (i += 1),
      tid &&
        (clearTimeout(tid),
        console.log("[main] cleared pending mask (tid: " + tid + ")")),
      i < masks.length && (tid = setTimeout(next, 7e3));
  };
next();
