/**
 * FAME ADVERTISING COMPANY — CORE INTERACTIVE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollReveals();
  initRoiEstimator();
  initPortfolioFilter();
  initAccordions();
  initCareersModal();
  initForms();
  initCardSliders();
  initHaramLightboxModal();
  initDynamicSignageMarquee();
  initHeroTunnelWayfinding();
});

/* --------------------------------------------------------------------------
   DIRECTIONAL SCROLL REVEALS & ENTRO MASKED TEXT UNVEIL
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-mask, .reveal-from-right, .reveal-from-left, .reveal-from-top, .reveal-from-bottom, .saudi-city-card, .portfolio-card, .service-card');
  if (!revealElements.length) return;

  const revealEl = (el) => {
    el.classList.add('is-revealed');
    el.classList.add('revealed');
  };

  const checkVisibility = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh * 0.95 && rect.bottom >= 0) {
        revealEl(el);
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealEl(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '0px 0px 80px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Run immediate and on scroll
  checkVisibility();
  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility, { passive: true });

  // Safety net to guarantee content is never permanently hidden
  setTimeout(() => {
    revealElements.forEach(el => revealEl(el));
  }, 1600);
}

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  let menuBackdrop = document.getElementById('menuBackdrop');

  if (!menuBackdrop) {
    menuBackdrop = document.createElement('div');
    menuBackdrop.id = 'menuBackdrop';
    menuBackdrop.className = 'menu-backdrop';
    if (header && header.parentNode) {
      header.parentNode.insertBefore(menuBackdrop, header);
    } else {
      document.body.appendChild(menuBackdrop);
    }
  }

  // Sticky header background & hide logo on scroll
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  const openDrawer = () => {
    if (!navLinks) return;
    navLinks.classList.add('open');
    menuBackdrop.classList.add('open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    menuBackdrop.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // Menu toggle button
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close when clicking backdrop
    menuBackdrop.addEventListener('click', closeDrawer);

    // Close when clicking close button inside drawer
    document.querySelectorAll('.drawer-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeDrawer();
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
   4. PORTFOLIO DUAL FILTERING (CITY & CATEGORY)
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  // 1. Projective-style Fullscreen Architectural Grid Filtering
  const projectiveTabs = document.querySelectorAll('.projective-tab-btn');
  const projectiveTiles = document.querySelectorAll('.projective-tile');

  if (projectiveTabs.length && projectiveTiles.length) {
    projectiveTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        projectiveTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filterVal = tab.getAttribute('data-filter');

        projectiveTiles.forEach(tile => {
          const tileCity = (tile.getAttribute('data-city') || '').toLowerCase();
          const tileCategories = (tile.getAttribute('data-category') || '').toLowerCase().split(' ');

          const isMatch = filterVal === 'all' || tileCity === filterVal || tileCategories.includes(filterVal);

          if (isMatch) {
            tile.style.display = 'block';
            setTimeout(() => {
              tile.style.opacity = '1';
              tile.style.transform = 'scale(1)';
            }, 30);
          } else {
            tile.style.opacity = '0';
            tile.style.transform = 'scale(0.97)';
            setTimeout(() => {
              tile.style.display = 'none';
            }, 250);
          }
        });
      });
    });

    // Check URL query param for deep linking (e.g. portfolio.html?city=jeddah)
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    if (cityParam) {
      const targetTab = Array.from(projectiveTabs).find(t => t.getAttribute('data-filter') === cityParam.toLowerCase());
      if (targetTab) {
        targetTab.click();
      }
    }
  }

  // 2. Legacy / Standard card grid support
  const cityBtns = document.querySelectorAll('[data-city-filter]');
  const categoryBtns = document.querySelectorAll('[data-filter]:not(.projective-tab-btn)');
  const subFilterBtns = document.querySelectorAll('[data-sub-filter]');
  const makkahSubFilterWrapper = document.getElementById('makkahSubFilter');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  if (!portfolioItems.length) return;

  let activeCity = 'all';
  let activeCategory = 'all';
  let activeSubCategory = 'all';

  const applyFilters = () => {
    // Show or hide Makkah subfilter group based on activeCity
    if (makkahSubFilterWrapper) {
      if (activeCity === 'makkah' || activeCity === 'all') {
        makkahSubFilterWrapper.style.display = 'flex';
      } else {
        makkahSubFilterWrapper.style.display = 'none';
      }
    }

    portfolioItems.forEach(item => {
      const itemCity = item.getAttribute('data-city') || 'global';
      const itemCategory = item.getAttribute('data-category') || 'all';
      const itemSubcategory = item.getAttribute('data-subcategory') || '';

      const matchCity = (activeCity === 'all') || (itemCity === activeCity);
      const matchCategory = (activeCategory === 'all') || (itemCategory === activeCategory);
      const matchSubCategory = (activeSubCategory === 'all') || (itemSubcategory === activeSubCategory);

      if (matchCity && matchCategory && matchSubCategory) {
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
        }, 250);
      }
    });
  };

  // City filter event listeners
  if (cityBtns.length) {
    cityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCity = btn.getAttribute('data-city-filter');
        activeSubCategory = 'all';
        if (subFilterBtns.length) {
          subFilterBtns.forEach(sb => sb.classList.remove('active'));
          subFilterBtns[0]?.classList.add('active');
        }
        applyFilters();
      });
    });
  }

  // Category filter event listeners
  if (categoryBtns.length) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }

  // Makkah Subcategory filter event listeners
  if (subFilterBtns.length) {
    subFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeSubCategory = btn.getAttribute('data-sub-filter');
        applyFilters();
      });
    });
  }

  // Check URL query param for deep linking (e.g. portfolio.html?city=makkah)
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city');
  if (cityParam && cityBtns.length) {
    const targetCityBtn = Array.from(cityBtns).find(b => b.getAttribute('data-city-filter') === cityParam.toLowerCase());
    if (targetCityBtn) {
      targetCityBtn.click();
    }
  }
}

/* --------------------------------------------------------------------------
   5. ACCORDIONS (FAQ)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header, .hero-arch-item-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all other items in the same accordion group if in standard accordion
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.accordion-body, .hero-arch-body');
          if (otherBody) otherBody.style.maxHeight = null;
        });
      }

      if (!isActive) {
        item.classList.add('active');
        if (body) body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        if (body) body.style.maxHeight = null;
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

/* --------------------------------------------------------------------------
   8. PROJECT GALLERIES (HARAM & GALLERIA HOTEL JEDDAH) CARD SLIDERS & LIGHTBOX
   -------------------------------------------------------------------------- */
