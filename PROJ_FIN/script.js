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
