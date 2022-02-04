---
Title: "Noise/Echo Cancellation in Fedora"
aliases:
 - /2017/10/12/noiseecho-cancellation-in-fedora-26
 - /2017/10/12/noiseecho-cancellation-in-fedora-26-
 - /2017/10/noise/echo-cancellation-in-fedora-26-
 - /2017/10/noise/echo-cancellation-in-fedora-26-29
Date: 2017-10-12
lastmod: 2019-04-01
Tags:
 -  linux
 -  fedora
 -  audio
description: "How to enable PulseAudio noise and echo cancellation in Fedora 26-29."
thumbnail: ./after.jpg
hero: ./minimic.jpg
Mwc: 48
---


The Minimic is great. I just received mine last week, and I'm loving the ability to join video calls with [nice, comfy headphones][grado]. It's much better than switching back and forth between headphones and a headset.

The only problem is that, since the minimic is just _a wire_, it doesn't have any noise or echo cancellation. And since Fedora doesn't come with that feature enabled by default, the mic was picking up a lot of ambient noise. [Breddy][breddy] told me that steps just like the following didn't work in Fedora a few versions ago, so I wanted to document them now that the issues seem to be fixed. I originally found these instructions on [this r/linux post][rlinux] and am reposting them here with Fedora-specific flourishes.

Without further ado, here's how to turn on noise and echo cancellation in Fedora 26. **Update**: also works in Fedora 27 (and 28 (and 29!)!).

---

# Just gimme it

If you're in a rush, here's a script that will set everything up for you.

```sh
sudo dnf install -y webrtc-audio-processing
echo '.nofail' | sudo tee -a /etc/pulse/default.pa
echo 'load-module module-echo-cancel aec_method=webrtc source_name=echosource' | sudo tee -a /etc/pulse/default.pa
echo 'set-default-source echosource' | sudo tee -a /etc/pulse/default.pa
echo '.fail' | sudo tee -a /etc/pulse/default.pa
pulseaudio -k
```

Your noise-cancelled input device should now be available.  If it's no longer available after your next reboot, see the [missing input device addendum][#startup-addendum].

Updated on 2019-04-01: added `set-default-source` to automatically set the noise cancelled device as the default.

---

# Again, but with explanation

The first step is to install the WebRTC audio processing package. It _may_ come by default with Fedora. My machine had it installed already, but I'm including it here in case it was simply a dependency of some other package I've installed.

```sh
sudo dnf install webrtc-audio-processing
```

Then add these two lines to the end of `/etc/pulse/default.pa`.

```sh
.nofail
load-module module-echo-cancel aec_method=webrtc
.fail
```

Then restart PulseAudio.

```sh
pulseaudio -k
```

Now, if you open Sound settings, you should see a new entry under the _Input_ tab. Mine is called "**Built-in Audio Analog Stereo (echo cancelled with SA9027 USB Audio Analog Stereo)**". Not sure what's up with that name; my mic is connected with a 3.5mm audio jack. Whatever, it works!

<figure>
    <img src="devices.png">
</figure>

Select the device that says "echo cancelled" and your audio background hiss should drop to almost nothing. Here's a before and after spectrum analysis.

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

# Missing input device addendum

After using this trick for the past few Fedora releases, I've been stumped by why the noise-cancelled input device doesn't automatically show up after a fresh boot.  I always have to run `pulseaudio -k` manually after rebooting to get the device to appear.

I haven't found a solution for the core problem yet, but a workaround is to automatically restart PulseAudio upon loggin in.  Here's a script which sets that up.

```sh
mkdir -p ~/.config/autostart
cat > ~/.config/autostart/restart-pulseaudio.desktop << EOF
[Desktop Entry]
Comment=Kill pulseaudio to trigger automatic restart, so that my config will be loaded properly.  I don't know why.
Terminal=false
Name=Restart PulseAudio
Exec=bash -c "pulseaudio -k"
Type=Application
EOF
```

Good luck!  I hope this advice *is sound*.


[fedora]: https://getfedora.org/
[breddy]: https://chrisbredesen.com/
[rlinux]: https://www.reddit.com/r/linux/comments/2yqfqp/just_found_that_pulseaudio_have_noise/
[grado]: http://gradolabs.com/
