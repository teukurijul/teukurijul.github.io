document.addEventListener("DOMContentLoaded", () => {
  
  // 1. PRELOADER & INISIALISASI
  const preloader = document.getElementById('preloader');
  const body = document.getElementById('body-content');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        body.classList.remove('overflow-hidden');
        initGSAP(); // Jalankan animasi masuk setelah loading
      }, 1000);
    }, 500); // Waktu tunggu buatan untuk estetik
  });

  // 2. MOBILE MENU TOGGLE
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  menuToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
  });

  // Tutup menu saat link diklik
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    });
  });

  // Navbar Blur on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-[#050816]/70', 'backdrop-blur-lg', 'border-b', 'border-white/10');
      navbar.querySelector('.glass-panel').classList.remove('py-3');
      navbar.querySelector('.glass-panel').classList.add('py-2');
    } else {
      navbar.classList.remove('bg-[#050816]/70', 'backdrop-blur-lg', 'border-b', 'border-white/10');
      navbar.querySelector('.glass-panel').classList.add('py-3');
      navbar.querySelector('.glass-panel').classList.remove('py-2');
    }
  });

  // 3. TYPING EFFECT
  const typing = document.getElementById('typing-role');
  const roles = ['Full-Stack Engineer', 'Cloud Architect', 'Cybersecurity Specialist'];
  let role = 0; let char = 0; let deleting = false;

  function type() {
    if(!typing) return;
    const word = roles[role];
    typing.textContent = deleting ? word.slice(0, char--) : word.slice(0, char++);
    let speed = deleting ? 40 : 100;

    if (!deleting && char === word.length + 1) {
      deleting = true; speed = 2000; // Pause sebelum hapus
    } else if (deleting && char === 0) {
      deleting = false; role = (role + 1) % roles.length; speed = 500;
    }
    setTimeout(type, speed);
  }
  type();

  // 4. SPOTLIGHT EFFECT
  const spotlight = document.getElementById('spotlight');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.style.setProperty('--x', mouseX + 'px');
    spotlight.style.setProperty('--y', mouseY + 'px');
  });

  // 5. GSAP ANIMATIONS
  gsap.registerPlugin(ScrollTrigger);

  function initGSAP() {
    // Hero Animasi
    gsap.fromTo(".gsap-hero", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
    );

    // Scroll Animasi Umum
    gsap.utils.toArray('.gsap-scroll').forEach(element => {
      gsap.fromTo(element,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: element, start: "top 85%" },
          y: 0, opacity: 1, duration: 1, ease: "power3.out"
        }
      );
    });

    // Project Cards Animasi Stagger
    gsap.fromTo(".gsap-project",
      { y: 50, opacity: 0 },
      {
        scrollTrigger: { trigger: "#projects", start: "top 75%" },
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.5)"
      }
    );
  }

  // 6. THREE.JS CYBER NETWORK BACKGROUND
  initThreeJS();
});

function initThreeJS() {
  const canvas = document.querySelector('#bg-canvas');
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050816, 0.002); 

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 80 : 200;
  
  const geometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particleCount * 3);
  const velocities = [];

  for(let i = 0; i < particleCount; i++) {
    posArray[i*3] = (Math.random() - 0.5) * 400;
    posArray[i*3+1] = (Math.random() - 0.5) * 400;
    posArray[i*3+2] = (Math.random() - 0.5) * 200;
    velocities.push({
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.2
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const pointMaterial = new THREE.PointsMaterial({
    size: 2,
    color: 0x10b981,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(geometry, pointMaterial);
  scene.add(particlesMesh);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.15
  });
  
  const lineGeometry = new THREE.BufferGeometry();
  const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(linesMesh);

  let targetX = 0; let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('pointermove', (event) => {
    const mouseX = (event.clientX - windowHalfX);
    const mouseY = (event.clientY - windowHalfY);
    targetX = mouseX * 0.05;
    targetY = mouseY * 0.05;
  });

  function animate() {
    requestAnimationFrame(animate);

    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    const positions = particlesMesh.geometry.attributes.position.array;
    for(let i = 0; i < particleCount; i++) {
      positions[i*3] += velocities[i].x;
      positions[i*3+1] += velocities[i].y;
      positions[i*3+2] += velocities[i].z;

      if(Math.abs(positions[i*3]) > 200) velocities[i].x *= -1;
      if(Math.abs(positions[i*3+1]) > 200) velocities[i].y *= -1;
      if(Math.abs(positions[i*3+2]) > 100) velocities[i].z *= -1;
    }
    particlesMesh.geometry.attributes.position.needsUpdate = true;

    const linePositions = [];
    const connectionDistance = isMobile ? 35 : 45;
    
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i*3] - positions[j*3];
        const dy = positions[i*3+1] - positions[j*3+1];
        const dz = positions[i*3+2] - positions[j*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < connectionDistance) {
          linePositions.push(
            positions[i*3], positions[i*3+1], positions[i*3+2],
            positions[j*3], positions[j*3+1], positions[j*3+2]
          );
        }
      }
    }
    
    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    particlesMesh.rotation.y += 0.001;
    linesMesh.rotation.y += 0.001;
    
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  });
}