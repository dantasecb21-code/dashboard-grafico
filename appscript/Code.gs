/**
 * Dashboard Grafico - Google Apps Script
 *
 * Como publicar:
 * 1. Abra a planilha > Extensoes > Apps Script
 * 2. Cole este codigo no editor (arquivo Code.gs)
 * 3. Clique em "Implantar" > "Nova implantacao"
 * 4. Tipo: Aplicativo da Web
 *    - Executar como: Eu mesmo
 *    - Quem tem acesso: Qualquer pessoa
 * 5. Copie a URL gerada e cole no .env.local como APPS_SCRIPT_URL
 */

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var sheetName = params.sheet || "";
  var action = params.action || "data";

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "sheets") {
    var names = ss.getSheets().map(function (s) { return s.getName(); });
    return jsonResponse({ sheets: names });
  }

  var sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];

  if (!sheet) {
    return jsonResponse({ error: "Aba nao encontrada: " + sheetName });
  }

  var allSheetNames = ss.getSheets().map(function (s) { return s.getName(); });
  var data = readSheet(sheet);

  return jsonResponse({
    sheet: sheet.getName(),
    sheets: allSheetNames,
    headers: data.headers,
    rows: data.rows,
    updatedAt: new Date().toISOString()
  });
}

function readSheet(sheet) {
  var range = sheet.getDataRange();
  var values = range.getValues();

  if (!values || values.length < 2) {
    return { headers: [], rows: [] };
  }

  // First row may have merged group headers; second row has sub-headers
  // Detect if row[1] looks like a separator (all :-:) or actual data
  var firstRow = values[0];
  var secondRow = values[1];

  var headers = firstRow.map(function (h, i) {
    var h1 = String(h).trim();
    var h2 = secondRow[i] ? String(secondRow[i]).trim() : "";
    if (h2 && h2 !== "" && h1 !== h2 && h1 !== "") {
      return h1 + "/" + h2;
    }
    return h1 || h2 || "col" + i;
  });

  // If second row looks like data (not sub-headers), use only first row as headers
  // Heuristic: if second row first cell looks like a name/value, it's data
  var isSubHeader = secondRow.every(function (v) {
    var s = String(v).trim();
    return s === "" || /^[A-Z\s\/\.]+$/.test(s) || s.length < 40;
  });

  var dataStartRow = isSubHeader ? 2 : 1;
  headers = firstRow.map(function (h) { return String(h).trim(); });

  var rows = values.slice(dataStartRow).filter(function (row) {
    return row.some(function (cell) { return String(cell).trim() !== ""; });
  }).map(function (row) {
    return row.map(function (cell) {
      if (cell instanceof Date) return cell.toISOString();
      return cell;
    });
  });

  return { headers: headers, rows: rows };
}

function jsonResponse(obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