const PROJECT_GALLERIES = {
  haram: {
    badge: 'Makkah Mega Project Execution • اللوحات الموسمية والمؤقتة',
    city: 'Makkah',
    link: 'portfolio.html?city=makkah',
    items: [
      {
        img: 'assets/haram-seasonal/haram-abdulaziz-ajyad-gate.jpg',
        tag: 'Courtyard Pillar Totems',
        title: 'King Abdul Aziz Gate (No. 01) & Ajyad Gate (No. 03)',
        desc: 'Directional monolith pillars with compliance and prohibition pictograms in the southern piazza.'
      },
      {
        img: 'assets/haram-seasonal/haram-wheelchairs-bridge-ajyad.jpg',
        tag: 'Expansion & Accessibility Connectors',
        title: 'Wheelchairs Bridge, Escalators & Ajyad Gate (جسر العربات • سلالم كهربائية)',
        desc: 'Bilingual directional monolith with accessibility pictograms, escalator access, and Third Saudi Expansion links.'
      },
      {
        img: 'assets/haram-seasonal/haram-stairs-toilets.jpg',
        tag: 'Facility Access Headers',
        title: 'Stairs 7/B & Female Restrooms Header (سلالم ب/7 • دورات مياه للنساء)',
        desc: 'Color-coded crimson header wayfinding with universal pictograms and bilingual directions.'
      },
      {
        img: 'assets/haram-seasonal/haram-wc-tent-wayfinding.jpg',
        tag: 'Piazza Restroom Wayfinding',
        title: 'Shaded Courtyard Restroom Directionals (دورات مياه • W.C)',
        desc: 'High-visibility directional signage pointing pilgrim flow to subterranean ablution and restroom facilities.'
      },
      {
        img: 'assets/haram-seasonal/haram-salam-gate.jpg',
        tag: 'Trilingual Gate Panels',
        title: 'To As-Salaam Gate (إلى باب السلام • سلام دروازه کی طرف)',
        desc: 'Arabic, English, and Urdu wayfinding installed on architectural gate screens.'
      },
      {
        img: 'assets/haram-seasonal/haram-king-fahd-expansion.jpg',
        tag: 'Expansion Connectors',
        title: 'King Fahd Gate (No. 79) & Third Saudi Expansion (التوسعة السعودية الثالثة)',
        desc: 'High-contrast directional bracket signage linking the historic mosque to new expansion prayer halls.'
      },
      {
        img: 'assets/haram-seasonal/haram-highmast-directional.jpg',
        tag: 'High-Mast Fingerposts',
        title: 'Northern Courtyards & Al-Ghazzah Directionals (منطقة الغزة)',
        desc: 'Multi-tier double-sided fingerboards mounted on courtyard lighting masts with 10 km/h perimeter speed shroud.'
      },
      {
        img: 'assets/haram-seasonal/haram-misfalah-ibrahim-khalil.jpg',
        tag: 'Urban Perimeter Wayfinding',
        title: 'Misfalah District & Ibrahim Al-Khalil Street (حي المسفلة • شارع إبراهيم الخليل)',
        desc: 'Perimeter lamppost street wayfinding guiding pedestrian pilgrim circulation between the piazza and commercial arteries.'
      }
    ]
  },
  galleria: {
    badge: 'Jeddah 5-Star Hospitality • فندق غاليريا جدة',
    city: 'Jeddah',
    link: 'portfolio.html?city=jeddah',
    items: [
      {
        img: 'assets/galleria-hotel-facade.jpg',
        tag: 'Architectural Hotel Facade',
        title: 'The Galleria Hotel Jeddah — Neoclassical Grand Portico & Arched Loggias (فندق ذا جاليريا جدة)',
        desc: 'Iconic 5-star luxury hotel in central Jeddah inspired by Galleria Vittorio Emanuele II in Milan, featuring soaring neoclassical arched porticos, luxury shopping arcade, bespoke room identification suites, and comprehensive interior wayfinding.'
      },
      {
        img: 'assets/galleria hotel/WhatsApp Image 2023-09-18 at 14.38.53.jpg',
        tag: 'Corridor Wayfinding Blades',
        title: 'Suspended Corridor Directional Signage (المصعد • Elevator)',
        desc: 'Precision ceiling-suspended directional blade with brushed bronze finish, Galleria monogram, and laser-etched geometric band for hotel guest corridors.'
      },
      {
        img: 'assets/galleria hotel/IMG-20230925-WA0095.jpg',
        tag: 'Room & Wing Wayfinding',
        title: 'Level 2 Corridor Wayfinding & Room Plaque (2253)',
        desc: 'Tactile room number plaque paired with multi-wing guest room directional indicator, complete with Arabic numerals, English lettering, and ADA/accessibility Braille.'
      },
      {
        img: 'assets/galleria hotel/IMG-20230918-WA0056.jpg',
        tag: 'Luxury Marble Wall Plates',
        title: 'Gentlemen Restroom Architectural Plate (دورات مياه الرجال)',
        desc: 'Bespoke brushed metal restroom identification plate mounted seamlessly on Italian marble wall panelling with 3D embossed Galleria monogram.'
      },
      {
        img: 'assets/galleria hotel/IMG-20230925-WA0070.jpg',
        tag: 'Patterned Wall Identification',
        title: 'Female Restroom Identification Sign (دورات مياه النساء)',
        desc: 'Custom architectural wall plaque featuring laser-cut typography and Arabic calligraphy set against geometric interior wall coverings.'
      },
      {
        img: 'assets/galleria hotel/IMG-20230925-WA0066.jpg',
        tag: 'Hospitality Area Signage',
        title: 'Male Restroom Signage Plate (دورات مياه الرجال • Male Restroom)',
        desc: 'Minimalist luxury metal plaque with bilingual typography and micro-etched heritage pattern border.'
      },
      {
        img: 'assets/galleria hotel/IMG-20230925-WA0069.jpg',
        tag: 'Safety & Emergency Wayfinding',
        title: 'Elevator Fire Safety Warning Plate (لا تستعمل المصعد في حالة الحريق)',
        desc: 'Code-compliant bilingual emergency instruction plaque integrated above elevator call button stations with satin dark bronze finish.'
      }
    ]
  },
  kaia: {
    badge: 'KAIA Private Aviation & Jet Aviation Terminal • مطار الملك عبدالعزيز الدولي (صالة الطيران الخاص)',
    city: 'Jeddah',
    link: 'portfolio.html?city=jeddah',
    items: [
      {
        img: 'assets/kaia-private-aviation-terminal.jpg',
        tag: 'Architectural Terminal Cover',
        title: 'KAIA Private Aviation & Jet Aviation Terminal Facade (صالة الطيران الخاص)',
        desc: 'Monumental private jet aviation terminal portico at King Abdulaziz International Airport, featuring soaring V-truss structural columns, sweeping canopy, reflective glass curtain wall, and custom granite entrance monument branding.'
      },
      {
        img: 'assets/KAIA/IMG_9164 (2) (Medium).jpg',
        tag: 'Monumental Entrance Signs',
        title: 'General Aviation Terminal Entrance Monument (صالة الطيران الخاص)',
        desc: 'Solid polished pink granite entrance monolith with 3D chrome letterforms, bilingual typography, and backlit sky-blue JED flight logo.'
      },
      {
        img: 'assets/KAIA/IMG_9161.jpg',
        tag: 'Terminal Overhead Wayfinding',
        title: 'Concourse Directional Blade (صالة جاسا • خدمات الأمتعة)',
        desc: 'Precision overhead suspended airport wayfinding blade directing passenger circulation toward JASA Hall, Luggage Services, and Gents Restrooms.'
      },
      {
        img: 'assets/KAIA/IMG_9212-2.jpg',
        tag: 'Flight Arrival Wayfinding',
        title: 'Terminal Arrivals Overhead Signage (الـقـدوم • Arrival)',
        desc: 'Bilingual overhead transit guide dividing international and domestic passenger flows with regulatory no-entry roundels and high-contrast sapphire acrylic.'
      },
      {
        img: 'assets/KAIA/IMG_9228-2.jpg',
        tag: 'Restricted Access Guidance',
        title: 'Suspended Stainless Steel Access Sign (لـلـمـوظـفـيـن فـقـط • Staff Only)',
        desc: 'Brushed structural stainless steel suspension backplate with sapphire acrylic faceplate and CNC machined standoff fixtures for security zones.'
      },
      {
        img: 'assets/KAIA/IMG_9234 (2).jpg',
        tag: 'VIP Lounge Identification',
        title: 'VIP Lounge Brass Identification Plaque (صـالـة الـسـيـدات • Female Lounge)',
        desc: 'Mirror-finish architectural brass plaque with deep-etched black enamel calligraphy and bevelled perimeter frame for premium airport passenger lounges.'
      },
      {
        img: 'assets/KAIA/KAIA SIGNS (2).jpg',
        tag: 'Airside & Traffic Safety Signage',
        title: 'Airside Traffic & Airfield Perimeter Road Guidance',
        desc: 'Retroreflective circular traffic regulation signs with heavy-duty galvanized steel post mountings and tamper-proof baseplates for airfield perimeter roads.'
      }
    ]
  },
  dallah: {
    badge: 'Jeddah Corporate Headquarters • مجموعة دله البركة (مركز صالح كامل للأعمال)',
    city: 'Jeddah',
    link: 'portfolio.html?city=jeddah',
    items: [
      {
        img: 'assets/Dallah  ALbarakah/WhatsApp Image 2023-09-25 at 12.05.09.jpg',
        tag: '3D Gold Monumental Facade',
        title: 'Saleh Kamel Business Center 3D Gold Facade (مركز صالح كامل للأعمال)',
        desc: 'Electroplated architectural gold stainless steel 3D letterforms and signature calligraphic emblem mounted on exterior granite cladding.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0028.jpg',
        tag: 'Night Backlit Illumination',
        title: 'Saleh Kamel Center Halo Backlit Night Illumination',
        desc: 'Precision reverse-channel warm white LED halo illumination creating dramatic evening visual impact on dark flamed granite.'
      },
      {
        img: 'assets/Dallah  ALbarakah/.30.jpg',
        tag: 'High-Rise Tower Elevation',
        title: 'Dallah Albaraka Tower Facade Monumental Gold Logo (دله البركة)',
        desc: 'Large-format fabricated gold-finish DB corporate crest and bilingual typography mounted on the primary tower facade elevation.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230918-WA0040.jpg',
        tag: 'Smart Access & Intercom Consoles',
        title: 'Dallah Albaraka Investment Holding Smart Intercom Panel',
        desc: 'Custom architectural bronze anodized console integrating digital touch intercom, laser-etched gold identity, and geometric accent base.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20250108-WA0025.jpg',
        tag: 'Executive Suspended Wayfinding',
        title: 'Executive Parking Suspended Wayfinding (الرئيس التنفيذي • CEO)',
        desc: 'Dual-sided suspended parking navigation blade with DB corporate monogram and brushed gold typography for executive basement bays.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0021.jpg',
        tag: 'Basement Parking Zoning Columns',
        title: 'Parking Structure Monolith Column Wayfinding (Zone A / 11)',
        desc: 'High-contrast matte black and gold column cladding with zone identifiers, custom vector optical baseband, and yellow safety floor striping.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0038.jpg',
        tag: 'Cylindrical Column Cladding',
        title: 'Cylindrical Pillar Bronze Cladding Wayfinding (Zone C / 21)',
        desc: 'Curved structural column wrapping finished in satin dark bronze with CNC routed gold level indicators and perimeter guard banding.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20250108-WA0023.jpg',
        tag: 'VIP Lounge Identification',
        title: 'VIP Women Lounge Architectural Wall Plaque (صالة السيدات)',
        desc: 'Satin bronze door identification plaque with precision recessed gold lettering and bespoke optical geometric lower panel.'
      },
      {
        img: 'assets/Dallah  ALbarakah/WhatsApp Image 2023-09-18 at 12.58.05.jpg',
        tag: 'Architectural Crown Signage',
        title: 'Dallah Albaraka Building Facade Monolith Lettering',
        desc: 'Solid-core architectural metal fabrication with weather-resistant coating mounted to granite facade tiles.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230918-WA0042.jpg',
        tag: 'Parking Zone Identification',
        title: 'Underground Parking Monolith Column (Zone A / 19)',
        desc: 'Structural wayfinding column cladding with high-visibility gold typography and protective edge impact buffers.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0047.jpg',
        tag: 'Facility Door Signage',
        title: 'Printing Room Identification Plaque (غرفة طباعة)',
        desc: 'Architectural interior room plaque with bilingual engraved gold typography and tactile geometric trim.'
      },
      {
        img: 'assets/Dallah  ALbarakah/WhatsApp Image 2022-09-13 at 2.09.38 PM.jpeg',
        tag: 'Emergency Evacuation Systems',
        title: '2nd Floor Fire Evacuation Plan & Schematic Wayfinding',
        desc: 'Code-compliant architectural safety map with emergency exits, fire equipment stations, and gold baseline design language.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0030.jpg',
        tag: 'Entrance Granite Monument',
        title: 'Saleh Kamel Business Center Main Entrance Portico',
        desc: 'Low-level polished granite entrance wall featuring 3D dimensional lettering beneath glass atrium canopy.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230918-WA0044.jpg',
        tag: 'Dimensional Level Indicators',
        title: 'Ground Level G1 Dimensional Signage Indicator',
        desc: 'Laser-cut architectural bronze numeral and letterform wall mounted with concealed pin fixings.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0050.jpg',
        tag: 'Dimensional Level Indicators',
        title: 'Ground Level G3 Dimensional Signage Indicator',
        desc: 'Laser-cut architectural bronze typography for high-traffic elevator vestibules and stairwells.'
      },
      {
        img: 'assets/Dallah  ALbarakah/IMG-20230925-WA0048.jpg',
        tag: 'Interior Directionals',
        title: 'Corporate Suite Interior Architectural Wall Sign',
        desc: 'Bespoke corporate identity signage with gold geometric motifs for executive floors and boardroom suites.'
      }
    ]
  },
  pnu: {
    badge: 'Princess Nourah University Mega-Campus • جامعة الأميرة نورة بنت عبد الرحمن',
    city: 'Riyadh',
    link: 'services.html',
    items: [
      {
        img: 'assets/pnu-campus-monument.jpg',
        tag: 'Architectural Campus Cover',
        title: 'Princess Nourah University Mega-Campus Masterplan & Central Dome (جامعة الأميرة نورة بنت عبد الرحمن)',
        desc: 'World’s largest women’s university campus featuring monumental neoclassical Islamic sandstone architecture, 38 administrative and academic colleges, central grand dome, and a fully integrated campus-wide wayfinding network.'
      },
      {
        img: 'assets/pnu/_DSC0148.JPG',
        tag: 'Concourse Directional Totem',
        title: 'Monumental Bilingual Wayfinding Totem (مكاتب الأساتذة • صالة • مصلى • شؤون الطالبات)',
        desc: 'Floor-standing architectural wayfinding totem engineered with precision CNC laser-cut stainless steel Arabesque latticework, vibrant signal-yellow contrast backplate, and cast frosted acrylic directional blade.'
      },
      {
        img: 'assets/pnu/_DSC0214.JPG',
        tag: '3D Solid Dimensional Lettering',
        title: 'Solid Brushed Stainless Steel Pin-Mounted Typography (SB3 Students...)',
        desc: 'Macro-engineered dimensional solid metal letterforms pin-mounted with concealed standoffs on polished flamed granite wall, providing crisp shadow definition, longevity, and tactile prestige.'
      },
      {
        img: 'assets/pnu/_DSC0154.JPG',
        tag: 'Sandstone Restroom Blade',
        title: 'Limestone Wall-Mounted Restroom Blade Sign (دورات المياه للسيدات)',
        desc: 'Dual-faced illuminated frosted acrylic blade with pictographic icon mounted on custom gold/yellow powder-coated bracket with traditional Islamic geometric filigree.'
      },
      {
        img: 'assets/pnu/_DSC0089.JPG',
        tag: 'Curved Stainless Restroom Blade',
        title: 'Curved Architectural Stainless Steel Blade Sign with Amber Core',
        desc: 'Curved satin-finish stainless steel housing with precision laser-cut Arabesque perforation, internal amber reflector, and cantilevered frosted acrylic pictogram plate.'
      }
    ]
  }
};

