/**
 * JSImage is an object for basic image manipulation and processing.
 * It uses the HTML <canvas> element and JavaScript to do the dirty
 * work.
 *
 * @constructor
 * @param arg_canvas_id The id of the canvas element.
 * @arg_image_src The path to the image to be loaded into the canvas.
 */
function JSImage( arg_canvas_id, arg_image_src ) {
    //console.log("Constructor called: JSImage( \"%s\", \"%s\" )", arg_canvas_id, arg_image_src );

    /**
     * Public instance variables.
     */
    this.id = arg_canvas_id;
    this.src = arg_image_src;
    this.canvas; // reference for the real canvas (not the element)
    this.width;
    this.height;

    /**
     * Private instance variables.
     */
    var marquee;
    var that = this; // hack to allow inner methods to access instance variables
    var canvas_element = document.getElementById( arg_canvas_id ); // Establish references to the canvas element and the canvas itself
    var img; // reference for the image to be loaded into the canvas


    // Check for canvas support.  Still not sure exactly what should be done if canvas isn't supported.
    if( !canvas_element.getContext ) {
        alert("You are using a browser without support for the <canvas> object.  JSImage will not be available to you.");
        return -1;
    }

    /**
     * Public instance variables.
     */
    this.pixelarray = 0; // holds a 3D array of the image's pixels


    this.canvas = canvas_element.getContext('2d');
    img = new Image();

    img.src = arg_image_src; // fetch the image from the server

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
    }


    /**
     * Returns the pixels from a rectangular area.
     *
     * @returns A linear array of the pixels (R,G,B,A,R,G,B,A, ... )
     */
    this.getrect = function( x, y, w, h ) {
        return this.canvas.getImageData( x, y, w, h ).data;
    }


    /**
     * Averages the pixels in a linear array and returns the result.
     *
     * @returns An array (R,G,B,A) of the average pixel value
     */
    this.avg = function( pixels ) {

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
    this.draggable = function() {
        marquee = new Marquee( that.id, { color: '#000', opacity: 0.6}); 
        marquee.setOnUpdateCallback( upd = function() {
            var xywh = marquee.getCoords();
            if( !xywh.width || !xywh.height ) return -1; // selection has 0 area, return error
            //console.log(xywh);
            var rect = that.getrect( xywh.x1, xywh.y1, xywh.width, xywh.height );
            //console.log(rect);
            var av = that.avg( rect );
            //console.log(av);
            document.body.style.background = "rgb(" + av[0] + "," + av[1] + "," + av[2] + ")";
        });
    }



    /**
     * If the 3D pixel array is already retrieved, return it.  Else,
     * retrieve the pixel from getpixels() array and return it.
     *
     * @returns A 3D array (X by Y by RGB) of the image's pixel values.
     */
    this.getpixelarray = function() {
        return (this.pixelarray.length) ? this.pixelarray : this.pixelarray = getpixels();
    }

    /**
     * getpixelarray()
     *
     * @private
     * @returns A 3D array (X by Y by RGB) of the image's pixel values.
     */
    getpixels = function() {
        //console.time("getImageData");
        var pixarray = new Array();
        var imgdata = that.canvas.getImageData( 
                            0, // x coord
                            0, // y coord
                            canvas_element.width, // width of rectangle to return
                            canvas_element.height // height of rectangle to return
                            ).data; // we only care about the data attribute
        //console.timeEnd("getImageData");

        /**
         * getImageData() returns a one-dimensional array where each element represents,
         * one subpixel.  So a full set of pixels looks like this:
         *
         *      (R, G, B, A, R, G, B, A, R, G, B, A, ...)
         *
         * Ugly, right?  Yeah.  So I'm translating them into a 2D array where the origin
         * (sadly) is at the top left.
         *
         * When doing the translation, I'm also starting at the bottom right, so there
         * only has to be ONE array enlarge operation each for the X and Y arrays.
         */

        /**
         * Here we create a 3D array of the correct size, and fill it with
         * placeholder pixels, whose RGBA values are (0,0,0,0).  We'll fill
         * it with the real values later.
         */
        //console.time("Build empty array");
        for( var x = canvas_element.width-1; x >= 0; x-- ) {

            pixarray[x] = new Array(); // insert new vertical array

            for( var y = canvas_element.height-1; y >= 0; y-- ) {

                pixarray[x][y] = new Array(0,0,0,0);

            }

        }
        //console.timeEnd("Build empty array");


        /** 
         * Now we fill up the pix array with real values.
         * We don't REALLY need the alpha channel, but I'm including it
         * just in case a use arises for it in the future.  Likely.
         */

        //console.time("Populate array");

        for( var i = 0; i < imgdata.length-3; i+=4 ) {

            var x = parseInt( parseInt(i/4) % ( canvas_element.width ) );
            var y = parseInt( parseInt(i/4) / ( canvas_element.width ) );

            pixarray[x][y][0] = imgdata[i];
            pixarray[x][y][1] = imgdata[i+1];
            pixarray[x][y][2] = imgdata[i+2];
            pixarray[x][y][3] = imgdata[i+3];

        }
        //console.timeEnd("Populate array");


        return pixarray;
    }


    /**
     * Draws a histogram of this canvas on the target canvas.
     * If no target canvas is specified, it is drawn on top
     * of this canvas.
     *
     * @param a canvas to draw the histogram upon; default is this canvas
     */
    this.histo = function( cnvs, channel, color, background ) {

        if(!cnvs) cnvs = this.canvas;

        var band;
        switch( channel ) {
            case 'r': band = 0; break;
            case 'g': band = 1; break;
            case 'b': band = 2; break;
            default: console.log('Invalid channel provided.'); return;
        }

        cnvs.fillStyle = background;
        cnvs.fillRect( 0, 0, this.width, this.height );

        var histo = new Array();
        var max = 0; // will store the highest value in the histogram

        // Initialize the histogram to all zeroes.
        for( var i = 0; i < 256; i++ )
            histo[i] = 0;

        // Build the histo
        for( var x = 0; x < this.getpixelarray().length; x++ ) {
            for( var y = 0; y < this.getpixelarray()[0].length; y++ ) {
                var pix = this.getpixelarray()[x][y];
                histo[ pix[ band ] ]++;
                if( max < histo[ pix[ band ] ] ) max = histo[ pix[ band ] ];
            }
        }

        // Draw the histo
        cnvs.strokeStyle = color;
        for( var i = 0; i < 256; i++ ) {

            var bar_height = parseInt( this.height - ( histo[i] * this.height / max ) );

            cnvs.beginPath();
            cnvs.moveTo( i, this.height );
            cnvs.lineTo( i, bar_height );
            cnvs.stroke();
        }

        //return histo;
    }

    /**
     * Bins the histogram to the requested number of bins (aka columns!), using simple averages.
     *
     * @return bin
     */
    this.bin = function( histogram, bins ) {

        var bin = new Array();

        var histo_len  = histogram.length;

        // binning scales
        shrink_x = parseFloat( bins ) / parseFloat( histo_len );
        console.log( "binning scale (x): %f", shrink_x );

        console.log( "histo_len: %d", histo_len );
        var span = parseInt( ( parseFloat( histo_len ) / parseFloat( bins ) ) / 2 ) + 1; // how far to the left and right to "reach" for values to average with
        console.log( "span: %d", span );

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

} // End of JSImage constructor


