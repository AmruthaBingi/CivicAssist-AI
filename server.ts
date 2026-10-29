import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client on the server side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Curated Indian Public Service Knowledge Base for fallback & system prompt context
const CIVIC_KNOWLEDGE_CONTEXT = `
You are CivicAssist AI, an expert, empathetic, and authoritative Smart Public Grievance Assistant for Indian citizens and municipal administration.
Your mission is to guide citizens on Indian public services, citizen charters, CPGRAMS (Centralised Public Grievance Redress and Monitoring System), state portals (like Sakala, Spandana, CM Helpline, Jan Sunwai), and municipal departments.

Key Indian Public Services Knowledge:
1. Roads & Potholes: PWD & Municipal Roads Wing. Arterial roads fixed in 48-72h, colony roads in 5-7 days. IRC:SP:72 standards.
2. Drinking Water: Jal Board / Jal Nigam / Jal Jeevan Mission. Burst mains fixed within 4 hours, leakages in 24-48 hours. Helpline 1916. Contaminated water lab testing in 12-24h under BIS 10500:2012.
3. Electricity: State DISCOMs / Urja Mitra. Urban feeder outage rectified in 4-8 hours; burnt transformers within 24 hours. National Helpline 1912.
4. Solid Waste: Municipal SWM / Swachhata. Helpline 1969. Door-to-door and overflowing bins cleared within 24h per Solid Waste Management Rules 2016.
5. Stormwater Drains: Monsoon alerts require 24h clearance; routine desilting 3-5 days.
6. Streetlights: EESL / Municipal Electrical Cell. Helpline 1800-180-3580. 24-48h for bulb/driver, 72h for cable fault.
7. Stray Animals & Dogs: Animal Birth Control (Dogs) Rules 2023. Sterilization, anti-rabies vaccination, release in same territory. Helpline 1926/155304. Dead carcass in 6 hours.
8. Statutory Certificates: Sakala / Right to Public Services Act (RTSA). Income/caste/birth/death delay has statutory 7-14 day SLA. Delay warrants compensation or escalation to Appellate Authority.
9. Ration & PDS: Food & Civil Supplies. NFSA helpline 1967. e-POS biometric failure allows OTP / register fallback.
10. RTI Act 2005: 30 days general, 48 hours for life & liberty.

Boundary & Safety Rules:
1. SUPPORTED TOPICS: Municipal complaints, public infrastructure, drinking water, electricity, solid waste, stray animals, and citizen charter timelines.
2. UNSUPPORTED TOPICS: Private legal representation, court litigation, criminal defense, judicial verdicts, tax evasion, stock/crypto investment, medical diagnosis.
3. DISTINCTION BETWEEN GUIDANCE & LEGAL DECISION: Always maintain a strict boundary. Inform the user that CivicAssist AI provides general informational guidance based on citizen charters and does NOT provide binding legal decisions or judicial rulings. For official legal aid, refer to NALSA (Helpline 15100).
4. NO LIVE INTEGRATION CLAIMS: Do not claim to directly issue court summons or dispatch live police forces unless processed through official government portals.
5. Conclude with a verified source name and review date.
`;

