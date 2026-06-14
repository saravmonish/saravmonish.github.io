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
   Visitor counter — live
   Shows the live global total on every load, so every browser
   and device displays the same number. Increments at most once
   per 24h per browser (localStorage dedup) so reloads don't
   inflate the count. Falls back to the last seen value on a
   network error.
   ============================================================ */
async function loadVisitorCount() {
  const heroEl   = document.getElementById('visitor-count');
  const footerEl = document.getElementById('footer-count');

  const render = (n) => {
    const formatted = Number(n).toLocaleString();
    if (heroEl)   heroEl.textContent   = formatted;
    if (footerEl) footerEl.textContent = formatted + ' visits';
  };

  const lastVisit = localStorage.getItem('ms_last_visit');
  const now       = Date.now();
  const oneDay    = 86400000;
  // Count this visit only on the first ever load or >24h since the last.
  const shouldCount = !lastVisit || (now - parseInt(lastVisit)) >= oneDay;

  try {
    // ?peek=1 reads the live total without incrementing; the bare endpoint
    // increments. Both responses carry the current global count.
    const res = await fetch(shouldCount ? '/api/count' : '/api/count?peek=1',
                            { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    const { count } = await res.json();
    if (count == null) throw new Error('no count');
    if (shouldCount) localStorage.setItem('ms_last_visit', String(now));
    localStorage.setItem('ms_cached_count', String(count));
    render(count);
  } catch {
    // Network error — show the last value we saw, else a dash.
    const cachedCount = localStorage.getItem('ms_cached_count');
    if (cachedCount) {
      render(cachedCount);
    } else {
      if (heroEl)   heroEl.textContent   = '—';
      if (footerEl) footerEl.textContent = '';
    }
  }
}

loadVisitorCount();

/* ============================================================
   Live Adelaide clock
   Shows the current local time in Adelaide, ticking every
   second. Automatically switches ACST (UTC+9:30) ↔ ACDT
   (UTC+10:30) when daylight saving is in effect — derived
   from the real offset, so it's always correct.
   ============================================================ */
function updateClock() {
  const now = new Date();

  // 24-hour HH:MM:SS in Adelaide local time
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Australia/Adelaide',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(now);

  // Work out ACST vs ACDT from the actual UTC offset
  const adl = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Adelaide' }));
  const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const zone = Math.round((adl - utc) / 60000) >= 600 ? 'ACDT' : 'ACST';

  const navTime    = document.getElementById('clock-time');
  const footerTime = document.getElementById('footer-time');
  if (navTime)    navTime.textContent    = time;
  if (footerTime) footerTime.textContent = time;
  document.querySelectorAll('.clock-zone').forEach(el => { el.textContent = zone; });
}

updateClock();
setInterval(updateClock, 1000);

/* ============================================================
   Light / dark theme toggle
   By default the theme follows the system. Once the user picks
   a mode, it's stored in localStorage and applied before paint
   by a small inline script in <head> (so there's no flash).
   ============================================================ */
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ms_theme', next); } catch (e) {}
  });
}

/* ============================================================
   "Open to work" split-flap departure board
   Each tile flips forward through the alphabet to land on its
   letter (cascading left→right), then the board cycles to the
   next phrase — like the old airport boards. Honours
   reduced-motion by showing the first phrase statically.
   ============================================================ */
const flapBoard = document.getElementById('flap-board');
if (flapBoard) {
  const CHARS   = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const PHRASES = ['OPEN TO WORK', 'AVAILABLE NOW', 'FOR NEW ROLES'];
  const WIDTH   = 13;
  const NBSP    = ' ';
  const flapReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // centre a phrase within the fixed-width board
  const pad = (s) => {
    s = s.toUpperCase();
    const total = WIDTH - s.length;
    const left  = Math.floor(Math.max(0, total) / 2);
    return ' '.repeat(left) + s + ' '.repeat(Math.max(0, total - left));
  };

  const cells = [];
  for (let i = 0; i < WIDTH; i++) {
    const el = document.createElement('span');
    el.className = 'flap-cell';
    el.textContent = NBSP;
    flapBoard.appendChild(el);
    cells.push({ el, idx: 0, timer: null });
  }

  const show = (cell, idx) => {
    cell.idx = idx;
    const ch = CHARS[idx];
    cell.el.textContent = ch === ' ' ? NBSP : ch;
  };

  if (flapReduced) {
    const t = pad(PHRASES[0]);
    cells.forEach((c, i) => show(c, Math.max(0, CHARS.indexOf(t[i]))));
  } else {
    const flapTo = (c, target, delay) => {
      clearTimeout(c.timer);
      c.timer = setTimeout(function step() {
        if (c.idx === target) {
          c.el.classList.remove('land');
          void c.el.offsetWidth;          // restart the land animation
          c.el.classList.add('land');
          return;
        }
        show(c, (c.idx + 1) % CHARS.length);   // step forward one letter
        c.timer = setTimeout(step, 42);
      }, delay);
    };

    const setPhrase = (text) => {
      const t = pad(text);
      cells.forEach((c, i) => flapTo(c, Math.max(0, CHARS.indexOf(t[i])), i * 45));
    };

    setPhrase(PHRASES[0]);
    let pi = 0;
    setInterval(() => { pi = (pi + 1) % PHRASES.length; setPhrase(PHRASES[pi]); }, 4500);
  }
}

/* ============================================================
   Click the email address to copy it to the clipboard
   Falls back to opening the mail client if clipboard is blocked.
   ============================================================ */
const contactEmail = document.getElementById('contact-email');
if (contactEmail) {
  const originalText = contactEmail.textContent.trim();
  contactEmail.addEventListener('click', (e) => {
    const addr = contactEmail.dataset.email;
    if (!navigator.clipboard) return;   // no clipboard API — let mailto run
    e.preventDefault();
    navigator.clipboard.writeText(addr).then(() => {
      contactEmail.classList.add('copied');
      contactEmail.textContent = 'Copied to clipboard ✓';
      setTimeout(() => {
        contactEmail.classList.remove('copied');
        contactEmail.textContent = originalText;
      }, 1800);
    }).catch(() => { window.location.href = 'mailto:' + addr; });
  });
}
