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
 *  - Neither the name of jsimage nor the names of its contributors may 
 *    be used to endorse or promote products derived from this software 
 *    without specific prior written permission.
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
 * JSImage is an object for basic image manipulation and processing.
 * It uses the HTML <canvas> element and JavaScript to do the dirty
 * work.
 *
 * "JSImage" is a terrible name.  Help me think of a better one!
 *
 * @constructor
 * @param _canvas_id The id of the canvas element.
 * @_image_src The path to the image to be loaded into the canvas.
 */

function JSImage( _canvas_id, _image_src ) {

    /*******************************
     * Private instance variables. *
     *******************************/
    
    var marquee;
    var that = this; // hack to allow inner methods to access instance variables
    var canvas_element = document.getElementById( _canvas_id ); // Establish references to the canvas element and the canvas itself
    var img; // reference for the image to be loaded into the canvas
    var cs = new ColorSpace(); // used for colorspace conversions.  colorspace.js must be included by the html page


    /*****************************************************
     * Check for canvas support.  Still not sure exactly *
     * what should be done if canvas isn't supported.    *
     *****************************************************/

    if( !canvas_element.getContext ) {
        alert("You are using a browser without support for the <canvas> object.  JSImage will not be available to you.");
        return -1;
    }

    /******************************
     * Public instance variables. *
     ******************************/

    that.id = _canvas_id;
    that.src = _image_src;
    that.canvas; // reference for the real canvas (not the element)
    that.width;
    that.height;
    that.imagedata;

    that.canvas = canvas_element.getContext('2d');
    img = new Image();
    img.src = _image_src; // fetch the image from the server

    /**
     * When the image is done being loaded, resize its canvas
     * to fit and then draw the image.
     *
     * @private
     */
    img.onload = function() {
        // Resize the canvas element to fit the image
        that.width = canvas_element.width = img.width;
        that.height = canvas_element.height = img.height;
        that.canvas.drawImage( img, 0, 0 );
        that.imagedata = that.canvas.getImageData( 
                                0, // x coord
                                0, // y coord
                                canvas_element.width, // width of rectangle to return
                                canvas_element.height // height of rectangle to return
                                ); // we only care about the data attribute
    }


    /**
     * Fetch a remote image and draw it into the canvas.
     *
     * @private
     */
    that.load_image = function( image_path ) {

        img = new Image();
        img.src = image_path; // fetch the image from the server

        // Resize the canvas element to fit the image
        that.width  = canvas_element.width  = img.width;
        that.height = canvas_element.height = img.height;

        that.canvas.drawImage( img, 0, 0 );

        that.imagedata = that.canvas.getImageData( 
                                0,                    // x coord
                                0,                    // y coord
                                canvas_element.width, // width of rectangle to return
                                canvas_element.height // height of rectangle to return
                                );                    // we only care about the data attribute

    }




    /**
     * Draws the current pixel array onto a canvas.
     *
     * @param cnvs a canvas to draw the current pixel array upon.  uses this canvas if none is specified.
     */
    that.draw = function( cnvs ) {

        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata;

        that.canvas.putImageData( data, 0, 0 );

    }


    /**
     * Returns the pixels from a rectangular area.
     *
     * @returns A linear array of the pixels (R,G,B,A,R,G,B,A, ... )
     */
    that.getrect = function( x, y, w, h ) {
        return that.canvas.getImageData( x, y, w, h ).data;
    }


    /**
     * Averages the pixels in a linear array and returns the result.
     *
     * @returns An array (R,G,B,A) of the average pixel value
     */
    that.avg = function( pixels ) {

        var result = new Array(0,0,0,0);

        for( var i = 0; i < pixels.length; i+=4 ) {
            result[0] += pixels[i];
            result[1] += pixels[i+1];
            result[2] += pixels[i+2];
            result[3] += pixels[i+3];
        }

        result[0] = Math.round( result[0] / parseInt( pixels.length / 4 ) );
        result[1] = Math.round( result[1] / parseInt( pixels.length / 4 ) );
        result[2] = Math.round( result[2] / parseInt( pixels.length / 4 ) );
        result[3] = Math.round( result[3] / parseInt( pixels.length / 4 ) );

        return result;
    }


    /**
     * Makes the canvas draggable.
     */
    that.draggable = function() {
        marquee = new Marquee( that.id, { color: '#000', opacity: 0.6}); 
        marquee.setOnUpdateCallback( upd = function() {
            var xywh = marquee.getCoords();
            if( !xywh.width || !xywh.height ) return -1; // selection has 0 area, return error
            var rect = that.getrect( xywh.x1, xywh.y1, xywh.width, xywh.height );
            var av = that.avg( rect );
            document.body.style.background = "rgb(" + av[0] + "," + av[1] + "," + av[2] + ")";
        });
    }


    /**
     * Draws a histogram of this canvas on the target canvas.
     * If no target canvas is specified, it is drawn on top
     * of this canvas.
     *
     * @param cnvs a canvas to draw the histogram upon; default is this canvas
     * @param channel which band of the image to draw the histogram of, 'r', 'g', or 'b'
     * @param color the color of the histogram bars
     * @param backgorund the color of the background
     */
    that.histo = function( cnvs, channel, color, background ) {

        if(!cnvs) cnvs = that.canvas;

        var band;
        switch( channel ) {
            case 'r': band = 0; break;
            case 'g': band = 1; break;
            case 'b': band = 2; break;
            default: 
        }

        cnvs.fillStyle = background;
        cnvs.fillRect( 0, 0, that.width, that.height );

        var histo = new Array();
        var max = 0; // will store the highest value in the histogram

        // Initialize the histogram to all zeroes.
        for( var i = 0; i < 256; i++ )
            histo[i] = 0;

        // Build the histo
        for( var x = 0; x < that.getpixelarray().length; x++ ) {
            for( var y = 0; y < that.getpixelarray()[0].length; y++ ) {
                var pix = that.getpixelarray()[x][y];
                histo[ pix[ band ] ]++;
                if( max < histo[ pix[ band ] ] ) max = histo[ pix[ band ] ];
            }
        }

        // Draw the histo
        cnvs.strokeStyle = color;
        for( var i = 0; i < 256; i++ ) {

            var bar_height = parseInt( that.height - ( histo[i] * that.height / max ) );

            cnvs.beginPath();
            cnvs.moveTo( i, that.height );
            cnvs.lineTo( i, bar_height );
            cnvs.stroke();
        }

    }

    /**
     * Bins the histogram to the requested number of bins (aka columns!), using simple averages.
     *
     * @return bin
     */
    that.bin = function( histogram, bins ) {

        var bin = new Array();

        var histo_len  = histogram.length;

        // binning scales
        shrink_x = parseFloat( bins ) / parseFloat( histo_len );

        var span = parseInt( ( parseFloat( histo_len ) / parseFloat( bins ) ) / 2 ) + 1; // how far to the left and right to "reach" for values to average with

        for( var i = 0; i < bins; i++ ) {

            var p = 0;
            //determine left bound (either 0 or i - span)
            //determine right bound ( either histo_len-1 or i + span)
            //calculate average of items from left bound to right bound (inclusive)
            var left_bound  = Math.max( 0, ( i - span ) );
            var right_bound = Math.max( ( histo_len - 1 ), ( i + span ) );

            for( var j = left_bound; j <= right_bound; j++ )
                p += histogram[ j ]; //add the value.  averaging them will come later

            p /= ( right_bound - left_bound ); //reduce value to the average

            //we now have the final value for this bin
            bin[i] = p;
        }

        return bin
    }

    /**
     * Draws an inverted image of this canvas.
     *
     * @param cnvs optional canvas to draw the inverted image upon.  uses this canvas if none is provided.
     */
    that.invert = function( cnvs ) {

        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata.data;

        for( var i = data.length-1; i >= 0; i-=4 ) {
            data[i - 3] = 255 - data[i - 3]; // R
            data[i - 2] = 255 - data[i - 2]; // G
            data[i - 1] = 255 - data[i - 1]; // B
            // don't invert alpha ;)
        }

        
        that.draw( cnvs );

    }


    /**
     * Performs a threshold operation on the canvas.
     *
     * @param cnvs optional canvas to draw the thresholded image upon.  uses this canvas if none is provided.
     * @param threshold a value from 0..255
     */
    that.threshold = function( cnvs, t ) {

        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata.data;

        for( var i = data.length-1; i >= 0; i-=4 ) {
            var b = Math.max( data[i-3],
                              data[i-2],
                              data[i-1] );
            data[i-3] = data[i-2] = data[i-1] = ( b >= t ) ?  255: 0;
        }

        that.draw( cnvs );

    }

    /**
     * Raises or lowers the hue.
     *
     * @param cnvs optional canvas to draw the inverted image upon.  uses this canvas if none is provided.
     * @param h the amount by which to adjust the hue
     */
    that.hue = function( cnvs, h ) {

        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata.data;
        var r = 0;
        var g = 0;
        var b = 0;

        var V = 1;
        var S = 1;
        var U = Math.cos( h * Math.PI / 180 );
        var W = Math.sin( h * Math.PI / 180 );
        var A = .299*V;
        var B = .587*V;
        var C = .114*V;
        var VSW = V*S*W;
        var VSU = V*S*U;

        for( var i = data.length-1; i >= 0; i-=4 ) {
            r = data[i-3];
            g = data[i-2];
            b = data[i-1];

            data[i-3] = r * ( A + .701 *VSU + .168 * VSW ) +
                        g * ( B - .587 *VSU + .330 * VSW ) +
                        b * ( C - .114 *VSU - .497 * VSW ) ;

            data[i-2] = r * ( A - .299 *VSU - .328 * VSW )+
                        g * ( B + .413 *VSU + .035 * VSW )+
                        b * ( C - .114 *VSU + .292 * VSW );

            data[i-1] = r * ( A - .3   *VSU + 1.25 * VSW ) +
                        g * ( B - .588 *VSU - 1.05 * VSW ) +
                        b * ( C + .886 *VSU - .203 * VSW );
        }

        /*
        var rgb = [0,0,0,0];
        var hsv = [0,0,0,0];

        for( var i = data.length-1; i >= 0; i-=4 ) {
            hsv = cs.rgb_to_hsv(
                            data[i-3],
                            data[i-2],
                            data[i-1]);
            hsv[0] = ( h + hsv[0] ) % 360;
            rgb = cs.hsv_to_rgb( hsv[0], hsv[1], hsv[2] );
            data[i-3] = rgb[0];
            data[i-2] = rgb[1];
            data[i-1] = rgb[2];
        }
        */

        that.draw( cnvs );

    }


    /**
     * Raises or lowers the brightness.
     *
     * @param cnvs optional canvas to draw the inverted image upon.  uses this canvas if none is provided.
     * @param b the amount by which to adjust the brightness
     */
    that.value = function( cnvs, v ) {

        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata.data;

        for( var i = data.length-1; i >= 0; i-=4 ) {
            var hsv = cs.rgb_to_hsv(
                            data[i-3],
                            data[i-2],
                            data[i-1]);
            hsv[2] += v;
            var rgb = cs.hsv_to_rgb( hsv[0], hsv[1], hsv[2] );
            data[i-3] = rgb[0];
            data[i-2] = rgb[1];
            data[i-1] = rgb[2];
        }

        
        that.draw( cnvs );

    }


    /**
     * Raises or lowers the saturation.
     *
     * @param cnvs optional canvas to draw the inverted image upon.  uses this canvas if none is provided.
     * @param s the amount by which to adjust the saturation
     */
    that.saturation = function( cnvs, s ) {

        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata.data;

        for( var i = data.length-1; i >= 0; i-=4 ) {
            var hsv = cs.rgb_to_hsv(
                            data[i-3],
                            data[i-2],
                            data[i-1]);
            hsv[1] += s;
            hsv[1] = Math.max( Math.min( hsv[1], 100 ), 0 );
            var rgb = cs.hsv_to_rgb( hsv[0], hsv[1], hsv[2] );
            data[i-3] = rgb[0];
            data[i-2] = rgb[1];
            data[i-1] = rgb[2];
        }

        that.draw( cnvs );

    }


    /**
     * Raises or lowers the contrast.
     *
     * @param cnvs optional canvas to draw the inverted image upon.  uses this canvas if none is provided.
     * @param c the factor by which to increase or decrease the contrast.
     */
    that.contrast = function( cnvs, c ) {

        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        var data = that.imagedata.data;

        for( var i = data.length-1; i >= 0; i-=4 ) {
            data[i-3] *= c;
            data[i-2] *= c;
            data[i-1] *= c;
        }

        that.draw( cnvs );

    }

    /**
     * Multiplies each pixel in the canvas by a RGB 3-tuple.
     *
     * @param cnvs optional canvas to draw the multiplied image upon.  uses this canvas if none is provided.
     * @param color the color by which to multiply each pixel in the canvas
     */
    that.multiply = function( cnvs, r, g, b ) {


        // use this canvas as default
        if(!cnvs) cnvs = that.canvas;

        r = ( r > 255 ) ? 255 : ( r > 0 ) ? r : 0;
        g = ( g > 255 ) ? 255 : ( g > 0 ) ? g : 0;
        b = ( b > 255 ) ? 255 : ( b > 0 ) ? b : 0;

        r = ( r > 1 ) ? r / 255 : r;
        g = ( g > 1 ) ? g / 255 : g;
        b = ( b > 1 ) ? b / 255 : b;

        var data = that.imagedata.data;

        for( var i = data.length-1; i >= 0; i-=4 ) {

            data[ i - 3 ] = data[ i - 3 ] * r;
            data[ i - 2 ] = data[ i - 2 ] * g;
            data[ i - 1 ] = data[ i - 1 ] * b;

        }

        
        that.draw( cnvs );

    }



} // End of JSImage constructor


