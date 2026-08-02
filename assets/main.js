// main.js — handles typing, mesh, tilt, orbit controls, reveal, counters, command palette
(function(){
  'use strict';
  // Utilities
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Typing animation
  const roles = ['Full-Stack Engineer','Cloud Architect','Cybersecurity Enthusiast','React & AWS Specialist'];
  let ri = 0, ci = 0; let typingEl = document.getElementById('typing');
  function typeLoop(){
    const str = roles[ri];
    if(ci <= str.length){
      typingEl.textContent = str.slice(0,ci);
      ci++; setTimeout(typeLoop,60);
    } else { setTimeout(()=>{eraseLoop()},900); }
  }
  function eraseLoop(){
    const str = roles[ri];
    if(ci>0){ ci--; typingEl.textContent = str.slice(0,ci); setTimeout(eraseLoop,36); }
    else{ ri = (ri+1)%roles.length; setTimeout(typeLoop,200); }
  }
  if(typingEl) typeLoop();

  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mesh canvas (lightweight animated gradient + particles)
  const canvas = document.getElementById('mesh-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize(){ W = canvas.width = canvas.clientWidth; H = canvas.height = canvas.clientHeight; particles = []; for(let i=0;i<60;i++){particles.push({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*3,dx:(Math.random()-0.5)*0.6,dy:(Math.random()-0.5)*0.6})}};
    window.addEventListener('resize', resize); resize();
    function draw(){ ctx.clearRect(0,0,W,H);
      // gradient background
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0, 'rgba(7,6,23,0.5)'); g.addColorStop(0.5, 'rgba(6,12,30,0.35)'); g.addColorStop(1, 'rgba(4,5,10,0.6)');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      // particles
      particles.forEach(p=>{
        p.x += p.dx; p.y += p.dy;
        if(p.x<0||p.x>W)p.dx*=-1; if(p.y<0||p.y>H)p.dy*=-1;
        ctx.beginPath(); ctx.fillStyle = 'rgba(0,255,163,0.05)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  // Mouse light — desktop only
  const mouseLight = document.getElementById('mouse-light');
  let mouseEnabled = window.matchMedia('(pointer:fine) and (min-width:720px)').matches;
  if(mouseLight && mouseEnabled){
    window.addEventListener('mousemove', e=>{
      mouseLight.style.left = e.clientX+'px'; mouseLight.style.top = e.clientY+'px';
      mouseLight.style.opacity = 0.12; });
    window.addEventListener('mouseleave',()=>{mouseLight.style.opacity=0});
  }

  // Orbit items positions set via JS for spread
  const orbitItems = $$('.orbit-item');
  orbitItems.forEach((it,i)=>{
    const angle = (i/orbitItems.length) * Math.PI*2;
    const r = 120; const x = Math.cos(angle)*r; const y = Math.sin(angle)*r*0.6;
    it.style.transform = `translate(-50%,-50%) translate3d(${x}px, ${y}px, 0)`;
  });

  // Tilt cards
  const cards = $$('.project-card');
  cards.forEach(card=>{
    let rect, width, height;
    function calc(e){ rect = card.getBoundingClientRect(); width = rect.width; height = rect.height; const x = (e.clientX - rect.left) - width/2; const y = (e.clientY - rect.top) - height/2; const ry = (x / width) * 12; const rx = -(y / height) * 12; card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`; card.style.boxShadow = `${-ry*2}px ${rx*2}px 40px rgba(0,0,0,0.6)`; }
    function reset(){ card.style.transform=''; card.style.boxShadow=''; }
    card.addEventListener('mousemove', calc); card.addEventListener('mouseleave', reset); card.addEventListener('focus', ()=>card.classList.add('focus'));
  });

  // IntersectionObserver for reveals and lazy
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('reveal'); io.unobserve(e.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.section, .project-card, .skill-col, .timeline-list li').forEach(el=>io.observe(el));

  // Counters
  const counters = $$('.counter');
  counters.forEach(c=>{
    const target = +c.dataset.target; let v=0; const step = Math.max(1, Math.floor(target/60));
    function run(){ v+=step; if(v>=target){c.textContent=target; } else { c.textContent=v; requestAnimationFrame(run);} }
    // start when visible
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
  $$('.copy').forEach(b=>b.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(b.dataset.copy.replace('mailto:','')); b.textContent='Copied'; setTimeout(()=>b.textContent=b.dataset.copy.replace('mailto:',''),1500)}catch(err){console.warn(err)} }));

  // Contact form basic validation + submit stub
  const form = document.querySelector('.contact-form');
  if(form){ form.addEventListener('submit', e=>{ e.preventDefault(); const fm = new FormData(form); if(!fm.get('name')||!fm.get('email')||!fm.get('message')){ alert('Please complete the form'); return;} alert('Thanks — message sent (stub).'); form.reset(); }); }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle'); const navLinks = document.querySelector('.nav-links');
  if(navToggle){ navToggle.addEventListener('click', ()=>{ const open = navToggle.getAttribute('aria-expanded')==='true'; navToggle.setAttribute('aria-expanded', String(!open)); navLinks.style.display = open? 'none' : 'flex'; }); }

  // Active nav highlight on scroll
  const sections = ['home','about','skills','projects','contact'].map(id=>document.getElementById(id));
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY + window.innerHeight/3;
    sections.forEach(s=>{ if(!s) return; const top = s.offsetTop; const h = s.offsetHeight; const link = document.querySelector(`a[href='#${s.id}']`);
      if(y >= top && y < top+h){ link && link.classList.add('active'); } else { link && link.classList.remove('active'); }
    });
  });

  // Accessibility: focus-visible polyfill (simple)
  document.addEventListener('keydown', ()=>document.body.classList.add('using-keyboard'));

})();
