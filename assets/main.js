// main.js — optimized: throttled mouse, adaptive particles, rAF updates
(function(){
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Typing animation
  const roles = ['Full-Stack Engineer','Cloud Architect','Cybersecurity Enthusiast','React & AWS Specialist'];
  let ri = 0, ci = 0; const typingEl = document.getElementById('typing');
  function typeLoop(){
    const str = roles[ri];
    if(ci <= str.length){ typingEl && (typingEl.textContent = str.slice(0,ci)); ci++; setTimeout(typeLoop,60); }
    else { setTimeout(()=>{ eraseLoop(); },900); }
  }
  function eraseLoop(){ const str = roles[ri]; if(ci>0){ ci--; typingEl && (typingEl.textContent = str.slice(0,ci)); setTimeout(eraseLoop,36);} else{ ri=(ri+1)%roles.length; setTimeout(typeLoop,200); }}
  typingEl && typeLoop();

  // Update year
  const yearEl = document.getElementById('year'); yearEl && (yearEl.textContent = new Date().getFullYear());

  // Particle mesh (adaptive)
  const canvas = document.getElementById('mesh-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let W,H,particles=[];
    const deviceMem = navigator.deviceMemory || 4;
    function resize(){ W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight; particles = []; const base = Math.max(25, Math.floor((W*H)/90000)); const max = deviceMem > 4 ? Math.min(80, base) : Math.min(60, base); for(let i=0;i<max;i++){ particles.push({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*3,dx:(Math.random()-0.5)*0.6,dy:(Math.random()-0.5)*0.6}); } }
    window.addEventListener('resize', resize, {passive:true}); resize();
    function draw(){ ctx.clearRect(0,0,W,H); const g = ctx.createLinearGradient(0,0,W,H); g.addColorStop(0, 'rgba(7,6,23,0.5)'); g.addColorStop(0.5, 'rgba(6,12,30,0.35)'); g.addColorStop(1, 'rgba(4,5,10,0.6)'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H); particles.forEach(p=>{ p.x += p.dx; p.y += p.dy; if(p.x<0||p.x>W) p.dx*=-1; if(p.y<0||p.y>H) p.dy*=-1; ctx.beginPath(); ctx.fillStyle = 'rgba(0,255,163,0.05)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }); requestAnimationFrame(draw); }
    requestAnimationFrame(draw);
  }

  // Mouse light: throttled with rAF (desktop only)
  const mouseLight = document.getElementById('mouse-light');
  const mouseEnabled = window.matchMedia('(pointer:fine) and (min-width:720px)').matches;
  if(mouseLight && mouseEnabled){
    let mx=-999,my=-999,needUpdate=false;
    function onMove(e){ mx = e.clientX; my = e.clientY; needUpdate = true; }
    window.addEventListener('mousemove', onMove, {passive:true});
    function update(){ if(needUpdate){ mouseLight.style.left = mx+'px'; mouseLight.style.top = my+'px'; mouseLight.style.opacity = 0.12; needUpdate=false; } requestAnimationFrame(update); }
    requestAnimationFrame(update);
    window.addEventListener('mouseleave', ()=>{ mouseLight.style.opacity = 0; }, {passive:true});
  }

  // Orbit layout (CSS-positioned) — compute spread once
  const orbitItems = $$('.orbit-item');
  orbitItems.forEach((it,i)=>{ const angle = (i/orbitItems.length) * Math.PI*2; const r = 120; const x = Math.cos(angle)*r; const y = Math.sin(angle)*r*0.6; it.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${y}px, 0)`; });

  // Tilt cards — use pointer events + rAF for smooth transforms
  const cards = $$('.project-card');
  cards.forEach(card=>{
    let rect, width, height, px=0,py=0,targetX=0,targetY=0,animating=false;
    function updateTransform(){ const rx = -(py/height)*12; const ry = (px/width)*12; card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`; card.style.boxShadow = `${-ry*2}px ${rx*2}px 36px rgba(0,0,0,0.5)`; animating = false; }
    function onPointer(e){ rect = card.getBoundingClientRect(); width = rect.width; height = rect.height; px = (e.clientX - rect.left) - width/2; py = (e.clientY - rect.top) - height/2; if(!animating){ animating=true; requestAnimationFrame(updateTransform); } }
    function reset(){ card.style.transform=''; card.style.boxShadow=''; }
    card.addEventListener('pointermove', onPointer, {passive:true}); card.addEventListener('pointerleave', reset); card.addEventListener('focus', ()=>card.classList.add('focus'));
  });

  // IntersectionObserver for reveals and lazy triggers
  const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('reveal'); io.unobserve(e.target); } }); },{threshold:0.12});
  document.querySelectorAll('.section, .project-card, .skill-col, .timeline-list li').forEach(el=>io.observe(el));

  // Counters (start when visible)
  const counters = $$('.counter');
  counters.forEach(c=>{
    const target = +c.dataset.target; let v=0; const step = Math.max(1, Math.floor(target/60));
    function run(){ v+=step; if(v>=target){ c.textContent = target; } else { c.textContent = v; requestAnimationFrame(run); } }
    const cio = new IntersectionObserver((e)=>{ if(e[0].isIntersecting){ run(); cio.disconnect(); } },{threshold:0.6}); cio.observe(c);
  });

  // Command palette
  const cmd = document.getElementById('cmd'); const cmdInput = document.getElementById('cmd-input'); const cmdList = document.getElementById('cmd-list');
  const cmds = [{k:'Home',id:'#home'},{k:'About',id:'#about'},{k:'Projects',id:'#projects'},{k:'Contact',id:'#contact'},{k:'Download CV',id:'/assets/Teuku_Rijul_CV.pdf'}];
  function openCmd(){ cmd.hidden=false; cmdInput.focus(); renderCmd(''); }
  function closeCmd(){ cmd.hidden=true; cmdInput.value=''; cmdList.innerHTML=''; }
  function renderCmd(q){ cmdList.innerHTML=''; cmds.filter(x=>x.k.toLowerCase().includes(q.toLowerCase())).forEach(x=>{ const li=document.createElement('li'); li.textContent=x.k; li.tabIndex=0; li.onclick=()=>{ closeCmd(); if(x.id.startsWith('#')) location.hash = x.id; else location.href = x.id; }; cmdList.appendChild(li); }); }
  window.addEventListener('keydown', e=>{ if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openCmd(); } if(e.key==='Escape'){ closeCmd(); }});
  cmdInput && cmdInput.addEventListener('input', e=>renderCmd(e.target.value));

  // Copy to clipboard
  $$('.copy').forEach(b=>b.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(b.dataset.copy.replace('mailto:','')); const old = b.textContent; b.textContent='Copied'; setTimeout(()=>b.textContent = old,1500); }catch(err){ console.warn(err) } }));

  // Contact form validation (stub)
  const form = document.querySelector('.contact-form'); if(form){ form.addEventListener('submit', e=>{ e.preventDefault(); const fm = new FormData(form); if(!fm.get('name')||!fm.get('email')||!fm.get('message')){ alert('Please complete the form'); return; } alert('Thanks — message sent (stub).'); form.reset(); }); }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle'); const navLinks = document.querySelector('.nav-links'); if(navToggle){ navToggle.addEventListener('click', ()=>{ const open = navToggle.getAttribute('aria-expanded')==='true'; navToggle.setAttribute('aria-expanded', String(!open)); navLinks.style.display = open? 'none' : 'flex'; }); }

  // Active nav highlight on scroll (throttled)
  const sections = ['home','about','skills','projects','contact'].map(id=>document.getElementById(id));
  let lastScroll = 0; window.addEventListener('scroll', ()=>{ const y = window.scrollY + window.innerHeight/3; sections.forEach(s=>{ if(!s) return; const top = s.offsetTop; const h = s.offsetHeight; const link = document.querySelector(`a[href='#${s.id}']`); if(y >= top && y < top+h){ link && link.classList.add('active'); } else { link && link.classList.remove('active'); } }); }, {passive:true});

  // keyboard-focus helper
  document.addEventListener('keydown', ()=>document.body.classList.add('using-keyboard'));
})();
