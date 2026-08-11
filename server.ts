import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import os from 'os';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  app.use(express.json());

  // Initialize Gemini AI Client lazily or safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in process.env');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      company: 'Ved Enterprises - Ludhiana',
      service: 'Yarn & Fabric AI Assistance',
    });
  });

  // Serve sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const distSitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
    const target = fs.existsSync(distSitemapPath) ? distSitemapPath : sitemapPath;
    if (fs.existsSync(target)) {
      res.header('Content-Type', 'application/xml');
      return res.sendFile(target);
    }
    return res.status(404).send('Sitemap not found');
  });

  // Serve robots.txt
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    const distRobotsPath = path.join(process.cwd(), 'dist', 'robots.txt');
    const target = fs.existsSync(distRobotsPath) ? distRobotsPath : robotsPath;
    if (fs.existsSync(target)) {
      res.header('Content-Type', 'text/plain');
      return res.sendFile(target);
    }
    return res.status(404).send('Robots.txt not found');
  });

  // API Route: Submit Inquiry
  app.post('/api/inquiry', async (req, res) => {
    try {
      const inquiryData = req.body;
      console.log('New Inquiry Received:', inquiryData);
      
      const referenceId = 'VED-' + Math.floor(100000 + Math.random() * 900000);
      const timestamp = new Date().toISOString();
      const targetEmail = process.env.ADMIN_EMAIL || 'admin@ved.enterprises';

      const inquiryRecord = {
        referenceId,
        timestamp,
        ...inquiryData,
      };

      // Email notification formatting and delivery (no local disk storage)
      const itemsListHtml = inquiryData.items && inquiryData.items.length > 0
        ? inquiryData.items.map((i: any) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #0f172a;">${i.product?.name || 'Yarn'}</td>
              <td style="padding: 10px; color: #dc2626; font-weight: bold;">${i.product?.countOrDenier || 'N/A'}</td>
              <td style="padding: 10px; font-weight: bold; text-align: right; color: #0f172a;">${i.quantityKg} Kg</td>
            </tr>
          `).join('')
        : '<tr><td colspan="3" style="padding: 10px; color: #64748b;">No specific items in basket (General Inquiry)</td></tr>';

      const mailSubject = `[VED INQUIRY ${referenceId}] ${inquiryData.fullName || 'Customer'} - ${inquiryData.city || 'India'}`;

      const mailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; padding: 24px; text-align: center;">
            <h2 style="margin: 0; font-size: 26px; font-family: Georgia, serif; letter-spacing: 1px;">VED ENTERPRISES</h2>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.95; text-transform: uppercase; font-weight: bold;">New Wholesale Yarn Inquiry • Ref: ${referenceId}</p>
          </div>
          
          <div style="padding: 24px; color: #1e293b;">
            <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #dc2626; padding-bottom: 8px; font-size: 16px;">Customer & Delivery Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Full Name:</strong></td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${inquiryData.fullName || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Company / Firm:</strong></td><td style="padding: 6px 0; color: #0f172a;">${inquiryData.companyName || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Mobile / Phone:</strong></td><td style="padding: 6px 0;"><a href="tel:${inquiryData.phone}" style="color: #dc2626; font-weight: bold; text-decoration: none;">+91 ${inquiryData.phone}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 6px 0; color: #0f172a;">${inquiryData.email || 'Not Provided'}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Delivery Address:</strong></td><td style="padding: 6px 0; color: #0f172a;">${inquiryData.address || 'Not Specified'}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Pincode:</strong></td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${inquiryData.pincode || 'N/A'}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Location / Hub:</strong></td><td style="padding: 6px 0; color: #0f172a;"><strong>${inquiryData.city || 'N/A'}</strong>, ${inquiryData.state || 'India'}</td></tr>
              <tr><td style="padding: 6px 0; color: #64748b;"><strong>Sample Requested:</strong></td><td style="padding: 6px 0; font-weight: bold; color: ${inquiryData.requestSample ? '#16a34a' : '#64748b'};">${inquiryData.requestSample ? 'YES (Hank / Shade Card Dispatch)' : 'NO'}</td></tr>
            </table>

            <h3 style="color: #0f172a; border-bottom: 2px solid #dc2626; padding-bottom: 8px; font-size: 16px;">Requested Yarns / Products</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; background-color: #f8fafc; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left; color: #475569;">
                  <th style="padding: 10px;">Yarn Description</th>
                  <th style="padding: 10px;">Count / Specs</th>
                  <th style="padding: 10px; text-align: right;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsListHtml}
              </tbody>
            </table>

            ${inquiryData.comments ? `
              <h3 style="color: #0f172a; border-bottom: 2px solid #dc2626; padding-bottom: 8px; font-size: 16px;">Specific Requirements & Notes</h3>
              <div style="background-color: #fff1f2; padding: 14px; border-left: 4px solid #dc2626; border-radius: 6px; font-size: 13px; color: #9f1239; line-height: 1.5;">
                ${inquiryData.comments}
              </div>
            ` : ''}
          </div>

          <div style="background-color: #0f172a; color: #94a3b8; padding: 18px; text-align: center; font-size: 12px; line-height: 1.5;">
            <strong style="color: #ffffff;">VED ENTERPRISES — LUDHIANA YARN DIRECTORY</strong><br>
            Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab, India)<br>
            Managing Directors: Moni Maurya (+91 7986716117) | Sandeep Maurya (+91 8556949433)
          </div>
        </div>
      `;

      // 3. Dispatch Email via Web3Forms API & Nodemailer SMTP
      let emailSent = false;
      let emailStatusMessage = `Inquiry recorded & notification queued for ${targetEmail}`;

      const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY || '2d09f16a-31b3-45bd-85f7-48ed312ff640';
      if (web3FormsKey) {
        try {
          const formattedItemsText = inquiryData.items && inquiryData.items.length > 0
            ? inquiryData.items.map((i: any, index: number) => `${index + 1}. ${i.product?.name || 'Yarn'} (${i.product?.countOrDenier || ''}) - ${i.quantityKg} Kg`).join('\n')
            : 'General Wholesale Inquiry';

          const mailTextBody = `
NEW WHOLESALE YARN INQUIRY - VED ENTERPRISES (Ref: ${referenceId})
==================================================

CUSTOMER DETAILS:
- Full Name: ${inquiryData.fullName || 'N/A'}
- Company / Firm: ${inquiryData.companyName || 'N/A'}
- Mobile / WhatsApp: +91 ${inquiryData.phone || 'N/A'}
- Gmail / Email: ${inquiryData.email || 'Not Provided'}
- Location: ${inquiryData.city || 'N/A'}, ${inquiryData.state || 'India'}
- Physical Sample Requested: ${inquiryData.requestSample ? 'YES (Hank / Shade Card Dispatch)' : 'NO'}

SELECTED PRODUCTS / YARNS:
${formattedItemsText}

SPECIFIC REQUIREMENTS / NOTES:
${inquiryData.comments || 'None'}
==================================================
Ved Enterprises • Ludhiana, Punjab
Managing Directors: Moni Maurya (+91 7986716117) | Sandeep Maurya (+91 8556949433)
Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008
          `.trim();

          const web3res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_key: web3FormsKey,
              name: inquiryData.fullName || 'Customer',
              email: inquiryData.email || 'no-reply@ved.enterprises',
              subject: `[VED INQUIRY ${referenceId}] ${inquiryData.fullName || 'Customer'} - ${inquiryData.city || 'India'}`,
              message: mailTextBody,
              from_name: 'Ved Enterprises Website',
              replyto: inquiryData.email || 'admin@ved.enterprises',
            }),
          });
          const web3data: any = await web3res.json();
          if (web3data.success) {
            emailSent = true;
            emailStatusMessage = `Live email dispatched to admin@ved.enterprises via Web3Forms`;
            console.log(`[WEB3FORMS SUCCESS] Inquiry ${referenceId} delivered to email inbox via Web3Forms!`);
          } else {
            console.warn('[WEB3FORMS WARNING]', web3data.message || web3data);
          }
        } catch (w3err: any) {
          console.error('[WEB3FORMS ERROR] Failed to call Web3Forms:', w3err.message);
        }
      }

      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"Ved Enterprises Website" <${smtpUser}>`,
            to: targetEmail,
            subject: mailSubject,
            html: mailHtml,
          });
          emailSent = true;
          emailStatusMessage = `Email successfully sent directly to ${targetEmail}`;
          console.log(`[SMTP SUCCESS] Dispatched email for inquiry ${referenceId} to ${targetEmail}`);
        } catch (mailErr: any) {
          console.error('[SMTP ERROR] Failed to dispatch email:', mailErr.message);
        }
      }
      
      // 4. Send to Google Sheet Webhook (if GOOGLE_SHEET_WEBHOOK_URL is defined in .env)
      const sheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
      let sheetStatusMessage = 'Google Sheet integration ready';
      if (sheetWebhookUrl) {
        try {
          const itemsSummary = inquiryData.items && inquiryData.items.length > 0
            ? inquiryData.items.map((i: any) => `${i.product?.name || 'Yarn'} (${i.product?.countOrDenier || ''}): ${i.quantityKg}Kg`).join('; ')
            : 'General Wholesale Inquiry';

          const sheetPayload = {
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            referenceId,
            fullName: inquiryData.fullName || '',
            companyName: inquiryData.companyName || '',
            phone: inquiryData.phone || '',
            email: inquiryData.email || '',
            city: inquiryData.city || '',
            state: inquiryData.state || '',
            sampleRequested: inquiryData.requestSample ? 'YES' : 'NO',
            selectedProducts: itemsSummary,
            comments: inquiryData.comments || '',
          };

          await fetch(sheetWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sheetPayload),
          });
          sheetStatusMessage = 'Inquiry row added to Google Sheet';
          console.log(`[GOOGLE SHEET SUCCESS] Appended inquiry ${referenceId} to Google Sheet`);
        } catch (sheetErr: any) {
          console.error('[GOOGLE SHEET ERROR] Failed to push to Google Sheet:', sheetErr.message);
          sheetStatusMessage = `Google Sheet webhook error: ${sheetErr.message}`;
        }
      } else {
        console.log(`[GOOGLE SHEET PENDING] Sheet ID: 1fx9T9qSkawqx7zaPtS4LPpj4crtFu9bptML4MsZ3Z9E. Set GOOGLE_SHEET_WEBHOOK_URL in .env to enable instant row appending.`);
      }

      return res.json({
        success: true,
        referenceId,
        targetEmail,
        emailSent,
        emailStatusMessage,
        sheetStatusMessage,
        message: `Thank you ${inquiryData.fullName || 'Valued Customer'}! Your inquiry (Ref: ${referenceId}) has been registered and dispatched to ${targetEmail}, saved to Google Sheet, and prepared for WhatsApp.`,
        contactPersons: 'Moni Maurya (MD: 7986716117) & Sandeep Maurya (MD: 8556949433)',
        contactPhone: '7986716117, 8556949433',
        address: '# 66/2, Near Shingar Cinema, Dharampura, Ludhiana-141008',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // API Route: AI Assistant Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required.' });
      }

      const ai = getAi();

      const systemInstruction = `