let activeGalleryKey = 'haram';
let activeGalleryIndex = 0;

function initCardSliders() {
  const sliders = document.querySelectorAll('.portfolio-card-slider');
  if (!sliders.length) return;

  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.card-slide');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    const dots = slider.querySelectorAll('.card-slider-dots .dot');
    let currentIndex = 0;

    const goToSlide = (idx) => {
      currentIndex = (idx + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        goToSlide(slideIdx);
      });
    });

    // Clicking a slide opens the lightbox for that gallery and index
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        const galleryKey = slide.getAttribute('data-gallery') || (slider.id === 'dallahCardSlider' ? 'dallah' : (slider.id === 'kaiaCardSlider' ? 'kaia' : (slider.id === 'galleriaCardSlider' ? 'galleria' : 'haram')));
        openGalleryModal(galleryKey, i);
      });
    });
  });
}

function openGalleryModal(galleryKey = 'haram', index = 0) {
  const modal = document.getElementById('haramLightboxModal');
  if (!modal) return;
  
  activeGalleryKey = PROJECT_GALLERIES[galleryKey] ? galleryKey : 'haram';
  const gallery = PROJECT_GALLERIES[activeGalleryKey];
  
  // Re-build thumbnail strip for current gallery
  const thumbStrip = document.getElementById('lightboxThumbStrip');
  if (thumbStrip) {
    thumbStrip.innerHTML = '';
    gallery.items.forEach((item, i) => {
      const thumb = document.createElement('div');
      thumb.className = `lightbox-thumb ${i === index ? 'active' : ''}`;
      thumb.setAttribute('data-idx', i.toString());
      thumb.innerHTML = `<img src="${item.img}" alt="${item.title}">`;
      thumb.addEventListener('click', () => {
        setLightboxSlide(i);
      });
      thumbStrip.appendChild(thumb);
    });
  }

  // Update modal badge & total
  const badgeEl = document.getElementById('lightboxModalBadge');
  if (badgeEl) badgeEl.textContent = gallery.badge;

  const totalEl = document.getElementById('lightboxTotalCount');
  if (totalEl) totalEl.textContent = gallery.items.length.toString();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setLightboxSlide(index);
}

