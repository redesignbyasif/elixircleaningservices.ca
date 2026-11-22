# Elixir Cleaning Services — Premium Homepage Concept

A custom-designed, mobile-first concept homepage for **Elixir Cleaning Services**, a husband-and-wife
commercial cleaning and short-term rental (Airbnb) turnover team based in Fergus, Ontario, serving
Wellington County.

Live source site: <https://elixircleaningservices.ca/>

> **Design concept / demo.** This build is marked `noindex, nofollow` so it never competes with the
> business's live website in search results.

---

## What is in this repository

| Path | Purpose |
| --- | --- |
| `index.html` | The complete homepage (semantic HTML5) |
| `css/style.css` | All styling — design tokens, layout, components, responsive rules |
| `js/script.js` | Navigation, drawer, accordion, scroll reveals, quote-to-email helper |
| `assets/images/` | Optimised WebP + JPEG photography (hero, services, details) |
| `assets/logo/` | Emblem, favicon (SVG/PNG), Apple touch icon, social share cover |
| `assets/fonts/` | Self-hosted Fraunces (display) + Manrope (UI) — OFL licensed |
| `.nojekyll` | Tells GitHub Pages to serve the folder as-is |

No build step, no dependencies, no backend. Everything is static and GitHub Pages ready.

---

## Brand & design system

**Direction:** *Editorial hospitality.* A boutique-hotel feel rather than a generic cleaning template:
warm paper tones, brass hairlines, deep forest green, and a large Fraunces serif used editorially.

| Token | Value | Use |
| --- | --- | --- |
| `--forest` | `#1B3B2E` | Brand green, buttons, dark sections |
| `--forest-deep` / `--forest-ink` | `#122A21` / `#0B1A14` | Section depth, footer |
| `--cream` | `#F7F2E8` | Page canvas |
| `--cream-2` | `#EFE6D6` | Contrast band |
| `--porcelain` | `#FFFCF6` | Cards, light sections |
| `--brass` | `#B08D57` | Emblem, rules, accents |
| `--brass-ink` | `#7F5F2C` | Small brass text (AA contrast) |
| `--brass-light` | `#D8B984` | Brass on dark backgrounds |
| `--ink` / `--stone` | `#14241C` / `#5C5E57` | Primary / secondary text |

**Type:** Fraunces Variable (headlines, italic accents), Manrope Variable (body, UI, labels).
Both are self-hosted from `assets/fonts` — no third-party requests, no font flash.

**Iconography:** a single inline SVG sprite, 1.6px stroke, consistent 24px grid. No emoji.

**Emblem:** the wordmark and emblem were rebuilt as crisp vector shapes so the identity stays sharp at
every size (favicon → hero). The original raster logo from the live site was not redistributable into
this static build, so the mark uses the same name, green and brass palette.

---

## Homepage sections

1. Sticky header with shrinking state, desktop nav, phone, quote CTA
2. Signature hero — headline, service promise, dual CTA, credibility strip, review badge
3. Credentials band (insured, 24/7, same-day, Health Canada approved disinfectants)
4. About — husband-and-wife story, property-specific care, inventory reporting
5. Services — turnovers (from $50), commercial cleaning, custom & luxury packages
6. The turnover standard — 12-point checklist and starting price
7. Why Elixir — four pillars on forest green
8. Four-step process
9. Genuine host review (Nicole, Airbnb owner, Fergus)
10. Service areas — Fergus, Elora, Guelph, Kitchener, Waterloo, Wellington County
11. FAQ accordion
12. Quote section with contact details and an email-draft form
13. Footer with contact information and navigation
14. Floating actions — mobile dock (Call / Quote) and desktop floating pill

All copy is drawn from the existing website (services, process, pricing, testimonial, contact
details). Nothing is invented; no fake reviews, no placeholder phone numbers.

---

## Interactions

- Mobile drawer: focus trap, `Escape` to close, scroll lock, closes on link choice, auto-closes on resize
- Accordion: one panel at a time, accurate `aria-expanded`, animated with grid rows
- Reveal-on-scroll with `IntersectionObserver`, disabled for `prefers-reduced-motion`
- Active-section highlighting in the desktop nav
- Sticky header state + floating actions appearing after scroll
- Quote form validates the fields and **opens the visitor's own email app** with a pre-filled draft.
  It does not pretend to send anything — there is no backend, and it says so.

---

## Responsive approach

Mobile-first, tested by design at **360, 390, 430, 768, 1024, 1280 and 1440 px**.

- Base styles target small phones; enhancements are added at 480 / 600 / 760 / 900 / 1000 / 1200 / 1280 / 1440
- Navigation switches to the full desktop bar at 1000px; the drawer is removed from layout above that
- Hero stacks copy → image on phones, with a distinct crop (`object-position`) for each breakpoint
- Mobile action dock respects `env(safe-area-inset-bottom)` and the body reserves matching space,
  so it never covers footer content
- No horizontal overflow: `overflow-x: clip`, min-width-0 grid tracks, wrapping type and `word-break`
  on long emails
- Touch targets ≥ 44px; body copy ≥ 15px; contrast ratios AA or better

---

## Local development

```bash
# any static server works
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying to GitHub Pages

1. Push to the branch you want to publish.
2. In **Settings → Pages**, set **Source: Deploy from a branch**, pick the branch and **/ (root)**.
3. The site is served from `index.html`; `.nojekyll` keeps folders such as `assets/` untouched.

All asset paths are relative, so the site also works from a project sub-path
(`https://<user>.github.io/<repo>/`).

---

## Credits & licensing

- Fonts: [Fraunces](https://github.com/undercasetype/Fraunces) and [Manrope](https://github.com/sharanda/manrope),
  SIL Open Font License 1.1 (licence texts in `assets/fonts/`), self-hosted via Fontsource packages.
- Photography: purpose-generated, brand-consistent imagery for this concept (branded uniforms, brass
  and cream palette). These are conceptual visuals, not photographs of the business's own projects or
  staff, and should be replaced with real job photography before launch where available.
- Do not copy this concept's imagery into the live website without that replacement.
