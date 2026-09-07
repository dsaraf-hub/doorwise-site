export function renderRatio(width,height,dpr=1,mode='balanced',gpuLimit=2048){
 if(width<=0||height<=0)return 1;
 const maxEdge=Math.min(mode==='lite'?1000:2048,gpuLimit);
 const pixels=mode==='lite'?700000:2400000;
 return Math.min(Math.max(1,dpr),mode==='lite'?1:2,maxEdge/Math.max(width,height),Math.sqrt(pixels/(width*height)));
}
