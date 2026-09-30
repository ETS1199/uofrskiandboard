// Mobile nav
const toggle = document.getElementById('hdrToggle');
const nav = document.getElementById('hdrNav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Homepage background video — phones can drop autoplay or stall at the loop
// point (iOS Low Power Mode, Android data saver), so nudge it back into play.
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
  heroVideo.muted = true;
  const playHero = () => heroVideo.play().catch(() => {});

  heroVideo.addEventListener('ended', () => {
    heroVideo.currentTime = 0;
    playHero();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playHero();
  });

  // autoplay blocked until the visitor interacts: start on the first tap
  ['touchstart', 'click'].forEach(evt =>
    document.addEventListener(evt, playHero, { once: true, passive: true })
  );

  playHero();
}

// Homepage calendar
const calDays = document.getElementById('calDays');

if (calDays) {
  const title = document.getElementById('calTitle');
  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  const render = () => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const lead = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();

    title.textContent = view.toLocaleString('en-CA', { month: 'long', year: 'numeric' });
    calDays.innerHTML = '';

    for (let i = 0; i < lead; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day cal-day--empty';
      calDays.appendChild(blank);
    }

    for (let d = 1; d <= count; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
        cell.classList.add('cal-day--today');
      }
      cell.innerHTML = `<span>${d}</span>`;
      calDays.appendChild(cell);
    }
  };

  document.getElementById('calPrev').addEventListener('click', () => {
    view.setMonth(view.getMonth() - 1);
    render();
  });

  document.getElementById('calNext').addEventListener('click', () => {
    view.setMonth(view.getMonth() + 1);
    render();
  });

  render();
}

// Scroll-triggered fade-in
const fadeEls = document.querySelectorAll(
  '.hero, .pitch, .split, .trio, .cal, .exec-group, .logo-card, .recap-grid .ph, .photo-grid img, .faq'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

const style = document.createElement('style');
style.textContent = `
  @media (prefers-reduced-motion: no-preference) {
    .fade-in { opacity: 0; transform: translateY(18px); transition: opacity .5s ease, transform .5s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  }
`;
document.head.appendChild(style);
