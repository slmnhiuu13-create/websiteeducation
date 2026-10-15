/**
 * =========================================================
 * TJKT EDUCATION - DARK MODE MANAGER
 * Manages theme state (Light/Dark) via localStorage.
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
});

/**
 * Initializes Dark Mode setting from localStorage or system preference.
 */
function initDarkMode() {
  const savedTheme = localStorage.getItem('tjkt_theme');
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateToggleIcons(true);
  } else {
    document.body.classList.remove('light-mode');
    updateToggleIcons(false);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleDarkMode();
    });
  });
}

/**
 * Toggles theme between Light and Dark mode.
 */
function toggleDarkMode() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('tjkt_theme', isLight ? 'light' : 'dark');
  updateToggleIcons(isLight);
}

/**
 * Updates icon visuals on theme toggle buttons.
 * @param {boolean} isLight 
 */
function updateToggleIcons(isLight) {
  const toggleIcons = document.querySelectorAll('.theme-toggle-icon');
  toggleIcons.forEach(icon => {
    if (isLight) {
      icon.className = 'fa-solid fa-sun text-amber-400 theme-toggle-icon';
    } else {
      icon.className = 'fa-solid fa-moon text-cyan-400 theme-toggle-icon';
    }
  });
}
