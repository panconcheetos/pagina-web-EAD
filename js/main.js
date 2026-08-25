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

<<<<<<< HEAD
// header fijo
=======
// Scroll suave con compensación de header fijo
>>>>>>> b994fdefa5b7daa67526f74cbb3e6a32a47224b4
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

<<<<<<< HEAD
// Sistema unificado de animaciones 
=======
// Sistema unificado de animaciones reveal
>>>>>>> b994fdefa5b7daa67526f74cbb3e6a32a47224b4
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

// Efecto del hero al desplazarse
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
  }, { passive: true });
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
  const courseDescription = videoModal.querySelector('[data-course-description]');
  const closeTriggers = Array.from(videoModal.querySelectorAll('[data-modal-close]'));
  const mediaButtons = Array.from(document.querySelectorAll('.course-card .course-media'));

  const courseDescriptions = {
    'Ley Karin': 'Este proyecto busca reconocer el impacto de la Ley Karin y sus protocolos de prevención en la mitigación del acoso laboral en Chile, analizando sus objetivos, aplicación, vigencia y cambios principales que introduce la Ley.',
    DS44: 'Este curso establece las bases para aplicar medidas de gestión preventiva de seguridad y salud en el trabajo (SST) en Chile, contextualizando el surgimiento del nuevo Decreto Supremo N° 44 (DS44), vigente desde el 1 de febrero de 2025.',
    'Trabajo en equipo': 'Este curso busca que los participantes puedan adquirir herramientas colaborativas que promuevan el trabajo en equipo eficaz, la comunicación efectiva y diferentes estrategias en la resolución de conflictos; considerando planes de mejora continua.',
    'Administración del tiempo laboral': 'La gestión del tiempo se refiere al conjunto de métodos diseñados para mejorar la eficiencia en la realización de tareas. En este curso, los participantes aprenderán estrategias clave para optimizar la productividad durante la jornada laboral.',
    Excel: 'Esta serie de cursos presentan los conocimientos básicos, intermedios y/o avanzados del uso de Microsoft Excel. Cuentan con simuladores que buscan explicar el funcionamiento de las hojas de cálculo y todas sus posibilidades.',
    'Primeros auxilios': 'El objetivo de este curso es reconocer el manejo efectivo de emergencias de obstrucción de la vía aérea por cuerpo extraño (OVACE) y paros cardiorrespiratorios (PCR), según protocolos de primeros auxilios.',
    'Academia de ventas': 'Es un programa estructurado y diseñado para formar a los colaboradores de Construmart en habilidades de venta y atención al cliente, capaces de ofrecer asesoría experta y atención personalizada, generando satisfacción en los clientes.',
    Mantención: 'Este curso realizado para Parques del Recuerdo ha sido diseñado para explicar los procesos de mantención que se llevan a cabo en sus locaciones; dando a conocer los lineamientos, buenas prácticas y estándares que guían su labor.'
  };

  let lastFocusedVideo = null;

  const closeModal = () => {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    videoSource.src = '';
    if (courseDescription) {
      courseDescription.textContent = '';
    }
    videoPlayer.load();
    if (lastFocusedVideo) {
      lastFocusedVideo.focus();
      lastFocusedVideo = null;
    }
  };

  const openModal = (videoSrc, title) => {
    lastFocusedVideo = document.activeElement;
    videoSource.src = videoSrc;
    videoPlayer.setAttribute('aria-label', `Video del curso ${title}`);
    if (courseDescription) {
      courseDescription.textContent = courseDescriptions[title] || '';
    }
    videoPlayer.load();
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    videoPlayer.play().catch(() => {
      // la reproducción automatica puede requerir interacción en algunos navegadores
    });
    const closeBtn = videoModal.querySelector('.video-modal__close');
    if (closeBtn) {
      window.setTimeout(() => closeBtn.focus(), 40);
    }
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

// contacto
const contactModal = document.getElementById('contact-modal');
const contactOpenButtons = Array.from(document.querySelectorAll('[data-contact-open]'));

if (contactModal && contactOpenButtons.length > 0) {
  const contactCloseTriggers = Array.from(contactModal.querySelectorAll('[data-contact-close]'));
  const contactForm = contactModal.querySelector('#contact-form');
  const contactStatus = contactModal.querySelector('[data-contact-status]');
  const contactSubmitButton = contactModal.querySelector('[data-contact-submit]');
  const fieldNombre = contactForm.querySelector('[name="nombre"]');
  const fieldEmpresa = contactForm.querySelector('[name="empresa"]');
  const fieldEmail = contactForm.querySelector('[name="email"]');
  const fieldTelefono = contactForm.querySelector('[name="telefono"]');
  const fieldMensaje = contactForm.querySelector('[name="mensaje"]');
  const contactFields = [fieldNombre, fieldEmpresa, fieldEmail, fieldTelefono, fieldMensaje];

  const API_URL = '/api/contacto';

  const setStatus = (message, type = '') => {
    if (!contactStatus) {
      return;
    }
    contactStatus.textContent = message;
    contactStatus.classList.remove('is-error', 'is-success');
    if (type) {
      contactStatus.classList.add(type);
    }
  };

  const clearValidation = () => {
    contactFields.forEach((field) => {
      field.removeAttribute('aria-invalid');
    });
  };

  const validateContactForm = () => {
    clearValidation();
    let isValid = true;

    contactFields.forEach((field) => {
      if (!field.value.trim()) {
        field.setAttribute('aria-invalid', 'true');
        isValid = false;
      }
    });

    const emailValue = fieldEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailPattern.test(emailValue)) {
      fieldEmail.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    const telefonoValue = fieldTelefono.value.trim();
    const telefonoPattern = /^[+\d\s-]+$/;
    if (telefonoValue && !telefonoPattern.test(telefonoValue)) {
      fieldTelefono.setAttribute('aria-invalid', 'true');
      isValid = false;
    }

    return isValid;
  };

  let lastFocusedContact = null;

  const closeContactModal = () => {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('contact-modal-open');
    if (lastFocusedContact) {
      lastFocusedContact.focus();
      lastFocusedContact = null;
    }
  };

  const openContactModal = () => {
    lastFocusedContact = document.activeElement;
    setStatus('');
    clearValidation();
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('contact-modal-open');
    window.setTimeout(() => fieldNombre.focus(), 40);
  };

  contactOpenButtons.forEach((button) => {
    button.addEventListener('click', openContactModal);
  });

  contactCloseTriggers.forEach((element) => {
    element.addEventListener('click', closeContactModal);
  });

  contactFields.forEach((field) => {
    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
      if (contactStatus.textContent) {
        setStatus('');
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && contactModal.classList.contains('open')) {
      closeContactModal();
    }
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateContactForm()) {
      setStatus('Revisa los campos obligatorios y el formato del correo.', 'is-error');
      return;
    }

    const originalButtonText = contactSubmitButton.textContent;
    contactSubmitButton.disabled = true;
    contactSubmitButton.textContent = 'Enviando...';
    setStatus('Enviando tu solicitud...');

    const formData = {
      nombre: fieldNombre.value.trim(),
      empresa: fieldEmpresa.value.trim(),
      email: fieldEmail.value.trim(),
      telefono: fieldTelefono.value.trim(),
      mensaje: fieldMensaje.value.trim()
    };

    try {
      // aqui se debe conectar el backend para procesar y almacenar los datos.
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus('Solicitud enviada con éxito, te contactaremos pronto.', 'is-success');
      contactForm.reset();
    } catch (error) {
      setStatus('No se pudo enviar la solicitud, intenta nuevamente.', 'is-error');
    } finally {
      contactSubmitButton.disabled = false;
      contactSubmitButton.textContent = originalButtonText;
      void API_URL;
      void formData;
    }
  });
}
