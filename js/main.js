/**
 * FAME ADVERTISING COMPANY — CORE INTERACTIVE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initRoiEstimator();
  initPortfolioFilter();
  initAccordions();
  initCareersModal();
  initForms();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('svg, i');
      if (navLinks.classList.contains('open')) {
        menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // Active page highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. LIVE STATS COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initCounters() {
  const statElements = document.querySelectorAll('.stat-count');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800; // ms
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  statElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   3. INTERACTIVE ROI & CAMPAIGN ESTIMATOR
   -------------------------------------------------------------------------- */
function initRoiEstimator() {
  const budgetSlider = document.getElementById('budgetRange');
  const budgetValueDisplay = document.getElementById('budgetValue');
  const reachDisplay = document.getElementById('estReach');
  const leadsDisplay = document.getElementById('estLeads');
  const roasDisplay = document.getElementById('estRoas');
  const revenueDisplay = document.getElementById('estRevenue');

  if (!budgetSlider) return;

  const updateCalculations = () => {
    const budget = parseInt(budgetSlider.value, 10);
    budgetValueDisplay.textContent = `$${budget.toLocaleString()}`;

    // Industry benchmarks for FAME full-funnel model
    const cpm = 9.5; // $9.50 per 1k impressions
    const estImpressions = Math.floor((budget / cpm) * 1000);
    const estLeads = Math.floor(budget * 0.045);
    const avgOrderValue = 180;
    const estConversionRate = 0.075;
    const estRevenue = Math.floor(estLeads * avgOrderValue * (1 + estConversionRate));
    const roas = (estRevenue / budget).toFixed(1);

    if (reachDisplay) reachDisplay.textContent = `${(estImpressions / 1000).toFixed(0)}k+ Impressions`;
    if (leadsDisplay) leadsDisplay.textContent = `${estLeads.toLocaleString()}+ High-Intent Leads`;
    if (roasDisplay) roasDisplay.textContent = `${roas}x Est. ROAS`;
    if (revenueDisplay) revenueDisplay.textContent = `$${estRevenue.toLocaleString()}`;
  };

  budgetSlider.addEventListener('input', updateCalculations);
  updateCalculations();
}

/* --------------------------------------------------------------------------
   4. PORTFOLIO CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. ACCORDIONS (FAQ)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all other items in the same accordion group
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        });
      }

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        body.style.maxHeight = null;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. CAREERS QUICK APPLICATION MODAL
   -------------------------------------------------------------------------- */
function initCareersModal() {
  const modal = document.getElementById('careersModal');
  const openBtns = document.querySelectorAll('.open-apply-modal');
  const closeBtn = document.querySelector('.modal-close');
  const jobTitleInput = document.getElementById('modalJobTitle');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const jobTitle = btn.getAttribute('data-job-title') || 'General Application';
      if (jobTitleInput) jobTitleInput.value = jobTitle;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* --------------------------------------------------------------------------
   7. FORM VALIDATION & NOTIFICATION TOASTS
   -------------------------------------------------------------------------- */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  const applyForm = document.getElementById('applyForm');

  const showToast = (message, isSuccess = true) => {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: ${isSuccess ? 'linear-gradient(135deg, #1F31A4, #FB8500)' : '#e63946'};
      color: #FFFFFF;
      padding: 1rem 1.75rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
      font-weight: 600;
      font-size: 0.95rem;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 350);
    }, 4500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting Brief...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('🚀 Thank you! Your strategic brief has been received. Our directors will contact you within 24 hours.');
      }, 1200);
    });
  }

  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast('✨ Subscribed! Welcome to FAME Insights.');
        input.value = '';
      }
    });
  });

  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('careersModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      applyForm.reset();
      showToast('🎉 Application submitted successfully! Our talent team will review your profile.');
    });
  }
}
