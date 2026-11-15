// 問い合わせフォーム: 入力を確かめて、Supabase の関数 contact へ送る (送信先のメールアドレスは関数の側にだけある)。
const ENDPOINT = "https://oxarpfyaivonsekqwwdq.supabase.co/functions/v1/contact";
const opened = Date.now();
const form = document.getElementById("contact");
const status = document.getElementById("status");
const button = form.querySelector("button[type=submit]");
const MESSAGES = {
  email: "メールアドレスを確かめてください。",
  message: "お問い合わせ内容を入力してください（4000文字まで）。",
  name: "お名前を確かめてください。",
  links: "リンクが多すぎます。5つまでにしてください。",
  too_many: "続けて送られています。少し時間をおいてから、もう一度お送りください。",
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (button.disabled) return;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  button.disabled = true;
  status.className = "status";
  status.textContent = "送信しています…";
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, elapsed: Date.now() - opened }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok) {
      form.reset();
      status.className = "status ok";
      status.textContent = "お問い合わせを受け付けました。返信まで、しばらくお待ちください。";
      return;
    }
    status.className = "status error";
    status.textContent = MESSAGES[body.error] || "送信できませんでした。時間をおいて、もう一度お試しください。";
  } catch {
    status.className = "status error";
    status.textContent = "送信できませんでした。通信を確かめて、もう一度お試しください。";
  } finally {
    button.disabled = false;
  }
});
