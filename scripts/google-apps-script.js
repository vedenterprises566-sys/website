/**
 * Ved Enterprises — Google Apps Script (Catalog & Product Management System)
 * 
 * Features:
 * 1. GOOGLE SHEETS CUSTOM MENU ("🚀 Ved Enterprises"):
 *    - ➕ Add New Product (Opens dialog to enter product details)
 *    - 🗑️ Delete Selected Product(s) (Deletes selected row and updates website)
 *    - 🔄 Sync Catalog to Website (Commits catalog.json to GitHub & triggers Vercel deploy)
 *    - ℹ️ View Catalog Summary (Live count and category breakdown)
 * 
 * 2. WEB ADMIN DASHBOARD (When opening the Web App URL in a browser):
 *    - Visual form to Add new products (with category selector including "Winter Wear")
 *    - Interactive table of all products with 1-click "🗑️ Delete" buttons
 *    - Live Search/Filter
 *    - One-click "Sync to Website" button
 * 
 * 3. REST API ENDPOINTS (GET & POST):
 *    - POST { action: "add", ...productData }
 *    - POST { action: "delete", id: "prod-..." } OR { action: "delete", name: "..." }
 *    - POST { action: "sync" }
 *    - GET ?action=delete&id=... OR ?action=delete&name=...
 *    - GET ?action=add&name=...&category=...
 *    - GET ?action=list (returns all products as JSON)
 *    - GET ?action=catalog (returns public catalog.json)
 *    - GET ?action=regenerate (regenerates, commits to GitHub, triggers Vercel)
 * 
 * SETUP INSTRUCTIONS:
 * -----------------------------------------------------------------------------
 * 1. Open your Google Spreadsheet or https://script.google.com
 *    - If inside Google Sheets: Go to Extensions → Apps Script
 *    - Replace all code in Code.gs with this entire file.
 * 
 * 2. Configure Script Properties (Project Settings ⚙️ → Script Properties):
 *    - GOOGLE_SHEET_ID         → Your Google Spreadsheet ID (from spreadsheet URL)
 *    - DRIVE_FOLDER_ID         → Google Drive folder ID for product images (optional)
 *    - GITHUB_TOKEN            → GitHub Personal Access Token (classic with 'repo' scope)
 *    - GITHUB_REPO_OWNER       → GitHub username (e.g., "vedenterprises566-sys")
 *    - GITHUB_REPO_NAME        → GitHub repo name (e.g., "website")
 *    - GITHUB_FILE_PATH        → Path in repo (default: "public/catalog.json")
 *    - GITHUB_BRANCH           → Branch name (default: "main")
 *    - VERCEL_DEPLOY_HOOK_URL  → Vercel Deploy Hook URL
 * 
 * 3. Deploy as Web App:
 *    - Click "Deploy" → "New deployment"
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click "Deploy" and copy the Web App URL.
 * 
 * 4. Reload your Google Sheet:
 *    - You will see a new menu: "🚀 Ved Enterprises" at the top!
 * -----------------------------------------------------------------------------
 */

// ==========================================
// CONFIGURATION (from Script Properties)
// ==========================================
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  return {
    SHEET_ID: props.getProperty('GOOGLE_SHEET_ID') || '',
    DRIVE_FOLDER_ID: props.getProperty('DRIVE_FOLDER_ID') || '',
    GITHUB_TOKEN: props.getProperty('GITHUB_TOKEN') || '',
    GITHUB_REPO_OWNER: props.getProperty('GITHUB_REPO_OWNER') || '',
    GITHUB_REPO_NAME: props.getProperty('GITHUB_REPO_NAME') || '',
    GITHUB_FILE_PATH: props.getProperty('GITHUB_FILE_PATH') || 'public/catalog.json',
    GITHUB_BRANCH: props.getProperty('GITHUB_BRANCH') || 'main',
    VERCEL_DEPLOY_HOOK: props.getProperty('VERCEL_DEPLOY_HOOK_URL') || '',
  };
}

/**
 * Helper to obtain the active Products sheet
 */
function getProductsSheet() {
  const config = getConfig();
  let ss;
  if (config.SHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(config.SHEET_ID);
    } catch (e) {
      Logger.log('Could not open spreadsheet by ID: ' + e.toString());
    }
  }
  if (!ss) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  if (!ss) {
    throw new Error('Spreadsheet not found. Please set GOOGLE_SHEET_ID in Script Properties.');
  }

  let sheet = ss.getSheetByName('Products');
  if (!sheet) {
    sheet = ss.getSheets()[0]; // Fallback to first sheet
  }
  return sheet;
}


// ==========================================
// GOOGLE SHEETS UI MENU & TRIGGERS
// ==========================================

/**
 * Runs automatically when the spreadsheet is opened.
 * Adds the "🚀 Ved Enterprises" menu to Google Sheets.
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🚀 Ved Enterprises')
      .addItem('➕ Add New Product', 'menuShowAddProductDialog')
      .addItem('✏️ Edit Selected Product', 'menuShowEditProductDialog')
      .addItem('🗑️ Delete Selected Product(s)', 'menuDeleteSelectedProduct')
      .addSeparator()
      .addItem('🔄 Sync Catalog to Website', 'menuSyncCatalog')
      .addItem('ℹ️ View Catalog Summary', 'menuShowCatalogSummary')
      .addToUi();
  } catch (e) {
    Logger.log('onOpen notice: ' + e.toString());
  }
}

/**
 * Custom Menu Action: Add New Product modal dialog
 */
function menuShowAddProductDialog() {
  const html = HtmlService.createHtmlOutput(getAddProductDialogHtml())
    .setWidth(520)
    .setHeight(650)
    .setTitle('➕ Add New Product to Website');
  SpreadsheetApp.getUi().showModalDialog(html, '➕ Add New Product');
}

/**
 * Custom Menu Action: Edit Selected Product in Google Sheet
 */
