// 問い合わせフォーム: 入力を確かめて、Supabase の関数 contact へ送る (送信先のメールアドレスは関数の側にだけある)。
// ゲームの設定から開いた時は、URL のアカウントID・ログイン方法・ゲームの版を添える。
const ENDPOINT = "https://oxarpfyaivonsekqwwdq.supabase.co/functions/v1/contact";
const ACCOUNT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const opened = Date.now();
const form = document.getElementById("contact");
const status = document.getElementById("status");
const button = form.querySelector("button[type=submit]");
const hint = document.getElementById("hint");
const occurredRow = document.getElementById("occurred-row");
const MESSAGES = {
  email: "メールアドレスを確かめてください。",
  message: "お問い合わせ内容を入力してください（4000文字まで）。",
  name: "お名前を確かめてください。",
  category: "お問い合わせの種類を選んでください。",
  platform: "遊んでいる環境を選んでください。",
  account: "アカウントIDの形を確かめてください（空でも送れます）。",
  links: "リンクが多すぎます。5つまでにしてください。",
  too_many: "続けて送られています。少し時間をおいてから、もう一度お送りください。",
};
// 種類ごとに、返信の前に聞き返さずに済むよう、書いてほしいことを案内する。
const HINTS = {
  bug: ["何をした時に、どうなりましたか。", "例: 第三章の迷宮で戦闘に勝った後、画面が止まった。何度やっても同じ。\n\n・どの画面で\n・何をした時に\n・どうなったか\n・何度でも起きるか"],
  account: ["記録が見えない・ログインできない時は、最後に遊んだ端末と日時、どの冒険（人業の名前や進んだ章）だったかを書いてください。", "例: きのうiPadで第五章まで進めた記録が、iPhoneでGoogleでログインすると出てこない。"],
  purchase: ["購入したストア・日時と、レシートの注文番号を書いてください。", "例: 11月15日にApp Storeで購入。注文番号 MXXXXXXXXX。第二章が開かない。"],
  howto: ["どこで迷っているか（章・迷宮・画面）を書いてください。", ""],
  idea: ["", ""],
  other: ["", ""],
};
const setHint = () => {
  const [text, example] = HINTS[form.category.value] || ["", ""];
  hint.textContent = text ? text + (form.category.value === "bug" || form.category.value === "account" ? " 画面の写真があれば、返信のメールに添えてお送りください。" : "") : "";
  form.message.placeholder = example;
  occurredRow.hidden = !(form.category.value === "bug" || form.category.value === "account");
};
form.category.addEventListener("change", setHint);
setHint();

// 遊んでいる環境は、ブラウザから見当を付けて先に選んでおく (選び直せる)。
const ua = navigator.userAgent;
form.platform.value = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "ios" : /Android/.test(ua) ? "android" : "pc";

// ゲームから開いた時の添え物
const params = new URLSearchParams(location.search);
const fromGame = params.get("from") === "game";
const account = params.get("account") || "";
if (ACCOUNT_ID.test(account)) form.account.value = account;
const logins = (params.get("login") || "").split(",").filter(Boolean);
if (logins.length === 1) form.login.value = logins[0];
form.version.value = (params.get("version") || "").slice(0, 80);
if (fromGame) {
  document.getElementById("from-game").hidden = false;
  document.getElementById("manual-account").hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (button.disabled) return;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (fromGame && logins.length) data.login = logins.join(",");
  button.disabled = true;
  status.className = "status";
  status.textContent = "送信しています…";
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, occurred: data.occurred ? data.occurred.replace("T", " ") : "", elapsed: Date.now() - opened }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok) {
      const keep = { account: form.account.value, login: form.login.value, version: form.version.value, platform: form.platform.value };
      form.reset();
      Object.assign(form.account, { value: keep.account }); form.login.value = keep.login; form.version.value = keep.version; form.platform.value = keep.platform;
      setHint();
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
