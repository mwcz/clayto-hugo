/* global define */
/* jshint browser: true */

(function () {

var deps = [
    'three',
    'dimo/config',
    'dimo/viewport',
    'dimo/origin',
    'dimo/gravity',
    'dimo/particle_colors',
    'dimo/players',
    'dimo/mouse',
    'text!shaders/vertex.vert',
    'text!shaders/particle.frag',
    'glmatrix',
    'underscore',
];

function main(
    THREE,
    config,
    vp,
    origin,
    grav,
    colors,
    players,
    mouse,
    vert,
    frag,
    m,
    _
) {

    function get_random_mass(s) {
        // get random mass based on s, a scale factor
        return config.G * Math.random() * (s) + config.G * (1 - s);
    }

    var P = {};

    var i30    = 0;
    var i31    = 1;

    P.MAX_VEL = 4;
    P.count   = 1e5/4;
    P.size    = 8;

    var accd  = 1.75; // how much the acceleration is allowed to change each frame
    var accdh = accd / 2;

    P.geometry = new THREE.BufferGeometry();

    // THREE.NoBlending
    // THREE.NormalBlending
    // THREE.AdditiveBlending
    // THREE.SubtractiveBlending
    // THREE.MultiplyBlending

    var attributes = {
        size         : { type : 'f',  value : null },
        customColor  : { type : 'c',  value : null },
        acceleration : { type : 'v3', value : null },
        velocity     : { type : 'v3', value : null },
        accel_mag    : { type : 'v',  value : null },
        vel_mag      : { type : 'v',  value : null },
    };

    P.uniforms = {
        color     : { type : 'c',  value : new THREE.Color( 0xffffff ) },
        color0    : { type : 'c',  value : colors.color0 },
        color1    : { type : 'c',  value : colors.color1 },
        color2    : { type : 'c',  value : colors.color2 },
        texture   : { type : 't',  value : THREE.ImageUtils.loadTexture( 'img/particle-wide-glow.png' ) },
        max_vel   : { type : 'f',  value : P.MAX_VEL },
        max_accel : { type : 'f',  value : config.MAX_ACCEL },
        mouse     : { type : 'v2', value : new THREE.Vector2() },
    };

    P.material = new THREE.ShaderMaterial( {

        uniforms       : P.uniforms,
        attributes     : attributes,
        vertexShader   : vert,
        fragmentShader : frag,
        blending       : THREE.AdditiveBlending,
        depthTest      : false,
        transparent    : true

    } );

    P.positions  = new Float32Array( P.count * 3 );
    P.colors     = new Float32Array( P.count * 3 );
    P.velocities = new Float32Array( P.count * 3 );
    P.sizes      = new Float32Array( P.count );
    P.mass       = new Float32Array( P.count );
    P.accel_mag  = new Float32Array( P.count );
    P.vel_mag    = new Float32Array( P.count );

    var color;

    for (var v = P.count - 1; v >= 0; v--) {

        P.sizes[ v ] = P.size;

        P.positions[ v * 3 + 0 ] = ( Math.random() * accd - accdh ) * vp.WIDTH  / 1.5;
        P.positions[ v * 3 + 1 ] = ( Math.random() * accd - accdh ) * vp.HEIGHT / 1.5;
        P.positions[ v * 3 + 2 ] = 0; // z is fixed

        color = colors[ 'color' + v % colors.length ];

        P.colors[ v * 3 + 0 ] = color.r;
        P.colors[ v * 3 + 1 ] = color.g;
        P.colors[ v * 3 + 2 ] = color.b;

        P.mass[ v ] = get_random_mass(config.RANDOM_GRAVITY_VARIANCE);

        P.velocities[ v * 3 + 0 ] = 0;
        P.velocities[ v * 3 + 1 ] = 0;
        // These two begin floating slightly away from the origin
        // P.velocities[ v * 3 + 0 ] = P.positions[ v * 3 + 0] / vp.WIDTH;//( Math.random() * accd - accdh ) * vp.WIDTH;
        // P.velocities[ v * 3 + 1 ] = P.positions[ v * 3 + 1] / vp.HEIGHT;//( Math.random() * accd - accdh ) * vp.WIDTH;
        // These two are semi-circular initial orbit
        // P.velocities[ v * 3 + 0 ] = P.positions[v*3] * P.positions[v*3]/Math.abs(P.positions[v*3]) *P.positions[v*3+1]/Math.abs(P.positions[v*3+1]);//P.positions[ v * 3 + 0] / vp.WIDTH;
        // P.velocities[ v * 3 + 1 ] = -1*P.positions[v*3+1] * P.positions[v*3]/Math.abs(P.positions[v*3]) *P.positions[v*3+1]/Math.abs(P.positions[v*3+1]);//P.positions[ v * 3 + 0] / vp.WIDTH;
        P.velocities[ v * 3 + 2 ] = 0; // z is fixed

    }

    P.geometry.addAttribute( 'position'    , new THREE.BufferAttribute( P.positions  , 3 ) );
    P.geometry.addAttribute( 'customColor' , new THREE.BufferAttribute( P.colors     , 3 ) );
    P.geometry.addAttribute( 'velocity'    , new THREE.BufferAttribute( P.velocities , 3 ) );
    P.geometry.addAttribute( 'size'        , new THREE.BufferAttribute( P.sizes      , 1 ) );
    P.geometry.addAttribute( 'vel_mag'     , new THREE.BufferAttribute( P.vel_mag    , 1 ) );
    P.geometry.addAttribute( 'accel_mag'   , new THREE.BufferAttribute( P.accel_mag  , 1 ) );

    var vel   = P.geometry.attributes.velocity.array;
    var pos   = P.geometry.attributes.position.array;

    P.system               = new THREE.PointCloud( P.geometry, P.material );
    P.system.sortParticles = true;

    var new_accel     = new Float32Array(2);
    var players_accel = new Float32Array(2);
    var dist          = m.vec2.create();
    var zerovec2      = m.vec2.create();

    P.MIN_ACCEL_DIST = 44; // if a particle is closer than MIN_ACCEL_DIST to a player, don't run acceleration (prevents bunching)

    var new_v = m.vec2.create();

    var i;
    var vec_l;
    var player_i;

    P.update = function () {

        for( i = P.count - 1; i >= 0; i-- ) {

            i30 = i * 3;
            i31 = i30+ 1;

            m.vec2.set(new_accel, 0, 0);

            for (player_i = players.count - 1; player_i >= 0; player_i--){

                m.vec2.set(
                    dist,
                    pos[i30]-players.positions[player_i*3],
                    pos[i31]-players.positions[player_i*3 + 1]
                );

                grav.accel(
                    players_accel, // to avoid creating a new object each call, result values get copied into this arg
                    players.positions[player_i*3],
                    players.positions[player_i*3 + 1],
                    pos[i30],
                    pos[i31],
                    P.mass[i]
                );

                if (m.vec2.length(dist) < P.MIN_ACCEL_DIST) {
                    m.vec2.scale(players_accel, players_accel, -1);
                }

                m.vec2.add(new_accel, new_accel, players_accel);

            }

            // Add acc to vel
            vel[i30] += new_accel[0];
            vel[i31] += new_accel[1];

            m.vec2.set(new_v, vel[i30], vel[i31]);
            vec_l = m.vec2.length(new_v);
            // Clamp velocity if it gets too fast
            if( vec_l > P.MAX_VEL ) {
                m.vec2.scale(new_v, new_v, P.MAX_VEL/vec_l);
                vel[i30] = new_v[0];
                vel[i31] = new_v[1];
            }

            P.vel_mag[i] = m.vec2.length(new_v);
            P.accel_mag[i] = m.vec2.length(new_accel);

            // Add vel to pos
            pos[i30] += vel[i30];
            pos[i31] += vel[i31];

        }

        P.uniforms.mouse.value[0] = mouse.coords.x;
        P.uniforms.mouse.value[1] = mouse.coords.y;

        P.geometry.attributes.vel_mag.needsUpdate = true;
        P.geometry.attributes.position.needsUpdate = true;

        // these were needed for the frag shader at one point, but no longer
        // P.geometry.attributes.accel_mag.needsUpdate = true;
        // P.geometry.attributes.velocity.needsUpdate = true;
    };

    // Count currently can't exceed the initial count
    P.set_count = function(s) {
        var i;
        for (i = P.colors.length - 1; i >= s; i -= 1){
            P.colors[i] = 0;
        }
        P.count = s;
        P.geometry.attributes.customColor.needsUpdate = true;
    };

    P.set_size = function(s) {
        var i;
        for (i = P.sizes.length - 1; i >= 0; i -= 1){
            P.sizes[i] = s;
        }
        P.geometry.attributes.size.needsUpdate = true;
    };

    P.set_mass_variance = function(s) {
        var i;
        for (i = P.mass.length - 1; i >= 0; i -= 1){
            P.mass[ i ] = get_random_mass(s);
        }
    };

    P.set_color = function(i, c) {
        var prop = 'color' + i;
        P.uniforms[prop].value = new THREE.Color().setRGB( c.r, c.g, c.b);
    };
    P.set_color0 = _.partial(P.set_color, 0);
    P.set_color1 = _.partial(P.set_color, 1);
    P.set_color2 = _.partial(P.set_color, 2);


    return P;
}

define(deps, main);

})();

