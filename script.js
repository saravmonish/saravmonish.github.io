/* ============================================================
   Mobile navigation toggle
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   Scroll progress bar — smooth lerp, no CSS transition needed
   ============================================================ */
const progressBar = document.getElementById('progress-bar');
let currentWidth = 0;
let targetWidth  = 0;

function getScrollPercent() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
}

function tickProgress() {
  // Lerp: ease toward target at 14% per frame — smooth but responsive
  currentWidth += (targetWidth - currentWidth) * 0.14;
  progressBar.style.width = currentWidth + '%';
  requestAnimationFrame(tickProgress);
}

window.addEventListener('scroll', () => {
  targetWidth = getScrollPercent();
}, { passive: true });

tickProgress();

/* ============================================================
   Nav border appears only after scrolling past the hero
   ============================================================ */
const nav = document.getElementById('nav');

/* ============================================================
   Back to top button
   ============================================================ */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   Active nav link — highlights based on scroll position
   ============================================================ */
const sections     = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   Scroll fade-in
   Anything with class .fade-up becomes visible when it enters
   the viewport.
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================================
   Stats counter animation
   Counts up from 0 to the target number when the stat enters
   the viewport. Reads the number from the element's text.
   ============================================================ */
function parseStatValue(text) {
  // Strip non-numeric except dot — e.g. "10,000+" → 10000, "4.9%" → 4.9
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}

function formatStatValue(raw, original) {
  // Re-apply the original prefix/suffix (%, +, commas, etc.)
  const hasComma  = original.includes(',');
  const hasPlus   = original.includes('+');
  const hasPercent= original.includes('%');

  let result = hasComma
    ? Math.round(raw).toLocaleString()
    : raw % 1 !== 0 ? raw.toFixed(1) : String(Math.round(raw));

  if (hasPlus)    result += '+';
  if (hasPercent) result += '%';
  return result;
}

function animateCounter(el) {
  const original = el.textContent.trim();
  const target   = parseStatValue(original);
  if (isNaN(target)) return;

  const duration = 1400; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatStatValue(eased * target, original);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target); // count up once only
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

/* ============================================================
   Visitor counter using CountAPI
   ============================================================ */
async function loadVisitorCount() {
  const heroEl   = document.getElementById('visitor-count');
  const footerEl = document.getElementById('footer-count');

  try {
    const res = await fetch(
      'https://api.counterapi.dev/v1/monishsaravanan/portfolio/up',
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('API unavailable');
    const { count } = await res.json();
    const formatted  = Number(count).toLocaleString();
    heroEl.textContent   = formatted;
    footerEl.textContent = formatted + ' visits';
  } catch {
    heroEl.textContent   = '—';
    footerEl.textContent = '';
  }
}

loadVisitorCount();
