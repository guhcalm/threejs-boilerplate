(()=>{"use strict";var e,n={381:(e,n,r)=>{var t,a=r(745),o=r(294),i=r(804);const c=(0,i.vJ)(t||(l=["\n    *,\n    *::before,\n    *::after {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        box-sizing: border-box;\n    }\n\n    ::-webkit-scrollbar {\n        width: 0px;\n    }\n\n    body,\n    #root {\n        width: 100vw;\n        height: 100vh;\n        max-width: 100vw;\n        display: flex;\n        justify-content: center;\n        align-items: flex-start;\n    }\n\n"],u||(u=l.slice(0)),t=Object.freeze(Object.defineProperties(l,{raw:{value:Object.freeze(u)}}))));var l,u;const s={name:"DARK",palette:{background:{main:"black",on:""},primary:{main:"",on:"",light:"",dark:""},secondary:{main:"",on:"",light:"",dark:""}}},d={name:"LIGHT",palette:{background:{main:"white",on:""},primary:{main:"",on:"",light:"",dark:""},secondary:{main:"",on:"",light:"",dark:""}}};var p=r(893);function f(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==r)return;var t,a,o=[],i=!0,c=!1;try{for(r=r.call(e);!(i=(t=r.next()).done)&&(o.push(t.value),!n||o.length!==n);i=!0);}catch(e){c=!0,a=e}finally{try{i||null==r.return||r.return()}finally{if(c)throw a}}return o}(e,n)||function(e,n){if(!e)return;if("string"==typeof e)return h(e,n);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return h(e,n)}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,n){(null==n||n>e.length)&&(n=e.length);for(var r=0,t=new Array(n);r<n;r++)t[r]=e[r];return t}function m(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function y(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?m(Object(r),!0).forEach((function(n){b(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function b(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}var g,v={theme:d},j={switchTheme:function(){return{type:"SWITCH_THEME"}}},O=function(e,n){var r=n.type;n.payload;return{SWITCH_THEME:y(y({},e),{},{theme:e.theme.name===d.name?s:d})}[r]},x=(0,o.createContext)(null),w=function(){return(0,o.useContext)(x)},k=function(e){var n=e.children,r=f((0,o.useReducer)(O,v),2),t=r[0],a=r[1];return(0,p.jsx)(x.Provider,{value:{state:t,dispatch:a,actions:j},children:n})},P=function(e){var n=e.value,r=e.children;return(0,p.jsx)(x.Provider,{value:n,children:r})};const S=i.ZP.div(g||(g=function(e,n){return n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["\n  ","\n  width: 100%;\n  height: 100vh;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: var(--background);\n  background-image: radial-gradient(circle at 0 0, red, transparent),\n    radial-gradient(circle at 100% 50%, blue, transparent),\n    radial-gradient(circle at 0 100%, yellow, transparent);\n"])),(function(e){var n=e.palette;return"\n  --background: ".concat(n.background.main,";\n  --on-background: ").concat(n.background.on,";\n  --primary: ").concat(n.primary.main,";\n  --on-primary: ").concat(n.primary.on,";\n  --primary-on-light: ").concat(n.primary.light,";\n  --primary-on-dark: ").concat(n.primary.dark,";\n  --secondary: ").concat(n.secondary.main,";\n  --on-secondary: ").concat(n.secondary.on,";\n  --secondary-on-light: ").concat(n.secondary.light,";\n  --secondary-on-dark: ").concat(n.secondary.dark,";\n  ")})),M=function(e){var n=e.children,r=w().state;return(0,p.jsx)(S,{palette:r.theme.palette,"data-layout":"",children:n})};var E=r(410),C=r(477),T=r(365),_=r(666),A=r(975),I=r(248),L=new C.PlaneBufferGeometry(10,10),z=L.index,D=(function(e,n){for(var r={},t=0;t<e;t++){var a=[n[t]];(t+1)%3==0?a.push(n[t-2]):a.push(n[t+1]),a.sort((function(e,n){return e-n})),r["".concat(a[0],"|").concat(a[1])]="edge"}var o=Object.keys(r).map((function(e){return e.split("|").map((function(e){return Number(e)}))})).flat();o.length}(z.count,z.array),function(){return(0,p.jsx)("mesh",{geometry:L,children:(0,p.jsx)("meshBasicMaterial",{wireframe:!0,color:"black"})})}),R=function(){return(0,p.jsx)(E.Xz,{shadows:!0,gl:{pixelRatio:Math.min(devicePixelRatio,2),powerPreference:"high-performance",toneMapping:C.ACESFilmicToneMapping,physicallyCorrectLights:!0,logarithmicDepthBuffer:!0,outputEncoding:C.sRGBEncoding,toneMappingExposure:1.5,antialias:!1,stencil:!1,alpha:!1,depth:!1},camera:{near:.1,far:100,position:[-8,3,-3]},onCreated:function(e){var n=e.scene,r=e.camera,t=e.gl;t.shadowMap.enabled=!0,t.shadowMap.type=C.PCFShadowMap,new T.z(r,t.domElement).update(),(new _.x).load("assets/blurry.hdr",(function(e){e.mapping=C.EquirectangularReflectionMapping,e.matrixAutoUpdate=!1,n.environment=e,n.background=e}))},children:(0,p.jsxs)(P,{value:w(),children:[(0,p.jsxs)(A.xC,{multisampling:0,children:[(0,p.jsx)(A.y8,{focusDistance:.0035,focalLength:.01,bokehScale:3,height:480}),(0,p.jsx)(A.K,{blendFunction:I.YQ.MULTIPLY,bias:.01,radius:.1,intensity:20,luminanceInfluence:1,color:"black"}),(0,p.jsx)(A.K,{blendFunction:I.YQ.MULTIPLY,bias:.01,radius:.01,intensity:10,luminanceInfluence:1,color:"black"})]}),(0,p.jsx)(D,{}),(0,p.jsx)("pointLight",{intensity:30,position:[0,35,-5],castShadow:!0})]})})},F=function(){return(0,p.jsx)(M,{children:(0,p.jsx)(R,{})})};new Float32Array;(0,a.s)(document.querySelector("#root")).render((0,p.jsxs)(k,{children:[(0,p.jsx)(c,{}),(0,p.jsx)(F,{})]}))}},r={};function t(e){var a=r[e];if(void 0!==a)return a.exports;var o=r[e]={exports:{}};return n[e](o,o.exports,t),o.exports}t.m=n,e=[],t.O=(n,r,a,o)=>{if(!r){var i=1/0;for(s=0;s<e.length;s++){for(var[r,a,o]=e[s],c=!0,l=0;l<r.length;l++)(!1&o||i>=o)&&Object.keys(t.O).every((e=>t.O[e](r[l])))?r.splice(l--,1):(c=!1,o<i&&(i=o));if(c){e.splice(s--,1);var u=a();void 0!==u&&(n=u)}}return n}o=o||0;for(var s=e.length;s>0&&e[s-1][2]>o;s--)e[s]=e[s-1];e[s]=[r,a,o]},t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};t.O.j=n=>0===e[n];var n=(n,r)=>{var a,o,[i,c,l]=r,u=0;if(i.some((n=>0!==e[n]))){for(a in c)t.o(c,a)&&(t.m[a]=c[a]);if(l)var s=l(t)}for(n&&n(r);u<i.length;u++)o=i[u],t.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return t.O(s)},r=self.webpackChunk_guhcalm_minimal_boilerplate=self.webpackChunk_guhcalm_minimal_boilerplate||[];r.forEach(n.bind(null,0)),r.push=n.bind(null,r.push.bind(r))})();var a=t.O(void 0,[977],(()=>t(381)));a=t.O(a)})();