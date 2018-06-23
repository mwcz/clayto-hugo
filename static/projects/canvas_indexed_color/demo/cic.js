
/****************************************************************************
 *                                                                          *
 * Determines if any element of tuple1 exceeds the element in tuple2 at the *
 * same position.  In other words, returns true if:                         *
 *                                                                          *
 * tuple1[ i ] > tuple2[ i ]                                                *
 *                                                                          *
 * For any i in 0..n where n is the number of elements in both tuple1 and   *
 * tuple2.                                                                  *
 *                                                                          *
 ****************************************************************************/

function tupleFits( tuple1, tuple2 ) {

    if ( !propEquals( tuple1, tuple2, "length" ) ) {
        throw {
            name    : "ObjectLengthError",
            message : "Object lengths not equal."
        };
    }
    for ( i = 0; i < tuple1.length - 1; ++i ) {
        if ( tuple1[ i ] > tuple2[ i ] ) {
            return false;
        }
    }

    return true;

}
/******************************************************
 *                                                    *
 * Returns true if two objects' properties are equal. *
 *                                                    *
 ******************************************************/

function propEquals( obj1, obj2, propname ) {
    return obj1[ propname ] === obj2[ propname ];
}

/********************************************************
 *                                                      *
 * Clamps tuple1 to fit inside tuple2, while preserving *
 * the ratio between the elements in tuple1.            *
 *                                                      *
 ********************************************************/

function clampTuple( tuple, max_tuple ) {

    // This will hold the ratios tuple[0] / tuple[1], tuple[1]/tuple[2], and so
    // on, so there will be tuple.length - 1 ratios.

    var ratios = [],
        clamped_tuple = tuple.slice(0),
        i, j;


    // Build an array containing the ratios between each element, for
    // reference later.

    for ( i = 0; i < tuple.length - 1; ++i ) {
        ratios.push( tuple[ i ] / tuple[ i + 1 ] );
    }

    // Now visit each element again, see if it's larger than the max.  If it's
    // larger than the max, reduce it to equal the max, and reduce every other
    // element by the ratios we already found.  Once each element has been
    // visited, all the ratios between them will be the same, but they will all
    // fit inside (ie. are smaller than) the max tuple.

    for ( i = 0; i < clamped_tuple.length - 1; ++i ) {

        // only take action if the current element is larger than the max
        if ( clamped_tuple[i] > max_tuple[i] ) {

            clamped_tuple[i] = max_tuple[i];

            // Travel towards the end of the clamped_tuple, updating elements

            for ( j = i; j < clamped_tuple.length - 1; ++j ) {
                clamped_tuple[ j + 1 ] = clamped_tuple[ j ] / ratios[ j ];
            }

            // Travel towards the beginning of the clamped_tuple, updating elements

            for ( j = i; j > 0; --j ) {
                clamped_tuple[ j - 1 ] = clamped_tuple[ j ] * ratios[ j - 1 ];
            }

        }
    }

    return clamped_tuple;


}

function resizeCanvas() {
    var viewport_size = [ $(cnvs).parent().width(), $(cnvs).parent().height() ];

    canvas_actual_size = clampTuple( canvas_display_size, viewport_size );

    cnvs.style.width  = canvas_actual_size[0] + "px";
    cnvs.style.height = canvas_actual_size[1] + "px";
}

var cnvs,
    ctx,
    colors,
    cvm,
    canvas_display_size = [ 900, 900 ],
    canvas_actual_size = canvas_display_size;

$(document).ready( function() {

    cnvs = document.getElementById("cnvs");
    ctx  = cnvs.getContext("2d");

    cnvs.width  = canvas_display_size[0];
    cnvs.height = canvas_display_size[1];

    resizeCanvas();

    $(window).resize( function() {
        resizeCanvas();
    });

    function CIC_ViewModel() {

        var self = this; // <3 JS !

        self.colors = ko.observableArray( [
            { hex: ko.observable("#000000") },
            { hex: ko.observable("#323232") },
            { hex: ko.observable("#4c0000") },
            { hex: ko.observable("#659900") },
            { hex: ko.observable("#666666") },
            { hex: ko.observable("#992600") },
            { hex: ko.observable("#999999") },
            { hex: ko.observable("#99cc32") },
            { hex: ko.observable("#a51926") },
            { hex: ko.observable("#a5264c") },
            { hex: ko.observable("#b23259") },
            { hex: ko.observable("#b26565") },
            { hex: ko.observable("#b2b2b2") },
            { hex: ko.observable("#cc3f4c") },
            { hex: ko.observable("#cc7226") },
            { hex: ko.observable("#cccccc") },
            { hex: ko.observable("#e5668c") },
            { hex: ko.observable("#e59999") },
            { hex: ko.observable("#e5e5b2") },
            { hex: ko.observable("#e87f3a") },
            { hex: ko.observable("#ea8c4d") },
            { hex: ko.observable("#ea8e51") },
            { hex: ko.observable("#eb955c") },
            { hex: ko.observable("#ec9961") },
            { hex: ko.observable("#eea575") },
            { hex: ko.observable("#efaa7c") },
            { hex: ko.observable("#f1b288") },
            { hex: ko.observable("#f2b892") },
            { hex: ko.observable("#f3bf9c") },
            { hex: ko.observable("#f4c6a8") },
            { hex: ko.observable("#f5ccb0") },
            { hex: ko.observable("#f8d8c4") },
            { hex: ko.observable("#f8dcc8") },
            { hex: ko.observable("#f9e2d3") },
            { hex: ko.observable("#fae5d7") },
            { hex: ko.observable("#fcf2eb") },
            { hex: ko.observable("#ff727f") },
            { hex: ko.observable("#ffffcc") },
            { hex: ko.observable("#ffffff") }
        ]);

        self.getColorStringArray = function () {
            var colorStringArray = [],
                key;
            for ( key in self.colors() ) {
                if (self.colors().hasOwnProperty(key)) {
                    colorStringArray.push( self.colors()[key].hex() );
                }
            }
            return colorStringArray;
        };

        self.selected = ko.observable(false);

        self.setColor = function( index, color ) {

            self.colors() [ index ].hex( color );

        };

        self.getColor = function( index ) {

            return self.colors() [ index ].hex();

        };

        self.cycleColors = function() {

            self.colors().push( self.colors().shift() );
            self.colors.notifySubscribers(); // not sure why push and shift aren't notifying...

        };
    }

    cvm = new CIC_ViewModel();

    ko.bindingHandlers.updateCanvas = {
        init : function( element, valueAccessor, allBindingsAccessor, viewModel ) {
            // If a hash is defined, set the colors based on it
            if ( getHash() !== "" ) {
                var url_colors = parseHash( getHash() ),
                    i;
                for ( i = url_colors.length - 1; i >= 0; --i ) {
                    viewModel.setColor( i, url_colors[i] );
                }
            }
        },
        update : function( element, valueAccessor, allBindingsAccessor, viewModel ) {
            drawCanvas( ctx, 0 );
            setHash( createHash() );
        }
    };

    ko.applyBindings( cvm );

    function drawCanvas( ctx ) {
        CIC_VectorImages.svgTiger( ctx );
    }

    function createHash() {
        return cvm.getColorStringArray().join(',');
    }

    function setHash( new_hash ) {
        document.location.hash = new_hash;
    }

    function parseHash( hash ) {
        return hash.split(',');
    }

    function getHash() {
        return document.location.hash;
    }

});
