// Interacciones ligeras: menú móvil, animaciones de entrada
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll suave con compensación de header fijo
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (!targetElement) {
      return;
    }

    event.preventDefault();

    if (targetId === '#inicio') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight : 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset + 6;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// Sistema unificado de animaciones reveal
const revealElements = document.querySelectorAll('.reveal');
const staggerGroups = document.querySelectorAll('[data-reveal-stagger]');

staggerGroups.forEach((group) => {
  const step = Number(group.dataset.revealStep) || 80;
  const groupItems = Array.from(group.querySelectorAll('.reveal'));

  groupItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${index * step}ms`);
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const shouldRepeat = entry.target.hasAttribute('data-reveal-repeat');

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (!shouldRepeat) {
            revealObserver.unobserve(entry.target);
          }
          return;
        }

        if (shouldRepeat) {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// Efecto fade-scroll del hero al desplazarse
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const heroRect = hero.getBoundingClientRect();
    const heroHeight = hero.offsetHeight;
    const scrollProgress = Math.min(1, Math.max(0, -heroRect.top / (heroHeight * 0.4)));
    
    if (scrollProgress > 0) {
      hero.classList.add('fade-scroll');
      hero.style.opacity = 1 - scrollProgress * 0.7;
      hero.style.transform = `scale(${1 - scrollProgress * 0.02})`;
    } else {
      hero.classList.remove('fade-scroll');
      hero.style.opacity = '';
      hero.style.transform = '';
    }
  });
}

// cursos y modal de video
const coursesCarousel = document.querySelector('[data-carousel]');
const videoModal = document.getElementById('course-video-modal');

if (coursesCarousel) {
  const viewport = coursesCarousel.querySelector('[data-carousel-viewport]');
  const track = coursesCarousel.querySelector('[data-carousel-track]');
  const prevButton = coursesCarousel.querySelector('.carousel-arrow-prev');
  const nextButton = coursesCarousel.querySelector('.carousel-arrow-next');
  const dotsContainer = document.querySelector('[data-carousel-dots]');
  const cards = Array.from(track.querySelectorAll('.course-card'));

  coursesCarousel.classList.add('has-stagger');

  let currentPage = 0;
  let cardsPerView = 3;
  let totalPages = 1;
  let touchStartX = 0;
  let touchEndX = 0;

  const getCardsPerView = () => {
    if (window.matchMedia('(max-width: 760px)').matches) {
      return 1;
    }
    if (window.matchMedia('(max-width: 1080px)').matches) {
      return 2;
    }
    return 3;
  };

  const updateNavigationState = () => {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage >= totalPages - 1;

    const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPage);
      dot.setAttribute('aria-current', index === currentPage ? 'true' : 'false');
    });
  };

  const goToPage = (pageIndex) => {
    currentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
    const startCardIndex = currentPage * cardsPerView;
    const card = cards[startCardIndex];
    const offset = card ? card.offsetLeft : 0;
    track.style.transform = `translateX(-${offset}px)`;
    updateNavigationState();
  };

  const buildDots = () => {
    dotsContainer.innerHTML = '';

    for (let index = 0; index < totalPages; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Ir a la página ${index + 1} de cursos`);
      dot.addEventListener('click', () => goToPage(index));
      dotsContainer.appendChild(dot);
    }
  };

  const refreshCarousel = () => {
    cardsPerView = getCardsPerView();
    totalPages = Math.max(1, Math.ceil(cards.length / cardsPerView));
    currentPage = Math.min(currentPage, totalPages - 1);
    buildDots();
    goToPage(currentPage);
  };

  prevButton.addEventListener('click', () => goToPage(currentPage - 1));
  nextButton.addEventListener('click', () => goToPage(currentPage + 1));

  viewport.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX > 0) {
      goToPage(currentPage + 1);
    } else {
      goToPage(currentPage - 1);
    }
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshCarousel, 120);
  });

  refreshCarousel();
}

if (videoModal) {
  const videoPlayer = videoModal.querySelector('.video-modal__player');
  const videoSource = videoPlayer.querySelector('source');
  const closeTriggers = Array.from(videoModal.querySelectorAll('[data-modal-close]'));
  const mediaButtons = Array.from(document.querySelectorAll('.course-card .course-media'));

  const closeModal = () => {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoSource.src = '';
    videoPlayer.load();
  };

  const openModal = (videoSrc, title) => {
    videoSource.src = videoSrc;
    videoPlayer.setAttribute('aria-label', `Video del curso ${title}`);
    videoPlayer.load();
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    videoPlayer.play().catch(() => {
      // La reproducción puede requerir interacción adicional según navegador.
    });
  };

  mediaButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.course-card');
      const videoSrc = card ? card.dataset.video : '';
      const title = card ? card.dataset.title : 'curso';

      if (!videoSrc) {
        return;
      }

      openModal(videoSrc, title);
    });
  });

  closeTriggers.forEach((element) => {
    element.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && videoModal.classList.contains('open')) {
      closeModal();
    }
  });
}