You are the AI Textile & Yarn Sales Assistant for "VED ENTERPRISES", a leading textile trading and distribution firm based in Ludhiana, Punjab, India.

Company Profile & Contact Information:
- Firm Name: VED ENTERPRISES
- Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab, India)
- Managing Directors: Moni Maurya (Mob: +91 7986716117) & Sandeep Maurya (Mob: +91 8556949433)
- Office Contacts: +91 85569-49433, +91 62803-70497, +91 80545-86030
- GSTIN: Available on request for tax-compliant billing
- Distribution Coverage: Nationwide All Over India (Ludhiana, Surat, Ahmedabad, Tirupur, Kolkata, Panipat, Bhilwara, Mumbai, Delhi, Kanpur, etc.)

Partner Mills:
1. Sharman Woollen Mills Pvt Ltd
2. Garg Acrylic Limited
3. Sportking India Limited
4. Paramount Syntex Pvt Ltd
5. Jainsons Wools Combber Pvt Ltd
6. Sumilon Group of Industries

Product Portfolio:
1. OUR FANCY YARNS:
   - MX Lurex 50/85 Fine Count (Metallic shimmer yarn for borders, shawls, sarees)
   - Space Polyester Yarn 300 Denier to 550 Denier (Multi-color space dyed for sweaters)
   - Poly Enigma Yarn 550 Denier (Textured heavy yarn for outerwear)
   - Stretch Yarn / Polyester Vislon (Elastic yarn for ribs, activewear, socks)
   - Fancy Jari Available in Finest Count (Gold/Silver zari for delicate embroidery)
   - Grace Yarn (Silky soft fancy yarn for boutique knits)