function openHaramModal(index = 0) {
  openGalleryModal('haram', index);
}

function openGalleriaModal(index = 0) {
  openGalleryModal('galleria', index);
}

function openKaiaModal(index = 0) {
  openGalleryModal('kaia', index);
}

function openDallahModal(index = 0) {
  openGalleryModal('dallah', index);
}

function closeHaramModal() {
  const modal = document.getElementById('haramLightboxModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function setLightboxSlide(idx) {
  const modal = document.getElementById('haramLightboxModal');
  if (!modal) return;

  const gallery = PROJECT_GALLERIES[activeGalleryKey] || PROJECT_GALLERIES.haram;
  const total = gallery.items.length;
  activeGalleryIndex = (idx + total) % total;
  const current = gallery.items[activeGalleryIndex];

  const imgEl = document.getElementById('lightboxActiveImg');
  const counterEl = document.getElementById('lightboxCurrentIdx');
  const totalEl = document.getElementById('lightboxTotalCount');
  const tagEl = document.getElementById('lightboxTag');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');
  const thumbs = document.querySelectorAll('.lightbox-thumb');

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = current.img;
      imgEl.alt = current.title;
      imgEl.style.opacity = '1';
    }, 120);
  }

  if (counterEl) counterEl.textContent = (activeGalleryIndex + 1).toString();
  if (totalEl) totalEl.textContent = total.toString();
  if (tagEl) tagEl.textContent = current.tag;
  if (titleEl) titleEl.textContent = current.title;
  if (descEl) descEl.textContent = current.desc;

  thumbs.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === activeGalleryIndex);
  });
}

