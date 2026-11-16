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
