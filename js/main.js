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

  // iOS only lets play() through on touchend/click (not touchstart), and only
  // delivers taps on plain page areas to elements that have a listener.
  const tapEvents = ['touchend', 'pointerup', 'click', 'keydown'];
  const tapTargets = [document, heroVideo.closest('.hero-bg')];

  const playHero = () =>
    heroVideo.play().then(() => {
      tapTargets.forEach(t => tapEvents.forEach(evt => t.removeEventListener(evt, playHero)));
    }).catch(() => {});

  heroVideo.addEventListener('ended', () => {
    heroVideo.currentTime = 0;
    playHero();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playHero();
  });

  // autoplay blocked (e.g. Low Power Mode): start on the visitor's first tap
  tapTargets.forEach(t => tapEvents.forEach(evt => t.addEventListener(evt, playHero, { passive: true })));

  playHero();
}

// Homepage calendar
const calDays = document.getElementById('calDays');

// dates are inclusive; leave `end` off for one-day events
const EVENTS = [
  { start: '2026-11-06', title: 'Party at Blancos' },
  { start: '2027-02-15', title: 'Party at Copperhead' },
  { start: '2027-02-17', end: '2027-02-20', title: 'Big ski trip to Banff' },
];

const toDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

if (calDays) {
  const title = document.getElementById('calTitle');
  const today = new Date();
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  const events = EVENTS.map((e) => ({ ...e, from: toDate(e.start), to: toDate(e.end || e.start) }));

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
      const date = new Date(year, month, d);
      events.filter((e) => date >= e.from && date <= e.to).forEach((e) => {
        cell.classList.add('cal-day--event');
        // label the first day, and the start of each week a multi-day event runs into
        if (+date === +e.from || date.getDay() === 0) {
          const label = document.createElement('small');
          label.className = 'cal-event';
          label.textContent = e.title;
          cell.appendChild(label);
        }
      });
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

  const list = document.getElementById('calList');
  if (list) {
    const fmt = (d) => d.toLocaleString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    events
      .filter((e) => e.to >= startOfToday)
      .sort((a, b) => a.from - b.from)
      .forEach((e) => {
        const li = document.createElement('li');
        const sameMonth = e.from.getMonth() === e.to.getMonth();
        const when = !e.end
          ? fmt(e.from)
          : sameMonth
            ? `${e.from.toLocaleString('en-CA', { month: 'long', day: 'numeric' })}&ndash;${e.to.getDate()}, ${e.to.getFullYear()}`
            : `${e.from.toLocaleString('en-CA', { month: 'long', day: 'numeric' })}&ndash;${fmt(e.to)}`;
        li.innerHTML = `<span class="cal-list-date">${when}</span>`;
        li.append(e.title);
        list.appendChild(li);
      });
  }
}

// Scroll-triggered fade-in
const fadeEls = document.querySelectorAll(
  '.hero, .pitch, .split, .tier, .cal, .logo-card, .photo-grid img'
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
