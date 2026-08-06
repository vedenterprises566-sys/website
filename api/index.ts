import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
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

// API Route: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    company: 'Ved Enterprises - Ludhiana',
    service: 'Yarn & Fabric AI Assistance',
  });
});

// API Route: Submit Inquiry
app.post('/api/inquiry', async (req, res) => {
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
app.post('/api/chat', async (req, res) => {
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
          parts: [{ text: h.content }],
        });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
    });

    return res.json({ text: response.text });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error processing AI chat' });
  }
});

export default app;