function initHaramLightboxModal() {
  const modal = document.getElementById('haramLightboxModal');
  if (!modal) return;

  const openHaramBtns = document.querySelectorAll('.open-haram-gallery');
  const openGalleriaBtns = document.querySelectorAll('.open-galleria-gallery');
  const openKaiaBtns = document.querySelectorAll('.open-kaia-gallery');
  const openDallahBtns = document.querySelectorAll('.open-dallah-gallery');
  const genericGalleryBtns = document.querySelectorAll('[data-gallery-target]');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const backdrop = modal.querySelector('.lightbox-backdrop');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  openHaramBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
      openGalleryModal('haram', idx);
    });
  });

  openGalleriaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
      openGalleryModal('galleria', idx);
    });
  });

  openKaiaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
      openGalleryModal('kaia', idx);
    });
  });

  openDallahBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
      openGalleryModal('dallah', idx);
    });
  });

  const allGalleryTriggers = document.querySelectorAll('[data-gallery-target], .open-signage-gallery-btn, .project-brief-card, .projective-tile');
  allGalleryTriggers.forEach(el => {
    el.addEventListener('click', (e) => {
      // If clicking directly on an anchor or button that is not a gallery trigger, don't hijack
      if (e.target.tagName === 'A' && !e.target.hasAttribute('data-gallery-target') && !e.target.classList.contains('open-signage-gallery-btn') && !e.target.classList.contains('projective-tile-cta')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const gKey = el.getAttribute('data-gallery-target') || 'pnu';
      const idx = parseInt(el.getAttribute('data-gallery-index') || el.getAttribute('data-index') || '0', 10);
      openGalleryModal(gKey, idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeHaramModal);
  if (backdrop) backdrop.addEventListener('click', closeHaramModal);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setLightboxSlide(activeGalleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setLightboxSlide(activeGalleryIndex + 1);
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeHaramModal();
    } else if (e.key === 'ArrowLeft') {
      setLightboxSlide(activeGalleryIndex - 1);
    } else if (e.key === 'ArrowRight') {
      setLightboxSlide(activeGalleryIndex + 1);
    }
  });
}

/* --------------------------------------------------------------------------
   9. SIGNAGE 2-UP CARD TRACK — ORANGE BG SLIDING GALLERY
   -------------------------------------------------------------------------- */
function initDynamicSignageMarquee() {
  const showcase = document.getElementById('signageFullscreenShowcase');
  if (!showcase) return;

  // Build pool: one representative image per project
  const pool = [];

  Object.keys(PROJECT_GALLERIES).forEach(galleryKey => {
    const gallery = PROJECT_GALLERIES[galleryKey];
    const city = gallery.city || 'Saudi Arabia';
    const link = gallery.link || 'portfolio.html';
    if (gallery.items && gallery.items.length > 0) {
      const item = gallery.items[0];
      const cleanTitle = item.title.split('(')[0].replace(/[•\-–]/g, ' ').trim();
      pool.push({ img: item.img, title: cleanTitle, location: `${city}, Saudi Arabia`, link });
    }
  });

  // Curated extras
  const extras = [
    { img: 'assets/hero-station-a2.jpg', title: 'Station A2 — Metro Wayfinding Facade', location: 'Riyadh, Saudi Arabia', link: 'portfolio.html' },
    { img: 'assets/haram-seasonal/haram-highmast-directional.jpg', title: 'Haram Highmast Directional Signage', location: 'Makkah, Saudi Arabia', link: 'portfolio.html' },
    { img: 'assets/pnu/_DSC0089.JPG', title: 'Princess Nourah University — Campus Wayfinding', location: 'Riyadh, Saudi Arabia', link: 'portfolio.html' },
    { img: 'assets/pnu/_DSC0154.JPG', title: 'PNU — Monumental Entrance Signage', location: 'Riyadh, Saudi Arabia', link: 'portfolio.html' },
    { img: 'assets/KAIA/IMG_9228-2.jpg', title: 'KAIA Terminal — Architectural Pylons', location: 'Jeddah, Saudi Arabia', link: 'portfolio.html' },
    { img: 'assets/galleria hotel/IMG-20230925-WA0066.jpg', title: 'Galleria Hotel — Luxury Interior Signage', location: 'Jeddah, Saudi Arabia', link: 'portfolio.html' }
  ];
  extras.forEach(e => pool.push(e));

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  if (pool.length < 2) return;

  // Build card HTML
  const buildCard = (item) => `
    <div class="sfs-card">
      <img src="${item.img}" alt="${item.title}" class="sfs-img" loading="lazy">
      <div class="sfs-caption">
        <div class="sfs-title">${item.title}</div>
        <div class="sfs-location">${item.location}</div>
      </div>
    </div>`;

  const track = document.getElementById('sfsTrack');
  const dotsEl = document.getElementById('sfsDots');
  const navBtn = document.getElementById('sfsNavBtn');

  if (!track) return;

  // Inject all cards
  track.innerHTML = pool.map(buildCard).join('');

  // Sizing function: strictly 2 images visible on desktop (1 on mobile), true 1:1 square
  const updateCardSizes = () => {
    const viewport = showcase.querySelector('.sfs-viewport');
    if (!viewport) return;
    const viewportWidth = viewport.clientWidth;
    const computedTrackStyle = window.getComputedStyle(track);
    const padLeft = parseFloat(computedTrackStyle.paddingLeft) || 0;
    const padRight = parseFloat(computedTrackStyle.paddingRight) || 0;
    const gap = parseFloat(computedTrackStyle.gap) || 16;
    
    const isMobile = window.innerWidth <= 768;
    const imagesVisible = isMobile ? 1 : 2;
    
    const availableWidth = viewportWidth - padLeft - padRight - (gap * (imagesVisible - 1));
    const cardWidth = Math.floor(availableWidth / imagesVisible);
    
    track.querySelectorAll('.sfs-card').forEach(card => {
      card.style.width = `${cardWidth}px`;
      card.style.height = `${cardWidth}px`;
      card.style.flex = `0 0 ${cardWidth}px`;
    });
  };

  updateCardSizes();

  // Total pages = ceil(pool.length / 2)
  const isMobile = () => window.innerWidth <= 768;
  const imagesPerPage = () => (isMobile() ? 1 : 2);
  const totalPages = Math.ceil(pool.length / 2);
  let currentPage = 0;

  // Build dots
  let dotsHtml = '';
  for (let i = 0; i < totalPages; i++) {
    dotsHtml += `<button class="sfs-dot${i === 0 ? ' active' : ''}" data-page="${i}" aria-label="Page ${i + 1}"></button>`;
  }
  if (dotsEl) dotsEl.innerHTML = dotsHtml;

  const goToPage = (page) => {
    const allDots = showcase.querySelectorAll('.sfs-dot');
    if (allDots[currentPage]) allDots[currentPage].classList.remove('active');

    currentPage = (page + totalPages) % totalPages;

    const firstCard = track.querySelector('.sfs-card');
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
    const perPage = imagesPerPage();

    track.style.transform = `translateX(-${currentPage * perPage * (cardWidth + gap)}px)`;

    if (allDots[currentPage]) allDots[currentPage].classList.add('active');
  };

  // Floating cursor follower (< >) - ACTIVE ONLY IN THIS SECTION
  const follower = document.getElementById('sfsCursorFollower');
  const viewport = showcase.querySelector('.sfs-viewport');

  if (follower && viewport) {
    viewport.addEventListener('mouseenter', () => {
      follower.classList.add('active');
    });

    viewport.addEventListener('mouseleave', () => {
      follower.classList.remove('active');
      follower.classList.remove('clicking');
    });

    viewport.addEventListener('mousemove', (e) => {
      follower.style.setProperty('--x', `${e.clientX}px`);
      follower.style.setProperty('--y', `${e.clientY}px`);
    });

    viewport.addEventListener('mousedown', () => {
      follower.classList.add('clicking');
    });

    window.addEventListener('mouseup', () => {
      follower.classList.remove('clicking');
    });

    // Clicking on viewport advances or goes back based on left/right half
    viewport.addEventListener('click', (e) => {
      if (e.target.closest('button, a')) return;
      const rect = viewport.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      clearInterval(autoTimer);
      if (clickX < rect.width / 2) {
        goToPage(currentPage - 1);
      } else {
        goToPage(currentPage + 1);
      }
      autoTimer = setInterval(() => goToPage(currentPage + 1), 6000);
    });
  }

  // Nav button fallback for touch devices
  if (navBtn) {
    navBtn.addEventListener('click', () => {
      clearInterval(autoTimer);
      goToPage(currentPage + 1);
      autoTimer = setInterval(() => goToPage(currentPage + 1), 6000);
    });
  }

  // Dot clicks
  showcase.addEventListener('click', (e) => {
    const dot = e.target.closest('.sfs-dot');
    if (!dot) return;
    clearInterval(autoTimer);
    goToPage(parseInt(dot.dataset.page));
    autoTimer = setInterval(() => goToPage(currentPage + 1), 6000);
  });

  // Window resize handler: recalculate exact 2-card geometry
  window.addEventListener('resize', () => {
    updateCardSizes();
    goToPage(currentPage);
  });

  // Auto-advance every 6s
  let autoTimer = setInterval(() => goToPage(currentPage + 1), 6000);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoTimer);
    } else {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goToPage(currentPage + 1), 6000);
    }
  });
}

