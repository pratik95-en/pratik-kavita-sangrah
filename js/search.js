// ===== SEARCH.JS - Fuzzy Search with Fuse.js =====

// Roman to Nepali basic mapping
const ROMAN_MAP = {
  'ka':'क','kha':'ख','ga':'ग','gha':'घ','ca':'च','cha':'च',
  'ja':'ज','jha':'झ','ta':'त','tha':'थ','da':'द','dha':'ध',
  'na':'न','pa':'प','pha':'फ','ba':'ब','bha':'भ','ma':'म',
  'ya':'य','ra':'र','la':'ल','wa':'व','sa':'स','ha':'ह',
  'ko':'को','ka':'का','ki':'कि','ku':'कु','ke':'के',
  'mero':'मेरो','desh':'देश','maya':'माया','aama':'आमा',
  'kavita':'कविता','lekh':'लेख','gazal':'गजल',
  'prakriti':'प्रकृति','prem':'प्रेम','man':'मन',
  'jivan':'जीवन','dukha':'दुःख','sukha':'सुख',
  'raat':'रात','din':'दिन','phul':'फूल',
  'nadi':'नदी','pahad':'पहाड','akash':'आकाश',
};

function romanToNepali(text) {
  let result = text.toLowerCase();
  // लामो words पहिले replace गर्ने
  const sorted = Object.keys(ROMAN_MAP).sort((a,b) => b.length - a.length);
  for (const key of sorted) {
    result = result.replaceAll(key, ROMAN_MAP[key]);
  }
  return result;
}

document.addEventListener('DOMContentLoaded', () => {
  // Fuse.js setup — कुन fields मा खोज्ने र sensitivity
  const fuse = new Fuse(KAVITA_DATA, {
    keys: [
      { name: 'title',   weight: 0.5 },
      { name: 'content', weight: 0.3 },
      { name: 'tags',    weight: 0.15 },
      { name: 'category',weight: 0.05 },
    ],
    threshold: 0.4,      // 0 = exact, 1 = सबै — 0.4 राम्रो balance
    includeScore: true,
    minMatchCharLength: 1,
    ignoreLocation: true,
  });

  const toggleBtn  = document.getElementById('searchToggleBtn');
  const wrap       = document.getElementById('searchBarWrap');
  const input      = document.getElementById('searchInput');
  const closeBtn   = document.getElementById('searchClose');
  const results    = document.getElementById('searchResults');

  toggleBtn.addEventListener('click', () => {
    wrap.classList.add('open');
    setTimeout(() => input.focus(), 200);
  });

  closeBtn.addEventListener('click', closeSearch);

  input.addEventListener('input', () => {
    const raw = input.value.trim();
    if (!raw) { results.innerHTML = ''; return; }

    // Roman typing detect गरेर nepali मा convert
    const query = /^[a-zA-Z\s]+$/.test(raw) ? romanToNepali(raw) : raw;

    doSearch(query, raw, fuse);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
  });

  function closeSearch() {
    wrap.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  }
  window.closeSearch = closeSearch;
});

function doSearch(query, originalQuery, fuse) {
  const results = document.getElementById('searchResults');

  // Fuse.js search
  const found = fuse.search(query);

  // Exact tag match पनि थप्ने
  const tagMatches = KAVITA_DATA.filter(p =>
    p.tags.some(t => t.includes(query) || t.includes(originalQuery))
  );

  // Merge — duplicate हटाउने
  const merged = [...found.map(r => r.item)];
  tagMatches.forEach(p => {
    if (!merged.find(m => m.id === p.id)) merged.push(p);
  });

  if (merged.length === 0) {
    results.innerHTML = `
      <div class="search-no-result">
        🔍 "<strong>${originalQuery}</strong>" भेटिएन<br/>
        <span style="font-size:12px;opacity:0.7;">अर्को शब्द प्रयास गर्नुस्</span>
      </div>`;
    return;
  }

  results.innerHTML = merged.map(p => `
    <div class="search-result-item" onclick="closeSearch(); openPoem('${p.id}')">
      <div class="search-result-cover" style="
        background:linear-gradient(135deg,#1a2744,#e8690a);
        display:flex;align-items:center;justify-content:center;
        font-size:24px;border-radius:6px;
        width:44px;height:60px;flex-shrink:0;">
        ${p.cover
          ? `<img src="${p.cover}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;"/>`
          : p.coverEmoji}
      </div>
      <div class="search-result-info">
        <div class="title">${p.title}</div>
        <div class="meta">${getCategoryLabel(p.category)} • ${p.readTime}</div>
        <div class="meta">${p.tags.map(t => '#'+t).join(' ')}</div>
      </div>
    </div>
  `).join('');
}
