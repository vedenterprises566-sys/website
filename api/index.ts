import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();

// CORS Headers Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());

// Initialize Gemini AI Client
const getAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `
You are the official AI Textile Specialist & Sales Engineer for "VED ENTERPRISES", a premier B2B yarn trading and textile manufacturing firm based in Ludhiana, Punjab, India.

Company Profile & Contact Information:
- Firm Name: VED ENTERPRISES
- Address: # 66/2, Near Shingar Cinema, Dharampura, Ludhiana - 141008 (Punjab, India)
- Managing Directors: Moni Maurya (+91 7986716117) & Sandeep Maurya (+91 8556949433)
- Office Numbers: +91 85569-49433, +91 62803-70497, +91 80545-86030
- Distribution Coverage: Nationwide All Over India (Ludhiana, Surat, Ahmedabad, Tirupur, Kolkata, Panipat, Bhilwara, Mumbai, Delhi NCR, Kanpur, etc.)

Partner Spinning Mills:
1. Sharman Woollen Mills Pvt Ltd
2. Garg Acrylic Limited
3. Sportking India Limited
4. Paramount Syntex Pvt Ltd
5. Jainsons Wools Combber Pvt Ltd
6. Sumilon Group of Industries

Complete Product Portfolio & Technical Counts:
1. ACRYLIC & BLENDS:
   - Daffodil Yarn: 2/28 Nm 100% Acrylic, high bulk warmth, pilling resistant, ideal for sweaters, cardigans & school uniforms.
   - Rainbow Yarn: 2/26 Nm (82/18 Acrylic/Nylon), shiny soft sheen, soft hand feel for fashion tops and designer knitwear.
   - Wooly Yarns: 2/18 Nm (high-bulk warm yarn) & 2/48 Nm (fine cashmere-feel yarn).
   - Acrylic Cotton & Polyester Blends: In all commercial counts.

2. FANCY YARNS:
   - Hazel Yarn: 2/28 NM & 2/36 NM (75/25 Viscose/Nylon blend), silky luxury touch for cardigans and fine knitwear.
   - Megamix Yarn: Slub effect fine count Acrylic/Cotton blend for distinct textured knitwear.
   - E Nigma Yarn: 550 Denier heavy textured 100% polyester for outerwear and heavy sweaters.
   - MX Lurex 50/85: Metallic shimmer yarn for borders, shawls, sarees, and knitwear.
   - Fancy Jari: Finest gauge gold and silver threads for embroidery, laces, and royal borders.
   - Space Polyester Yarn: 300D to 550D space dyed for multicolored sweaters.

3. CHINA / IMPORTED YARNS:
   - Vislon 2/48 Yarn: 2/48 Nm Viscose/PBT/Nylon blend, silky sheen for 12GG/14GG flat knit sweaters.
   - 2/48 Vislon Lurex: Vislon with embedded metallic shimmer.
   - Nylon Hair Yarn / Swad: 0.9 Swad, 0.7 Crystal, 1.3cm eyelash fur hair yarn for fuzzy coats and sweaters.
   - 0.9 Suede Yarn & 0.7 Suede Yarn: Matte peach-skin velvety finish for luxury apparel.
   - 18 NM & 13 NM Chenille Yarn: Velvet pile yarns for plush sweaters and scarves.
   - Ring Spun Yarns: High tensile strength for weaving & circular knitting.

4. FINISHED GARMENTS:
   - Men's Classic Wooly Crewneck Sweaters (7GG flat knit, 2/18 Wooly yarn).
   - Ladies Cashmere-Feel Vislon Cardigans (12GG fine gauge, 2/48 Vislon yarn).
   - Kids Heavy Cable Knit Sweaters (5GG heavy gauge, Daffodil Acrylic yarn).

Behavioral Directives:
- Answer all customer queries with precise, technically accurate textile information (counts, deniers, machine gauges 3GG to 14GG, and composition).
- For quotation requests, shade cards, or sample hank dispatches, guide users to contact Managing Director Moni Maurya (+91 7986716117) or Sandeep Maurya (+91 8556949433).
- Provide polite, structured, and informative responses.
`.trim();

// API Route: Health Check
app.get(['/api/health', '/health', '/api'], (req, res) => {
  res.json({
    status: 'ok',
    company: 'Ved Enterprises - Ludhiana',
    service: 'Yarn & Fabric AI Assistance',
  });
});

// API Route: Submit Inquiry
app.post(['/api/inquiry', '/inquiry'], async (req, res) => {
  try {
    const inquiryData = req.body;
    const referenceId = 'VED-' + Math.floor(100000 + Math.random() * 900000);
    const targetEmail = process.env.ADMIN_EMAIL || 'vedenterprises566@gmail.com';

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
- Delivery Address: ${inquiryData.address || 'Not Specified'}
- Pincode: ${inquiryData.pincode || 'N/A'}
- Location: ${inquiryData.city || 'N/A'}, ${inquiryData.state || 'India'}
- Physical Sample Requested: ${inquiryData.requestSample ? 'YES (Hank / Shade Card)' : 'NO'}

SELECTED PRODUCTS / YARNS:
${formattedItemsText}

SPECIFIC REQUIREMENTS / NOTES:
${inquiryData.comments || 'None'}
==================================================
Ved Enterprises • Ludhiana, Punjab
Managing Directors: Moni Maurya (+91 7986716117) | Sandeep Maurya (+91 8556949433)
        `.trim();

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: inquiryData.fullName || 'Customer',
            email: inquiryData.email || 'vedenterprises566@gmail.com',
            subject: `[VED INQUIRY ${referenceId}] ${inquiryData.fullName || 'Customer'} - ${inquiryData.city || 'India'}`,
            message: mailTextBody,
            from_name: 'Ved Enterprises Website',
          }),
        });
      } catch (w3e) {}
    }

    return res.json({
      success: true,
      referenceId,
      targetEmail,
      message: `Thank you ${inquiryData.fullName || 'Valued Customer'}! Your inquiry (Ref: ${referenceId}) has been registered.`,
      contactPersons: 'Moni Maurya (MD: 7986716117) & Sandeep Maurya (MD: 8556949433)',
      contactPhone: '7986716117, 8556949433',
      address: '# 66/2, Near Shingar Cinema, Dharampura, Ludhiana-141008',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: AI Assistant Endpoint
app.post(['/api/chat', '/chat'], async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getAi();
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content || h.text || '' }],
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    let rawReplyText = '';
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        if (response && response.text) {
          rawReplyText = response.text;
          break;
        }
      } catch (e: any) {
        console.warn(`[GEMINI MODEL RETRY] ${model} attempt error:`, e?.message);
      }
    }

    const replyText = (rawReplyText || "Namaste! I am here to assist with Ved Enterprises' wholesale yarn catalog. Call +91 7986716117 for direct mill rates.").replace(/[*#]/g, '');

    return res.json({ text: replyText });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Unable to connect to AI Assistant. Call +91 7986716117 for direct assistance.',
      details: err.message,
    });
  }
});

export default app;
