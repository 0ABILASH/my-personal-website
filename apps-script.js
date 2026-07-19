// ============================================================
// Google Apps Script — paste this into your Apps Script editor
// https://script.google.com → your project → Code.gs
// Then RE-DEPLOY as Web app (Execute as: Me, Access: Anyone)
// ============================================================

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'travel') {
    return getTravelData();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // existing CV download tracking
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Downloads')
    || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.location || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTravelData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Read "Places" sheet ---
  const placesSheet = ss.getSheetByName('Places');
  const placesData = placesSheet
    ? placesSheet.getDataRange().getValues()
    : [];
  const placesHeader = placesData.shift() || [];
  const places = placesData
    .filter(r => r[0])
    .map(r => ({
      city:    r[0] || '',
      country: r[1] || '',
      lat:     parseFloat(r[2]) || 0,
      lng:     parseFloat(r[3]) || 0,
      emoji:   r[4] || '📍',
      date:    r[5] || '',
    }));

  // --- Read "Routes" sheet ---
  const routesSheet = ss.getSheetByName('Routes');
  const routesData = routesSheet
    ? routesSheet.getDataRange().getValues()
    : [];
  routesData.shift(); // remove header row
  const routes = routesData
    .filter(r => r[0])
    .map(r => ({
      name:  r[0] || '',
      color: r[1] || '#a855f7',
      points: (r[2] || '')
        .split(';')
        .map(p => {
          const [lat, lng] = p.split(',').map(Number);
          return lat && lng ? [lat, lng] : null;
        })
        .filter(Boolean),
    }))
    .filter(r => r.points.length > 0);

  return ContentService
    .createTextOutput(JSON.stringify({ places, routes }))
    .setMimeType(ContentService.MimeType.JSON);
}
