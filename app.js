// ===== AOS init (ringan & elegan) =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({
      duration: 500,        // 0.5 detik animasi
      easing: 'ease-out',
      once: true,           // animasi jalan sekali
      offset: 80,           // trigger sebelum elemen terlihat
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }
});

// ===== Navbar: tambah shadow & solid saat scroll =====
(function navbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const toggle = () => {
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

// ===== Hero Parallax super ringan (dengan optimasi performa) =====
(function heroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const speedBg = 0.3;   // latar belakang
  const speedFg = 0.12;  // konten depan
  const container = hero.querySelector('.container');
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight;

      const inView = rect.bottom > 0 && rect.top < vh;
      if (inView) {
        const scrollY = Math.min(Math.max(-rect.top, 0), rect.height);
        hero.style.backgroundPosition = `center calc(50% + ${scrollY * speedBg}px)`;
        if (container) container.style.transform = `translateY(${scrollY * speedFg}px)`;
      }

      ticking = false;
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();

// ===== Micro-interaction: animasi klik tombol =====
(function buttonPulse() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn, .btn-brand, .btn-platform, .btn-feedback');
    if (!btn) return;

    btn.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.96)' },
        { transform: 'scale(1)' }
      ],
      { duration: 160, easing: 'ease-out' }
    );
  });
})();

// ===== Smooth Scroll (fallback untuk browser lama) =====
(function smoothScroll() {
  // Jika browser sudah mendukung CSS scroll-behavior, tidak perlu JS
  if ('scrollBehavior' in document.documentElement.style) return;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
})();
