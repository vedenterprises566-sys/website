/**
 * ============================================================================
 * VED ENTERPRISES — GOOGLE APPS SCRIPT (CLEAN VERSION FOR NEW SPREADSHEET)
 * ============================================================================
 *
 * SETUP INSTRUCTIONS:
 * 1. Paste this entire script into your NEW Google Sheet's Apps Script editor
 *    (Extensions → Apps Script → Replace all code → Save)
 *
 * 2. Add these Script Properties (⚙️ Project Settings → Script Properties):
 *    - DRIVE_FOLDER_ID        → 1-FV8jaEi3C0zOEBHRUqTjBOw6mE6NBzl
 *    - GITHUB_TOKEN           → Your GitHub Personal Access Token (optional)
 *    - GITHUB_REPO_OWNER      → Your GitHub username (optional)
 *    - GITHUB_REPO_NAME       → Your GitHub repo name (e.g. "website") (optional)
 *    - GITHUB_FILE_PATH       → public/catalog.json (optional)
 *    - GITHUB_BRANCH          → main (optional)
 *    - VERCEL_DEPLOY_HOOK_URL → Your Vercel Deploy Hook URL (optional)
 *
 * 3. Deploy as Web App:
 *    - Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Copy the /exec URL and paste it into your website's .env as VITE_APPS_SCRIPT_URL
 * ============================================================================
 */

function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    DRIVE_FOLDER_ID:    props.getProperty('DRIVE_FOLDER_ID') || '1-FV8jaEi3C0zOEBHRUqTjBOw6mE6NBzl',
    GITHUB_TOKEN:       props.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO_OWNER:  props.getProperty('GITHUB_REPO_OWNER') || '',
    GITHUB_REPO_NAME:   props.getProperty('GITHUB_REPO_NAME') || '',
    GITHUB_FILE_PATH:   props.getProperty('GITHUB_FILE_PATH') || 'public/catalog.json',
    GITHUB_BRANCH:      props.getProperty('GITHUB_BRANCH') || 'main',
    VERCEL_DEPLOY_HOOK: props.getProperty('VERCEL_DEPLOY_HOOK_URL') || '',
  };
}

function getProductsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName('Products') || ss.getSheets()[0];
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 Ved Enterprises')
    .addItem('🔄 Sync Catalog to Website', 'menuSyncCatalog')
    .addItem('ℹ️ View Catalog Summary',    'menuShowCatalogSummary')
    .addToUi();
}

function menuSyncCatalog() {
  const ui = SpreadsheetApp.getUi();
  try {
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);
    triggerVercelDeploy();
    ui.alert('✅ Synced!', JSON.parse(catalog).length + ' products pushed to website.', ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Error', err.toString(), ui.ButtonSet.OK);
  }
}

function menuShowCatalogSummary() {
  const ui = SpreadsheetApp.getUi();
  const catalog = JSON.parse(generateCatalogJson());
  const counts = {};
  catalog.forEach(function(p) { counts[p.category] = (counts[p.category] || 0) + 1; });
  const lines = ['Total Products: ' + catalog.length, '---'];
  Object.keys(counts).forEach(function(k) { lines.push(k + ': ' + counts[k]); });
  ui.alert('Catalog Summary', lines.join('\n'), ui.ButtonSet.OK);
}

function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'status';

    if (action === 'list' || action === 'catalog' || action === 'products') {
      return jsonOut(generateCatalogJson());
    }
    if (action === 'regenerate' || action === 'sync') {
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return jsonOut({ success: true, message: 'Synced.', productCount: JSON.parse(catalog).length });
    }
    if (action === 'delete') {
      return jsonOut(deleteProduct({ id: e.parameter.id, name: e.parameter.name }));
    }
    return jsonOut({ status: 'online', service: 'Ved Enterprises Catalog API', timestamp: new Date().toISOString() });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (x) { data = e.parameter || {}; }
    } else {
      data = e.parameter || {};
    }

    const action = data.action || '';

    if (action === 'delete') return jsonOut(deleteProduct(data));

    if (action === 'sync' || action === 'regenerate') {
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return jsonOut({ success: true, message: 'Synced.', productCount: JSON.parse(catalog).length });
    }

    // ADD / EDIT
    // CRITICAL FIX: Upload image to Drive FIRST to avoid Google Sheets 50,000 char crash
    const imgSource = data.image_url || data.imageUrl || data.image || data.pictureUrl || '';
    if (imgSource && (imgSource.startsWith('http') || imgSource.startsWith('data:'))) {
      const driveUrl = uploadImageToDrive(imgSource, data.name || 'product');
      if (driveUrl && driveUrl !== imgSource) {
        data.imageUrl = driveUrl;
        data.image    = driveUrl;
      }
    }

    if (action === 'edit' || action === 'update') data.isEdit = true;

    const row = saveProduct(data);
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);
    triggerVercelDeploy();

    return jsonOut({ success: true, message: data.isEdit ? 'Product updated.' : 'Product added and synced.', productId: row.id });

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return jsonOut({ success: false, error: err.toString() });
  }
}

