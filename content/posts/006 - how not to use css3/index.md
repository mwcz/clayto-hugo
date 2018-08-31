---
Title: "How not to use CSS3"
Date: 2011-11-17
Tags:
 -  html5
 -  css3
 -  typography
 -  web
thumbnail: thumb.jpg
aliases: /2011/11/17/how-not-to-use-css3/
Mwc: 6
---

How to ruin a good thing by abusing CSS3 text shadows...

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<span class="css3_demo">CSS3!</span>

The code:

```js
// Random factors to determine x/y offsets for text shadows and amount of blur
var x_factor = Math.floor(Math.random() * 20) - 10;
var y_factor = Math.floor(Math.random() * 20) - 10;
var blur_factor = Math.floor(Math.random() * 10) + 1;

// Pretty colors
var the_colors = [
  "#7f9f7f",
  "#dca3a3",
  "#80d4aa",
  "#f8f893",
  "#ffcfaf",
  "#e89393",
  "#9ece9e",
  "#c0bed1",
  "#6c6c9c",
  "#71d3b4",
  "#a0afa0",
  "#efefef"
];

function make_it() {
  // MAKE IT SHINE
  // Build a string containing a comma-delimited list of the each shadow we want to apply
  // sprintf would be nice here.
  var shadows = "";
  for (var color_index in the_colors) {
    shadows +=
      color_index * x_factor +
      "px " +
      color_index * y_factor +
      "px " +
      color_index * blur_factor +
      "px " +
      the_colors[color_index];

    // Add a comma unless we're at the end of the color set
    if (color_index != the_colors.length - 1) shadows += ",";
  }
  $(".css3_demo").css("textShadow", shadows); // apply the new style
  the_colors.push(the_colors.shift()); // move first color to the end of the list
  //console.log( shadows );
  setTimeout("make_it()", 50); // make the function async (kinda... effectively...) with setTimeout()
}

function move_it() {
  // MAKE IT MOVE
  /* uncomment this to make it move up and down...
    $('.css3_demo').animate( {top:'+=200'},2000, "linear" )
           .animate( {top:'-=200'},2000, "linear", move_it );
    */
}

$(document).ready(function() {
  make_it();
  move_it();
});
```

<script type="text/javascript">

// Random factors to determine x/y offsets for text shadows and amount of blur
var x_factor    = Math.floor( 0.6 * 20 ) - 10;
var y_factor    = Math.floor( 0.6 * 20 ) - 10;
var blur_factor = Math.floor( 0.2 * 10 ) + 1;

// Pretty colors
var the_colors =
                [
                '#7f9f7f',
                '#dca3a3',
                '#80d4aa',
                '#f8f893',
                '#ffcfaf',
                '#e89393',
                '#9ece9e',
                '#c0bed1',
                '#6c6c9c',
                '#71d3b4',
                '#a0afa0',
                '#efefef'
                ];

function make_it() { // MAKE IT SHINE
    // Build a string containing a comma-delimited list of the each shadow we want to apply
    // sprintf would be nice here.
    var shadows = "";
    for( var color_index in the_colors ) {
        shadows +=
            color_index * x_factor + "px " +
            color_index * y_factor + "px " +
            color_index * blur_factor + "px " +
            the_colors[ color_index ];

        // Add a comma unless we're at the end of the color set
        if( color_index != the_colors.length - 1 )
            shadows += ',';
    }
    $('.css3_demo').css( 'textShadow', shadows ); // apply the new style
    the_colors.push( the_colors.shift() ); // move first color to the end of the list
    //console.log( shadows );
    setTimeout( 'make_it()', 50 ); // make the function async (kinda... effectively...) with setTimeout()
}

function move_it() { // MAKE IT MOVE
    /* uncomment this to make it move up and down...
    $('.css3_demo').animate( {top:'+=200'},2000, "linear" )
           .animate( {top:'-=200'},2000, "linear", move_it );
    */
}

$(document).ready( function() {
    make_it();
    move_it();
});
</script>

<style type="text/css">

.css3_demo {
    font-family: FreeSansBold;
    text-align: center;
    color: #efefef;
    position: relative;
    top: 0;
    left: 50px;
    font-size: 9em;
    padding: 0;
}

</style>
