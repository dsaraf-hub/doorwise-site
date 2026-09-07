import {icon} from './icons.js?v=e0209c5a7443';
import * as THREE from 'three';
import {surface,qualityControl,createRenderer,graphicsFailure} from './render-quality.js?v=e0209c5a7443';
const host=document.querySelector('#walk-scene');
try {
 const renderer=createRenderer();renderer.setPixelRatio(1);renderer.setClearColor(0xe9eef4);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;host.appendChild(renderer.domElement);const qualityResize=qualityControl(renderer,host,"Walkthrough");renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xe9eef4,38,70);
 const camera=new THREE.PerspectiveCamera(65,1,.08,100);
 const ambient=new THREE.HemisphereLight(0xf6faff,0xaeb6c3,2.6);scene.add(ambient);const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(-4,8,10);scene.add(sun);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:20,bottom:-20,near:.1,far:70});sun.shadow.normalBias=.025;sun.shadow.bias=-.0003;scene.add(sun.target);
 const materials={wall:new THREE.MeshStandardMaterial({color:0xe6e9ee,roughness:.95}),floor:new THREE.MeshStandardMaterial({color:0xd2d8de,roughness:.8}),wood:new THREE.MeshStandardMaterial({color:0x8a7767,roughness:.8}),trim:new THREE.MeshStandardMaterial({color:0xf6f8fb,roughness:.8}),metal:new THREE.MeshStandardMaterial({color:0x758391,roughness:.35,metalness:.6}),blue:new THREE.MeshStandardMaterial({color:0x315cc6,roughness:.6}),light:new THREE.MeshBasicMaterial({color:0xf9fcff})};
 const oak=surface('wood',renderer),stone=surface('stone',renderer),steel=surface('steel',renderer),plaster=surface('plaster',renderer);
 materials.wood.map=oak;materials.wood.color.set(0xffffff);materials.wood.bumpMap=oak;materials.wood.bumpScale=.016;materials.floor.map=stone;materials.floor.bumpMap=stone;materials.floor.bumpScale=.014;materials.floor.roughness=.52;materials.wall.map=plaster;materials.wall.bumpMap=plaster;materials.wall.bumpScale=.01;materials.metal.map=steel;materials.metal.metalness=.35;
 const walls=new THREE.Group();scene.add(walls);
 function box(w,h,d,x,y,z,material=materials.wall,parent=scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
 // A full-scale residential corridor, deliberately separate from the schematic tower.
 box(5,.15,34,0,-.08,1,materials.floor);box(.18,3.1,34,-2.5,1.55,1,materials.wall,walls);box(.18,3.1,34,2.5,1.55,1,materials.wall,walls);box(5,3.1,.2,0,1.55,-16,materials.wall,walls);
 const ceiling=box(5,.1,34,0,3.15,1,materials.trim);
 for(const x of [-2.36,2.36]){box(.08,.17,34,x,.085,1,materials.trim);for(let z=-12.7;z<16;z+=4.6)box(.06,.075,3.25,x,1.05,z,materials.metal)}
 const seamMat=new THREE.LineBasicMaterial({color:0xafbac7,transparent:true,opacity:.6});
 for(let z=-16;z<=18;z+=2){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.42,.006,z),new THREE.Vector3(2.42,.006,z)]);scene.add(new THREE.Line(geo,seamMat))}
 for(const x of [-1.25,0,1.25]){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,.006,-16),new THREE.Vector3(x,.006,18)]);scene.add(new THREE.Line(geo,seamMat))}
 function sign(text,width=1.2,height=.36,color='#33495f',bg='#f5f7fa'){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='500 52px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,67);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));return mesh;
 }
 for(let i=0;i<6;i++){
  const z=12-i*4.6;
  for(const side of [-1,1]){
   const x=side*2.37;const door=box(.1,2.2,1.05,x,1.1,z,materials.wood);
   box(.15,2.32,.08,x,1.16,z-.56,materials.trim);box(.15,2.32,.08,x,1.16,z+.56,materials.trim);box(.15,.08,1.2,x,2.3,z,materials.trim);
   box(.17,.04,.19,x-side*.1,1,z+.32,materials.metal);
   const number=sign(String(1102+i*2+(side===1?1:0)),.64,.18);number.rotation.y=-side*Math.PI/2;number.position.set(x-side*.07,1.78,z);scene.add(number);
  }
  box(.14,.025,1.7,0,3.08,z,materials.light);const point=new THREE.PointLight(0xe4edff,3,6,2);point.position.set(0,2.8,z);scene.add(point);
 }
 // Distinct destination, with a legible number and hardware.
 box(1.3,2.25,.12,0,1.125,-15.8,materials.blue);box(.1,2.4,.17,-.72,1.2,-15.7,materials.trim);box(.1,2.4,.17,.72,1.2,-15.7,materials.trim);box(1.55,.1,.17,0,2.4,-15.7,materials.trim);box(.24,.045,.1,.43,1,-15.66,materials.metal);
 const dest=sign('1114',.72,.2,'#ffffff','#315cc6');dest.position.set(0,1.78,-15.72);scene.add(dest);const floor=sign('Floor 11',1.15,.3);floor.position.set(0,2.77,-15.77);scene.add(floor);
 // Blue navigation cues sit on the floor, as an illustrative guidance overlay.
 const route=box(.055,.012,29,0,.02,-.5,materials.blue);
 const arrows=[];for(let z=13;z>-14;z-=3.2){const shape=new THREE.Shape();shape.moveTo(-.22,0);shape.lineTo(0,.3);shape.lineTo(.22,0);shape.lineTo(.14,-.07);shape.lineTo(0,.12);shape.lineTo(-.14,-.07);shape.closePath();const arrow=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color:0x315cc6,side:THREE.DoubleSide}));arrow.rotation.x=-Math.PI/2;arrow.position.set(0,.026,z);scene.add(arrow);arrows.push(arrow)}
 const avatar=new THREE.Group();const head=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),materials.blue);head.position.y=1.6;avatar.add(head);const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.65,3,8),materials.blue);torso.position.y=1;avatar.add(torso);scene.add(avatar);

 // Door joinery, brass peepholes, threshold plates and recessed ceiling trims.
 const brass=new THREE.MeshStandardMaterial({color:0xafa087,metalness:.7,roughness:.3});
 for(let i=0;i<6;i++){const z=12-i*4.6;for(const side of [-1,1]){const x=side*2.28;
  for(const zz of [-.43,.43])box(.012,1.55,.022,x,.97,z+zz,materials.trim);
  for(const yy of [.22,1.73])box(.012,.022,.86,x,yy,z,materials.trim);
  const peephole=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.03,16),brass);peephole.rotation.z=Math.PI/2;peephole.position.set(x,1.52,z);scene.add(peephole);
  box(.035,.13,.07,x,1.15,z+.72,materials.metal);box(.045,.035,.035,x-side*.025,1.15,z+.72,materials.light);
  box(.25,.012,1.14,side*2.32,.018,z,materials.metal);
 }
 for(const x of [-.11,.11])box(.025,.04,1.9,x,3.045,z,materials.metal);
}
 // Continuous route: street -> lobby -> through-lift -> upper-floor corridor.
 const corridor=new THREE.Group();
 for(const child of [...scene.children])if(child!==ambient&&child!==sun&&child!==avatar)corridor.add(child);
 corridor.position.set(0,33,-36);scene.add(corridor);
 const lobby=new THREE.Group();scene.add(lobby);
 box(16,.16,36,0,-.09,7,materials.floor,lobby);
 const lobbyWalls=new THREE.Group();lobby.add(lobbyWalls);
 for(const x of [-5,5])box(.22,4,20,x,2,3,materials.wall,lobbyWalls);
 const lobbyRoof=box(10,.15,20,0,4,3,materials.trim,lobby);
 for(const x of [-3.35,3.35])box(3.3,4,.25,x,2,13,materials.wall,lobbyWalls);
 box(10,.8,.3,0,3.65,13,materials.wall,lobbyWalls);
 for(const x of [-1.65,1.65])box(.09,3.25,.12,x,1.62,13,materials.metal,lobby);
 const glazing=new THREE.MeshStandardMaterial({color:0xabc8de,transparent:true,opacity:.22,roughness:.2,depthWrite:false});
 for(const x of [-2.4,2.4])box(1.35,3,.08,x,1.5,13,glazing,lobby);
 const entranceSign=sign('Tower A',2.2,.42);entranceSign.position.set(0,3.65,13.18);lobby.add(entranceSign);
 const reception=box(2.3,.9,1,-3.5,.45,5,materials.wood,lobby);
 const welcome=sign('Welcome · Tower A',2.1,.3);welcome.position.set(-3.4,2,3);lobby.add(welcome);
 for(const x of [-4,4]){box(.8,.6,.8,x,.3,14.5,materials.trim,lobby);const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(.65,1),new THREE.MeshStandardMaterial({color:0x78968a,roughness:1}));leaves.position.set(x,1.2,14.5);lobby.add(leaves)}
 for(let z=10;z>=-3;z-=4)box(1,.04,.45,0,3.87,z,materials.light,lobby);
 // Lobby rear wall has an open elevator doorway.
 for(const x of [-3.3,3.3])box(3.4,4,.2,x,2,-5,materials.wall,lobbyWalls);
 box(3.2,1,.2,0,3.5,-5,materials.wall,lobbyWalls);
 const elevatorSign=sign('Elevator  ↑  11',2,.32);elevatorSign.position.set(0,3.35,-4.84);lobby.add(elevatorSign);
 box(.06,.015,26,0,.015,8,materials.blue,lobby);
 const cabin=new THREE.Group();scene.add(cabin);
 box(3.2,.12,6,0,-.03,-8,materials.floor,cabin);
 const cabinWalls=new THREE.Group();cabin.add(cabinWalls);
 for(const x of [-1.65,1.65]){box(.14,3,6,x,1.5,-8,materials.metal,cabinWalls);box(.05,.06,5.6,x-Math.sign(x)*.1,.95,-8,materials.trim,cabinWalls)}
 const cabinRoof=box(3.4,.12,6,0,3.08,-8,materials.trim,cabin);
 box(1.5,.03,3,0,2.99,-8,materials.light,cabin);
 const doors=[];for(const side of [-1,1])doors.push(box(1.62,2.7,.08,side*.81,1.35,-11,materials.metal,cabin));
 const rearDoors=[];for(const side of [-1,1])rearDoors.push(box(1.62,2.7,.08,side*2.5,1.35,-5,materials.metal,cabin));
 let display=sign('↑  G',.85,.25,'#dceaff','#23354b');display.position.set(0,2.85,-10.94);cabin.add(display);let displayLevel=-1;
 const upperLanding=box(5,.15,7,0,32.92,-14.5,materials.floor);
 const upperWalls=new THREE.Group();scene.add(upperWalls);for(const x of [-2.5,2.5])box(.15,3.1,7,x,34.55,-14.5,materials.wall,upperWalls);
 const upperRoof=box(5,.1,7,0,36.15,-14.5,materials.trim);
 // Cabin control panel, tactile buttons and brushed-metal door seams.
 box(.32,1.1,.035,1.29,1.3,-10.93,materials.trim,cabin);
 for(let f=0;f<12;f++){const col=f%3,row=Math.floor(f/3);const button=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.018,20),f===11?materials.blue:materials.metal);button.rotation.x=Math.PI/2;button.position.set(1.18+col*.1,1.66-row*.19,-10.89);cabin.add(button)}
 const buttonLabel=sign('11 selected',.6,.15,'#315cc6','#f5f7fa');buttonLabel.position.set(1.27,2,-10.88);cabin.add(buttonLabel);
 for(const z of [-10.2,-5.8])for(let x=-.65;x<.7;x+=.12)box(.055,.025,.5,x,2.99,z,materials.metal,cabin);
 const directory=sign('Floors 1–11  ↑',1.55,.25);directory.position.set(2.9,2,-4.82);lobby.add(directory);
 for(const x of [-4.7,4.7])for(let z=-2;z<12;z+=3){box(.06,2.6,.05,x,1.7,z,materials.trim,lobby);}
 const mat=box(3,.016,1.5,0,.02,11.8,new THREE.MeshStandardMaterial({color:0x616c77,roughness:1}),lobby);
 for(let z=-3;z<23;z+=1.5)box(9.8,.008,.018,0,.013,z,materials.trim,lobby);
 let p=0,playing=false,view='first',last=0,visible=false;
 const slider=document.querySelector('#walk-progress'),play=document.querySelector('#walk-play');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=t=>Math.max(0,Math.min(1,t));const ease=t=>{t=clamp(t);return t*t*(3-2*t)};
 function journey(){
  if(p<.32)return {stage:0,t:p/.32,position:new THREE.Vector3(0,1.65,22-(p/.32)*30),level:0};
  if(p<.62){const t=(p-.32)/.30;const lift=ease((t-.14)/.65);return {stage:1,t,position:new THREE.Vector3(0,1.65+lift*33,-8),level:Math.round(lift*11)}}
  const t=(p-.62)/.38;return {stage:2,t,position:new THREE.Vector3(0,34.65,-8-t*42),level:11};
 }
 function sync(){const j=journey(),arrived=p>=.999;
 document.querySelector('#walk-distance').textContent=j.stage===0?(j.t<.32?'Tower A · Main entrance':'Ground floor · Elevator ahead'):j.stage===1?`Floor ${j.level} → Floor 11`:arrived?'Destination reached':`${Math.max(0,Math.round((1-j.t)*42))} m to Flat 1114`;
 document.querySelector('#walk-direction').textContent=j.stage===0?(j.t<.32?'Enter through the main entrance':j.t>.86?'Step into the elevator':'Walk through the lobby'):j.stage===1?(j.t>.82?'Doors opening on floor 11':'Take the elevator to floor 11'):arrived?'You’re at Flat 1114':j.t<.2?'Exit the elevator':'Continue along the corridor';
 document.querySelector('#walk-icon').innerHTML=icon(arrived?'✓':j.stage===1?'↥':'↑');
 document.querySelector('#walk-status').textContent=j.stage===0?(j.t<.32?'Rider approaching the building':'Rider inside the lobby'):j.stage===1?`Rider in elevator · Floor ${j.level}`:arrived?'Rider reached the delivery door':'Rider walking on floor 11';
 document.querySelector('#walk-eta').textContent=arrived?'At the destination':['About 3 minutes','About 2 minutes','Less than a minute'][j.stage];
 document.querySelector('#walk-floor').textContent=j.stage===0?'Ground floor':j.stage===1?`Elevator · Floor ${j.level}`:'Floor 11';
 document.querySelectorAll('[data-walk-stage]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===j.stage)));
 slider.value=String(p*100);play.innerHTML=playing?'Pause journey <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>':arrived?'Start again <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></svg>':'Start the journey <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>';play.setAttribute('aria-label',playing?'Pause walkthrough':arrived?'Replay first-person walkthrough':'Start first-person walkthrough');}
 function draw(){const j=journey();cabin.position.y=j.position.y-1.65;cabin.position.y=Math.min(33,Math.max(0,cabin.position.y));if(j.stage===2)cabin.position.y=33;
 const open=j.stage===2?1:j.stage===1?ease((j.t-.82)/.15):0;
 doors.forEach((door,i)=>door.position.x=(i?1:-1)*(.81+open*1.67));
 const rearClosed=j.stage===0?0:j.stage===1?ease(j.t/.13):1;rearDoors.forEach((door,i)=>door.position.x=(i?1:-1)*(.81+(1-rearClosed)*1.67));
 if(j.level!==displayLevel){const replacement=sign(j.level===11?'11':'↑  '+(j.level||'G'),.85,.25,'#dceaff','#23354b');display.material.map.dispose();display.material.dispose();display.geometry.dispose();cabin.remove(display);display=replacement;display.position.set(0,2.85,-10.94);cabin.add(display);displayLevel=j.level}
 avatar.position.copy(j.position).add(new THREE.Vector3(0,-1.65,0));avatar.visible=view==='overview';ceiling.visible=lobbyRoof.visible=cabinRoof.visible=upperRoof.visible=view==='first';walls.visible=lobbyWalls.visible=cabinWalls.visible=upperWalls.visible=view==='first';
 if(view==='first'){camera.fov=65;camera.position.copy(j.position);camera.lookAt(j.position.x,j.position.y-.03,j.position.z-5)}else{camera.fov=52;const fit=Math.max(1,1.45/camera.aspect);camera.position.copy(j.position).add(new THREE.Vector3(12*fit,17*fit,15*fit));camera.lookAt(j.position)}sun.position.copy(j.position).add(new THREE.Vector3(-3,6,4));sun.target.position.copy(j.position).add(new THREE.Vector3(0,-1,-5));camera.updateProjectionMatrix();renderer.render(scene,camera)}
 function resize(){qualityResize();camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();draw()}host.addEventListener("qualitychange",draw);new ResizeObserver(resize).observe(host);
 function stop(){playing=false;sync()}
 play.onclick=()=>{if(p>=.999)p=0;playing=!playing;last=performance.now();sync();draw()};document.querySelector('#walk-restart').onclick=()=>{p=0;stop();draw()};slider.addEventListener('input',()=>{p=Number(slider.value)/100;stop();draw()});
 document.querySelectorAll('[data-walk-stage]').forEach((button,i)=>button.onclick=()=>{p=[0,.34,.64][i];stop();draw()});
 document.querySelectorAll('[data-walk-view]').forEach(button=>button.onclick=()=>{view=button.dataset.walkView;document.querySelectorAll('[data-walk-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));host.setAttribute('aria-label',view==='first'?'First-person journey through the entrance, elevator and corridor to flat 1114':'3D overview of the current stage of the rider journey');draw()});
 reduced.addEventListener('change',e=>{if(e.matches)stop()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=performance.now()},{threshold:.05}).observe(host);
 function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden||!playing)return;p=Math.min(1,p+dt/55);if(p>=1)playing=false;sync();draw()}sync();resize();requestAnimationFrame(tick);
}catch(error){graphicsFailure(error,host,document.querySelector('#walk-fallback'));document.querySelector('.walk-stage-nav').hidden=true;document.querySelector('.walk-controls').hidden=true;document.querySelector('.walk-views').hidden=true;document.querySelector('.walk-instruction').hidden=true;}
