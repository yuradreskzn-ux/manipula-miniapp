const YCLIENTS_URL = 'https://b776703.yclients.com/';

const services = {
  laser: [
    ['Всё тело', 'комплекс', '6 666 ₽'],
    ['Бикини + подмышки', 'комплекс', 'от 1 990 ₽'],
    ['Ноги полностью', '60 минут', 'от 2 490 ₽'],
    ['Лицо', '20 минут', 'от 990 ₽'],
  ],
  massage: [
    ['Коррекционный массаж', '60 минут', 'от 1 990 ₽'],
    ['Лимфодренажный массаж', '60 минут', 'от 1 990 ₽'],
    ['Абонемент на массаж', '5 процедур', 'от 8 900 ₽'],
    ['Пробный сеанс', '30 минут', '990 ₽'],
  ],
};

const tg = window.Telegram?.WebApp;
let selectedStudio = 'Пушкина, 17';

function renderServices(category = 'laser') {
  const list = document.getElementById('serviceList');
  list.innerHTML = services[category].map(([name, time, price]) => `
    <button class="service-row" type="button" data-book>
      <span><b>${name}</b><small>${time}</small></span>
      <span class="service-price">${price}<span>↗</span></span>
    </button>`).join('');
}

function showSheet() {
  document.getElementById('sheetBackdrop').hidden = false;
  document.getElementById('bookingSheet').hidden = false;
  if (tg) tg.BackButton.show();
}

function closeSheet() {
  document.getElementById('sheetBackdrop').hidden = true;
  document.getElementById('bookingSheet').hidden = true;
  if (tg) tg.BackButton.hide();
}

function openBooking() {
  if (tg?.openLink) tg.openLink(YCLIENTS_URL);
  else window.open(YCLIENTS_URL, '_blank', 'noopener');
}

function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#f8f8f8');
  tg.setBackgroundColor('#f8f8f8');
  tg.BackButton.onClick(closeSheet);
}

document.addEventListener('click', (event) => {
  const bookingButton = event.target.closest('[data-book]');
  if (bookingButton) { showSheet(); return; }

  const scrollButton = event.target.closest('[data-scroll]');
  if (scrollButton) document.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const location = event.target.closest('.location-card');
  if (location) {
    document.querySelectorAll('.location-card').forEach((card) => card.classList.remove('selected'));
    location.classList.add('selected');
    selectedStudio = location.dataset.location;
    document.getElementById('selectedStudioText').textContent = selectedStudio;
  }
});

document.querySelectorAll('.service-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.service-tab').forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  renderServices(tab.dataset.category);
}));

document.getElementById('closeSheet').addEventListener('click', closeSheet);
document.getElementById('sheetBackdrop').addEventListener('click', closeSheet);
document.getElementById('openYclients').addEventListener('click', openBooking);
document.getElementById('changeStudio').addEventListener('click', () => { closeSheet(); document.getElementById('locations').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
document.getElementById('cityButton').addEventListener('click', () => { document.getElementById('cityPopover').hidden = false; });
document.getElementById('closeCity').addEventListener('click', () => { document.getElementById('cityPopover').hidden = true; });

renderServices();
initTelegram();
