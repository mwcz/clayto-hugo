"use strict";
var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      (descriptor.enumerable = descriptor.enumerable || !1),
        (descriptor.configurable = !0),
        "value" in descriptor && (descriptor.writable = !0),
        Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    return (
      protoProps && defineProperties(Constructor.prototype, protoProps),
      staticProps && defineProperties(Constructor, staticProps),
      Constructor
    );
  };
})();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor))
    throw new TypeError("Cannot call a class as a function");
}
var ParticleView = (function() {
  function ParticleView() {
    var _ref =
        0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
      _ref$size = _ref.size,
      size = void 0 === _ref$size ? 10 : _ref$size,
      _ref$count = _ref.count,
      count = void 0 === _ref$count ? 1e4 : _ref$count,
      _ref$fidget = _ref.fidget,
      fidget = void 0 === _ref$fidget ? {} : _ref$fidget,
      _ref$color = _ref.color,
      color = void 0 === _ref$color ? {} : _ref$color,
      _ref$tween = _ref.tween,
      tween = void 0 === _ref$tween ? {} : _ref$tween,
      _ref$flee = _ref.flee,
      flee = void 0 === _ref$flee ? {} : _ref$flee,
      _ref$canvas = _ref.canvas,
      canvas =
        void 0 === _ref$canvas ? { width: 400, height: 300 } : _ref$canvas,
      _ref$sprite = _ref.sprite,
      sprite = void 0 === _ref$sprite ? "spark1.png" : _ref$sprite;
    _classCallCheck(this, ParticleView),
      (this.count = count),
      (this.fidget = fidget),
      (this.tween = tween),
      (this.size = size),
      (this.color = color),
      (this.flee = flee),
      (this.canvas = canvas),
      (this.sprite = sprite),
      (flee.distance = flee.distance || 0),
      (flee.proximity = flee.proximity || 0),
      (flee.reflex = flee.reflex || 0),
      (fidget.speed = fidget.speed || 0.1),
      (fidget.distance = fidget.distance || 0.1),
      (tween.duration = tween.duration || 60),
      (tween.xfunc = tween.xfunc || Tween.easeInOutQuad),
      (tween.xfunc = tween.xfunc || Tween.easeInOutQuad),
      (tween.ofunc = tween.ofunc || Tween.linearTween),
      (color.top = new THREE.Color(color.top || "#FFFFFF")),
      (color.bottom = new THREE.Color(color.bottom || "#FFFFFF")),
      (color.background = new THREE.Color(color.background || "#000000")),
      this.init(),
      this.animate();
  }
  return (
    _createClass(ParticleView, [
      {
        key: "init",
        value: function() {
          var particleSystem,
            uniforms,
            renderer = void 0,
            scene = void 0,
            camera = void 0,
            geometry = void 0,
            WIDTH = this.canvas.width,
            HEIGHT = this.canvas.height;
          (this.heightScale = HEIGHT / 1e3),
            (this.widthScale = WIDTH / 1e3),
            (this.clock = new THREE.Clock()),
            ((camera = new THREE.PerspectiveCamera(
              40,
              WIDTH / HEIGHT,
              1,
              1e4
            )).position.z = 120),
            (scene = new THREE.Scene()),
            (uniforms = {
              color: { value: new THREE.Color(16777215) },
              texture: { value: new THREE.TextureLoader().load(this.sprite) }
            });
          var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader:
              "\n                attribute float size;\n                attribute float opacity;\n                attribute vec3 customColor;\n                varying vec3 vColor;\n                varying float vOpacity;\n                void main() {\n                    vColor = customColor;\n                    vOpacity = opacity;\n                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n                    gl_PointSize = size;\n                    gl_Position = projectionMatrix * mvPosition;\n                }\n            ",
            fragmentShader:
              "\n                uniform vec3 color;\n                uniform sampler2D texture;\n                varying vec3 vColor;\n                varying float vOpacity;\n                void main() {\n                    gl_FragColor = vec4( color * vColor, vOpacity );\n                    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );\n                }\n            ",
            blending: THREE.AdditiveBlending,
            depthTest: !1,
            transparent: !0
          });
          (geometry = new THREE.BufferGeometry()),
            (this.positions = new Float32Array(3 * this.count)),
            (this.destinations = new Float32Array(3 * this.count)),
            (this.fidgetSpeed = new Float32Array(3 * this.count)),
            (this.fidgetDistance = new Float32Array(3 * this.count)),
            (this.fleeOffset = new Float32Array(3 * this.count)),
            (this.fleeOffsetTarget = new Float32Array(3 * this.count)),
            (this.colors = new Float32Array(3 * this.count)),
            (this.colorTargets = new Float32Array(3 * this.count)),
            (this.opacity = new Float32Array(this.count)),
            (this.opacityDest = new Float32Array(this.count)),
            (this.tweenTimer = new Float32Array(this.count)),
            (this.tweenTimeScale = new Float32Array(this.count)),
            (this.sizes = new Float32Array(this.count));
          for (var i = 0, i3 = 0; i < this.count; i++, i3 += 3)
            (this.positions[i3 + 0] = 0),
              (this.positions[i3 + 1] = 0),
              (this.opacity[i] = 0),
              (this.fidgetSpeed[i3 + 0] =
                this.fidget.speed * Math.random() + 0.1),
              (this.fidgetSpeed[i3 + 1] =
                this.fidget.speed * Math.random() + 0.1),
              (this.fidgetSpeed[i3 + 2] = 0),
              (this.fidgetDistance[i3 + 0] =
                this.fidget.distance * (Math.random() - 0.5)),
              (this.fidgetDistance[i3 + 1] = this.fidgetDistance[i3 + 0]),
              (this.fidgetDistance[i3 + 2] = 0),
              (this.sizes[i] = this.getPointSize()),
              (this.tweenTimeScale[i] = Math.min(
                1,
                Math.max(0.5, Math.random())
              ));
          geometry.addAttribute(
            "position",
            new THREE.BufferAttribute(this.positions, 3)
          ),
            geometry.addAttribute(
              "customColor",
              new THREE.BufferAttribute(this.colors, 3)
            ),
            geometry.addAttribute(
              "opacity",
              new THREE.BufferAttribute(this.opacity, 1)
            ),
            geometry.addAttribute(
              "size",
              new THREE.BufferAttribute(this.sizes, 1)
            ),
            (particleSystem = new THREE.Points(geometry, shaderMaterial)),
            scene.add(particleSystem),
            (renderer = new THREE.WebGLRenderer({
              canvas: this.canvas.domElement
            })).setPixelRatio(window.devicePixelRatio),
            renderer.setSize(WIDTH, HEIGHT),
            renderer.domElement.setAttribute("style", ""),
            renderer.setClearColor(new THREE.Color(this.color.background)),
            (this.renderer = renderer),
            (this.scene = scene),
            (this.camera = camera),
            (this.particleSystem = particleSystem),
            (this.uniforms = uniforms),
            (this.geometry = geometry),
            this.setViewportRelativeFields(),
            this.initRaycaster(),
            this.initMouse();
        }
      },
      {
        key: "initMouse",
        value: function() {
          (this.mouseNDC = new THREE.Vector2(9999, 9999)),
            (this.mouse = new THREE.Vector2(9999, 9999)),
            (this.fleeVector = new THREE.Vector2()),
            (this.flyVector = new THREE.Vector2());
        }
      },
      {
        key: "getPointSize",
        value: function() {
          var maxSize = this.size.max,
            minSize = this.size.min;
          return minSize + (maxSize - minSize) * Math.random();
        }
      },
      {
        key: "onMouseMove",
        value: function(evt) {
          (this.mouseDetected = !0),
            evt.preventDefault(),
            (this.mouseNDC.x = (evt.clientX / window.innerWidth) * 2 - 1),
            (this.mouseNDC.y = (-evt.clientY / window.innerHeight) * 2 + 1);
        }
      },
      {
        key: "updateRaycaster",
        value: function() {
          if (this.mouseDetected) {
            this.raycaster.setFromCamera(this.mouseNDC, this.camera);
            var int = this.raycaster.intersectObject(this.mousePlane);
            int && int[0] && int[0].point && this.mouse.copy(int[0].point);
          }
        }
      },
      {
        key: "initRaycaster",
        value: function() {
          this.raycaster = new THREE.Raycaster();
          var geo = new THREE.PlaneGeometry(1e3, 1e3),
            mat = new THREE.MeshBasicMaterial({ visible: !1 });
          (this.mousePlane = new THREE.Mesh(geo, mat)),
            this.scene.add(this.mousePlane);
        }
      },
      {
        key: "render",
        value: function() {
          this.updateRaycaster(),
            this.updateTweenTimers(),
            this.updatePositionsTween(),
            this.updateOpacityTween(),
            this.updateColorTween(),
            this.updateFleeOffsets(),
            this.renderer.render(this.scene, this.camera);
        }
      },
      {
        key: "onWindowResize",
        value: function() {
          (this.heightScale = window.innerHeight / 1e3),
            (this.widthScale = window.innerWidth / 1e3),
            (this.camera.aspect = window.innerWidth / window.innerHeight),
            this.camera.updateProjectionMatrix(),
            this.renderer.setSize(window.innerWidth, window.innerHeight),
            this.setViewportRelativeFields();
        }
      },
      {
        key: "setViewportRelativeFields",
        value: function() {
          for (var i = 0, i3 = 0; i < this.count; i++, i3 += 3)
            (this.fidgetDistance[i3 + 0] =
              this.fidget.distance * (Math.random() - 0.5)),
              (this.fidgetDistance[i3 + 1] = this.fidgetDistance[i3 + 0]),
              (this.sizes[i] = this.getPointSize());
          this.geometry.attributes.size.needsUpdate = !0;
        }
      },
      {
        key: "animate",
        value: function() {
          requestAnimationFrame(this.animate.bind(this)), this.render();
        }
      },
      {
        key: "updateColorTween",
        value: function() {
          for (var i = 0, i3 = 0; i < this.count; i++, i3 += 3) {
            var c = this.colors[i],
              cTarget = this.colorTargets[i],
              t = this.tweenTimer[i] / this.tween.duration,
              cnew = (1 - t) * c + t * cTarget;
            this.geometry.attributes.customColor.array[i] = cnew;
          }
          this.geometry.attributes.customColor.needsUpdate = !0;
        }
      },
      {
        key: "updateOpacityTween",
        value: function() {
          for (var i = 0, i3 = 0; i < this.count; i++, i3 += 3) {
            var o = this.opacity[i],
              oDest = this.opacityDest[i],
              time = this.tweenTimer[i] * this.tweenTimeScale[i],
              onew = this.tween.ofunc(time, o, oDest - o, this.tween.duration);
            this.opacity[i] = onew;
          }
          this.geometry.attributes.opacity.needsUpdate = !0;
        }
      },
      {
        key: "updateFleeOffsets",
        value: function() {
          for (
            var F = this.flee.reflex, i = 0, i3 = 0;
            i < this.count;
            i++, i3 += 3
          ) {
            this.flyVector.set(this.positions[i3], this.positions[i3 + 1]),
              this.fleeVector.copy(this.mouse),
              this.fleeVector.sub(this.flyVector);
            var mouseDist = this.fleeVector.length(),
              distN =
                (this.flee.proximity -
                  Math.max(0, Math.min(this.flee.proximity, mouseDist))) /
                this.flee.proximity,
              I = this.tween.xfunc(distN, 0, 1, 1);
            this.fleeVector.normalize().multiplyScalar(-I * this.flee.distance),
              (this.fleeOffsetTarget[i3] = this.fleeVector.x),
              (this.fleeOffsetTarget[i3 + 1] = this.fleeVector.y),
              (this.fleeOffset[i3 + 0] =
                (1 - F) * this.fleeOffset[i3 + 0] +
                F * this.fleeOffsetTarget[i3 + 0]),
              (this.fleeOffset[i3 + 1] =
                (1 - F) * this.fleeOffset[i3 + 1] +
                F * this.fleeOffsetTarget[i3 + 1]);
          }
        }
      },
      {
        key: "updateTweenTimers",
        value: function() {
          for (var i = 0; i < this.count; i++)
            this.tweenTimer[i] = Math.min(
              this.tweenTimer[i] + 1,
              this.tween.duration
            );
        }
      },
      {
        key: "updatePositionsTween",
        value: function() {
          for (
            var t = this.clock.getElapsedTime(),
              fleeDistance =
                0 === this.flee.distance ? 0 : 1 / this.flee.distance,
              i = 0,
              i3 = 0;
            i < this.count && 0 !== this.opacity[i];
            i++, i3 += 3
          ) {
            var x = this.positions[i3 + 0],
              y = this.positions[i3 + 1],
              xdest = this.destinations[i3 + 0],
              ydest = this.destinations[i3 + 1],
              fleex = this.fleeOffset[i3 + 0],
              fleey = this.fleeOffset[i3 + 1],
              fsx = this.fidgetSpeed[i3 + 0],
              fsy = this.fidgetSpeed[i3 + 1],
              fdx = this.fidgetDistance[i3 + 0] * (1 + fleex * fleeDistance),
              fdy = this.fidgetDistance[i3 + 1] * (1 + fleey * fleeDistance),
              time = this.tweenTimer[i] * this.tweenTimeScale[i],
              travelx = this.tween.xfunc(
                time,
                x,
                xdest - x,
                this.tween.duration
              ),
              travely = this.tween.yfunc(
                time,
                y,
                ydest - y,
                this.tween.duration
              ),
              xnew = travelx + Math.sin(t * fsx) * fdx + fleex,
              ynew = travely - Math.cos(t * fsy) * fdy + fleey;
            (this.positions[i3 + 0] = xnew), (this.positions[i3 + 1] = ynew);
          }
          this.geometry.attributes.position.needsUpdate = !0;
        }
      },
      {
        key: "mouseFlee",
        value: function() {
          var x =
              0 < arguments.length && void 0 !== arguments[0]
                ? arguments[0]
                : 0,
            y =
              1 < arguments.length && void 0 !== arguments[1]
                ? arguments[1]
                : 0;
          return new THREE.Vector2(x, y);
        }
      },
      {
        key: "shape",
        value: function(dotterResult) {
          if (0 !== dotterResult.dots.length) {
            for (
              var w = dotterResult.original.canvas.el.width / 6,
                h = dotterResult.original.canvas.el.height / 6,
                color = new THREE.Color(),
                i = 0,
                i2 = 0,
                i3 = 0;
              i < this.count;
              i++, i2 += 2, i3 += 3
            )
              if (i2 < dotterResult.dots.length) {
                var x = dotterResult.dots[i2] - 0.5,
                  y = 0.5 - dotterResult.dots[i2 + 1];
                color
                  .copy(this.color.top)
                  .lerp(this.color.bottom, dotterResult.dots[i2 + 1]),
                  (this.colorTargets[i3 + 0] = color.r),
                  (this.colorTargets[i3 + 1] = color.g),
                  (this.colorTargets[i3 + 2] = color.b),
                  (this.destinations[i3] = x * w),
                  (this.destinations[i3 + 1] = y * h),
                  (this.opacityDest[i] = this.color.opacity);
              } else {
                var dotCount3 = (3 * dotterResult.dots.length) / 2;
                (this.destinations[i3] = this.destinations[
                  (i3 + 0) % dotCount3
                ]),
                  (this.destinations[i3 + 1] = this.destinations[
                    (i3 + 1) % dotCount3
                  ]),
                  (this.opacityDest[i] = 0);
              }
            (this.geometry.attributes.opacity.needsUpdate = !0),
              (this.geometry.attributes.customColor.needsUpdate = !0);
            for (var _i = 0; _i < this.tweenTimer.length; ++_i)
              this.tweenTimer[_i] = 200 * Math.random();
            this.tweenTimer.fill(0);
          } else console.log("[view] refusing to render empty dotterResult");
        }
      }
    ]),
    ParticleView
  );
})();
