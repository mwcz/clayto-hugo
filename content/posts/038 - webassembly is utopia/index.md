---
Title: "WebAssembly is the Keystone"
Date: 2015-06-20
Tags:
 -  wasm
 -  web
 -  javascript
thumbnail: asm.png
aliases: /2015/06/20/webassembly-is-the-keystone/
Mwc: 38
---

Within the last two days, WebAssembly (**wasm**) has graced the eyeballs of
every JavaScript developer. If wasm is new to you, the articles linked at the
end of this post fully describe what wasm _is_.

Since that's been covered, I'd like to talk about one impact wasm will
hopefully have on future of computing. To set the scene, a quote from the man
himself:

<blockquote>
    <p>Meanwhile, I took one quick step that would demonstrate the concept of the
        Web as a universal, all-encompassing space.  I programmed the browser so it
        could follow links not only to files on HTTP servers, &hellip;</p>
    <p>In one fell swoop, a huge amount of the information that was already on the
        Internet was available on the Web.</p>
    <footer>
        <cite>
            Tim Berners-Lee, Weaving the Web, 1999
        </cite>
    </footer>
</blockquote>

Back then, Tim enabled the first Web browser to follow links to newsgroups and
FTP servers. By linking up a slew of existing content, the Web became much
more useful.

This realization is pretty potent. The web has taken over the world because of
the power of linking things together, especially things not yet on the web. I
was initially surprised that Tim saw the now-humble URL as the most vital Web
technology and had it standardized before HTTP and HTML.

Today, we can follow URLs to images, videos, articles, text, PDFs; most types
of media are linkable. Clicking/tapping a link is the most commonplace thing
in the world.

There's one type of content that still isn't linkable, though: _Applications_.

For the past ten years, the JavaScript revolution has been trying to make real
the dream of **following a URL to an application**.

It's been a circuitous, roundabout, and partially successful journey.
[Emscripten][emscripten] has made it possible and [asm.js][asmjs] made it
faster.

My great hope for WebAssembly is that it can bring the world's teeming vault of
existing applications onto the web, with very little fuss. Imagine using
Photoshop merely by going to `photoshop.adobe.com`, and you'll have some idea
of where WebAssembly might carry us.

---

After the WebAssembly announcement, I read every bit of documentation currently
available, about a dozen articles, joined the [W3C Community Group][w3cgroup],
and have been hanging out in the IRC channel
(`irc://irc.w3.org:6667/#webassembly`). I don't want to speak too soon, but
I'm pretty well convinced that wasm is the next revolution.

<!-- I'm imagining a future where this is a desktop shortcut:

    wasm://adobe.com/photoshop

A few thoughts about the future of wasm:

### Live installs

wasm has the potential to be the LiveCD of applications.  Imagine visiting a
wasm application in your browser.  If it's great, you might want to install it
locally.


-->

For further reading, here are some of the best articles I've found:

- [The wasm FAQ covers nearly everything][faq]
- [Luke Wagner's initial announcement][luke_article]
- [Brendan Eich's practical and lighthearted appeal][eich_article]
- [Eric Elliot makes a strong and diverse case][elliot_article]
- [ArsTechnica brings wasm to a wider audience][ars_article]

<div hidden>
<img src="asm.png">
</div>

[luke_article]: https://blog.mozilla.org/luke/2015/06/17/webassembly/
[eich_article]: https://brendaneich.com/2015/06/from-asm-js-to-webassembly/#buried-lede
[ars_article]: http://arstechnica.com/information-technology/2015/06/the-web-is-getting-its-bytecode-webassembly/
[elliot_article]: https://medium.com/javascript-scene/what-is-webassembly-the-dawn-of-a-new-era-61256ec5a8f6
[axel_article]: www.2ality.com/2015/06/web-assembly.html
[w3cgroup]: https://www.w3.org/community/webassembly/
[faq]: https://github.com/WebAssembly/design/blob/master/FAQ.md
[emscripten]: http://emscripten.org/
[asmjs]: http://asmjs.org/
