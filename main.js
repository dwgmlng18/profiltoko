(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function createRipple(e) {
    const btn = e.currentTarget;
    const existing = btn.querySelector('.ripple-wave');
    if (existing) existing.remove();

    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 1.6;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    Object.assign(ripple.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   x    + 'px',
      top:    y    + 'px',
    });
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  $$('.btn, .tab-item, .sosmed-btn').forEach(el => {
    el.addEventListener('pointerdown', createRipple);
  });

  const navbar  = $('#navbar');
  const backTop = $('#backTop');

  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 50);
    backTop?.classList.toggle('visible', y > 320);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger   = $('#burger');
  const navLinks = $('#navLinks');

  function toggleMenu(state) {
    const open = state ?? !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger?.addEventListener('click', () => toggleMenu());

  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('pointerdown', (e) => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  const sections   = $$('section[id]');
  const navAnchors = $$('.nav-link');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-38% 0px -55% 0px' });

  sections.forEach(s => sectionObs.observe(s));

  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  $$('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--green-50), var(--white))`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  function animateCounter(el, target, suffix = '') {
    const duration = 1400;
    const start    = performance.now();
    const isFloat  = String(target).includes('.');
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = ease * target;
      el.textContent = isFloat
        ? value.toFixed(1) + suffix
        : Math.floor(value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      statObs.unobserve(en.target);
      const el     = en.target.querySelector('.stat-count');
      const target = parseFloat(el?.dataset.target ?? '0');
      const suffix = el?.dataset.suffix ?? '';
      if (el) animateCounter(el, target, suffix);
    });
  }, { threshold: 0.4 });

  $$('.stat-item').forEach(el => statObs.observe(el));

  $$('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        const toko = $('#toko');
        toko?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
  });

  $$('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group')?.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group')?.classList.remove('focused');
    });
  });

  $$('.all-list li').forEach(li => {
    li.setAttribute('tabindex', '0');
  });

  $$('.kontak-block').forEach((block, i) => {
    block.style.transitionDelay = `${i * 0.06}s`;
  });

  console.log('🌿 Toko Serba Ada — UI v2 loaded');
})();