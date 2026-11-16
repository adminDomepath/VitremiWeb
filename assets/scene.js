if (location.hash === '#english' && /\/(privacy|support|usage)\.html$/.test(location.pathname)) {
  const page = location.pathname.split('/').pop();
  location.replace(`en/${page}`);
}

function drawRestSky(canvas) {
  const context = canvas.getContext('2d');
  if (!context) return;

  // Match the seed, positions and glow used by RestNightSky in SwiftUI.
  let seed = 0x73a9f1d2c8b4065en;
  function unit() {
    seed = BigInt.asUintN(64, seed + 0x9e3779b97f4a7c15n);
    let value = BigInt.asUintN(64, (seed ^ (seed >> 30n)) * 0xbf58476d1ce4e5b9n);
    value = BigInt.asUintN(64, (value ^ (value >> 27n)) * 0x94d049bb133111ebn);
    return Number((value ^ (value >> 31n)) >> 11n) / 2 ** 53;
  }

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * scale;
  canvas.height = height * scale;
  context.scale(scale, scale);

  const color = '227, 242, 255';
  for (let index = 0; index < 76; index++) {
    const x = unit() * width;
    const position = 0.018 + unit() ** 1.15 * 0.68;
    const y = position * height;
    const magnitude = unit();
    const radius = magnitude > 0.94 ? 1.05 : 0.28 + unit() * 0.48;
    const opacity = (0.22 + magnitude ** 2 * 0.66) * Math.max(0, 1 - (position / 0.73) ** 2);

    if (magnitude > 0.88) {
      const glowRadius = radius + 3;
      const glow = context.createRadialGradient(x, y, 0, x, y, glowRadius);
      glow.addColorStop(0, `rgba(${color}, ${opacity * 0.32})`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      context.fillStyle = glow;
      context.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
    }

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(${color}, ${opacity})`;
    context.fill();
  }
}

const breakSection = document.querySelector('#descanso');
if (breakSection) {
  const canvas = breakSection.querySelector('canvas');
  const dial = breakSection.querySelector('[data-rest-label]');
  const clock = dial.querySelector('strong');
  const phase = dial.querySelector('[data-rest-phase]');
  const idleLabel = dial.getAttribute('aria-label');
  const idlePhase = phase.textContent;
  let frame = 0;
  let resting = false;

  function updatePhase() {
    frame = 0;
    const section = breakSection.getBoundingClientRect();
    const focusLine = Math.min(window.innerHeight / 2, 310);
    const reachedBreak = section.top <= focusLine && focusLine < section.bottom;
    if (reachedBreak === resting) return;

    resting = reachedBreak;
    document.body.classList.toggle('is-break', resting);
    clock.textContent = resting ? '00:20' : '20:00';
    phase.textContent = resting ? phase.dataset.restPhase : idlePhase;
    dial.setAttribute('aria-label', resting ? dial.dataset.restLabel : idleLabel);
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(updatePhase);
  }

  new ResizeObserver(() => {
    drawRestSky(canvas);
    scheduleUpdate();
  }).observe(canvas);
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  updatePhase();
}

const languagePicker = document.querySelector('[data-language-picker]');
if (languagePicker) {
  document.addEventListener('click', (event) => {
    if (!languagePicker.contains(event.target)) languagePicker.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !languagePicker.open) return;

    languagePicker.open = false;
    languagePicker.querySelector('summary').focus();
  });
}
