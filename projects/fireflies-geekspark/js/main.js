"use strict";
Detector.webgl || Detector.addGetWebGLMessage();
var dotter = new Dotter({ jitter: 0.8, density: 0.215 });
dotter.addFilter(Bitter.scale);
var view = new ParticleView({
    size: { max: 28, min: 18 },
    count: 15e3,
    color: {
      top: "#3153A9",
      bottom: "#FB9034",
      background: "#000000",
      opacity: 0.9
    },
    fidget: { speed: 2.4, distance: 0.8 },
    tween: {
      duration: 300,
      xfunc: Tween.easeInOutCubic,
      yfunc: Tween.easeInOutCubic,
      ofunc: Tween.easeInOutCubic
    },
    canvas: {
      width: 1920,
      height: 1080,
      domElement: document.querySelector("#fireflies-canvas")
    },
    sprite: "pixel.png"
  }),
  masks = [
    "masks/sparkcon.jpg",
    "masks/sparky.png",
    "masks/geekspark-fireflies.png",
    "masks/vr.png",
    "masks/science-wiz.png",
    "masks/dimo.png",
    "masks/mushroom.png",
    "masks/sparkconquest.png",
    "masks/1dpong.png",
    "masks/bixel.png"
  ],
  i = 0,
  tid = 0,
  next = function next() {
    dotter.process(masks[i]).then(view.shape.bind(view)),
      (i += 1),
      (i %= masks.length),
      tid &&
        (clearTimeout(tid),
        console.log("[main] cleared pending mask (tid: " + tid + ")")),
      (tid = setTimeout(next, 8e3));
  };
next(), view.renderer.domElement.addEventListener("click", next);
