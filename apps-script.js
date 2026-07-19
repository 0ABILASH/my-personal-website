function doGet(e) {
  var action = e.parameter.action;

  if (action === 'travel') {
    return getTravelData();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: 'Unknown action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Downloads');
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.location || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTravelData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = ss.getSheets().map(function(s) { return s.getName(); });

  var placesSheet = null;
  var routesSheet = null;

  for (var i = 0; i < allSheets.length; i++) {
    var name = allSheets[i].toLowerCase().trim();
    if (name === 'places') placesSheet = ss.getSheets()[i];
    if (name.indexOf('route') !== -1) routesSheet = ss.getSheets()[i];
  }

  var places = [];
  if (placesSheet) {
    var placesData = placesSheet.getDataRange().getValues();
    placesData.shift();
    places = placesData
      .filter(function(r) { return r[0] && r[2] && r[3]; })
      .map(function(r) {
        return {
          city: String(r[0] || ''),
          country: String(r[1] || ''),
          lat: parseFloat(r[2]) || 0,
          lng: parseFloat(r[3]) || 0,
          emoji: String(r[4] || ''),
          date: String(r[5] || '')
        };
      });
  }

  var routes = [];
  if (routesSheet) {
    var routesData = routesSheet.getDataRange().getValues();
    routesData.shift();
    routes = routesData
      .filter(function(r) { return r[0] && r[2]; })
      .map(function(r) {
        var points = String(r[2] || '')
          .split(';')
          .map(function(p) {
            var parts = p.trim().split(',');
            var lat = parseFloat(parts[0]);
            var lng = parseFloat(parts[1]);
            return (lat && lng) ? [lat, lng] : null;
          })
          .filter(function(p) { return p !== null; });
        return {
          name: String(r[0] || ''),
          color: String(r[1] || '#a855f7'),
          points: points
        };
      })
      .filter(function(r) { return r.points.length > 1; });
  }

  var output = {
    places: places,
    routes: routes,
    _debug: {
      allSheets: allSheets,
      placesFound: !!placesSheet,
      routesFound: !!routesSheet,
      placesCount: places.length,
      routesCount: routes.length
    }
  };

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}