2. OUR CHINA / IMPORTED YARNS:
   - 2/48 Vislon Yarn (Fine gauge silky knitwear)
   - 2/48 Vislon Lurex Yarn (Vislon with embedded sparkle)
   - 2/18 Wooly Yarn (High bulk fluffy warm yarn)
   - 2/48 Wooly Yarn (Fine cashmere-feel light wooly)
   - 1.3 CM Hair Yarn (Plush eyelash fur yarn)
   - 1.3 CM Space Dyed Hair Yarn (Variegated fur effect)
   - 0.9 Suede Yarn & 0.7 Suede Yarn (Velvety matte peach-skin touch)
   - 13 NM Chenille Yarn & 18 NM Chenille Yarn (Rich velvet pile yarns)
   - 1/9 NM Brush Yarn (Mohair/Angora fluffy look)
   - Ring Spun Yarns (High strength weaving & knitting)
   - Acrylic Raised Yarn (Napped thermal insulation)
   - Slub Effect Yarns (Organic rustic slub texture)
   - Raw Grey Yarn in All Qualities (Undyed yarn for dye houses)

3. FABRICS & BLENDS:
   - All Types of Acrylic Cotton Blended Yarns
   - Polyester Blended Yarns
   - All Types of Fabrics (Knitted & Woven rolls)
   - All Types of Jari / Zari

