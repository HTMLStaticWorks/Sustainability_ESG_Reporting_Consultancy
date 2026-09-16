# Verdant ESG — Sustainability &amp; Reporting Consultancy Website Template

A modern, purpose-driven, data-credible multi-page website and client reporting portal template engineered for **ESG (Environmental, Social, Governance) & Sustainability Reporting Consultancies**.

Designed per the **Service-Based Templates (Consulting/Professional Services) + SaaS Dashboard Hybrid** classification.

---

## 🌟 Key Features

### 1. 10 Dedicated Pages
1. **Home (Version 1)** (`index.html`): Full-bleed data/impact headline, interactive 3D Carbon Molecule Canvas simulation, live ESG ticker, 3D tilt stat cards, core expertise, 4-phase timeline, testimonial conversion footer.
2. **Home 2 (Alternate Landing)** (`home-2.html`): Distinct split-screen data hero with an interactive ESG score dial/gauge and simulator slider, cost of non-compliance risk cards, interactive framework explainer stepper (CSRD/GRI/GHG/TCFD), industries served tabs, animated numbers strip, and enterprise vs SME dual CTA.
3. **Services** (`services.html`): 4 comprehensive sections including 3D tilt service cards, deep-dive accordion specifications, 12-week delivery roadmap, and a 3-tier pricing matrix.
4. **Case Studies** (`case-studies.html`): Filterable industry grid, featured spotlight with before/after ESG score data visualization, results-in-numbers ribbon, and client testimonials.
5. **About Us** (`about.html`): Purpose and heritage story, 3D tilt leadership team profile cards, ISO 14064 / GHG Protocol accreditations, and executive advisory briefing CTA.
6. **Contact** (`contact.html`): Client-side validated multi-field inquiry form, global practice hubs (London, Zurich, NY, Singapore), FAQ accordion, and newsletter signup.
7. **Client Login** (`login.html`): Distraction-free standalone authentication screen with 3D gradient backdrop, form validation, and instant simulated handoff to the client portal.
8. **Client Dashboard** (`dashboard.html`): Authenticated portal with collapsible sidebar nav, ESG rating & emissions progress canvas chart (monthly/quarterly toggle), drag-and-drop file ingestion simulator, compliance reports download list, benchmark comparison canvas chart, and billing/invoice ledger.
9. **404 Page** (`404.html`): Custom on-brand "Carbon Offset" page with search bar and quick navigation.
10. **Coming Soon** (`coming-soon.html`): Pre-launch Q4 carbon toolkit announcement with live countdown timer and waitlist form.

---

## 🎨 Visual Design System

- **Primary Color:** Deep Forest Emerald (`#0A382C`, `#115E49`, `#10B981`)
- **Secondary Color:** Slate Governance Charcoal (`#0F1B29`, `#1E293B`)
- **Accent Color:** Warm Amber Gold (`#D97706`, `#F59E0B`)
- **Neutrals:** Soft organic paper off-white (`#F8FAF8`) in Light Mode; Deep Graphite (`#0A110E`, `#111A16`) in Dark Mode.
- **Typography:**
  - Headings: `Outfit` (Google Fonts)
  - Body & Data Tables: `Plus Jakarta Sans` (Google Fonts)
- **3D Interactive Features:**
  - Dynamic cursor-following 3D Tilt Cards with depth shadows and watermark reveal.
  - Interactive HTML5 Canvas carbon lattice/molecule mesh in hero sections.
  - Interactive SVG ESG score gauge with live tier calculations.

---

## 📱 Strict Responsive Breakpoints

Every layout is tested independently across all checkpoints:
- **Mobile:** `< 640px` (Hamburger drawer, single-column cards, 44px+ touch targets)
- **Tablet:** `640px – 1024px` (2-column grids, optimized sidebars)
- **1024px Checkpoint:** (Dedicated layout verification, no squeezed or broken elements)
- **Desktop:** `1024px – 1280px`
- **Large:** `> 1280px` (Max container width 1240px)

---

## 🌓 Dark Mode & Bidirectional (RTL) Support

- **Dark Mode:** Automatic detection of user's system preferences (`prefers-color-scheme`) + manual persistent toggle stored in `localStorage`.
- **RTL Support:** Full right-to-left layout mirror (`dir="rtl"`) with dedicated stylesheet `assets/css/rtl.css`.

---

## 📁 File Structure

```
Sustainability_ESG_Reporting_Consultancy/
├── index.html                  # Home 1 (Full-bleed impact hero)
├── home-2.html                 # Home 2 (Gauge dial & risk matrix)
├── services.html               # Services & packages
├── case-studies.html           # Filterable case studies
├── about.html                  # About & leadership team
├── contact.html                # Validated contact form & FAQs
├── login.html                  # Standalone client login
├── dashboard.html              # Authenticated client portal
├── 404.html                    # On-brand 404 page
├── coming-soon.html            # Pre-launch countdown
├── sitemap.xml                 # Search engine sitemap
├── robots.txt                  # Web crawler rules
├── README.md                   # Documentation
└── assets/
    ├── css/
    │   ├── style.css           # Core design system
    │   ├── dark-mode.css       # Dark theme overrides
    │   └── rtl.css             # Right-to-left styles
    ├── js/
    │   ├── main.js             # Main controller (theme, RTL, validation, gauge)
    │   ├── 3d-effects.js       # 3D tilt engine & canvas simulation
    │   └── dashboard.js        # Dashboard charts & file drag-drop
    └── images/                 # Local high-resolution ESG imagery
```

---

## 🚀 Running Locally

Open any of the `.html` files in your modern web browser, or launch a local HTTP server:

```bash
# Using Python
python -m http.server 8080

# Using Node / npx
npx serve .
```
Navigate to `http://localhost:8080/index.html`.
