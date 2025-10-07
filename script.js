/* ============== Tahun dinamis footer ============== */
(() => {
  const yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============== Smooth scroll dengan offset navbar dinamis ============== */
(() => {
  const navbar = document.querySelector('.navbar');
  const getOffset = () => (navbar ? navbar.offsetHeight : 0);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - getOffset();
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', id);
    }, { passive: true });
  });
})();

/* ============== Navbar shadow saat scroll ============== */
(() => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const toggle = () => {
    if (window.scrollY > 10) nav.classList.add('shadow-sm');
    else nav.classList.remove('shadow-sm');
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* ============== IntersectionObserver: reveal elemen (hemat performa) ============== */
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.animate-item');
  if (!els.length) return;

  if (prefersReduced) {
    els.forEach(el => el.classList.add('show'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  els.forEach(el => obs.observe(el));
})();

/* ============== Highlight nav aktif per section ============== */
(() => {
  const sections = [...document.querySelectorAll('section[id], header[id]')];
  const navLinks = [...document.querySelectorAll('.navbar .nav-link')];
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = `#${entry.target.id}`;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] });

  sections.forEach(s => obs.observe(s));
})();

/* ============== Filter menu dengan d-none + fade sederhana ============== */
(() => {
  const buttons = document.querySelectorAll('#filterPills [data-filter]');
  const items = document.querySelectorAll('#menuGrid .menu-item');
  if (!buttons.length || !items.length) return;

  // helper fade
  const fadeIn = el => {
    el.classList.remove('d-none');
    el.style.opacity = 0;
    requestAnimationFrame(() => { el.style.opacity = 1; });
  };
  const fadeOut = el => {
    el.style.opacity = 0;
    setTimeout(() => { el.classList.add('d-none'); el.style.opacity = ''; }, 200);
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter');

      // toggle status tombol + aria-pressed
      buttons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      // filter item
      items.forEach(it => {
        const match = f === 'all' || it.dataset.category === f;
        if (match) fadeIn(it);
        else fadeOut(it);
      });
    });
  });
})();

/* ============== Drag-to-scroll untuk “Menu Populer” (nyaman di HP) ============== */
(() => {
  const scrollers = document.querySelectorAll('[data-drag-scroll]');
  scrollers.forEach(scroller => {
    let isDown = false, startX = 0, scrollLeft = 0, moved = false;

    scroller.addEventListener('pointerdown', (e) => {
      isDown = true; moved = false;
      scroller.setPointerCapture(e.pointerId);
      startX = e.clientX;
      scrollLeft = scroller.scrollLeft;
      scroller.classList.add('dragging');
    });

    scroller.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true; // threshold kecil
      scroller.scrollLeft = scrollLeft - dx;
    }, { passive: true });

    const end = (e) => {
      if (isDown && moved) {
        // cegah klik saat baru saja dragging
        const el = e.target.closest('a, button');
        if (el) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      isDown = false;
      scroller.classList.remove('dragging');
    };

    scroller.addEventListener('pointerup', end);
    scroller.addEventListener('pointercancel', end);
    scroller.addEventListener('mouseleave', end);
  });
})();

