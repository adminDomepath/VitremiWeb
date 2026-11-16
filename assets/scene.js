if (location.hash === '#english' && /\/(privacy|support|usage)\.html$/.test(location.pathname)) {
  const page = location.pathname.split('/').pop();
  location.replace(`en/${page}`);
}

const breakSection = document.querySelector('#descanso');
if (breakSection && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('is-break', entry.isIntersecting);
  }, { rootMargin: '-38% 0px -38% 0px' });
  observer.observe(breakSection);
}

const languagePicker = document.querySelector('[data-language-picker]');
if (languagePicker) {
  languagePicker.addEventListener('change', () => location.assign(languagePicker.value));
}
