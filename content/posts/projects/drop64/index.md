---
Title: "Drop64"
Date: 2014-02-05
url: /projects/drop64
thumbnail: recording.gif
Tags:
 -  html5
 -  javascript
 -  css3
 -  data uri
 -  data url
---

Drop64 is an easy drag-and-drop tool for generating [Data URIs][1] from any
file.

Check it out at [drop64.com][2].

Here's a demo recording of how easy it is.

![Drop64 recording](recording.gif)

Some benefits of Data URIs are:

- Fewer HTTP requests means faster page loads
- avoid cross-origin resource loading issues (fonts in Firefox, for example)
- you can paste the Data URI directly into your web browser URL bar to view the file (occasionally convenient)

If you noticed the similarity to [ColorPal][3], well done! I reused a lot of
ColorPal's code in Drop64. Almost all of it, in fact.

For more information on Data URIs, check out [MDN][4] or the original [RFC][5].

[1]: http://css-tricks.com/data-uris/
[2]: http://drop64.com/
[3]: http://colorpal.org/
[4]: https://developer.mozilla.org/en-US/docs/data_URIs
[5]: http://tools.ietf.org/html/rfc2397
