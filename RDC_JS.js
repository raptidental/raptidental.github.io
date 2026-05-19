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
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a.nav-link');

  function setActive(id) {
    navLinks.forEach(link => {
      const matches = link.getAttribute('href') === '#' + id;
      if (matches && !link.classList.contains('active')) {
        link.classList.remove('active');
        void link.offsetWidth; // force reflow → restart animation
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


  /* ── BOOKING FORM → WHATSAPP ── */
  const form = document.getElementById('bookingForm');
  if (form) {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name    = document.getElementById('fullName').value.trim();
      const phone   = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const date    = document.getElementById('date').value;
      const notes   = document.getElementById('notes').value.trim();

      let msg = `Hello Rapti Dental Care! I'd like to book an appointment.\n\n`;
      msg += `*Name:* ${name}\n`;
      msg += `*Phone:* ${phone}\n`;
      msg += `*Service:* ${service}\n`;
      msg += `*Preferred Date:* ${date}\n`;
      if (notes) msg += `*Notes:* ${notes}\n`;

      window.open(`https://wa.me/9779845692402?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

});
