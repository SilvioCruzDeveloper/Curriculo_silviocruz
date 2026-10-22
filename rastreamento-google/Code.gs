const TRACKING_SPREADSHEET_ID = '1SfSbAMMklfgxYu8QzmAQlYWMRJK7rSoOZbLjQ6CXn3w';
const TRACKING_TAB_NAME = 'Eventos';
const HEADERS = ['Data/hora (UTC)', 'Evento', 'Navegador', 'Sistema', 'Dispositivo', 'Elemento'];
const ALLOWED_EVENTS = new Set(['visualizacao', 'clique']);
const ALLOWED_BROWSERS = new Set(['Chrome', 'Firefox', 'Safari', 'Edge', 'Outro']);
const ALLOWED_SYSTEMS = new Set(['Android', 'iOS', 'Windows', 'macOS', 'Linux', 'Outro']);
const ALLOWED_DEVICES = new Set(['Celular', 'Tablet', 'Computador']);
const ALLOWED_ELEMENTS = new Set([
  'nav:manutencao', 'nav:tecnologia', 'nav:atendimento', 'nav:formacao',
  'segmento:manutencao', 'segmento:tecnologia', 'segmento:atendimento',
  'cabecalho:download-pdf', 'cabecalho:imprimir', 'cabecalho:tema',
  'contato:email', 'contato:telefone', 'contato:linkedin',
  'link:github', 'link:portfolio', 'projeto:pagcompleto',
  'projeto:empilhadeiras', 'projeto:portfolio', 'rodape:github'
]);

/** Execute uma vez no editor; usa a planilha informada e cria uma aba separada. */
function setup() {
  const spreadsheet = SpreadsheetApp.openById(TRACKING_SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(TRACKING_TAB_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(TRACKING_TAB_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  Logger.log('Aba de métricas pronta: ' + spreadsheet.getUrl() + '#gid=' + sheet.getSheetId());
  return spreadsheet.getUrl();
}

/** Recebe eventos pequenos e validados; não grava IP, URL, referência nem ID de visitante. */
function doPost(e) {
  const body = e && e.postData && e.postData.contents;
  if (!body) return response_('ignored');

  let data;
  try { data = JSON.parse(body); } catch (_) { return response_('ignored'); }
  if (!data || !ALLOWED_EVENTS.has(data.event)) return response_('ignored');

  const item = data.event === 'clique' ? String(data.element || '') : '';
  if (data.event === 'clique' && !ALLOWED_ELEMENTS.has(item)) return response_('ignored');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(3000)) return response_('busy');
  try {
    // Limita rajadas acidentais ou abuso simples do endpoint público.
    const minuteKey = 'events-' + Math.floor(Date.now() / 60000);
    const cache = CacheService.getScriptCache();
    const count = Number(cache.get(minuteKey) || 0);
    if (count >= 120) return response_('rate-limited');
    cache.put(minuteKey, String(count + 1), 90);

    const sheet = SpreadsheetApp.openById(TRACKING_SPREADSHEET_ID).getSheetByName(TRACKING_TAB_NAME);
    if (!sheet) return response_('not-configured');
    sheet.appendRow([
      new Date(),
      data.event,
      allowed_(data.browser, ALLOWED_BROWSERS),
      allowed_(data.system, ALLOWED_SYSTEMS),
      allowed_(data.device, ALLOWED_DEVICES),
      item
    ]);
    return response_('ok');
  } finally {
    lock.releaseLock();
  }
}

function allowed_(value, allowedValues) {
  const text = String(value || 'Outro');
  return allowedValues.has(text) ? text : 'Outro';
}

function response_(text) {
  return ContentService.createTextOutput(text);
}
