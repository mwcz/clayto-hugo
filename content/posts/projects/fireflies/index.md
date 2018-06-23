---
Title: "Fireflies"
Date: 2017-02-06
url: /projects/fireflies
thumbnail: ./fireflies-logo.png
Tags:
 -  programming
 -  javascript
 -  threejs
 -  webgl
 -  3d
 -  art
 -  particles
---

Fireflies is a WebGL demo in which a friendly flock of fireflies forms shapes
for your entertainment.

![fireflies title screen](/static/images/projects/fireflies/title.jpg)

<p class="text-center"><a class="btn btn-default btn-lg" href="/static/projects/fireflies">Live demo!</a></p>

<iframe id="vimeo-player" src="https://player.vimeo.com/video/202827845" width="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

Thanks to [Loren Schmidt][loren] for agreeing to let me use the awesome
pixel-person avatar.

[View source][source], if you're into that kind of thing.

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

<img hidden src="fireflies-logo.png">

[demo]: /static/projects/fireflies
[source]: https://github.com/mwcz/fireflies/
[threejs]: http://threejs.org
[loren]: https://twitter.com/lorenschmidt
