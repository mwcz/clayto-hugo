---
Title: "Canvas Indexed Color"
Date: 2012-07-03
url: /projects/canvas_indexed_color
Tags:
 -  html5
 -  javascript
 -  color
draft: true
thumbnail: ./thumb.png
---

What have we here?  It's a limited demonstration of [indexed color][1] within the HTML5 canvas element.

<style type="text/css">
.color_palette {
    list-style: none;
}
.panel-body {
    background-color: #1f1f1f;
}
.palette-panel-body a.btn {
    margin: 6px;
}
.color_palette li {
    float: left;
    display: inline;
}
input.color {
    height: 58px;
    width: 58px;
    margin: 2px;
    text-align: center;
    cursor: crosshair;
    font-size: 0.8em;
    padding: 0;
}
#cnvs {
    width: 400px;
    height: 400px;
}
</style>

<div class="row">
    <div class="col-md-6 col-xs-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                SVG tiger rendered to a &lt;canvas&gt;
            </div>
            <div class="panel-body">
                <canvas class="img-responsive" id="cnvs" data-bind="updateCanvas: colors"></canvas>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xs-12">
        <div class="panel panel-default">
            <div class="panel-heading">
                Distinct pixel values
            </div>
            <div class="panel-body palette-panel-body">
                <ol class="color_palette" data-bind="template: { name: 'CIC_ColorPaletteTemplate', foreach: colors }"></ol>
                <div class="clearfix"></div>
                <hr />
                <button class="btn btn-primary" onclick="location.assign('/projects/canvas_indexed_color/#000000,323232,4C4C4C,#659900,#666666,999999,#999999,#99cc32,#a51926,#a5264c,#b23259,#b26565,#b2b2b2,#cc3f4c,CCCCCC,#cccccc,#e5668c,#e59999,#e5e5b2,E8E8E8,EAEAEA,EAEAEA,EBEBEB,ECECEC,EEEEEE,EFEFEF,F1F1F1,F2F2F2,F3F3F3,F4F4F4,F5F5F5,F8F8F8,F8F8F8,F9F9F9,FAFAFA,FCFCFC,#ff727f,#ffffcc,#ffffff'); location.reload(); return false;" href="/projects/canvas_indexed_color/#000000,323232,4C4C4C,#659900,#666666,999999,#999999,#99cc32,#a51926,#a5264c,#b23259,#b26565,#b2b2b2,#cc3f4c,CCCCCC,#cccccc,#e5668c,#e59999,#e5e5b2,E8E8E8,EAEAEA,EAEAEA,EBEBEB,ECECEC,EEEEEE,EFEFEF,F1F1F1,F2F2F2,F3F3F3,F4F4F4,F5F5F5,F8F8F8,F8F8F8,F9F9F9,FAFAFA,FCFCFC,#ff727f,#ffffcc,#ffffff">Create a white tiger</a>
                <button class="btn btn-primary" id="cic-tiger-scan" onclick="location.assign('/projects/canvas_indexed_color/#ED0202,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,#FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,#ffffff,FFFFFF,FFFFFF,FFFFFF'); location.reload(); return false;" href="/projects/canvas_indexed_color/#ED0202,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,#FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,FFFFFF,#FFFFFF,FFFFFF,#ffffff,FFFFFF,FFFFFF,FFFFFF">Tiger scan!</a>
                <button class="btn btn-primary" onclick="cvm.cycleColors(); return false;" href="">Cycle colors</a>
                <button class="btn btn-primary" onclick="location = '/projects/canvas_indexed_color'">Reset to classic SVG tiger</a>
            </div>
        </div>
    </div>
</div>

<script>
function copyToClipboard (text) {
  window.prompt ("To copy to clipboard: press Ctrl+C, then Enter\n\n (use Cmd+C if you're on a Mac)", text);
}
</script>

<script type="text/html" id="CIC_ColorPaletteTemplate">
    <li>
        <input class="color btn" data-bind="value: hex" />
    </li>
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js"></script>
<script src="/projects/canvas_indexed_color/demo/farbtastic/farbtastic.js"></script>
<script src="/projects/canvas_indexed_color/demo/vector_images.js"></script>
<script src="/projects/canvas_indexed_color/demo/cic.js"></script>
<script src="/projects/canvas_indexed_color/demo/jscolor/jscolor.js"></script>

This is a pretty limited demo and doesn't *actually* implement an indexed color
API for the canvas element; it merely simulated indexed color.  To really see
the power of indexed color, check out this brilliant [color cycling demo][6].
It's still beautiful today, but seeing it in the 90s was mind-blowing.

**Credits**

 - [Knockout][4] for its very nice UI/data structure binding
 - The color picker is [Farbtastic][3]
 - Whoever created the postscript/ghostscript tiger.  I found [some clues][5] but no true author.

[1]: https://en.wikipedia.org/wiki/Indexed_color "Indexed color: Wikipedia"
[2]: /2012/07/03/introducing-canvas-indexed-color/ "Introducing Canvas Indexed Color blog post"
[3]: https://github.com/mattfarina/farbtastic "Farbtastic color picker"
[4]: http://knockoutjs.com/ "Knockout.js"
[5]: http://ptspts.blogspot.com/2010/12/dramatic-colored-picture-of-tigers-head.html "GhostScript tiger author archeology"
[6]: http://www.effectgames.com/effect/article-Old_School_Color_Cycling_with_HTML5.html "Amazing color cycling demo"
