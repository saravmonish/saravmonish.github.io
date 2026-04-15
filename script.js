/* ============================================================
   Mobile navigation toggle
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
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
   Visitor counter
   Uses CountAPI — free, no account needed, persists in cloud.
   Namespace: monishsaravanan | Key: portfolio-2025
   API docs: https://countapi.xyz
   ============================================================ */
async function loadVisitorCount() {
  const heroEl   = document.getElementById('visitor-count');
  const footerEl = document.getElementById('footer-count');

  try {
    // Each page load increments the counter by 1
    const res = await fetch(
      'https://api.countapi.xyz/hit/monishsaravanan/portfolio-2025',
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('API unavailable');

    const { value } = await res.json();
    const formatted  = Number(value).toLocaleString();

    heroEl.textContent   = formatted;
    footerEl.textContent = formatted + ' visits';
  } catch {
    // Silently fall back — don't show broken UI
    heroEl.textContent   = '—';
    footerEl.textContent = '';
  }
}

loadVisitorCount();
