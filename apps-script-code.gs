function doGet(e) {
  var p = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (p.action === "travel") {
    var sheet = ss.getSheetByName("Places");
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({places: []})).setMimeType(ContentService.MimeType.JSON);

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var places = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var place = {};
      for (var j = 0; j < headers.length; j++) {
        place[String(headers[j]).toLowerCase()] = row[j];
      }
      places.push(place);
    }

    return ContentService.createTextOutput(JSON.stringify({places: places})).setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = ss.getSheetByName("Site Data") || ss.insertSheet("Site Data");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Type","Name","Action","Date","Time","Browser","Device","OS","Screen","Language","Referrer","URL"]);
  }
  sheet.appendRow([
    p.type || "", p.name || "", p.action || "", p.date || "", p.time || "",
    p.browser || "", p.device || "", p.os || "", p.screen || "",
    p.language || "", p.referrer || "", p.url || ""
  ]);

  return ContentService.createTextOutput("ok");
}

function doPost(e) {
  var p = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Site Data") || ss.insertSheet("Site Data");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Type","Name","Action","Date","Time","Browser","Device","OS","Screen","Language","Referrer","URL"]);
  }
  sheet.appendRow([
    p.type || "", p.name || "", p.action || "", p.date || "", p.time || "",
    p.browser || "", p.device || "", p.os || "", p.screen || "",
    p.language || "", p.referrer || "", p.url || ""
  ]);
  return ContentService.createTextOutput("ok");
}
