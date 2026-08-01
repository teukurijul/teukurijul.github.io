document.documentElement.classList.add('js-enabled');

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

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