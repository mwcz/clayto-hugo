"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var UI=function(){function UI(images){_classCallCheck(this,UI),this.init(images)}return _createClass(UI,[{key:"init",value:function(images){var _this=this;this.toggleText=["Show menu","Hide menu"],this.playPause=["&#9654;","&nbsp;&#9612; &#9612;"],this.playTimeouts=[],this.engine=new Ractive({el:"#container",template:"#template",data:{name:"world",activeImage:0,images:images,toggleText:this.toggleText[1],show:!0,playText:this.playPause[1]}}),this.engine.on("setImage",function(img){_this.engine.set("activeImage",_this.engine.get("images").indexOf(_this._getRelativeSrc(img)))}),this.engine.on("setImageButton",function(img){_this.stopRotate(),_this.setImage(img)}),this.engine.on("toggle",function(){_this.engine.set("show",!_this.engine.get("show")),_this.engine.set("toggleText",_this.toggleText[~~_this.engine.get("show")])}),this.engine.on("togglePlay",function(){if(_this.playTimeouts.forEach(clearTimeout),_this.playTimeouts=[],_this.engine.set("playText",_this.playPause[~~!_this.engine.get("rotating")]),_this.engine.get("rotating"))_this.stopRotate();else{_this.engine.set("rotating",!0);var tid=setTimeout(function(){_this.setImageByIndex(_this.engine.get("activeImage")+1),_this.startRotate()},800);_this.playTimeouts.push(tid)}})}},{key:"setImage",value:function(img){this.engine.fire("setImage",img)}},{key:"_getRelativeSrc",value:function(img){var path=void 0;return path=img.node?img.node.src:img,console.log("[ui] "+path.replace(location.href,"")),path.replace(location.href,"")}},{key:"onSetImage",value:function(f){var _this2=this;this.engine.on("setImage",function(evt){f(_this2._getRelativeSrc(evt))})}},{key:"onToggleFlee",value:function(f){this.engine.on("toggleFlee",f)}},{key:"setImageByIndex",value:function(index){var imageCount=this.engine.get("images").length;-1===index&&(index=imageCount-1);var newIndex=index%imageCount,newImage=this.engine.get("images")[newIndex];this.engine.set("activeImage",newIndex),this.setImage(newImage)}},{key:"startRotate",value:function(){var _this3=this;this._intervalId=setInterval(function(){_this3.setImageByIndex(_this3.engine.get("activeImage")+1)},6900),this.engine.set("playText",this.playPause[1]),this.engine.set("rotating",!0)}},{key:"stopRotate",value:function(){clearInterval(this._intervalId),this.engine.set("playText",this.playPause[0]),this.engine.set("rotating",!1)}},{key:"addImage",value:function(img){var images=this.engine.get("images"),index=images.indexOf(img);return-1===index&&(images.push(img),this.engine.set("images",images),index=images.length-1),index}}]),UI}();