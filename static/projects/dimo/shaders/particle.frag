
#define PI2 6.283185
#define PI  3.141592
#define HPI 1.57080
#define R_ADD 1.76714
#define G_ADD 3.92699
#define B_ADD 5.89048

uniform vec3 color;
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform sampler2D texture;

uniform float max_vel;
uniform float max_accel;

varying vec3 vel;
varying vec3 vColor;
varying float vel_m;
varying float accel_m;

vec3 cycler;
vec3 newcolor;
vec3 inactive_color = vec3(0.6, 0.6, 0.6);
vec3 color_cycle_add = vec3(R_ADD, G_ADD, B_ADD);

void main() {

    cycler = vec3(log(pow( vel_m, 0.25 )));
    cycler *= PI2;
    cycler += color_cycle_add;
    cycler = cos(cycler);
    cycler += 0.5;
    /* cycler /= 2.0; */

    newcolor = cycler.x * color0
             + cycler.y * color1
             + cycler.z * color2;

    /* cycler = vec3(accel_m*max_accel, accel_m*max_accel * PI, accel_m*max_accel * PI2); */
    /* cycler *= PI2; */
    /* cycler = sin(cycler); */
    /* cycler += inactive_color; */

    gl_FragColor = vec4(newcolor, 1.0) * texture2D( texture, gl_PointCoord );;
    /* gl_FragColor = vec4( color * vColor * vec3(accel_m / 1.0, accel_m / 2.0, accel_m / 3.0), 1.0 ) * texture2D( texture, gl_PointCoord );; */
    /* gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.7 ) * texture2D( texture, gl_PointCoord ); */

}
