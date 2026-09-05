const frame = document.querySelector('.project-frame');
const showcase = document.querySelector('.showcase');
const motion = matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (min-width: 701px)');
let pending = 0;
showcase.addEventListener('pointermove', (event) => {
  if (!motion.matches) return;
  const rect = showcase.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  cancelAnimationFrame(pending);
  pending = requestAnimationFrame(() => {
    frame.style.setProperty('--rx', `${-y * 7}deg`);
    frame.style.setProperty('--ry', `${x * 8}deg`);
  });
});
function reset(){ cancelAnimationFrame(pending); frame.style.removeProperty('--rx'); frame.style.removeProperty('--ry'); }
showcase.addEventListener('pointerleave', reset);
motion.addEventListener('change', reset);
