---
Title: "Kimotion"
Date: 2015-09-26
url: /projects/kimotion
thumbnail: ./thumb.png
description: Kimotion is a framework for building reactive digital art displays.
Tags:
 -  programming
 -  javascript
 -  threejs
 -  webgl
 -  3d
 -  2d
 -  art
 -  sparkcon
 -  geekspark
 -  dimo
 -  physics
 -  web
 -  kimotion
---

Kimotion is a framework for building reactive art displays.

Creating an interactive art exhibit with Kimotion is easy. Draw your ideas in
either [2D][p5js] or [3D][threejs]. Kimotion will provide information about
the scene, which you can use to influence your display.

Learn more at [kimotion.xyz][kimotion-web], or if you want to see it in
action...

<p class="text-center"><a class="btn btn-default btn-lg" href="http://kimotion.xyz/live">Launch live demo!</a></p>

# Video clips

These images, when played in rapid succession, create the illusion of motion!

<figure>
    <iframe id="vimeo-player" src="https://player.vimeo.com/video/136951447" width="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
    <div class="vimeo-thumbnails">
    <div class="vimeo-thumbnail"> <img src="http://kimotion.xyz/images/video_thumbnails/9.jpg" data-vid-src="https://player.vimeo.com/video/136951447" /> </div>
    <div class="vimeo-thumbnail"> <img src="http://kimotion.xyz/images/video_thumbnails/11.jpg" data-vid-src="https://player.vimeo.com/video/137905577" /> </div>
    <div class="vimeo-thumbnail"> <img src="http://kimotion.xyz/images/video_thumbnails/3.jpg" data-vid-src="https://player.vimeo.com/video/126292045" /> </div>
    <div class="vimeo-thumbnail"> <img src="http://kimotion.xyz/images/video_thumbnails/10.jpg" data-vid-src="https://player.vimeo.com/video/137762679" /> </div>
    <div class="vimeo-thumbnail"> <img src="http://kimotion.xyz/images/video_thumbnails/6.jpg" data-vid-src="https://player.vimeo.com/video/136126008" /> </div>
    <div class="vimeo-thumbnail"> <img src="http://kimotion.xyz/images/video_thumbnails/5.jpg" data-vid-src="https://player.vimeo.com/video/133870922" /> </div>
    </div>
</figure>
<style type="text/css">
.vimeo-thumbnails {
    display: grid;
    grid-gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.vimeo-thumbnail {
    cursor   : pointer;
    position : relative;
    z-index  : 9;
    display  : inline-block;
}

.vimeo-thumbnail::before {
color : white;
content : "\25B6";
opacity : 0.8;
position : absolute;
display : block;
text-shadow : 0 0 6px black;
z-index : 100;
font-size : 50px;
left : 50%;
top : 42%;
transform : translate(-50%, -50%);
}

.vimeo-thumbnail:hover::before {
opacity : 1;
text-shadow : 0 0 6px white;
}
</style>

<script>
var iframe = $('iframe#vimeo-player');

function handle_vid_click() {
    iframe.attr('src', $(this).find('[data-vid-src]').attr('data-vid-src') + '?autoplay=1');
}

function init_vimeo_picker() {
    // get every img with data-vid-src
    // get ref to iframe
    // create onclick for each img which sets iframe's src to data-vid-src
    var vidlinks = $('.vimeo-thumbnail');
    vidlinks.on('click', handle_vid_click);
}

init_vimeo_picker();

function set_vimeo_iframe_height() {
    iframe.attr('height', iframe.width() / (1280/720) );
}

document.addEventListener('DOMContentLoaded', set_vimeo_iframe_height);
window.addEventListener('resize', set_vimeo_iframe_height);
</script>
<hr>

[View source][repo], if you like code. Also check out [DiMo: Particles][dimo],
the predecessor to Kimotion.

<div hidden><img src="thumb.png" alt="kimotion thumbnail"></div>

[dimo]: /projects/dimo
[repo]: https://github.com/mwcz/Kimotion
[osdc]: http://opensource.com/life/15/2/sparkcon-geekspark-digital-motion-exhibit
[kimotion-web]: http://kimotion.xyz
[p5js]: http://p5js.org
[threejs]: http://threejs.org
