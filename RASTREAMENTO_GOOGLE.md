# Configurar estatísticas de visita no Google Sheets

A página está preparada para registrar uma linha por visualização e por clique em itens selecionados. Os campos são data/hora, evento, categoria do navegador, sistema, tipo de dispositivo e um identificador fixo do link clicado. O código não envia nome, e-mail, URL completa, página de referência, IP ou identificador persistente de visitante para a planilha.

## 1. Preparar a aba da planilha e autorizar o Apps Script

1. Entre na conta Google que deve ser dona dos dados e abra [script.google.com](https://script.google.com/).
2. Crie um projeto, abra o arquivo `Code.gs` e substitua o conteúdo pelo arquivo `rastreamento-google/Code.gs` desta pasta.
3. No seletor de funções, escolha `setup` e clique em **Executar**. Autorize o acesso solicitado ao Google Sheets. A execução cria uma aba separada chamada **Eventos** na planilha informada e mantém as demais abas intactas. Sua conta precisa ter permissão para editar essa planilha.

## 2. Publicar o endpoint para visitantes

1. No projeto do Apps Script, abra **Implantar → Nova implantação → Aplicativo da Web**.
2. Escolha **Executar como: você**.
3. Para receber registros de visitantes que não estão conectados na sua conta Google, o aplicativo precisa aceitar acesso anônimo. Essa configuração torna público o endpoint de gravação. Ela não torna a planilha pública nem permite que visitantes leiam seus dados.
4. Implante e copie a URL terminada em `/exec`.

Mantenha o compartilhamento da planilha restrito. O endpoint público pode receber requisições de qualquer pessoa; o script limita os campos e aplica um limite simples de eventos por minuto, mas isso não impede todo tipo de spam. A aba de eventos será acrescentada à planilha informada, sem mexer na aba existente.

## 3. Ativar o envio na página

Abra `script.js` e substitua a string vazia da constante `ANALYTICS_ENDPOINT` pela URL `/exec` copiada. Salve e publique novamente os arquivos do currículo. A nota de transparência no rodapé aparece automaticamente quando o endereço está configurado.

O conector Google Drive/Sheets está desativado para esta sessão e o link abre somente para leitura aqui. A autorização do Apps Script e a implantação precisam ser feitas pela conta que tem permissão de edição nessa planilha. Depois de implantar, envie a URL `/exec` para configurar a página.
