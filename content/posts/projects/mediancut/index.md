---
Title: "median-cut.js"
Date: 2009-01-01
url: /projects/mediancut
thumbnail: ./median-mean-comparison.png
Tags:
 -  html5
 -  javascript
 -  color
---

The unfortunately-named `median-cut.js` is the library that powers
[ColorPal's][1] palette generation.

I say it's unfortunately named because it doesn't implement a pure median-cut
algorithm.  It's identical, except that instead of cutting boxes at their
median, they are instead cut at the mean.  This results in more pleasing color
palettes in most cases.

Here's a comparison:

![median-cut vs mean-cut comparison image](median-mean-comparison.png "median-cut vs mean-cut comparison image")

If you're interested in median-cut vs mean-cut, see [this post][2] for a
technical discussion.

The code is [available on GitHub][3].

[1]: http://colorpal.org/ "ColorPal"
[2]: /2012/02/10/colorpal-palettes-improved/ "Post about mean-cut"
[3]: https://github.com/mwcz/median-cut-js "median-cut.js GitHub repository"
