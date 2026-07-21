function doGet(e) {
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
