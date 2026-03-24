document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open', isOpen);
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  // Lightbox / modal for project images
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption || 'Project image';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.src = '';
      lightboxImg.alt = '';
    }
    if (lightboxCaption) lightboxCaption.textContent = '';
  }

  document.querySelectorAll('[data-project-index]').forEach(el => {
    el.addEventListener('click', e => {
      const card = e.currentTarget.closest('[data-type="project"]') || e.currentTarget;
      const img = card.querySelector('img');
      const titleEl = card.querySelector('h3');
      const caption = titleEl ? titleEl.textContent.trim() : '';
      if (img && img.src) {
        openLightbox(img.src, img.alt, caption);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Contact form basic validation + simulated submit
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = (form.elements.name || {}).value || '';
      const email = (form.elements.email || {}).value || '';
      const message = (form.elements.message || {}).value || '';

      const showMessage = (txt, type = 'info') => {
        let el = document.getElementById('formMessage');
        if (!el) {
          el = document.createElement('div');
          el.id = 'formMessage';
          el.className = 'form-message';
          form.parentNode.insertBefore(el, form.nextSibling);
        }
        el.textContent = txt;
        el.className = `form-message is-${type}`;
      };

      if (!name.trim() || !email.trim() || !message.trim()) {
        showMessage('Please fill in name, email, and message.', 'error');
        return;
      }

      const emailPattern = /\S+@\S+\.\S+/;
      if (!emailPattern.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      showMessage('Sending…', 'info');
      setTimeout(() => {
        showMessage('Thanks! Your message has been sent.', 'success');
        form.reset();
      }, 900);
    });
  }

  // Fill footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scrolling for internal links and close mobile menu after click
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
        if (menuBtn) {
          menuBtn.classList.remove('is-open');
          menuBtn.setAttribute('aria-label', 'Open menu');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});
