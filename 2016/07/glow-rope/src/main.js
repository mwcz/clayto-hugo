var PARTICLE_DURATION = 3; // seconds
var MAX_PARTICLE_COUNT = 5000;
var ALIVE = 1;
var DEAD = 0;

var camera;
var scene;
var renderer;
var clock;
var timescale;
var particles = {};

var lastMouse = new THREE.Vector2(
  window.innerWidth / 2,
  window.innerHeight / 4
);

var particleGeometry;

var width = window.innerWidth;
var height = window.innerHeight;
var widthHalf = width / 2,
  heightHalf = height / 2;

var internet_traffic_source = new THREE.Vector2(widthHalf, heightHalf);

/**
 * Given a screen position (THREE.Vector2), convert that screen-space
 * coordinate into 3D world coordinate space.
 */
function toWorldCoords(position) {
  var vector = new THREE.Vector3();
  if (position) {
    var vector = new THREE.Vector3(position.x, position.y, 1);
    vector.x = (vector.x - widthHalf) / widthHalf;
    vector.y = (vector.y - heightHalf) / -heightHalf;
    vector.unproject(camera);
  }
  return vector;
}

/**
 * Given a world-space coordinate (THREE.Vector3), conver it into 2D screen
 * coordinate space.
 */
function toScreenCoords(object) {
  var vector = new THREE.Vector3();
  var projector = new THREE.Projector();
  vector.setFromMatrixPosition(object.matrixWorld);
  vector.project(camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;

  return vector;
}

init();
animate();

function init() {
  // camera

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 1000;

  // clock

  clock = new THREE.Clock();

  // scene and renderer

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: document.querySelector("canvas#traffic")
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0x1a0818, 0);

  //

  initParticles(particles);

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("touchmove", onMouseMove, false);
  window.addEventListener("click", onClick, false);
  window.addEventListener("touchstart", onClick, false);
  window.addEventListener(
    "mousedown",
    function() {
      return false;
    },
    false
  );
}

function initParticles(particles) {
  uniforms = {
    texture: {
      type: "t",
      value: new THREE.TextureLoader().load("./img/traffic-dot.png")
    },
    TIMER_MAX: { type: "f", value: PARTICLE_DURATION },
    vStartColor: { type: "c", value: new THREE.Color(0xff3d2b) },
    vEndColor: { type: "c", value: new THREE.Color(0x24b3e3) }
  };
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  var radius = 800;
  particleGeometry = new THREE.BufferGeometry();
  var alive = new Float32Array(MAX_PARTICLE_COUNT);
  var positions = new Float32Array(MAX_PARTICLE_COUNT * 3);
  var endPositions = new Float32Array(MAX_PARTICLE_COUNT * 3);
  var startColors = new Float32Array(MAX_PARTICLE_COUNT * 3);
  var endColors = new Float32Array(MAX_PARTICLE_COUNT * 3);
  var sizes = new Float32Array(MAX_PARTICLE_COUNT);
  var timer = new Float32Array(MAX_PARTICLE_COUNT);
  for (var i = 0, i3 = 0; i < MAX_PARTICLE_COUNT; i++, i3 += 3) {
    positions[i3 + 0] = 0;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = 1;
    endPositions[i3 + 0] = 0;
    endPositions[i3 + 1] = 0;
    endPositions[i3 + 2] = 1;
    sizes[i] = 50;
    alive[i] = 0;
    timer[i] = 0;
  }
  particleGeometry.addAttribute("alive", new THREE.BufferAttribute(alive, 1));
  particleGeometry.addAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particleGeometry.addAttribute(
    "endPosition",
    new THREE.BufferAttribute(endPositions, 3)
  );
  particleGeometry.addAttribute(
    "startColor",
    new THREE.BufferAttribute(startColors, 3)
  );
  particleGeometry.addAttribute(
    "endColor",
    new THREE.BufferAttribute(endColors, 3)
  );
  particleGeometry.addAttribute("size", new THREE.BufferAttribute(sizes, 1));
  particleGeometry.addAttribute("timer", new THREE.BufferAttribute(sizes, 1));
  particleSystem = new THREE.Points(particleGeometry, shaderMaterial);
  scene.add(particleSystem);
}

