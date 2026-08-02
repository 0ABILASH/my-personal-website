// Blog likes for the personal website.
//
// HOW TO INSTALL:
// 1. Open your Apps Script project (the same one that powers the tracker at GAS_URL in server.js).
// 2. Paste the three functions below into any .gs file (e.g. Code.gs).
// 3. Add the two action branches to your existing doGet(e) (see WIRING below).
// 4. Deploy -> New deployment -> Web app, then copy the new /exec URL into server.js GAS_URL.
//
// The sheet "BlogLikes" (headers: postId, count) is created automatically on first use.

function blogLikesSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('BlogLikes');
  if (!sheet) {
    sheet = ss.insertSheet('BlogLikes');
    sheet.appendRow(['postId', 'count']);
  }
  return sheet;
}

function getBlogLikes_() {
  var sheet = blogLikesSheet_();
  var data = sheet.getDataRange().getValues();
  var likes = {};
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][0]);
    if (id) likes[id] = Number(data[i][1]) || 0;
  }
  return likes;
}

function addBlogLike_(postId, add) {
  var sheet = blogLikesSheet_();
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(postId)) {
      rowIndex = i + 1;
      break;
    }
  }
  var count;
  if (rowIndex === -1) {
    count = add ? 1 : 0;
    sheet.appendRow([String(postId), count]);
  } else {
    var cur = Number(data[rowIndex - 1][1]) || 0;
    count = Math.max(0, add ? cur + 1 : cur - 1);
    sheet.getRange(rowIndex, 2).setValue(count);
  }
  return { postId: String(postId), count: count };
}

// WIRING — inside your existing doGet(e), add these branches:
//
//   var action = e && e.parameter && e.parameter.action;
//   if (action === 'getLikes') {
//     return ContentService.createTextOutput(JSON.stringify({ likes: getBlogLikes_() }))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
//   if (action === 'addLike' || action === 'removeLike') {
//     var result = addBlogLike_(e.parameter.postId, action === 'addLike');
//     return ContentService.createTextOutput(JSON.stringify(result))
//       .setMimeType(ContentService.MimeType.JSON);
//   }
//   // ... keep your existing 'track' / 'travel' logic below ...
