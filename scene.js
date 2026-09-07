import {icon} from './icons.js?v=e0209c5a7443';
import * as THREE from 'three';
import {surface,qualityControl,createRenderer,graphicsFailure} from './render-quality.js?v=e0209c5a7443';
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
 // Split the floor around the elevator shaft (x ±1, z -2.4 to -.4).
 // The lift platform remains separate and moves freely through this opening.
 box(5.3,.16,9.6,-3.65,y,0);
 box(5.3,.16,9.6,3.65,y,0);
 box(2,.16,2.4,0,y,-3.6);
 box(2,.16,5.2,0,y,2.2);
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
// Quiet surrounding buildings frame the delivery destination.
const contextMat=new THREE.MeshStandardMaterial({color:0xdde5ee,roughness:1});
for(const [x,z,w,h,d] of [[-13,-10,6,13,6],[12,-12,7,18,7],[-5,-17,6,16,5],[5,-20,6,21,6]]){
 box(w,h,d,x,h/2,z,contextMat,false);
 for(let y=2;y<h;y+=2.5)box(w+.15,.09,d+.15,x,y,z,concrete,false);
 for(let y=2;y<h-1;y+=2.5)for(let dx=-w/2+1;dx<w/2;dx+=1.6)box(.7,1,.03,x+dx,y,z+d/2+.03,glass,false);
}
// The motorbike approaches along the street, then stays parked outside.
box(30,.035,2.4,0,-.03,10.7,new THREE.MeshStandardMaterial({color:0xc9d5e3}),false);
// A compact commuter motorcycle, modelled in metres along the X axis.
const bike=new THREE.Group();model.add(bike);
const tyre=new THREE.MeshStandardMaterial({color:0x19212b,roughness:.94});
const metal=new THREE.MeshStandardMaterial({color:0xa9b5c2,metalness:.75,roughness:.32});
const engineMat=new THREE.MeshStandardMaterial({color:0x46515e,metalness:.6,roughness:.5});
const paint=new THREE.MeshStandardMaterial({color:0x2856b8,metalness:.32,roughness:.28});
const lamp=new THREE.MeshStandardMaterial({color:0xfff4d5,emissive:0xffe8b0,emissiveIntensity:.5});
const redLamp=new THREE.MeshStandardMaterial({color:0xd34237,emissive:0x8b1d16,emissiveIntensity:.3});
function part(geo,mat,x,y,z,parent=bike){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
function rod(a,b,r,mat,parent=bike){const p=new THREE.Vector3(...a),q=new THREE.Vector3(...b);const m=part(new THREE.CylinderGeometry(r,r,p.distanceTo(q),8),mat,...p.clone().add(q).multiplyScalar(.5).toArray(),parent);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),q.sub(p).normalize());return m;}
function oval(x,y,z,sx,sy,sz,mat,parent=bike){const m=part(new THREE.SphereGeometry(1,16,10),mat,x,y,z,parent);m.scale.set(sx,sy,sz);return m;}
const wheels=[];
for(const x of [-.73,.73]){
 const wheel=new THREE.Group();wheel.position.set(x,.37,0);bike.add(wheel);wheels.push(wheel);
 part(new THREE.TorusGeometry(.285,.085,10,32),tyre,0,0,0,wheel);
 part(new THREE.TorusGeometry(.227,.022,6,24),metal,0,0,0,wheel);
 const hub=part(new THREE.CylinderGeometry(.07,.07,.2,12),engineMat,0,0,0,wheel);hub.rotation.x=Math.PI/2;
 for(let i=0;i<6;i++){const a=i*Math.PI/3;rod([0,0,0],[Math.cos(a)*.22,Math.sin(a)*.22,0],.012,metal,wheel);}
 const disc=part(new THREE.CylinderGeometry(.13,.13,.015,20),metal,0,0,.105,wheel);disc.rotation.x=Math.PI/2;
 // Slim curved mudguard follows the tyre without enclosing the wheel.
 part(new THREE.TorusGeometry(.392,.032,6,24,Math.PI),x>0?paint:tyre,x,.37,0);
}
for(const z of [-.135,.135]){
 rod([-.73,.37,z],[-.22,.57,z],.034,engineMat);
 rod([-.22,.57,z],[.4,.98,z],.035,engineMat);
 rod([-.55,.89,z],[-.22,.57,z],.03,engineMat);
 rod([-.55,.89,z],[.4,.98,z],.026,engineMat);
 rod([.73,.37,z],[.48,.94,z],.032,metal);
 rod([.53,.78,z],[.43,1.06,z],.044,engineMat);
 rod([-.68,.43,z],[-.48,.86,z],.032,metal);
 for(let i=0;i<6;i++){const spring=part(new THREE.TorusGeometry(.047,.009,5,10),tyre,-.65+i*.023,.5+i*.045,z);spring.rotation.x=Math.PI/2;}
}
oval(.03,.86,0,.34,.19,.19,paint); // sculpted fuel tank
part(new THREE.CylinderGeometry(.05,.05,.014,12),metal,.06,1.046,0);
oval(-.4,.91,0,.32,.075,.18,tyre);
oval(-.05,.49,0,.19,.14,.15,engineMat);
for(let i=0;i<5;i++)part(new THREE.BoxGeometry(.25,.018,.31),metal,.1,.57+i*.035,0);
rod([.22,.57,.13],[.29,.29,.19],.025,metal);
rod([.29,.29,.19],[-.66,.3,.23],.045,metal);
rod([-.68,.3,.23],[-.82,.32,.23],.052,engineMat);
rod([.43,1.06,0],[.5,1.13,0],.035,metal);
rod([.5,1.13,-.27],[.5,1.13,.27],.022,metal);
for(const z of [-.27,.27]){
 rod([.5,1.13,z],[.43,1.13,z],.035,tyre);
 rod([.49,1.14,z],[.5,1.36,z*1.25],.012,metal);
 oval(.5,1.37,z*1.25,.045,.045,.065,engineMat);
 oval(.65,.91,z,.035,.025,.035,new THREE.MeshStandardMaterial({color:0xe7a53b}));
}
const headlight=part(new THREE.CylinderGeometry(.105,.1,.12,20),metal,.59,1.0,0);headlight.rotation.z=Math.PI/2;
const lens=part(new THREE.CircleGeometry(.086,20),lamp,.655,1,0);lens.rotation.y=Math.PI/2;
part(new THREE.BoxGeometry(.05,.06,.18),redLamp,-.88,.89,0);
part(new THREE.BoxGeometry(.025,.12,.19),white,-.88,.74,0);
// Rear delivery box with lid, latch and reflective strip.
part(new THREE.BoxGeometry(.45,.37,.43),paint,-.7,1.14,0);
part(new THREE.BoxGeometry(.47,.035,.45),engineMat,-.7,1.34,0);
part(new THREE.BoxGeometry(.018,.04,.34),white,-.932,1.16,0);
part(new THREE.BoxGeometry(.018,.07,.055),metal,-.934,1.27,0);
const seated=new THREE.Group();bike.add(seated);
oval(-.13,1.26,0,.15,.28,.145,blue,seated).rotation.z=-.23;
oval(-.03,1.64,0,.16,.18,.15,tyre,seated);
oval(.083,1.66,0,.075,.075,.139,metal,seated); // helmet visor faces travel
for(const z of [-.14,.14]){
 rod([-.15,1.04,z],[.16,.78,z*1.4],.073,tyre,seated);
 rod([.16,.78,z*1.4],[.0,.51,z*1.5],.055,tyre,seated);
 oval(.055,.49,z*1.5,.12,.05,.06,engineMat,seated);
 rod([-.09,1.42,z],[.18,1.2,z*1.5],.051,blue,seated);
 rod([.18,1.2,z*1.5],[.46,1.14,z*1.75],.042,blue,seated);
 oval(.46,1.14,z*1.75,.055,.045,.045,tyre,seated);
}
bike.scale.setScalar(1.35);
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
const labels=['Rider approaching by motorbike','Rider arrived','Reached reception','Entered elevator','Reached floor 11','Order delivered'];
const timestamps=['','3:45 PM','3:46 PM','3:48 PM','3:49 PM','3:50 PM'];
let elapsed=0,lastNow=performance.now(),lastStage=-1,visible=true;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
// One introductory camera move; user interaction owns the camera until reload.
let cameraTouched=false,arrivalCameraTime=0;
const initialAzimuth=Math.atan2(camera.position.x-controls.target.x,camera.position.z-controls.target.z);
const cameraRadius=Math.hypot(camera.position.x-controls.target.x,camera.position.z-controls.target.z);
function stopArrivalCamera(){cameraTouched=true;}
host.addEventListener('pointerdown',stopArrivalCamera,{passive:true,capture:true});
host.addEventListener('touchstart',stopArrivalCamera,{passive:true,capture:true});
host.addEventListener('wheel',stopArrivalCamera,{passive:true,capture:true});
controls.addEventListener('start',stopArrivalCamera);
function updateArrivalCamera(dt){
 if(cameraTouched||reduce.matches||arrivalCameraTime>=4)return;
 arrivalCameraTime=Math.min(4,arrivalCameraTime+dt);
 const fraction=arrivalCameraTime/4;
 const eased=fraction*fraction*(3-2*fraction);
 const angle=initialAzimuth*(1-eased);
 camera.position.x=controls.target.x+Math.sin(angle)*cameraRadius;
 camera.position.z=controls.target.z+Math.cos(angle)*cameraRadius;
}

