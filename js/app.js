// ===== APP.JS - Main Application Logic =====

let currentFilter = 'all';
let currentTag = null;
let currentPoem = null;
let heroInterval = null;
let heroIndex = 0;
let isEnglish = false;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderTags();
  renderCards();
  startHeroAuto();
  setupTabs();
  setupMenu();
});

// ===== HERO SLIDES =====
function renderHero() {
  const featured = KAVITA_DATA.filter(p => p.featured);
  const slides = featured.length ? featured : KAVITA_DATA.slice(0, 3);
  const container = document.getElementById('heroSlides');
  const dotsContainer = document.getElementById('heroDots');

  container.innerHTML = slides.map((p, i) => `
    <div class="hero-slide" onclick="openPoem('${p.id}')">
      ${p.cover ? `<img src="${p.cover}" class="hero-slide-bg" alt="" />` : ''}
      <div class="hero-slide-info">
        <div class="hero-slide-tag">${getCategoryLabel(p.category)}</div>
        <div class="hero-slide-title">${p.title}</div>
        <div class="hero-slide-btn">${isEnglish ? 'Read Now' : 'पढ्नुस्'}</div>
      </div>
      <div class="hero-slide-cover">${p.cover ? `<img src="${p.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;" />` : p.coverEmoji}</div>
    </div>
  `).join('');

  dotsContainer.innerHTML = slides.map((_, i) =>
    `<div class="hero-dot ${i===0?'active':''}" onclick="goToSlide(${i})"></div>`
  ).join('');
}

function goToSlide(index) {
  const slides = KAVITA_DATA.filter(p => p.featured);
  const total = slides.length || Math.min(KAVITA_DATA.length, 3);
  heroIndex = index;
  document.getElementById('heroSlides').style.transform = `translateX(-${heroIndex * 100}%)`;
  document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === heroIndex));
}

function startHeroAuto() {
  heroInterval = setInterval(() => {
    const featured = KAVITA_DATA.filter(p => p.featured);
    const total = featured.length || Math.min(KAVITA_DATA.length, 3);
    heroIndex = (heroIndex + 1) % total;
    goToSlide(heroIndex);
  }, 4000);
}

// ===== TAGS =====
function renderTags() {
  const allTags = [...new Set(KAVITA_DATA.flatMap(p => p.tags))];
  const wrap = document.getElementById('tagFilterWrap');
  wrap.innerHTML = `<button class="tag-chip active" onclick="filterByTag(null, this)">${isEnglish ? 'All' : 'सबै'}</button>` +
    allTags.map(t => `<button class="tag-chip" onclick="filterByTag('${t}', this)">#${t}</button>`).join('');
}

function filterByTag(tag, btn) {
  currentTag = tag;
  document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderCards();
}

// ===== TABS =====
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      currentTag = null;
      document.querySelectorAll('.tag-chip').forEach(c => c.classList.remove('active'));
      if (document.querySelector('.tag-chip')) document.querySelector('.tag-chip').classList.add('active');
      renderCards();
    });
  });
}

