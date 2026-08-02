// assets/main.js - core (minified/concise) + user-interaction lazy-loader
(function(){'use strict';const $=(q,e=document)=>e.querySelector(q),$$=(q,e=document)=>Array.from(e.querySelectorAll(q));
// lazy loader: inject main.lazy.js on interaction or idle
let _lazyLoaded=false;function _injectLazy(){if(_lazyLoaded) return;_lazyLoaded=true;const s=document.createElement('script');s.src='/assets/main.lazy.js';s.defer=true;s.onload=function(){document.body.dispatchEvent(new Event('main.lazy.loaded'))};document.body.appendChild(s)}
function _onUserInteract(){if('requestIdleCallback' in window){requestIdleCallback(_injectLazy,{timeout:1000})}else{setTimeout(_injectLazy,600)}window.removeEventListener('scroll',_onUserInteract);window.removeEventListener('pointermove',_onUserInteract);window.removeEventListener('keydown',_onUserInteract);window.removeEventListener('touchstart',_onUserInteract)}
['scroll','pointermove','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,_onUserInteract,{passive:true,once:true}));
// ensure idle-load fallback (in case no interaction)
if('requestIdleCallback' in window){requestIdleCallback(_injectLazy,{timeout:2000})}else{setTimeout(_injectLazy,2500)}

// typing
const roles=['Full-Stack Engineer','Cloud Architect','Cybersecurity Enthusiast','React & AWS Specialist'];let ri=0,ci=0,typingEl=document.getElementById('typing');function typeLoop(){const s=roles[ri];if(ci<=s.length){typingEl&&(typingEl.textContent=s.slice(0,ci));ci++;setTimeout(typeLoop,60)}else setTimeout(()=>eraseLoop(),900)}function eraseLoop(){const s=roles[ri];if(ci>0){ci--;typingEl&&(typingEl.textContent=s.slice(0,ci));setTimeout(eraseLoop,36)}else{ri=(ri+1)%roles.length;setTimeout(typeLoop,200)}}typingEl&&typeLoop();
// year
const y=document.getElementById('year');y&&(y.textContent=new Date().getFullYear());
// reveal observer
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal');io.unobserve(e.target)}}),{threshold:0.12});document.querySelectorAll('.section,.project-card,.skill-col,.timeline-list li').forEach(el=>io.observe(el));
// counters
$$('.counter').forEach(c=>{const t=+c.dataset.target;let v=0,step=Math.max(1,Math.floor(t/60));function run(){v+=step;if(v>=t){c.textContent=t}else{c.textContent=v;requestAnimationFrame(run)}};const cio=new IntersectionObserver((e)=>{if(e[0].isIntersecting){run();cio.disconnect()}},{threshold:0.6});cio.observe(c)});
// command palette
const cmd=document.getElementById('cmd'),cmdInput=document.getElementById('cmd-input'),cmdList=document.getElementById('cmd-list');const cmds=[{k:'Home',id:'#home'},{k:'About',id:'#about'},{k:'Projects',id:'#projects'},{k:'Contact',id:'#contact'},{k:'Download CV',id:'/assets/Teuku_Rijul_CV.pdf'}];function openCmd(){cmd.hidden=false;cmdInput.focus();renderCmd('')}function closeCmd(){cmd.hidden=true;cmdInput.value='';cmdList.innerHTML=''}function renderCmd(q){cmdList.innerHTML='';cmds.filter(x=>x.k.toLowerCase().includes(q.toLowerCase())).forEach(x=>{const li=document.createElement('li');li.textContent=x.k;li.tabIndex=0;li.onclick=()=>{closeCmd();if(x.id.startsWith('#'))location.hash=x.id;else location.href=x.id};cmdList.appendChild(li)})}window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCmd()}if(e.key==='Escape'){closeCmd()}});cmdInput&&cmdInput.addEventListener('input',e=>renderCmd(e.target.value));
// copy
$$('.copy').forEach(b=>b.addEventListener('click',async ()=>{try{await navigator.clipboard.writeText(b.dataset.copy.replace('mailto:',''));const old=b.textContent;b.textContent='Copied';setTimeout(()=>b.textContent=old,1500)}catch(e){console.warn(e)}}));
// contact form
const form=document.querySelector('.contact-form');form&&form.addEventListener('submit',e=>{e.preventDefault();const fm=new FormData(form);if(!fm.get('name')||!fm.get('email')||!fm.get('message')){alert('Please complete the form');return}alert('Thanks — message sent (stub).');form.reset()});
// nav toggle
const navToggle=document.querySelector('.nav-toggle'),navLinks=document.querySelector('.nav-links');if(navToggle)navToggle.addEventListener('click',()=>{const open=navToggle.getAttribute('aria-expanded')==='true';navToggle.setAttribute('aria-expanded',String(!open));navLinks.style.display=open?'none':'flex'});
// active nav on scroll
const sections=['home','about','skills','projects','contact'].map(id=>document.getElementById(id));window.addEventListener('scroll',()=>{const yPos=window.scrollY+window.innerHeight/3;sections.forEach(s=>{if(!s)return;const top=s.offsetTop,h=s.offsetHeight,link=document.querySelector(`a[href='#${s.id}']`);if(yPos>=top&&yPos<top+h){link&&link.classList.add('active')}else{link&&link.classList.remove('active')}})},{passive:true});
// keyboard helper
document.addEventListener('keydown',()=>document.body.classList.add('using-keyboard'));
})();
