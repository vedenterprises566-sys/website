// Ved Enterprises - Live Gemini AI Textile Service
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
- Explain technical differences clearly (e.g., 300D is fine & flexible for light knits; 550D is thick & sturdy for heavy outerwear; 18NM is light velvet chenille; 13NM is heavy plush chenille).
- For quotation requests, shade cards, or sample hank dispatches, guide users to contact Managing Director Moni Maurya (+91 7986716117) or Sandeep Maurya (+91 8556949433).
- Provide polite, structured, and informative responses with clear bullet points.
`.trim();

export interface ChatHistoryItem {
  role: 'user' | 'assistant' | 'model';
  text: string;
}

export async function askGemini(message: string, history: ChatHistoryItem[] = []): Promise<string> {
  // 1. First attempt: call local / serverless backend API
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.map((h) => ({
          role: h.role === 'assistant' ? 'assistant' : 'user',
          text: h.text,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text && typeof data.text === 'string' && data.text.trim().length > 10) {
        return data.text;
      }
    }
  } catch (backendErr) {
    console.warn('Backend /api/chat error, attempting direct Gemini call:', backendErr);
  }

  // 2. Fallback attempt: Direct Gemini REST endpoint
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY || '';

  if (apiKey) {
    const candidateModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    
    // Prepare contents array starting with user
    const contents: any[] = [];
    const filteredHistory = history.filter((h, idx) => idx > 0 || h.role === 'user');
    
    filteredHistory.forEach((h) => {
      contents.push({
        role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    });
    contents.push({ role: 'user', parts: [{ text: message }] });

    for (const model of candidateModels) {
      try {
        const directRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }],
              },
              contents,
            }),
          }
        );

        if (directRes.ok) {
          const directData = await directRes.json();
          const generatedText = directData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 10) {
            return generatedText;
          }
        }
      } catch (directErr) {
        console.warn(`Direct Gemini ${model} failed:`, directErr);
      }
    }
  }

  // 3. Guaranteed comprehensive domain answer
  return getDomainAnswer(message);
}

function getDomainAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('300d') || q.includes('550d') || q.includes('space polyester') || q.includes('denier')) {
    return `Comparison: 300D vs 550D Space Polyester Yarn

1. 300 Denier Space Polyester:
• Thickness: Finer, lighter yarn (300 grams per 9,000 meters) with smooth drape and soft hand feel.
• Best Machine Gauges: 10GG, 12GG, and 14GG flat knits.
• Best Uses: Fashion sweaters, light cardigans, activewear, and lightweight accessories.
• Color Effect: Subtler multicolored space-dyed micro-transitions.

2. 550 Denier Space Polyester:
• Thickness: Thicker, heavy textured yarn (550 grams per 9,000 meters) with superior tensile strength.
• Best Machine Gauges: 5GG and 7GG heavy flat knits.
• Best Uses: Structured heavy winterwear, jacket fabrics, chunky cardigans, and home textiles.
• Color Effect: Bold, pronounced multicolored blocks.

Both yarns are high-bulk space-dyed polyester providing vibrant variegated colors for modern knitwear. Contact Moni Maurya at +91 7986716117 for bulk shade cards.`;
  }

  if (q.includes('13 nm') || q.includes('18 nm') || q.includes('chenille')) {
    return `Comparison: China Chenille Yarn (13 NM vs 18 NM)

1. 18 NM Chenille Yarn:
• Structure: Fine velvet pile, lightweight and silky smooth.
• Best Uses: Standard gauge sweaters (10GG/12GG), ladies fashion tops, and lightweight scarves.

2. 13 NM Chenille Yarn:
• Structure: Heavier, denser velvet pile offering maximum plush warmth.
• Best Uses: Chunky winter sweaters, cozy cardigans, baby blankets, and luxury knitwear.

Both qualities deliver a velvety, non-shedding finish with rich color absorption. Direct China import stock available at our Ludhiana warehouse.`;
  }

  if (q.includes('daffodil')) {
    return `Daffodil Yarn Specifications & Applications

• Yarn Count: 2/28 Nm (Metric Count)
• Composition: 100% High-Bulk Acrylic
• Key Characteristics: Excellent thermal insulation, pill-resistant finish, and brilliant dye vibrancy.
• Recommended Uses: Sweaters, school uniform cardigans, corporate knitwear, and winter apparel.
• Compatibility: Performs exceptionally well on 5GG to 10GG flat knitting and circular knitting machines.`;
  }

  if (q.includes('rainbow')) {
    return `Rainbow Yarn Specifications & Applications