// ===== RENDER CARDS =====
function renderCards() {
  let data = [...KAVITA_DATA];

  // Sort new first
  if (currentFilter === 'new') {
    data.sort((a,b) => new Date(b.date) - new Date(a.date));
  }

  // Filter by category
  if (currentFilter !== 'all' && currentFilter !== 'new') {
    data = data.filter(p => p.category === currentFilter);
  }

  // Filter by tag
  if (currentTag) {
    data = data.filter(p => p.tags.includes(currentTag));
  }

  // Popular = featured first, then by date
  const popular = [...KAVITA_DATA].filter(p => p.featured);
  document.getElementById('popularCards').innerHTML = popular.length
    ? popular.map(p => createCard(p, true)).join('')
    : KAVITA_DATA.slice(0,3).map(p => createCard(p, true)).join('');

  // All cards
  const allContainer = document.getElementById('allCards');
  if (data.length === 0) {
    allContainer.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="icon">📭</div><p>${isEnglish ? 'No works found' : 'कुनै रचना भेटिएन'}</p></div>`;
  } else {
    allContainer.innerHTML = data.map(p => createCard(p, false)).join('');
  }
}

function createCard(poem, isScroll) {
  const saved = isBookmarked(poem.id);
  return `
    <div class="card ${isScroll ? 'card-scroll' : ''}" onclick="openPoem('${poem.id}')">
      <div class="card-cover">
        ${poem.cover ? `<img src="${poem.cover}" style="width:100%;height:100%;object-fit:cover;" alt="" />` : poem.coverEmoji}
      </div>
      <div class="card-body">
        <div class="card-category">${getCategoryLabel(poem.category)}</div>
        <div class="card-title">${poem.title}</div>
        <div class="card-meta">
          <span class="card-read-time">⏱ ${poem.readTime}</span>
          <span class="card-bookmark ${saved ? 'saved' : ''}">${saved ? '🔖' : '🏷️'}</span>
        </div>
      </div>
      <button class="card-read-btn" onclick="event.stopPropagation(); openPoem('${poem.id}')">${isEnglish ? 'Read' : 'पढ्नुस्'}</button>
    </div>
  `;
}

function getCategoryLabel(cat) {
  const map = { kavita: isEnglish ? 'Poem' : 'कविता', lekh: isEnglish ? 'Essay' : 'लेख', gazal: isEnglish ? 'Gazal' : 'गजल' };
  return map[cat] || cat;
}

// ===== OPEN POEM =====
function openPoem(id) {
  const poem = KAVITA_DATA.find(p => p.id === id);
  if (!poem) return;
  currentPoem = poem;

  const saved = isBookmarked(poem.id);
  document.getElementById('bookmarkBtn').textContent = saved ? '🔖' : '🏷️';

  document.getElementById('modalBody').innerHTML = `
    <div class="poem-cover-large">
      ${poem.cover ? `<img src="${poem.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;" />` : poem.coverEmoji}
    </div>
    <h1 class="poem-title-large">${poem.title}</h1>
    <div class="poem-meta-row">
      <span class="poem-meta-badge accent">${getCategoryLabel(poem.category)}</span>
      <span class="poem-meta-badge">⏱ ${poem.readTime}</span>
      <span class="poem-meta-badge">📅 ${formatDate(poem.date)}</span>
    </div>
    <div class="poem-divider"></div>
    <div class="poem-content">${poem.content}</div>
    <div class="poem-tags">
      ${poem.tags.map(t => `<span class="poem-tag" onclick="filterByTagFromModal('${t}')">#${t}</span>`).join('')}
    </div>
  `;

  document.getElementById('poemModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('poemModal').classList.remove('open');
  document.body.style.overflow = '';
  currentPoem = null;
}

function filterByTagFromModal(tag) {
  closeModal();
  currentTag = tag;
  currentFilter = 'all';
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
  renderTags();
  setTimeout(() => {
    const chip = [...document.querySelectorAll('.tag-chip')].find(c => c.textContent === '#' + tag);
    if (chip) { chip.classList.add('active'); }
    renderCards();
  }, 100);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ===== RANDOM POEM =====
function showRandomPoem() {
  closeDropdown();
  const idx = Math.floor(Math.random() * KAVITA_DATA.length);
  openPoem(KAVITA_DATA[idx].id);
}

// ===== SECTION NAV =====
function showSection(section) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  event.currentTarget.classList.add('active');

  if (section === 'bookmarks') showBookmarks();
  if (section === 'home') { closeModal(); closeBookmarkModal(); }
  if (section === 'about') showAbout();
}

function showAbout() {
  document.getElementById('modalBody').innerHTML = `
    <div style="text-align:center; padding: 20px 0;">
      <div style="font-size:60px; margin-bottom:16px;">✍️</div>
      <h2 style="font-family:'Tiro Devanagari Hindi',serif; font-size:24px; margin-bottom:8px;">प्रतीक</h2>
      <p style="color:var(--text2); font-size:14px; line-height:1.8;">
        साहित्यका प्रेमी, कविताका रचयिता।<br/>
        यो संग्रहमा मेरा भावना र विचारहरू छन्।
      </p>
      <div class="poem-divider"></div>
      <p style="color:var(--text2); font-size:13px;">
        📧 आफ्नो विचार पठाउनुस्<br/>
        🌐 GitHub मा पाउनुस्
      </p>
    </div>
  `;
  document.getElementById('poemModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ===== MENU =====
function setupMenu() {
  document.getElementById('menuBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('dropdownMenu').classList.toggle('open');
  });
  document.addEventListener('click', closeDropdown);
  document.getElementById('dropdownMenu').addEventListener('click', e => e.stopPropagation());

  document.getElementById('langToggle').addEventListener('change', function() {
    isEnglish = this.checked;
    renderHero();
    renderTags();
    renderCards();
  });
}

function closeDropdown() {
  document.getElementById('dropdownMenu').classList.remove('open');
}
