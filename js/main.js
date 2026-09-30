// Mobile nav
const toggle = document.getElementById('hdrToggle');
const nav = document.getElementById('hdrNav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Scroll-triggered fade-in
const fadeEls = document.querySelectorAll(
  '.hero, .pitch, .split, .trio, .events, .exec-group, .logo-card, .recap-grid .ph, .faq'
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
