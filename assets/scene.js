const breakSection = document.querySelector('#descanso');
if (breakSection && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('is-break', entry.isIntersecting);
  }, { rootMargin: '-40% 0px -40% 0px' });
  observer.observe(breakSection);
}
