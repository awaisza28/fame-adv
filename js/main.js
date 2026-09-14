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
    badge: 'Grand Mosque • Haram Temporary Signage (اللوحات الموسمية والمؤقتة بالحرم المكي)',
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
        img: 'assets/dallah-albarakah-hq.jpg',
        tag: 'Architectural Headquarters Facade',
        title: 'Saleh Kamel Business Center — Dallah Al-Barakah HQ (مركز صالح كامل للأعمال)',
        desc: 'Monumental corporate headquarters complex in Jeddah featuring contemporary glass curtain wall elevations, 3D electroplated gold facade crests, executive parking wayfinding, and integrated campus identification.'
      },
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
    badge: 'Princess Nourah University Mega-Campus • جامعة الأميرة نورة بنت عبد الرحمن (38 Photos)',
    city: 'Riyadh',
    link: 'services.html',
    items: [
          {
                "img": "assets/pnu-campus-monument.jpg",
                "tag": "Architectural Campus Cover",
                "title": "Princess Nourah University Mega-Campus Masterplan & Central Dome (جامعة الأميرة نورة بنت عبد الرحمن)",
                "desc": "World’s largest women’s university campus featuring monumental neoclassical Islamic sandstone architecture, 38 administrative and academic colleges, central grand dome, and a fully integrated campus-wide wayfinding network."
          },
          {
                "img": "assets/pnu/_DSC0148.JPG",
                "tag": "Concourse Directional Totem",
                "title": "Monumental Bilingual Wayfinding Totem (مكاتب الأساتذة • صالة • مصلى • شؤون الطالبات)",
                "desc": "Floor-standing architectural wayfinding totem engineered with precision CNC laser-cut stainless steel Arabesque latticework, vibrant signal-yellow contrast backplate, and cast frosted acrylic directional blade."
          },
          {
                "img": "assets/pnu/_DSC0214.JPG",
                "tag": "3D Solid Dimensional Lettering",
                "title": "Solid Brushed Stainless Steel Pin-Mounted Typography (SB3 Students...)",
                "desc": "Macro-engineered dimensional solid metal letterforms pin-mounted with concealed standoffs on polished flamed granite wall, providing crisp shadow definition, longevity, and tactile prestige."
          },
          {
                "img": "assets/pnu/_DSC0154.JPG",
                "tag": "Sandstone Restroom Blade",
                "title": "Limestone Wall-Mounted Restroom Blade Sign (دورات المياه للسيدات)",
                "desc": "Dual-faced illuminated frosted acrylic blade with pictographic icon mounted on custom gold/yellow powder-coated bracket with traditional Islamic geometric filigree."
          },
          {
                "img": "assets/pnu/_DSC0089.JPG",
                "tag": "Curved Stainless Restroom Blade",
                "title": "Curved Architectural Stainless Steel Blade Sign with Amber Core",
                "desc": "Curved satin-finish stainless steel housing with precision laser-cut Arabesque perforation, internal amber reflector, and cantilevered frosted acrylic pictogram plate."
          },
          {
                "img": "assets/pnu/_DSC0008.JPG",
                "tag": "Exterior Pylon Monolith",
                "title": "Campus Perimeter Primary Vehicular Directional Pylon",
                "desc": "Heavy-duty steel and aluminium directional pylon guiding vehicular traffic between campus ring roads, collegiate zones, and central service faculties."
          },
          {
                "img": "assets/pnu/_DSC0014.JPG",
                "tag": "College Entrance Plaque",
                "title": "College Faculty Entrance Dimensional Identification Plaque",
                "desc": "Precision-etched architectural brushed stainless steel entrance signage with bilingual collegiate nomenclature and university emblem."
          },
          {
                "img": "assets/pnu/_DSC0022.JPG",
                "tag": "Pedestrian Monolith",
                "title": "Central Promenade Pedestrian Guidance Monolith",
                "desc": "Freestanding monolith with Arabesque laser-perforated accent band, bilingual destination arrows, and high-contrast charcoal finish."
          },
          {
                "img": "assets/pnu/_DSC0027.JPG",
                "tag": "Transit Connector Blade",
                "title": "Monorail Station Pedestrian Wayfinding Blade",
                "desc": "Suspended bilingual wayfinding blade guiding passenger circulation between the automated monorail transit station and collegiate concourses."
          },
          {
                "img": "assets/pnu/_DSC0036.JPG",
                "tag": "Auditorium Identification",
                "title": "Grand Ceremonial Auditorium Dimensional Identification",
                "desc": "3D fabricated satin brass and brushed steel typography pin-mounted to natural sandstone portico facade."
          },
          {
                "img": "assets/pnu/_DSC0041.JPG",
                "tag": "Directional Fingerpost",
                "title": "Campus Plaza Multi-Directional Fingerpost Assembly",
                "desc": "Modular architectural directional arms mounted on fluted cylindrical steel post with durable anti-glare finish for outdoor plazas."
          },
          {
                "img": "assets/pnu/_DSC0045.JPG",
                "tag": "Directory Monolith",
                "title": "College Building Multi-Level Tenant & Department Directory",
                "desc": "Interior lobby directory monolith featuring modular changeable magnetic slats and clear bilingual department indexing."
          },
          {
                "img": "assets/pnu/_DSC0050.JPG",
                "tag": "Corridor Blade Sign",
                "title": "Double-Sided Illuminated Academic Corridor Blade Sign",
                "desc": "Cantilevered frosted acrylic blade with internal high-CRI LED lighting and Arabesque filigree bracket detail."
          },
          {
                "img": "assets/pnu/_DSC0052.JPG",
                "tag": "Department Signage",
                "title": "Student Affairs & Admissions Center Departmental Plaque",
                "desc": "Brushed metal faceplate mounted on contrasting matte black acrylic backplate with ADA-compliant tactile room numbering."
          },
          {
                "img": "assets/pnu/_DSC0062.JPG",
                "tag": "Safety & Evacuation Map",
                "title": "Code-Compliant Architectural Emergency Evacuation Schematic",
                "desc": "High-clarity fire safety and emergency egress routing diagram mounted at primary corridor elevator junctions."
          },
          {
                "img": "assets/pnu/_DSC0071.JPG",
                "tag": "Library Concourse Guide",
                "title": "Central Library Atrium Multi-Floor Wayfinding Totem",
                "desc": "Floor-standing atrium directional totem orienting researchers and students toward digital archives, study halls, and reference collections."
          },
          {
                "img": "assets/pnu/_DSC0077.JPG",
                "tag": "Suspended Ceiling Blade",
                "title": "High-Ceiling Concourse Suspended Directional Wayfinding",
                "desc": "Aircraft-grade stainless steel cable suspended directional blade with bilingual typography for wide architectural hallways."
          },
          {
                "img": "assets/pnu/_DSC0079.JPG",
                "tag": "Tactile Room Plaque",
                "title": "Faculty Office Tactile & Braille Identification Plaque",
                "desc": "Grade 2 Braille room identification sign with tactile Arabic and English numerals, conforming to Saudi accessibility codes."
          },
          {
                "img": "assets/pnu/_DSC0081.JPG",
                "tag": "Interior Pylon Sign",
                "title": "College Lobby Architectural Identity Pylon",
                "desc": "Slimline interior monolith combining laser-cut brass accents, laser-etched university seal, and bilingual college title."
          },
          {
                "img": "assets/pnu/_DSC0085.JPG",
                "tag": "Restroom Wayfinding Blade",
                "title": "Accessible Restroom Illuminated Directional Blade Sign",
                "desc": "Wall-projecting LED-lit frosted acrylic blade featuring international accessibility pictograms and Islamic geometric filigree."
          },
          {
                "img": "assets/pnu/_DSC0090.JPG",
                "tag": "Perforated Metal Totem",
                "title": "Arabesque Patterned Floor Totem with Directional Insets",
                "desc": "Architectural totem featuring custom geometric Arabesque cutouts with internal contrast panels and directional arrows."
          },
          {
                "img": "assets/pnu/_DSC0097.JPG",
                "tag": "Elevator Vestibule Signage",
                "title": "Elevator Core Level & Department Floor Indicator",
                "desc": "Large-scale dimensional level number with comprehensive directory of collegiate floors and administrative offices."
          },
          {
                "img": "assets/pnu/_DSC0111.JPG",
                "tag": "Laboratory Wing Wayfinding",
                "title": "Scientific & Health Sciences Research Laboratory Signage",
                "desc": "Precision hazard warning and room classification signage with brushed stainless steel finish for laboratory corridors."
          },
          {
                "img": "assets/pnu/_DSC0115.JPG",
                "tag": "Exterior Campus Map",
                "title": "Campus Masterplan Integrated Wayfinding Map Kiosk",
                "desc": "Weatherproof exterior information monolith displaying high-resolution campus masterplan and color-coded collegiate zones."
          },
          {
                "img": "assets/pnu/_DSC0127.JPG",
                "tag": "Student Center Signage",
                "title": "Student Activity Center Concourse Directional Sign",
                "desc": "Vibrant yellow and charcoal accent directional sign guiding circulation to dining halls, recreational lounges, and sports facilities."
          },
          {
                "img": "assets/pnu/_DSC0135.JPG",
                "tag": "Gatehouse Monument",
                "title": "Campus Main Security Gatehouse Entrance Monument",
                "desc": "Heavy-duty stone and metal monument with illuminated university crest, security lane instructions, and gate designation."
          },
          {
                "img": "assets/pnu/_DSC0142.JPG",
                "tag": "Lecture Hall Directionals",
                "title": "Tiered Lecture Hall & Amphitheatre Corridor Wayfinding",
                "desc": "Wall-mounted directional band leading students to auditorium entry doors with high-contrast typography."
          },
          {
                "img": "assets/pnu/_DSC0146.JPG",
                "tag": "Monorail Platform Guidance",
                "title": "Automated People Mover Platform Safety & Directional Signage",
                "desc": "Transit platform overhead wayfinding with bilingual line designations, arrival doors, and accessibility boarding zones."
          },
          {
                "img": "assets/pnu/_DSC0157.JPG",
                "tag": "Parking Structure Signage",
                "title": "Multi-Story Collegiate Parking Level & Zone Identification",
                "desc": "Color-coded level indicators and pedestrian exit guidance designed for high visibility across parking decks."
          },
          {
                "img": "assets/pnu/_DSC0165.JPG",
                "tag": "Administration Building Plaque",
                "title": "Rectorate & University Council Chambers Identification",
                "desc": "Cast bronze architectural entrance plaque with deep-relief crest and micro-textured background finish."
          },
          {
                "img": "assets/pnu/_DSC0176.JPG",
                "tag": "Courtyard Wayfinding Monolith",
                "title": "Open-Air Landscaped Courtyard Directional Monolith",
                "desc": "UV-resistant and heat-tested directional monolith engineered to withstand Riyadh summer temperatures and dust exposure."
          },
          {
                "img": "assets/pnu/_DSC0184.JPG",
                "tag": "Conference Center Signage",
                "title": "International Convention Center Wayfinding Suite",
                "desc": "Sophisticated dark bronze and gold signage collection designed for the campus international conference complex."
          },
          {
                "img": "assets/pnu/_DSC0187.JPG",
                "tag": "Health Sciences Wayfinding",
                "title": "King Abdullah University Hospital Pavilion Directionals",
                "desc": "Clinical wayfinding blade system with color-coded medical department navigation for patients and visitors."
          },
          {
                "img": "assets/pnu/_DSC0195.JPG",
                "tag": "Sports Arena Monument",
                "title": "Olympic Sports Complex & Indoor Arena Monument Sign",
                "desc": "Dynamic architectural totem highlighting indoor aquatic center, gymnasium, and outdoor athletic track."
          },
          {
                "img": "assets/pnu/_DSC0218.JPG",
                "tag": "Dimensional Building Typography",
                "title": "Solid Brushed Metal Exterior Building Identification",
                "desc": "Individual solid stainless steel fabricated letters pin-mounted to stone facade with concealed weather-sealed anchor bolts."
          },
          {
                "img": "assets/pnu/_DSC0219.JPG",
                "tag": "Pedestrian Walkway Marker",
                "title": "Covered Walkway Network Shaded Path Directional Marker",
                "desc": "Column-mounted direction markers guiding students along shaded pedestrian walkways between academic clusters."
          },
          {
                "img": "assets/pnu/_DSC0227.JPG",
                "tag": "VIP Lounge Signage",
                "title": "Campus Dignitary & VIP Protocol Lounge Identification",
                "desc": "Polished gold and brushed metal architectural identification plate with bespoke geometric filigree border."
          },
          {
                "img": "assets/pnu/_DSC0230.JPG",
                "tag": "Service & Logistics Signage",
                "title": "Campus Facilities, Maintenance & Logistics Gateway Sign",
                "desc": "Industrial-grade directional and regulatory signage for facility access roads and central utility plant."
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
  
  // Re-build thumbnail strip for current gallery with async loading
  const thumbStrip = document.getElementById('lightboxThumbStrip');
  if (thumbStrip) {
    thumbStrip.innerHTML = '';
    const fragment = document.createDocumentFragment();
    gallery.items.forEach((item, i) => {
      const thumb = document.createElement('div');
      thumb.className = `lightbox-thumb ${i === index ? 'active' : ''}`;
      thumb.setAttribute('data-idx', i.toString());
      thumb.innerHTML = `<img src="${item.img}" alt="${item.title}" loading="lazy" decoding="async">`;
      thumb.addEventListener('click', () => {
        setLightboxSlide(i);
      });
      fragment.appendChild(thumb);
    });
    thumbStrip.appendChild(fragment);
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

function preloadAdjacentImages() {
  const gallery = PROJECT_GALLERIES[activeGalleryKey] || PROJECT_GALLERIES.haram;
  const total = gallery.items.length;
  if (total <= 1) return;
  const nextIdx = (activeGalleryIndex + 1) % total;
  const prevIdx = (activeGalleryIndex - 1 + total) % total;
  const nextImg = new Image();
  nextImg.src = gallery.items[nextIdx].img;
  const prevImg = new Image();
  prevImg.src = gallery.items[prevIdx].img;
}

let thumbScrollRAF = null;

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

  // Instant update of image and metadata with zero artificial lag
  if (imgEl && imgEl.getAttribute('src') !== current.img) {
    imgEl.src = current.img;
    imgEl.alt = current.title;
  }

  if (counterEl) counterEl.textContent = (activeGalleryIndex + 1).toString();
  if (totalEl) totalEl.textContent = total.toString();
  if (tagEl) tagEl.textContent = current.tag;
  if (titleEl) titleEl.textContent = current.title;
  if (descEl) descEl.textContent = current.desc;

  thumbs.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === activeGalleryIndex);
  });

  // Always keep highlighted active thumbnail in the exact horizontal center
  if (thumbScrollRAF) cancelAnimationFrame(thumbScrollRAF);
  thumbScrollRAF = requestAnimationFrame(() => {
    const activeThumb = thumbs[activeGalleryIndex];
    const thumbStrip = document.getElementById('lightboxThumbStrip');
    if (activeThumb && thumbStrip && thumbStrip.clientWidth > 0) {
      const stripWidth = thumbStrip.clientWidth;
      const thumbCenter = activeThumb.offsetLeft + (activeThumb.offsetWidth / 2);
      const targetLeft = thumbCenter - (stripWidth / 2);
      thumbStrip.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    }
  });

  // Preload adjacent images in browser cache for instantaneous back/forth navigation
  preloadAdjacentImages();
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
   9. SIGNAGE 2-UP CARD TRACK — ORANGE/BLACK BG SLIDING GALLERY WITH CURSOR FOLLOWER
   -------------------------------------------------------------------------- */
