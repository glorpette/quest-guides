(() => {
  const progress = document.querySelector('.reading-progress span');
  const sections = [...document.querySelectorAll('.guide-section[id]')];
  const navLinks = [...document.querySelectorAll('.guide-nav a')];

  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    progress.style.width = `${percent}%`;
  };

  const updateActiveLink = () => {
    if (!sections.length) return;
    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 140) || sections[0];
    navLinks.forEach(link => link.toggleAttribute('aria-current', link.getAttribute('href') === `#${current.id}`));
  };

  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        const original = button.textContent;
        button.textContent = 'Copied';
        window.setTimeout(() => { button.textContent = original; }, 1400);
      } catch {
        button.textContent = 'Select command';
      }
    });
  });

  window.addEventListener('scroll', () => {
    updateProgress();
    updateActiveLink();
  }, { passive: true });

  updateProgress();
  updateActiveLink();
})();
