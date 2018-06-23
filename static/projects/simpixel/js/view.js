"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
    function View() {
        var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

        _classCallCheck(this, View);

        if (typeof parent === 'string') {
            // selector
            this.parent = document.querySelector(parent);
        } else {
            // node
            this.parent = parent;
        }
    }

    _createClass(View, [{
        key: "init",
        value: function init(positions) {
            this.WIDTH = this.parent.offsetWidth;
            this.HEIGHT = this.parent.offsetHeight;
            this.sizeDefault = 5;
            this.count = positions.length / 3;
            this.heightScale = Math.max(this.HEIGHT / 1000, 1);
            this.widthScale = this.WIDTH / 1000;
            this.camera = new THREE.PerspectiveCamera(40, this.WIDTH / this.HEIGHT, 1, 10000);
            this.camera.position.z = 400;
            this.scene = new THREE.Scene();

            this.uniforms = {
                size: { value: this.sizeDefault },
                color: { value: new THREE.Color(0xffffff) },
                textureOn: { value: new THREE.TextureLoader().load("/static/projects/simpixel/sprites/led-on.png") },
                textureOff: { value: new THREE.TextureLoader().load("/static/projects/simpixel/sprites/led-off.png") }
            };
            this.material = new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: document.getElementById('vertexshader').textContent,
                fragmentShader: document.getElementById('fragmentshader').textContent,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true
            });
            this.geometry = new THREE.BufferGeometry();
            this.positions = new Float32Array(this.count * 3);
            this.colors = new Float32Array(this.count * 3);
            this.positions.set(positions);
            this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
            this.particleSystem = new THREE.Points(this.geometry, this.material);
            this.scene.add(this.particleSystem);

            // calculate ideal camera distance
            this.geometry.computeBoundingBox();
            var width = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
            var height = this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;
            var depth = this.geometry.boundingBox.max.z - this.geometry.boundingBox.min.z;
            var widthHalf = width / 2;
            var heightHalf = height / 2;
            var depthHalf = depth / 2;
            var cam_z_height = height / Math.tan(Math.PI * this.camera.fov / 360) * 0.6;
            var cam_z_width = width / Math.cos(Math.PI * this.camera.fov / 360) * 1.4;
            // Position camera to fit whichever dimension is larger
            // Add the depth to that the camera is not in the center of a 3D object
            this.camera.position.z = (cam_z_height >= cam_z_width ? cam_z_height : cam_z_width) + depth + 10;

            for (var i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3) {
                this.positions[i3 + 0] -= widthHalf;
                this.positions[i3 + 1] -= heightHalf;
                this.positions[i3 + 2] -= depthHalf;

                this.colors[i3 + 0] = 1;
                this.colors[i3 + 1] = 1;
                this.colors[i3 + 2] = 1;
            }

            this.adjustViewportFields();

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setClearColor(new THREE.Color('#121212'));
            this.renderer.setSize(this.WIDTH, this.HEIGHT);
            this.parent.appendChild(this.renderer.domElement);
            //
            window.addEventListener('resize', this.onWindowResize.bind(this), false);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableZoom = false;

            // start animation loop
            this.animate();
        }
    }, {
        key: "render",
        value: function render() {
            this.renderer.render(this.scene, this.camera);
        }
    }, {
        key: "animate",
        value: function animate() {
            requestAnimationFrame(this.animate.bind(this));
            this.render();
        }
        /**
         * @param {Uint8Array} colors new LED colors
         */

    }, {
        key: "update",
        value: function update(colors) {
            this.colors.set(colors);
            // for ( let i = 0, i3 = 0; i < this.count; i++, i3 = i3 + 3 ) {
            //     this.colors[ i3 + 0 ] = (Math.random() + 0.5);
            //     this.colors[ i3 + 1 ] = (Math.random() + 0.5);
            //     this.colors[ i3 + 2 ] = (Math.random() + 0.5);
            // }
            this.geometry.attributes.customColor.needsUpdate = true;
            this.particleSystem.rotation.y += Math.PI / 2048;
        }
    }, {
        key: "onWindowResize",
        value: function onWindowResize() {
            this.WIDTH = this.parent.offsetWidth;
            this.HEIGHT = this.parent.offsetHeight;
            this.widthScale = this.WIDTH / 1000;
            this.heightScale = Math.max(this.HEIGHT / 1000, 1);
            this.camera.aspect = this.WIDTH / this.HEIGHT;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.WIDTH, this.HEIGHT);
            this.adjustViewportFields();
        }
    }, {
        key: "adjustViewportFields",
        value: function adjustViewportFields() {
            this.material.uniforms.size.value = this.sizeDefault * this.heightScale;
        }
    }, {
        key: "destroy",
        value: function destroy() {
            console.error('View.destroy NOT IMPLEMENTED');
        }
    }]);

    return View;
}();