function initDynamicSignageMarquee() {
  const showcases = document.querySelectorAll('.signage-fullscreen-showcase');
  if (!showcases.length) return;

  // Build pool: strictly one primary cover photo per unique project (no duplicates)
  const pool = [
    {
      img: 'assets/pnu-campus-monument.jpg',
      title: 'Princess Nourah University — Mega-Campus',
      location: 'Riyadh, Saudi Arabia',
      target: 'pnu',
      index: 0
    },
    {
      img: 'assets/kaia-private-aviation-terminal.jpg',
      title: 'KAIA Private Aviation — Jet Aviation Terminal',
      location: 'Jeddah, Saudi Arabia',
      target: 'kaia',
      index: 0
    },
    {
      img: 'assets/haram-seasonal/haram-abdulaziz-ajyad-gate.jpg',
      title: 'Grand Mosque Piazzas & Transit Corridors',
      location: 'Makkah, Saudi Arabia',
      target: 'haram',
      index: 0
    },
    {
      img: 'assets/dallah-albarakah-hq.jpg',
      title: 'Dallah Al-Barakah Investment Holding HQ',
      location: 'Jeddah, Saudi Arabia',
      target: 'dallah',
      index: 0
    },
    {
      img: 'assets/galleria-hotel-facade.jpg',
      title: 'The Galleria Hotel & Luxury Commercial Suites',
      location: 'Jeddah, Saudi Arabia',
      target: 'galleria',
      index: 0
    }
  ];

  if (pool.length < 2) return;

  showcases.forEach((showcase) => {
    const track = showcase.querySelector('.sfs-track');
    const dotsEl = showcase.querySelector('.sfs-dots');
    const navBtn = showcase.querySelector('.sfs-nav-btn');
    const follower = showcase.querySelector('.sfs-cursor-follower');
    const viewport = showcase.querySelector('.sfs-viewport');

    if (!track) return;

    // Build card HTML
    const buildCard = (item) => `
      <div class="sfs-card" data-gallery-target="${item.target}" data-gallery-index="${item.index}">
        <img src="${item.img}" alt="${item.title}" class="sfs-img" loading="lazy" draggable="false">
        <div class="sfs-caption">
          <div class="sfs-title">${item.title}</div>
          <div class="sfs-location">${item.location}</div>
        </div>
      </div>`;

    // Duplicate pool 3 times for a seamless infinite loop ring
    const sequence = [...pool, ...pool, ...pool];
    track.innerHTML = sequence.map(buildCard).join('');

    let cardWidth = 0;
    let gap = 16;
    let singleSetWidth = 0;

    // Sizing function: strictly 2 images visible on desktop (1 on mobile), true 1:1 square
    const updateCardSizes = () => {
      if (!viewport) return;
      const viewportWidth = viewport.clientWidth;
      gap = 16;
      const isMobile = window.innerWidth <= 768;
      const imagesVisible = isMobile ? 1 : 2;

      const availableWidth = viewportWidth - (gap * (imagesVisible - 1));
      cardWidth = Math.floor(availableWidth / imagesVisible);

      track.querySelectorAll('.sfs-card').forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardWidth}px`;
        card.style.flex = `0 0 ${cardWidth}px`;
      });

      singleSetWidth = pool.length * (cardWidth + gap);
    };

    updateCardSizes();

    // Continuous automated marquee moving smoothly from left to right (+X direction)
    const baseSpeed = 48; // pixels per second
    let currentX = -singleSetWidth;
    let nudgeVelocity = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragLastX = 0;
    let dragThresholdPassed = false;
    let lastTime = performance.now();

    const animateMarquee = (now) => {
      let dt = (now - lastTime) / 1000;
      lastTime = now;
      if (dt > 0.1) dt = 0.1;

      if (!isDragging) {
        // Continuous automatic smooth scrolling from left to right without stopping
        currentX += baseSpeed * dt;

        // Apply smooth manual click nudge
        if (Math.abs(nudgeVelocity) > 0.5) {
          const step = nudgeVelocity * Math.min(1, 8 * dt);
          currentX += step;
          nudgeVelocity -= step;
        } else {
          nudgeVelocity = 0;
        }
      }

      // Seamless infinite wrapping in both directions
      if (singleSetWidth > 0) {
        while (currentX >= 0) {
          currentX -= singleSetWidth;
        }
        while (currentX < -singleSetWidth) {
          currentX += singleSetWidth;
        }
      }

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      requestAnimationFrame(animateMarquee);
    };

    requestAnimationFrame(animateMarquee);

    // Floating cursor follower (< >) - ACTIVE ONLY IN THIS SECTION
    if (follower && viewport) {
      if (follower.parentElement !== document.body) {
        document.body.appendChild(follower);
      }

      let isTracking = false;

      const handlePointerMove = (e) => {
        const rect = viewport.getBoundingClientRect();
        const inside = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );

        if (inside || isDragging) {
          follower.style.setProperty('--x', `${e.clientX}px`);
          follower.style.setProperty('--y', `${e.clientY}px`);

          if (!isTracking) {
            isTracking = true;
            follower.classList.add('active');
          }

          if (isDragging) {
            const delta = e.clientX - dragLastX;
            if (Math.abs(e.clientX - dragStartX) > 8) {
              dragThresholdPassed = true;
            }
            currentX += delta;
            dragLastX = e.clientX;
          }
        } else if (isTracking && !isDragging) {
          isTracking = false;
          follower.classList.remove('active');
          follower.classList.remove('clicking');
        }
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });

      viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, a')) return;
        isDragging = true;
        dragStartX = e.clientX;
        dragLastX = e.clientX;
        dragThresholdPassed = false;
        follower.classList.add('clicking');
      });

      window.addEventListener('mouseup', (e) => {
        follower.classList.remove('clicking');
        if (!isDragging) return;
        isDragging = false;

        const rect = viewport.getBoundingClientRect();
        const inside = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        if (!inside) {
          isTracking = false;
          follower.classList.remove('active');
        }
      });

      // Manual navigation: clicking on left or right side of the section moves the images
      viewport.addEventListener('click', (e) => {
        if (e.target.closest('button, a')) return;
        if (dragThresholdPassed) return;

        const rect = viewport.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const shiftStep = cardWidth + gap;

        if (clickX < rect.width / 2) {
          // Clicked on left side -> move images left
          nudgeVelocity -= shiftStep;
        } else {
          // Clicked on right side -> move images right
          nudgeVelocity += shiftStep;
        }
      });
    }

    // Window resize handler: recalculate exact 2-card geometry
    window.addEventListener('resize', () => {
      updateCardSizes();
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        lastTime = performance.now();
      }
    });
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


