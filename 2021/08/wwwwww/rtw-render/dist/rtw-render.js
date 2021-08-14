// node_modules/@mwcz/pbp-loading/dist/pbp-loading.js
var a = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }
  play() {
    this.style.setProperty("--play-state", "running");
  }
  pause() {
    this.style.setProperty("--play-state", "paused");
  }
  connectedCallback() {
    let n = this.hasAttribute("paused"), t = +this.getAttribute("box-count") || 4, e = +this.getAttribute("duration") || Math.sqrt(t / 4), s = new Array(t).fill(), o = e / (t * 0.7), i = 100 * o, p = `
            content: "";
            position: absolute;
            display: block;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border: var(--pbp-loading-border, 1px solid white);
            border-width: $WIDTH;
            animation: $DIM ${e}s backwards alternate infinite;
            animation-delay: var(--delay);
            animation-play-state: var(--play-state);
        `;
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    --play-state: ${n ? "paused" : "running"};
                }
                div {
                    display: grid;
                    grid-template-columns: ${s.map(() => "1fr").join(" ")};
                    grid-gap: var(--pbp-loading-gap, 8px);
                }
                span {
                    display: inline-block;
                    position: relative;
                    height: var(--pbp-loading-box-size, 20px);
                    width: var(--pbp-loading-box-size, 20px);
                }
                @keyframes x {
                  0% {
                      transform: scaleX(var(--pbp-loading-grow, 150%));
                      opacity: 0;
                  }
                  ${i}% {
                      transform: scaleX(100%);
                      opacity: 1;
                  }
                }
                @keyframes y {
                  0% {
                      transform: scaleY(var(--pbp-loading-grow, 150%));
                      opacity: 0;
                  }
                  ${i}% {
                      transform: scaleY(100%);
                      opacity: 1;
                  }
                }
                span::before {
                    ${p.replace("$WIDTH", "1px 0 1px 0").replace("$DIM", "y")}
                }
                span::after {
                    ${p.replace("$WIDTH", "0 1px 0 1px").replace("$DIM", "x")}
                }
                */
            </style>
            <div>
                ${s.map((d, r) => `<span style="--delay:${r * o}s"></span>`).join("")}
            </div>
        `;
  }
};
customElements.define("pbp-loading", a);

// rtw-timer.js
var Timer = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.active = false;
    this.paused = false;
    this.step = this.step.bind(this);
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
            pbp-loading {
                width: 100%;
            }
            label {
                display: grid;
                grid-template-columns: 1fr;
                grid-gap: 6px;
            }
        </style>
        <label>
            <pbp-loading paused duration=0.8 box-count=8></pbp-loading>
            <span id="label-text">&nbsp;</span>
        </label>
        `;
    this.labelText = this.shadowRoot.querySelector("#label-text");
    this.loading = this.shadowRoot.querySelector("pbp-loading");
  }
  resetSpinner() {
    this.loading.style.removeProperty("--play-state");
    this.labelText.parentNode.removeChild(this.loading);
    this.labelText.parentNode.insertBefore(this.loading, this.labelText);
  }
  start() {
    console.log("TIMER start");
    if (!this.paused) {
      this.startTime = performance.now();
    } else {
      this.paused = false;
    }
    this.active = true;
    this.loading.play();
    requestAnimationFrame(this.step);
  }
  pause() {
    console.log("TIMER pause");
    this.paused = true;
    this.loading.pause();
  }
  step() {
    console.log("TIMER step");
    if (this.active && !this.paused) {
      this._updateLabel();
      requestAnimationFrame(this.step);
    }
  }
  _updateLabel() {
    const diff = performance.now() - this.startTime;
    this.setLabel(`${diff.toFixed(1)}ms`);
  }
  stop() {
    console.log("TIMER stop");
    this.resetSpinner();
    this._updateLabel();
    this.active = false;
  }
  setLabel(msg) {
    this.labelText.innerText = msg;
  }
};
var rtw_timer_default = Timer;
customElements.define("rtw-timer", Timer);

