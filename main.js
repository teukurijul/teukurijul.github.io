// Rizu Zaman - Elite Portfolio - Main JS
document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap) gsap.registerPlugin(ScrollTrigger);

  const preloader = document.getElementById('preloader');
  const body = document.getElementById('body-content');
  const spotlight = document.getElementById('spotlight');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.getElementById('navbar');
  const typingElement = document.getElementById('typing-role');

  // Preloader
  const hidePreloader = () => {
    if (!preloader) return;
    gsap.to(preloader, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        preloader.style.visibility = 'hidden';
        body.classList.remove('overflow-hidden');
        initHeroAnimations();
      }
    });
  };
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 2500);

  // Spotlight
  window.addEventListener('mousemove', (e) => {
    if (!spotlight) return;
    const x = (e.clientX / window.innerWidth) * 100 + '%';
    const y = (e.clientY / window.innerHeight) * 100 + '%';
    spotlight.style.setProperty('--x', x);
    spotlight.style.setProperty('--y', y);
  });

  // Mobile Menu
  menuToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('backdrop-blur-xl', 'bg-[#050816]/70');
    } else {
      navbar.classList.remove('backdrop-blur-xl', 'bg-[#050816]/70');
    }
  });

  // Typing
  const roles = ["Full-Stack Engineer", "Cloud Architect", "Cybersecurity Specialist"];
  let roleIndex = 0, charIndex = 0, isDeleting = false;
  function typeEffect() {
    if (!typingElement) return;
    const current = roles[roleIndex];
    typingElement.textContent = isDeleting? current.substring(0, charIndex - 1) : current.substring(0, charIndex + 1);
    charIndex = isDeleting? charIndex - 1 : charIndex + 1;
    let speed = isDeleting? 50 : 100;
    if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 500; }
    setTimeout(typeEffect, speed);
  }
  typeEffect();

  // Three.js Background
  (function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas ||!window.THREE) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 150;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({ size: 0.025, color: 0x10b981, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    camera.position.z = 4;

    function animate() {
      requestAnimationFrame(animate);
      points.rotation.y += 0.0004;
      points.rotation.x += 0.0001;
      renderer.render(scene, camera);
    }
    animate();
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();

  // GSAP Animations
  function initHeroAnimations() {
    if (!window.gsap) return;
    gsap.from(".gsap-hero", { y: 40, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 });
    gsap.utils.toArray(".gsap-scroll").forEach(sec => {
      gsap.from(sec, { scrollTrigger: { trigger: sec, start: "top 80%" }, y: 60, opacity: 0, duration: 1, ease: "power3.out" });
    });
    gsap.utils.toArray(".gsap-project").forEach((card, i) => {
      gsap.from(card, { scrollTrigger: { trigger: card, start: "top 85%" }, y: 50, opacity: 0, duration: 0.8, delay: i * 0.08, ease: "power3.out" });
    });
  }
});