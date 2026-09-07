import * as THREE from 'three';
import {renderRatio} from './graphics-budget.js?v=e0209c5a7443';
// Local procedural materials: no remote image requests or borrowed artwork.
export function surface(kind,renderer){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.scale(.5,.5);let seed=1937;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
 if(kind==='wood'){ctx.fillStyle='#a08b75';ctx.fillRect(0,0,1024,1024);for(let i=0;i<4500;i++){const x=random()*1024;ctx.strokeStyle=`rgba(${random()>.5?'65,43,26':'218,201,174'},${.04+random()*.13})`;ctx.lineWidth=.3+random()*2;ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+random()*20,350,x-random()*20,650,x,1024);ctx.stroke()}}
 else if(kind==='steel'){ctx.fillStyle='#a4adb6';ctx.fillRect(0,0,1024,1024);for(let i=0;i<8000;i++){ctx.fillStyle=`rgba(${random()>.5?'255,255,255':'45,57,68'},${random()*.06})`;ctx.fillRect(random()*1024,random()*1024,100+random()*800,.5)}}
 else {ctx.fillStyle=kind==='plaster'?'#edece8':'#d5d8d8';ctx.fillRect(0,0,1024,1024);for(let i=0;i<45000;i++){const shade=random()>.5?'255,255,255':'84,94,103';ctx.fillStyle=`rgba(${shade},${random()*.10})`;const size=kind==='plaster'?.5+random():.8+random()*3;ctx.fillRect(random()*1024,random()*1024,size,size)}if(kind==='stone'){ctx.strokeStyle='#bec4ca';ctx.lineWidth=3;ctx.strokeRect(0,0,1024,1024)}}
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=Math.min(2,renderer.capabilities.getMaxAnisotropy());return texture;
}
export function createRenderer(options={}){
 // Avoid multisampled 4K buffers on integrated GPUs. Detailed geometry stays intact.
 return new THREE.WebGLRenderer({...options,antialias:false,stencil:false,powerPreference:'low-power'});
}
export function graphicsFailure(error,host,fallback){
 console.warn('DoorWise graphics initialization failed',error);
 host.hidden=true;fallback.hidden=false;
 const unavailable=/WebGL context|WebGL 2/i.test(String(error));
 fallback.textContent=unavailable?'This browser could not start interactive 3D. You can still explore the rider map below.':'The 3D preview could not finish loading. Reload the page to try again, or explore the rider map below.';
 const link=document.createElement('a');link.href='demo.html';link.textContent='Open the lightweight rider map';link.style.display='block';link.style.textDecoration='underline';fallback.appendChild(link);
}
export function qualityControl(renderer,host){
 // Always use the clear rendering budget; no visitor-facing graphics settings.
 return ()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const gl=renderer.getContext();if(gl.isContextLost())return;const limit=Math.min(renderer.capabilities.maxTextureSize,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));renderer.setPixelRatio(renderRatio(w,h,devicePixelRatio,'balanced',limit));renderer.setSize(w,h);renderer.domElement.dataset.renderResolution=`${renderer.domElement.width} × ${renderer.domElement.height}`};
}