// module-worker-test.js
function supportsModuleWorkers() {
  let supportsModuleWorker = false;
  const workerURL = URL.createObjectURL(new Blob([""]));
  const options = {
    get type() {
      supportsModuleWorker = true;
    }
  };
  new Worker(workerURL, options).terminate();
  URL.revokeObjectURL(workerURL);
  return supportsModuleWorker;
}

// rtw-render.js
var RtwRender = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--rtw-background-color, black);
                    padding: 14px;
                    width: 528px;
                }
                canvas {
                    width: 100%;
                    image-rendering: -moz-crisp-edges;
                    image-rendering: -webkit-crisp-edges;
                    image-rendering: pixelated;
                    image-rendering: crisp-edges;
                }
                .controls {
                    margin-top: 8px;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 14px;
                }
                button {
                    border: var(--rtw-button-border, 1px solid white);
                    background: var(--rtw-button-background, black);
                    color: var(--rtw-button-color, white);
                }
                button:hover {
                    background: var(--rtw-button-background-hover, #1f1f1f);
                }
                button:active, button:focus {
                    background: var(--rtw-button-background-active, #3f3f3f);
                }
            </style>

            <canvas width="500" height="333"></canvas>
            <div class="controls">
                <button disabled>Render</button>
                <rtw-timer></rtw-timer>
            </div>
            <p class="log"></p>
        `;
  }
  async connectedCallback() {
    this.btn = this.shadowRoot.querySelector("button");
    this.canvas = this.shadowRoot.querySelector("canvas");
    this.timer = this.shadowRoot.querySelector("rtw-timer");
    this.log = this.shadowRoot.querySelector(".log");
    this.ctx = this.canvas.getContext("2d");
    if (supportsModuleWorkers()) {
      console.log("module workers supported, creating worker");
      this.worker = this.createWorker();
    } else {
      console.log("module workers NOT supported, will render on the main thread");
      await this.initMainThreadRendering();
    }
    this.wasmInit = null;
    this.wasmRender = null;
    this.btn.addEventListener("click", async () => {
      await this.preRender();
      this.render();
    });
  }
  createWorker() {
    const workerUrl = new URL(`${import.meta.url}/../wasm-worker.js`);
    const worker = new Worker(workerUrl.href, {type: "module"});
    worker.addEventListener("message", async (e) => {
      if (e.data.status === "success") {
        if (e.data.data.imageData) {
          this.postRender(e.data.data.imageData);
        } else if (e.data.data.initialized) {
          this.btn.disabled = false;
        }
      } else if (e.data.status === "error") {
        if (e.data.data.type === "render") {
          this.timer.pause();
          this.log.textContent = "Error occurred in worker during rendering.";
        }
      }
    });
    worker.postMessage("init");
    return worker;
  }
  async initMainThreadRendering() {
    const wasmModule = await import("./wasm-render.js");
    this.wasmInit = wasmModule.wasmInit;
    this.wasmRender = wasmModule.wasmRender;
    await this.wasmInit();
    this.btn.disabled = false;
    this.log.textContent = "Rendering will run on the main thread because Module Workers are not supported in this browser.  Expect lock-up during rendering.";
  }
  async preRender() {
    this.timer.start();
    if (!supportsModuleWorkers()) {
    }
    this.btn.disabled = true;
  }
  async render() {
    if (supportsModuleWorkers()) {
      console.log("starting render in a module worker");
      this.worker.postMessage("render");
    } else {
      console.log("starting render on the main thread");
      if (!this.wasmInit) {
        await this.initMainThreadRendering();
      }
      const imageData = await this.wasmRender();
      this.postRender(imageData);
    }
  }
  postRender(imageData) {
    console.time("drawing canvas");
    this.ctx.putImageData(imageData, 0, 0);
    console.timeEnd("drawing canvas");
    this.timer.step();
    this.timer.stop();
    this.btn.innerText = "Re-render";
    this.btn.disabled = false;
  }
};
var rtw_render_default = RtwRender;
customElements.define("rtw-render", RtwRender);
export {
  rtw_render_default as default
};
