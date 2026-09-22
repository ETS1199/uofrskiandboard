// Header background once scrolled off the hero banner
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  header.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    header.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active nav link on scroll
const scrollNavTargets = document.querySelectorAll(
  '#about, #events, #gallery, #sponsors, #contact'
);
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting);
  if (!visible.length) return;
  visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  const id = visible[0].target.getAttribute('id');
  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}, { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1], rootMargin: '-18% 0px -42% 0px' });

scrollNavTargets.forEach(el => observer.observe(el));

// Scroll-triggered fade-in
const fadeEls = document.querySelectorAll(
  '.offering, .event, .gallery-item, .sponsor-logo, .section-head, .about-body'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// Fade-in styles, skipped when the viewer prefers reduced motion
const style = document.createElement('style');
style.textContent = `
  @media (prefers-reduced-motion: no-preference) {
    .fade-in {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: none;
    }
  }
`;
document.head.appendChild(style);
