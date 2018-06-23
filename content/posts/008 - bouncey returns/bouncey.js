/*******************
 * Global settings *
 *******************/
var FPS              = 60;              // frames per second
var PERIOD           = 1000 / FPS;      // frames last PERIOD milliseconds
var W                = 500;             // canvas width
var H                = 375;             // canvas height
var OBJ_R            = 4;
var OBJ_PAD          = 5;               // padding around the starting positions of the objects
var OBJ_WIDTH        = OBJ_R + OBJ_PAD; // width of an object, including padding
var OBJ_HEIGHT       = OBJ_R + OBJ_PAD; // height of an object, including padding
var OBJ_MAX_VELOCITY = 100;             // object maximum velocity
var OBJ_COUNT        = 200;             // object maximum velocity
var PI2              = Math.PI * 2;
var DEFAULT_COLOR    = [255,0,0];
var Gy               = 9.618;           // gravity along y axis
var Gx               = 0;               // gravity along x axis
var FRICTION         = 0.01;            // friction coefficient
var BACKGROUND_COLOR = 'rgb(0,0,0)';    // canvas background color
var SHADOWOFFSETX = 3;
var SHADOWOFFSETY = 3;
var SHADOWBLUR = 0;
var SHADOWCOLOR = "rgba(0,0,0,0.8)";
var SHOW_VELOCITY = false;

/***********************
 * changeable settings *
 ***********************/
var paused = false;


/****************************************************************
 * BounceObject                                                 *
 * this class is the parent class of all objects that get drawn *
 * on the canvas.                                               *
 * @param _x  the x coordinate                                  *
 * @param _y  the y coordinate                                  *
 * @param _vx the initial x velocity                            *
 * @param _vy the initial y velocity                            *
 ****************************************************************/
function BounceObject( _x, _y, _vx, _vy, _c ) {
    this.color = _c;
    this.x     = _x;
    this.y     = _y;
    this.vx    = _vx;
    this.vy    = _vy;
}

// The default draw function does nothing
BounceObject.prototype.draw    = function() { }

// Collide SHOULD accept any other BounceObject and
// determine if the instance collides with that
// object.  I have a few ideas of how to implement
// this, but none of them are clean.  Right now, I
// think I'll implement it as ONLY detecting collisions
// between BounceObjects of the same subclass,
// Circle hits Circle, for example, but no Circle
// hits Rectangle.
BounceObject.prototype.collide = function() { }

/**************************************************************
 * class Circle                                               *
 * a plain ol' circle                                         *
 * @param _r  the radius                                      *
 * @param _c  the color in rgb(R,G,B) or rgba(R,G,B,A) format *
 **************************************************************/

Circle.prototype = new BounceObject;
Circle.prototype.constructor = Circle;

Circle.prototype.draw = function( _canvas ) {
    _canvas.fillStyle = this.color;
    _canvas.beginPath();
    _canvas.arc( this.x, this.y, this.r, 0, PI2, true );
    _canvas.closePath();
    _canvas.fill();

    if( SHOW_VELOCITY ) {
        _canvas.fillStyle="black";
        _canvas.fillText( Math.floor(Math.sqrt(this.vx*this.vx+this.vy*this.vy)), this.x - OBJ_R + 4, this.y + 4 );
    }
};

Circle.prototype.collide = function( _obj ) {

    // if the distance between _o1's center and _o2's center
    // is less than or equal to r1+r2, then they have collided

    //console.log( "dist %0.4f", ( this.x - _obj.x )^2 + ( this.y - _obj.y )^2  );

    return  ( this.x - _obj.x ) * ( this.x - _obj.x )
          + ( this.y - _obj.y ) * ( this.y - _obj.y )
          < ( this.r + _obj.r ) * ( this.r + _obj.r );

}

BounceObject.prototype.fade_color = function( _new_color ) {
    //setTimeout(  );
}

function Circle( _x, _y, _r, _vx, _vy, _c ) {

    // call the superclass's constructor and pass in the variables it cares about
    BounceObject.call( this, _x, _y, _vx, _vy, _c );

    // initialize this class's variables
    this.r = _r;

}


/********************************************************************
    objs is an array of BounceObject objects.  Any valid object that 
    is included in the objs array will be drawn.
 ********************************************************************/
objs = [];

function make_frame() {     // stuff to do for each frame
    requestAnimationFrame(make_frame);
    update_wall_collisions();
    update_obj_collisions();
    update_locations();
    paint();

    document.getElementById('txt_velocity_sum').innerHTML = velocity_sum(); // update energy level
    document.getElementById('txt_velocity_sum_x').innerHTML = velocity_sum_x(); // update energy level
    document.getElementById('txt_velocity_sum_y').innerHTML = velocity_sum_y(); // update energy level

}

/****************************
 * updates object locations *
 ****************************/
