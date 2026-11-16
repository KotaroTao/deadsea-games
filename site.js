// 画面に入った段を、静かに浮かび上がらせる。動きを減らす設定や古いブラウザでは何もしない (最初から見えている)。
const items = document.querySelectorAll(".reveal");
if (items.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("shown"));
}

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 扉の火の粉: 灯りから立ちのぼる小さな光。動きを減らす設定・画面の外・隠れたタブでは止める。
const canvas = document.querySelector(".embers");
if (canvas && !calm) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, running = true, visible = true;
  const sparks = [];
  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const spawn = (initial) => ({
    x: Math.random() * w, y: initial ? Math.random() * h : h + 10,
    r: 0.6 + Math.random() * 1.8, vy: 0.25 + Math.random() * 0.7, vx: (Math.random() - 0.5) * 0.3,
    life: 0, max: 260 + Math.random() * 420, hue: 28 + Math.random() * 22, sway: Math.random() * Math.PI * 2,
  });
  resize(); addEventListener("resize", resize);
  const count = () => Math.round(Math.min(70, w / 22));
  for (let i = 0; i < count(); i++) sparks.push(spawn(true));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  document.addEventListener("visibilitychange", () => { running = !document.hidden; });
  const tick = () => {
    requestAnimationFrame(tick);
    if (!running || !visible) return;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < sparks.length; i++) {
      const p = sparks[i];
      p.life++; p.sway += 0.02; p.y -= p.vy; p.x += p.vx + Math.sin(p.sway) * 0.25;
      const t = p.life / p.max, a = Math.sin(Math.PI * Math.min(1, t)) * 0.85;
      if (t >= 1 || p.y < -10) { sparks[i] = spawn(false); continue; }
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${a})`); g.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
    }
  };
  tick();
}

// 物量の数: 画面に入ったら 0 から数え上げる
const counters = document.querySelectorAll(".count[data-to]");
if (counters.length && !calm && "IntersectionObserver" in window) {
  const fmt = (n) => n.toLocaleString("ja-JP");
  counters.forEach((el) => { el.textContent = "0"; });
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target, to = Number(el.dataset.to), t0 = performance.now(), dur = 1800;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - k, 4);
        el.textContent = fmt(Math.round(to * eased));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  counters.forEach((el) => io.observe(el));
}

// 予告編: 縦長の画面 (スマホを縦に持った時) は縦型の動画に替える
const trailer = document.querySelector(".screen video[data-tall]");
if (trailer && matchMedia("(max-aspect-ratio: 4/5)").matches) {
  trailer.querySelector("source").src = trailer.dataset.tall;
  trailer.setAttribute("width", "1080"); trailer.setAttribute("height", "1920");
  if (trailer.dataset.tallPoster) trailer.poster = trailer.dataset.tallPoster;
  trailer.load();
  trailer.closest(".screen").classList.add("tall");
}
