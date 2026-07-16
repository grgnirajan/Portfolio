// ---- Shared helper functions ----
// Loaded first so animations.js and main.js can use these globally.

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearFieldState(fieldEl) {
  fieldEl.classList.remove('invalid', 'shake');
}

function markInvalid(fieldEl) {
  fieldEl.classList.add('invalid');
  fieldEl.classList.add('shake');
  setTimeout(function () {
    fieldEl.classList.remove('shake');
  }, 400);
}

function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
