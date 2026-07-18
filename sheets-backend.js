// ============================================================
//  Google Sheets backend for CV download tracking
//  Paste this into: Google Sheet -> Extensions -> Apps Script
//  Then Deploy -> New deployment -> Web app
//    - Execute as: Me
//    - Who has access: Anyone
//  Copy the Web app URL and set it as VITE_SHEETS_URL
// ============================================================

function doPost(e) {
  try {
    const raw = e.postData ? e.postData.getDataAsString() : '';
    const data = JSON.parse(raw);
    const name = data.name;
    if (!name || !name.toString().trim()) {
      return json({ error: 'Name is required' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Downloads');
    if (!sheet) {
      sheet = ss.insertSheet('Downloads');
      sheet.appendRow(['S.No', 'Name', 'Date', 'Time']);
    }

    const sno = sheet.getLastRow(); // row 1 = header, so row 2 => sno 1
    sheet.appendRow([
      sno,
      name.toString().trim(),
      data.date || '',
      data.time || '',
    ]);

    return json({ success: true, sno: sno });
  } catch (err) {
    return json({ error: err.message });
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Downloads');
  if (!sheet) return json([]);

  const values = sheet.getDataRange().getValues();
  const records = values.slice(1).map(function (r) {
    return { sno: r[0], name: r[1], date: r[2], time: r[3] };
  });

  return json(records);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
