document
  .querySelector("#close")
  .addEventListener("click", window.close.bind(window));

const sfx = {
  mousedown: new Howl({
    src: [
      "/shortcodes/popup-showdown/mousedown.ogg",
      "/shortcodes/popup-showdown/mousedown.mp3",
      "/shortcodes/popup-showdown/mousedown.wav"
    ]
  }),
  mouseup: new Howl({
    src: [
      "/shortcodes/popup-showdown/mouseup.ogg",
      "/shortcodes/popup-showdown/mouseup.mp3",
      "/shortcodes/popup-showdown/mouseup.wav"
    ]
  })
};
[].forEach.call(document.querySelectorAll("button"), function(btn) {
  btn.addEventListener("mousedown", function() {
    sfx.mousedown.play();
  });
  btn.addEventListener("mouseup", function() {
    sfx.mouseup.play();
  });
});
