/* ============================================
   प्रतीक कविता संग्रह — main.js
   ============================================ */

// ── Dark Mode ──
const html = document.documentElement;
const themeBtn = document.querySelector('.theme-toggle');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ── Kavita Data ──
const kavitaData = [
  {
    id: 1,
    title: "रातको आकाश",
    preview: "तारा जस्तै टिम्टिमाउँछन् सपनाहरू\nअन्धकारमा पनि उज्यालो खोज्दछु म...",
    tag: "प्रकृति",
    date: "२०८१ चैत्र",
    file: "kavitaharu/raat-ko-aakash.html"
  },
  {
    id: 2,
    title: "माटोको सुगन्ध",
    preview: "वर्षाको पहिलो थोपासँगै\nमाटोले दिन्छ एउटा पुरानो सम्झना...",
    tag: "भावना",
    date: "२०८१ फाल्गुन",
    file: "kavitaharu/mato-ko-sugandha.html"
  },
  {
    id: 3,
    title: "शब्दको नदी",
    preview: "बग्छ शब्दहरूको नदी\nकिनार नछोई बग्दै जान्छ अनन्तमा...",
    tag: "दर्शन",
    date: "२०८१ माघ",
    file: "kavitaharu/shabda-ko-nadi.html"
  },
  {
    id: 4,
    title: "हिमालको छाया",
    preview: "सेतो बाँधले ढाकिएको शिखर\nत्यहाँ बास गर्छन् मेरा सपनाहरू...",
    tag: "मातृभूमि",
    date: "२०८१ पौष",
    file: "kavitaharu/himal-ko-chhaya.html"
  },
  {
    id: 5,
    title: "आमाको हात",
    preview: "ती हातहरूमा छ जीवनको कथा\nझुर्रीहरूमा लेखिएको माया...",
    tag: "भावना",
    date: "२०८० मंसिर",
    file: "kavitaharu/aama-ko-haat.html"
  },
  {
    id: 6,
    title: "समयको पाइला",
    preview: "बित्दै जान्छ समय निरन्तर\nमैले केही समाउन खोजें, केही छुटाएँ...",
    tag: "दर्शन",
    date: "२०८० कार्तिक",
    file: "kavitaharu/samay-ko-paila.html"
  }
];

// ── Render Cards ──
function renderCards(data) {
  const grid = document.getElementById('kavita-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;

  grid.innerHTML = '';

  if (data.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  data.forEach((k, i) => {
    const card = document.createElement('a');
    card.href = k.file;
    card.className = 'kavita-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <span class="kavita-card-num">${String(k.id).padStart(2, '0')}</span>
      <span class="kavita-card-tag">${k.tag}</span>
      <h2 class="kavita-card-title">${k.title}</h2>
      <p class="kavita-card-preview">${k.preview.replace(/\n/g, '<br>')}</p>
      <div class="kavita-card-footer">
        <span>${k.date}</span>
        <span class="kavita-card-arrow">→</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Initial render
renderCards(kavitaData);

// ── Real-time Search ──
const searchInput = document.getElementById('search');
const searchCount = document.getElementById('search-count');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();

    const filtered = kavitaData.filter(k =>
      k.title.toLowerCase().includes(q) ||
      k.preview.toLowerCase().includes(q) ||
      k.tag.toLowerCase().includes(q)
    );

    renderCards(filtered);

    if (q) {
      searchCount.textContent = `${filtered.length} कविता भेटियो "${searchInput.value}" को लागि`;
    } else {
      searchCount.textContent = `जम्मा ${kavitaData.length} कविताहरू`;
    }
  });

  // Show total count on load
  searchCount.textContent = `जम्मा ${kavitaData.length} कविताहरू`;
}

// ── News Ticker (duplicate for seamless loop) ──
const newsTrack = document.querySelector('.news-track');
if (newsTrack) {
  const clone = newsTrack.cloneNode(true);
  newsTrack.parentElement.appendChild(clone);
}

// ── Nav scroll effect ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.boxShadow = '0 4px 30px var(--shadow)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
