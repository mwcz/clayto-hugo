---
Title: "Visualizing Machine Learning with WebGL"
Date: 2018-03-14
Tags:
 - demos
 -  programming
 -  javascript
 -  threejs
 -  webgl
 -  3d
 -  web
 -  redhat
 -  redhat-summit
 -  machine-learning
description: "Building a WebGL particle system to visualize machine learning."
thumbnail: thumb.jpg
Mwc: 50
draft: true
---

There are few things as thrilling as pulling off a complex live demo in front of a 7,000 person live audience. Technical presenters famously avoid live demos because Murphy always sees to it that they fail.

This year’s demonstration entailed deploying the same mobile game to three different cloud hosting services, asking the audience to play along, and then pulling the plug on one of the cloud services. The killer feature of Red Hat’s offering was showing that audience members who had been routed to the now-dead cloud service would be seamlessly transitioned to one of the remaining two, without losing any application state, connections, or most importantly, data.

The game itself was an image recognition game, where players were asked to take an image photo of certain objects like a person, a bear, an apple. Machine learning is a fairly opaque subject, certainly not explainable within a brief 25-minute demo. My contribution to the demo was creating a helpful visualization of the machine learning training and inference processes. Given that the audience was not likely to be full of machine learning experts, Will and I agreed to prioritize easy understanding over pure technical accuracy.

### THE PIPES

The pipes represent a neural network. Each branch represents a neuron with one input and two outputs.

Players upload images, which flow into the pipe on the left, and are decomposed into a trail of particles which flow to the tagged destination. For example, an uploaded image of an Apple will flow to the "Apple" pipe.

## GPU-based movement algorithm, CPU only for timer, achieving uniform velocity

Performance is always foremost in my mind when building demos like this. This time, I decided to experiment with pushing as much as possible on to the GPU. each image uploaded by a player into the system ultimately causes a particle system to be created on the dashboard. once that particle system is created, the CPUs only responsibility is incrementing a timer.

In the end I may have gone a little overboard and rely too much on the GPU. It became the biggest bottleneck to Performance, whereas the CPU was barely tapped at all. I began experimenting with moving motion back to the CPU ( by porting the glsl movement algorithm to JavaScript) But ultimately went with the GPU Overkill approach because performance was good enough.

To accomplish this, I first send a series of paths to the GPU has a uniform array. each path in the array is a series of 2D points. for example, I may want a particle to move from point A to point B to point C and finally to point D. each stream of particles is assigned a path number, which corresponds to the index of the desired path within the paths array. the aforementioned timer is used as a sort of progress meter telling the movement algorithm how far along the particle should be on its path. For example, if I want the particles to go from point A to point D in two seconds, the timer being at one second would cause the particle to be drawn directly in between points B and C.

Things to cover:

## the story, context of the demo (not experts, viz tells story, not for nitpickers)

Within a brief 25-minute demo, there's no time for a neural network primer. That limiation led us to design the viz for a wide audience, not assuming any knowledge of neural networks. It depicts what's going on without a laborious prior explanation, but is certain to leave a machine learning expert wanting more.

## getting input from Infinispan/JDG and Gluster (via microservice B)

A microservice written in [vert.x][vertx] supplies the data over a WebSocket connection. Each frame represents an uploaded image and contains:

1.  a URL to the image file in Gluster
2.  the intended subject of the photo, for example "Apple"
3.  the score, or how well the player framed the subject (0 if absent)

That's all I need to animate the image through the pipes.

## Canvas SVG sandwich and the 'path tracer' tool to more easily encode paths

To create an illusion of the particles being inside the pipes, Matt split the pipes in two, a foreground slice with glassy highlights and a background slice with darkened shadows. The WebGL canvas goes in between.

![angled image of svg canvas sandwich]()

## layered pipes setup, link to andres and matt (show angled cutaway of the images, can probably make it with inkscape perspective tool: http://goinkscape.com/using-perspective-for-3d-in-inkscape/ )

## 3542x1144 LED screen

Behind the stage was a truly massive LED screen. It consisted of over **four million** LEDs with a resolution of 3542 x 1144.

![LED SCREEN FRONT]()

![LED SCREEN BACK]()

The resolution was known well ahead of time, so I set up a device profile in Chrome's devtools for 3542 x 1144.

![3542x1144 device profile]()

## improving performance by shrinking then scaling up the webgl canvas

The A/V crew referred to it as a 4K screen, which I wouldn't have guessed, as the screen was almost 500 pixels short of 4,000. It was still a lot of pixels though, and performance issues had plagued me since the beginning. Even with the absolute simplest of scenes, framerates were still disappointing. Late in the project, I discovered a workaround.

I cut the WebGL canvas width and height in half, render at that size (1771 x 572), then scaled it back up to full-screen with CSS. That cut the GPU's workload to 1/4 of what it was.

## pushManyAndres for training viz

Every major project should have an Easter Egg, something to lighten the mood during crunch time. Ours was during the training phase of the machine learning visualization. The viz displays many images flying into the pipes, which converge on "person" over several runs. These were intended to be a wide variety of photos of people, but with time running short, I chose to make them all the same image, one of Andrés Galante, who was extraordinarily helpful on this project. He also made sure I had enough food, hydration, and help during the long rehearsals in the days leading up to showtime.

## early screenshots and final screenshots

![in progress screenshots]()

## [demo video](https://youtu.be/hu2BmE1Wk_Q?t=6m24s)

<video autoplay controls loop>
    <source src="https://media.giphy.com/media/oVlpIBxwuheE/giphy.mp4" />
</video>

Randomly sorted thank-you's:

<ul style="display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr));">
    <li>Will Benton</li>
    <li>Stian Thorgersen</li>
    <li>Sebastian</li>
    <li>Matthew Carleton</li>
    <li>Kyle Buchanan</li>
    <li>Galder Zamarreno</li>
    <li>Erin Boyd</li>
    <li>Clement Escoffier</li>
    <li>Burr Sutter</li>
    <li>Boleslaw</li>
    <li>Andres Galante</li>
</ul>

[vertx]: https://vertx.io/
