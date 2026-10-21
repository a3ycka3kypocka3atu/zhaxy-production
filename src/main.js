// Progressive enhancement: all content and controls work without JavaScript.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('entered');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-heading, .about-layout, .process, .team-roles').forEach((element) => observer.observe(element));
}