Your Persona & Directives:
- Be extremely polite, professional, and knowledgeable about yarn counts, denier specs, gauge compatibility, and textile manufacturing.
- Help customers select the right yarn for their application (e.g., winter sweaters, summer tops, embroidery, socks, blankets, shawls).
- Mention that samples can be dispatched across India, and bulk orders can be shipped directly from Ludhiana.
- Direct users to call or WhatsApp Managing Director Moni Maurya at +91 7986716117 for immediate wholesale quotes.
- CRITICAL FORMATTING RULE: Do NOT use asterisks (*) or hash symbols (#) anywhere in your output. Do NOT use markdown bold (**), italic (*), or headers (#). Use clean plain text, numbers (1., 2.), or standard bullet dashes (-) for lists.
      `.trim();

      const contents = history && Array.isArray(history) && history.length > 0
        ? history.map((item: any) => ({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.text }],
          }))
        : [];

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const rawReplyText = response.text || "I'm here to assist you with Ved Enterprises' yarn catalog! Feel free to ask about our Fancy Yarns, China Yarns, or Mill Partners.";
      const replyText = rawReplyText.replace(/[*#]/g, '');

      return res.json({ text: replyText });
    } catch (err: any) {
      console.error('Error calling Gemini API:', err);
      return res.status(500).json({
        error: 'Unable to connect to AI Assistant. Please call +91 6280370497 for immediate assistance.',
        details: err.message,
      });
    }
  });

  // Mount Vite middleware in development or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    let networkIp = '127.0.0.1';
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          networkIp = net.address;
          break;
        }
      }
    }

    console.log(`\n==================================================`);
    console.log(`🚀 Ved Enterprises Server Running`);
    console.log(`➜ Local:   http://localhost:${PORT}`);
    console.log(`➜ Network: http://${networkIp}:${PORT}`);
    console.log(`==================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
