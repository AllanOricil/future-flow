!function(t,i){"object"==typeof exports&&"object"==typeof module?module.exports=i():"function"==typeof define&&define.amd?define([],i):"object"==typeof exports?exports.futureFlow=i():t.futureFlow=i()}(window,(function(){return function(t){var i={};function e(s){if(i[s])return i[s].exports;var o=i[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=i,e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:s})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,i){if(1&i&&(t=e(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(e.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var o in t)e.d(s,o,function(i){return t[i]}.bind(null,o));return s},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.p="",e(e.s=1)}([function(t,i){function e(t,i){var e=[],s=[];return null==i&&(i=function(t,i){return e[0]===i?"[Circular ~]":"[Circular ~."+s.slice(0,e.indexOf(i)).join(".")+"]"}),function(o,h){if(e.length>0){var n=e.indexOf(this);~n?e.splice(n+1):e.push(this),~n?s.splice(n,1/0,o):s.push(o),~e.indexOf(h)&&(h=i.call(this,o,h))}else e.push(h);return null==t?h:t.call(this,o,h)}}(t.exports=function(t,i,s,o){return JSON.stringify(t,e(i,o),s)}).getSerialize=e},function(t,i,e){"use strict";e.r(i),e.d(i,"Flow",(function(){return a}));class s{constructor(t,i){this.from=t,this.to=i}get connectionPoints(){let t=1/0,i={};return this.from.sides.forEach(e=>{this.to.sides.forEach(s=>{const o=Math.sqrt(Math.pow(e.x-s.x,2)+Math.pow(e.y-s.y,2));o<t&&(t=o,i={from:e,to:s})})}),i}get path(){let t=this.connectionPoints,i=t.from,e=t.to,s=Math.abs(e.x-i.x)/2,o=Math.abs(e.y-i.y)/2,h=[];return"left"===i.name&&"right"===e.name||"right"===i.name&&"left"===e.name?(i.x>e.x&&(s*=-1),h.push({x:i.x,y:i.y},{x:i.x+s,y:i.y},{x:e.x-s,y:e.y},{x:e.x,y:e.y})):"bottom"!==i.name&&"top"!==i.name||"right"!==e.name&&"left"!==e.name?"right"!==i.name&&"left"!==i.name||"top"!==e.name&&"bottom"!==e.name?("top"===i.name&&"bottom"===e.name||"bottom"===i.name&&"top"===e.name)&&(i.y>e.y&&(o*=-1),h.push({x:i.x,y:i.y},{x:i.x,y:i.y+o},{x:e.x,y:e.y-o},{x:e.x,y:e.y})):h.push({x:i.x,y:i.y},{x:e.x,y:i.y},{x:e.x,y:e.y}):h.push({x:i.x,y:i.y},{x:i.x,y:e.y},{x:e.x,y:e.y}),h}draw(t){if(this.path.length>0){t.lineWidth="2",t.strokeStyle="rgb(200,200,200)",t.beginPath(),t.moveTo(this.path[0].x,this.path[0].y),this.path.forEach(i=>{t.lineTo(Math.ceil(i.x),Math.ceil(i.y)),t.stroke()}),t.closePath();let i=this.path[this.path.length-1],e=this.path[this.path.length-2];i.x==e.x?i.y>e.y?(t.beginPath(),t.moveTo(i.x,i.y),t.lineTo(i.x+10,i.y-10),t.lineTo(i.x-10,i.y-10)):(t.beginPath(),t.moveTo(i.x,i.y),t.lineTo(i.x-10,i.y+10),t.lineTo(i.x+10,i.y+10)):i.x>e.x?(t.beginPath(),t.moveTo(i.x,i.y),t.lineTo(i.x-10,i.y-10),t.lineTo(i.x-10,i.y+10)):(t.beginPath(),t.moveTo(i.x,i.y),t.lineTo(i.x+10,i.y-10),t.lineTo(i.x+10,i.y+10)),t.fillStyle="rgb(200,200,200)",t.fill(),t.closePath()}}}const o=function({fontFamily:t,fontSize:i,fontWeight:e}){var s=document.createElement("span");s.innerHTML="Hg",s.style.fontFamily=t,s.style.fontSize=i,s.style.fontWeight=e||"normal";var o=document.createElement("div");o.style.display="inline-block",o.style.width="1px",o.style.height="0px";var h=document.createElement("div");h.append(s,o),document.body.appendChild(h);try{var n={};o.style.verticalAlign="baseline",n.ascent=o.offsetTop-s.offsetTop,o.style.verticalAlign="bottom",n.height=o.offsetTop-s.offsetTop,n.descent=n.height-n.ascent}finally{h.remove()}return n};class h extends class extends class extends class{constructor(){this.callbacks={}}on(t,i){this.callbacks[t]||(this.callbacks[t]=[]),this.callbacks[t].push(i)}emit(t,i){let e=this.callbacks[t];e&&e.forEach(t=>t(i))}}{constructor(t,i,e,s){super(),this.x=t,this.y=i,this.w=e,this.h=s,this.events=[],this.connections=[],this.selected=!1,this.hover=!1,this._id=+new Date+1e5*Math.random(),this.on("click",t=>{this.selected=!this.selected})}get area(){return this.w*this.h}get center(){return{x:this.x+this.w/2,y:this.y+this.h/2}}get sides(){return[{x:this.x+this.w/2,y:this.y,name:"top"},{x:this.x+this.w,y:this.y+this.h/2,name:"right"},{x:this.x+this.w/2,y:this.y+this.h,name:"bottom"},{x:this.x,y:this.y+this.h/2,name:"left"}]}addConnection(t){const i=new s(this,t);this.connections.push(i)}draw(t){}contains(t,i){return t>=this.x&&t<=this.x+this.w&&i>=this.y&&i<=this.y+this.h}}{constructor(t,i,e,s){super(t,i,e,s)}draw(t){super.draw(t),t.fillStyle="black",t.beginPath(),t.rect(this.x,this.y,this.w,this.h),t.stroke(),Object.values(this.sides).forEach(i=>{t.beginPath(),t.strokeStyle="red",t.arc(i.x,i.y,2,0,2*Math.PI,!0),t.stroke()}),this.connections.forEach(i=>{i.draw(t),Object.values(i.closesPoints).forEach(i=>{t.beginPath(),t.strokeStyle="green",t.arc(i.x,i.y,2,0,2*Math.PI,!0),t.stroke()})})}}{static MAX_WIDTH(){return 350}static MAX_HEIGHT(){return 500}static PADDING(){return{top:15,right:15,bottom:15,left:15}}static ICON(){return{width:25,height:25}}constructor({x:t,y:i,isDraggable:e,background:s,shadow:n,border:r,header:a,body:l,footer:d}){super(t||0,i||0,1,1),this.x=t||0,this.y=i||0,this.background=s||{color:"rgb(255,255,255)"},this.border=r||{radius:5,normal:{width:1,color:"black"},selected:{width:1,color:"black"},hover:{width:1,color:"black"}},this.shadow=n,this.isDraggable=0!=e,a&&(this.header=a,this._headerTextHeight=o({fontFamily:this.header.font.family,fontSize:this.header.font.size,fontWeight:this.header.font.weight}),this.header.padding=a.padding||h.PADDING()),l&&(this.body=l,this._bodyTextHeight=o({fontFamily:this.body.font.family,fontSize:this.body.font.size,fontWeight:this.body.font.weight}),this.body.padding=l.padding||h.PADDING()),d&&(this.footer=d,this._footerTextHeight=o({fontFamily:this.footer.font.family,fontSize:this.footer.font.size,fontWeight:this.footer.font.weight}),this.footer.padding=d.padding||h.PADDING()),this.on("mouseenter",()=>{this.hover=!0}),this.on("mouseleave",()=>{this.hover=!1})}draw(t){let i=this.border.radius;var e=this.x+this.w,s=this.y+this.h;t.save(),this.shadow&&(t.shadowColor=this.shadow.color,t.shadowBlur=this.shadow.blur,t.shadowOffsetX=this.shadow.offset.x,t.shadowOffsetY=this.shadow.offset.y),t.strokeStyle=this.border.normal.color,t.fillStyle=this.background.color,t.lineWidth=this.border.normal.width,t.beginPath(),t.moveTo(this.x+i,this.y),t.lineTo(e-i,this.y),t.quadraticCurveTo(e,this.y,e,this.y+i),t.lineTo(e,this.y+this.h-i),t.quadraticCurveTo(e,s,e-i,s),t.lineTo(this.x+i,s),t.quadraticCurveTo(this.x,s,this.x,s-i),t.lineTo(this.x,this.y+i),t.quadraticCurveTo(this.x,this.y,this.x+i,this.y),t.stroke(),t.fill(),t.closePath(),t.restore(),this.selected&&(t.save(),t.strokeStyle=this.border.selected.color,t.lineWidth=this.border.selected.width,t.beginPath(),t.moveTo(this.x+i,this.y),t.lineTo(e-i,this.y),t.quadraticCurveTo(e,this.y,e,this.y+i),t.lineTo(e,this.y+this.h-i),t.quadraticCurveTo(e,s,e-i,s),t.lineTo(this.x+i,s),t.quadraticCurveTo(this.x,s,this.x,s-i),t.lineTo(this.x,this.y+i),t.quadraticCurveTo(this.x,this.y,this.x+i,this.y),t.stroke(),t.closePath(),t.restore()),this.hover&&(t.save(),t.strokeStyle=this.border.hover.color,t.lineWidth=this.border.hover.width,t.beginPath(),t.moveTo(this.x+i,this.y),t.lineTo(e-i,this.y),t.quadraticCurveTo(e,this.y,e,this.y+i),t.lineTo(e,this.y+this.h-i),t.quadraticCurveTo(e,s,e-i,s),t.lineTo(this.x+i,s),t.quadraticCurveTo(this.x,s,this.x,s-i),t.lineTo(this.x,this.y+i),t.quadraticCurveTo(this.x,this.y,this.x+i,this.y),t.stroke(),t.closePath(),t.restore());let o=0,n=0;if(this.header){t.textBaseline="top",t.font=`${this.header.font.style} ${this.header.font.variant} ${this.header.font.weight} ${this.header.font.size}px ${this.header.font.family}`,t.fillStyle=this.header.font.color,t.textAlign=this.header.alignment;let i,e=0,s=0;this.header.icon&&(e=h.ICON().width,s=h.ICON().height,t.drawImage(img,this.x+this.header.padding.left,this.y+this.header.padding.top,e,s)),this._headerTextHeight.height<s?(o=this.header.padding.top+s+this.header.padding.bottom,i=(o-this._headerTextHeight.ascent)/2):(o=this.header.padding.top+this._headerTextHeight.ascent+this.header.padding.bottom,i=this.header.padding.top);const r=this.x+e+this.header.padding.right+(this.header.icon?this.header.padding.left:0);t.fillText(this.header.text,r,this.y+i),n=this.header.padding.left+e+this.header.padding.right+t.measureText(this.header.text).width+this.header.padding.right,this.header.divider&&(t.save(),t.strokeStyle=this.header.divider.color,t.lineWidth=this.header.divider.width,t.beginPath(),t.moveTo(this.x,this.y+o),t.lineTo(this.x+this.w,this.y+o),t.stroke(),t.closePath(),t.restore())}let r=0,a=0;if(this.body){t.save(),t.font=`${this.body.font.style} ${this.body.font.variant} ${this.body.font.weight} ${this.body.font.size}px ${this.body.font.family}`,t.fillStyle=this.body.font.color,t.textAlign=this.body.alignment,t.textBaseline="top";let i=[];const e=this.body.text.split(" ");let s=0;e.forEach(e=>{const o=t.measureText(e).width,n=t.measureText(i[s]||"").width;this.body.padding.left+n+o+this.body.padding.right>h.MAX_WIDTH()&&s++;let r=i[s]||"";i[s]=r+=(r.length>0?" ":"")+e}),i.forEach((i,e)=>{const s=this.y+o+this._bodyTextHeight.height*e+this.body.padding.top;t.fillText(i,this.x+this.body.padding.left,s);const h=t.measureText(i).width;a=h>a?h:a}),t.restore(),r=this.body.padding.top+i.length*this._bodyTextHeight.height+this.body.padding.bottom,a+=this.body.padding.left+this.body.padding.right}let l=0,d=0;this.footer&&(this.footer.divider&&(t.save(),t.strokeStyle=this.footer.divider.color,t.lineWidth=this.footer.divider.width,t.beginPath(),t.moveTo(this.x,this.y+o+r),t.lineTo(this.x+this.w,this.y+o+r),t.stroke(),t.closePath(),t.restore()),t.textBaseline="top",t.font=`${this.footer.font.style} ${this.footer.font.variant} ${this.footer.font.weight} ${this.footer.font.size}px ${this.footer.font.family}`,t.fillStyle=this.footer.font.color,t.textAlign=this.footer.alignment,t.alignment="top",t.fillText(this.footer.text,this.x+this.footer.padding.left,this.y+o+r+this.footer.padding.top),l=this.footer.padding.top+this._footerTextHeight.height+this.footer.padding.bottom,d=this.footer.padding.left+t.measureText(this.footer.text).width+this.footer.padding.right);const c=n>a&&n>d?n:a>d?a:d,g=o+r+l;this.w=c>0?c:100,this.h=g>0?g:100,this.connections.forEach(i=>{i.draw(t)})}}var n=e(0),r=e.n(n);class a{static MAX_SCALE(){return 2}static MIN_SCALE(){return.2}constructor({canvas:t,options:i,data:e}){this.isDrawing=!1,this.el=t||document.getElementById("canvas"),this.el.width=this.el.parentElement.clientWidth,this.el.height=this.el.parentElement.clientHeight,this.el.style.maxHeight="none",this.origin={x:0,y:0},this.data=e,this._isDraggingCanvas=!1,this.isDebugging=i.isDebugging||!1,this.drawOrigin=i.drawOrigin||!1,this.background=i.background||{color:"rgb(255, 255, 255)"},this.scaleLimits={max:i.zoom.max||Canvas.MAX_SCALE(),min:i.zoom.min||Canvas.MIN_SCALE()},this.fps=i.fps||60,this.el.style.backgroundColor=this.background.color;let s={horizontal:1,vertical:1};this.getScale=()=>s,this.setScale=(t,i)=>{const e=s.horizontal*t,o=s.vertical*i;e<this.scaleLimits.max&&o<this.scaleLimits.max&&e>=this.scaleLimits.min&&o>=this.scaleLimits.min&&(s={horizontal:e,vertical:o})},this._mousePosition={x:null,y:null},this.canMoveBlocks=i.canMoveBlocks||!1;let o=[],n=null,r=!1;this.el.addEventListener("mousemove",t=>{let i=(t.x-this.origin.x)/this.getScale().horizontal,e=(t.y-this.origin.y)/this.getScale().vertical;if(this._mousePosition.x=i,this._mousePosition.y=e,this._isDraggingCanvas)this.translate(t.movementX,t.movementY);else if(n)r=!0,n.x=i-n.w/2,n.y=e-n.h/2;else for(let t=0;t<this.entitiesArray.length;t++){let s=this.entitiesArray[t];s.contains(i,e)?s.hover||(s.emit("mouseenter"),this.el.dispatchEvent(new CustomEvent("mouseenterentity",{detail:s}))):s.hover&&(s.emit("mouseleave"),this.el.dispatchEvent(new CustomEvent("mouseleaveentity",{detail:s})))}}),this.el.addEventListener("dblclick",t=>{let i=(t.x-this.origin.x)/this.getScale().horizontal,e=(t.y-this.origin.y)/this.getScale().vertical;this.addEntity(new h({x:i,y:e,header:{text:"Lorem ipsum dolor sit",alignment:"start",font:{family:"Times",style:"normal",variant:"normal",color:"rgba(0,0,0,0.6)",size:25,weight:"bold"}},body:{text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at consectetur lorem. Etiam dignissim dolor sit amet orci efficitur auctor.",alignment:"start",font:{family:"Arial",style:"normal",variant:"normal",color:"rgba(0,0,0,0.6)",size:20,weight:"bold"}},footer:{text:"Lorem ipsum dolor sit",alignment:"start",font:{family:"Arial",style:"normal",variant:"normal",color:"rgba(0,0,0,0.6)",size:20,weight:"bold"}}}))}),this.el.addEventListener("click",t=>{let i=(t.x-this.origin.x)/this.getScale().horizontal,e=(t.y-this.origin.y)/this.getScale().vertical;if(r)r=!1;else{for(let t=0;t<this.entitiesArray.length;t++){let s=this.entitiesArray[t];if(s.contains(i,e)){if(s.emit("click"),0===o.length?o.push(s):o.forEach(t=>{t._id!==s._id&&o.push(s)}),2==o.length){let t=o.pop(),i=o.pop(),e=!1;for(let s=0;s<i.connections.length;s++){if(i.connections[s].to._id===t._id){e=!0;break}}for(let s=0;s<t.connections.length;s++){if(t.connections[s].to._id===i._id){e=!0;break}}e||i.addConnection(t),o=[]}return}}o=[]}}),this.el.addEventListener("mousedown",t=>{let i=(t.x-this.origin.x)/this.getScale().horizontal,e=(t.y-this.origin.y)/this.getScale().vertical;for(let t=0;t<this.entitiesArray.length;t++){let s=this.entitiesArray[t];if(s.contains(i,e))return s._id,s.isDraggable,void(!n&&this.canMoveBlocks&&s.isDraggable&&(n=s))}this._isDraggingCanvas=!0}),this.el.addEventListener("mouseup",t=>{this._isDraggingCanvas=!1,n&&(n=null)}),this.el.addEventListener("wheel",t=>{t.wheelDelta>0?this.setScale(1.01,1.01):this.setScale(.99,.99)});let a=null,l=null;this.el.addEventListener("touchstart",t=>{if(a=t,1===t.touches.length){const i=t.touches[0].clientX,e=t.touches[0].clientY;let s=(i-this.origin.x)/this.getScale().horizontal,o=(e-this.origin.y)/this.getScale().vertical;for(let t=0;t<this.entitiesArray.length;t++){let i=this.entitiesArray[t];if(i.contains(s,o))return void(n||(n=i))}this._isDraggingCanvas=!0}if(l&&(t.timeStamp,l.timeStamp,t.timeStamp-l.timeStamp<=200)){const i=t.touches[0].clientX,e=t.touches[0].clientY;let s=(i-this.origin.x)/this.getScale().horizontal,o=(e-this.origin.y)/this.getScale().vertical;this.addEntity(new h({x:s,y:o,header:{text:"Lorem ipsum dolor sit",alignment:"start",font:{family:"Times",style:"normal",variant:"normal",color:"rgba(0,0,0,0.6)",size:25,weight:"bold"},icon:"./bell.svg"},body:{text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at consectetur lorem. Etiam dignissim dolor sit amet orci efficitur auctor.",alignment:"start",font:{family:"Arial",style:"normal",variant:"normal",color:"rgba(0,0,0,0.6)",size:20,weight:"bold"}},footer:{text:"Lorem ipsum dolor sit",alignment:"start",font:{family:"Arial",style:"normal",variant:"normal",color:"rgba(0,0,0,0.6)",size:20,weight:"bold"}}}))}l=t}),this.el.addEventListener("touchmove",t=>{if(1===t.touches.length){if(this._isDraggingCanvas){let i=t.touches[0].clientX-a.touches[0].clientX,e=t.touches[0].clientY-a.touches[0].clientY;this.translate(i,e)}else if(n){r=!0;const i=t.touches[0].clientX,e=t.touches[0].clientY;let s=(i-this.origin.x)/this.getScale().horizontal,o=(e-this.origin.y)/this.getScale().vertical;n.x=s-n.w/2,n.y=o-n.h/2}a=t}}),this.el.addEventListener("touchend",t=>{this._isDraggingCanvas=!1,n&&(n=null),a=t}),window.addEventListener("resize",()=>{this.resize(window.innerWidth,window.innerHeight)},!1),this.start()}get ctx(){return this.el.getContext("2d")}get entitiesArray(){return Object.values(this.entities)}resize(t,i){this.el.width=t,this.el.height=i}addEntity(t){this.entities[t._id]=t}removeEntity(t){delete this.entities[t._id]}clear(){this.ctx.clearRect(0,0,canvas.width,canvas.height)}translate(t,i){this.origin.x+=t,this.origin.y+=i}start(){setInterval(()=>{this.isDrawing&&(this.clear(),this.drawOrigin&&(this.ctx.lineWidth="1",this.ctx.strokeStyle="rgba(0,0,0,0.2)",this.ctx.moveTo(this.origin.x,this.origin.y),this.ctx.lineTo(this.origin.x,this.origin.y+100*this.el.height),this.ctx.moveTo(this.origin.x,this.origin.y),this.ctx.lineTo(this.origin.x+100*this.el.width,this.origin.y),this.ctx.moveTo(this.origin.x,this.origin.y),this.ctx.lineTo(this.origin.x-100*this.el.width,this.origin.y),this.ctx.moveTo(this.origin.x,this.origin.y),this.ctx.lineTo(this.origin.x,this.origin.y-100*this.el.height),this.ctx.stroke()),this.ctx.save(),this.ctx.translate(this.origin.x,this.origin.y),this.ctx.scale(this.getScale().horizontal,this.getScale().vertical),Object.values(this.entities).forEach(t=>{t.draw(this.ctx)}),this.ctx.restore())},1e3/this.fps)}set data(t){this.entities={};let i={};if(t&&Object.values(t).length>0){for(let[e,s]of Object.entries(t))if(s){let t=new h(s);this.addEntity(t),i[e]=t}for(let[e,s]of Object.entries(t))s&&s.connections&&s.connections.forEach(t=>{i[t]&&i[e].addConnection(i[t])})}this.isDrawing=!0}getEntities(){return r()(this.entities)}}}])}));