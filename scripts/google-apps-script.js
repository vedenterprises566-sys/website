/**
 * Ved Enterprises — Google Apps Script
 * 
 * This script runs inside Google Apps Script (script.google.com) and handles:
 * 1. Receiving product data from Web3Forms webhook
 * 2. Storing product data in Google Sheets
 * 3. Storing product images in Google Drive
 * 4. Generating catalog.json
 * 5. Committing catalog.json to GitHub via GitHub API
 * 6. Triggering Vercel Deploy Hook so the site rebuilds automatically
 *
 * SETUP INSTRUCTIONS:
 * --------------------------------------------------
 * 1. Open https://script.google.com and create a new project
 * 2. Paste this entire file into Code.gs
 * 3. Set Script Properties (Project Settings → Script Properties):
 *    - GOOGLE_SHEET_ID         → Your Google Spreadsheet ID
 *    - DRIVE_FOLDER_ID         → Google Drive folder ID for product images
 *    - GITHUB_TOKEN            → GitHub Personal Access Token (repo scope)
 *    - GITHUB_REPO_OWNER       → GitHub username (e.g., "vedenterprises566-sys")
 *    - GITHUB_REPO_NAME        → GitHub repo name (e.g., "website")
 *    - GITHUB_FILE_PATH        → Path in repo (e.g., "public/catalog.json")
 *    - GITHUB_BRANCH           → Branch name (e.g., "main")
 *    - VERCEL_DEPLOY_HOOK_URL  → Vercel Deploy Hook URL
 * 4. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and set it as the Web3Forms webhook URL
 * --------------------------------------------------
 */

// ============================
// CONFIGURATION (from Script Properties)
// ============================
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

// ============================
// WEB APP ENTRY POINTS
// ============================

/**
 * Handles POST requests (Web3Forms webhook)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Received POST data: ' + JSON.stringify(data));

    // 1. Save product to Google Sheet
    const productRow = saveProductToSheet(data);

    // 2. Upload image to Drive if provided
    let imageUrl = '';
    if (data.image_url || data.imageUrl || data.image) {
      imageUrl = uploadImageToDrive(data.image_url || data.imageUrl || data.image, data.name || 'product');
    }
    if (imageUrl) {
      updateImageUrlInSheet(productRow, imageUrl);
    }

    // 3. Generate and commit catalog.json
    const catalog = generateCatalogJson();
    commitToGitHub(catalog);

    // 4. Trigger Vercel redeploy
    triggerVercelDeploy();

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Product saved, catalog updated, deploy triggered.',
      productId: productRow.id,
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests (manual catalog regeneration)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'regenerate') {
      const catalog = generateCatalogJson();
      commitToGitHub(catalog);
      triggerVercelDeploy();
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Catalog regenerated and deploy triggered.',
        productCount: JSON.parse(catalog).length,
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'catalog') {
      const catalog = generateCatalogJson();
      return ContentService.createTextOutput(catalog).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Ved Enterprises Catalog Sync — use ?action=regenerate or ?action=catalog',
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


// ============================
// GOOGLE SHEETS OPERATIONS
// ============================

/**
 * Saves a product entry to the Google Sheet.
 * Creates the sheet and header row if they don't exist.
 */
function saveProductToSheet(data) {
  const config = getConfig();
  const ss = SpreadsheetApp.openById(config.SHEET_ID);
  let sheet = ss.getSheetByName('Products');

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Products');
    sheet.appendRow([
      'id', 'name', 'category', 'categoryLabel', 'countOrDenier',
      'description', 'recommendedUses', 'features', 'sampleAvailable',
      'origin', 'popularFor', 'shade', 'image', 'imageUrl',
      'shadeCardUrl', 'badge', 'createdAt'
    ]);
  }

  const id = data.id || 'prod-' + new Date().getTime();
  const row = [
    id,
    data.name || 'Yarn Product',
    data.category || 'fancy',
    data.categoryLabel || getCategoryLabel(data.category),
    data.countOrDenier || data.count || '',
    data.description || '',
    Array.isArray(data.recommendedUses) ? data.recommendedUses.join(', ') : (data.recommendedUses || ''),
    Array.isArray(data.features) ? data.features.join(', ') : (data.features || ''),
    data.sampleAvailable !== false ? 'TRUE' : 'FALSE',
    data.origin || 'Ved Enterprises',
    data.popularFor || '',
    data.shade || data.color || '',
    data.image || data.imageUrl || '',
    data.imageUrl || data.image || '',
    data.shadeCardUrl || '',
    data.badge || '',
    new Date().toISOString(),
  ];

  sheet.appendRow(row);
  Logger.log('Product saved to sheet: ' + id);

  return { id: id, rowIndex: sheet.getLastRow() };
}

/**
 * Updates the image URL for a product row after Drive upload
 */
function updateImageUrlInSheet(productRow, imageUrl) {
  const config = getConfig();
  const ss = SpreadsheetApp.openById(config.SHEET_ID);
  const sheet = ss.getSheetByName('Products');
  if (!sheet) return;

  // Column 13 = image, Column 14 = imageUrl (1-indexed)
  sheet.getRange(productRow.rowIndex, 13).setValue(imageUrl);
  sheet.getRange(productRow.rowIndex, 14).setValue(imageUrl);
}

/**
 * Reads all products from the Sheet and generates catalog.json content
 */