const timeline=[...document.querySelectorAll('[data-checkpoint]')];
function setStage(stage){
 document.querySelector('#eta').textContent=['~ 5 min','~ 5 min','~ 4 min','~ 2 min','< 1 min','Delivered'][stage];document.querySelector('#location').textContent=labels[stage];document.querySelector('#journey-time').textContent=['00:00','00:00','01:00','03:00','04:00','05:00'][stage];document.querySelectorAll('.event').forEach((e,i)=>e.classList.toggle('current',i===(stage<3?0:stage<4?1:2)));
 timeline.forEach((row,i)=>{const reached=stage>=i+1;row.hidden=!reached;row.classList.toggle('done',reached);row.classList.toggle('current',stage===i+1);row.querySelector('time').textContent=reached?timestamps[i+1]:'—';});
 floorHighlight.visible=stage>=4;lastStage=stage;
}
function resize(){const w=host.clientWidth,h=host.clientHeight;qualityResize();const extent=18;camera.left=-extent*w/h;camera.right=extent*w/h;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);resize();new IntersectionObserver(e=>visible=e[0].isIntersecting,{rootMargin:'100px'}).observe(host);
const mix=(a,b,t)=>a.clone().lerp(b,THREE.MathUtils.clamp(t,0,1));
function render(t){
 const stage=t<4?0:t<6?1:t<10?2:t<18?3:t<23?4:5;
 if(stage!==lastStage)setStage(stage);
 bike.position.set(-10+10*Math.min(t/4,1),0,10.7);seated.visible=t<5;
 wheels.forEach(w=>w.rotation.z=-Math.min(t,4)*5);
 rider.visible=t>=5;
 let position;
 if(t<6)position=mix(pts[0],pts[1],(t-5));
 else if(t<10)position=mix(pts[1],pts[2],(t-6)/4);
 else if(t<18)position=mix(pts[2],pts[3],(t-10)/8);
 else if(t<20)position=mix(pts[3],pts[4],(t-18)/2);
 else if(t<23)position=mix(pts[4],pts[6],(t-20)/3);
 else position=pts[6].clone();
 rider.position.copy(position);rider.rotation.y=t>=20?Math.PI/2:Math.PI;
 const marker=(t<5?bike.position.clone().add(new THREE.Vector3(0,2.8,0)):position.clone().add(new THREE.Vector3(0,1.5,0))).project(camera);
 riderLabel.style.left=THREE.MathUtils.clamp((marker.x*.5+.5)*host.clientWidth,70,host.clientWidth-70)+'px';
 riderLabel.style.top=THREE.MathUtils.clamp((-marker.y*.5+.5)*host.clientHeight,35,host.clientHeight-10)+'px';
 riderLabel.querySelector('span').textContent=labels[stage];
 lift.position.y=Math.max(1,Math.min(22.1,position.y-.22));
 legs.forEach((leg,i)=>leg.rotation.x=(stage===3||stage===5||reduce.matches)?0:Math.sin(t*9+i*Math.PI)*.4);
 ring.scale.setScalar(1+(reduce.matches?0:Math.sin(t*3)*.12));
 renderer.render(scene,camera);
}
function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-lastNow)/1000,.1);lastNow=now;if(!visible||document.hidden)return;if(!reduce.matches)elapsed=(elapsed+dt)%31;updateArrivalCamera(dt);controls.update();render(reduce.matches?25:elapsed);}
setStage(0);requestAnimationFrame(tick);
window.doorwiseScene={renderer,scene,controls};
}catch(error){host.hidden=true;document.querySelector('#fallback').hidden=false;}
