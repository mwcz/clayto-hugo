document.querySelector('#close').addEventListener('click', window.close.bind(window));

const sfx = {
    mousedown: new Howl({ src: ['mousedown.ogg', 'mousedown.mp3', 'mousedown.wav'] }),
    mouseup: new Howl({ src: ['mouseup.ogg', 'mouseup.mp3', 'mouseup.wav'] }),
};
[].forEach.call(document.querySelectorAll('button'), function (btn) {
    btn.addEventListener('mousedown', function () { sfx.mousedown.play() });
    btn.addEventListener('mouseup', function () { sfx.mouseup.play() });
});
