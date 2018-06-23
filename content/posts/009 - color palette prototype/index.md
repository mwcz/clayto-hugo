---
Title: "HTML5 tool for creating color palettes from an image"
Date: 2011-11-17
Tags:
 -  html5
 -  canvas
 -  color
 -  colorpal
 -  web
Mwc: 9
---

For an [HCI](http://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction) class project in Fall 2009, I pulled together some of my previous demos to make this integrated tool.  It was just a prototype, and I haven't taken the time to get the code set up and working on this blog.  If anyone is interested, I can dig up the code and send it along.

<iframe width="100%" height="550" src="http://www.youtube.com/embed/p9QiGPUiXdc" frameborder="0" allowfullscreen></iframe>

<script>
var iframe = $('iframe');

function set_iframe_height() {
    iframe.attr('height', iframe.width() / (1280/1160) );
}

document.addEventListener('DOMContentLoaded', set_iframe_height);
window.addEventListener('resize', set_iframe_height);
</script>

In retrospect, it really could have used some narration...
