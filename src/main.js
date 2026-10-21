// Progressive enhancement: content stays visible if scripting is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations = new Set();

function reveal(element, delay = 0, distance = 18) {
  if (motionPreference.matches || !element.animate) return;
  const animation = element.animate([
    { opacity: 0.35, transform: `translateY(${distance}px)` },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 650, delay, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
  activeAnimations.add(animation);
  animation.onfinish = animation.oncancel = () => activeAnimations.delete(animation);
}

motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) {
    for (const animation of activeAnimations) animation.cancel();
  }
});

// Keep keyboard-focused content still, including while its parent is entering.
document.addEventListener('focusin', (event) => {
  for (const animation of activeAnimations) {
    if (animation.effect.target.contains(event.target)) animation.cancel();
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      if (element.matches('.process')) {
        element.querySelectorAll('li').forEach((step, index) => reveal(step, index * 70, 14));
      } else {
        // Headings establish a new chapter; longer text stays still.
        reveal(element, 0, element.matches('h2') ? 0 : 18);
      }
      observer.unobserve(element);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.about-heading, .section-heading, .approach h2, .process, .team-roles, .contact h2').forEach((element) => observer.observe(element));
}
