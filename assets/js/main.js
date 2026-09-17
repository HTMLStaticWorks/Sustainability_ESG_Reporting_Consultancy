/**
 * VERDANT ESG - MAIN CLIENT CONTROLLER
 * Handles Theme, RTL, Nav Drawer, Animated Counters, Gauges, Steppers, and Validations
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. THEME CONTROLLER (LIGHT / DARK)
     ========================================================================== */
  function initTheme() {
    const savedTheme = localStorage.getItem('verdant_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeToggleIcons(initialTheme);

    const themeBtns = document.querySelectorAll('.js-theme-toggle');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('verdant_theme', newTheme);
        updateThemeToggleIcons(newTheme);
      });
    });
  }

  function updateThemeToggleIcons(theme) {
    document.querySelectorAll('.js-theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
    });
  }

  /* ==========================================================================
     2. RTL CONTROLLER
     ========================================================================== */
  function initRTL() {
    const savedDir = localStorage.getItem('verdant_dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);

    const rtlBtns = document.querySelectorAll('.js-rtl-toggle');
    const updateRTLBtns = (dir) => {
      document.querySelectorAll('.js-rtl-toggle').forEach(btn => {
        btn.textContent = dir.toUpperCase();
      });
    };
    updateRTLBtns(savedDir);

    rtlBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('verdant_dir', newDir);
        updateRTLBtns(newDir);
      });
    });
  }

  /* ==========================================================================
     3. STICKY NAVBAR SCROLL ELEVATION
     ========================================================================== */
  function initNavbar() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     4. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  function initMobileDrawer() {
    const hamburger = document.querySelector('.hamburger-btn');
    const backdrop = document.querySelector('.mobile-drawer-backdrop');
    const closeBtn = document.querySelector('.js-drawer-close');

    if (!hamburger || !backdrop) return;

    function openDrawer() {
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  /* ==========================================================================
     5. ANIMATED NUMBER COUNTERS
     ========================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter'));
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const duration = 1800;
          let startTime = null;

          function updateCounter(time) {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            // Ease-out expo curve
            const current = (progress === 1) ? target : target * (1 - Math.pow(2, -10 * progress));
            el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  /* ==========================================================================
     6. ESG SCORE GAUGE SIMULATOR (HOME 2 HERO)
     ========================================================================== */
  function initScoreGauge() {
    const slider = document.getElementById('esgScoreSlider');
    const scoreVal = document.getElementById('gaugeScoreVal');
    const tierVal = document.getElementById('gaugeTierVal');
    const dialCircle = document.getElementById('gaugeCircle');
    const ratingComment = document.getElementById('gaugeComment');

    if (!slider || !scoreVal || !dialCircle) return;

    // Circumference = 2 * PI * r (r=88 in SVG)
    const circumference = 2 * Math.PI * 88;
    dialCircle.style.strokeDasharray = `${circumference} ${circumference}`;

    function updateGauge(score) {
      scoreVal.textContent = score;
      const offset = circumference - (score / 100) * circumference;
      dialCircle.style.strokeDashoffset = offset;

      let tier = 'AAA';
      let strokeColor = '#10B981'; // Emerald
      let comment = 'Top Decile ESG Performance. Audit-ready compliance for EU CSRD & SEC.';

      if (score >= 88) {
        tier = 'AAA Prime';
        strokeColor = '#10B981';
        comment = 'Top Decile ESG Performance. Audit-ready compliance for EU CSRD & SEC.';
      } else if (score >= 76) {
        tier = 'AA Robust';
        strokeColor = '#34D399';
        comment = 'Strong ESG Governance. Scope 1 & 2 fully compliant, advancing Scope 3.';
      } else if (score >= 60) {
        tier = 'A Moderate';
        strokeColor = '#059669';
        comment = 'Average compliance posture. Carbon disclosures required within 90 days.';
      } else {
        tier = 'BBB Vulnerable';
        strokeColor = '#6EE7B7';
        comment = 'Urgent compliance alert: Risk of supply-chain exclusion & regulatory fines.';
      }

      tierVal.textContent = tier;
      tierVal.style.color = strokeColor;
      dialCircle.style.stroke = strokeColor;
      if (ratingComment) ratingComment.textContent = comment;
    }

    slider.addEventListener('input', (e) => {
      updateGauge(parseInt(e.target.value, 10));
    });

    // Initial run
    updateGauge(parseInt(slider.value, 10));
  }

  /* ==========================================================================
     7. FRAMEWORK STEPPER (HOME 2)
     ========================================================================== */
  function initFrameworkStepper() {
    const buttons = document.querySelectorAll('.js-framework-btn');
    const panels = document.querySelectorAll('.js-framework-panel');
    if (!buttons.length || !panels.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-framework');
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(`panel-${targetId}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     8. CASE STUDY INDUSTRY FILTER TABS (CASE STUDIES)
     ========================================================================== */
  function initCaseStudyFilters() {
    const filterPills = document.querySelectorAll('.js-case-filter');
    const caseCards = document.querySelectorAll('.js-case-card');
    if (!filterPills.length || !caseCards.length) return;

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const category = pill.getAttribute('data-category');
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        caseCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     9. ACCORDIONS (FAQS & SERVICES DEEP-DIVE)
     ========================================================================== */
  function initAccordions() {
    const accordionTriggers = document.querySelectorAll('.js-accordion-trigger');
    accordionTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const panel = trigger.nextElementSibling;

        // Toggle state
        trigger.setAttribute('aria-expanded', !expanded);
        if (panel) {
          panel.style.display = !expanded ? 'block' : 'none';
          const icon = trigger.querySelector('.accordion-icon');
          if (icon) {
            icon.style.transform = !expanded ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        }
      });
    });
  }

  /* ==========================================================================
     10. CLIENT-SIDE FORM VALIDATION
     ========================================================================== */
  function initFormValidation() {
    const forms = document.querySelectorAll('.js-validate-form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
          const val = input.value.trim();
          let fieldValid = true;

          if (!val) {
            fieldValid = false;
          } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) fieldValid = false;
          }

          if (!fieldValid) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            isValid = false;
          } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          }

          input.addEventListener('input', () => {
            if (input.value.trim()) {
              input.classList.remove('is-invalid');
            }
          }, { once: true });
        });

        if (isValid) {
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite; margin-right: 8px;">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10"/>
            </svg> Processing...
          `;

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `✓ Verified &amp; Sent!`;
            submitBtn.classList.remove('btn-primary', 'btn-accent');
            submitBtn.classList.add('btn-success');
            submitBtn.style.backgroundColor = '#059669';
            submitBtn.style.color = '#FFFFFF';

            // Show friendly notification banner
            const alertBox = document.createElement('div');
            alertBox.className = 'alert alert-success';
            alertBox.style.marginTop = '16px';
            alertBox.style.padding = '14px 18px';
            alertBox.style.borderRadius = '8px';
            alertBox.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
            alertBox.style.color = '#0A382C';
            alertBox.style.fontWeight = '600';
            alertBox.style.border = '1px solid #10B981';
            alertBox.innerHTML = `Thank you! Your ESG inquiry has been logged. Our lead auditor will respond within 4 business hours.`;

            form.appendChild(alertBox);
            form.reset();

            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.removeAttribute('style');
            }, 4000);
          }, 900);
        }
      });
    });
  }

  /* ==========================================================================
     11. STANDALONE LOGIN FORM HANDLER
     ========================================================================== */
  function initLoginForm() {
    const loginForm = document.getElementById('clientLoginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPassword');
      let valid = true;

      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!pass.value || pass.value.length < 6) {
        pass.classList.add('is-invalid');
        valid = false;
      } else {
        pass.classList.remove('is-invalid');
      }

      if (valid) {
        const btn = loginForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg> Authenticating Secure Portal...
        `;

        setTimeout(() => {
          // Redirect to Dashboard
          window.location.href = 'dashboard.html';
        }, 800);
      }
    });
  }

  /* ==========================================================================
     INITIALIZATION ON LOAD
     ========================================================================== */
  
  /* ==========================================================================
     SCROLL TO TOP FLOATING BUTTON CONTROLLER
     ========================================================================== */
  function initScrollToTop() {
    let btn = document.getElementById('scrollToTopBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'scrollToTopBtn';
      btn.className = 'scroll-to-top-btn';
      btn.setAttribute('aria-label', 'Scroll to top');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 250) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  
  /* ==========================================================================
     DROPDOWN ACTIVE ITEM HIGHLIGHT CONTROLLER
     ========================================================================== */
  function initDropdownActiveState() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.dropdown-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        item.classList.add('active');
      }
    });
  }

  
  /* ==========================================================================
     MAP HUBS CONTROLLER (CONTACT PAGE)
     ========================================================================== */
  function initMapHubs() {
    const tabs = document.querySelectorAll('.js-map-tab');
    const iframe = document.getElementById('contactMapIframe');
    const title = document.getElementById('hubTitle');
    const address = document.getElementById('hubAddress');
    const email = document.getElementById('hubEmail');
    const phone = document.getElementById('hubPhone');
    const dirBtn = document.getElementById('hubMapDirBtn');
    const overlayTitle = document.getElementById('mapOverlayTitle');
    const badge = document.getElementById('hubTagBadge');

    if (!tabs.length || !iframe) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const name = tab.getAttribute('data-name');
        const addr = tab.getAttribute('data-address');
        const em = tab.getAttribute('data-email');
        const ph = tab.getAttribute('data-phone');

        if (title) title.textContent = name;
        if (address) address.textContent = addr;
        if (email) email.textContent = em;
        if (phone) phone.textContent = ph;
        if (overlayTitle) overlayTitle.textContent = `${name.split(',')[0]} Node: Active Telemetry`;
        if (badge) badge.textContent = name.includes('HQ') ? 'Global Headquarters' : 'Statutory Practice Hub';

        const mapQuery = encodeURIComponent(addr);
        if (iframe) {
          iframe.src = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }
        if (dirBtn) {
          dirBtn.href = `https://maps.google.com/?q=${mapQuery}`;
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMapHubs();
    initDropdownActiveState();
    initScrollToTop();
    initTheme();
    initRTL();
    initNavbar();
    initMobileDrawer();
    initCounters();
    initScoreGauge();
    initFrameworkStepper();
    initCaseStudyFilters();
    initAccordions();
    initFormValidation();
    initLoginForm();
  });

})();
