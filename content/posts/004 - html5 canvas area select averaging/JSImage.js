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
     * Private instance variables.
     */
    this.id = arg_canvas_id;
    this.src = arg_image_src;
    var marquee;
    var that = this; // hack to allow inner methods to access instance variables
    var canvas_element = document.getElementById( arg_canvas_id ); // Establish references to the canvas element and the canvas itself
    var canvas; // reference for the real canvas (not the element)
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


    canvas = canvas_element.getContext('2d');
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
        canvas_element.width = img.width;
        canvas_element.height = img.height;
        canvas.drawImage( img, 0, 0 );
    }


    /**
     * Returns the pixels from a rectangular area.
     *
     * @returns A linear array of the pixels (R,G,B,A,R,G,B,A, ... )
     */
    this.getrect = function( x, y, w, h ) {
        return canvas.getImageData( x, y, w, h ).data;
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
            canvas_element.style.outlineColor = "rgb(" + av[0] + "," + av[1] + "," + av[2] + ")";
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
        var imgdata = canvas.getImageData( 
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


} // End of JSImage constructor


