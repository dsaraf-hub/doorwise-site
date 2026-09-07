import {icon} from './icons.js';
import * as THREE from 'three';
import {surface,qualityControl,createRenderer,graphicsFailure} from './render-quality.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const host=document.querySelector('#scene');
try {
const renderer=createRenderer({alpha:true});renderer.setPixelRatio(1);renderer.setClearColor(0xf3f6fa,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;host.appendChild(renderer.domElement);const qualityResize=qualityControl(renderer,host,"Building");renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const riderLabel=document.createElement("div");riderLabel.className="rider-label";riderLabel.innerHTML="<i></i><span>Rider location</span>";host.appendChild(riderLabel);const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-18,18,22,-22,.1,250);camera.position.set(-22,24,50);
// Front-left cutaway view keeps the entrance and elevator route visible.
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,12,0);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.4;controls.maxPolarAngle=1.5;controls.autoRotate=false;controls.autoRotateSpeed=.24;controls.minAzimuthAngle=-.45;controls.maxAzimuthAngle=1.15;
scene.add(new THREE.HemisphereLight(0xffffff,0xb1bfd4,2));let light=new THREE.DirectionalLight(0xffffff,1.8);light.position.set(-20,35,30);scene.add(light);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-24,right:24,top:38,bottom:-15,near:.5,far:120});light.shadow.bias=-.0004;light.shadow.normalBias=.03;
const model=new THREE.Group();scene.add(model);
const white=new THREE.MeshStandardMaterial({color:0xfafcff,roughness:.9});const concrete=new THREE.MeshStandardMaterial({color:0xe7ecf3,roughness:1});const glass=new THREE.MeshStandardMaterial({color:0xd7e3f1,roughness:.4,metalness:.1});const blue=new THREE.MeshStandardMaterial({color:0x315cc6,roughness:.5});const dark=new THREE.MeshStandardMaterial({color:0x8399b5,roughness:1});
const plaster=surface('plaster',renderer);white.map=plaster;white.bumpMap=plaster;white.bumpScale=.015;const stone=surface('stone',renderer);concrete.map=stone;concrete.bumpMap=stone;concrete.bumpScale=.025;
function box(w,h,d,x,y,z,mat=white,edge=true){let geo=new THREE.BoxGeometry(w,h,d);let mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;model.add(mesh);if(edge){let line=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x829abd,transparent:true,opacity:.7}));mesh.add(line)}return mesh}
function line(points,color=0x9fb2ce,opacity=.6){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));let l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity}));model.add(l);return l}
box(30,.25,24,0,-.25,0,concrete);box(13,.6,11,0,.2,0);box(14,.18,1,0,.05,9,concrete);
const grid=new THREE.GridHelper(30,30,0xc7d4e6,0xe0e7f0);grid.position.y=-.1;model.add(grid);
// Open-front architectural model: opaque rear, detailed side facade, exposed route.
box(11.8,25,.24,0,12.7,-4.3);box(.22,25,8.5,-5.9,12.7,0);
for(let floor=0;floor<12;floor++){
 const y=floor*2.1+.7;
 box(12.6,.16,9.6,0,y,0);
 box(.2,1.9,8.6,5.7,y+1.05,0,white);
 box(2.5,1.9,.16,-2.6,y+1.05,-.1,white);
 box(2.5,1.9,.16,2.5,y+1.05,-.1,white);
 for(let x of [-4.6,-1.3,1.3,4.6]){
  box(.68,1.38,.09,x,y+.77,-.03,floor===10&&x===4.6?blue:glass);
  box(.65,.05,.8,x,y+.02,.4,concrete);
 }
 for(let z of [-2.7,.3,3.1]){box(.24,1.25,1.5,-6.04,y+1,z,glass);box(.25,1.25,.06,-6.19,y+1,z,dark,false)}
 for(let x of [-5.9,5.9])box(.16,2.1,.16,x,y+1.05,4.4);
 // Balcony rails along the left wing.
 box(2.8,.12,1.1,-4.4,y,5.05);
 line([[-5.8,y+.72,5.55],[-3,y+.72,5.55]],0xa6b7cf,.8);
 for(let x=-5.8;x<=-3;x+=.4)line([[x,y,5.55],[x,y+.72,5.55]],0xa6b7cf,.6);
}
box(13,.25,10,0,26,0);box(5,.8,3,-2,26.5,-1,concrete);box(12,.4,.2,0,26.3,-4.9);box(.2,.4,10,-6.4,26.3,0);
// Architectural detail at 4K: mullions, sills, ventilation and rooftop plant.
for(let f=0;f<12;f++){const y=f*2.1+.7;for(const z of [-2.7,.3,3.1]){box(.15,.045,1.58,-6.2,y+1,z,dark,false);box(.28,.08,1.65,-6.15,y+.34,z,white);}
 for(const x of [-4.6,-1.3,1.3,4.6]){box(.035,1.38,.035,x-.36,y+.77,.04,dark,false);box(.035,1.38,.035,x+.36,y+.77,.04,dark,false);box(.045,.045,.06,x+.22,y+.75,.08,dark,false)}
 box(1.5,.045,.15,2.5,y+1.82,1.4,new THREE.MeshBasicMaterial({color:0xe3edfa}),false);
}
for(let z=-2;z<=1;z+=1.5){box(1.8,.7,1,-2,27,z,concrete);for(let x=-2.7;x<-1.2;x+=.15)box(.035,.025,.85,x,27.37,z,dark,false)}
for(const x of [-9,9]){box(2.5,.14,.7,x,.7,1,concrete);box(.12,.7,.6,x-1,.32,1,dark);box(.12,.7,.6,x+1,.32,1,dark);box(2.5,.65,.1,x,1.04,.67,white)}
for(let z=5;z<11;z+=1.2)box(2,.045,.7,0,.14,z,concrete);
for(const x of [-8,8]){box(.1,2.8,.1,x,1.4,8,dark);box(.5,.08,.3,x,2.8,8,white);box(.35,.03,.2,x,2.75,8,new THREE.MeshBasicMaterial({color:0xf7e9cb}),false)}
// Vertical elevator core, visible in cutaway.
box(1.5,24.7,1.5,0,13,-1.4,new THREE.MeshStandardMaterial({color:0xb7cee9,transparent:true,opacity:.16,depthWrite:false}));const lift=box(1.6,.12,1.6,0,1,-1.4,blue);
box(3,.18,3,0,2,6,white);for(let x of [-1.4,1.4])box(.12,1.8,.12,x,.9,7.4,dark);box(2,.08,4,0,.1,8,white);
function tree(x,z,s=1){box(.17,1.6*s,.17,x,.8*s,z,dark,false);const geo=new THREE.IcosahedronGeometry(1.25*s,2);const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0xe1e9e8,roughness:1,flatShading:true}));mesh.scale.y=1.25;mesh.position.set(x,2.1*s,z);model.add(mesh);mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0xb6c8c8,transparent:true,opacity:.4})));}
[[-10,7,1],[10,5,1.15],[-10,-5,.9],[10,-6,.8],[8,9,.75]].forEach(a=>tree(...a));
// Human-scale rider marker and route through entrance, elevator, corridor.
const pts=[new THREE.Vector3(0,.55,11),new THREE.Vector3(0,.85,4),new THREE.Vector3(0,1,-1.4),new THREE.Vector3(0,22.3,-1.4),new THREE.Vector3(0,22.3,1),new THREE.Vector3(4.6,22.3,1),new THREE.Vector3(4.6,22.3,.1)];
const curve=new THREE.CurvePath();for(let i=0;i<pts.length-1;i++)curve.add(new THREE.LineCurve3(pts[i],pts[i+1]));
const routeGeo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(280));const route=new THREE.Line(routeGeo,new THREE.LineBasicMaterial({color:0x315cc6}));model.add(route);
const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,240,.055,6,false),blue);model.add(tube);
const rider=new THREE.Group();const head=new THREE.Mesh(new THREE.SphereGeometry(.14,12,10),white);head.position.y=.68;rider.add(head);
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.25,3,8),blue);body.position.y=.34;rider.add(body);
const backpack=new THREE.Mesh(new THREE.BoxGeometry(.3,.32,.17),blue);backpack.position.set(0,.4,-.19);rider.add(backpack);
const legs=[];for(const x of [-.09,.09]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.045,.21,3,6),dark);leg.position.set(x,.075,0);rider.add(leg);legs.push(leg)}const ring=new THREE.Mesh(new THREE.RingGeometry(.38,.47,32),new THREE.MeshBasicMaterial({color:0x315cc6,side:THREE.DoubleSide,transparent:true,opacity:.4}));ring.rotation.x=-Math.PI/2;ring.position.y=-.18;rider.add(ring);model.add(rider);
const floorHighlight=box(12.7,.045,9.7,0,21.88,0,new THREE.MeshBasicMaterial({color:0x315cc6,transparent:true,opacity:.12}),false);
const stageButtons=[...document.querySelectorAll('[data-stage]')];const labels=['Rider entered the building','Elevator journey in progress','Approaching the delivery door'];let progress=0,start=performance.now(),manualAt=-1,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,lastStage=-1,visible=true;controls.autoRotate=false;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');reduce.addEventListener('change',e=>{paused=e.matches;controls.autoRotate=false;updatePause()});
const pauseBtn=document.querySelector('#rotate');function updatePause(){pauseBtn.innerHTML=icon(paused?'▷':'Ⅱ');pauseBtn.setAttribute('aria-pressed',String(!paused));pauseBtn.title=paused?'Play animation':'Pause animation';pauseBtn.setAttribute('aria-label',pauseBtn.title)}updatePause();
pauseBtn.onclick=()=>{paused=!paused;controls.autoRotate=false;start=performance.now()-progress*18000;updatePause()};document.querySelector('#reset').onclick=()=>{camera.position.set(-22,24,50);controls.target.set(0,12,0);controls.update();progress=0;start=performance.now();manualAt=-1};
const eta=['~ 3 min','~ 2 min','< 1 min'];const locations=['Entrance · Ground floor','Elevator · Moving to floor 11','Corridor · Floor 11'];
function setStage(s){stageButtons.forEach((b,i)=>{b.classList.toggle('active',i===s);b.setAttribute('aria-pressed',String(i===s))});document.querySelector('#stage-label').textContent=labels[s];document.querySelector('#eta').textContent=eta[s];document.querySelector('#location').textContent=locations[s];document.querySelector('#journey-time').textContent=['00:24','01:12','02:08'][s];document.querySelectorAll('.event').forEach((e,i)=>e.classList.toggle('current',i===s));floorHighlight.visible=s===2;lastStage=s}
stageButtons.forEach((b,i)=>b.onclick=()=>{progress=[.06,.45,.9][i];start=performance.now()-progress*18000;manualAt=performance.now();setStage(i);render()});
controls.addEventListener('start',()=>controls.autoRotate=false);controls.addEventListener('end',()=>{controls.autoRotate=false});
function resize(){const w=host.clientWidth,h=host.clientHeight;qualityResize();const extent=18;camera.left=-extent*w/h;camera.right=extent*w/h;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix()}host.addEventListener("qualitychange",()=>renderer.render(scene,camera));new ResizeObserver(resize).observe(host);resize();new IntersectionObserver(e=>visible=e[0].isIntersecting,{rootMargin:'100px'}).observe(host);
function render(){const position=curve.getPointAt(Math.min(progress,.999));rider.position.copy(position);const projected=position.clone().add(new THREE.Vector3(0,1.5,0)).project(camera);riderLabel.style.left=((projected.x*.5+.5)*host.clientWidth)+"px";riderLabel.style.top=((-projected.y*.5+.5)*host.clientHeight)+"px";riderLabel.querySelector("span").textContent=["Rider at entrance","Rider in elevator","Rider on floor 11"][lastStage];const next=curve.getPointAt(Math.min(progress+.003,1));if(Math.abs(next.x-position.x)+Math.abs(next.z-position.z)>.001)rider.rotation.y=Math.atan2(next.x-position.x,next.z-position.z);lift.position.y=Math.max(1,Math.min(22.1,position.y-.22));if(!paused){ring.scale.setScalar(1+Math.sin(performance.now()/500)*.15);legs.forEach((l,i)=>l.rotation.x=lastStage===1?0:Math.sin(performance.now()/140+i*Math.PI)*.4)}renderer.render(scene,camera)}
function tick(now){requestAnimationFrame(tick);if(!visible||document.hidden)return;if(!paused&&(manualAt<0||now-manualAt>6500)){if(manualAt>=0){start=now-progress*18000;manualAt=-1}progress=((now-start)%21000)/18000;progress=Math.min(progress,.999)}const s=progress<.28?0:progress<.83?1:2;if(s!==lastStage)setStage(s);controls.update();render()}setStage(0);requestAnimationFrame(tick);
window.doorwiseScene={renderer,scene,controls};
}catch(error){graphicsFailure(error,host,document.querySelector('#fallback'));document.querySelector('.scene-tools').hidden=true;document.querySelector('.route-control').hidden=true}
