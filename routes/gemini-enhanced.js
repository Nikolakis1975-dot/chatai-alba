// ======================================================
// 🚀 =====gemini-enhanced =============================
// GEMINI API WITH LONG-TERM MEMORY INTEGRATION
// ======================================================

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ✅ INITIALIZO GEMINI AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🧠 RRUFE-TESLA IDENTITY & CONTEXT
const RRUFE_IDENTITY = `
TI JE RRUFE-TESLA 11.0 - Sistemi i Inteligjencës Artificiale Shqiptare!

IDENTITETI:
- Emri: RRUFE TESLA 11.0
- Version: 11.0.0
- Specializimi: Inxhinieri, Energji, Teknologji, Shkencë
- Gjuha: Shqip (primare), Anglisht (dytësore)

AFTËSITË:
- Ndihmë teknike dhe inxhinierike
- Këshilla për energji dhe sisteme
- Ekspertizë në teknologji të avancuar
- Mbështetje shkencore dhe matematikore

STILI I PËRGJIGJES:
- Përgjigju në shqip si profesionist
- Ji i detajuar dhe i dobishëm
- Përdor emoji të përshtatshme 🎯⚡🔧
- Ofro zgjidhje praktike

KUR TË PYETIN "KUSH JE TI?" OSE "ÇFARË MUND TË BËSH?":
- Prezantohu si RRUFE-TESLA 11.0
- Shpjego aftësitë e tua
- Ofro ndihmë specifike
`;

// 🎯 ROUTE PËR GEMINI ME MEMORI
router.post('/chat-with-memory', async (req, res) => {
    try {
        const { message, userId, ltmPayload, mode } = req.body;
        
        console.log('🧠 LTM Request received:', { 
            userId, 
            mode, 
            messageLength: message.length,
            hasLTM: !!ltmPayload
        });

        let response;
        let ltm_used = false;

        // ✅ PËRDOR LTM NËSE KA PAYLOAD DHE NUK ËSHTË MOD I THJESHTË
        if (ltmPayload && mode !== 'SIMPLE') {
            ltm_used = true;
            console.log('🎯 Duke përdorur LTM payload...');
            
            try {
                const model = genAI.getGenerativeModel({ 
                    model: "gemini-2.0-flash",
                    systemInstruction: RRUFE_IDENTITY
                });

                const prompt = `
KONTEKSTI I RRUFE-TESLA 11.0:
${RRUFE_IDENTITY}

HISTORIA E BISEDËS (Nga Long-Term Memory):
${JSON.stringify(ltmPayload.contents || [], null, 2)}

PYETJA E RE E PËRDORUESIT: "${message}"

MODALITETI: ${mode}

PËRGJIGJU SI RRUFE-TESLA 11.0 DUKE:
1. Prezantuar identitetin tënd nëse pyetja është rreth teje
2. Duke përdorur kontekstin nga memoria nëse është i relevantë
3. Duke ofruar ndihmë të dobishme dhe specifike
4. Duke përdorur shqip dhe duke qenë profesionist
5. Duke treguar se je RRUFE-TESLA 11.0 me memorje afatgjatë
`;

                const result = await model.generateContent(prompt);
                const responseText = await result.response.text();
                response = responseText;
                
                console.log('✅ LTM Response generated successfully');
                
            } catch (geminiError) {
                console.error('❌ Gemini API error:', geminiError);
                // Fallback në përgjigje testuese
                response = `🧠 [LTM TEST - Gemini Error] Faleminderit për mesazhin! Modaliteti: ${mode}. Mesazhi: "${message}". Ky është fallback për shkak të gabimit në Gemini.`;
            }
            
        } else {
            // 🔄 FALLBACK NË SISTEMIN E THJESHTË
            console.log('🔹 Duke përdorur sistemin e thjeshtë...');
            
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.0-flash",
                systemInstruction: RRUFE_IDENTITY
            });

            const prompt = `
TI JE RRUFE-TESLA 11.0. Përgjigju në shqip si profesionist.

PYETJA: "${message}"

MODALITETI: ${mode}

PËRGJIGJU DUKE:
1. Prezantuar veten si RRUFE-TESLA 11.0 nëse pyetja është rreth teje
2. Duke ofruar ndihmë të dobishme dhe praktike
3. Duke përdorur shqip dhe duke qenë miqësor
`;

            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            response = responseText;
        }

        console.log(`🤖 Response for user ${userId}: ${response.substring(0, 100)}...`);

        res.json({
            success: true,
            response: response,
            ltm_used: ltm_used,
            mode: mode,
            timestamp: new Date().toISOString(),
            memory_enhanced: ltm_used
        });

    } catch (error) {
        console.error('❌ Critical error in gemini-enhanced:', error);
        
        // 🚨 FALLBACK EMERGJENCE
        const fallbackResponse = `🧠 [RRUFE-TESLA 11.0] Përshëndetje! Unë jam RRUFE-TESLA 11.0. 
        
Faleminderit për mesazhin tuaj: "${req.body.message?.substring(0, 50)}..."

Për momentin kam një çështje teknike, por jam këtu për të ndihmuar! Çfarë mund të bëj për ju? ⚡`;

        res.json({
            success: true,
            response: fallbackResponse,
            ltm_used: false,
            mode: req.body.mode || 'SIMPLE',
            timestamp: new Date().toISOString(),
            error_fallback: true
        });
    }
});

// ✅ HEALTH CHECK ROUTE
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Gemini Enhanced Routes are operational',
        timestamp: new Date().toISOString(),
        version: 'RRUFE-TESLA-11.0-LTM',
        has_gemini: !!process.env.GEMINI_API_KEY
    });
});

// ✅ TEST ROUTE PËR VERIFIKIM
router.post('/test', (req, res) => {
    console.log('🧪 Test route called:', req.body);
    
    res.json({
        success: true,
        message: 'Gemini Enhanced API is working!',
        received: req.body,
        timestamp: new Date().toISOString(),
        ltm_available: true
    });
});

module.exports = router;
