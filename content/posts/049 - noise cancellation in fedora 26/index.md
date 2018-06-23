---
Title: "Noise/Echo Cancellation in Fedora (26+)"
URL: /2017/10/12/noiseecho-cancellation-in-fedora-26/
Date: 2017-10-12
Tags:
 -  linux
 -  fedora
 -  audio
description: "How to enable PulseAudio noise and echo cancellation in Fedora 26, 27, and 28."
thumbnail: ./after.jpg
Mwc: 48
---


The Minimic is great.  I just received mine last week, and I'm loving the ability to join video calls with [nice, comfy headphones][grado].  It's much better than switching back and forth between headphones and a headset.

<figure>
    <img src="minimic.jpg">
</figure>

The only problem is that, since the minimic is just *a wire*, it doesn't have any noise or echo cancellation.  And since Fedora doesn't come with that feature enabled by default, the mic was picking up a lot of ambient noise.  [Breddy][breddy] told me that steps just like the following didn't work in Fedora a few versions ago, so I wanted to document them now that the issues seem to be fixed.  I originally found these instructions on [this r/linux post][rlinux] and am reposting them here with Fedora-specific flourishes.

Without further ado, here's how to turn on noise and echo cancellation in Fedora 26.  **Update**: also works in Fedora 27 (and 28!).

---

# Just gimme it

If you're in a rush, here's a script that will set everything up for you.

```sh
sudo dnf install -y webrtc-audio-processing
echo '.nofail' | sudo tee -a /etc/pulse/default.pa
echo 'load-module module-echo-cancel aec_method=webrtc' | sudo tee -a /etc/pulse/default.pa
pulseaudio -k
```

---

# Again, but with explanation

The first step is to install the WebRTC audio processing package.  It *may* come by default with Fedora.  My machine had it installed already, but I'm including it here in case it was simply a dependency of some other package I've installed.

```sh
sudo dnf install webrtc-audio-processing
```

Then add these two lines to the end of `/etc/pulse/default.pa`.

```sh
.nofail
load-module module-echo-cancel aec_method=webrtc
```

Then restart PulseAudio.

```sh
pulseaudio -k
```

Now, if you open Sound settings, you should see a new entry under the *Input* tab.  Mine is called "**Built-in Audio Analog Stereo (echo cancelled with SA9027 USB Audio Analog Stereo)**".  Not sure what's up with that name; my mic is connected with a 3.5mm audio jack.  Whatever, it works!

<figure>
    <img src="devices.png">
</figure>

Select the device that says "echo cancelled" and your audio background hiss should drop to almost nothing.  Here's a before and after spectrum analysis.

<div class="beside">
    <figure>
        <img src="before.jpg" alt="Audio spectrum analysis of microphone input without noise cancellation." />
        <figcaption>Spectrum analysis without noise cancellation.</figcaption>
    </figure>
    <figure>
        <img src="after.jpg" alt="Audio spectrum analysis of microphone input with noise cancellation." />
        <figcaption>Spectrum analysis <b>with</b> noise cancellation.</figcaption>
    </figure>
</div>

[fedora]: https://getfedora.org/
[breddy]: https://chrisbredesen.com/
[rlinux]: https://www.reddit.com/r/linux/comments/2yqfqp/just_found_that_pulseaudio_have_noise/
[grado]: http://gradolabs.com/
