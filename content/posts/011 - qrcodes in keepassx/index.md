---
Title: "The N9, QR-Codes, and KeePassX"
Date: 2012-01-08
Tags:
 -  general
 -  keepass
 -  n9
thumbnail: thumb.png
aliases: /2012/01/08/the-n9-qr-codes-and-keepassx/
Mwc: 11
---

_Update: I happened across a [KeePass
plugin](http://keepass.info/plugins.html#qrcodegen) (not the same as KeePassX)
that displays passwords as QR codes, just like my hack below._

Poor, glorious N9.

It's impossible not to love the N9 if you're a geek, especially a programming,
bash-loving, Linux-hankering geek. It's like a nerd talisman. This post isn't
about the N9, specifically, so I'll save the love-fest for another time.

This post is about how difficult it can be to get text (especially passwords)
onto a smartphone securely. I've come to like the approach of using QR codes.
Most (all?) smartphones have a barcode scanner, and QR codes are one of [many
convenient ways](http://en.wikipedia.org/wiki/Barcode) to encode text into an
image. In the case of the N9, it's
[MeeScan](http://n9-apps.com/meescan).

![meescan](meescan.png)

[qrencode](http://fukuchi.org/works/qrencode/index.html.en) is an extremely
easy to use encoder. Pass it a string, it produces an image.

    qrencode "mypassword" -o mypass.png

[KeePassX](http://keepassx.org) is an excellent password manager.
Unfortunately...

![KeePassX not in N9](keepass_not_in_n9.png)

Sadly, there is no KeePassX client on the N9. At least, not yet. Even if
there were, I'm skeptical that it's a good idea at all to be carrying around a
database of personal passwords on a smartphone. It's encrypted, sure, but
touchscreen keyboards encourage weak passphrases. Who wants to enter a 64+
character passphrase on a <abbr title="Virtual keyboard">vkbd</abbr>?

This evening, I spent about an hour hacking QR-code support into KeePassX.
It's a seriously messy hack, using
[system()](http://en.cppreference.com/w/cpp/utility/program/system) to call
`qrencode`, pass in the password, then call
[evince](http://projects.gnome.org/evince/?guid=ON) to view it. Even worse, I
just tacked it onto the "Copy Password" function, instead of figuring out how
to create a new menu item. It doesn't even delete the generated image after
viewing. Definitely nothing more than a proof of concept.

Here it is in action.

<p>
<a href="keepassx_demo.png">
<img class="grid_7" src="keepassx_demo.png" alt="KeePassX generating a QR code" title="" />
</a></p>

<div class="clear"></div>

I won't be distributing my mod unless someone _really_ wants it, but it would
be cool to see this available as plugin to any password managers that support
plugins. It could be handy to have clipboard managers generate QR codes too.
