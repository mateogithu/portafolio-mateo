/**
 * ==========================================================================
 * PORTAFOLIO PROFESIONAL — MATEO STORTINI
 * Lógica interactiva en JavaScript Vanilla (ES6+)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
   * 1. AÑO DINÁMICO EN EL FOOTER
   * ------------------------------------------------------------------------ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
   * 2. MENÚ DE NAVEGACIÓN MÓVIL
   * ------------------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar menú al hacer clic en cualquier enlace
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 3. ANIMACIÓN SCROLL REVEAL (INTERSECTION OBSERVER)
   * ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback para navegadores antiguos
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
   * 4. SIMULACIÓN DE TERMINAL EN TIEMPO REAL (VICTORIA OS TELEMETRY)
   * ------------------------------------------------------------------------ */
  const typewriterEl = document.getElementById('typewriterText');
  const latencyEl = document.getElementById('latencyVal');

  const commands = [
    'ollama run llama3:on-premise --context=secops',
    'victoria audit --verify-hitl-signatures',
    'fastapi stream --ws-channel=/telemetry/nodes',
    'python -m agents.defender --scan-lan',
  ];

  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typewriterEl) return;

    const currentCmd = commands[cmdIndex];
    if (isDeleting) {
      charIndex--;
      typewriterEl.textContent = currentCmd.substring(0, charIndex);
    } else {
      charIndex++;
      typewriterEl.textContent = currentCmd.substring(0, charIndex);
    }

    let delay = isDeleting ? 28 : 55;

    if (!isDeleting && charIndex === currentCmd.length) {
      delay = 2200; // Pausa al terminar de escribir el comando
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      cmdIndex = (cmdIndex + 1) % commands.length;
      delay = 450;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();

  // Simulación sutil de latencia WebSockets en la terminal
  if (latencyEl) {
    setInterval(() => {
      const jitter = (3.4 + Math.random() * 2.4).toFixed(1);
      latencyEl.textContent = `${jitter} ms`;
    }, 2400);
  }

  /* ------------------------------------------------------------------------
   * 5. COPIADO RÁPIDO DE TELÉFONO Y CORREO ELECTRÓNICO AL PORTAPAPELES
   * ------------------------------------------------------------------------ */
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phone = copyPhoneBtn.getAttribute('data-copy') || '3463443753';
      try {
        await navigator.clipboard.writeText(phone);
        const originalText = copyPhoneBtn.textContent;
        copyPhoneBtn.textContent = '¡Copiado!';
        setTimeout(() => {
          copyPhoneBtn.textContent = originalText;
        }, 2000);
      } catch {
        window.location.href = `tel:+549${phone}`;
      }
    });
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailAddressEl = document.getElementById('emailAddress');

  if (copyEmailBtn && emailAddressEl) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailAddressEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = '¡Copiado!';
        setTimeout(() => {
          copyEmailBtn.textContent = originalText;
        }, 2000);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 6. FORMULARIO DE CONTACTO FUNCIONAL (COMPATIBLE CON GITHUB PAGES)
   * ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const type = document.getElementById('type').value.trim();
      const message = document.getElementById('message').value.trim();

      const targetEmail = emailAddressEl
        ? emailAddressEl.textContent.trim()
        : 'mateostortini@gmail.com';

      const subject = encodeURIComponent(`[Portafolio] ${type} — ${name}`);
      const body = encodeURIComponent(
        `Hola Mateo,\n\n` +
          `Nombre / Empresa: ${name}\n` +
          `Correo de contacto: ${email}\n` +
          `Motivo: ${type}\n\n` +
          `Mensaje:\n${message}\n\n` +
          `---\nEnviado desde tu portafolio web.`
      );

      if (formStatus) {
        formStatus.textContent =
          '[OK] Abriendo cliente de correo con tu propuesta preparada...';
      }

      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    });
  }
});
