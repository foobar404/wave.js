!function(t,o){if("object"==typeof exports&&"object"==typeof module)module.exports=o();else if("function"==typeof define&&define.amd)define([],o);else{var i=o();for(var n in i)("object"==typeof exports?exports:t)[n]=i[n]}}(this,(()=>(()=>{"use strict";var t={196:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Arcs=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,e=i.height,r=i.width,h=new s.Shapes(o),u=new a.AudioData(t),c=e/2,l=r/2;this._options=n({count:30,diameter:e/3,lineWidth:3,frequencyBand:"mids",rounded:!0},this._options),this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(r,e));for(var p=0;p<=this._options.count/2;p++){var d=Math.floor(u.data.length/this._options.count)*p,_=u.data[d],f=(r-this._options.diameter)/this._options.count*p,v=180-45/(255/_/2),y=180+45/(255/_/2),g=2*_;h.arc(f+g/2,c,g,v,y,this._options)}var m=Math.floor(u.data.length/2),M=u.data[m];for(h.circle(l,c,this._options.diameter*(M/255),this._options),p=this._options.count/2;p<=this._options.count;p++){var x=Math.floor(u.data.length/this._options.count)*p,b=u.data[x];f=(r-this._options.diameter)/this._options.count*p+this._options.diameter,v=180-45/(255/b/2),y=180+45/(255/b/2),g=2*b,h.arc(f-g/2,c,g,v+180,y+180,this._options)}},t}();o.Arcs=e},597:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Circles=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,e=i.height,r=i.width,h=new s.Shapes(o),u=new a.AudioData(t),c=r/2,l=e/2;this._options=n({count:40,diameter:0,fillColor:"rgba(0,0,0,0)",frequencyBand:"mids"},this._options),this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(r,e));for(var p=0;p<this._options.count;p++){var d=Math.floor(u.data.length/this._options.count)*p,_=u.data[d];h.circle(c,l,this._options.diameter+_,this._options)}},t}();o.Circles=e},595:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Cubes=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,e,r,h,u,c,l,p,d,_,f,v,y=o.canvas,g=y.height,m=y.width,M=new s.Shapes(o),x=new a.AudioData(t);this._options=n({count:20,frequencyBand:"mids",gap:5},this._options);var b=Math.floor((m-this._options.gap*this._options.count)/this._options.count);if((null===(i=this._options)||void 0===i?void 0:i.cubeHeight)||(this._options.cubeHeight=b),this._options.frequencyBand&&x.setFrequencyBand(this._options.frequencyBand),x.scaleData(Math.min(m,g)),null===(e=this._options)||void 0===e?void 0:e.mirroredX)for(var C=1,w=Math.ceil(x.data.length/2);w<x.data.length;w++)x.data[w]=x.data[Math.ceil(x.data.length/2)-C],C++;if(null===(r=this._options)||void 0===r?void 0:r.top)for(w=0;w<this._options.count;w++)for(var O=Math.floor(x.data.length/this._options.count)*w,q=x.data[O],B=(this._options.gap+b)*w,A=Math.ceil(q/b),S=0;S<A;S++){var P=S*(this._options.cubeHeight+this._options.gap);M.rectangle(B,P,b,this._options.cubeHeight,this._options)}if(null===(h=this._options)||void 0===h?void 0:h.right)for(w=0;w<this._options.count;w++)for(O=Math.floor(x.data.length/this._options.count)*w,q=x.data[O],P=w*(this._options.cubeHeight+this._options.gap),A=Math.ceil(q/b),S=0;S<A;S++)B=m-(this._options.gap+b)*S,M.rectangle(B,P,b,this._options.cubeHeight,this._options);if((null===(u=this._options)||void 0===u?void 0:u.bottom)||!(null===(c=this._options)||void 0===c?void 0:c.top)&&!(null===(l=this._options)||void 0===l?void 0:l.right)&&!(null===(p=this._options)||void 0===p?void 0:p.left)&&!(null===(d=this._options)||void 0===d?void 0:d.center))for(w=0;w<this._options.count;w++)for(O=Math.floor(x.data.length/this._options.count)*w,q=x.data[O],B=(this._options.gap+b)*w,A=Math.ceil(q/b),S=0;S<A;S++)P=g-S*(this._options.cubeHeight+this._options.gap),M.rectangle(B,P,b,this._options.cubeHeight,this._options);if(null===(_=this._options)||void 0===_?void 0:_.left)for(w=0;w<this._options.count;w++)for(O=Math.floor(x.data.length/this._options.count)*w,q=x.data[O],P=w*(this._options.cubeHeight+this._options.gap),A=Math.ceil(q/b),S=0;S<A;S++)B=(this._options.gap+b)*S,M.rectangle(B,P,b,this._options.cubeHeight,this._options);if(null===(f=this._options)||void 0===f?void 0:f.center){for(w=0;w<this._options.count;w++)for(O=Math.floor(x.data.length/this._options.count)*w,q=x.data[O],B=(this._options.gap+b)*w,A=Math.ceil(q/b),S=0;S<A;S++)P=g/2-S*(this._options.cubeHeight+this._options.gap),M.rectangle(B,P,b,this._options.cubeHeight,this._options);if(null===(v=this._options)||void 0===v?void 0:v.mirroredY)for(w=0;w<this._options.count;w++)for(O=Math.floor(x.data.length/this._options.count)*w,q=x.data[O],B=(this._options.gap+b)*w,A=Math.ceil(q/b),S=0;S<A;S++)P=g/2+S*(this._options.cubeHeight+this._options.gap),M.rectangle(B,P,b,this._options.cubeHeight,this._options)}},t}();o.Cubes=e},683:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Flower=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,e=i.height,r=i.width,h=new s.Shapes(o),u=new a.AudioData(t);this._options=n({count:20,diameter:e/3,frequencyBand:"mids",rotate:0},this._options);var c=r/2,l=e/2,p=360/this._options.count;this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(r,e));for(var d=0;d<this._options.count;d++){var _=Math.floor(u.data.length/this._options.count)*d,f=u.data[_],v=h.toRadians(p*d+this._options.rotate),y=h.toRadians(p*(d+1)+this._options.rotate),g=this._options.diameter/2*Math.cos(v)+c,m=this._options.diameter/2*Math.sin(v)+l,M=this._options.diameter/2*Math.cos(y)+c,x=this._options.diameter/2*Math.sin(y)+l,b=this._options.diameter+f,C=b/2*Math.cos(v)+c,w=b/2*Math.sin(v)+l,O=b/2*Math.cos(y)+c,q=b/2*Math.sin(y)+l;h.polygon([{x:g,y:m},{x:C,y:w},{x:O,y:q},{x:M,y:x}],this._options)}},t}();o.Flower=e},157:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Glob=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,e=o.canvas,r=e.height,h=e.width,u=new s.Shapes(o),c=new a.AudioData(t),l=h/2,p=r/2;if(this._options=n({count:100,diameter:r/3,frequencyBand:"mids",rounded:!0},this._options),this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(h,r)),null===(i=this._options)||void 0===i?void 0:i.mirroredX)for(var d=1,_=Math.ceil(c.data.length/2);_<c.data.length;_++)c.data[_]=c.data[Math.ceil(c.data.length/2)-d],d++;var f=[];for(_=0;_<this._options.count;_++){var v=Math.floor(c.data.length/this._options.count)*_,y=c.data[v],g=360/this._options.count,m=this._options.diameter+y,M=l+m/2*Math.cos(u.toRadians(g*_)),x=p+m/2*Math.sin(u.toRadians(g*_));f.push({x:M,y:x})}f.push(f[0]),u.polygon(f,this._options)},t}();o.Glob=e},541:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Lines=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,e,r,h,u,c,l,p,d,_,f,v=o.canvas,y=v.height,g=v.width,m=new s.Shapes(o),M=new a.AudioData(t);if(this._options=n({count:64,frequencyBand:"mids"},this._options),this._options.frequencyBand&&M.setFrequencyBand(this._options.frequencyBand),M.scaleData(Math.min(g,y)),null===(i=this._options)||void 0===i?void 0:i.mirroredX)for(var x=1,b=Math.ceil(M.data.length/2);b<M.data.length;b++)M.data[b]=M.data[Math.ceil(M.data.length/2)-x],x++;if(null===(e=this._options)||void 0===e?void 0:e.top)for(b=1;b<=this._options.count;b++){var C=Math.floor(M.data.length/this._options.count)*b,w=M.data[C],O=0,q=A=g/this._options.count*b,B=w;m.line(A,O,q,B,this._options)}if(null===(r=this._options)||void 0===r?void 0:r.right)for(b=1;b<=this._options.count;b++){C=Math.floor(M.data.length/this._options.count)*b;var A=g;q=g-(w=M.data[C]),B=O=y/this._options.count*b,m.line(A,O,q,B,this._options)}if((null===(h=this._options)||void 0===h?void 0:h.bottom)||!(null===(u=this._options)||void 0===u?void 0:u.top)&&!(null===(c=this._options)||void 0===c?void 0:c.right)&&!(null===(l=this._options)||void 0===l?void 0:l.left)&&!(null===(p=this._options)||void 0===p?void 0:p.center))for(b=1;b<=this._options.count;b++)C=Math.floor(M.data.length/this._options.count)*b,w=M.data[C],q=A=g/this._options.count*b,B=(O=y)-w,m.line(A,O,q,B,this._options);if(null===(d=this._options)||void 0===d?void 0:d.left)for(b=1;b<=this._options.count;b++)C=Math.floor(M.data.length/this._options.count)*b,A=0,q=w=M.data[C],B=O=y/this._options.count*b,m.line(A,O,q,B,this._options);if(null===(_=this._options)||void 0===_?void 0:_.center)for(b=1;b<=this._options.count;b++)C=Math.floor(M.data.length/this._options.count)*b,w=M.data[C],q=A=g/this._options.count*b,B=(O=y/2)-w,m.line(A,O,q,B,this._options),(null===(f=this._options)||void 0===f?void 0:f.mirroredY)&&(q=A=g/this._options.count*b,B=(O=y/2)+w,m.line(A,O,q,B,this._options))},t}();o.Lines=e},475:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Shine=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i,e=o.canvas,r=e.height,h=e.width,u=new s.Shapes(o),c=new a.AudioData(t);this._options=n({count:30,rotate:0,diameter:r/3,frequencyBand:"mids"},this._options);var l=h/2,p=r/2,d=360/this._options.count;this._options.frequencyBand&&c.setFrequencyBand(this._options.frequencyBand),c.scaleData(Math.min(h,r));for(var _=0;_<this._options.count;_++){var f=Math.floor(c.data.length/this._options.count)*_,v=c.data[f],y=u.toRadians(d*_+this._options.rotate),g=(null===(i=this._options)||void 0===i?void 0:i.offset)?this._options.diameter-v/2:this._options.diameter,m=this._options.diameter+v,M=g/2*Math.cos(y)+l,x=g/2*Math.sin(y)+p,b=m/2*Math.cos(y)+l,C=m/2*Math.sin(y)+p;u.line(M,x,b,C,this._options)}},t}();o.Shine=e},614:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Square=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,e=i.height,r=i.width,h=new s.Shapes(o),u=new a.AudioData(t);this._options=n({count:40,diameter:e/3,frequencyBand:"mids"},this._options);var c=this._options.count/4,l=r/2,p=e/2;this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(r,e));for(var d=0;d<c;d++){var _=Math.floor(u.data.length/this._options.count)*d,f=u.data[_],v=this._options.diameter/c,y=l-this._options.diameter/2+v*d,g=p-this._options.diameter/2;h.line(y,g,y,g-f,this._options)}for(d=0;d<c;d++){_=Math.floor(u.data.length/this._options.count)*(2*d),f=u.data[_];var m=this._options.diameter/c;y=l+this._options.diameter/2,g=p-this._options.diameter/2+m*d,h.line(y,g,y+f,g,this._options)}for(d=0;d<c;d++)_=Math.floor(u.data.length/this._options.count)*(3*d),f=u.data[_],v=this._options.diameter/c,y=l-this._options.diameter/2+v*d,g=p+this._options.diameter/2,h.line(y,g,y,g+f,this._options);for(d=0;d<c;d++)_=Math.floor(u.data.length/this._options.count)*(4*d),f=u.data[_],m=this._options.diameter/c,y=l-this._options.diameter/2,g=p-this._options.diameter/2+m*d,h.line(y,g,y-f,g,this._options)},t}();o.Square=e},373:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Turntable=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,e=i.height,r=i.width,h=new s.Shapes(o),u=new a.AudioData(t);this._options=n({count:20,rotate:0,diameter:e/3,cubeHeight:20,frequencyBand:"mids",gap:5},this._options);var c=r/2,l=e/2,p=360/this._options.count;this._options.frequencyBand&&u.setFrequencyBand(this._options.frequencyBand),u.scaleData(Math.min(r,e));for(var d=0;d<this._options.count;d++)for(var _=Math.floor(u.data.length/this._options.count)*d,f=u.data[_],v=0;v<f/this._options.cubeHeight;v++){var y=this._options.diameter+this._options.cubeHeight*v+this._options.gap,g=this._options.diameter+this._options.cubeHeight*(v+1),m=h.toRadians(p*d+this._options.rotate+this._options.gap/4),M=h.toRadians(p*(d+1)+this._options.rotate),x=y/2*Math.cos(m)+c,b=y/2*Math.sin(m)+l,C=y/2*Math.cos(M)+c,w=y/2*Math.sin(M)+l,O=g/2*Math.cos(m)+c,q=g/2*Math.sin(m)+l,B=g/2*Math.cos(M)+c,A=g/2*Math.sin(M)+l;h.polygon([{x,y:b},{x:O,y:q},{x:B,y:A},{x:C,y:w}],this._options)}},t}();o.Turntable=e},735:function(t,o,i){var n=this&&this.__assign||function(){return n=Object.assign||function(t){for(var o,i=1,n=arguments.length;i<n;i++)for(var s in o=arguments[i])Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);return t},n.apply(this,arguments)};Object.defineProperty(o,"__esModule",{value:!0}),o.Wave=void 0;var s=i(27),a=i(703),e=function(){function t(t){this._options=null!=t?t:{}}return t.prototype.draw=function(t,o){var i=o.canvas,e=i.height,r=i.width,h=new a.AudioData(t),u=new s.Shapes(o);if(this._options=n({count:64,frequencyBand:"mids"},this._options),this._options.frequencyBand&&h.setFrequencyBand(this._options.frequencyBand),h.scaleData(Math.min(r,e)),this._options.mirroredX)for(var c=1,l=Math.ceil(h.data.length/2);l<h.data.length;l++)h.data[l]=h.data[Math.ceil(h.data.length/2)-c],c++;if(this._options.top){var p=[{x:0,y:0}];for(l=0;l<=this._options.count;l++){var d=Math.floor(h.data.length/this._options.count)*l,_=h.data[d];p.push({x:Math.floor(r/this._options.count)*l,y:_})}p.push({x:r,y:0}),u.polygon(p,this._options)}if(this._options.right){for(p=[{x:r,y:0}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,_=h.data[d],p.push({x:r-_,y:Math.floor(r/this._options.count)*l});p.push({x:r,y:e}),u.polygon(p,this._options)}if(this._options.bottom||!this._options.top&&!this._options.right&&!this._options.left&&!this._options.center){for(p=[{x:0,y:e}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,_=h.data[d],p.push({x:Math.floor(r/this._options.count)*l,y:e-_});p.push({x:r,y:e}),u.polygon(p,this._options)}if(this._options.left){for(p=[{x:0,y:0}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,_=h.data[d],p.push({x:_,y:Math.floor(r/this._options.count)*l});p.push({x:0,y:e}),u.polygon(p,this._options)}if(this._options.center){for(p=[{x:0,y:e/2}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,_=h.data[d],p.push({x:Math.floor(r/this._options.count)*l,y:e/2-_});if(p.push({x:r,y:e/2}),u.polygon(p,this._options),this._options.mirroredY){for(p=[{x:0,y:e/2}],l=0;l<=this._options.count;l++)d=Math.floor(h.data.length/this._options.count)*l,_=h.data[d],p.push({x:Math.floor(r/this._options.count)*l,y:e/2+_});p.push({x:r,y:e/2}),u.polygon(p,this._options)}}},t}();o.Wave=e},703:(t,o)=>{Object.defineProperty(o,"__esModule",{value:!0}),o.AudioData=void 0;var i=function(){function t(t){this.data=t}return t.prototype.setFrequencyBand=function(t){var o=Math.floor(.0625*this.data.length),i=Math.floor(.0625*this.data.length),n=Math.floor(.375*this.data.length),s={base:this.data.slice(0,o),lows:this.data.slice(o+1,o+i),mids:this.data.slice(o+i+1,o+i+n),highs:this.data.slice(o+i+n+1)};this.data=s[t]},t.prototype.scaleData=function(t){t<255&&(this.data=this.data.map((function(o){var i=Math.round(o/255*100)/100;return t*i})))},t}();o.AudioData=i},27:function(t,o){var i=this&&this.__awaiter||function(t,o,i,n){return new(i||(i=Promise))((function(s,a){function e(t){try{h(n.next(t))}catch(t){a(t)}}function r(t){try{h(n.throw(t))}catch(t){a(t)}}function h(t){var o;t.done?s(t.value):(o=t.value,o instanceof i?o:new i((function(t){t(o)}))).then(e,r)}h((n=n.apply(t,o||[])).next())}))},n=this&&this.__generator||function(t,o){var i,n,s,a,e={label:0,sent:function(){if(1&s[0])throw s[1];return s[1]},trys:[],ops:[]};return a={next:r(0),throw:r(1),return:r(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function r(a){return function(r){return function(a){if(i)throw new TypeError("Generator is already executing.");for(;e;)try{if(i=1,n&&(s=2&a[0]?n.return:a[0]?n.throw||((s=n.return)&&s.call(n),0):n.next)&&!(s=s.call(n,a[1])).done)return s;switch(n=0,s&&(a=[2&a[0],s.value]),a[0]){case 0:case 1:s=a;break;case 4:return e.label++,{value:a[1],done:!1};case 5:e.label++,n=a[1],a=[0];continue;case 7:a=e.ops.pop(),e.trys.pop();continue;default:if(!((s=(s=e.trys).length>0&&s[s.length-1])||6!==a[0]&&2!==a[0])){e=0;continue}if(3===a[0]&&(!s||a[1]>s[0]&&a[1]<s[3])){e.label=a[1];break}if(6===a[0]&&e.label<s[1]){e.label=s[1],s=a;break}if(s&&e.label<s[2]){e.label=s[2],e.ops.push(a);break}s[2]&&e.ops.pop(),e.trys.pop();continue}a=o.call(t,e)}catch(t){a=[6,t],n=0}finally{i=s=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,r])}}};Object.defineProperty(o,"__esModule",{value:!0}),o.Shapes=void 0;var s=function(){function t(t){this._canvasContext=t}return t.prototype.toRadians=function(t){return t*Math.PI/180},t.prototype.toDegrees=function(t){return 180*t/Math.PI},t.prototype._rotatePoint=function(t,o,i,n,s){var a=this.toRadians(s);return{x:Math.cos(a)*(i-t)-Math.sin(a)*(n-o)+t,y:Math.sin(a)*(i-t)+Math.cos(a)*(n-o)+o}},t.prototype._makeGradient=function(t,o){var i=0,n=this._canvasContext.canvas.height/2,s=this._canvasContext.canvas.width,a=this._canvasContext.canvas.height/2;if(o){var e=this._canvasContext.canvas.width/2,r=this._canvasContext.canvas.height/2,h=this._rotatePoint(e,r,i,n,o);i=h.x,n=h.y;var u=this._rotatePoint(e,r,s,a,o);s=u.x,a=u.y}var c=this._canvasContext.createLinearGradient(i,n,s,a);return t.forEach((function(o,i){c.addColorStop(1/t.length*i,o)})),c},t.prototype._makeImage=function(t){return i(this,void 0,void 0,(function(){var o,i=this;return n(this,(function(n){return(o=new Image).src=t,[2,new Promise((function(t,n){o.onload=function(){var n=i._canvasContext.createPattern(o,"repeat");t(n)}}))]}))}))},t.prototype._implementOptions=function(t,o){var i,n,s,a,e,r,h,u,c,l,p,d,_=this;void 0===o&&(o=!0),"string"==typeof(null==t?void 0:t.lineColor)?this._canvasContext.strokeStyle=t.lineColor:(null===(i=null==t?void 0:t.lineColor)||void 0===i?void 0:i.gradient)?this._canvasContext.strokeStyle=this._makeGradient(t.lineColor.gradient,t.lineColor.rotate):(null===(n=null==t?void 0:t.lineColor)||void 0===n?void 0:n.image)?this._makeImage(null===(s=null==t?void 0:t.lineColor)||void 0===s?void 0:s.image).then((function(t){return _._canvasContext.strokeStyle=t})):this._canvasContext.strokeStyle="#000","string"==typeof(null==t?void 0:t.fillColor)?this._canvasContext.fillStyle=t.fillColor:(null===(a=null==t?void 0:t.fillColor)||void 0===a?void 0:a.gradient)?this._canvasContext.fillStyle=this._makeGradient(t.fillColor.gradient,t.fillColor.rotate):(null===(e=null==t?void 0:t.fillColor)||void 0===e?void 0:e.image)?this._makeImage(null===(r=null==t?void 0:t.fillColor)||void 0===r?void 0:r.image).then((function(t){return _._canvasContext.fillStyle=t})):this._canvasContext.fillStyle="#000",this._canvasContext.lineCap=null!==(h=(null==t?void 0:t.rounded)?"round":"butt")&&void 0!==h?h:"butt",this._canvasContext.lineWidth=null!==(u=null==t?void 0:t.lineWidth)&&void 0!==u?u:1,this._canvasContext.shadowColor=null!==(l=null===(c=null==t?void 0:t.glow)||void 0===c?void 0:c.color)&&void 0!==l?l:"rgba(0,0,0,0)",this._canvasContext.shadowBlur=null!==(d=null===(p=null==t?void 0:t.glow)||void 0===p?void 0:p.strength)&&void 0!==d?d:0,this._canvasContext.shadowOffsetX=0,this._canvasContext.shadowOffsetY=0,o&&this._canvasContext.closePath(),this._canvasContext.stroke(),o&&this._canvasContext.fill()},t.prototype.arc=function(t,o,i,n,s,a){return this._canvasContext.beginPath(),this._canvasContext.arc(t,o,i/2,this.toRadians(n),this.toRadians(s)),this._implementOptions(a,!1),this},t.prototype.circle=function(t,o,i,n){return this._canvasContext.beginPath(),this._canvasContext.arc(t,o,i/2,0,2*Math.PI),this._implementOptions(n),this},t.prototype.line=function(t,o,i,n,s){return this._canvasContext.beginPath(),this._canvasContext.moveTo(t,o),this._canvasContext.lineTo(i,n),this._implementOptions(s),this},t.prototype.polygon=function(t,o){var i;this._canvasContext.beginPath(),this._canvasContext.moveTo(t[0].x,t[0].y);for(var n=0;n<t.length;n++){var s=t[n],a=null!==(i=t[n+1])&&void 0!==i?i:s,e=(s.x+a.x)/2,r=(s.y+a.y)/2;(null==o?void 0:o.rounded)?this._canvasContext.quadraticCurveTo(t[n].x,t[n].y,e,r):this._canvasContext.lineTo(t[n].x,t[n].y)}return this._implementOptions(o),this},t.prototype.rectangle=function(t,o,i,n,s){var a,e=null!==(a=null==s?void 0:s.radius)&&void 0!==a?a:0;return i<2*e&&(e=i/2),n<2*e&&(e=n/2),this._canvasContext.beginPath(),this._canvasContext.moveTo(t+e,o),this._canvasContext.arcTo(t+i,o,t+i,o+n,e),this._canvasContext.arcTo(t+i,o+n,t,o+n,e),this._canvasContext.arcTo(t,o+n,t,o,e),this._canvasContext.arcTo(t,o,t+i,o,e),this._implementOptions(s),this},t}();o.Shapes=s}},o={};function i(n){var s=o[n];if(void 0!==s)return s.exports;var a=o[n]={exports:{}};return t[n].call(a.exports,a,a.exports,i),a.exports}var n={};return(()=>{var t=n;Object.defineProperty(t,"__esModule",{value:!0}),t.Wave=void 0;var o=i(196),s=i(597),a=i(595),e=i(683),r=i(157),h=i(541),u=i(475),c=i(614),l=i(373),p=i(735),d=function(){function t(t,i,n){void 0===n&&(n=!1);var d=this;this.animations={Arcs:o.Arcs,Circles:s.Circles,Cubes:a.Cubes,Flower:e.Flower,Glob:r.Glob,Lines:h.Lines,Shine:u.Shine,Square:c.Square,Turntable:l.Turntable,Wave:p.Wave},this._activeAnimations=[],this._canvasElement=i,this._canvasContext=this._canvasElement.getContext("2d"),this._muteAudio=n,this._interacted=!1,t instanceof HTMLAudioElement?(this._audioElement=t,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)?["touchstart","touchmove","touchend","mouseup","click"].forEach((function(t){document.body.addEventListener(t,(function(){return d.connectAnalyser()}),{once:!0})})):this._audioElement.addEventListener("play",(function(){return d.connectAnalyser()}),{once:!0})):t instanceof AnalyserNode?(this._audioAnalyser=t,this._audioContext=null,this._audioSource=null,this._play()):t&&(this._audioContext=t.context,this._audioSource=t.source,this._audioAnalyser=this._audioContext.createAnalyser(),this._play())}return t.prototype.connectAnalyser=function(){this._interacted||(this._interacted=!0,this._audioContext=new AudioContext,this._audioSource=this._audioContext.createMediaElementSource(this._audioElement),this._audioAnalyser=this._audioContext.createAnalyser(),this._play())},t.prototype._play=function(){var t=this;this._audioSource&&(this._audioSource.connect(this._audioAnalyser),this._muteAudio||this._audioSource.connect(this._audioContext.destination)),this._audioAnalyser.smoothingTimeConstant=.85,this._audioAnalyser.fftSize=1024;var o=new Uint8Array(this._audioAnalyser.frequencyBinCount),i=function(){t._audioAnalyser.getByteFrequencyData(o),t._canvasContext.clearRect(0,0,t._canvasContext.canvas.width,t._canvasContext.canvas.height),t._activeAnimations.forEach((function(i){i.draw(o,t._canvasContext)})),window.requestAnimationFrame(i)};i()},t.prototype.addAnimation=function(t){this._activeAnimations.push(t)},t.prototype.clearAnimations=function(){this._activeAnimations=[]},t}();t.Wave=d})(),n})()));