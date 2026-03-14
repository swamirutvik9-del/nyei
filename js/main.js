// NYEI — Main JavaScript

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 300);
    });
    // Fallback
    setTimeout(() => preloader && preloader.classList.add('hidden'), 1500);
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // --- Accordion ---
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.accordion-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const body = document.getElementById(t.getAttribute('aria-controls'));
        if (body) body.classList.remove('open');
      });
      // Toggle current
      if (!expanded) {
        trigger.setAttribute('aria-expanded', 'true');
        const body = document.getElementById(trigger.getAttribute('aria-controls'));
        if (body) body.classList.add('open');
      }
    });
  });

  // --- Subtle scroll-based fade for nav ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.style.boxShadow = '0 1px 10px rgba(0,0,0,0.06)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // --- Contact form submit ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Submitting…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Received';
        btn.style.background = '#1A6B3A';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  // ─── Team Carousel ───────────────────────────────────
  const carousel = document.getElementById('teamCarousel');
  if (carousel) {
    const cards = carousel.querySelectorAll('.team-card');
    const prevBtn = document.getElementById('teamPrev');
    const nextBtn = document.getElementById('teamNext');
    const dotsEl = document.getElementById('teamDots');
    let currentIndex = 0;

    function getVisible() {
      const w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 900) return 2;
      return 4; // show all 4 at once on desktop
    }

    function buildDots() {
      dotsEl.innerHTML = '';
      const visible = getVisible();
      const total = Math.ceil(cards.length / visible);
      for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.className = 'team-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      }
    }

    function goTo(index) {
      const visible = getVisible();
      const total = Math.ceil(cards.length / visible);
      currentIndex = Math.max(0, Math.min(index, total - 1));
      const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
      carousel.style.transform = `translateX(-${currentIndex * cardWidth * visible}px)`;
      dotsEl.querySelectorAll('.team-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Touch swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(currentIndex + (diff > 0 ? 1 : -1));
    }, { passive: true });

    buildDots();
    window.addEventListener('resize', () => { buildDots(); goTo(0); });
  }

});
