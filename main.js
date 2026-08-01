// Mobile menu
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Typing effect
const typing = document.getElementById('typing-role');
const roles = ['Full-Stack Engineer', 'Cloud Architect', 'Cybersecurity Specialist'];

let role = 0;
let char = 0;
let deleting = false;

function type() {
  const word = roles[role];

  typing.textContent = deleting
    ? word.slice(0, char--)
    : word.slice(0, char++);

  let speed = deleting ? 50 : 90;

  if (!deleting && char === word.length + 1) {
    deleting = true;
    speed = 1200;
  }

  if (deleting && char === 0) {
    deleting = false;
    role = (role + 1) % roles.length;
  }

  setTimeout(type, speed);
}

if (typing) type();

// Spotlight effect
window.addEventListener('pointermove', (e) => {
  document.getElementById('spotlight')?.style.setProperty('--x', e.clientX + 'px');
  document.getElementById('spotlight')?.style.setProperty('--y', e.clientY + 'px');
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));