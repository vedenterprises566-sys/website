import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const SITE_URL = 'https://www.ved.enterprises';
const COMPANY_NAME = 'VED Enterprises';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getProductSlug(product) {
  if (!product || !product.name) return 'yarn-product';
  const baseSlug = slugify(product.name);
  if (baseSlug) return baseSlug;
  return `product-${slugify(product.id || 'yarn')}`;
}

function getProductSection(product) {
  if (product.category === 'garments') return 'garments';
  return 'yarns';
}

function getProductSubcategorySlug(product) {
  if (product.category === 'garments') return 'sweaters';
  if (product.category === 'china') return 'china-yarns';
  if (product.category === 'fancy') return 'fancy-yarns';
  if (product.category === 'acrylic-blends') return 'acrylic-blends';
  return slugify(product.category) || 'fancy-yarns';
}

function getProductHierarchicalPath(product) {
  const section = getProductSection(product);
  const subcategory = getProductSubcategorySlug(product);
  const slug = getProductSlug(product);
  return `/catalog/${section}/${subcategory}/${slug}`;
}

function loadProducts() {
  const catalogJsonPath = path.join(PUBLIC_DIR, 'catalog.json');
  if (fs.existsSync(catalogJsonPath)) {
    try {
      const raw = fs.readFileSync(catalogJsonPath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[SEO Build] Loaded ${data.length} products from public/catalog.json`);
        return data;
      }
    } catch (e) {
      console.warn('[SEO Build Warning] Failed to parse catalog.json:', e.message);
    }
  }

  const productsTsPath = path.join(ROOT_DIR, 'src', 'data', 'products.ts');
  if (fs.existsSync(productsTsPath)) {
    const code = fs.readFileSync(productsTsPath, 'utf-8');
    const nameMatches = [...code.matchAll(/name:\s*['"]([^'"]+)['"]/g)];
    const countMatches = [...code.matchAll(/countOrDenier:\s*['"]([^'"]+)['"]/g)];
    const descMatches = [...code.matchAll(/description:\s*['"]([^'"]+)['"]/g)];

    const products = [];
    nameMatches.forEach((m, idx) => {
      products.push({
        id: `ts-${idx}`,
        name: m[1],
        countOrDenier: countMatches[idx] ? countMatches[idx][1] : 'Standard Count',
        description: descMatches[idx] ? descMatches[idx][1] : 'High quality wholesale yarn from Ved Enterprises Ludhiana.',
        categoryLabel: 'Fancy Yarn',
        category: 'fancy',
      });
    });

    if (products.length > 0) {
      console.log(`[SEO Build] Extracted ${products.length} products from products.ts fallback`);
      return products;
    }
  }

  return [];
}

async function runStaticSeoGeneration() {
  console.log('\n==================================================');
  console.log('🚀 Generating SEO & Crawlable HTML Static Pages...');
  console.log('==================================================\n');

  const products = loadProducts();
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[SEO Build Error] dist/index.html not found! Run vite build first.');
    process.exit(1);
  }

  const baseHtmlTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Define Hierarchical Category URLs
  const staticCategoryUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily', title: 'Yarn Trader & Bulk Yarn Supplier in India | VED Enterprises', desc: 'VED Enterprises is a leading B2B yarn trader and bulk yarn supplier based in Ludhiana, Punjab, supplying Fancy Yarns, China Imported Yarns, and finished sweaters across India.' },
    { loc: `${SITE_URL}/catalog`, priority: '0.9', changefreq: 'daily', title: 'Catalog | VED Enterprises', desc: 'Explore the complete wholesale Yarn and Garments product catalog from VED Enterprises, B2B yarn supplier in Ludhiana, India.' },
    { loc: `${SITE_URL}/catalog/yarns`, priority: '0.9', changefreq: 'daily', title: 'Yarns | Yarn Supplier India | VED Enterprises', desc: 'Complete wholesale yarn directory from VED Enterprises Ludhiana featuring Fancy Yarns, China Imported Yarns, and 100% Acrylic Blends.' },
    { loc: `${SITE_URL}/catalog/yarns/fancy-yarns`, priority: '0.8', changefreq: 'weekly', title: 'Fancy Yarns | Yarn Supplier India | VED Enterprises', desc: 'Explore Fancy Yarns supplied by VED Enterprises Ludhiana including Lurex, space dyed, slub yarns, and metallic zari.' },
    { loc: `${SITE_URL}/catalog/yarns/china-yarns`, priority: '0.8', changefreq: 'weekly', title: 'China Yarns | Yarn Supplier India | VED Enterprises', desc: 'Explore Imported China Yarns supplied by VED Enterprises Ludhiana including Vislon 2/48, 2/18 Wooly, Chenille, Suede, and Nylon Hair yarns.' },
    { loc: `${SITE_URL}/catalog/yarns/acrylic-blends`, priority: '0.8', changefreq: 'weekly', title: 'Acrylic & Blends Yarn | Yarn Supplier India | VED Enterprises', desc: 'Explore 100% Acrylic & Blended Yarns from VED Enterprises Ludhiana including Daffodil, Rainbow, and high-bulk acrylic yarns for sweaters and knitwear.' },
    { loc: `${SITE_URL}/catalog/garments`, priority: '0.8', changefreq: 'weekly', title: 'Garments | VED Enterprises', desc: 'Wholesale Finished Garments and Knitted Sweaters directory from VED Enterprises Ludhiana.' },
    { loc: `${SITE_URL}/catalog/garments/sweaters`, priority: '0.8', changefreq: 'weekly', title: 'Sweaters | VED Enterprises', desc: 'Finished Sweater Garments Collection from VED Enterprises Ludhiana crafted from premium Vislon, Wooly, and Daffodil yarns.' },
  ];

  const sitemapUrls = [...staticCategoryUrls.map((u) => ({ loc: u.loc, priority: u.priority, changefreq: u.changefreq }))];

  products.forEach((p) => {
    const relPath = getProductHierarchicalPath(p);
    sitemapUrls.push({
      loc: `${SITE_URL}${relPath}`,
      priority: '0.8',
      changefreq: 'weekly',
    });
  });

  // 2. Generate sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);
  console.log(`[SEO Build] Generated sitemap.xml with ${sitemapUrls.length} crawlable URLs`);

  // 3. Generate robots.txt
  const robotsTxt = `# Robots.txt for VED Enterprises - Ludhiana Yarn Directory
User-agent: *
Allow: /
Allow: /catalog/
Allow: /catalog/yarns/
Allow: /catalog/yarns/*
Allow: /catalog/garments/
Allow: /catalog/garments/*

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt);
  console.log('[SEO Build] Generated robots.txt');

  // 4. Pre-render HTML for Category & Section Pages
  staticCategoryUrls.forEach((catInfo) => {
    const relUrlPath = catInfo.loc.replace(SITE_URL, '') || '/';
    let targetDir = DIST_DIR;
    if (relUrlPath !== '/') {
      targetDir = path.join(DIST_DIR, relUrlPath.replace(/^\//, ''));
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    const htmlContent = `
      <header style="padding: 20px; background: #0f172a; color: #ffffff;">
        <nav><a href="/" style="color: #cbd5e1;">Home</a> / <strong style="color: #fbbf24;">${catInfo.title.split('|')[0].trim()}</strong></nav>
        <h1>${catInfo.title.split('|')[0].trim()}</h1>
        <p>${catInfo.desc}</p>
      </header>
      <main style="padding: 20px;">
        <h2>Catalog Directory</h2>
        <ul>
          ${products.map(p => `<li><a href="${getProductHierarchicalPath(p)}"><strong>${p.name}</strong> (${p.countOrDenier || 'Standard Count'})</a> - ${p.description || ''}</li>`).join('\n        ')}
        </ul>
      </main>
    `;

    let pageHtml = baseHtmlTemplate
      .replace(/<title>.*?<\/title>/i, `<title>${catInfo.title}</title>`)
      .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${catInfo.desc}" />`)
      .replace('</head>', `<link rel="canonical" href="${catInfo.loc}" />\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${htmlContent}</div>`);

    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml);
    console.log(`[SEO Build] Pre-rendered ${relUrlPath} -> ${path.join(targetDir, 'index.html')}`);
  });

  // 5. Pre-render HTML for every product at /catalog/{section}/{subcategory}/{slug}
  let productPagesCount = 0;
  products.forEach((product) => {
    const relPath = getProductHierarchicalPath(product);
    const prodDir = path.join(DIST_DIR, relPath.replace(/^\//, ''));

    if (!fs.existsSync(prodDir)) {
      fs.mkdirSync(prodDir, { recursive: true });
    }

    const prodTitle = `${product.name} | VED Enterprises`;
    const prodDesc = `${product.name} (${product.countOrDenier || 'Standard Count'}) wholesale supply from VED Enterprises Ludhiana. ${product.description || ''}`;
    const prodCanonical = `${SITE_URL}${relPath}`;

    const prodImage = product.imageUrl || product.image || product.pictureUrl || '';
    const recommendedUsesStr = Array.isArray(product.recommendedUses) ? product.recommendedUses.join(', ') : (product.recommendedUses || 'Sweaters, Knitwear, Apparel');
    const featuresStr = Array.isArray(product.features) ? product.features.join(', ') : (product.features || 'High Quality, Durable');

    const section = getProductSection(product);
    const sectionLabel = section === 'garments' ? 'Garments' : 'Yarns';
    const subcategorySlug = getProductSubcategorySlug(product);
    const subcategoryLabel = product.category === 'garments' ? 'Sweaters' : (product.category === 'china' ? 'China Yarns' : 'Fancy Yarns');

    const productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'description': product.description || prodDesc,
      'url': prodCanonical,
      'sku': product.id || slugify(product.name),
      'category': product.categoryLabel || 'Yarn',
      'brand': {
        '@type': 'Brand',
        'name': COMPANY_NAME,
      },
      'seller': {
        '@type': 'Organization',
        'name': COMPANY_NAME,
        'url': SITE_URL,
      },
      ...(prodImage ? { 'image': [prodImage] } : {}),
    };

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Catalog', 'item': `${SITE_URL}/catalog` },
        { '@type': 'ListItem', 'position': 3, 'name': sectionLabel, 'item': `${SITE_URL}/catalog/${section}` },
        { '@type': 'ListItem', 'position': 4, 'name': subcategoryLabel, 'item': `${SITE_URL}/catalog/${section}/${subcategorySlug}` },
        { '@type': 'ListItem', 'position': 5, 'name': product.name, 'item': prodCanonical },
      ],
    };

    const prodPreRenderHtml = `
      <article style="font-family: sans-serif; padding: 24px; max-width: 900px; margin: 0 auto; color: #1e293b;">
        <nav style="font-size: 14px; margin-bottom: 16px;">
          <a href="/">Home</a> / <a href="/catalog">Catalog</a> / <a href="/catalog/${section}">${sectionLabel}</a> / <a href="/catalog/${section}/${subcategorySlug}">${subcategoryLabel}</a> / <strong>${product.name}</strong>
        </nav>
        <header style="border-bottom: 2px solid #dc2626; padding-bottom: 16px; margin-bottom: 20px;">
          <span style="background: #f1f5f9; color: #dc2626; padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
            ${product.categoryLabel || 'Wholesale Product'}
          </span>
          <h1 style="font-size: 32px; margin: 12px 0 6px 0; color: #0f172a;">${product.name}</h1>
          <p style="font-size: 16px; color: #dc2626; font-weight: bold; margin: 0;">Count / Gauge: ${product.countOrDenier || 'Standard Count'}</p>
        </header>

        <section style="margin-bottom: 24px;">
          <h2 style="font-size: 18px; color: #0f172a;">Product Specifications & Supplier Info</h2>
          <p style="font-size: 15px; line-height: 1.6;">${product.description || ''}</p>
          <ul style="line-height: 1.8; font-size: 14px;">
            <li><strong>Supplier:</strong> VED Enterprises (Ludhiana, Punjab, India)</li>
            <li><strong>Category:</strong> ${product.categoryLabel || 'Yarn'}</li>
            <li><strong>Count / Denier:</strong> ${product.countOrDenier || 'Standard Count'}</li>
            <li><strong>Origin:</strong> ${product.origin || 'Ved Wholesale Selection'}</li>
            <li><strong>Recommended Applications:</strong> ${recommendedUsesStr}</li>
            <li><strong>Technical Features:</strong> ${featuresStr}</li>
            <li><strong>Sample Availability:</strong> Hank / Sample Dispatch Available</li>
          </ul>
        </section>

        ${prodImage ? `
          <figure style="margin-bottom: 24px;">
            <img src="${prodImage}" alt="${product.name} - ${product.countOrDenier || 'Standard Count'} supplied by VED Enterprises" style="max-width: 100%; height: auto; border-radius: 16px; border: 1px solid #e2e8f0;" />
            <figcaption style="font-size: 12px; color: #64748b; margin-top: 6px;">${product.name} wholesale supply photo from VED Enterprises Ludhiana</figcaption>
          </figure>
        ` : ''}

        <footer style="background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; font-size: 16px;">Request Bulk Wholesale Quote</h3>
          <p style="font-size: 13px; color: #475569;">Contact Managing Director Moni Maurya (+91 7986716117) or Sandeep Maurya (+91 8556949433) at VED Enterprises Ludhiana for direct mill prices and dispatch across India.</p>
          <p><a href="/catalog/${section}/${subcategorySlug}" style="font-weight: bold; color: #dc2626;">← Back to ${subcategoryLabel} Catalog</a></p>
        </footer>
      </article>
    `;

    const jsonLdScripts = `
      <script type="application/ld+json">${JSON.stringify(productJsonLd)}</script>
      <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
      <link rel="canonical" href="${prodCanonical}" />
    `;

    let prodHtml = baseHtmlTemplate
      .replace(/<title>.*?<\/title>/i, `<title>${prodTitle}</title>`)
      .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${prodDesc}" />`)
      .replace('</head>', `${jsonLdScripts}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${prodPreRenderHtml}</div>`);

    fs.writeFileSync(path.join(prodDir, 'index.html'), prodHtml);
    productPagesCount++;
  });

  console.log(`[SEO Build] Successfully pre-rendered ${productPagesCount} individual product detail pages in hierarchical folders.`);
  console.log('\n==================================================');
  console.log('✅ Static SEO & Crawlable HTML Pre-rendering Complete!');
  console.log('==================================================\n');
}

runStaticSeoGeneration().catch((err) => {
  console.error('[SEO Build Error]', err);
  process.exit(1);
});
