const section=document.querySelector('#walkthrough');
let loaded=false;
async function load(){if(loaded)return;loaded=true;try{await import('./walkthrough.js?v=7693e40a6023')}catch(error){console.warn('Walkthrough module load failed',error);const fallback=document.querySelector('#walk-fallback');fallback.textContent='The walkthrough could not download. Please reload the page to try again.';fallback.hidden=false;document.querySelector('.walk-controls').hidden=true}}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load()}},{rootMargin:'150px'});observer.observe(section)}else load();