function update_locations() {

    if ( paused ) return; // this is kind of a hack

    for( var i = objs.length - 1; i >= 0; --i ) {

        // update object positions based on velocity
        objs[i].x  += objs[i].vx*1/FPS;
        objs[i].y  += objs[i].vy*1/FPS;

        // apply velocity change due to gravity
        objs[i].vx += Gx;
        objs[i].vy += Gy;

        // apply friction
        objs[i].vx *= 1 - FRICTION;
        objs[i].vy *= 1 - FRICTION;
    }
}
/*********************************
 * handles object/wall collision *
 *********************************/
function update_wall_collisions() {

    if ( paused ) return; // this is kind of a hack

    for ( var o = objs.length - 1; o >= 0; --o ) {
    
        var t_col = objs[o].y - objs[o].r <= 0; // top wall collision
        var b_col = objs[o].y + objs[o].r >= H  // bottom wall collision
        var l_col = objs[o].x - objs[o].r <= 0; // left wall collision
        var r_col = objs[o].x + objs[o].r >= W; // right wall collision

        // make sure they're headed in the right direction
        if( t_col ) objs[o].vy = Math.abs( objs[o].vy );
        if( b_col ) objs[o].vy = Math.abs( objs[o].vy ) * -1;
        if( l_col ) objs[o].vx = Math.abs( objs[o].vx );
        if( r_col ) objs[o].vx = Math.abs( objs[o].vx ) * -1;

    }
}

/***********************************
 * handles object/object collision *
 ***********************************/
function update_obj_collisions() {

    if ( paused ) return; // this is kind of a hack

    var o1 = new Object();
    var o2 = new Object();
    var d = {};
    var t = {};
    var r = {};
    var l = 0;
    var v = {};
    var vcpt = {};

    obj_pairs = pairs( objs );

    for ( var o = obj_pairs.length - 1; o >= 0; --o ) {
    
        o1 = obj_pairs[o][0];
        o2 = obj_pairs[o][1];

        if ( o1.collide( o2 ) ) {

            /* TODO: this can possibly be optimized into a single matrix mult */

            /* TODO: SOMETHING in this calculating is adding energy, and it's greater than
                     can be accounted for by simple rounding error. */

            // distance between o1 and o2
            d = { x : o2.x - o1.x, 
                  y : o2.y - o1.y };

            // vector tangent to the collision
            t = { x : d.y, 
                  y : -1*d.x };
            t = normalize(t);
            
            // relative velocity between objects
            r = { x : o1.vx - o2.vx,
                  y : o1.vy - o2.vy };

            // length of velocity parallel to tangent
            l = r.x*t.x + r.y*t.y;

            // velocity component parallel to tangent
            v = { x : l * t.x,
                  y : l * t.y };

            // velocity component perpendicular to the tangent
            vcpt = { x : r.x - v.x,
                     y : r.y - v.y };

            o1.vx -= vcpt.x;
            o1.vy -= vcpt.y;
            o2.vx += vcpt.x;
            o2.vy += vcpt.y;


        }
    }
}
/************************************************************
 * normalizes a vector2.  returns a unit vector in the same *
 * direction as the original vector.                        *
 ************************************************************/
function normalize( _v ) {
    var m = Math.sqrt( _v.x * _v.x + _v.y * _v.y );
    return { x : _v.x / m,
             y : _v.y / m };
}

/********************************************
 * paint a frame by drawing all the objects *
 ********************************************/
function paint() {

    if ( paused ) return; // this is kind of a hack

    canvas.clearRect(0,0,W,H);

    for( var o = objs.length - 1; o >= 0; --o ) {

        objs[o].draw( canvas );

    }
}

function pairs( _arr ) {
    pair_array = [];

    // i > 0 is intentional, we don't ever
    // need i to get to 0, since it's last
    // iteration will add [ _arr[0], _arr[1] ]
    for( var i = _arr.length-1; i > 0; --i ) {
        for( var j = i-1; j >= 0; --j ) {
            pair_array.push( [ _arr[i], _arr[j] ] );
        }
    }
    return pair_array;
}

function velocity_sum_x() {
    var vsum = 0;
    for( var i = objs.length - 1; i >= 0; --i ) {
        vsum += Math.abs(objs[i].vx);
    }
    return vsum;
}
function velocity_sum_y() {
    var vsum = 0;
    for( var i = objs.length - 1; i >= 0; --i ) {
        vsum += Math.abs(objs[i].vy);
    }
    return vsum;
}
function velocity_sum() {
    var vsum = 0;
    for( var i = objs.length - 1; i >= 0; --i ) {
        vsum += Math.abs( objs[i].vx ) + Math.abs( objs[i].vy );
    }
    return vsum;
}


