/**
 * =========================================================
 * TJKT EDUCATION - SEARCH ENGINE
 * Real-time instant search across TJKT, RPL, and OS Tutorials.
 * =========================================================
 */

let allSearchData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadSearchData();
  initSearchUI();
});

/**
 * Loads JSON data for search index.
 */
async function loadSearchData() {
  try {
    const res = await fetch('data/materi.json');
    const data = await res.json();
    
    allSearchData = [
      ...data.tjkt.map(item => ({ ...item, type: 'TJKT', link: `tjkt.html#${item.id}` })),
      ...data.rpl.map(item => ({ ...item, type: 'RPL', link: `rpl.html#${item.id}` })),
      ...data.os.map(item => ({ ...item, type: 'Tutorial OS', link: `os.html#${item.id}` }))
    ];
  } catch (err) {
    console.error('Gagal memuat dataset pencarian:', err);
  }
}

/**
 * Binds search input & modal triggers.
 */
function initSearchUI() {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results-container');
  const openBtns = document.querySelectorAll('.trigger-search-btn');
  const closeBtn = document.getElementById('close-search-btn');

  if (!searchModal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.remove('hidden');
      if (searchInput) searchInput.focus();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      searchModal.classList.add('hidden');
    });
  }

  // Close on Backdrop click
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.add('hidden');
    }
  });

  // Input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      renderSearchResults(query, searchResults);
    });
  }
}

/**
 * Renders filtered search results.
 * @param {string} query 
 * @param {HTMLElement} container 
 */
function renderSearchResults(query, container) {
  if (!container) return;

  if (!query) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-sm">
        <i class="fa-solid fa-magnifying-glass text-2xl mb-2 text-slate-600 block"></i>
        Ketik kata kunci untuk mencari materi TJKT, RPL, atau Tutorial OS...
      </div>
    `;
    return;
  }

  const matches = allSearchData.filter(item => {
    return item.title.toLowerCase().includes(query) ||
           (item.summary && item.summary.toLowerCase().includes(query)) ||
           (item.category && item.category.toLowerCase().includes(query));
  });

  if (matches.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-sm">
        <i class="fa-solid fa-folder-open text-2xl mb-2 text-rose-500 block"></i>
        Tidak ditemukan hasil untuk "<span class="text-white">${query}</span>"
      </div>
    `;
    return;
  }

  container.innerHTML = matches.map(item => `
    <a href="${item.link}" onclick="closeSearchModal()" class="block p-4 glass-card glass-card-hover rounded-xl mb-3 group">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">${item.type}</span>
        <span class="text-xs text-slate-400 font-mono">${item.category || ''}</span>
      </div>
      <h4 class="font-bold text-white group-hover:text-cyan-400 transition-colors text-base">${item.title}</h4>
      <p class="text-xs text-slate-300 line-clamp-2 mt-1">${item.summary || (item.steps ? item.steps[0] : '')}</p>
    </a>
  `).join('');
}

function closeSearchModal() {
  const searchModal = document.getElementById('search-modal');
  if (searchModal) searchModal.classList.add('hidden');
}