function saveProduct(data) {
  const sheet = getProductsSheet();

  if (sheet.getLastRow() < 1) {
    sheet.appendRow([
      'id','name','category','categoryLabel','countOrDenier',
      'description','recommendedUses','features','sampleAvailable',
      'origin','popularFor','imageUrl','shadeCardUrl','badge','createdAt'
    ]);
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  let cat = (data.category || 'fancy');
  if (['winter-wear','sweaters','sweater'].indexOf(cat) !== -1) cat = 'garments';
  const catLabel = data.categoryLabel || getCategoryLabel(cat);
  const slug = (data.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const id   = data.id || ('prod-' + slug + '-' + Date.now().toString().slice(-6));
  const recUses = Array.isArray(data.recommendedUses) ? data.recommendedUses.join(', ') : (data.recommendedUses || '');
  const feats   = Array.isArray(data.features)        ? data.features.join(', ')        : (data.features || '');

  const newRow = headers.map(function(h) {
    switch (h) {
      case 'id':              return id;
      case 'name':            return data.name || 'New Product';
      case 'category':        return cat;
      case 'categoryLabel':   return catLabel;
      case 'countOrDenier':   return data.countOrDenier || data.count || '';
      case 'description':     return data.description || '';
      case 'recommendedUses': return recUses;
      case 'features':        return feats;
      case 'sampleAvailable': return (data.sampleAvailable !== false && data.sampleAvailable !== 'FALSE') ? 'TRUE' : 'FALSE';
      case 'origin':          return data.origin || 'Ved Enterprises';
      case 'popularFor':      return data.popularFor || '';
      case 'imageUrl':
      case 'image':           return data.imageUrl || data.image || '';
      case 'shadeCardUrl':    return data.shadeCardUrl || '';
      case 'badge':           return data.badge || '';
      case 'createdAt':       return new Date().toISOString();
      default:                return data[h] || '';
    }
  });

  let existRow = -1;
  if (sheet.getLastRow() >= 2) {
    const idIdx   = headers.indexOf('id');
    const nameIdx = headers.indexOf('name');
    const all     = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
    for (var i = 0; i < all.length; i++) {
      const rowId   = idIdx   >= 0 ? String(all[i][idIdx]).trim()  : '';
      const rowName = nameIdx >= 0 ? String(all[i][nameIdx]).trim() : '';
      if (
        (id && rowId === String(id).trim()) ||
        (data.originalId && rowId === String(data.originalId).trim()) ||
        (data.isEdit && data.originalName && rowName.toLowerCase() === String(data.originalName).toLowerCase().trim())
      ) { existRow = i + 2; break; }
    }
  }

  if (existRow > 0) {
    sheet.getRange(existRow, 1, 1, newRow.length).setValues([newRow]);
    return { id: id, updated: true };
  } else {
    sheet.appendRow(newRow);
    return { id: id, updated: false };
  }
}

function deleteProduct(query) {
  const sheet = getProductsSheet();
  if (sheet.getLastRow() < 2) return { success: false, message: 'Sheet is empty.' };

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idIdx   = headers.indexOf('id');
  const nameIdx = headers.indexOf('name');
  const allRows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();

  var targetRow = -1;
  for (var i = 0; i < allRows.length; i++) {
    const rowId   = idIdx   >= 0 ? String(allRows[i][idIdx]).trim().toLowerCase()   : '';
    const rowName = nameIdx >= 0 ? String(allRows[i][nameIdx]).trim().toLowerCase()  : '';
    if ((query.id   && rowId   === String(query.id).trim().toLowerCase()) ||
        (query.name && rowName === String(query.name).trim().toLowerCase())) {
      targetRow = i + 2; break;
    }
  }

  if (targetRow === -1) return { success: false, message: 'Product not found.' };
  sheet.deleteRow(targetRow);
  const catalog = generateCatalogJson();
  commitToGitHub(catalog);
  triggerVercelDeploy();
  return { success: true, message: 'Deleted and synced.', remainingProducts: JSON.parse(catalog).length };
}

function uploadImageToDrive(imgSource, productName) {
  try {
    const config = getConfig();
    if (!config.DRIVE_FOLDER_ID || !imgSource) return imgSource;

    var blob, extension = 'jpg';

    if (imgSource.startsWith('data:image')) {
      // Base64 from website upload
      const parts = imgSource.split(',');
      const mime  = parts[0].match(/data:([^;]+);/)[1];
      extension   = mime.split('/')[1] || 'jpg';
      blob        = Utilities.newBlob(Utilities.base64Decode(parts[1]), mime, 'image.' + extension);
    } else if (imgSource.startsWith('http')) {
      // External URL
      const resp = UrlFetchApp.fetch(imgSource, { muteHttpExceptions: true });
      blob       = resp.getBlob();
      extension  = blob.getContentType().split('/')[1] || 'jpg';
    } else {
      return imgSource;
    }

    const safeName = (productName || 'product').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    blob.setName(safeName + '_' + Date.now() + '.' + extension);

    const folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    const file   = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const url = 'https://drive.google.com/uc?export=view&id=' + file.getId();
    Logger.log('Image uploaded to Drive: ' + url);
    return url;
  } catch (err) {
    Logger.log('Drive upload notice: ' + err.toString());
    return imgSource;
  }
}

function generateCatalogJson() {
  const sheet = getProductsSheet();
  if (!sheet || sheet.getLastRow() < 2) return '[]';

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows    = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();

  const products = rows.map(function(row, idx) {
    const p = {};
    headers.forEach(function(h, ci) {
      var v = row[ci];
      if (h === 'recommendedUses' || h === 'features') {
        v = (typeof v === 'string' && v.trim()) ? v.split(',').map(function(s){ return s.trim(); }).filter(Boolean) : [];
      }
      if (h === 'sampleAvailable') v = String(v).toUpperCase() === 'TRUE';
      if (h !== 'createdAt') p[h] = v;
    });

    if (!p.id) {
      const slug = (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      p.id = 'prod-' + (slug || (idx + 1));
    }
    if (['winter-wear','sweaters','sweater'].indexOf(p.category) !== -1) p.category = 'garments';
    if (!p.categoryLabel) p.categoryLabel = getCategoryLabel(p.category);
    return p;
  }).filter(function(p) { return p.name && String(p.name).trim() !== ''; });

  return JSON.stringify(products, null, 2);
}

function getCategoryLabel(cat) {
  const map = {
    'fancy': 'Fancy Yarn', 'china': 'China / Imported Yarn',
    'acrylic-blends': 'Acrylic & Blends', 'fabrics': 'Fabrics & Textile Rolls',
    'garments': 'Winter Wear', 'winter-wear': 'Winter Wear',
  };
  return map[cat] || 'Fancy Yarn';
}

function commitToGitHub(jsonContent) {
  const c = getConfig();
  if (!c.GITHUB_TOKEN || !c.GITHUB_REPO_OWNER || !c.GITHUB_REPO_NAME) {
    Logger.log('GitHub not configured — skipping.');
    return;
  }
  const url  = 'https://api.github.com/repos/' + c.GITHUB_REPO_OWNER + '/' + c.GITHUB_REPO_NAME + '/contents/' + c.GITHUB_FILE_PATH;
  const hdrs = {
    'Authorization': 'token ' + c.GITHUB_TOKEN,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'VedEnterprisesAppScript',
  };
  var sha = '';
  try {
    const res = UrlFetchApp.fetch(url + '?ref=' + c.GITHUB_BRANCH, { method: 'GET', headers: hdrs, muteHttpExceptions: true });
    if (res.getResponseCode() === 200) sha = JSON.parse(res.getContentText()).sha;
  } catch (e) {}
  const payload = {
    message: 'Auto-sync catalog.json — ' + new Date().toISOString(),
    content: Utilities.base64Encode(jsonContent),
    branch:  c.GITHUB_BRANCH,
  };
  if (sha) payload.sha = sha;
  UrlFetchApp.fetch(url, { method: 'PUT', headers: hdrs, payload: JSON.stringify(payload), muteHttpExceptions: true });
}

function triggerVercelDeploy() {
  const c = getConfig();
  if (!c.VERCEL_DEPLOY_HOOK) return;
  try {
    UrlFetchApp.fetch(c.VERCEL_DEPLOY_HOOK, { method: 'POST', muteHttpExceptions: true });
  } catch (err) {
    Logger.log('Vercel deploy notice: ' + err.toString());
  }
}

function jsonOut(data) {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.JSON);
}

function saveProductAndSync(data) {
  const imgSource = data.image_url || data.imageUrl || data.image || '';
  if (imgSource && (imgSource.startsWith('http') || imgSource.startsWith('data:'))) {
    const driveUrl = uploadImageToDrive(imgSource, data.name || 'product');
    if (driveUrl && driveUrl !== imgSource) { data.imageUrl = driveUrl; data.image = driveUrl; }
  }
  const row     = saveProduct(data);
  const catalog = generateCatalogJson();
  commitToGitHub(catalog);
  triggerVercelDeploy();
  return row;
}