// Helper: Curated knowledge response generator for offline/fallback use
function getCuratedCivicFallback(query: string) {
  const q = query.toLowerCase();

  // Check for unsupported / out-of-scope queries
  if (
    q.includes('court') ||
    q.includes('lawsuit') ||
    q.includes('sue') ||
    q.includes('legal representation') ||
    q.includes('advocate') ||
    q.includes('judge') ||
    q.includes('verdict') ||
    q.includes('bail') ||
    q.includes('divorce') ||
    q.includes('criminal') ||
    q.includes('stock') ||
    q.includes('crypto') ||
    q.includes('bitcoin') ||
    q.includes('invest') ||
    q.includes('medicine') ||
    q.includes('prescription') ||
    q.includes('diagnose')
  ) {
    return {
      reply: `⚠️ **Unsupported Request / Boundary Notice**

CivicAssist AI is specialized strictly in **Indian municipal public services and administrative grievance redressal** (e.g., roads, drinking water, power supply, garbage, and citizen certificates).

• **Not Legal, Judicial, or Financial Counsel:** We do not provide court litigation representation, personal legal counsel, investment advice, or medical prescriptions.
• **Distinction Between Guidance & Official Decisions:** Information provided by this assistant is **general informational guidance** based on published citizen charters. It does **not** constitute an official administrative ruling, legal decision, or court judgment.
• **Where to Seek Official Legal Aid:**
  - For free legal aid in India: Contact the **National Legal Services Authority (NALSA)** at Toll-Free Helpline **15100** or visit your District Legal Services Authority (DLSA).
  - For court matters: Consult an advocate registered with your State Bar Council.
  - For civic grievances: You can explore our public services directory or lodge a municipal complaint through the **Submit Grievance** tab.`,
      source: 'National Legal Services Authority (NALSA) & DARPG Citizen Charter Guidelines',
      reviewDate: 'January 2026',
    };
  }

  if (q.includes('pothole') || q.includes('road') || q.includes('crater') || q.includes('tar') || q.includes('asphalt')) {
    return {
      reply: `For pothole and road damage in municipal areas:
• **Responsible Authority:** Municipal Corporation Roads Wing or State Public Works Department (PWD).
• **Turnaround Time (SLA):** 48 to 72 hours for major arterial roads; 5 working days for interior residential colony roads.
• **Required Details:** Geotagged photograph of the road crater, landmark/road number, and ward details.
• **Resolution Process:** Inspection by Assistant Engineer (Roads) followed by cold/hot-mix bitumen patch application.
• **Next Action:** You can immediately lodge this grievance in our **Submit Grievance** tab under *Roads & Infrastructure*.`,
      source: 'Ministry of Road Transport & State Municipal Citizen Charter',
      reviewDate: 'October 2025',
      suggestedCategory: 'Roads & Infrastructure',
      suggestedDepartment: 'Roads & Infrastructure Maintenance Wing'
    };
  }

  if (q.includes('water') || q.includes('leak') || q.includes('pipe') || q.includes('dirty') || q.includes('tap') || q.includes('contamination')) {
    return {
      reply: `For drinking water pipeline burst, leakage, or contaminated supply:
• **Responsible Authority:** Urban Water Supply and Sewerage Board (Jal Board) / Jal Sansthan.
• **Toll-Free Helpline:** Dial **1916** for 24/7 water emergency assistance.
• **Turnaround Time (SLA):** 4 hours for major water main ruptures; 24 to 48 hours for service pipeline leakages; 12 hours for water sample contamination collection.
• **Immediate Relief:** In cases of contamination, the board is mandated to deploy clean municipal drinking water tankers free of cost.
• **Next Action:** File a complaint under *Water Supply & Drainage* with your nearest cross-street or consumer CAN/RR number.`,
      source: 'Central Public Health & Environmental Engineering Organisation (CPHEEO)',
      reviewDate: 'September 2025',
      suggestedCategory: 'Water Supply & Drainage',
      suggestedDepartment: 'Urban Water Supply & Sewerage Board'
    };
  }

  if (q.includes('power') || q.includes('electric') || q.includes('transformer') || q.includes('voltage') || q.includes('current') || q.includes('bill')) {
    return {
      reply: `For electricity outages, sparking transformers, or meter faults:
• **Responsible Authority:** State Electricity Distribution Company (DISCOM) / Urja Mitra.
• **Toll-Free National Helpline:** Dial **1912** or send SMS to the registered DISCOM code.
• **Turnaround Time (SLA):** 4 to 8 hours for line breakdown in urban areas; within 24 hours for burnt distribution transformer (DTR) replacement.
• **Safety Warning:** If you notice sparking or fire near a transformer pole, immediately maintain a 15-meter clearance and call DISCOM emergency squad.
• **Next Action:** You can track and log this in our **Submit Grievance** tab under *Electricity & Power*.`,
      source: 'State Electricity Regulatory Commission (SERC) Standards of Performance',
      reviewDate: 'November 2025',
      suggestedCategory: 'Electricity & Power',
      suggestedDepartment: 'State Electricity Distribution Company (DISCOM)'
    };
  }

  if (q.includes('garbage') || q.includes('trash') || q.includes('dump') || q.includes('waste') || q.includes('sweeping') || q.includes('swachh')) {
    return {
      reply: `For overflowing garbage, uncollected waste, or illegal dumping:
• **Responsible Authority:** Solid Waste Management (SWM) Division / Swachh Bharat Mission (MoHUA).
• **Toll-Free Helpline:** Dial **1969** (Swachhata Helpline).
• **Turnaround Time (SLA):** Same-day clearance (within 12 to 24 hours) for public garbage vulnerable points (GVP).
• **Penalties:** Under Solid Waste Management Rules 2016, commercial establishments dumping waste in public open spaces face mandatory fines ranging from ₹5,000 to ₹25,000.
• **Next Action:** Upload a photograph in our **Submit Grievance** tab under *Waste & Sanitation* for rapid sanitation squad dispatch.`,
      source: 'Solid Waste Management Rules 2016 / Swachh Survekshan Guidelines',
      reviewDate: 'January 2026',
      suggestedCategory: 'Waste & Sanitation',
      suggestedDepartment: 'Solid Waste Management & Sanitation Wing'
    };
  }

  if (q.includes('dog') || q.includes('animal') || q.includes('rabies') || q.includes('cattle') || q.includes('stray') || q.includes('carcass')) {
    return {
      reply: `For stray dogs, aggressive packs, or animal carcass removal:
• **Responsible Authority:** Municipal Veterinary Cell & Animal Husbandry Department.
• **Turnaround Time (SLA):** Dead animal carcass removal within 6 hours; Animal Birth Control (ABC) catch, sterilize, vaccinate and release within 5 to 7 days.
• **Legal Framework:** In accordance with the Animal Birth Control (Dogs) Rules 2023 and Supreme Court orders, relocated animals MUST be returned to the exact same territory after sterilization and rabies vaccination.
• **Helpline:** Call 1926 or local municipal helpline 155304.`,
      source: 'Animal Birth Control (Dogs) Rules 2023 - Ministry of Fisheries, Animal Husbandry & Dairying',
      reviewDate: 'November 2025',
      suggestedCategory: 'Public Health & Safety',
      suggestedDepartment: 'Veterinary Services & Animal Husbandry Cell'
    };
  }

  if (q.includes('certificate') || q.includes('caste') || q.includes('income') || q.includes('birth') || q.includes('death') || q.includes('sakala') || q.includes('delay')) {
    return {
      reply: `For delayed government certificates (Birth, Death, Caste, Income, Domicile):
• **Governing Framework:** Right to Public Services Act (RTSA) / State Sakala / e-District Citizen Charter.
• **Mandatory SLA:** 7 to 14 working days from application submission date.
• **Citizen Remedy:** If the designated official fails to dispose of the application within the SLA without valid query, you are entitled to appeal to the Sub-Divisional First Appellate Authority.
• **Documents Required:** Application Acknowledgement (GSC / Sakala / e-District No.) and citizen Aadhaar.
• **Next Action:** Lodge an escalation under *Civic Certificates & Welfare*.`,
      source: 'Right to Public Services Act (RTSA) & DARPG Citizen Charters',
      reviewDate: 'October 2025',
      suggestedCategory: 'Civic Certificates & Welfare',
      suggestedDepartment: 'e-Governance & Revenue (Tehsildar / Taluk Office)'
    };
  }

  // General fallback response
  return {
    reply: `Here is how the Indian public grievance redressal process works for your request:
• **Central & State Redressal Mechanism:** Complaints can be tracked across urban local bodies, district collectorates, and CPGRAMS (Centralised Public Grievance Redress and Monitoring System).
• **Standard SLA:** Most civic complaints have a mandatory 3 to 7 working day resolution timeline per citizen charters.
• **Escalation Hierarchy:** 
  1. Level 1: Ward Assistant Engineer / Sanitary Inspector
  2. Level 2: Executive Engineer / Health Officer
  3. Level 3: Zonal Commissioner / District Collector
• **How to Proceed:** You can submit your grievance using our built-in **Submit Grievance** form, receive a unique reference ID (e.g., CA-2026-XXXX), and monitor progress with real-time audit logs.`,
    source: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    reviewDate: 'January 2026',
    suggestedCategory: 'Roads & Infrastructure',
    suggestedDepartment: 'Municipal Administration & Urban Development'
  };
}

