/* ============================================
   RIZU ZAMAN — ELITE PORTFOLIO v2.0
   Main JavaScript Module
   ============================================ */

(function () {
  'use strict';

  // ============ UTILITIES ============
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const isMobile = () => window.innerWidth < 768;
  const isTablet = () => window.innerWidth < 1024;

  // ============ PRELOADER ============
  const Preloader = {
    init() {
      const counter = $('#counter');
      const progress = $('#progress');
      const preloader = $('#preloader');
      let count = 0;

      const interval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count > 100) count = 100;
        
        if (counter) counter.textContent = count;
        if (progress) progress.style.width = count + '%';

        if (count === 100) {
          clearInterval(interval);
          setTimeout(() => this.hide(preloader), 400);
        }
      }, 60);
    },

    hide(preloader) {
      preloader.classList.add('hidden');
      document.body.classList.remove('menu-open');
      setTimeout(() => {
        preloader.style.display = 'none';
        Animations.init();
      }, 800);
    }
  };

  // ============ CUSTOM CURSOR ============
  const Cursor = {
    init() {
      if (isMobile()) return;

      const dot = $('#cursor-dot');
      const outline = $('#cursor-outline');
      if (!dot || !outline) return;

      let mouseX = 0, mouseY = 0;
      let outlineX = 0, outlineY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      });

      const animate = () => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animate);
      };
      animate();

      // Hover effect on interactive elements
      const hoverTargets = $$('a, button, .magnetic, .work-card, .service-item');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
      });
    }
  };

  // ============ NAVIGATION ============
  const Navigation = {
    init() {
      this.handleScroll();
      this.handleMenu();
    },

    handleScroll() {
      const navbar = $('#navbar');

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    },

    handleMenu() {
      const toggle = $('#menu-toggle');
      const menu = $('#fullscreen-menu');
      const links = $$('.menu-link');

      if (!toggle || !menu) return;

      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });

      links.forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });
    }
  };

  // ============ MAGNETIC BUTTONS ============
  const Magnetic = {
    init() {
      if (isMobile()) return;

      const elements = $$('.magnetic');
      elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0, 0)';
        });
      });
    }
  };

  // ============ SPOTLIGHT EFFECT ============
  const Spotlight = {
    init() {
      const spotlight = $('#spotlight');
      if (!spotlight) return;

      document.addEventListener('mousemove', (e) => {
        spotlight.style.setProperty('--x', e.clientX + 'px');
        spotlight.style.setProperty('--y', e.clientY + 'px');
      });
    }
  };

  // ============ TYPING EFFECT ============
  const Typing = {
    init() {
      const el = $('#typing-role');
      if (!el) return;

      const roles = ['Full-Stack Engineer', 'Cloud Architect', 'Cybersecurity Specialist'];
      let roleIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const type = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
          el.textContent = currentRole.substring(0, charIndex - 1);
          charIndex--;
        } else {
          el.textContent = currentRole.substring(0, charIndex + 1);
          charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
          speed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          speed = 400;
        }

        setTimeout(type, speed);
      };

      type();
    }
  };

  // ============ COUNTER ANIMATION ============
  const Counters = {
    init() {
      const counters = $$('.stat-number[data-count]');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },

    animate(el) {
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        
        el.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(update);
    }
  };

  // ============ REVEAL ANIMATIONS ============
  const Reveal = {
    init() {
      const reveals = $$('.reveal');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      reveals.forEach(el => observer.observe(el));
    }
  };

  // ============ GSAP ANIMATIONS ============
  const Animations = {
    init() {
      if (typeof gsap === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);

      this.heroAnimation();
      this.parallaxEffects();
    },

    heroAnimation() {
      if (isMobile()) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo('.hero-badge', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.2
      )
      .fromTo('.title-line',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
        0.3
      )
      .fromTo('.hero-description',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.8
      )
      .fromTo('.hero-actions',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        1
      )
      .fromTo('.hero-stats',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        1.2
      );
    },

    parallaxEffects() {
      if (isMobile()) return;

      $$('.work-card').forEach(card => {
        gsap.to(card.querySelector('.work-image img'), {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }
  };

  // ============ THREE.JS 3D SCENE ============
  const ThreeScene = {
    init() {
      const canvas = $('#bg-canvas');
      if (!canvas || typeof THREE === 'undefined') return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050816, 0.0015);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 100;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Particle system
      const particleCount = isMobile() ? 60 : 150;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = [];

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        velocities.push({
          x: (Math.random() - 0.5) * 0.15,
          y: (Math.random() - 0.5) * 0.15,
          z: (Math.random() - 0.5) * 0.15
        });
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const pointMaterial = new THREE.PointsMaterial({
        size: 2,
        color: 0x10b981,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, pointMaterial);
      scene.add(particles);

      // Lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.15
      });
      const lineGeometry = new THREE.BufferGeometry();
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lines);

      // Mouse interaction
      let targetX = 0, targetY = 0;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - windowHalfX) * 0.05;
        targetY = (e.clientY - windowHalfY) * 0.05;
      });

      const animate = () => {
        requestAnimationFrame(animate);

        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += velocities[i].x;
          pos[i * 3 + 1] += velocities[i].y;
          pos[i * 3 + 2] += velocities[i].z;

          if (Math.abs(pos[i * 3]) > 200) velocities[i].x *= -1;
          if (Math.abs(pos[i * 3 + 1]) > 200) velocities[i].y *= -1;
          if (Math.abs(pos[i * 3 + 2]) > 100) velocities[i].z *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Connect nearby particles
        const linePositions = [];
        const connectionDistance = isMobile() ? 35 : 45;

        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectionDistance) {
              linePositions.push(
                pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
                pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
              );
            }
          }
        }

        lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        particles.rotation.y += 0.0008;
        lines.rotation.y += 0.0008;

        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }
  };

  // ============ BACK TO TOP ============
  const BackToTop = {
    init() {
      const btn = $('#back-to-top');
      if (!btn) return;

      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
  const SmoothScroll = {
    init() {
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = 100;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        });
      });
    }
  };

  // ============ INITIALIZE ============
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    
    Preloader.init();
    Cursor.init();
    Navigation.init();
    Magnetic.init();
    Spotlight.init();
    Typing.init();
    Counters.init();
    Reveal.init();
    ThreeScene.init();
    BackToTop.init();
    SmoothScroll.init();
  });

})();