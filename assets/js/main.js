javascript
document.documentElement.classList.add('js-enabled');

// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.classList.toggle('hidden');
});

// Typing effect
const typingElement = document.getElementById('typing-role');

const roles = [
  'Full-Stack Engineer',
  'Cloud Architect',
  'Cybersecurity Specialist',
  'Automation Builder'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
  const current = roles[roleIndex];

  typingElement.textContent = deleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  let speed = deleting ? 50 : 90;

  if (!deleting && charIndex === current.length + 1) {
    deleting = true;
    speed = 1400;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, speed);
}

typeRole();

// Spotlight
const spotlight = document.getElementById('spotlight');

window.addEventListener('pointermove', (e) => {
  spotlight.style.setProperty('--x', `${e.clientX}px`);
  spotlight.style.setProperty('--y', `${e.clientY}px`);
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 3D tilt
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 16;
    const rotateX = ((y / rect.height) - 0.5) * -16;

    card.style.transform =
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  });
});

// Canvas particles
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  }));
}

createParticles();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,255,163,0.7)';
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
```

---

## 4. `robots.txt`

```txt
User-agent: *
Allow: /

Sitemap: https://teukurijul.github.io/sitemap.xml