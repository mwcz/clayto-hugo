/**
 * Copyright (c) 2009, Michael Clayton
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without mo
 * dification, are permitted provided that the following conditions are 
 * met:
 * 
 *  - Redistributions of source code must retain the above copyright 
 *    notice, this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright 
 *    notice, this list of conditions and the following disclaimer in 
 *    the documentation and/or other materials provided with the 
 *    distribution.
 *  - Neither the name of colorspace.js nor the names of its contributors 
 *    may be used to endorse or promote products derived from this 
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN 
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * colorspace.js 
 *
 * Functions for converting between color spaces.
 */

function ColorSpace() {
    this.version = "0.1 Alpha";
}

    ColorSpace.prototype.rgb_to_hsv = function(red,green,blue) {
	/**
         * Converts an RGB tuple into HSV color space.
	 * Returns an HSV tuple.
         */ 

        //console.log("RGB(%d,%d,%d) translates into...",red,green,blue);

	var r = red / 255.0;                     //RGB values = 0 -> 255
	var g = green / 255.0;
	var b = blue / 255.0;


	var min_band = Math.min( r, g, b );    //min_band. value of RGB
	var max_band = Math.max( r, g, b );    //max_band. value of RGB
	var delta = max_band - min_band;             //Delta RGB value

	var v = max_band;

	if ( delta == 0 ) {                     //This is a gray, no chroma...
	    var h = 0;                                //HSV results = 0 -> 1
	    var s = 0;
	} else {                                    //Chromatic data...
	    s = delta / max_band;

	    delta_r = ( ( ( max_band - r ) / 6.0 ) + ( delta / 2.0 ) ) / delta;
	    delta_g = ( ( ( max_band - g ) / 6.0 ) + ( delta / 2.0 ) ) / delta;
	    delta_b = ( ( ( max_band - b ) / 6.0 ) + ( delta / 2.0 ) ) / delta;

	    if ( r == max_band )
		h = delta_b - delta_g;

	    else if ( g == max_band )
		h = ( 1.0 / 3.0 ) + delta_r - delta_b;

	    else if ( b == max_band ) 
		h = ( 2.0 / 3.0 ) + delta_g - delta_r;

	    if ( h < 0 )
		h += 1;
	    if ( h > 1 )
		h -= 1;
        }

	h = Math.round(h*359);
	s = Math.round(s*255);
	v = Math.round(v*255);

        //console.log("      HSV(%d,%d,%d)",h,s,v);

	return new Array(h,s,v);

    }

    ColorSpace.prototype.hsv_to_rgb = function(hue,saturation,value) {
	/**
         * Converts an HSV tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	var h = hue;
	var s = saturation;
	var v = value;

        //console.log("HSV(%d,%d,%d) translates into...",h,s,v);

        /**
         * Ensure correct bounds.
         *
         * Hue should wrap around from 359 <-> 0
         * Saturation should clamp on 0..255 and not wrap around.
         * Value should clamp on 0..255 and not wrap around.
         */
        h %= 360;
        if( s > 255 ) v = 255;
        if( s < 0   ) v = 0;
        if( v > 255 ) v = 255;
        if( v < 0   ) v = 0;

        // h, s, v [0,1)
        h /= 359;
        s /= 255;
        v /= 255;

	if ( s == 0 ) {
	    var r = Math.round(v * 255);
	    var g = Math.round(v * 255);
	    var b = Math.round(v * 255);
	} else {
	    var var_h = h * 6;
	    if ( var_h == 6 )
		var_h = 0;
	    var var_i = Math.floor( var_h );
	    var var_1 = v * (1 - s);
	    var var_2 = v * (1 - s * ( var_h - var_i ));
	    var var_3 = v * (1 - s * ( 1 - ( var_h - var_i ) ) );
       
	    if ( var_i == 0 ) {
		var var_r = v;
		var var_g = var_3;
		var var_b = var_1;
	    } else if ( var_i == 1 ) {
		var var_r = var_2;
		var var_g = v;
		var var_b = var_1;
	    } else if ( var_i == 2 ) {
		var var_r = var_1;
		var var_g = v;
		var var_b = var_3;
	    } else if ( var_i == 3 ) {
		var var_r = var_1;
		var var_g = var_2;
		var var_b = v;
	    } else if ( var_i == 4 ) {
		var var_r = var_3;
		var var_g = var_1;
		var var_b = v;
	    } else {
		var var_r = v;
		var var_g = var_1;
		var var_b = var_2;
            }

	    var r = Math.round(var_r * 255);
	    var g = Math.round(var_g * 255);
	    var b = Math.round(var_b * 255);
        }

        //console.log("      RGB(%d,%d,%d)",r,g,b);

	return new Array(r,g,b);
     

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

			       //Observer = 2, Illuminant = D65
	var_X = X / 100.0;       //Where X = 0 /  95.047
	var_Y = Y / 100.0;       //Where Y = 0 / 100.000
	var_Z = Z / 100.0;       //Where Z = 0 / 108.883

	var_R = var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
	var_G = var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415;
	var_B = var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570;

	if ( var_R > 0.0031308 )
	    var_R = 1.055 * ( var_R * ( 1 / 2.4 ) ) - 0.055;
	else
	    var_R = 12.92 * var_R;
	if ( var_G > 0.0031308 )
	    var_G = 1.055 * ( var_G * ( 1 / 2.4 ) ) - 0.055;
	else
	    var_G = 12.92 * var_G;
	if ( var_B > 0.0031308 )
	    var_B = 1.055 * ( var_B * ( 1 / 2.4 ) ) - 0.055;
	else
	    var_B = 12.92 * var_B;

	R = var_R * 255;
	G = var_G * 255;
	B = var_B * 255;

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.xyz_to_rgb = function(x,y,z) {
	/**
         * Converts an XYZ tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

	return new Array(R,G,B);

    }

    ColorSpace.prototype.hsl_to_rgb = function(h,s,l) {
	/**
         * Converts an HSL tuple into RGB color space.
	 * Returns an RGB tuple.
         */ 

        var R;
        var G;
        var B;

	if ( S == 0 ) {  //HSL values = 0 / 1
	    R = L;  //RGB results = 0 / 255
	    G = L;
	    B = L;
        }
	
	else {
	    if ( L < 0.5 )
                var var_2 = L * ( 1 + S );
	    else 
                var var_2 = ( L + S ) - ( S * L );

	    var var_1 = 2 * L - var_2;

	    R = 255 * Hue_2_RGB( var_1, var_2, H + ( 1.0 / 3.0 ) );
	    G = 255 * Hue_2_RGB( var_1, var_2, H );
	    B = 255 * Hue_2_RGB( var_1, var_2, H - ( 1.0 / 3.0 ) );
        }

	return new Array(R,G,B);

    }

    ColorSpace.prototype.rgb_to_cmy = function(x,y,z) {
	/**
         * Converts an RGB tuple into CMY color space.
	 * Returns a CMY tuple.
         */

	//RGB values = 0 / 255
	//CMY values = 0 / 1

	var C = 1 - ( R / 255 );
	var M = 1 - ( G / 255 );
	var Y = 1 - ( B / 255 );

	return new Array(C,M,Y);

    }

    ColorSpace.prototype.cmy_to_rgb = function(c,m,y) {
	/**
         * Converts a CMY tuple into RGB color space.
	 * Returns an RGB tuple.
         */

	// CMY values = 0 / 1
	// RGB values = 0 / 255

	var R = ( 1 - C ) * 255;
	var G = ( 1 - M ) * 255;
	var B = ( 1 - Y ) * 255;

	return new Array(R,G,B);

    }

    ColorSpace.prototype.cmy_to_cmyk = function(C,M,Y) {
	/**
         * Converts a CMY tuple into CMYK color space.
	 * Returns a CMYK tuple.
         */

	// Where CMYK and CMY values = 0 / 1

	var var_K = 1;

	if ( C < var_K ) 
            var_K = C;
	if ( M < var_K ) 
            var_K = M;
	if ( Y < var_K ) 
            var_K = Y;

	if ( var_K == 1 ) { // Black
	    C = 0;
	    M = 0;
	    Y = 0;
	
	} else { 
	    C = ( C - var_K ) / ( 1 - var_K );
	    M = ( M - var_K ) / ( 1 - var_K );
	    Y = ( Y - var_K ) / ( 1 - var_K );
        }

	return new Array(C,M,Y,var_K);

    }

    ColorSpace.prototype.cmyk_to_cmy = function(c,m,y,k) {
	/**
         * Converts a CMYK tuple into CMY color space.
	 * Returns a CMY tuple.
         */

	// Where CMYK and CMY values = 0 / 1
	 
	var C = ( c * ( 1 - k ) + k );
	var M = ( m * ( 1 - k ) + k );
	var Y = ( y * ( 1 - k ) + k );

	return new Array(C,M,Y);
    }
