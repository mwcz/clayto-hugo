'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleView = function () {
    function ParticleView() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$size = _ref.size,
            size = _ref$size === undefined ? 10 : _ref$size,
            _ref$count = _ref.count,
            count = _ref$count === undefined ? 10000 : _ref$count,
            _ref$fidget = _ref.fidget,
            fidget = _ref$fidget === undefined ? {} : _ref$fidget,
            _ref$color = _ref.color,
            color = _ref$color === undefined ? {} : _ref$color,
            _ref$tween = _ref.tween,
            tween = _ref$tween === undefined ? {} : _ref$tween,
            _ref$flee = _ref.flee,
            flee = _ref$flee === undefined ? {} : _ref$flee,
            _ref$canvas = _ref.canvas,
            canvas = _ref$canvas === undefined ? { width: 400, height: 300 } : _ref$canvas,
            _ref$sprite = _ref.sprite,
            sprite = _ref$sprite === undefined ? 'spark1.png' : _ref$sprite;

        _classCallCheck(this, ParticleView);

        this.count = count;
        this.fidget = fidget;
        this.tween = tween;
        this.size = size;
        this.color = color;
        this.flee = flee;
        this.canvas = canvas;
        this.sprite = sprite;

        flee.distance = flee.distance || 0;
        flee.proximity = flee.proximity || 0;
        flee.reflex = flee.reflex || 0;

        fidget.speed = fidget.speed || 0.1;
        fidget.distance = fidget.distance || 0.1;

        tween.duration = tween.duration || 60;
        tween.xfunc = tween.xfunc || Tween.easeInOutQuad;
        tween.xfunc = tween.xfunc || Tween.easeInOutQuad;
        tween.ofunc = tween.ofunc || Tween.linearTween;

        color.top = new THREE.Color(color.top || '#FFFFFF');
        color.bottom = new THREE.Color(color.bottom || '#FFFFFF');
        color.background = new THREE.Color(color.background || '#000000');

        this.init();
        this.animate();
    }

    _createClass(ParticleView, [{
        key: 'init',
        value: function init() {
            var renderer = void 0,
                scene = void 0,
                camera = void 0;
            var particleSystem = void 0,
                uniforms = void 0,
                geometry = void 0;
            var WIDTH = this.canvas.width;
            var HEIGHT = this.canvas.height;
            this.heightScale = HEIGHT / 1000;
            this.widthScale = WIDTH / 1000;
            this.clock = new THREE.Clock();
            camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
            camera.position.z = 120;
            scene = new THREE.Scene();
            uniforms = {
                color: { value: new THREE.Color(0xffffff) },
                texture: { value: new THREE.TextureLoader().load(this.sprite) }
            };
            var shaderMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: '\n                attribute float size;\n                attribute float opacity;\n                attribute vec3 customColor;\n                varying vec3 vColor;\n                varying float vOpacity;\n                void main() {\n                    vColor = customColor;\n                    vOpacity = opacity;\n                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n                    gl_PointSize = size * ( 300.0 / -mvPosition.z );\n                    gl_Position = projectionMatrix * mvPosition;\n                }\n            ',
                fragmentShader: '\n                uniform vec3 color;\n                uniform sampler2D texture;\n                varying vec3 vColor;\n                varying float vOpacity;\n                void main() {\n                    gl_FragColor = vec4( color * vColor, vOpacity );\n                    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );\n                }\n            ',
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true
            });
            var radius = 200;
            geometry = new THREE.BufferGeometry();
            this.positions = new Float32Array(this.count * 3);
            this.destinations = new Float32Array(this.count * 3);
            this.fidgetSpeed = new Float32Array(this.count * 3);
            this.fidgetDistance = new Float32Array(this.count * 3);
            this.fleeOffset = new Float32Array(this.count * 3);
            this.fleeOffsetTarget = new Float32Array(this.count * 3);
            this.colors = new Float32Array(this.count * 3);
            this.colorTargets = new Float32Array(this.count * 3);
            this.opacity = new Float32Array(this.count);
            this.opacityDest = new Float32Array(this.count);
            this.tweenTimer = new Float32Array(this.count);
            this.tweenTimeScale = new Float32Array(this.count);
            this.sizes = new Float32Array(this.count);
            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                ;
                // this.positions[ i3 + 0 ]      = (1 + Math.cos((Math.PI*( Math.random() * 2 - 1 )))) / (2*Math.PI);
                // this.positions[ i3 + 1 ]      = (1 + Math.cos((Math.PI*( Math.random() * 2 - 1 )))) / (2*Math.PI);
                this.positions[i3 + 0] = 0;
                this.positions[i3 + 1] = 0;
                this.opacity[i] = 0;
                this.fidgetSpeed[i3 + 0] = this.fidget.speed * Math.random() + 0.1;
                this.fidgetSpeed[i3 + 1] = this.fidget.speed * Math.random() + 0.1;
                this.fidgetSpeed[i3 + 2] = 0;
                this.fidgetDistance[i3 + 0] = this.fidget.distance * (Math.random() - 0.5);
                this.fidgetDistance[i3 + 1] = this.fidgetDistance[i3 + 0];
                this.fidgetDistance[i3 + 2] = 0;
                // this.colors[ i3 + 0 ]      = color.r;
                // this.colors[ i3 + 1 ]      = color.g;
                // this.colors[ i3 + 2 ]      = color.b;
                // this.sizes[ i ]               = this.widthScale * this.size + Math.random()*this.size/2;
                this.sizes[i] = this.getPointSize(window.innerWidth);
                this.tweenTimeScale[i] = Math.min(1.0, Math.max(0.5, Math.random()));
            }
            geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
            geometry.addAttribute('opacity', new THREE.BufferAttribute(this.opacity, 1));
            geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
            particleSystem = new THREE.Points(geometry, shaderMaterial);
            scene.add(particleSystem);
            renderer = new THREE.WebGLRenderer({ canvas: this.canvas.domElement });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(WIDTH, HEIGHT);
            renderer.domElement.setAttribute('style', ''); // width/height attributes are fine, but we want to clear the style attributes so the element can be resized and retain aspect ratio
            renderer.setClearColor(new THREE.Color(this.color.background));
            // this.canvas.container.removeChild(this.canvas.container.querySelector('img.placeholder')); // remove the placeholder img
            // this.canvas.container.appendChild( renderer.domElement );
            //
            // window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
            this.renderer = renderer;
            this.scene = scene;
            this.camera = camera;
            this.particleSystem = particleSystem;
            this.uniforms = uniforms;
            this.geometry = geometry;
            this.setViewportRelativeFields();
            this.initRaycaster();
            this.initMouse();
        }
    }, {
        key: 'initMouse',
        value: function initMouse() {
            this.mouseNDC = new THREE.Vector2(9999, 9999); // Normalized Device Coordinates
            this.mouse = new THREE.Vector2(9999, 9999);
            this.fleeVector = new THREE.Vector2();
            this.flyVector = new THREE.Vector2();
            // document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        }
    }, {
        key: 'getPointSize',
        value: function getPointSize(width) {
            var maxSize = this.size.max;
            var minSize = this.size.min;
            var maxWidth = this.size.maxWidth;
            var minWidth = this.size.minWidth;

            var spread = this.size.spread;

            return (width - minWidth) * (maxSize - minSize) / (maxWidth - minWidth) + minSize + Math.random() * spread - spread / 2;
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(evt) {
            this.mouseDetected = true;
            evt.preventDefault();
            this.mouseNDC.x = evt.clientX / window.innerWidth * 2 - 1;
            this.mouseNDC.y = -(evt.clientY / window.innerHeight) * 2 + 1;
        }
    }, {
        key: 'updateRaycaster',
        value: function updateRaycaster() {
            if (this.mouseDetected) {
                this.raycaster.setFromCamera(this.mouseNDC, this.camera);
                var int = this.raycaster.intersectObject(this.mousePlane);
                if (int && int[0] && int[0].point) {
                    this.mouse.copy(int[0].point);
                }
            }
        }
    }, {
        key: 'initRaycaster',
        value: function initRaycaster() {
            // make an invisible plane to shoot rays at
            this.raycaster = new THREE.Raycaster();
            var geo = new THREE.PlaneGeometry(1000, 1000);
            var mat = new THREE.MeshBasicMaterial({ visible: false });
            this.mousePlane = new THREE.Mesh(geo, mat);
            this.scene.add(this.mousePlane);
        }
    }, {
        key: 'render',
        value: function render() {
            this.updateRaycaster();
            this.updateTweenTimers();
            this.updatePositionsTween();
            this.updateOpacityTween();
            this.updateColorTween();
            this.updateFleeOffsets();
            this.renderer.render(this.scene, this.camera);
        }
    }, {
        key: 'onWindowResize',
        value: function onWindowResize() {
            this.heightScale = window.innerHeight / 1000;
            this.widthScale = window.innerWidth / 1000;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.setViewportRelativeFields();
        }
    }, {
        key: 'setViewportRelativeFields',
        value: function setViewportRelativeFields() {
            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                this.fidgetDistance[i3 + 0] = this.fidget.distance * (Math.random() - 0.5);
                this.fidgetDistance[i3 + 1] = this.fidgetDistance[i3 + 0];
                this.sizes[i] = this.getPointSize(window.innerWidth);
            }
            this.geometry.attributes.size.needsUpdate = true;
        }
    }, {
        key: 'animate',
        value: function animate() {
            requestAnimationFrame(this.animate.bind(this));
            this.render();
        }
    }, {
        key: 'updateColorTween',
        value: function updateColorTween() {
            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                var c = this.colors[i];
                var cTarget = this.colorTargets[i];
                var time = this.tweenTimer[i];
                // const cnew = this.tween.ofunc(time, c, cTarget-c, this.tween.duration);
                var t = time / this.tween.duration;
                var cnew = (1 - t) * c + t * cTarget;
                this.geometry.attributes.customColor.array[i] = cnew;
            }
            this.geometry.attributes.customColor.needsUpdate = true;
        }
    }, {
        key: 'updateOpacityTween',
        value: function updateOpacityTween() {
            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                var o = this.opacity[i];
                var oDest = this.opacityDest[i];
                var time = this.tweenTimer[i] * this.tweenTimeScale[i];
                var onew = this.tween.ofunc(time, o, oDest - o, this.tween.duration);
                this.opacity[i] = onew;
            }
            this.geometry.attributes.opacity.needsUpdate = true;
        }
    }, {
        key: 'updateFleeOffsets',
        value: function updateFleeOffsets() {
            var F = this.flee.reflex;
            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                this.flyVector.set(this.positions[i3], this.positions[i3 + 1]);
                this.fleeVector.copy(this.mouse);

                this.fleeVector.sub(this.flyVector);

                var mouseDist = this.fleeVector.length();
                var distN = (this.flee.proximity - Math.max(0, Math.min(this.flee.proximity, mouseDist))) / this.flee.proximity; // normalized distance

                var I = this.tween.xfunc(distN, 0, 1, 1);

                this.fleeVector.normalize().multiplyScalar(-I * this.flee.distance);
                // this.fleeVector.normalize().multiplyScalar(-I * this.flee.distance * this.fidgetSpeed[i3]);

                this.fleeOffsetTarget[i3] = this.fleeVector.x;
                this.fleeOffsetTarget[i3 + 1] = this.fleeVector.y;

                this.fleeOffset[i3 + 0] = (1 - F) * this.fleeOffset[i3 + 0] + F * this.fleeOffsetTarget[i3 + 0];
                this.fleeOffset[i3 + 1] = (1 - F) * this.fleeOffset[i3 + 1] + F * this.fleeOffsetTarget[i3 + 1];
            }
        }
    }, {
        key: 'updateTweenTimers',
        value: function updateTweenTimers() {
            for (var i = 0; i < this.count; i++) {
                this.tweenTimer[i] = Math.min(this.tweenTimer[i] + 1, this.tween.duration);
            }
        }
    }, {
        key: 'updatePositionsTween',
        value: function updatePositionsTween() {
            var t = this.clock.getElapsedTime();
            var fleeDistance = this.flee.distance === 0 ? 0 : 1 / this.flee.distance;
            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                if (this.opacity[i] === 0) break;
                var x = this.positions[i3 + 0];
                var y = this.positions[i3 + 1];
                var xdest = this.destinations[i3 + 0];
                var ydest = this.destinations[i3 + 1];
                var fleex = this.fleeOffset[i3 + 0];
                var fleey = this.fleeOffset[i3 + 1];
                var fsx = this.fidgetSpeed[i3 + 0];
                var fsy = this.fidgetSpeed[i3 + 1];
                var fdx = this.fidgetDistance[i3 + 0] * (1 + fleex * fleeDistance);
                var fdy = this.fidgetDistance[i3 + 1] * (1 + fleey * fleeDistance);
                var time = this.tweenTimer[i] * this.tweenTimeScale[i];
                var travelx = this.tween.xfunc(time, x, xdest - x, this.tween.duration);
                var travely = this.tween.yfunc(time, y, ydest - y, this.tween.duration);
                var fidgetx = Math.sin(t * fsx) * fdx;
                var fidgety = Math.cos(t * fsy) * fdy;
                var xnew = travelx + fidgetx + fleex;
                var ynew = travely - fidgety + fleey;
                this.positions[i3 + 0] = xnew;
                this.positions[i3 + 1] = ynew;
            }
            this.geometry.attributes.position.needsUpdate = true;
        }
    }, {
        key: 'mouseFlee',
        value: function mouseFlee() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var m = new THREE.Vector2(x, y);
            return m;
        }
    }, {
        key: 'shape',
        value: function shape(dotterResult) {
            if (dotterResult.dots.length === 0) {
                console.log('[view] refusing to render empty dotterResult');
                return;
            }
            var w = dotterResult.original.canvas.el.width / 6;
            var h = dotterResult.original.canvas.el.height / 6;
            var color = new THREE.Color();

            // for (let i = 0; i < dotterResult.dots.length; i += 2) {
            //     const i3 = i * 3/2;
            //     const x = dotterResult.dots[i] - 0.5;
            //     const y = -dotterResult.dots[i+1] + 0.5;

            //     this.destinations[i3]   = x * w;
            //     this.destinations[i3+1] = y * h;
            // }
            for (var i = 0, i2 = 0, i3 = 0; i < this.count; i++, i2 = i2 + 2, i3 = i3 + 3) {
                if (i2 < dotterResult.dots.length) {
                    // update destinations for each particle which has a corresponding destination
                    var x = dotterResult.dots[i2] - 0.5;
                    var y = -dotterResult.dots[i2 + 1] + 0.5;

                    color.copy(this.color.top).lerp(this.color.bottom, dotterResult.dots[i2 + 1]);
                    this.colorTargets[i3 + 0] = color.r;
                    this.colorTargets[i3 + 1] = color.g;
                    this.colorTargets[i3 + 2] = color.b;

                    this.destinations[i3] = x * w;
                    this.destinations[i3 + 1] = y * h;
                    this.opacityDest[i] = 1;
                } else {
                    var dotCount3 = dotterResult.dots.length * 3 / 2;
                    // for particles without a destination in this mask image, hide
                    // them and move them to the same location as a living particle
                    this.destinations[i3] = this.destinations[(i3 + 0) % dotCount3];
                    this.destinations[i3 + 1] = this.destinations[(i3 + 1) % dotCount3];
                    this.opacityDest[i] = 0;
                }
            }
            this.geometry.attributes.opacity.needsUpdate = true;
            this.geometry.attributes.customColor.needsUpdate = true;

            // refresh the tween timers
            for (var _i = 0; _i < this.tweenTimer.length; ++_i) {
                this.tweenTimer[_i] = Math.random() * 200;
                // this.tweenTimer[ i ] = 0;
            }
            this.tweenTimer.fill(0);
        }
    }]);

    return ParticleView;
}();