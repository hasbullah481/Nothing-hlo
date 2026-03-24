const DAILY_GEMS = 500;
const QUESTION_COST = 100;
const STORAGE_KEY = "gemsite-wallet";

const walletEl = document.getElementById("wallet");
const promptEl = document.getElementById("prompt");
const buttonEl = document.getElementById("buildButton");
const errorEl = document.getElementById("error");
const previewEl = document.getElementById("preview");
const codeOutputEl = document.getElementById("codeOutput");

function todayStamp() {
  return new Date().toISOString().split("T")[0];
}

function getWallet() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const today = todayStamp();

  if (!saved) {
    const starterWallet = { date: today, gems: DAILY_GEMS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterWallet));
    return starterWallet;
  }

  const parsed = JSON.parse(saved);

  if (parsed.date !== today) {
    const refreshedWallet = { date: today, gems: DAILY_GEMS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshedWallet));
    return refreshedWallet;
  }

  return parsed;
}

function setWallet(nextWallet) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextWallet));
  renderWallet(nextWallet);
}

function renderWallet(wallet) {
  walletEl.textContent = `You have ${wallet.gems} gems. Daily refill: ${DAILY_GEMS} gems on ${wallet.date}.`;
  buttonEl.disabled = wallet.gems < QUESTION_COST;
}

function pickPalette(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes("bakery") || lower.includes("coffee") || lower.includes("restaurant")) {
    return ["#f6f1e8", "#4c3228", "#d17b49", "#fffaf3"];
  }

  if (lower.includes("tech") || lower.includes("saas") || lower.includes("startup")) {
    return ["#0f172a", "#e2e8f0", "#38bdf8", "#111827"];
  }

  if (lower.includes("portfolio") || lower.includes("designer")) {
    return ["#faf5ff", "#3b0764", "#c084fc", "#ffffff"];
  }

  return ["#f0f4ff", "#1e293b", "#4f46e5", "#ffffff"];
}

function generateWebsiteHTML(prompt) {
  const [bg, text, accent, card] = pickPalette(prompt);
  const safePrompt = prompt.replace(/[<>]/g, "");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>AI Generated Site</title>
    <style>
      body {
        margin: 0;
        font-family: Inter, Arial, sans-serif;
        background: ${bg};
        color: ${text};
      }
      .hero {
        padding: 56px 20px;
        text-align: center;
        background: linear-gradient(130deg, ${accent}, ${card});
      }
      .hero h1 {
        margin: 0;
        font-size: 2.2rem;
      }
      .hero p {
        max-width: 760px;
        margin: 12px auto 0;
      }
      .content {
        padding: 20px;
        max-width: 960px;
        margin: 0 auto;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
      }
      .card {
        background: ${card};
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }
      .cta {
        display: inline-block;
        margin-top: 16px;
        text-decoration: none;
        background: ${accent};
        color: white;
        padding: 10px 14px;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <header class="hero">
      <h1>${safePrompt || "Your New Website"}</h1>
      <p>
        This website was generated from your prompt. Keep asking questions to refine
        sections, style, and content.
      </p>
      <a class="cta" href="#">Get Started</a>
    </header>

    <main class="content">
      <h2>Suggested Sections</h2>
      <div class="card-grid">
        <article class="card"><h3>About</h3><p>Tell visitors your story.</p></article>
        <article class="card"><h3>Services</h3><p>Describe what you offer.</p></article>
        <article class="card"><h3>Testimonials</h3><p>Build trust with social proof.</p></article>
        <article class="card"><h3>Contact</h3><p>Make it easy to connect.</p></article>
      </div>
    </main>
  </body>
</html>`;
}

buttonEl.addEventListener("click", () => {
  const prompt = promptEl.value.trim();
  const wallet = getWallet();

  errorEl.textContent = "";

  if (!prompt) {
    errorEl.textContent = "Please describe the website you want to build.";
    return;
  }

  if (wallet.gems < QUESTION_COST) {
    errorEl.textContent = "You need at least 100 gems for each question.";
    renderWallet(wallet);
    return;
  }

  const updatedWallet = {
    ...wallet,
    gems: wallet.gems - QUESTION_COST,
  };
  setWallet(updatedWallet);

  const html = generateWebsiteHTML(prompt);
  previewEl.srcdoc = html;
  codeOutputEl.textContent = html;
});

renderWallet(getWallet());
