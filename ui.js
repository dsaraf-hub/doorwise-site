const dialog=document.querySelector('#demo-dialog');let opener;document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{opener=b;const frame=dialog.querySelector('iframe');if(!frame.src)frame.src=frame.dataset.src;dialog.showModal();document.body.style.overflow='hidden'}));document.querySelector('#close-demo').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});

// Static completed-delivery overview with selectable checkpoints.
const dwRoot=document.querySelector('.dw-v3');
const dwStates=[['Rider entered the building','Main entrance · DB Woods','3:45:12 PM'],['Rider in the elevator','Ground → Floor 18','3:46:08 PM'],['Rider reached floor 18','Corridor · Towards flat 1801','3:48:36 PM'],['Order delivered','Flat 1801 · Floor 18','3:49:25 PM']];
function dwSelect(selected){
 dwRoot.querySelectorAll('[data-dw-step]').forEach(b=>{const active=Number(b.dataset.dwStep)===selected;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});
 dwRoot.querySelectorAll('[data-dw-pin]').forEach(p=>p.classList.toggle('is-selected',Number(p.dataset.dwPin)===selected));
 ['dw-map-stage','dw-map-detail','dw-map-time'].forEach((id,i)=>document.getElementById(id).textContent=dwStates[selected][i]);
 dwRoot.querySelector('.dw-callout-icon').innerHTML=dwRoot.querySelector(`[data-dw-step="${selected}"] .dw-event-icon`).innerHTML;
}
dwRoot.querySelectorAll('[data-dw-step]').forEach(b=>b.addEventListener('click',()=>dwSelect(Number(b.dataset.dwStep))));
let dwZoom=1;
dwRoot.querySelectorAll('[data-dw-zoom]').forEach(b=>b.addEventListener('click',()=>{dwZoom=Math.min(1.5,Math.max(.8,dwZoom+Number(b.dataset.dwZoom)*.1));dwRoot.querySelector('.dw-map-svg').style.transform=`scale(${dwZoom})`}));
dwSelect(3);
