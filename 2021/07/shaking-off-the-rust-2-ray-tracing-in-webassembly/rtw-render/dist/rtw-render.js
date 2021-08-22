var h=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})}play(){this.style.setProperty("--play-state","running")}pause(){this.style.setProperty("--play-state","paused")}connectedCallback(){let i=this.hasAttribute("paused"),t=+this.getAttribute("box-count")||4,e=+this.getAttribute("duration")||Math.sqrt(t/4),a=new Array(t).fill(),n=e/(t*.7),d=100*n,l=`
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
        `;this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: inline-block;
                    --play-state: ${i?"paused":"running"};
                }
                div {
                    display: grid;
                    grid-template-columns: ${a.map(()=>"1fr").join(" ")};
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
                  ${d}% {
                      transform: scaleX(100%);
                      opacity: 1;
                  }
                }
                @keyframes y {
                  0% {
                      transform: scaleY(var(--pbp-loading-grow, 150%));
                      opacity: 0;
                  }
                  ${d}% {
                      transform: scaleY(100%);
                      opacity: 1;
                  }
                }
                span::before {
                    ${l.replace("$WIDTH","1px 0 1px 0").replace("$DIM","y")}
                }
                span::after {
                    ${l.replace("$WIDTH","0 1px 0 1px").replace("$DIM","x")}
                }
                */
            </style>
            <div>
                ${a.map((m,p)=>`<span style="--delay:${p*n}s"></span>`).join("")}
            </div>
        `}};customElements.define("pbp-loading",h);var r=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.active=!1,this.paused=!1,this.step=this.step.bind(this)}connectedCallback(){this.shadowRoot.innerHTML=`
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
        `,this.labelText=this.shadowRoot.querySelector("#label-text"),this.loading=this.shadowRoot.querySelector("pbp-loading")}resetSpinner(){this.loading.style.removeProperty("--play-state"),this.labelText.parentNode.removeChild(this.loading),this.labelText.parentNode.insertBefore(this.loading,this.labelText)}start(){this.paused?this.paused=!1:this.startTime=performance.now(),this.active=!0,this.loading.play(),requestAnimationFrame(this.step)}pause(){this.paused=!0,this.loading.pause()}step(){this.active&&!this.paused&&(this.duration=performance.now()-this.startTime,this._updateLabel(this.duration),requestAnimationFrame(this.step))}_updateLabel(t){this.setLabel(`${t.toFixed(1)}ms`)}stop(){this.resetSpinner(),this.active=!1}setLabel(t){this.labelText.innerText=t}},w=r;customElements.define("rtw-timer",r);function s(){let i=!1,t=URL.createObjectURL(new Blob([""])),e={get type(){i=!0}};return new Worker(t,e).terminate(),URL.revokeObjectURL(t),i}var o=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),fetch(`${import.meta.url}/../wasm_bg.wasm`),this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--rtw-background-color, black);
                    padding: 14px;
                }
                canvas {
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
                .log {
                  margin-bottom: 0;
                  font-family: monospace;
                  white-space: pre;
                  line-height: 1.4;
                }
            </style>

            <canvas width="500" height="333"></canvas>
            <div class="controls">
                <button disabled>Render</button>
                <rtw-timer></rtw-timer>
            </div>
            <p class="log">Total rays        = \u2754
Total duration    = \u2754
Time per ray      = \u2754
Ray rate          = \u2754
Image width       = \u2754
Image height      = \u2754
Samples per pixel = \u2754</p>
        `}async connectedCallback(){this.btn=this.shadowRoot.querySelector("button"),this.canvas=this.shadowRoot.querySelector("canvas"),this.timer=this.shadowRoot.querySelector("rtw-timer"),this.log=this.shadowRoot.querySelector(".log"),this.ctx=this.canvas.getContext("2d"),s()?(console.log("module workers supported, creating worker"),this.worker=this.createWorker()):(console.log("module workers NOT supported, will render on the main thread"),await this.initMainThreadRendering()),this.wasmInit=null,this.wasmRender=null,this.btn.addEventListener("click",async()=>{await this.preRender(),this.render()})}createWorker(){let t=new URL(`${import.meta.url}/../wasm-worker.js`),e=new Worker(t.href,{type:"module"});return e.addEventListener("message",async a=>{a.data.status==="success"?a.data.data.renderResult?this.postRender(a.data.data.renderResult):a.data.data.initialized&&(this.btn.disabled=!1):a.data.status==="error"&&a.data.data.type==="render"&&(this.timer.pause(),this.log.textContent="Error occurred in worker during rendering.")}),e.postMessage("init"),e}async initMainThreadRendering(){let t=await import("./wasm-render.js");this.wasmInit=t.wasmInit,this.wasmRender=t.wasmRender,await this.wasmInit(),this.btn.disabled=!1,this.log.textContent=`Rendering will run on the main thread
because Module Workers are not supported
in this browser.  Expect lock-up during
rendering.`}async preRender(){this.timer.start(),!s(),this.btn.disabled=!0}async render(){if(s())console.log("starting render in a module worker"),this.worker.postMessage("render");else{console.log("starting render on the main thread"),this.wasmInit||await this.initMainThreadRendering();let t=await this.wasmRender();this.postRender(t)}}writeStats(t){let e=Number(t.total_rays);this.log.textContent=`Total rays        = ${e.toLocaleString("en-US")}
Total duration    = ${this.timer.duration.toFixed(1)} ms
Time per ray      = ${(this.timer.duration/e*1e3).toFixed(4)} microseconds/ray
Ray rate          = ${(e/this.timer.duration/1e3).toFixed(4)} rays/microsecond
Image width       = ${t.width}
Image height      = ${t.height}
Samples per pixel = ${t.samples_per_pixel}`}postRender(t){console.time("drawing canvas"),this.canvas.width=t.width,this.canvas.height=t.height,this.ctx.putImageData(new ImageData(t.pixels,t.width),0,0),console.timeEnd("drawing canvas"),this.timer.step(),this.timer.stop(),this.writeStats(t),this.btn.innerText="Re-render",this.btn.disabled=!1}},c=o;customElements.define("rtw-render",o);export{c as default};
//# sourceMappingURL=rtw-render.js.map