function findAvailableParticle() {
  return particleGeometry.attributes.alive.array.indexOf(DEAD);
}

function sendParticle(a, b) {
  var start_pos = toWorldCoords(a);
  var end_pos = toWorldCoords(b);
  var i1 = findAvailableParticle();
  var i3 = i1 * 3;

  // console.log(JSON.stringify({ start_pos, end_pos, start_color, end_color, i1 }, null, 4));

  // update particle attributes
  particleSystem.geometry.attributes.position.array[i3 + 0] = start_pos.x;
  particleSystem.geometry.attributes.position.array[i3 + 1] = start_pos.y;
  particleSystem.geometry.attributes.position.array[i3 + 2] = 1;

  particleSystem.geometry.attributes.endPosition.array[i3 + 0] = end_pos.x;
  particleSystem.geometry.attributes.endPosition.array[i3 + 1] = end_pos.y;
  particleSystem.geometry.attributes.endPosition.array[i3 + 2] = 1;

  // particleSystem.geometry.attributes.startColor.array[i3+0] = start_color.r;
  // particleSystem.geometry.attributes.startColor.array[i3+1] = start_color.g;
  // particleSystem.geometry.attributes.startColor.array[i3+2] = start_color.b;

  // particleSystem.geometry.attributes.endColor.array[i3+0] = end_color.r;
  // particleSystem.geometry.attributes.endColor.array[i3+1] = end_color.g;
  // particleSystem.geometry.attributes.endColor.array[i3+2] = end_color.b;

  particleSystem.geometry.attributes.timer.array[i1] = PARTICLE_DURATION;

  particleSystem.geometry.attributes.alive.array[i1] = ALIVE;
}

function updateParticles() {
  particleGeometry.attributes.alive.needsUpdate = true;
  particleGeometry.attributes.position.needsUpdate = true;
  particleGeometry.attributes.endPosition.needsUpdate = true;
  particleGeometry.attributes.timer.needsUpdate = true;

  updateParticleTimers();
}

function updateParticleTimers() {
  particleGeometry.attributes.timer.array.forEach(updateParticleTimer);
}

function updateParticleTimer(v, i, a) {
  if (v !== 0) {
    a[i] = v - timescale;
    if (a[i] <= 0) {
      a[i] = 0;
      particleSystem.geometry.attributes.alive.array[i] = DEAD;
    }
  }
}

function eventPoint(evt) {
  return {
    x: evt.clientX,
    y: evt.clientY
  };
}

function centerPoint(el) {
  var coords = el.getBoundingClientRect();
  return {
    x: (coords.left + coords.right) / 2,
    y: (coords.top + coords.bottom) / 2
  };
}

function onClick(evt) {
  // var coords_fixed =  toWorldCoords(new THREE.Vector2( 0, 0 ));
  // var coords = toWorldCoords( new THREE.Vector2(evt.clientX, evt.clientY) );

  internet_traffic_source = eventPoint(evt);
  // sendParticle( centerPoint(internet_traffic_source), eventPoint(evt) );
}

function getInitialPosition() {
  var blueCenter = centerPoint(document.querySelector(".commit-blue"));
  var coords2d = new THREE.Vector2(blueCenter.x, blueCenter.y);
  // var coords2d =  new THREE.Vector2( width * 0.77, height * 0.08 );
  var coords3d = toWorldCoords(coords2d);
  return coords3d;
}

function pinToFrustum(mesh, coords) {
  mesh.position.copy(coords);

  // pull towards camera to avoid clipping through frustum
  mesh.geometry.computeBoundingBox();
  mesh.position.z +=
    mesh.geometry.boundingBox.max.z - mesh.geometry.boundingBox.min.z;
}

function onMouseMove(evt) {
  lastMouse = new THREE.Vector2(evt.clientX, evt.clientY);
  var coords2d = new THREE.Vector2(evt.clientX, evt.clientY);
  var coords3d = toWorldCoords(coords2d);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  timescale = clock.getDelta();

  updateParticles();

  // stats.update();

  sendParticle(internet_traffic_source, lastMouse);

  renderer.render(scene, camera);
}
