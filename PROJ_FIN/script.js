const filterButtons = document.querySelectorAll('.filter-button');
const cards = [...document.querySelectorAll('.artist-card')];
const searchInput = document.querySelector('#artist-search');
const count = document.querySelector('#artist-count');
const emptyState = document.querySelector('#empty-state');
let activeFilter = 'Todos';

function updateCatalog() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  cards.forEach(card => {
    const matchesGenre = activeFilter === 'Todos' || card.dataset.genre === activeFilter;
    const matchesSearch = card.dataset.name.toLocaleLowerCase('pt-BR').includes(query);
    const show = matchesGenre && matchesSearch;
    card.hidden = !show;
    if (show) visible++;
  });
  count.textContent = String(visible).padStart(2, '0');
  emptyState.hidden = visible !== 0;
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('selected', item === button));
    updateCatalog();
  });
});

searchInput.addEventListener('input', updateCatalog);

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

(() => {
  // CARROSSEL
  const carousel = document.querySelector('#stx-carousel');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.stx-slide')];
    const dots = [...document.querySelectorAll('.stx-carousel-dots button')];
    const previous = document.querySelector('.stx-carousel-prev');
    const next = document.querySelector('.stx-carousel-next');
    let currentSlide = 0;

    function showSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentSlide);
        if (i === currentSlide) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }
    previous?.addEventListener('click', () => showSlide(currentSlide - 1));
    next?.addEventListener('click', () => showSlide(currentSlide + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
  }

  // PAINEL DE ACESSIBILIDADE
  const accessToggle = document.querySelector('#stx-accessibility-toggle');
  const accessPanel = document.querySelector('#stx-accessibility-panel');
  const closeAccess = document.querySelector('#stx-close-accessibility');

  function setPanelOpen(open) {
    if (!accessPanel || !accessToggle) return;
    accessPanel.hidden = !open;
    accessToggle.setAttribute('aria-expanded', String(open));
  }
  accessToggle?.addEventListener('click', () => setPanelOpen(accessPanel.hidden));
  closeAccess?.addEventListener('click', () => setPanelOpen(false));

  const savedTheme = localStorage.getItem('stx-theme');
  const savedScale = Number(localStorage.getItem('stx-font-scale')) || 1;
  const savedContrast = localStorage.getItem('stx-high-contrast') === 'true';

  function setTheme(theme) {
    document.body.classList.remove('stx-light-mode', 'stx-dark-mode');
    document.body.classList.add(theme === 'light' ? 'stx-light-mode' : 'stx-dark-mode');
    localStorage.setItem('stx-theme', theme);
  }
  function setFontScale(scale) {
    const safeScale = Math.min(1.3, Math.max(0.85, scale));
    document.body.style.setProperty('--stx-font-scale', safeScale);
    localStorage.setItem('stx-font-scale', String(safeScale));
  }
  function setHighContrast(enabled) {
    document.body.classList.toggle('stx-high-contrast', enabled);
    const button = document.querySelector('#stx-contrast-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(enabled));
      button.textContent = enabled ? 'Desativar alto contraste' : 'Ativar alto contraste';
    }
    localStorage.setItem('stx-high-contrast', String(enabled));
  }

  if (savedTheme) setTheme(savedTheme);
  setFontScale(savedScale);
  setHighContrast(savedContrast);

  document.querySelector('#stx-theme-light')?.addEventListener('click', () => setTheme('light'));
  document.querySelector('#stx-theme-dark')?.addEventListener('click', () => setTheme('dark'));
  document.querySelector('#stx-font-increase')?.addEventListener('click', () => {
    setFontScale((Number(localStorage.getItem('stx-font-scale')) || 1) + 0.1);
  });
  document.querySelector('#stx-font-decrease')?.addEventListener('click', () => {
    setFontScale((Number(localStorage.getItem('stx-font-scale')) || 1) - 0.1);
  });
  document.querySelector('#stx-font-reset')?.addEventListener('click', () => setFontScale(1));
  document.querySelector('#stx-contrast-toggle')?.addEventListener('click', () => {
    setHighContrast(!document.body.classList.contains('stx-high-contrast'));
  });

  // TELA DE LOGIN DEMONSTRATIVA
  const loginScreen = document.querySelector('#stx-login-screen');
  const openLogin = document.querySelector('#stx-open-login');
  const closeLogin = document.querySelector('#stx-close-login');
  const loginForm = document.querySelector('#stx-login-form');
  const feedback = document.querySelector('#stx-login-feedback');

  function showLogin(show) {
    if (!loginScreen) return;
    loginScreen.hidden = !show;
    loginScreen.setAttribute('aria-hidden', String(!show));
    document.body.style.overflow = show ? 'hidden' : '';
    if (show) document.querySelector('#stx-email')?.focus();
    else openLogin?.focus();
  }
  openLogin?.addEventListener('click', event => {
    event.preventDefault();
    showLogin(true);
  });
  closeLogin?.addEventListener('click', () => showLogin(false));
  loginScreen?.addEventListener('click', event => {
    if (event.target === loginScreen) showLogin(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && loginScreen && !loginScreen.hidden) showLogin(false);
  });
  loginForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    if (feedback) feedback.textContent =
      'Formulário validado! A autenticação real será implementada em uma versão futura.';
  });
})();