function reset() {
    FPS              = 60;              // frames per second
    PERIOD           = 1000 / FPS;      // frames last PERIOD milliseconds
    W                = 500;             // canvas width
    H                = 375;             // canvas height
    OBJ_R            = 4;
    OBJ_PAD          = 5;               // padding around the starting positions of the objects
    OBJ_WIDTH        = OBJ_R + OBJ_PAD; // width of an object, including padding
    OBJ_HEIGHT       = OBJ_R + OBJ_PAD; // height of an object, including padding
    OBJ_MAX_VELOCITY = 100;             // object maximum velocity
    OBJ_COUNT        = 200;             // object maximum velocity
    PI2              = Math.PI * 2;
    DEFAULT_COLOR    = [255,0,0];
    Gy               = 9.618;           // gravity along y axis
    Gx               = 0;               // gravity along x axis
    FRICTION         = 0.01;            // friction coefficient
    BACKGROUND_COLOR = 'rgb(0,0,0)';    // canvas background color
    SHOW_VELOCITY    = false;
    canvas_element.style.backgroundColor=BACKGROUND_COLOR;
    canvas.shadowOffsetX = 0;
    canvas.shadowOffsetY = 0;
    canvas.shadowBlur = 0;
    canvas.shadowColor = "";
    canvas.font = "";
    canvas.fillStyle="";
}

/*************************
 * object layout presets *
 *************************/
function POOL() {
    reset();

    Gx = 0;
    Gy = 0;
    FRICTION = 0.010;
    BACKGROUND_COLOR = 'rgb(24,128,24)';

    canvas_element.style.backgroundColor=BACKGROUND_COLOR;

    canvas.shadowOffsetX = SHADOWOFFSETX;
    canvas.shadowOffsetY = SHADOWOFFSETY;
    canvas.shadowBlur = SHADOWBLUR;
    canvas.shadowColor = SHADOWCOLOR;

    objs = [
        new Circle(  40     ,   300 , 14, 320, 0, "rgb(255,255,255)" ),
        new Circle(  200    ,   300 , 14,   0, 0, "yellow" ),
        new Circle(  225    ,   315 , 14,   0, 0, "red" ),
        new Circle(  225    ,   285 , 14,   0, 0, "blue" ),
        new Circle(  250    ,   300 , 14,   0, 0, "yellow" ),
        new Circle(  250    ,   330 , 14,   0, 0, "red" ),
        new Circle(  250    ,   270 , 14,   0, 0, "blue" ),
    ];
}

function HEAD_ON_COLLISION() {
    reset();

    Gx = 0;
    Gy = 0;
    OBJ_R = 26;
    FRICTION = 0;
    SHOW_VELOCITY = true;

    canvas.font = "12pt monospace";

    objs = [
        new Circle(  100    ,   80 , OBJ_R, 102, 0, "rgb(255,255,255)" ),
        new Circle(  180    ,   120 , OBJ_R,  15, 0, "red" ),
    ];
}
function RANDOM() {
    reset();
    Gx = 0;
    Gy = 0;
    FRICTION = 0.000;

    // create some squares with random velocities in the center of the canvas
    // objects are stored in the format 
    //      [ X, Y, X_velocity, Y_velocity, width, height, [R,G,B] ]
    var x, y, w, h, v_x, v_y, r, g, b, new_obj;
    objs = [];

    // calculate all the possible initial y positions
    y_positions = [];
    for( var i = OBJ_HEIGHT; i < H - OBJ_HEIGHT; i += 2 * OBJ_HEIGHT )
        y_positions.push( i );

    // calculate all the possible initial x positions
    x_positions = [];
    for( var i = OBJ_WIDTH; i < W - OBJ_WIDTH; i += 2 * OBJ_WIDTH )
        x_positions.push( i );

    /*
    */
    for( var i = 0; i < OBJ_COUNT; ++i ) {

        // create values for the object
        var x   = x_positions[ i % x_positions.length ];
        var y   = y_positions[ Math.floor( i / x_positions.length ) % y_positions.length ];
        var v_x = Math.random() * OBJ_MAX_VELOCITY*2 - OBJ_MAX_VELOCITY;
        var v_y = Math.random() * OBJ_MAX_VELOCITY*2 - OBJ_MAX_VELOCITY;
        var red = Math.floor( Math.random() * 200 + 55 ); // random value 55..255
        var grn = Math.floor( Math.random() * 200 + 55 );
        var blu = Math.floor( Math.random() * 200 + 55 );

        // add the object to the scene
        var color = "grey";
        var new_obj = new Circle( x, y, OBJ_R, v_x, v_y, color );

        objs.push( new_obj );
    }
}

window.onload = function() {

    canvas_element                       = document.getElementById('cnvs');
    canvas_element.width                 = W;
    canvas_element.height                = H;
    canvas_element.style.backgroundColor = BACKGROUND_COLOR;

    canvas = canvas_element.getContext('2d');

    make_frame();

}

