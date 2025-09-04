import * as THREE from 'three';

// --- 3D Background Setup ---
const container = document.getElementById('webgl-container');
let scene, camera, renderer, crystal;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create the crystal
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        metalness: 0.1,
        roughness: 0.2,
        emissive: 0x0a0a1a,
        wireframe: true
    });
    crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 3, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    gsap.to(crystal.rotation, {
        duration: 1.5,
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        ease: 'power2.out'
    });
    gsap.to(camera.position, {
        duration: 1.5,
        x: mouseX * 0.2,
        y: mouseY * 0.2,
        ease: 'power2.out'
    });
}


function animate() {
    requestAnimationFrame(animate);

    crystal.rotation.x += 0.001;
    crystal.rotation.y += 0.001;

    renderer.render(scene, camera);
}

// Dummy GSAP object for mouse move - real GSAP is too large for this context
const gsap = {
    to: (target, { duration, ease, ...vars }) => {
        const start = {};
        const end = {};
        for (const key in vars) {
            start[key] = target[key];
            end[key] = vars[key];
        }

        let startTime = null;
        const animate = (time) => {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            let progress = Math.min(elapsed / (duration * 1000), 1);
            
            // Simple easeOut
            if (ease === 'power2.out') {
                progress = 1 - Math.pow(1 - progress, 2);
            }

            for (const key in end) {
                target[key] = start[key] + (end[key] - start[key]) * progress;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
};


init();


// --- Intersection Observer for scroll animations ---
const sections = document.querySelectorAll('.content-section, #hero');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