// AI Chat API route
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, lang = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      te: 'Telugu (తెలుగు)',
      kn: 'Kannada (ಕನ್ನಡ)',
      ta: 'Tamil (தமிழ்)',
    };

    const targetLangName = languageNames[lang] || 'English';

    // If Gemini client is configured with API key, use it
    if (aiClient) {
      try {
        const prompt = `
Context Knowledge Base:
${CIVIC_KNOWLEDGE_CONTEXT}

User Query:
"${message}"

Language Requirement:
IMPORTANT: The user has selected the language: ${targetLangName} (code: ${lang}).
Generate your "reply" response in ${targetLangName}. 
Ensure high fluency and natural phrasing in ${targetLangName}.
Keep official telephone helpline numbers (e.g. 1916, 1912, 1969, 112, 15100) and reference numbers easily readable.

Instructions:
1. Provide an informative, empathetic, actionable answer in clean markdown with bullet points in ${targetLangName}.
2. Clearly mention the relevant department, expected SLA, and required documents.
3. Format your response in valid JSON with these fields:
{
  "reply": "Your main answer in markdown with bullet points in ${targetLangName}",
  "source": "Name of official source or citizen charter",
  "reviewDate": "Month Year of review, e.g. January 2026",
  "suggestedCategory": "One of: Roads & Infrastructure, Water Supply & Drainage, Electricity & Power, Waste & Sanitation, Public Health & Safety, Civic Certificates & Welfare",
  "suggestedDepartment": "Official name of responsible department"
}
Output ONLY valid JSON.
`;

        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 8 seconds')), 8000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const rawText = response.text || '';
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.reply) {
            return res.json({
              reply: parsed.reply,
              source: parsed.source || 'Department of Administrative Reforms & Public Grievances (DARPG)',
              reviewDate: parsed.reviewDate || 'January 2026',
              suggestedCategory: parsed.suggestedCategory,
              suggestedDepartment: parsed.suggestedDepartment,
              isAiPowered: true,
            });
          }
        } catch {
          // If JSON parse failed, return rawText with standard source
          return res.json({
            reply: rawText,
            source: 'CPGRAMS Citizen Charter & Indian Municipal Standards',
            reviewDate: 'January 2026',
            isAiPowered: true,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out, falling back to curated knowledge base:', geminiError);
        // Fall back gracefully below
      }
    }

    // Graceful fallback to curated Indian civic knowledge engine
    const fallback = getCuratedCivicFallback(message);
    return res.json({
      ...fallback,
      isAiPowered: false,
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      error: 'An unexpected error occurred while processing your request.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CivicAssist AI API',
    hasGeminiKey: Boolean(apiKey),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  // Mount Vite middlewares in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production if dist exists
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicAssist AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
