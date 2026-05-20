document.addEventListener('DOMContentLoaded', function () {

  const HEADER_H = document.querySelector('header').offsetHeight;
  const SCROLL_DURATION = 1000;


  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') { e.preventDefault(); slowScrollTo(0, SCROLL_DURATION); return; }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_H;
        slowScrollTo(top, SCROLL_DURATION);
      }
    });
  });

  function slowScrollTo(target, duration) {
    const start = window.pageYOffset;
    const dist  = target - start;
    let t0 = null;
    function step(now) {
      if (!t0) t0 = now;
      const elapsed = now - t0;
      window.scrollTo(0, easeInOutCubic(elapsed, start, dist, duration));
      if (elapsed < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }


  /* ── ACTIVE NAV (underline animates left → right) ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a.nav-link');

  function setActive(id) {
    navLinks.forEach(link => {
      const matches = link.getAttribute('href') === '#' + id;
      if (matches && !link.classList.contains('active')) {
        link.classList.remove('active');
        void link.offsetWidth;
        link.classList.add('active');
      } else if (!matches) {
        link.classList.remove('active');
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: `-${HEADER_H}px 0px -55% 0px`, threshold: 0 });

  sections.forEach(s => observer.observe(s));


  /* ── SERVICE CAROUSEL (one card per 2.5 s, pause on hover) ── */
  const track = document.getElementById('serviceTrack');
  if (track) {
    const allCards = track.querySelectorAll('.service-card');
    const ORIG_COUNT = 12;
    let idx = 0;
    let stepping = false;
    let paused = false;

    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });

    function getStepPx() {
      const card = allCards[0];
      const gap  = parseFloat(getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    }

    function stepCarousel() {
      if (stepping || paused) return;
      stepping = true;
      idx++;

      track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
      track.style.transform  = `translateX(-${idx * getStepPx()}px)`;

      if (idx >= ORIG_COUNT) {
        setTimeout(() => {
          track.style.transition = 'none';
          track.style.transform  = 'translateX(0)';
          idx = 0;
          void track.offsetWidth;
          stepping = false;
        }, 600);
      } else {
        setTimeout(() => { stepping = false; }, 600);
      }
    }

    setInterval(stepCarousel, 2500);
  }


  /* ── SERVICE CARD → PRE-SELECT FORM + FLASH ── */
  document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.addEventListener('click', function () {
      const serviceName = this.dataset.service;
      const select = document.getElementById('service');
      if (select) {
        Array.from(select.options).forEach(opt => {
          if (opt.text === serviceName) select.value = opt.value;
        });
      }
      const contact = document.querySelector('#contact');
      if (contact) {
        const top = contact.getBoundingClientRect().top + window.pageYOffset - HEADER_H;
        slowScrollTo(top, SCROLL_DURATION);
        setTimeout(() => {
          if (select) {
            select.classList.remove('service-flash');
            void select.offsetWidth;
            select.classList.add('service-flash');
            select.addEventListener('animationend', () => {
              select.classList.remove('service-flash');
            }, { once: true });
          }
        }, SCROLL_DURATION + 100);
      }
    });
  });


  /* ── BOOKING FORM → WHATSAPP ── */
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name    = document.getElementById('fullName').value.trim();
      const phone   = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const notes   = document.getElementById('notes').value.trim();

      let msg = `Hello Rapti Dental Care! I'd like to book an appointment.\n\n`;
      msg += `*Name:* ${name}\n`;
      msg += `*Phone:* ${phone}\n`;
      msg += `*Service:* ${service}\n`;
      if (notes) msg += `*Notes:* ${notes}\n`;

      window.open(`https://wa.me/9779845692402?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

});
