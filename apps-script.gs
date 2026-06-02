// ─────────────────────────────────────────────────────────────────────────────
// Certtus · Calibração de Demandas · Google Apps Script
// Versão: 1.0 — cole este código inteiro no Apps Script e publique como Web App
// ─────────────────────────────────────────────────────────────────────────────

// Configurações — ajuste se quiser nomes de aba diferentes
var CONFIG = {
  RAW_SHEET:     "Respostas",          // aba com uma linha por resposta por demanda
  SUMMARY_SHEET: "Resumo",             // aba com pivot por demanda (adicionada depois)
  RESPONDENTS_SHEET: "Respondentes"    // aba com uma linha por pessoa que enviou
};

// ─── Ponto de entrada POST ────────────────────────────────────────────────────
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    writeResponses(payload);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Escreve as respostas na planilha ─────────────────────────────────────────
function writeResponses(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── aba Respostas (uma linha por demanda por respondente) ──────────────────
  var rawSheet = getOrCreateSheet(ss, CONFIG.RAW_SHEET);
  if (rawSheet.getLastRow() === 0) {
    rawSheet.appendRow([
      "Timestamp", "Respondente",
      "Chave", "Projeto", "Tipo", "Sumário",
      "Ambiguidade", "Escopo", "Risco", "Classe", "Faixa", "Justificativa"
    ]);
    rawSheet.getRange(1, 1, 1, 12).setFontWeight("bold")
      .setBackground("#1B315F").setFontColor("white");
    rawSheet.setFrozenRows(1);
  }

  var ts = payload.timestamp || new Date().toISOString();
  var respondent = payload.respondent || "Anônimo";

  payload.answers.forEach(function(a) {
    rawSheet.appendRow([
      ts, respondent,
      a.key, a.proj, a.type, a.summ,
      a.ambig, a.escopo, a.risco,
      a.classe ? "C" + a.classe : "",
      a.faixa || "",
      a.nota || ""
    ]);
  });

  // ── aba Respondentes (uma linha por envio) ─────────────────────────────────
  var respSheet = getOrCreateSheet(ss, CONFIG.RESPONDENTS_SHEET);
  if (respSheet.getLastRow() === 0) {
    respSheet.appendRow(["Timestamp", "Respondente", "Total classificadas", "Total enviadas"]);
    respSheet.getRange(1, 1, 1, 4).setFontWeight("bold")
      .setBackground("#1B315F").setFontColor("white");
    respSheet.setFrozenRows(1);
  }
  var filled = payload.answers.filter(function(a){ return a.classe !== ""; }).length;
  respSheet.appendRow([ts, respondent, filled, payload.answers.length]);

  // auto-resize colunas da aba Respostas
  try { rawSheet.autoResizeColumns(1, 12); } catch(e) {}
}

// ─── Utilitário: pega ou cria uma aba pelo nome ────────────────────────────────
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// ─── Ponto de entrada GET (teste de saúde) ────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Certtus Calibração Web App ativo." }))
    .setMimeType(ContentService.MimeType.JSON);
}