function generateCatalogJson() {
  const config = getConfig();
  const ss = SpreadsheetApp.openById(config.SHEET_ID);
  const sheet = ss.getSheetByName('Products');

  if (!sheet || sheet.getLastRow() < 2) {
    return '[]';
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  const products = data.map(function(row) {
    const product = {};
    headers.forEach(function(header, colIdx) {
      let value = row[colIdx];
      
      // Parse comma-separated arrays
      if (header === 'recommendedUses' || header === 'features') {
        value = typeof value === 'string' && value.trim()
          ? value.split(',').map(function(s) { return s.trim(); })
          : [];
      }
      
      // Parse boolean
      if (header === 'sampleAvailable') {
        value = String(value).toUpperCase() === 'TRUE';
      }

      product[header] = value;
    });

    // Skip the createdAt field from the JSON output
    delete product['createdAt'];

    return product;
  });

  // Filter out any rows without a valid name
  const validProducts = products.filter(function(p) {
    return p.name && String(p.name).trim() !== '';
  });

  return JSON.stringify(validProducts, null, 2);
}

/**
 * Helper to derive category labels
 */
function getCategoryLabel(category) {
  var labels = {
    'fancy': 'Fancy Yarn',
    'china': 'China / Imported Yarn',
    'acrylic-blends': 'Acrylic & Blends',
    'fabrics': 'Fabrics & Textile Rolls',
    'garments': 'Finished Sweaters',
  };
  return labels[category] || 'Fancy Yarn';
}


// ============================
// GOOGLE DRIVE IMAGE UPLOAD
// ============================

/**
 * Downloads an image from a URL and stores it in the designated Drive folder
 * Returns the public viewable Google Drive URL
 */
function uploadImageToDrive(imageUrl, productName) {
  try {
    const config = getConfig();
    if (!config.DRIVE_FOLDER_ID || !imageUrl) return '';

    const response = UrlFetchApp.fetch(imageUrl);
    const blob = response.getBlob();
    
    // Generate a clean filename
    const safeName = productName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    const extension = blob.getContentType().split('/')[1] || 'jpg';
    blob.setName(safeName + '_' + Date.now() + '.' + extension);

    const folder = DriveApp.getFolderById(config.DRIVE_FOLDER_ID);
    const file = folder.createFile(blob);

    // Make the file publicly accessible
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Return direct viewable URL
    const fileId = file.getId();
    const driveUrl = 'https://drive.google.com/uc?export=view&id=' + fileId;

    Logger.log('Image uploaded to Drive: ' + driveUrl);
    return driveUrl;

  } catch (error) {
    Logger.log('Error uploading image to Drive: ' + error.toString());
    return '';
  }
}


// ============================
// GITHUB API — COMMIT catalog.json
// ============================

/**
 * Commits catalog.json to the GitHub repository
 */
function commitToGitHub(catalogJsonContent) {
  const config = getConfig();
  if (!config.GITHUB_TOKEN || !config.GITHUB_REPO_OWNER || !config.GITHUB_REPO_NAME) {
    Logger.log('GitHub config missing — skipping commit.');
    return;
  }

  const apiBase = 'https://api.github.com/repos/' + config.GITHUB_REPO_OWNER + '/' + config.GITHUB_REPO_NAME;
  const filePath = config.GITHUB_FILE_PATH;
  const headers = {
    'Authorization': 'token ' + config.GITHUB_TOKEN,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'VedEnterprisesAppScript',
  };

  // Step 1: Get current file SHA (required for update)
  let currentSha = '';
  try {
    const getResponse = UrlFetchApp.fetch(apiBase + '/contents/' + filePath + '?ref=' + config.GITHUB_BRANCH, {
      method: 'GET',
      headers: headers,
      muteHttpExceptions: true,
    });

    if (getResponse.getResponseCode() === 200) {
      const fileData = JSON.parse(getResponse.getContentText());
      currentSha = fileData.sha;
    }
  } catch (e) {
    Logger.log('File does not exist yet, will create: ' + e.toString());
  }

  // Step 2: Create/Update file
  const payload = {
    message: 'Auto-update catalog.json — ' + new Date().toISOString(),
    content: Utilities.base64Encode(catalogJsonContent),
    branch: config.GITHUB_BRANCH,
  };

  if (currentSha) {
    payload.sha = currentSha;
  }

  const putResponse = UrlFetchApp.fetch(apiBase + '/contents/' + filePath, {
    method: 'PUT',
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const statusCode = putResponse.getResponseCode();
  if (statusCode === 200 || statusCode === 201) {
    Logger.log('Successfully committed catalog.json to GitHub.');
  } else {
    Logger.log('GitHub commit failed: ' + statusCode + ' — ' + putResponse.getContentText());
  }
}


// ============================
// VERCEL DEPLOY HOOK
// ============================

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


// ============================
// MANUAL FUNCTIONS (Run from Apps Script editor)
// ============================

/**
 * Run this manually to regenerate catalog.json, commit to GitHub, and trigger Vercel deploy.
 * Useful for initial setup or bulk updates.
 */
function manualRegenerateCatalog() {
  const catalog = generateCatalogJson();
  Logger.log('Generated catalog with ' + JSON.parse(catalog).length + ' products.');
  commitToGitHub(catalog);
  triggerVercelDeploy();
  Logger.log('Done! Catalog committed and deploy triggered.');
}

/**
 * Run this manually to test the full pipeline with a sample product
 */
function testAddSampleProduct() {
  const sampleData = {
    name: 'Test Yarn — Delete After Testing',
    category: 'fancy',
    countOrDenier: 'Test Count',
    description: 'This is a test product added by the Apps Script. Delete it from the sheet after verifying.',
    recommendedUses: ['Testing', 'Verification'],
    features: ['Auto-Sync', 'Dynamic Catalog'],
    sampleAvailable: true,
    origin: 'Apps Script Test',
    popularFor: 'Pipeline Testing',
    shade: 'Test Shade',
    image: '',
  };

  saveProductToSheet(sampleData);
  const catalog = generateCatalogJson();
  commitToGitHub(catalog);
  triggerVercelDeploy();
  Logger.log('Test product added, catalog synced, deploy triggered.');
}
