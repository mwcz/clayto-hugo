var s=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),this.active=!1,this.paused=!1,this.shadowRoot.innerHTML=`
        <style>
            meter {
                width: 100%;
            }
        </style>
        <label>
            <meter optimum=0 low=800 high=1500 value=0 max=2500></meter>
            <span id="label-text">&nbsp;</span>
        </label>
        `,this.labelText=this.shadowRoot.querySelector("#label-text"),this.meter=this.shadowRoot.querySelector("meter"),this.step=this.step.bind(this)}start(){this.paused?this.paused=!1:this.startTime=performance.now(),this.active=!0,requestAnimationFrame(this.step)}pause(){this.paused=!0}step(){this.active&&!this.paused&&(this._updateLabel(),requestAnimationFrame(this.step))}_updateLabel(){let e=performance.now()-this.startTime;this.setLabel(`${e.toFixed(1)}ms`),this.meter.value=e}stop(){this._updateLabel(),this.active=!1}setLabel(e){this.labelText.innerText=e}},h=s;customElements.define("rtw-timer",s);var r=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"}),fetch(`${import.meta.url}/../wasm_bg.wasm`),this.shadowRoot.innerHTML=`
            <style>
                :host {
                    display: inline-block;
                    background-color: var(--rtw-background-color, grey);
                    padding: 14px;
                }
                canvas {
                    aspect-ratio: 5/3.33;
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
                    overflow-y: hidden;
                }
            </style>

            <canvas width="500" height="333"></canvas>
            <div class="controls">
                <button disabled>Render</button>
                <rtw-timer></rtw-timer>
            </div>
        `}connectedCallback(){this.btn=this.shadowRoot.querySelector("button"),this.canvas=this.shadowRoot.querySelector("canvas"),this.timer=this.shadowRoot.querySelector("rtw-timer"),this.ctx=this.canvas.getContext("2d"),this.moduleWorkerSupported=!0,this.worker=this.createWorker(),this.wasmInit=null,this.wasmRender=null,this.btn.addEventListener("click",()=>{this.preRender(),this.render()})}createWorker(){let e=new URL(`${import.meta.url}/../wasm-worker.js`),a=new Worker(e.href,{type:"module"});return a.addEventListener("message",async t=>{if(t.data.status==="success")t.data.data.imageData?this.postRender(t.data.data.imageData):t.data.data.initialized&&(this.btn.disabled=!1);else if(t.data.status==="error"){if(console.log(`web worker error type: ${t.data.data.type}`),t.data.data.type==="import"){this.moduleWorkerSupported=!1,this.btn.disabled=!1;let i=await import("./wasm-render.js");this.wasmInit=i.wasmInit,this.wasmRender=i.wasmRender,await wasmInit(),this.timer.pause(),this.timer.setLabel("Module worker not supported in this browser; running on the main thread (expect lockup during render).")}t.data.data.type==="render"&&(this.timer.pause(),this.timer.setLabel("Error occurred in worker during rendering."))}}),a.postMessage("init"),a}async preRender(){this.timer.start(),this.btn.disabled=!0}async render(){console.log(`starting render ${["ON","OFF"][~~this.moduleWorkerSupported]} the main thread`),this.moduleWorkerSupported?this.worker.postMessage("render"):this.postRender(await this.wasmRender())}postRender(e){console.time("drawing canvas"),this.ctx.putImageData(e,0,0),console.timeEnd("drawing canvas"),this.timer.step(),this.timer.stop(),this.btn.innerText="Re-render",this.btn.disabled=!1}},n=r;customElements.define("rtw-render",r);export{n as default};
