 <!-- Smooth Scroll Script -->

    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();

          const targetId = this.getAttribute('href');
          if (targetId === '#') {
            slowScrollTo(0, 1200);
            return;
          }

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            slowScrollTo(targetPosition, 1200);
          }
        });
      });

      function slowScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
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

      console.log("Rapti Dental Care website loaded.");
    });
  