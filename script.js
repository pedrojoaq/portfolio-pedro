document.addEventListener('DOMContentLoaded', () => {
  // Scroll indicator
  const scrollIndicator = document.querySelector('.scroll-indicator');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollIndicator.style.width = scrollPercent + '%';
  });

  // Skills interactivity
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(skill => {
    skill.addEventListener('click', () => {
      skillItems.forEach(s => s.classList.remove('active'));
      skill.classList.add('active');

      // Particle effect
      createParticles(skill);
    });

    skill.addEventListener('mouseenter', function() {
      if (!this.classList.contains('active')) {
        this.style.transform = 'translateY(-3px)';
      }
    });
  });

  // Particle effect function
  function createParticles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #ff3cf0;
        border-radius: 50%;
        pointer-events: none;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        animation: particleBurst 600ms ease-out forwards;
        z-index: 50;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 600);
    }
  }

  // Add particle burst animation
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particleBurst {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0);
        }
      }
      .skill-item:nth-child(1) ~ * { --tx: ${Math.cos(0) * 60}px; --ty: ${Math.sin(0) * 60}px; }
      .skill-item:nth-child(2) ~ * { --tx: ${Math.cos(Math.PI / 2) * 60}px; --ty: ${Math.sin(Math.PI / 2) * 60}px; }
      .skill-item:nth-child(3) ~ * { --tx: ${Math.cos(Math.PI) * 60}px; --ty: ${Math.sin(Math.PI) * 60}px; }
      .skill-item:nth-child(4) ~ * { --tx: ${Math.cos(3 * Math.PI / 2) * 60}px; --ty: ${Math.sin(3 * Math.PI / 2) * 60}px; }
      .skill-item:nth-child(5) ~ * { --tx: ${Math.cos(Math.PI / 4) * 60}px; --ty: ${Math.sin(Math.PI / 4) * 60}px; }
    `;
    document.head.appendChild(style);
  }

  // Keep existing nav-item active behavior (if present)
  const cards = document.querySelectorAll('.nav-item');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(item => item.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Simple scroll reveal to guide user attention sequentially
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  // Smoothly focus anchor targets when navigated via hash
  function focusHash() {
    const id = location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    // remove tabindex after focusing to keep DOM clean
    setTimeout(() => el.removeAttribute('tabindex'), 1200);
  }
  window.addEventListener('hashchange', focusHash, false);
  // if loaded with hash
  if (location.hash) focusHash();

  // Modal: open project details centered
  const modal = document.getElementById('project-modal');
  const modalOverlay = modal.querySelector('.modal-overlay');
  const modalClose = modal.querySelector('.modal-close');
  const modalTitle = modal.querySelector('#modal-title');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalTag = modal.querySelector('.project-tag');
  const modalLive = modal.querySelector('.modal-live');
  let currentProjectLink = '#';

  function openModal(data) {
    modalTitle.textContent = data.title || '';
    modalDesc.textContent = data.desc || '';
    modalTag.textContent = data.tag || '';

    if (data.projectLink) {
      currentProjectLink = data.projectLink;
    }

    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    modal.setAttribute('tabindex', '-1');
    modal.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    modal.removeAttribute('tabindex');
  }

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // Wire up project cards with enhanced interaction
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, idx) => {
    const link = card.querySelector('.project-link');
    const projectLink = link?.getAttribute('data-live') || '#';

    // Pega os dados do card
    const data = {
      title: card.querySelector('h3')?.textContent || `Projeto ${idx+1}`,
      desc: card.querySelector('p')?.textContent || '',
      tag: card.querySelector('.project-tag')?.textContent || '',
      projectLink: projectLink
    };

    console.log(`Projeto ${idx + 1}:`, data);

    card.addEventListener('click', (ev) => {
      if (ev.target.closest('.project-link')) {
        ev.preventDefault();
        openModal(data);
      }
    });

    if (link) {
      link.addEventListener('click', (ev) => {
        ev.preventDefault();
        openModal(data);
      });
    }
  });

  // Ensure modal button works
  const modalLiveBtn = modal.querySelector('.modal-live');
  modalLiveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Abrindo:', currentProjectLink);
    if (currentProjectLink && currentProjectLink !== '#') {
      window.open(currentProjectLink, '_blank');
    }
  });
});
