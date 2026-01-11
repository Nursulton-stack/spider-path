const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const MAX_PARTICLES = 300;
const GRAVITY = 0.05; // 👈 gravity kuchi

// Pointer
const pointer = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.vx = Math.random() * 1.5 - 0.75;
        this.vy = Math.random() * -2; // yuqoriga otib yuboramiz
        this.life = 100;
    }

    update() {
        this.vy += GRAVITY; // 👈 gravity qo‘shildi
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.size *= 0.96;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.shadowColor = "white";
        ctx.shadowBlur = 8;
        ctx.fill();
    }
}

// Spawn
function spawn(count) {
    for (let i = 0; i < count; i++) {
        if (particles.length < MAX_PARTICLES) {
            particles.push(new Particle(pointer.x, pointer.y));
        }
    }
}

// Mouse
window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    spawn(2);
});

// Touch
window.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const t = e.touches[0];
    pointer.x = t.clientX;
    pointer.y = t.clientY;
    spawn(2);
}, { passive: false });

// Click / Tap → Portlash 💥
window.addEventListener("click", () => spawn(30));
window.addEventListener("touchstart", () => spawn(30));

// White connection lines
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = dx * dx + dy * dy;

            if (dist < 7000) {
                ctx.strokeStyle = "rgba(255,255,255,0.15)";
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animate
function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)"; // qora fon
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0 && p.size > 0.3);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

animate();

// Resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
