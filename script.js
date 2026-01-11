const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const isMobile = window.innerWidth < 768;

const MAX_PARTICLES = isMobile ? 80 : 150;
const GRAVITY = 0.15;
const FPS = 30;
let lastTime = 0;

let particles = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.size = Math.random() * 2 + 1;
    this.life = 1;
  }

  update() {
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.015;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
  }
}

function spawn(count) {
  for (let i = 0; i < count; i++) {
    if (particles.length < MAX_PARTICLES) {
      particles.push(new Particle(pointer.x, pointer.y));
    }
  }
}

window.addEventListener("mousemove", e => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  spawn(1);
});

window.addEventListener("touchmove", e => {
  e.preventDefault();
  pointer.x = e.touches[0].clientX;
  pointer.y = e.touches[0].clientY;
  spawn(1);
}, { passive: false });

function connectParticles() {
  const maxDist = isMobile ? 60 : 100;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = dx * dx + dy * dy;

      if (dist < maxDist * maxDist) {
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

function animate(time) {
  if (time - lastTime < 1000 / FPS) {
    requestAnimationFrame(animate);
    return;
  }
  lastTime = time;

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles = particles.filter(p => p.life > 0);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();

  requestAnimationFrame(animate);
}

animate(0);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
