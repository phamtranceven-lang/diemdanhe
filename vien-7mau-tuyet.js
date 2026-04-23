(function () {
  if (window.__VIEN_7MAU_TUYET__) return;
  window.__VIEN_7MAU_TUYET__ = true;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --v7-border-size: 2px;
      --v7-z-border: 9998;
      --v7-z-snow: 9997;
    }

    .v7-border {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: var(--v7-z-border);
    }

    .v7-border::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: var(--v7-border-size);
      pointer-events: none;

      background: linear-gradient(
        90deg,
        #ff0000 0%,
        #ff7a00 14.28%,
        #ffd400 28.56%,
        #00d95f 42.84%,
        #00cfff 57.12%,
        #2f6bff 71.40%,
        #a100ff 85.68%,
        #ff0000 100%
      );
      background-size: 300% 300%;
      animation: v7BorderMove 6s linear infinite;

      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
    }

    .v7-snow {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: var(--v7-z-snow);
      background: transparent !important;
    }

    @keyframes v7BorderMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }

    @media (max-width: 768px) {
      :root {
        --v7-border-size: 2px;
      }
    }
  `;
  document.head.appendChild(style);

  const border = document.createElement("div");
  border.className = "v7-border";
  document.body.appendChild(border);

  const canvas = document.createElement("canvas");
  canvas.className = "v7-snow";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let flakes = [];

  const CONFIG = {
    desktopCount: 65,
    mobileCount: 35,
    minSize: 0.8,
    maxSize: 2.6,
    minSpeed: 0.2,
    maxSpeed: 0.85,
    drift: 0.2
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlake(initial = false) {
    return {
      x: rand(0, width),
      y: initial ? rand(0, height) : rand(-20, -5),
      r: rand(CONFIG.minSize, CONFIG.maxSize),
      vy: rand(CONFIG.minSpeed, CONFIG.maxSpeed),
      vx: rand(-0.1, 0.1),
      alpha: rand(0.18, 0.75),
      swing: rand(0.002, 0.01),
      phase: rand(0, Math.PI * 2)
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width <= 768 ? CONFIG.mobileCount : CONFIG.desktopCount;
    flakes = Array.from({ length: count }, () => createFlake(true));
  }

  function update() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.phase + f.y * f.swing) * CONFIG.drift;

      if (f.y > height + 10 || f.x < -10 || f.x > width + 10) {
        flakes[i] = createFlake(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.fill();
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize, { passive: true });
})(); 
