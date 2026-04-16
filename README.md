# Monish Saravanan — Portfolio

Personal portfolio website built from scratch. Live at [monish-portfolio-ten.vercel.app](https://monish-portfolio-ten.vercel.app).

---

## Stack

Pure HTML, CSS, and JavaScript. No frameworks, no build tools, no dependencies. Three files.

| File | Purpose |
|------|---------|
| `index.html` | Page structure and content |
| `style.css` | All styling and responsive layout |
| `script.js` | Animations, visitor counter, nav behaviour |

---

## Design

Inspired by Apple's design language.

- **Background:** `#ffffff` / `#f5f5f7` (alternating sections)
- **Text:** `#1d1d1f`
- **Accent:** `#0071e3`
- **Font:** `-apple-system, BlinkMacSystemFont, Inter` — uses SF Pro on Apple devices natively
- **Dark mode:** Follows system preference via `prefers-color-scheme`. Apple dark palette (`#000000` bg, `#0a84ff` accent)
- No gradients, no glassmorphism, no decorative animations

---

## Features

### Animations
- **Scroll fade-in** — every section fades up as it enters the viewport, once
- **Stats counter** — EcoScan numbers count up from zero on scroll (ease-out cubic)
- **Smooth progress bar** — fills as you scroll, uses `requestAnimationFrame` lerp instead of CSS transition
- **Back-to-top button** — appears after 400px scroll, fades in/out
- **Active nav highlight** — current section link turns accent blue with underline
- **Nav border on scroll** — underline appears only after scrolling past the hero

### Content
- Hero with circular profile photo, eyebrow text, subtitle, CTA buttons
- About section with bio and education timeline
- Three project deep-dives: EcoScan, Image Steganography, Email Spam Detection
- EcoScan has real stats pulled from the research paper (10,000+ images, 6 classes, 4.9% class imbalance)
- Image Steganography is a **Scopus-indexed published paper** (ACT 2025) — card shows real results: 38.2 dB PSNR, 0.95 SSIM, 92% retrieval accuracy post-compression, <30% steganalysis detection rate
- Skills grid (Programming, ML, Tools, Web)
- Achievements and Certifications
- Contact with email, WhatsApp, GitHub, LinkedIn, Instagram

### Infrastructure
- **Visitor counter** — [counterapi.dev](https://counterapi.dev), free, no account needed
- **Favicon** — SVG + PNG + apple-touch-icon, dark `#1d1d1f` background with white M monogram
- **Open Graph** — custom 1200×630 preview image for WhatsApp, LinkedIn, iMessage shares
- **Responsive** — breakpoints at 1024px, 768px, 600px, 420px

---

## Hosting

Deployed on [Vercel](https://vercel.com) (free). Connected to this GitHub repo — every push to `main` auto-deploys in ~10 seconds.

Previously also deployed on GitHub Pages at [saravmonish.github.io](https://saravmonish.github.io).

---

## Making Changes

```bash
cd /Users/sarav/personal/portfolio

# Edit files, then:
git add .
git commit -m "describe your change"
git push
# Vercel auto-deploys from here
```

---

## Pending

- Resume download button (CV update in progress)
- Copy email to clipboard on click
