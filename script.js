const themeButton = document.querySelector('#theme-toggle');
const savedTheme = localStorage.getItem('silvio-cv-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
function updateThemeButton() {
  const dark = document.body.classList.contains('dark');
  themeButton.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeButton.title = dark ? 'Ativar tema claro' : 'Ativar tema escuro';
}
updateThemeButton();
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('silvio-cv-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeButton();
});
document.querySelector('#print-button').addEventListener('click', () => window.print());

// O endpoint é criado e publicado pelo proprietário da planilha; vazio mantém o rastreamento desligado.
const ANALYTICS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxhTzuIcthrmttJm3cIzWa3wLqzSklklyElkKm87iJo2pfhfivIxblCb0_KZxAtXV0p1Q/exec';
const analyticsNotice = document.querySelector('#analytics-note');
if (ANALYTICS_ENDPOINT) analyticsNotice.hidden = false;

function getBrowserFamily(ua) {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Chrome\//i.test(ua) || /CriOS\//i.test(ua)) return 'Chrome';
  if (/Safari\//i.test(ua)) return 'Safari';
  return 'Outro';
}
function getOperatingSystem(ua) {
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Macintosh|Mac OS/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Outro';
}
function getDeviceCategory(ua) {
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  if (/Mobi|iPhone|Android/i.test(ua)) return 'Celular';
  return 'Computador';
}
function sendAnalytics(eventName, element = '') {
  if (!ANALYTICS_ENDPOINT) return;
  const ua = navigator.userAgent || '';
  const event = {
    event: eventName,
    browser: getBrowserFamily(ua),
    system: getOperatingSystem(ua),
    device: getDeviceCategory(ua),
    element
  };
  fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(event),
    keepalive: true
  }).catch(() => {});
}

if (ANALYTICS_ENDPOINT) {
  sendAnalytics('visualizacao');
  document.addEventListener('click', (event) => {
    const trackedElement = event.target.closest('[data-track]');
    if (trackedElement) sendAnalytics('clique', trackedElement.dataset.track);
  });
}
