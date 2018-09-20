
uniform float max_vel;
uniform float max_accel;

attribute float size;
attribute vec3 customColor;
attribute vec3 acceleration;
attribute vec3 velocity;
attribute float vel_mag;
attribute float accel_mag;

varying vec3 vColor;
varying vec3 vel;
varying float vel_m;
varying float accel_m;

void main() {

    vColor  = customColor;
    vel     = velocity;
    vel_m   = vel_mag / max_vel;
    accel_m = accel_mag;// / max_accel;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = size;//min(size, size*(1.0/accel_m));

}
