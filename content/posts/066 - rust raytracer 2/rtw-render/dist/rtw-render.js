var c=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})}play(){this.style.setProperty("--play-state","running")}pause(){this.style.setProperty("--play-state","paused")}connectedCallback(){let s=this.hasAttribute("paused"),e=+this.getAttribute("box-count")||4,a=+this.getAttribute("duration")||Math.sqrt(e/4),t=new Array(e).fill(),n=a/(e*.7),d=100*n,l=`
            content: "";
            position: absolute;
            display: block;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border: var(--pbp-loading-border, 1px solid white);
            border-width: $WIDTH;
            animation: $DIM ${a}s backwards alternate infinite;
            animation-delay: var(--delay);
            animation-play-state: var(--play-state);
        `;this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: inline-block;
                    --play-state: ${s?"paused":"running"};
                }
                div {
                    display: grid;
                    grid-template-columns: ${t.map(()=>"1fr").join(" ")};
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
                ${t.map((h,p)=>`<span style="--delay:${p*n}s"></span>`).join("")}
            </div>
        `}};customElements.define("pbp-loading",c);var r=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.active=!1,this.paused=!1,this.step=this.step.bind(this)}connectedCallback(){this.shadowRoot.innerHTML=`
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
        `,this.labelText=this.shadowRoot.querySelector("#label-text"),this.loading=this.shadowRoot.querySelector("pbp-loading")}resetSpinner(){this.loading.style.removeProperty("--play-state"),this.labelText.parentNode.removeChild(this.loading),this.labelText.parentNode.insertBefore(this.loading,this.labelText)}start(){this.paused?this.paused=!1:this.startTime=performance.now(),this.active=!0,this.loading.play(),requestAnimationFrame(this.step)}pause(){this.paused=!0,this.loading.pause()}step(){this.active&&!this.paused&&(this._updateLabel(),requestAnimationFrame(this.step))}_updateLabel(){let e=performance.now()-this.startTime;this.setLabel(`${e.toFixed(1)}ms`)}stop(){this.resetSpinner(),this._updateLabel(),this.active=!1}setLabel(e){this.labelText.innerText=e}};customElements.define("rtw-timer",r);function i(){let s=!1,e=URL.createObjectURL(new Blob([""])),a={get type(){s=!0}};return new Worker(e,a).terminate(),URL.revokeObjectURL(e),s}var o=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),fetch(`${import.meta.url}/../wasm_bg.wasm`),this.shadowRoot.innerHTML=`
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
                  display: none;
                  margin-bottom: 0;
                }
                .log.active {
                  display: block;
                }
            </style>

            <canvas width="500" height="333"></canvas>
            <div class="controls">
                <button disabled>Render</button>
                <rtw-timer></rtw-timer>
            </div>
            <p class="log"></p>
        `}async connectedCallback(){this.btn=this.shadowRoot.querySelector("button"),this.canvas=this.shadowRoot.querySelector("canvas"),this.timer=this.shadowRoot.querySelector("rtw-timer"),this.log=this.shadowRoot.querySelector(".log"),this.ctx=this.canvas.getContext("2d"),i()?(console.log("module workers supported, creating worker"),this.worker=this.createWorker()):(console.log("module workers NOT supported, will render on the main thread"),await this.initMainThreadRendering()),this.wasmInit=null,this.wasmRender=null,this.btn.addEventListener("click",async()=>{await this.preRender(),this.render()})}createWorker(){let e=new URL(`${import.meta.url}/../wasm-worker.js`),a=new Worker(e.href,{type:"module"});return a.addEventListener("message",async t=>{t.data.status==="success"?t.data.data.imageData?this.postRender(t.data.data.imageData):t.data.data.initialized&&(this.btn.disabled=!1):t.data.status==="error"&&t.data.data.type==="render"&&(this.timer.pause(),this.log.textContent="Error occurred in worker during rendering.",this.log.classList.add("active"))}),a.postMessage("init"),a}async initMainThreadRendering(){let e=await import("./wasm-render-U5CGS4LF.js");this.wasmInit=e.wasmInit,this.wasmRender=e.wasmRender,await this.wasmInit(),this.btn.disabled=!1,this.log.textContent="Rendering will run on the main thread because Module Workers are not supported in this browser.  Expect lock-up during rendering.",this.log.classList.add("active")}async preRender(){this.timer.start(),!i(),this.btn.disabled=!0}async render(){if(i())console.log("starting render in a module worker"),this.worker.postMessage("render");else{console.log("starting render on the main thread"),this.wasmInit||await this.initMainThreadRendering();let e=await this.wasmRender();this.postRender(e)}}postRender(e){console.time("drawing canvas"),this.ctx.putImageData(e,0,0),console.timeEnd("drawing canvas"),this.timer.step(),this.timer.stop(),this.btn.innerText="Re-render",this.btn.disabled=!1}};customElements.define("rtw-render",o);export{o as default};