function menuShowEditProductDialog() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getProductsSheet();
  const activeRange = sheet.getActiveRange();

  if (!activeRange) {
    ui.alert('⚠️ No Selection', 'Please click on the product row you wish to edit.', ui.ButtonSet.OK);
    return;
  }

  const startRow = activeRange.getRow();
  if (startRow < 2) {
    ui.alert('⚠️ Header Row', 'Row 1 is the header row. Please select a product row.', ui.ButtonSet.OK);
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(startRow, 1, 1, sheet.getLastColumn()).getValues()[0];
  const product = {};
  headers.forEach(function(h, idx) {
    product[h] = rowData[idx] || '';
  });
  product.rowIndex = startRow;

  const html = HtmlService.createHtmlOutput(getEditProductDialogHtml(product))
    .setWidth(520)
    .setHeight(670)
    .setTitle('✏️ Edit Product: ' + (product.name || 'Row ' + startRow));
  SpreadsheetApp.getUi().showModalDialog(html, '✏️ Edit Product');
}

/**
 * Custom Menu Action: Delete Selected Row in Google Sheet
 */
function menuDeleteSelectedProduct() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getProductsSheet();
  const activeRange = sheet.getActiveRange();

  if (!activeRange) {
    ui.alert('⚠️ No Selection', 'Please click on the product row you wish to delete.', ui.ButtonSet.OK);
    return;
  }

  const startRow = activeRange.getRow();
  const numRows = activeRange.getNumRows();

  if (startRow < 2) {
    ui.alert('⚠️ Invalid Row', 'Row 1 is the header row and cannot be deleted.', ui.ButtonSet.OK);
    return;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const nameColIdx = Math.max(0, headers.indexOf('name'));
  const idColIdx = Math.max(0, headers.indexOf('id'));

  const productName = sheet.getRange(startRow, nameColIdx + 1).getValue() || `Row ${startRow}`;
  const productId = sheet.getRange(startRow, idColIdx + 1).getValue() || '';

  const confirmMsg = numRows === 1
    ? `Are you sure you want to delete this product?\n\n• Name: "${productName}"\n• ID: ${productId || 'N/A'}\n• Row: ${startRow}\n\nThis will remove it from the Google Sheet, update the website catalog, and trigger a website rebuild.`
    : `Are you sure you want to delete ${numRows} selected product rows (Rows ${startRow} to ${startRow + numRows - 1})?\n\nThis will remove them from the sheet, update the catalog, and rebuild the website.`;

  const response = ui.alert('🗑️ Confirm Product Deletion', confirmMsg, ui.ButtonSet.YES_NO);

  if (response === ui.Button.YES) {
    sheet.deleteRows(startRow, numRows);
    
    // Auto-sync with GitHub and Vercel
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);
    triggerVercelDeploy();

    ui.alert('✅ Product Deleted Successfully', `"${productName}" has been removed and the website rebuild has been triggered.`, ui.ButtonSet.OK);
  }
}

/**
 * Custom Menu Action: Manually Sync Catalog & Redeploy Website
 */
