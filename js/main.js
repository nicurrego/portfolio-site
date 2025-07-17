// Improved parallax implementation with error handling and debug logging
function initParallax() {
    const soraLayer = document.getElementById('sora-layer');
    const taironaLayer = document.getElementById('tairona-layer');

    if (!soraLayer || !taironaLayer) {
        console.error('Parallax layers not found!');
        return;
    }

    console.log('Parallax initialized');

    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Different speeds for each layer
        const soraSpeed = scrolled * -0.1;    // Slow
        const taironaSpeed = scrolled * -0.5; // Faster
        
        soraLayer.style.transform = `translateY(${soraSpeed}px)`;
        taironaLayer.style.transform = `translateY(${taironaSpeed}px)`;
    }

    // Add scroll listener
    window.addEventListener('scroll', updateParallax);
    
    // Initial call
    updateParallax();
    
    // Debug info (optional - remove in production)
    window.addEventListener('scroll', () => {
        console.log('Scroll position:', window.pageYOffset);
    });
}

// Enhanced initialization with fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
} else {
    initParallax();
}

// Your existing carousel code
(function() {
  const container = document.getElementById('carousel');
  const track     = container.querySelector('.carousel-track');
  const cards     = Array.from(track.children);
  const count     = cards.length;
  const theta     = 360 / count;

  // depth radius (Z) so cards just touch front-to-back
  const radiusZ = Math.round(
    cards[0].offsetHeight / (2 * Math.tan(Math.PI / count))
  );
  // horizontal radius (X) spanning half the container’s width
  const radiusX = container.offsetWidth / 2.6;

  // place each card around the ellipse
  cards.forEach((card, i) => {
    const angle = i * theta;
    const rad   = angle * Math.PI / 180;
    const x     = Math.sin(rad) * radiusX;
    const z     = Math.cos(rad) * radiusZ;
    const scale = i === 0 ? 1.2 : 0.3;

    card.style.transform = `
      translateX(${x}px)
      translateZ(${z}px)
      rotateY(${-angle}deg)
      scale(${scale})
    `;
  });

  let currentStep = 0;
  let intervalId;

  const STEP_INTERVAL = 3000;
  const PAUSE_TIME    = 5000;
  const minScale      = 0.1;
  const maxScale      = 1.2;

  function updateCarousel() {
    cards.forEach((card, i) => {
      const orbitAngle = i * theta + currentStep * theta;
      const rad        = orbitAngle * Math.PI / 180;
      const x          = Math.sin(rad) * radiusX;
      const z          = Math.cos(rad) * radiusZ;
      const scale      = ((Math.cos(rad) + 1) / 2) * (maxScale - minScale) + minScale;

      card.style.transform = `
        translateX(${x}px)
        translateZ(${z}px)
        rotateY(${-orbitAngle}deg)
        scale(${scale})
      `;
    });
  }

  function startAuto() {
    intervalId = setInterval(() => {
      currentStep = (currentStep + 1) % count;
      updateCarousel();
    }, STEP_INTERVAL);
  }

  function pauseAuto() {
    clearInterval(intervalId);
    setTimeout(startAuto, PAUSE_TIME);
  }

  container.addEventListener('mouseenter', pauseAuto);
  container.addEventListener('touchstart', pauseAuto);

  updateCarousel();
  startAuto();
})();
