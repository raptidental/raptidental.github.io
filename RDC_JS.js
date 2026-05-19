// RDC_JS.js

document.addEventListener('DOMContentLoaded', function () {
  const OFFSET = 80;
  const SCROLL_DURATION = 1200;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        e.preventDefault();
        slowScrollTo(0, SCROLL_DURATION);
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - OFFSET;
        slowScrollTo(targetPosition, SCROLL_DURATION);
      }
    });
  });

  function slowScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
  }

  console.log("Rapti Dental Care smooth scroll script active.");

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name    = document.getElementById('fullName').value.trim();
      const phone   = document.getElementById('phone').value.trim();
      const email   = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;
      const date    = document.getElementById('date').value;
      const time    = document.getElementById('time').value;
      const notes   = document.getElementById('notes').value.trim();

      let msg = `Hello Rapti Dental Care! I'd like to book an appointment.\n\n`;
      msg += `*Name:* ${name}\n`;
      msg += `*Phone:* ${phone}\n`;
      if (email) msg += `*Email:* ${email}\n`;
      msg += `*Service:* ${service}\n`;
      msg += `*Preferred Date:* ${date}\n`;
      msg += `*Preferred Time:* ${time}\n`;
      if (notes) msg += `*Notes:* ${notes}\n`;

      const waUrl = `https://wa.me/9779845692402?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  }

}

);