function menuSyncCatalog() {
  const ui = SpreadsheetApp.getUi();
  try {
    const catalog = generateCatalogJson();
    const productCount = JSON.parse(catalog).length;
    commitToGitHub(catalog);
    triggerVercelDeploy();
    ui.alert('🚀 Website Synced Successfully!', `• Products in catalog: ${productCount}\n• catalog.json committed to GitHub\n• Vercel redeploy triggered\n\nYour changes will be live in 1-2 minutes!`, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('❌ Sync Error', 'Error syncing catalog: ' + err.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Custom Menu Action: Show Catalog Summary Breakdown
 */
function menuShowCatalogSummary() {
  const ui = SpreadsheetApp.getUi();
  try {
    const catalog = JSON.parse(generateCatalogJson());
    const counts = {
      'fancy': 0,
      'china': 0,
      'acrylic-blends': 0,
      'fabrics': 0,
      'garments': 0,
    };
    catalog.forEach(function(p) {
      const cat = p.category || 'fancy';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const msg = [
      `Total Active Products: ${catalog.length}`,
      '----------------------------------------',
      `• Winter Wear (Finished Garments): ${counts['garments'] || 0}`,
      `• Fancy Yarns: ${counts['fancy'] || 0}`,
      `• China / Imported Yarns: ${counts['china'] || 0}`,
      `• Acrylic & Blends: ${counts['acrylic-blends'] || 0}`,
      `• Fabrics & Textile Rolls: ${counts['fabrics'] || 0}`,
    ].join('\n');

    ui.alert('📊 Ved Enterprises Catalog Summary', msg, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Error', err.toString(), ui.ButtonSet.OK);
  }
}


// ==========================================
// WEB APP ENTRY POINTS (doGet & doPost)
// ==========================================

/**
 * Handles GET requests:
 * - No params or action=admin → Serves the interactive Web Admin UI
 * - action=list → Returns list of all products in JSON
 * - action=catalog → Returns generated catalog.json
 * - action=delete → Deletes product by id or name
 * - action=add → Adds product from query parameters
 * - action=regenerate / action=sync → Regenerates catalog and triggers deploy
 */
function doGet(e) {
  try {
    e = e || { parameter: {} };
    const action = e.parameter.action;

    // 1. DELETE via GET
    if (action === 'delete') {
      const id = e.parameter.id;
      const name = e.parameter.name;
      const row = e.parameter.row ? parseInt(e.parameter.row, 10) : null;
      const result = deleteProductFromSheet({ id: id, name: name, rowIndex: row });
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. ADD / EDIT via GET
    if (action === 'add' || action === 'edit' || action === 'update') {
      const isEdit = action === 'edit' || action === 'update';
      const params = Object.assign({}, e.parameter, { isEdit: isEdit });
      const productRow = saveProductToSheet(params);
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: isEdit ? 'Product updated successfully.' : 'Product added successfully.',
        productId: productRow.id,
        updated: productRow.updated,
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. REGENERATE / SYNC
    if (action === 'regenerate' || action === 'sync') {
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Catalog regenerated and Vercel deploy triggered.',
        productCount: JSON.parse(catalog).length,
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. RETURN CATALOG JSON
    if (action === 'catalog') {
      const catalog = generateCatalogJson();
      return ContentService.createTextOutput(catalog).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. RETURN LIST OF PRODUCTS (JSON)
    if (action === 'list' || action === 'products') {
      const catalog = generateCatalogJson();
      return ContentService.createTextOutput(catalog).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. DEFAULT: SERVE INTERACTIVE WEB ADMIN DASHBOARD
    return HtmlService.createHtmlOutput(getAdminDashboardHtml())
      .setTitle('Ved Enterprises — Product Catalog Manager')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles POST requests:
 * - action=delete → Deletes product by id, name, or row
 * - action=add (or default) → Adds product, uploads image if provided, syncs & deploys
 * - action=sync / action=regenerate → Re-syncs catalog
 */
function doPost(e) {
  try {
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    const action = data.action || (e.parameter && e.parameter.action);

    // 1. DELETE ACTION
    if (action === 'delete') {
      const result = deleteProductFromSheet(data);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. SYNC ACTION
    if (action === 'sync' || action === 'regenerate') {
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Catalog regenerated and Vercel deploy triggered.',
        productCount: JSON.parse(catalog).length,
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. EDIT / UPDATE ACTION
    if (action === 'edit' || action === 'update') {
      data.isEdit = true;
      const productRow = saveProductToSheet(data);
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Product updated successfully.',
        productId: productRow.id,
        updated: productRow.updated,
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. ADD PRODUCT ACTION (Default for webhooks / submissions)
    let imageUrl = '';
    const imgSource = data.image_url || data.imageUrl || data.image || data.pictureUrl;
    
    // CRITICAL FIX: Upload to Drive FIRST to avoid Google Sheets 50,000 char limit crash
    if (imgSource && (String(imgSource).startsWith('http') || String(imgSource).startsWith('data:'))) {
      imageUrl = uploadImageToDrive(imgSource, data.name || 'product');
      if (imageUrl && imageUrl !== imgSource) {
        data.imageUrl = imageUrl;
        data.image = imageUrl;
        data.pictureUrl = imageUrl;
      }
    }

    const productRow = saveProductToSheet(data);
    
    if (imageUrl && imageUrl !== imgSource) {
      updateImageUrlInSheet(productRow, imageUrl);
    }

    // Generate and commit catalog.json
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);

    // Trigger Vercel redeploy
    triggerVercelDeploy();

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Product saved, catalog updated, deploy triggered.',
      productId: productRow.id,
      productName: data.name,
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


// ==========================================
// GOOGLE SHEETS PRODUCT CRUD OPERATIONS
// ==========================================

/**
 * Saves a product entry to the Google Sheet.
 * Creates the sheet and header row if they don't exist.
 */
function saveProductToSheet(data) {
  const sheet = getProductsSheet();

  // Create sheet with headers if empty
  if (sheet.getLastRow() < 1) {
    sheet.appendRow([
      'id', 'name', 'category', 'categoryLabel', 'countOrDenier',
      'description', 'recommendedUses', 'features', 'sampleAvailable',
      'origin', 'popularFor', 'shade', 'image', 'imageUrl',
      'shadeCardUrl', 'badge', 'createdAt'
    ]);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Normalise category
  let category = data.category || 'fancy';
  if (category === 'winter-wear' || category === 'sweaters' || category === 'sweater') {
    category = 'garments';
  }
  const categoryLabel = data.categoryLabel || getCategoryLabel(category);

  // Generate unique slug-based id if none provided
  const safeSlug = (data.name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const id = data.id || `prod-${safeSlug}-${Date.now().toString().slice(-6)}`;

  const recommendedUsesStr = Array.isArray(data.recommendedUses)
    ? data.recommendedUses.join(', ')
    : (data.recommendedUses || (category === 'garments' ? 'Winter Wear, Knitwear' : ''));

  const featuresStr = Array.isArray(data.features)
    ? data.features.join(', ')
    : (data.features || 'High Quality, Soft Touch');

  // Build row matching existing headers
  const newRow = [];
  headers.forEach(function(header) {
    switch (header) {
      case 'id':
        newRow.push(id);
        break;
      case 'name':
        newRow.push(data.name || 'New Product');
        break;
      case 'category':
        newRow.push(category);
        break;
      case 'categoryLabel':
        newRow.push(categoryLabel);
        break;
      case 'countOrDenier':
      case 'count':
        newRow.push(data.countOrDenier || data.count || '');
        break;
      case 'description':
        newRow.push(data.description || '');
        break;
      case 'recommendedUses':
        newRow.push(recommendedUsesStr);
        break;
      case 'features':
        newRow.push(featuresStr);
        break;
      case 'sampleAvailable':
        newRow.push(data.sampleAvailable !== false && data.sampleAvailable !== 'FALSE' ? 'TRUE' : 'FALSE');
        break;
      case 'origin':
        newRow.push(data.origin || (category === 'garments' ? 'Ved Garment Collection (Ludhiana)' : 'Ved Enterprises'));
        break;
      case 'popularFor':
        newRow.push(data.popularFor || (category === 'garments' ? 'Winter Wear Collections' : ''));
        break;
      case 'shade':
      case 'color':
        newRow.push(data.shade || data.color || '');
        break;
      case 'image':
      case 'imageUrl':
        newRow.push(data.image || data.imageUrl || data.pictureUrl || '');
        break;
      case 'shadeCardUrl':
      case 'shadeUrl':
        newRow.push(data.shadeCardUrl || data.shadeUrl || '');
        break;
      case 'badge':
        newRow.push(data.badge || '');
        break;
      case 'createdAt':
        newRow.push(new Date().toISOString());
        break;
      default:
        newRow.push(data[header] || '');
        break;
    }
  });

  // Check if product already exists in sheet to update in-place
  let existingRowIndex = -1;
  if (sheet.getLastRow() >= 2) {
    const idColIdx = headers.indexOf('id');
    const nameColIdx = headers.indexOf('name');
    const allRows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    for (let i = 0; i < allRows.length; i++) {
      const rowId = idColIdx !== -1 ? String(allRows[i][idColIdx]).trim() : '';
      const rowName = nameColIdx !== -1 ? String(allRows[i][nameColIdx]).trim() : '';
      if (
        (id && rowId === String(id).trim()) ||
        (data.originalId && rowId === String(data.originalId).trim()) ||
        (data.isEdit && data.originalName && rowName.toLowerCase() === String(data.originalName).toLowerCase().trim())
      ) {
        existingRowIndex = i + 2;
        break;
      }
    }
  }

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 1, 1, newRow.length).setValues([newRow]);
    Logger.log(`Product updated in sheet: ${id} at row ${existingRowIndex}`);
    return { id: id, rowIndex: existingRowIndex, name: data.name, updated: true };
  } else {
    sheet.appendRow(newRow);
    const rowIndex = sheet.getLastRow();
    Logger.log(`Product saved to sheet: ${id} at row ${rowIndex}`);
    return { id: id, rowIndex: rowIndex, name: data.name, updated: false };
  }
}

/**
 * Deletes a product from the Sheet by ID, Name, or Row Index.
 * Then regenerates catalog.json, commits to GitHub, and triggers Vercel.
 */
function deleteProductFromSheet(query) {
  const sheet = getProductsSheet();
  if (sheet.getLastRow() < 2) {
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);
    triggerVercelDeploy();
    return {
      success: true,
      message: 'Sheet is empty. Website catalog synced.',
      remainingProductCount: 0,
    };
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idColIdx = headers.indexOf('id');
  const nameColIdx = headers.indexOf('name');
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  let targetRowIndex = -1;
  let deletedProduct = null;

  // 1. Delete by direct row number
  if (query.rowIndex && query.rowIndex >= 2 && query.rowIndex <= sheet.getLastRow()) {
    targetRowIndex = query.rowIndex;
    const rowData = sheet.getRange(targetRowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    deletedProduct = {
      id: idColIdx >= 0 ? rowData[idColIdx] : '',
      name: nameColIdx >= 0 ? rowData[nameColIdx] : `Row ${targetRowIndex}`,
    };
  }

  // 2. Delete by Product ID
  if (targetRowIndex === -1 && query.id && idColIdx >= 0) {
    const cleanId = String(query.id).trim().toLowerCase();
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][idColIdx]).trim().toLowerCase() === cleanId) {
        targetRowIndex = i + 2; // +2 for 1-indexing & header row
        deletedProduct = {
          id: data[i][idColIdx],
          name: nameColIdx >= 0 ? data[i][nameColIdx] : cleanId,
        };
        break;
      }
    }
  }

  // 3. Delete by Product Name (Exact or Substring)
  if (targetRowIndex === -1 && query.name && nameColIdx >= 0) {
    const cleanName = String(query.name).trim().toLowerCase();
    for (let i = 0; i < data.length; i++) {
      const currentName = String(data[i][nameColIdx]).trim().toLowerCase();
      if (currentName === cleanName || currentName.includes(cleanName)) {
        targetRowIndex = i + 2;
        deletedProduct = {
          id: idColIdx >= 0 ? data[i][idColIdx] : '',
          name: data[i][nameColIdx],
        };
        break;
      }
    }
  }

  if (targetRowIndex === -1) {
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);
    triggerVercelDeploy();
    return {
      success: true,
      message: `Product was not in sheet (already removed). Catalog synced.`,
      remainingProductCount: JSON.parse(catalog).length,
    };
  }

  // Delete the row
  sheet.deleteRow(targetRowIndex);
  Logger.log(`Deleted product "${deletedProduct.name}" at row ${targetRowIndex}`);

  // Re-sync with GitHub and redeploy website
  const catalog = generateCatalogJson();
  commitToGitHub(catalog);
  triggerVercelDeploy();

  return {
    success: true,
    message: `Product "${deletedProduct.name}" deleted successfully. Catalog updated and website redeploy triggered.`,
    deletedProduct: deletedProduct,
    remainingProductCount: JSON.parse(catalog).length,
  };
}

/**
 * Updates the image URL for a product row after Drive upload
 */
function updateImageUrlInSheet(productRow, imageUrl) {
  const sheet = getProductsSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const imageCol = headers.indexOf('image');
  const imageUrlCol = headers.indexOf('imageUrl');

  if (imageCol >= 0) {
    sheet.getRange(productRow.rowIndex, imageCol + 1).setValue(imageUrl);
  }
  if (imageUrlCol >= 0) {
    sheet.getRange(productRow.rowIndex, imageUrlCol + 1).setValue(imageUrl);
  }
}

/**
 * Reads all products from the Sheet and generates clean catalog.json content
 */
function generateCatalogJson() {
  const sheet = getProductsSheet();
  if (!sheet || sheet.getLastRow() < 2) {
    return '[]';
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  const products = data.map(function(row, idx) {
    const product = {};
    headers.forEach(function(header, colIdx) {
      let value = row[colIdx];

      // Parse comma-separated arrays
      if (header === 'recommendedUses' || header === 'features' || header === 'availableSizes') {
        value = typeof value === 'string' && value.trim()
          ? value.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
          : (Array.isArray(value) ? value : []);
      }

      // Parse boolean
      if (header === 'sampleAvailable') {
        value = String(value).toUpperCase() === 'TRUE';
      }

      product[header] = value;
    });

    // Ensure stable ID
    if (!product.id) {
      const slug = (product.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      product.id = `prod-${slug || idx + 1}`;
    }

    // Normalise category & label
    if (product.category === 'winter-wear' || product.category === 'sweaters' || product.category === 'sweater') {
      product.category = 'garments';
    }
    if (!product.categoryLabel || product.categoryLabel === 'Finished Sweaters') {
      product.categoryLabel = getCategoryLabel(product.category);
    }

    // Clean up internal metadata fields
    delete product['createdAt'];

    return product;
  });

  // Filter out empty rows without valid name
  const validProducts = products.filter(function(p) {
    return p.name && String(p.name).trim() !== '';
  });

  return JSON.stringify(validProducts, null, 2);
}

/**
 * Helper to derive category labels (Garments maps to Winter Wear)
 */
function getCategoryLabel(category) {
  const labels = {
    'fancy': 'Fancy Yarn',
    'china': 'China / Imported Yarn',
    'acrylic-blends': 'Acrylic & Blends',
    'fabrics': 'Fabrics & Textile Rolls',
    'garments': 'Winter Wear',
    'winter-wear': 'Winter Wear',
  };
  return labels[category] || 'Fancy Yarn';
}


// ==========================================
// GOOGLE DRIVE IMAGE UPLOAD
// ==========================================

/**
 * Downloads an image from a URL and stores it in the designated Drive folder.
 * Returns direct public viewable Google Drive URL.
 */
function uploadImageToDrive(imgSource, productName) {
  try {
    const config = getConfig();
    if (!config.DRIVE_FOLDER_ID || !imgSource) return imgSource;

    let blob;
    let extension = 'jpg';

    if (String(imgSource).startsWith('data:image')) {
      const parts = imgSource.split(',');
      const meta = parts[0];
      const base64Data = parts[1];
      const mimeType = meta.match(/data:([^;]+);/)[1];
      extension = mimeType.split('/')[1] || 'jpg';
      const decoded = Utilities.base64Decode(base64Data);
      blob = Utilities.newBlob(decoded, mimeType, 'image.' + extension);
    } 
    else if (String(imgSource).startsWith('http')) {
      const response = UrlFetchApp.fetch(imgSource);
      blob = response.getBlob();
      extension = blob.getContentType().split('/')[1] || 'jpg';
    } 
    else {
      return imgSource;
    }

    const safeName = (productName || 'product').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    blob.setName(safeName + '_' + Date.now() + '.' + extension);

    const folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const driveUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;
    Logger.log('Image uploaded to Drive: ' + driveUrl);
    return driveUrl;

  } catch (error) {
    Logger.log('Error uploading image to Drive: ' + error.toString());
    return imgSource; // Fallback to original URL
  }
}


// ==========================================
// GITHUB API — COMMIT catalog.json
// ==========================================

/**
 * Commits catalog.json to the GitHub repository via GitHub REST API
 */
function commitToGitHub(catalogJsonContent) {
  const config = getConfig();
  if (!config.GITHUB_TOKEN || !config.GITHUB_REPO_OWNER || !config.GITHUB_REPO_NAME) {
    Logger.log('GitHub config missing in Script Properties — skipping commit.');
    return;
  }

  const apiBase = `https://api.github.com/repos/${config.GITHUB_REPO_OWNER}/${config.GITHUB_REPO_NAME}`;
  const filePath = config.GITHUB_FILE_PATH;
  const headers = {
    'Authorization': 'token ' + config.GITHUB_TOKEN,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'VedEnterprisesAppScript',
  };

  // Step 1: Get current file SHA
  let currentSha = '';
  try {
    const getResponse = UrlFetchApp.fetch(`${apiBase}/contents/${filePath}?ref=${config.GITHUB_BRANCH}`, {
      method: 'GET',
      headers: headers,
      muteHttpExceptions: true,
    });

    if (getResponse.getResponseCode() === 200) {
      const fileData = JSON.parse(getResponse.getContentText());
      currentSha = fileData.sha;
    }
  } catch (e) {
    Logger.log('File does not exist yet on branch, will create: ' + e.toString());
  }

  // Step 2: Create or Update file
  const payload = {
    message: `Auto-sync catalog.json — ${new Date().toISOString()}`,
    content: Utilities.base64Encode(catalogJsonContent),
    branch: config.GITHUB_BRANCH,
  };

  if (currentSha) {
    payload.sha = currentSha;
  }

  const putResponse = UrlFetchApp.fetch(`${apiBase}/contents/${filePath}`, {
    method: 'PUT',
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const statusCode = putResponse.getResponseCode();
  if (statusCode === 200 || statusCode === 201) {
    Logger.log('Successfully committed catalog.json to GitHub.');
  } else {
    Logger.log('GitHub commit failed (' + statusCode + '): ' + putResponse.getContentText());
  }
}


// ==========================================
// VERCEL DEPLOY HOOK
// ==========================================

/**
 * Triggers a Vercel Deploy Hook to rebuild and redeploy the site
 */
function triggerVercelDeploy() {
  const config = getConfig();
  if (!config.VERCEL_DEPLOY_HOOK) {
    Logger.log('Vercel Deploy Hook URL not configured — skipping deploy trigger.');
    return;
  }

  try {
    const response = UrlFetchApp.fetch(config.VERCEL_DEPLOY_HOOK, {
      method: 'POST',
      muteHttpExceptions: true,
    });
    Logger.log('Vercel deploy triggered. Status: ' + response.getResponseCode());
  } catch (error) {
    Logger.log('Error triggering Vercel deploy: ' + error.toString());
  }
}


// ==========================================
// MANUAL RUNNERS (Run from Script Editor)
// ==========================================

/**
 * Regenerate catalog, commit to GitHub, and trigger Vercel deploy
 */
function manualRegenerateCatalog() {
  const catalog = generateCatalogJson();
  Logger.log('Generated catalog with ' + JSON.parse(catalog).length + ' products.');
  commitToGitHub(catalog);
  triggerVercelDeploy();
  Logger.log('Sync complete.');
}

/**
 * Helper to delete a product manually by ID or Name
 * Example: manualDeleteProduct('prod-test-123') or manualDeleteProduct('Test Yarn')
 */
function manualDeleteProduct(idOrName) {
  const result = deleteProductFromSheet({ id: idOrName, name: idOrName });
  Logger.log(JSON.stringify(result));
  return result;
}


// ==========================================
// HTML TEMPLATES (Web Admin & Dialogs)
// ==========================================

/**
 * Returns HTML for the Add Product modal dialog inside Google Sheets
 */
function getAddProductDialogHtml() {
  return `
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; color: #1e293b; background: #f8fafc; font-size: 13px; }
    h2 { margin-top: 0; margin-bottom: 4px; font-size: 18px; color: #0f172a; }
    p.subtitle { margin-top: 0; margin-bottom: 16px; color: #64748b; font-size: 12px; }
    .form-group { margin-bottom: 12px; }
    label { display: block; font-weight: 600; margin-bottom: 4px; color: #334155; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    input[type="text"], textarea, select { width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #ffffff; }
    input[type="text"]:focus, textarea:focus, select:focus { outline: none; border-color: #dc2626; box-shadow: 0 0 0 2px rgba(220,38,38,0.15); }
    textarea { resize: vertical; min-height: 50px; }
    .row { display: flex; gap: 10px; }
    .row > div { flex: 1; }
    .btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 10px 16px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
    .btn:hover { background: #b91c1c; }
    .btn:disabled { background: #94a3b8; cursor: not-allowed; }
    #status { margin-top: 10px; padding: 8px; border-radius: 6px; font-size: 12px; display: none; }
    .status-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .status-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
  </style>
</head>
<body>
  <h2>➕ Add Product to Ved Enterprises</h2>
  <p class="subtitle">Adds row to sheet, updates catalog.json, and redeploys website automatically.</p>

  <form id="productForm">
    <div class="form-group">
      <label>Product Name *</label>
      <input type="text" id="name" required placeholder="e.g. 2/28 Cashmere Wool Pullover">
    </div>

    <div class="row">
      <div class="form-group">
        <label>Category *</label>
        <select id="category" required>
          <option value="garments">Winter Wear (Finished Garments)</option>
          <option value="fancy">Fancy Yarn</option>
          <option value="china">China / Imported Yarn</option>
          <option value="acrylic-blends">Acrylic & Blends</option>
          <option value="fabrics">Fabrics & Textile Rolls</option>
        </select>
      </div>

      <div class="form-group">
        <label>Count / Denier / Gauge</label>
        <input type="text" id="countOrDenier" placeholder="e.g. 7GG / 2/18 Wooly">
      </div>
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea id="description" placeholder="Wholesale specifications, hand feel, and features..."></textarea>
    </div>

    <div class="row">
      <div class="form-group">
        <label>Recommended Uses</label>
        <input type="text" id="recommendedUses" placeholder="Winter Wear, Cardigans, Knitwear">
      </div>
      <div class="form-group">
        <label>Key Features</label>
        <input type="text" id="features" placeholder="High Bulk, Soft Touch, Non-Pilling">
      </div>
    </div>

    <div class="form-group">
      <label>Image URL or Google Drive Link</label>
      <input type="text" id="imageUrl" placeholder="https://drive.google.com/... or image link">
    </div>

    <div class="row">
      <div class="form-group">
        <label>Shade Card URL</label>
        <input type="text" id="shadeCardUrl" placeholder="Optional shade link">
      </div>
      <div class="form-group">
        <label>Badge</label>
        <input type="text" id="badge" placeholder="e.g. Winter Collection, New">
      </div>
    </div>

    <button type="submit" class="btn" id="submitBtn">Save & Sync to Website</button>
  </form>

  <div id="status"></div>

  <script>
    document.getElementById('productForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      var status = document.getElementById('status');
      btn.disabled = true;
      btn.innerText = 'Saving & Syncing Website...';
      status.style.display = 'none';

      var data = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        countOrDenier: document.getElementById('countOrDenier').value,
        description: document.getElementById('description').value,
        recommendedUses: document.getElementById('recommendedUses').value,
        features: document.getElementById('features').value,
        imageUrl: document.getElementById('imageUrl').value,
        shadeCardUrl: document.getElementById('shadeCardUrl').value,
        badge: document.getElementById('badge').value,
      };

      google.script.run
        .withSuccessHandler(function(response) {
          btn.disabled = false;
          btn.innerText = 'Save & Sync to Website';
          status.className = 'status-success';
          status.innerText = '✅ Product added! Website rebuild triggered.';
          status.style.display = 'block';
          document.getElementById('productForm').reset();
          setTimeout(function() { google.script.host.close(); }, 2000);
        })
        .withFailureHandler(function(error) {
          btn.disabled = false;
          btn.innerText = 'Save & Sync to Website';
          status.className = 'status-error';
          status.innerText = '❌ Error: ' + error.message;
          status.style.display = 'block';
        })
        .saveProductAndSync(data);
    });
  </script>
</body>
</html>
`;
}

/**
 * Returns HTML for the Edit Product modal dialog inside Google Sheets
 */
function getEditProductDialogHtml(product) {
  var p = product || {};
  var safeName = (p.name || '').replace(/"/g, '&quot;');
  var safeCount = (p.countOrDenier || p.count || '').replace(/"/g, '&quot;');
  var safeDesc = (p.description || '').replace(/"/g, '&quot;');
  var safeUses = (Array.isArray(p.recommendedUses) ? p.recommendedUses.join(', ') : (p.recommendedUses || '')).replace(/"/g, '&quot;');
  var safeFeatures = (Array.isArray(p.features) ? p.features.join(', ') : (p.features || '')).replace(/"/g, '&quot;');
  var safeImg = (p.imageUrl || p.image || '').replace(/"/g, '&quot;');
  var safeShade = (p.shadeCardUrl || '').replace(/"/g, '&quot;');
  var safeBadge = (p.badge || '').replace(/"/g, '&quot;');
  var cat = p.category === 'sweaters' || p.category === 'sweater' || p.category === 'winter-wear' ? 'garments' : (p.category || 'garments');

  return `
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; color: #1e293b; background: #f8fafc; font-size: 13px; }
    h2 { margin-top: 0; margin-bottom: 4px; font-size: 18px; color: #0f172a; }
    p.subtitle { margin-top: 0; margin-bottom: 16px; color: #64748b; font-size: 12px; }
    .form-group { margin-bottom: 12px; }
    label { display: block; font-weight: 600; margin-bottom: 4px; color: #334155; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    input[type="text"], textarea, select { width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; background: #ffffff; }
    input[type="text"]:focus, textarea:focus, select:focus { outline: none; border-color: #d97706; box-shadow: 0 0 0 2px rgba(217,119,6,0.15); }
    textarea { resize: vertical; min-height: 50px; }
    .row { display: flex; gap: 10px; }
    .row > div { flex: 1; }
    .btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 10px 16px; background: #d97706; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: background 0.2s; margin-top: 8px; }
    .btn:hover { background: #b45309; }
    .btn:disabled { background: #94a3b8; cursor: not-allowed; }
    #status { margin-top: 10px; padding: 8px; border-radius: 6px; font-size: 12px; display: none; }
    .status-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .status-error { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .id-badge { display: inline-block; background: #e2e8f0; color: #475569; font-family: monospace; font-size: 11px; padding: 2px 6px; border-radius: 4px; margin-bottom: 12px; }
  </style>
</head>
<body>
  <h2>✏️ Edit Product</h2>
  <span class="id-badge">ID: ${p.id || 'N/A'} • Row ${p.rowIndex || 'N/A'}</span>

  <form id="productForm">
    <input type="hidden" id="id" value="${p.id || ''}">
    <input type="hidden" id="rowIndex" value="${p.rowIndex || ''}">

    <div class="form-group">
      <label>Product Name *</label>
      <input type="text" id="name" required value="${safeName}">
    </div>

    <div class="row">
      <div class="form-group">
        <label>Category *</label>
        <select id="category" required>
          <option value="garments" ${cat === 'garments' ? 'selected' : ''}>Winter Wear (Finished Garments)</option>
          <option value="fancy" ${cat === 'fancy' ? 'selected' : ''}>Fancy Yarn</option>
          <option value="china" ${cat === 'china' ? 'selected' : ''}>China / Imported Yarn</option>
          <option value="acrylic-blends" ${cat === 'acrylic-blends' ? 'selected' : ''}>Acrylic & Blends</option>
          <option value="fabrics" ${cat === 'fabrics' ? 'selected' : ''}>Fabrics & Textile Rolls</option>
        </select>
      </div>

      <div class="form-group">
        <label>Count / Denier / Gauge</label>
        <input type="text" id="countOrDenier" value="${safeCount}">
      </div>
    </div>

    <div class="form-group">
      <label>Description</label>
      <textarea id="description">${safeDesc}</textarea>
    </div>

    <div class="row">
      <div class="form-group">
        <label>Recommended Uses</label>
        <input type="text" id="recommendedUses" value="${safeUses}">
      </div>
      <div class="form-group">
        <label>Key Features</label>
        <input type="text" id="features" value="${safeFeatures}">
      </div>
    </div>

    <div class="form-group">
      <label>Image URL or Google Drive Link</label>
      <input type="text" id="imageUrl" value="${safeImg}">
    </div>

    <div class="row">
      <div class="form-group">
        <label>Shade Card URL (Yarns Only)</label>
        <input type="text" id="shadeCardUrl" value="${safeShade}">
      </div>
      <div class="form-group">
        <label>Badge</label>
        <input type="text" id="badge" value="${safeBadge}">
      </div>
    </div>

    <button type="submit" class="btn" id="submitBtn">Save Changes & Sync</button>
  </form>

  <div id="status"></div>

  <script>
    document.getElementById('productForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      var status = document.getElementById('status');
      btn.disabled = true;
      btn.innerText = 'Saving Changes...';
      status.style.display = 'none';

      var data = {
        id: document.getElementById('id').value,
        originalId: document.getElementById('id').value,
        rowIndex: parseInt(document.getElementById('rowIndex').value, 10),
        isEdit: true,
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        countOrDenier: document.getElementById('countOrDenier').value,
        description: document.getElementById('description').value,
        recommendedUses: document.getElementById('recommendedUses').value,
        features: document.getElementById('features').value,
        imageUrl: document.getElementById('imageUrl').value,
        shadeCardUrl: document.getElementById('shadeCardUrl').value,
        badge: document.getElementById('badge').value,
      };

      google.script.run
        .withSuccessHandler(function(response) {
          btn.disabled = false;
          btn.innerText = 'Save Changes & Sync';
          status.className = 'status-success';
          status.innerText = '✅ Product updated in Google Sheet & website!';
          status.style.display = 'block';
          setTimeout(function() { google.script.host.close(); }, 1800);
        })
        .withFailureHandler(function(error) {
          btn.disabled = false;
          btn.innerText = 'Save Changes & Sync';
          status.className = 'status-error';
          status.innerText = '❌ Error: ' + error.message;
          status.style.display = 'block';
        })
        .saveProductAndSync(data);
    });
  </script>
</body>
</html>
`;
}

/**
 * Server-side bridge for the Add/Edit Product dialog inside Google Sheets
 */
function saveProductAndSync(data) {
  const result = saveProductToSheet(data);
  const catalog = generateCatalogJson();
  commitToGitHub(catalog);
  triggerVercelDeploy();
  return result;
}

/**
 * Returns HTML for the Full Web Admin Dashboard (served by doGet)
 */
function getAdminDashboardHtml() {
  const catalog = JSON.parse(generateCatalogJson());
  const catalogJsonSafe = JSON.stringify(catalog).replace(/</g, '\\u003c');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ved Enterprises — Product Catalog Manager</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #dc2626;
      --primary-hover: #b91c1c;
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    .header {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #dc2626, #f59e0b);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 18px;
    }
    .brand h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .brand p {
      margin: 0;
      font-size: 11px;
      color: var(--text-muted);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-secondary { background: #334155; color: #f1f5f9; }
    .btn-secondary:hover { background: #475569; }
    .btn-danger { background: #ef4444; }
    .btn-danger:hover { background: #dc2626; }
    .container {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 24px;
    }
    @media (max-width: 900px) {
      .container { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
    }
    .form-group { margin-bottom: 12px; }
    label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    input[type="text"], textarea, select {
      width: 100%;
      padding: 8px 12px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: #fff;
      font-size: 12px;
    }
    input[type="text"]:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--primary);
    }
    textarea { resize: vertical; min-height: 55px; }
    .search-box {
      width: 100%;
      padding: 10px 14px;
      background: #0f172a;
      border: 1px solid var(--border);
      border-radius: 10px;
      color: #fff;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .table-container {
      overflow-x: auto;
      max-height: 600px;
      overflow-y: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid var(--border);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
      background: var(--card-bg);
    }
    td {
      padding: 12px 10px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.4);
      vertical-align: middle;
    }
    tr:hover { background: rgba(51, 65, 85, 0.3); }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-winter { background: rgba(220, 38, 38, 0.2); color: #f87171; border: 1px solid rgba(220,38,38,0.4); }
    .badge-fancy { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.4); }
    .badge-china { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.4); }
    .badge-acrylic { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); }
    .badge-fabrics { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168,85,247,0.4); }
    .btn-delete-row {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-delete-row:hover {
      background: #ef4444;
      color: #fff;
    }
    #notification {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      background: #10b981;
      color: white;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      display: none;
      z-index: 100;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="brand">
      <div class="brand-logo">V</div>
      <div>
        <h1>Ved Enterprises Product Manager</h1>
        <p>Direct Google Sheets Sync & Live Website Deployment</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" onclick="syncWebsite()">🔄 Sync Website</button>
      <a class="btn" href="https://www.ved.enterprises" target="_blank">🌐 View Website</a>
    </div>
  </div>

  <div class="container">
    <!-- ADD PRODUCT CARD -->
    <div class="card">
      <h3 class="card-title">➕ Add New Product</h3>
      <form id="addForm" onsubmit="handleAddProduct(event)">
        <div class="form-group">
          <label>Product Name *</label>
          <input type="text" id="newName" required placeholder="e.g. 2/18 Wooly Crewneck Winter Wear">
        </div>

        <div class="form-group">
          <label>Category *</label>
          <select id="newCategory" required>
            <option value="garments">Winter Wear (Finished Garments)</option>
            <option value="fancy">Fancy Yarn</option>
            <option value="china">China / Imported Yarn</option>
            <option value="acrylic-blends">Acrylic & Blends</option>
            <option value="fabrics">Fabrics & Textile Rolls</option>
          </select>
        </div>

        <div class="form-group">
          <label>Count / Denier / Machine Gauge</label>
          <input type="text" id="newCount" placeholder="e.g. 7GG / 2/18 Wooly or 2/28 Nm">
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="newDesc" placeholder="Product details, material composition, hand feel..."></textarea>
        </div>

        <div class="form-group">
          <label>Recommended Uses (comma separated)</label>
          <input type="text" id="newUses" placeholder="Winter Wear, Knitwear, Corporate Apparel">
        </div>

        <div class="form-group">
          <label>Features (comma separated)</label>
          <input type="text" id="newFeatures" placeholder="High Bulk Warmth, Pill Resistant">
        </div>

        <div class="form-group">
          <label>Image URL or Google Drive Link</label>
          <input type="text" id="newImage" placeholder="https://drive.google.com/... or image link">
        </div>

        <div class="form-group">
          <label>Shade Card URL</label>
          <input type="text" id="newShadeUrl" placeholder="Optional shade card link">
        </div>

        <div class="form-group">
          <label>Badge</label>
          <input type="text" id="newBadge" placeholder="e.g. Winter Collection, Best Seller">
        </div>

        <button type="submit" class="btn" style="width: 100%; justify-content: center;" id="submitBtn">
          Save & Deploy to Website
        </button>
      </form>
    </div>

    <!-- PRODUCT CATALOG TABLE -->
    <div class="card">
      <div class="card-title">
        <span>📦 Current Products (<span id="prodCount">0</span>)</span>
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="loadProducts()">Refresh</button>
      </div>

      <input type="text" class="search-box" id="searchInput" placeholder="🔍 Search products by name, category, or count..." oninput="filterTable()">

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Count / Denier</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="productsBody">
            <!-- Populated dynamically via JS -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div id="notification"></div>

  <script>
    var currentProducts = ${catalogJsonSafe};

    function showNotify(msg, isError) {
      var n = document.getElementById('notification');
      n.innerText = msg;
      n.style.background = isError ? '#ef4444' : '#10b981';
      n.style.display = 'block';
      setTimeout(function() { n.style.display = 'none'; }, 4000);
    }

    function renderTable(products) {
      document.getElementById('prodCount').innerText = products.length;
      var tbody = document.getElementById('productsBody');
      tbody.innerHTML = '';

      if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 24px;">No products found.</td></tr>';
        return;
      }

      products.forEach(function(p) {
        var catClass = 'badge-fancy';
        var catLabel = p.categoryLabel || 'Fancy Yarn';
        if (p.category === 'garments' || p.category === 'winter-wear') {
          catClass = 'badge-winter';
          catLabel = 'Winter Wear';
        } else if (p.category === 'china') {
          catClass = 'badge-china';
        } else if (p.category === 'acrylic-blends') {
          catClass = 'badge-acrylic';
        } else if (p.category === 'fabrics') {
          catClass = 'badge-fabrics';
        }

        var tr = document.createElement('tr');
        tr.innerHTML = \`
          <td>
            <div style="font-weight: 700; color: #fff;">\${p.name}</div>
            <div style="font-size: 10px; color: #64748b;">ID: \${p.id || 'N/A'}</div>
          </td>
          <td><span class="badge \${catClass}">\${catLabel}</span></td>
          <td style="color: #cbd5e1;">\${p.countOrDenier || '-'}</td>
          <td>
            <button class="btn-delete-row" onclick="deleteProduct('\${p.id}', '\${p.name.replace(/'/g, "\\\\'")}')">
              🗑️ Delete
            </button>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function filterTable() {
      var query = document.getElementById('searchInput').value.toLowerCase();
      var filtered = currentProducts.filter(function(p) {
        return (p.name && p.name.toLowerCase().includes(query)) ||
               (p.category && p.category.toLowerCase().includes(query)) ||
               (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) ||
               (p.countOrDenier && p.countOrDenier.toLowerCase().includes(query));
      });
      renderTable(filtered);
    }

    function handleAddProduct(e) {
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerText = 'Saving & Deploying...';

      var newProd = {
        action: 'add',
        name: document.getElementById('newName').value,
        category: document.getElementById('newCategory').value,
        countOrDenier: document.getElementById('newCount').value,
        description: document.getElementById('newDesc').value,
        recommendedUses: document.getElementById('newUses').value,
        features: document.getElementById('newFeatures').value,
        imageUrl: document.getElementById('newImage').value,
        shadeCardUrl: document.getElementById('newShadeUrl').value,
        badge: document.getElementById('newBadge').value,
      };

      fetch(window.location.href.split('?')[0], {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(newProd)
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        btn.disabled = false;
        btn.innerText = 'Save & Deploy to Website';
        if (res.success) {
          showNotify('✅ Product added! Website deploy triggered.');
          document.getElementById('addForm').reset();
          loadProducts();
        } else {
          showNotify('❌ Error: ' + (res.error || res.message), true);
        }
      })
      .catch(function(err) {
        btn.disabled = false;
        btn.innerText = 'Save & Deploy to Website';
        showNotify('❌ Network Error: ' + err.message, true);
      });
    }

    function deleteProduct(id, name) {
      if (!confirm('Are you sure you want to delete "' + name + '"?\\n\\nThis will remove it from the catalog and rebuild the website.')) {
        return;
      }

      showNotify('Deleting "' + name + '" and rebuilding website...');

      fetch(window.location.href.split('?')[0], {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'delete', id: id, name: name })
      })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (res.success) {
          showNotify('✅ Product deleted! Website deploy triggered.');
          loadProducts();
        } else {
          showNotify('❌ Error: ' + (res.error || res.message), true);
        }
      })
      .catch(function(err) {
        showNotify('❌ Error: ' + err.message, true);
      });
    }

    function syncWebsite() {
      showNotify('Triggering full catalog sync and Vercel rebuild...');
      fetch(window.location.href.split('?')[0] + '?action=regenerate')
        .then(function(r) { return r.json(); })
        .then(function(res) {
          showNotify('🚀 Website synced! Rebuilding ' + res.productCount + ' products.');
        })
        .catch(function(err) {
          showNotify('❌ Error: ' + err.message, true);
        });
    }

    function loadProducts() {
      fetch(window.location.href.split('?')[0] + '?action=list')
        .then(function(r) { return r.json(); })
        .then(function(list) {
          currentProducts = list;
          renderTable(currentProducts);
        })
        .catch(function(err) {
          console.error(err);
        });
    }

    // Initial render
    renderTable(currentProducts);
  </script>
</body>
</html>
`;
}
