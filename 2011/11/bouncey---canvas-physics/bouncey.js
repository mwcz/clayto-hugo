/*******************
 * Global settings *
 *******************/
var FPS              = 60;              // frames per second
var PERIOD           = 1000 / FPS;      // frames last PERIOD milliseconds
var W                = 500;             // canvas width
var H                = 375;             // canvas height
var OBJ_R            = 10;
var OBJ_PAD          = 20;              // padding around the starting positions of the objects
var OBJ_WIDTH        = OBJ_R + OBJ_PAD; // width of an object, including padding
var OBJ_HEIGHT       = OBJ_R + OBJ_PAD; // height of an object, including padding
var OBJ_MAX_VELOCITY = 100;             // object maximum velocity
var OBJ_COUNT        = 100;             // object maximum velocity
var PI2              = Math.PI * 2;
 
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
 
/*************************************************************
 * class Circle                                              *
 * a plain ol' circle                                        *
 * @param _r  the radius                                      *
 * @param _c  the color in rgb(R,G,B) or rgba(R,G,B,A) format *
 *************************************************************/
 
Circle.prototype = new BounceObject;
Circle.prototype.constructor = Circle;
 
Circle.prototype.draw = function( _canvas ) {
    _canvas.fillStyle = this.color;
    _canvas.beginPath();
    _canvas.arc( this.x, this.y, this.r, 0, PI2, true );
    _canvas.closePath();
    _canvas.fill();
};
 
Circle.prototype.collide = function( _obj ) {
 
    // if the distance between _o1's center and _o2's center
    // is less than or equal to r1+r2, then they have collided
 
    //console.log( "dist %d", ( this.x - _obj.x )^2 + ( this.y - _obj.y )^2  );
 
    return  ( this.x - _obj.x ) * ( this.x - _obj.x )
          + ( this.y - _obj.y ) * ( this.y - _obj.y )
          < ( this.r + _obj.r ) * ( this.r + _obj.r );
 
}
 
function Circle( _x, _y, _r, _vx, _vy, _c ) {
 
    // call the superclass's constructor and pass in the variables it cares about
    BounceObject.call( this, _x, _y, _vx, _vy, _c );
 
    // initialize this class's variables
    this.r = _r;
 
}
 
 
/********************************************************************
 * This is the most confusing part.  'objs' is an array of objects. *
 * They are stored in this format:                                  *
 * objs = [                                                         *
 *           ...,                                                   *
 *           [ x, y, vx, vy, w, h, [r,g,b] ],                       *
 *           ...,                                                   *
 *        ];                                                        *
 * Legend:                                                          *
 *     x : the object's x-axis position                             *
 *     y : the object's y-axis position                             *
 *     vx: the object's x-axis velocity                             *
 *     vy: the object's y-ayis velocity                             *
 *     w : the object's width                                       *
 *     h : the object's height                                      *
 *     r : the object's r-channel color value                       *
 *     g : the object's g-channel color value                       *
 *     b : the object's b-channel color value                       *
 ********************************************************************/
objs = [];
 
function make_frame() {     // stuff to do for each frame
    requestAnimationFrame(make_frame);
    update_wall_collisions();
    update_obj_collisions();
    update_locations();
    paint();
}
 
/****************************
 * updates object locations *
 ****************************/
function update_locations() {
 
    if ( paused ) return; // this is kind of a hack
 
    for( var i = objs.length - 1; i >= 0; --i ) {
        objs[i].x += objs[i].vx*1/FPS;
        objs[i].y += objs[i].vy*1/FPS;
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
 
    obj_pairs = pairs( objs );
 
    for ( var o = obj_pairs.length - 1; o >= 0; --o ) {
    
        o1 = obj_pairs[o][0];
        o2 = obj_pairs[o][1];
 
        if ( o1.collide( o2 ) ) {
 
            // TODO: this can be optimized A LOT
            var d = { x : o2.x - o1.x, 
                      y : o2.y - o1.y };
 
            // vector tangent to the collision
            var t = { x : -1*d.y,
                      y : d.x };
 
            t = normalize( t );
            
            // relative velocity between objects
            var r = { x : o1.vx - o2.vx,
                      y : o1.vy - o2.vy };
 
            // length of velocity parallel to tangent
            var l = r.x*t.x + r.y*t.y;
 
            // velocity component parallel to tangent
            var v = { x : l * t.x,
                      y : l * t.y };
 
            // velocity component perpendicular to the tangent
            var vcpt = { x : r.x - v.x,
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
