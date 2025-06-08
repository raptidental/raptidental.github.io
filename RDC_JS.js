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

}

);