• Yarn Count: 2/26 Nm (Metric Count)
• Composition: 82% Acrylic / 18% Shiny Soft Nylon (Polyamide)
• Key Characteristics: Lustrous soft sheen, luxurious hand feel, and high elastic recovery.
• Recommended Uses: Designer fashion sweaters, chic cardigans, boutique knitwear, and kids winterwear.
• Machine Gauges: Ideal for 7GG, 10GG, and 12GG flat knitting setups.`;
  }

  if (q.includes('hazel')) {
    return `Hazel Yarn Specifications & Applications

• Available Counts: 2/28 NM & 2/36 NM
• Composition: 75% Viscose / 25% Nylon blend
• Key Characteristics: Ultra-soft silky touch, featherlight drape, and breathable luxury comfort.
• Recommended Uses: Fine luxury cardigans, boutique knitwear, summer/winter tops, and stoles.`;
  }

  if (q.includes('vislon')) {
    return `Vislon 2/48 Imported China Yarn

• Yarn Count: 2/48 Nm
• Composition: Viscose / PBT / Nylon blend
• Key Characteristics: Cashmere-soft feel, silky lustre, high pilling resistance, and uniform twist.
• Recommended Uses: 12GG and 14GG fine gauge flat knit sweaters, ladies cardigans, and premium innerwear.`;
  }

  if (q.includes('sample') || q.includes('hank') || q.includes('dispatch') || q.includes('surat') || q.includes('tirupur') || q.includes('delhi') || q.includes('ahmedabad')) {
    return `Sample Hanks & All-India Dispatch Process

• Sample Availability: We dispatch physical sample hanks and yarn shade cards directly to textile manufacturers across India.
• Coverage: Regular dispatches to Surat, Ahmedabad, Tirupur, Kolkata, Panipat, Bhilwara, Mumbai, Kanpur, Delhi NCR, and Bangalore.
• Dispatch Center: Main distribution warehouse in Ludhiana (# 66/2 Near Shingar Cinema, Dharampura).
• How to Order Samples: Call or WhatsApp Managing Director Moni Maurya (+91 7986716117) or Sandeep Maurya (+91 8556949433) with your required quality and delivery address.`;
  }

  if (q.includes('mill') || q.includes('partner') || q.includes('brand') || q.includes('spinning')) {
    return `Stocked Spinning Mill Brands at Ved Enterprises

We stock and distribute certified yarns from India's premier spinning mills:
1. Sharman Woollen Mills Pvt Ltd
2. Garg Acrylic Limited
3. Sportking India Limited
4. Paramount Syntex Pvt Ltd
5. Jainsons Wools Combber Pvt Ltd
6. Sumilon Group of Industries (Metallic Zari)

We supply 100% Acrylic, Acrylic/Wool blends, Cotton blends, Fancy yarns, and direct China imported yarns.`;
  }

  if (q.includes('fancy') || q.includes('winter') || q.includes('lurex') || q.includes('jari') || q.includes('zari') || q.includes('swad') || q.includes('hair') || q.includes('suede')) {
    return `Fancy Yarns for Winter & Fashion Knitwear

1. MX Lurex 50/85: Metallic shimmer yarn for borders, shawls, and festive knitwear.
2. Nylon Hair Yarn / Swad (0.9 / 0.7 / 1.3cm): Ultra-fluffy eyelash fur yarn for plush coats and sweaters.
3. 0.9 & 0.7 Suede Yarns: Velvety peach-skin matte touch for luxury garments.
4. Megamix Yarn: Slub effect Acrylic/Cotton for textured designer knitwear.
5. E Nigma Yarn (550D): Heavy textured 100% polyester for outerwear.
6. Fancy Jari: Finest gauge gold and silver embroidery threads.`;
  }

  return `Welcome to Ved Enterprises (Ludhiana) — B2B Wholesale Yarn Traders

We supply premium yarns across India:
• Acrylic & Blends: Daffodil (2/28 Nm), Rainbow (2/26 Nm), Wooly (2/18 Nm & 2/48 Nm)
• Fancy Yarns: Hazel (2/28 & 2/36 Nm), Megamix Slub, E Nigma (550D), MX Lurex, Fancy Jari
• China Imported: Vislon 2/48, Chenille (13NM & 18NM), Suede (0.9 & 0.7), Nylon Hair Swad
• Mill Partners: Sharman, Garg Acrylic, Sportking, Paramount, Jainsons, Sumilon

For immediate rates, sample hanks, or shade cards, contact:
• Moni Maurya (MD): +91 7986716117
• Sandeep Maurya (MD): +91 8556949433
• Address: # 66/2 Near Shingar Cinema, Dharampura, Ludhiana - 141008`;
}
