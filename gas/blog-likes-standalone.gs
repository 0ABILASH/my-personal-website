// =============================================================
//  BLOG LIKES — STANDALONE APPS SCRIPT (complete file)
//  No merging needed. Paste this whole file into Code.gs.
// =============================================================
//  SETUP:
//  1. Go to https://script.google.com and click "+ New project".
//  2. Delete everything in Code.gs, paste this entire file. Save.
//  3. Deploy -> New deployment -> Web app.
//       - Execute as: Me
//       - Who has access: Anyone
//  4. Click Deploy. First time: review permissions -> Allow.
//  5. Copy the /exec URL.
//  6. Put that URL into server.js (GAS_URL). Restart the server.
//
//  A "BlogLikes" sheet (postId, count) is created automatically
//  in this project's spreadsheet on first use.
//
//  IMPORTANT (standalone scripts): paste YOUR spreadsheet ID below.
//  How to find it: create a spreadsheet at https://sheets.new,
//  then look at its URL: https://docs.google.com/spreadsheets/d/PASTE-THIS-PART/edit
// =============================================================

var LIKES_SPREADSHEET_ID = 'PASTE-YOUR-SPREADSHEET-ID-HERE';

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || '';

  if (action === 'getLikes') {
    return jsonOutput({ likes: getBlogLikes_() });
  }

  if (action === 'addLike' || action === 'removeLike') {
    var postId = String(e.parameter.postId || '');
    if (!postId) return jsonOutput({ error: 'missing postId' });
    var result = addBlogLike_(postId, action === 'addLike');
    return jsonOutput(result);
  }

  return jsonOutput({ status: 'ok' });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function blogLikesSheet_() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss && LIKES_SPREADSHEET_ID && LIKES_SPREADSHEET_ID.indexOf('PASTE-') === -1) {
    ss = SpreadsheetApp.openById(LIKES_SPREADSHEET_ID);
  }
  if (!ss) throw new Error('BlogLikes: no spreadsheet available. Set LIKES_SPREADSHEET_ID or bind this script to a spreadsheet.');
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
