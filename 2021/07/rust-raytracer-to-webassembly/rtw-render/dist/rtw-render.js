var p=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})}play(){this.style.setProperty("--play-state","running")}pause(){this.style.setProperty("--play-state","paused")}connectedCallback(){let o=this.hasAttribute("paused"),t=+this.getAttribute("box-count")||4,a=+this.getAttribute("duration")||Math.sqrt(t/4),e=new Array(t).fill(),s=a/(t*.7),n=100*s,d=`
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
                    --play-state: ${o?"paused":"running"};
                }
                div {
                    display: grid;
                    grid-template-columns: ${e.map(()=>"1fr").join(" ")};
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
                  ${n}% {
                      transform: scaleX(100%);
                      opacity: 1;
                  }
                }
                @keyframes y {
                  0% {
                      transform: scaleY(var(--pbp-loading-grow, 150%));
                      opacity: 0;
                  }
                  ${n}% {
                      transform: scaleY(100%);
                      opacity: 1;
                  }
                }
                span::before {
                    ${d.replace("$WIDTH","1px 0 1px 0").replace("$DIM","y")}
                }
                span::after {
                    ${d.replace("$WIDTH","0 1px 0 1px").replace("$DIM","x")}
                }
                */
            </style>
            <div>
                ${e.map((c,l)=>`<span style="--delay:${l*s}s"></span>`).join("")}
            </div>
        `}};customElements.define("pbp-loading",p);var r=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.active=!1,this.paused=!1,this.step=this.step.bind(this)}connectedCallback(){this.shadowRoot.innerHTML=`
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
        `,this.labelText=this.shadowRoot.querySelector("#label-text"),this.loading=this.shadowRoot.querySelector("pbp-loading"),console.log("loading",this.loading)}resetSpinner(){this.loading.style.removeProperty("--play-state"),this.labelText.parentNode.removeChild(this.loading),this.labelText.parentNode.insertBefore(this.loading,this.labelText)}start(){this.paused?this.paused=!1:this.startTime=performance.now(),this.active=!0,this.loading.play(),requestAnimationFrame(this.step)}pause(){this.paused=!0,this.loading.pause()}step(){this.active&&!this.paused&&(this._updateLabel(),requestAnimationFrame(this.step))}_updateLabel(){let t=performance.now()-this.startTime;this.setLabel(`${t.toFixed(1)}ms`)}stop(){this.resetSpinner(),this._updateLabel(),this.active=!1}setLabel(t){this.labelText.innerText=t}},g=r;customElements.define("rtw-timer",r);var i=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),fetch(`${import.meta.url}/../wasm_bg.wasm`),this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--rtw-background-color, black);
                    padding: 14px;
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
        `}connectedCallback(){this.btn=this.shadowRoot.querySelector("button"),this.canvas=this.shadowRoot.querySelector("canvas"),this.timer=this.shadowRoot.querySelector("rtw-timer"),this.ctx=this.canvas.getContext("2d"),this.moduleWorkerSupported=!0,this.worker=this.createWorker(),this.wasmInit=null,this.wasmRender=null,this.btn.addEventListener("click",()=>{this.preRender(),this.render()})}createWorker(){let t=new URL(`${import.meta.url}/../wasm-worker.js`),a=new Worker(t.href,{type:"module"});return a.addEventListener("message",async e=>{if(e.data.status==="success")e.data.data.imageData?this.postRender(e.data.data.imageData):e.data.data.initialized&&(this.btn.disabled=!1);else if(e.data.status==="error"){if(console.log(`web worker error type: ${e.data.data.type}`),e.data.data.type==="import"){this.moduleWorkerSupported=!1,this.btn.disabled=!1;let s=await import("./wasm-render.js");this.wasmInit=s.wasmInit,this.wasmRender=s.wasmRender,await wasmInit(),this.timer.pause(),this.timer.setLabel("Module worker not supported in this browser; running on the main thread (expect lockup during render).")}e.data.data.type==="render"&&(this.timer.pause(),this.timer.setLabel("Error occurred in worker during rendering."))}}),a.postMessage("init"),a}async preRender(){this.timer.start(),this.btn.disabled=!0}async render(){console.log(`starting render ${["ON","OFF"][~~this.moduleWorkerSupported]} the main thread`),this.moduleWorkerSupported?this.worker.postMessage("render"):this.postRender(await this.wasmRender())}postRender(t){console.time("drawing canvas"),this.ctx.putImageData(t,0,0),console.timeEnd("drawing canvas"),this.timer.step(),this.timer.stop(),this.btn.innerText="Re-render",this.btn.disabled=!1}},h=i;customElements.define("rtw-render",i);export{h as default};
