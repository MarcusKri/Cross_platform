"use strict";(self["webpackChunkTDS200_h22_1116"]=self["webpackChunkTDS200_h22_1116"]||[]).push([[990],{8990:function(e,t,n){n.r(t),n.d(t,{createSwipeBackGesture:function(){return o}});var r=n(6587),c=n(545),i=n(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const o=(e,t,n,o,s)=>{const a=e.ownerDocument.defaultView,u=(0,c.i)(e),h=e=>{const t=50,{startX:n}=e;return u?n>=a.innerWidth-t:n<=t},l=e=>u?-e.deltaX:e.deltaX,d=e=>u?-e.velocityX:e.velocityX,f=e=>h(e)&&t(),k=e=>{const t=l(e),n=t/a.innerWidth;o(n)},w=e=>{const t=l(e),n=a.innerWidth,c=t/n,i=d(e),o=n/2,u=i>=0&&(i>.2||t>o),h=u?1-c:c,f=h*n;let k=0;if(f>5){const e=f/Math.abs(i);k=Math.min(e,540)}s(u,c<=0?.01:(0,r.e)(0,c,.9999),k)};return(0,i.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:f,onStart:n,onMove:k,onEnd:w})}}}]);
//# sourceMappingURL=990.4d58bca4.js.map