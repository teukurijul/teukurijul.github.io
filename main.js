// 1. PRELOADER & BOOT SEQUENCE LOGIC
window.addEventListener('load', () => {
    const bootText = document.getElementById('boot-text');
    const bootBar = document.getElementById('boot-bar');
    const preloader = document.getElementById('preloader');
    
    const bootSequence = [
        "> MENGINISIALISASI SISTEM...",
        "> MEMUAT MODUL KEAMANAN...",
        "> MENYIAPKAN HOLOGRAM 3D...",
        "> BYPASSING FIREWALL... OK",
        "> AKSES DIBERIKAN."
    ];

    let step = 0;
    const bootInterval = setInterval(() => {
        if(step < bootSequence.length) {
            bootText.innerHTML = bootSequence.slice(0, step + 1).join('<br>');
            gsap.to(bootBar, { scaleX: (step + 1) / bootSequence.length, duration: 0.3 });
            step++;
        } else {
            clearInterval(bootInterval);
            setTimeout(() => {
                gsap.to(preloader, { 
                    yPercent: -100, 
                    duration: 0.8, 
                    ease: "power4.inOut",
                    onComplete: initMainAnimations // Mulai animasi utama setelah preloader hilang
                });
            }, 500);
        }
    }, 400); // Kecepatan teks boot (ms)
    
    // Registrasi Service Worker (Jika digunakan)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    }
});

// 2. THREE.JS LOGIC: CYBER HOLO-GLOBE
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020617, 0.001); // Sesuai warna background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimalisasi mobile
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 250;

// Sesuaikan posisi globe di mobile vs desktop
if(window.innerWidth < 768) {
    camera.position.z = 350; // Jauhkan di mobile
    scene.position.y = -50; 
} else {
    scene.position.x = window.innerWidth * 0.15; // Geser ke kanan di desktop
}

// Grup Globe
const globeGroup = new THREE.Group();
scene.add(globeGroup);

// Geometri Bola (Wireframe untuk efek radar/cyber)
const sphereGeo = new THREE.IcosahedronGeometry(120, 3);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4, // Cyan
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
globeGroup.add(sphere);

// Titik (Nodes) di permukaan Globe
const pointsMat = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: 2,
    transparent: true,
    opacity: 0.8
});
const points = new THREE.Points(sphereGeo, pointsMat);
globeGroup.add(points);

// Cincin Sabuk (Satelit/Data Stream)
const ringGeo = new THREE.RingGeometry(160, 161, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
const ring1 = new THREE.Mesh(ringGeo, ringMat);
ring1.rotation.x = Math.PI / 2;
globeGroup.add(ring1);

const ring2 = new THREE.Mesh(ringGeo, ringMat);
ring2.rotation.y = Math.PI / 3;
globeGroup.add(ring2);

// Interaksi Parallax Mouse
let mouseX = 0; let mouseY = 0;
let targetX = 0; let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Rotasi Globe
    globeGroup.rotation.y += 0.002;
    globeGroup.rotation.x += 0.001;
    
    // Rotasi Cincin
    ring1.rotation.z += 0.005;
    ring2.rotation.z -= 0.003;

    // Parallax Kamera
    targetX = mouseX * 0.3;
    targetY = mouseY * 0.3;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate3D();

// Handle Resize Layar
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(window.innerWidth < 768) {
        camera.position.z = 350; scene.position.x = 0; scene.position.y = -50;
    } else {
        camera.position.z = 250; scene.position.x = window.innerWidth * 0.15; scene.position.y = 0;
    }
});

// 3. GSAP & UI LOGIC
function initMainAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Typing Effect di Hero
    const typeText = document.querySelector('.typing-text');
    if (typeText) {
        const originalText = typeText.innerHTML;
        typeText.innerHTML = '';
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < originalText.length) {
                typeText.innerHTML += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    }

    // Animasi Masuk
    const tl = gsap.timeline();
    tl.from(".gs-reveal:not(.cyber-card)", {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
    });

    // Animasi Scroll (Menggunakan ScrollTrigger)
    const revealElements = document.querySelectorAll(".gs-reveal");
    revealElements.forEach((elem) => {
        gsap.fromTo(elem, 
            { opacity: 0, y: 40 }, 
            {
                scrollTrigger: { trigger: elem, start: "top 85%" },
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out"
            }
        );
    });

    // Animasi Angka Penghitung (Metrics)
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.innerText);
        gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 0.1 }, // Untuk penanganan angka desimal
            scrollTrigger: { trigger: counter.parentElement, start: "top 90%" }
        });
    });
}

// 4. CUSTOM CURSOR & NAVBAR LOGIC
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

// Sembunyikan cursor bawaan dan aktifkan custom cursor HANYA di desktop
if (window.matchMedia("(min-width: 768px)").matches) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        // Animasi Ring mengikuti dengan sedikit delay
        gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out", xPercent: -50, yPercent: -50 });
    });

    // Hover effect pada links dan buttons
    const interactables = document.querySelectorAll('a, button, .hud-wrapper, .cyber-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '30px';
            cursorRing.style.height = '30px';
            cursorRing.style.backgroundColor = 'transparent';
        });
    });
}

// Navbar blur on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('shadow-lg', 'shadow-cyber-cyan/10');
    } else {
        navbar.classList.remove('shadow-lg', 'shadow-cyber-cyan/10');
    }
});

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Tutup menu mobile jika link diklik
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}