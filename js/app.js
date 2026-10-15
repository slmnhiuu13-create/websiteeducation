/**
 * =========================================================
 * TJKT EDUCATION - MAIN APPLICATION INITIALIZER
 * Manages sticky navbar, mobile menu, scroll-to-top, preloader, and animations.
 * =========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initScrollToTop();
  initTypingEffect();
});

/**
 * Handles Preloader fade out.
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden-preloader');
    }, 600);
  }
}

/**
 * Mobile Navigation Drawer Toggle & Active Nav Links
 */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Highlight active link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('text-cyan-400', 'font-bold');
      link.classList.remove('text-slate-300');
    }
  });
}

/**
 * Scroll To Top Button
 */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show-btn');
    } else {
      scrollBtn.classList.remove('show-btn');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Typing Effect for Subheader (Hero Section)
 */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const words = [
    "OSI 7 Layer & Subnetting IPv4",
    "Kabel UTP Straight & Crossover",
    "Fullstack Web: React, Node & Laravel",
    "Install OS Windows 10/11 & Linux Ubuntu",
    "Virtual Machine & Dual Boot Setup"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}