/* --------------------------------------------------------------------------
   7. HERO SHOWCASE (ROCK-SOLID STILL, RANDOMIZED CROSSFADE SLIDESHOW)
   -------------------------------------------------------------------------- */
function initHeroTunnelWayfinding() {
  const heroSection = document.getElementById('heroWayfinding');
  if (!heroSection) return;

  const parallaxWrap = document.getElementById('heroTunnelParallax');
  if (parallaxWrap) {
    // 100% Rock-solid still: remove any 3D perspective shaking or mouse tilt
    parallaxWrap.style.transform = 'none';
  }

  // Curated list of high-definition architectural wayfinding projects
  const heroImages = [
    'assets/hero-station-a2.jpg',
    'assets/pnu/1.jpg',
    'assets/pnu/7.jpg',
    'assets/pnu/12.jpg',
    'assets/KAIA/IMG_9164 (2) (Medium).jpg',
    'assets/haram-seasonal/haram-abdulaziz-ajyad-gate.jpg',
    'assets/galleria hotel/IMG-20230925-WA0066.jpg',
    'assets/Dallah  ALbarakah/IMG-20230925-WA0030.jpg',
    'assets/pnu/_DSC0089.JPG',
    'assets/pnu/_DSC0154.JPG',
    'assets/KAIA/IMG_9228-2.jpg'
  ];

  let currentImgIndex = 0;
  const imgA = document.getElementById('heroTunnelImgA');
  let imgB = document.getElementById('heroTunnelImgB');

  if (!imgB && parallaxWrap) {
    imgB = document.createElement('img');
    imgB.id = 'heroTunnelImgB';
    imgB.className = 'hero-tunnel-img';
    imgB.alt = 'Architectural Wayfinding Showcase';
    parallaxWrap.appendChild(imgB);
  }

  if (imgA) {
    imgA.classList.add('active');
  }

  let activeIsA = true;

  const changeToRandomImage = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * heroImages.length);
    } while (nextIndex === currentImgIndex && heroImages.length > 1);

    currentImgIndex = nextIndex;
    const nextSrc = heroImages[currentImgIndex];

    const targetImg = activeIsA ? imgB : imgA;
    const currentImg = activeIsA ? imgA : imgB;

    if (!targetImg || !currentImg) return;

    // Preload image before fading in
    const preload = new Image();
    preload.src = nextSrc;
    preload.onload = () => {
      targetImg.src = nextSrc;
      targetImg.classList.add('active');
      currentImg.classList.remove('active');
      activeIsA = !activeIsA;
    };
  };

  // Change image randomly every 6 seconds
  let heroInterval = setInterval(changeToRandomImage, 6000);

  // Pause when tab is not focused to save battery/GPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(heroInterval);
    } else {
      clearInterval(heroInterval);
      heroInterval = setInterval(changeToRandomImage, 6000);
    }
  });
}


