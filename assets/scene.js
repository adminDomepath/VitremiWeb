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
  const canvas = document.querySelector('.rest-sky canvas');
  const dial = document.querySelector('.timer-dial');
  const origin = dial.parentElement;
  const destination = breakSection.querySelector('.timer-destination');
  const clock = dial.querySelector('strong');
  const phase = dial.querySelector('[data-rest-phase]');
  const workLabel = dial.getAttribute('aria-label');
  const workPhase = phase.textContent;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const workSeconds = 20 * 60;
  const breakSeconds = 20;
  let frame = 0;
  let resting = false;
  let breakDeadline = 0;
  let breakTick = 0;

  function showTime(remaining, duration) {
    const seconds = Math.ceil(remaining);
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const fraction = remaining / duration;
    const display = `${minutes}:${String(seconds % 60).padStart(2, '0')}`;

    if (clock.textContent !== display) clock.textContent = display;
    dial.style.setProperty('--ring-offset', (100 * (1 - fraction)).toFixed(2));
    dial.style.setProperty('--ring-visible', fraction > 0 ? '1' : '0');
  }

  function updateBreakTime() {
    const remaining = Math.max(0, (breakDeadline - performance.now()) / 1000);
    showTime(remaining, breakSeconds);
    if (remaining === 0) window.clearInterval(breakTick);
  }

  function updatePhase() {
    frame = 0;
    const section = breakSection.getBoundingClientRect();
    const start = origin.getBoundingClientRect();
    const end = destination.getBoundingClientRect();
    const focusLine = Math.min(window.innerHeight / 2, 310);
    const reachedBreak = section.top <= focusLine && focusLine < section.bottom;
    const startCenter = start.top + start.height / 2;
    const distance = end.top - start.top;
    const followLine = Math.min(startCenter + window.scrollY, window.innerHeight * 0.6);
    const travel = reduceMotion.matches
      ? (section.top <= focusLine ? distance : 0)
      : Math.max(0, Math.min(distance, followLine - startCenter));

    dial.style.setProperty('--timer-travel', `${travel}px`);

    if (reachedBreak !== resting) {
      resting = reachedBreak;
      document.body.classList.toggle('is-break', resting);
      phase.textContent = resting ? phase.dataset.restPhase : workPhase;
      dial.setAttribute('aria-label', resting ? dial.dataset.restLabel : workLabel);
      window.clearInterval(breakTick);

      if (resting) {
        breakDeadline = performance.now() + breakSeconds * 1000;
        showTime(breakSeconds, breakSeconds);
        breakTick = window.setInterval(updateBreakTime, 50);
      }
    }

    if (!resting) {
      const workDistance = Math.max(1, window.scrollY + section.top - focusLine);
      // Leave a short stretch at zero before entering the break.
      const progress = Math.min(1, Math.max(0, window.scrollY / (workDistance * 0.94)));
      showTime(workSeconds * (1 - progress), workSeconds);
    }
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
  reduceMotion.addEventListener('change', scheduleUpdate);
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

const blinkOrb = document.querySelector('.blink-orb');
if (blinkOrb) {
  const eye = blinkOrb.querySelector('.blink-eye');
  const pupil = eye.querySelector('.blink-pupil');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visibleFraction = 0.65;
  let visible = false;
  let animation;

  function centerPupil() {
    pupil.removeAttribute('transform');
  }

  function updateBlink() {
    if (!visible || document.hidden || reduceMotion.matches) {
      animation?.cancel();
      animation = undefined;
      centerPupil();
      return;
    }

    if (animation) return;

    // Match the three closures in the app's five-second BlinkingEye cycle.
    const duration = 5000;
    const keyframes = [
      [0, 1], [500, 1], [620, 0.08], [740, 1],
      [860, 1], [980, 0.08], [1100, 1],
      [2400, 1], [2520, 0.08], [2640, 1], [duration, 1]
    ].map(([time, openness]) => ({
      offset: time / duration,
      transform: `scaleY(${openness})`,
      easing: 'ease-in-out'
    }));

    animation = eye.animate(keyframes, { duration, iterations: Infinity });
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= visibleFraction;
    updateBlink();
  }, { threshold: visibleFraction }).observe(blinkOrb);

  document.addEventListener('pointermove', (event) => {
    if (!animation || event.pointerType !== 'mouse') return;

    const orb = blinkOrb.getBoundingClientRect();
    const x = event.clientX - (orb.left + orb.width / 2);
    const y = event.clientY - (orb.top + orb.height / 2);
    const distance = Math.max(75, Math.hypot(x, y));
    pupil.setAttribute('transform', `translate(${8 * x / distance} ${4 * y / distance})`);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', centerPupil);
  document.addEventListener('visibilitychange', updateBlink);
  reduceMotion.addEventListener('change', updateBlink);
}
