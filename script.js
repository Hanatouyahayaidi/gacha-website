const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const canvas = document.querySelector("[data-hero-canvas]");
const ctx = canvas.getContext("2d");

const palette = ["#8f1d2c", "#d6a637", "#167579", "#4f7f47", "#f2eee6"];
let shapes = [];
let width = 0;
let height = 0;
let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  header.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  shapes = Array.from({ length: width < 700 ? 34 : 58 }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 18 + Math.random() * 84,
    color: palette[index % palette.length],
    speed: 0.12 + Math.random() * 0.28,
    angle: Math.random() * Math.PI,
    alpha: 0.24 + Math.random() * 0.28,
  }));
}

function drawBackdrop(time = 0) {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#161b1d");
  gradient.addColorStop(0.55, "#273033");
  gradient.addColorStop(1, "#101415");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  shapes.forEach((shape, index) => {
    const drift = reducedMotion ? 0 : Math.sin(time * shape.speed * 0.001 + index) * 18;
    const x = shape.x + drift;
    const y = shape.y + (reducedMotion ? 0 : Math.cos(time * shape.speed * 0.001 + index) * 14);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(shape.angle + time * 0.00008);
    ctx.globalAlpha = shape.alpha;
    ctx.fillStyle = shape.color;

    if (index % 3 === 0) {
      ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size * 0.62);
    } else if (index % 3 === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -shape.size / 2);
      ctx.lineTo(shape.size / 2, shape.size / 2);
      ctx.lineTo(-shape.size / 2, shape.size / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  });

  ctx.globalAlpha = 0.32;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let x = -80; x < width + 80; x += 84) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + height * 0.45, height);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (!reducedMotion) {
    requestAnimationFrame(drawBackdrop);
  }
}

menuToggle.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    setMenu(false);
  }
});

document.querySelector(".join-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button");
  button.textContent = "Thanks!";
  form.reset();
  window.setTimeout(() => {
    button.textContent = "Send interest";
  }, 1800);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvas();
  drawBackdrop();
});

resizeCanvas();
drawBackdrop();
setHeaderState();
