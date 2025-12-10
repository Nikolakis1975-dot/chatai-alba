// ======================================== ✅ FUNKSION I AVANCUAR PËR KËRKIM NJOHURISH ============================================

async function searchKnowledge(userId, message) {
    console.log('🔍 [KNOWLEDGE-SEARCH] Duke kërkuar për user:', userId, 'message:', message);
    
    const searchVariations = [
        message.toLowerCase(),
        message.toLowerCase().replace(/\?/g, ''),
        message.toLowerCase().replace(/\s+/g, ' ').trim(),
        message.toLowerCase().replace(/\bcfare\b/gi, 'çfarë'),
        message.toLowerCase().replace(/\beshte\b/gi, 'është')
    ];
    
    // Hiq dublikatat
    const uniqueVariations = [...new Set(searchVariations.filter(v => v.length > 0))];
    
    console.log('🔍 [KNOWLEDGE-SEARCH] Variantet e kërkimit:', uniqueVariations);
    
    // ✅ KËRKO NË RADICAL_KNOWLEDGE
    for (const variation of uniqueVariations) {
        try {
            const result = await new Promise((resolve) => {
                db.get(
                    `SELECT question, answer FROM radical_knowledge 
                     WHERE user_id = ? AND LOWER(question) LIKE ? 
                     ORDER BY created_at DESC LIMIT 1`,
                    [userId, `%${variation}%`],
                    (err, row) => resolve(row)
                );
            });
            
            if (result && result.answer) {
                console.log('✅✅✅ [KNOWLEDGE-SEARCH] GJETËM NË RADICAL!');
                console.log('📝 Pyetja e gjetur:', result.question);
                console.log('💡 Përgjigja:', result.answer);
                return {
                    source: 'radical_knowledge',
                    question: result.question,
                    answer: result.answer
                };
            }
        } catch (error) {
            console.log('ℹ️ [KNOWLEDGE-SEARCH] Error në radical search:', error.message);
        }
    }
    
    // ✅ KËRKO NË KNOWLEDGE
    for (const variation of uniqueVariations) {
        try {
            const result = await new Promise((resolve) => {
                db.get(
                    `SELECT question, answer FROM knowledge 
                     WHERE user_id = ? AND LOWER(question) LIKE ? 
                     ORDER BY created_at DESC LIMIT 1`,
                    [userId, `%${variation}%`],
                    (err, row) => resolve(row)
                );
            });
            
            if (result && result.answer) {
                console.log('✅✅✅ [KNOWLEDGE-SEARCH] GJETËM NË KNOWLEDGE!');
                return {
                    source: 'knowledge',
                    question: result.question,
                    answer: result.answer
                };
            }
        } catch (error) {
            console.log('ℹ️ [KNOWLEDGE-SEARCH] Error në knowledge search:', error.message);
        }
    }
    
    console.log('❌ [KNOWLEDGE-SEARCH] Nuk u gjet në asnjë database');
    return null;
}

const crypto = require('crypto');
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ IMPORT I KONSTANTAVE
const constants = require('../config/constants');

// ======================================== ✅ FUNKSIONET NDIHMËSE ME DATABASE ============================================

async function checkApiKey(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, 'gemini'],
            (err, result) => {
                if (err) {
                    console.error('❌ Gabim në checkApiKey:', err);
                    resolve(false);
                } else {
                    resolve(!!result);
                }
            }
        );
    });
}

// =================================== ✅ RUTA KRYESORE E CHAT - VERSIONI I RI ===============================

router.post('/message', async (req, res) => {
    try {
        const { message, engine = 'gemini' } = req.body;
        const userId = req.user?.userId || 1;

        console.log('💬 [CHAT] Mesazh i marrë:', message);
        console.log('🔧 [CHAT] Motor i zgjedhur:', engine);
        console.log('👤 [CHAT] User ID:', userId);

        if (!message || !message.trim()) {
            return res.json({
                success: false,
                error: '❌ Ju lutem shkruani një mesazh'
            });
        }

        // ==================== ✅ HAPI 1: KONTROLLO KOMANDAT ====================
        if (message.startsWith('/')) {
            console.log('🎯 [CHAT] Komandë e zbuluar:', message);
            
            // ✅ KTHE PJEGJIGJE DIRECT PËR /ndihmo
            if (message === '/ndihmo') {
                console.log('✅ [CHAT] Duke kthyer /ndihmo direkt...');
                return res.json({
                    success: true,
                    response: `👑 **SISTEMI I KOMANDAVE - RRUFE-TESLA** 👑

📋 **KOMANDAT BAZE:**
• /ndihmo - Kjo liste
• /wiki <temë> - Kërkim Wikipedia  
• /moti <qytet> - Informacion moti
• /meso <pyetje>|<përgjigje> - Mëso diçka të re
• /apikey <key> - Vendos API Key
• /eksporto - Eksporto të dhënat
• /importo - Importo të dhënat
• /dil - Dil nga sistemi

🚀 **KËRKIM:**
• /gjej <kërkim> - Kërkim i thelluar
• /google <kërkim> - Kërkim Google

🎓 **STUDENT:**
• /student - Menu studenti
• /liber <emër> - Gjej libra
• /detyre <lendë> - Ndihmë detyrash

👑 **ADMIN:**
• /admin - Paneli i adminit (vetëm për administratorë)

🔧 **Motor aktiv:** ${engine}`,
                    source: 'command_direct'
                });
            }

            // ✅ PËR KOMANDA TË TJERA, LËRE SCRIPT.JS TË TRAJTOJË
            return res.json({
                success: true,
                response: `🔧 **Komanda:** ${message}\n\n💡 *Sistemi i komandave po përmirësohet. Ju lutem përdorni /ndihmo për listën e plotë.*`,
                source: 'command_fallback'
            });
        }

        // ==================== ✅ HAPI 2: KONTROLLO NJOHURITË E RUAJTURA ====================
console.log('🔍 [CHAT] Duke kontrolluar njohuritë e ruajtura për:', message);

const messageLower = message.toLowerCase().trim();

// ✅ 2A: KONTROLLO NË RADICAL_KNOWLEDGE
try {
    console.log('🔍 [CHAT] Duke kërkuar në radical_knowledge...');
    
    // Merr të gjitha të dhënat për këtë user
    const allRadicalData = await new Promise((resolve) => {
        db.all(
            `SELECT question, answer FROM radical_knowledge WHERE user_id = ?`,
            [userId],
            (err, rows) => {
                if (err) {
                    console.error('❌ [CHAT] Gabim radical:', err);
                    resolve([]);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
    
    console.log(`📊 [CHAT] Gjetëm ${allRadicalData.length} pyetje në radical_knowledge`);
    
    // Kërko manualisht për përputhje
    for (const row of allRadicalData) {
        const dbQuestion = row.question.toLowerCase().trim();
        const dbAnswer = row.answer;
        
        console.log(`🔍 [CHAT] Krahasoj "${messageLower}" me "${dbQuestion}"`);
        
        // Kontrollo për përputhje të drejtpërdrejtë
        if (dbQuestion === messageLower) {
            console.log('✅✅✅ [CHAT] PËRSHPATJE E PËRSOSUR!');
            return res.json({
                success: true,
                response: `💾 **Përgjigje e ruajtur:** ${dbAnswer}`,
                source: 'radical_exact_match'
            });
        }
        
        // Kontrollo nëse njëra përmban tjetrën
        if (dbQuestion.includes(messageLower) || messageLower.includes(dbQuestion)) {
            console.log('✅✅✅ [CHAT] PËRSHPATJE ME INCLUDE!');
            return res.json({
                success: true,
                response: `💾 **Përgjigje e ruajtur:** ${dbAnswer}`,
                source: 'radical_include_match'
            });
        }
        
        // Kontrollo për sinonime/përkuptime
        const synonyms = {
            'cfare ore eshte': ['sa eshte ora', 'sa eshte koha', 'cfare eshte ora'],
            'si jeni': ['si je', 'si kaloni', 'si kalon'],
            'si je': ['si jeni', 'si kalon', 'si kaloni']
        };
        
        // Kontrollo nëse janë sinonime
        for (const [key, synonymList] of Object.entries(synonyms)) {
            if (messageLower.includes(key) && synonymList.some(syn => dbQuestion.includes(syn))) {
                console.log('✅✅✅ [CHAT] PËRSHPATJE ME SINONIME!');
                return res.json({
                    success: true,
                    response: `💾 **Përgjigje e ruajtur:** ${dbAnswer}`,
                    source: 'radical_synonym_match'
                });
            }
        }
    }
    
    console.log('ℹ️ [CHAT] Nuk u gjet në radical_knowledge');
    
} catch (radicalError) {
    console.log('❌ [CHAT] Gabim radical:', radicalError.message);
}

// =============================== ✅ 2B: KONTROLLO NË KNOWLEDGE (SISTEMI I VJETËR) ==================================
try {
    // Kërko me LIKE të thjeshtë (case-insensitive)
    const knowledgeResult = await new Promise((resolve) => {
        db.get(
            `SELECT answer FROM knowledge 
             WHERE user_id = ? 
             AND (LOWER(question) LIKE LOWER(?) OR LOWER(question) LIKE LOWER(?))
             ORDER BY created_at DESC LIMIT 1`,
            [userId, `%${message}%`, `%${message.replace(/\?/g, '')}%`],
            (err, row) => {
                if (err) {
                    console.error('❌ [CHAT] Gabim në kërkim knowledge:', err);
                    resolve(null);
                } else {
                    if (row) console.log('✅ [CHAT] Gjetëm knowledge result');
                    resolve(row);
                }
            }
        );
    });
    
    if (knowledgeResult && knowledgeResult.answer) {
        console.log('✅✅✅ [CHAT] GJETËM PËRGJIGJE NË KNOWLEDGE!');
        
        return res.json({
            success: true,
            response: `💾 **Përgjigje e ruajtur:** ${knowledgeResult.answer}`,
            source: 'knowledge'
        });
    } else {
        console.log('ℹ️ [CHAT] Nuk u gjet në knowledge');
    }
} catch (knowledgeError) {
    console.log('ℹ️ [CHAT] Error në knowledge search:', knowledgeError.message);
}

console.log('ℹ️ [CHAT] Nuk u gjet përgjigje e ruajtur në asnjë database');
        
// ==================================== ✅ 2B: KONTROLLO NË KNOWLEDGE (SISTEMI I VJETËR) ===================================
        
        try {
            const knowledgeResult = await new Promise((resolve) => {
                db.get(
                    `SELECT answer FROM knowledge 
                     WHERE user_id = ? AND LOWER(question) LIKE ? 
                     ORDER BY created_at DESC LIMIT 1`,
                    [userId, `%${message.toLowerCase()}%`],
                    (err, row) => {
                        if (err) {
                            console.error('❌ [CHAT] Gabim në kërkim knowledge:', err);
                            resolve(null);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });
            
            if (knowledgeResult && knowledgeResult.answer) {
                console.log('✅✅✅ [CHAT] GJETËM PËRGJIGJE NË KNOWLEDGE!');
                return res.json({
                    success: true,
                    response: `💾 **Përgjigje e ruajtur:** ${knowledgeResult.answer}`,
                    source: 'knowledge'
                });
            }
        } catch (knowledgeError) {
            console.log('ℹ️ [CHAT] Nuk ka përgjigje në knowledge:', knowledgeError.message);
        }
        
        console.log('ℹ️ [CHAT] Nuk u gjet përgjigje e ruajtur');

        // ==================== ✅ HAPI 3: KONTROLLO LLOGARITJE MATEMATIKE ====================
        console.log('🧮 [CHAT] Duke kontrolluar për llogaritje...');
        
        const calculate = (expr) => {
            try {
                // Kontrollo sigurinë
                if (!/^[\d\+\-\*\/\(\)\.\s]+$/.test(expr)) return null;
                
                // Zëvendëso fjalët me operatorë
                const cleaned = expr
                    .replace(/\bplus\b/gi, '+')
                    .replace(/\bminus\b/gi, '-')
                    .replace(/\bher[eë]\b/gi, '*')
                    .replace(/\bpjes[eë]to\b/gi, '/')
                    .replace(/\bsa b[eë]jn[eë]\b/gi, '')
                    .replace(/\s+/g, '');
                
                const result = Function('"use strict";return (' + cleaned + ')')();
                if (typeof result === 'number' && !isNaN(result)) return result;
            } catch {}
            return null;
        };
        
        const mathResult = calculate(message);
        if (mathResult !== null) {
            console.log('✅✅✅ [CHAT] GJETËM LLOGARITJE!');
            return res.json({
                success: true,
                response: `🧮 **Rezultati:** ${mathResult}`,
                source: 'math'
            });
        }

        // ==================== ✅ HAPI 4: DËRGO TE AI MOTOR ====================
        console.log(`🚀 [CHAT] Duke dërguar te ${engine.toUpperCase()} AI...`);

        // ✅ 4A: OPENAI
        if (engine === 'openai') {
            try {
                console.log('🔮 [CHAT] Duke thirrur OpenAI...');
                
                // Kontrollo nëse ka API key për OpenAI
                const openaiKeyRow = await new Promise((resolve) => {
                    db.get(
                        'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                        [userId, 'openai'],
                        (err, row) => {
                            if (err) {
                                console.error('❌ [CHAT] Gabim në marrjen e OpenAI key:', err);
                                resolve(null);
                            } else {
                                resolve(row);
                            }
                        }
                    );
                });
                
                if (openaiKeyRow?.api_key) {
                    try {
                        const { OpenAI } = require('openai');
                        const openai = new OpenAI({ apiKey: openaiKeyRow.api_key });
                        
                        const completion = await openai.chat.completions.create({
                            model: 'gpt-3.5-turbo',
                            messages: [
                                { 
                                    role: "system", 
                                    content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative dhe intuitive." 
                                },
                                { 
                                    role: "user", 
                                    content: message 
                                }
                            ],
                            max_tokens: 500
                        });
                        
                        return res.json({
                            success: true,
                            response: `🔮 **OpenAI:** ${completion.choices[0].message.content}`,
                            source: 'openai'
                        });
                    } catch (openaiError) {
                        console.error('❌ [CHAT] Gabim OpenAI API:', openaiError.message);
                        console.log('🔄 [CHAT] OpenAI dështoi, duke u kthyer në Gemini...');
                    }
                } else {
                    console.log('⚠️ [CHAT] Nuk ka OpenAI API Key, duke përdorur Gemini');
                }
            } catch (error) {
                console.error('❌ [CHAT] Gabim në procesimin e OpenAI:', error);
            }
        }

        // ✅ 4B: GEMINI (DEFAULT OSE FALLBACK)
        console.log('🤖 [CHAT] Duke thirrur Gemini...');
        
        try {
            // Kontrollo nëse ka API key për Gemini
            const geminiKeyRow = await new Promise((resolve) => {
                db.get(
                    'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                    [userId, 'gemini'],
                    (err, row) => {
                        if (err) {
                            console.error('❌ [CHAT] Gabim në marrjen e Gemini key:', err);
                            resolve(null);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });
            
            if (geminiKeyRow?.api_key) {
                try {
                    const { GoogleGenerativeAI } = require('@google/generative-ai');
                    const genAI = new GoogleGenerativeAI(geminiKeyRow.api_key);
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    
                    const result = await model.generateContent(message);
                    const response = await result.response;
                    const text = response.text();
                    
                    return res.json({
                        success: true,
                        response: `🤖 **Gemini:** ${text}`,
                        source: 'gemini'
                    });
                } catch (geminiError) {
                    console.error('❌ [CHAT] Gabim Gemini API:', geminiError.message);
                }
            } else {
                console.log('⚠️ [CHAT] Nuk ka Gemini API Key');
            }
        } catch (error) {
            console.error('❌ [CHAT] Gabim në procesimin e Gemini:', error);
        }

        // ==================== ✅ HAPI 5: FALLBACK FINAL ====================
        console.log('⚠️ [CHAT] Të dy motorët dështuan ose nuk kanë API Key');
        
        // Kontrollo nëse është pyetje e thjeshtë
        const simpleQuestions = {
            'si je': 'Jam mirë, faleminderit! Po ti?',
            'si jeni': 'Jam mirë, faleminderit! Po ju?',
            'si kalove': 'Jam mirë, duke punuar!',
            'si kaluat': 'Jam mirë, duke punuar!',
            'si quhesh': 'Unë jam RRUFE-TESLA AI',
            'cfarë je': 'Unë jam një asistencë AI inteligjente',
            'pershendetje': 'Pershendetje! Si mund t' + 'ju ndihmoj?',
            'hello': 'Hello! How can I help you?',
            'hi': 'Hi! How are you today?'
        };
        
        const lowerMessage = message.toLowerCase();
        for (const [key, answer] of Object.entries(simpleQuestions)) {
            if (lowerMessage.includes(key)) {
                return res.json({
                    success: true,
                    response: `💬 **RRUFE-TESLA:** ${answer}`,
                    source: 'fallback'
                });
            }
        }

        // Fallback final
        return res.json({
            success: true,
            response: `🤔 **RRUFE-TESLA:** Nuk e kam përgjigjen për "${message}". Mund të provosh:\n\n1. 🤖 Ndrysho motorin në OpenAI\n2. 💾 Mëso diçka të re: /meso pyetja|përgjigja\n3. 🔍 Kërko në internet: /gjej "${message}"`,
            source: 'final_fallback'
        });

    } catch (error) {
        console.error('❌ [CHAT] Gabim në route:', error);
        res.json({ 
            success: false, 
            error: '❌ Gabim në server. Ju lutem provoni përsëri.' 
        });
    }
});

// ========================== ✅ KODI EKZISTUES - RUTA PËR PANELIN E NDIHMËS ME BUTONA =============================

router.get('/help-panel', async (req, res) => {
    try {
        const helpPanel = `
<div class="help-panel" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div class="panel-header" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0;">👑 CHATAI ALBA - PANELI I NDIHMËS 👑</h2>
  </div>

  <div class="panel-section" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h3 style="color: #2c3e50; margin-top: 0;">🔹 KOMANDAT BAZË</h3>
    <div class="button-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <button onclick="useCommand('/ndihmo')" style="background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📋 /ndihmo</button>
      <button onclick="useCommand('/wiki ')" style="background: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🌐 /wiki</button>
      <button onclick="useCommand('/perkthim ')" style="background: #FF9800; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔄 /perkthim</button>
      <button onclick="useCommand('/meso ')" style="background: #9C27B0; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🎓 /meso</button>
      <button onclick="useCommand('/moti ')" style="background: #607D8B; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🌍 /moti</button>
      <button onclick="useCommand('/apikey ')" style="background: #795548; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔑 /apikey</button>
    </div>
  </div>

  <div class="panel-section" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h3 style="color: #1565c0; margin-top: 0;">🚀 KËRKIM NË INTERNET</h3>
    <div class="button-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
      <button onclick="useCommand('/gjej ')" style="background: #FF5722; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔍 /gjej</button>
      <button onclick="useCommand('/google ')" style="background: #4285F4; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🔎 /google</button>
      <button onclick="useCommand('/kërko ')" style="background: #34A853; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📰 /kërko</button>
    </div>
  </div>

  <div class="panel-section" style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h3 style="color: #e65100; margin-top: 0;">💾 MENAXHIM I DHËNAVE</h3>
    <div class="button-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <button onclick="useCommand('/eksporto')" style="background: #009688; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📥 /eksporto</button>
      <button onclick="useCommand('/importo')" style="background: #FFC107; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📤 /importo</button>
    </div>
  </div>

  <div class="panel-section" style="background: #fce4ec; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h3 style="color: #c2185b; margin-top: 0;">👑 ADMIN PANEL</h3>
    <div class="button-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <button onclick="useCommand('/admin')" style="background: #7B1FA2; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">⚡ /admin</button>
      <button onclick="useCommand('/users')" style="background: #512DA8; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">👥 /users</button>
      <button onclick="useCommand('/stats')" style="background: #303F9F; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">📊 /stats</button>
      <button onclick="useCommand('/panel')" style="background: #1976D2; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">🛠️ /panel</button>
    </div>
  </div>

  <div class="quick-actions" style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h3 style="color: #2e7d32; margin-top: 0;">⚡ VEPRIME TË SHPEJTA</h3>
    <input type="text" id="quickCommand" placeholder="Shkruaj komandën këtu..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
    <button onclick="executeQuickCommand()" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">🚀 Ekzekuto Komandën</button>
  </div>
</div>

<script>
function useCommand(command) {
    const input = document.getElementById('user-input');
    if (input) {
        input.value = command;
        input.focus();
    }
}

function executeQuickCommand() {
    const quickInput = document.getElementById('quickCommand');
    const command = quickInput.value.trim();
    if (command) {
        const input = document.getElementById('user-input');
        if (input) {
            input.value = command;
            input.focus();
        }
    }
}
</script>
        `;
        
        res.json({
            success: true,
            response: helpPanel
        });
        
    } catch (error) {
        console.error('❌ Gabim në panelin e ndihmës:', error);
        res.json({
            success: false,
            response: '❌ Gabim në server'
        });
    }
});

// ✅ KODI EKZISTUES - RUAJ MESAZHIN NË HISTORI
router.post('/save', (req, res) => {
    const { userId, content, sender, timestamp } = req.body;

    if (!userId || !content || !sender) {
        return res.status(400).json({ error: 'Të dhëna të pamjaftueshme' });
    }

    db.run(
        'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
        [userId, content, sender, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtjen e mesazhit:', err);
                return res.status(500).json({ error: 'Gabim gjatë ruajtjes së mesazhit' });
            }

            res.json({ message: 'Mesazhi u ruajt me sukses', id: this.lastID });
        }
    );
});

// ✅ KODI EKZISTUES - RUAJ NJOHURI TË REJA
router.post('/knowledge', (req, res) => {
    const { userId, question, answer } = req.body;

    if (!userId || !question || !answer) {
        return res.status(400).json({ error: 'Të dhëna të pamjaftueshme' });
    }

    db.run(
        'INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)',
        [userId, question, answer],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtjen e njohurive:', err);
                return res.status(500).json({ error: 'Gabim gjatë ruajtjes së njohurive' });
            }

            res.json({ message: 'Njohuria u ruajt me sukses', id: this.lastID });
        }
    );
});

// ✅ KODI EKZISTUES - KËRKO NJOHURI
router.get('/knowledge/:userId/:question', (req, res) => {
    const { userId, question } = req.params;

    db.get(
        'SELECT answer FROM knowledge_base WHERE user_id = ? AND question = ?',
        [userId, question],
        (err, row) => {
            if (err) {
                console.error('❌ Gabim në kërkimin e njohurive:', err);
                return res.status(500).json({ error: 'Gabim gjatë kërkimit të njohurive' });
            }

            if (row) {
                res.json({ answer: row.answer });
            } else {
                res.json({ answer: null });
            }
        }
    );
});

// ✅ KODI EKZISTUES - EKSPORTO NJOHURITË
router.get('/export/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        'SELECT question, answer FROM knowledge_base WHERE user_id = ?',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Gabim në eksportimin e njohurive:', err);
                return res.status(500).json({ error: 'Gabim gjatë eksportimit të njohurive' });
            }

            res.json(rows);
        }
    );
});

// ✅ KODI EKZISTUES - IMPORTO NJOHURITË
router.post('/import', (req, res) => {
    const { userId, knowledge } = req.body;

    if (!userId || !knowledge || !Array.isArray(knowledge)) {
        return res.status(400).json({ error: 'Të dhëna të pamjaftueshme' });
    }

    // Fshi njohuritë ekzistuese për këtë përdorues
    db.run('DELETE FROM knowledge_base WHERE user_id = ?', [userId], (err) => {
        if (err) {
            console.error('❌ Gabim në importimin e njohurive:', err);
            return res.status(500).json({ error: 'Gabim gjatë importimit të njohurive' });
        }

        // Shto njohuritë e reja
        const stmt = db.prepare('INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)');
        
        knowledge.forEach(item => {
            if (item.question && item.answer) {
                stmt.run([userId, item.question, item.answer]);
            }
        });

        stmt.finalize((err) => {
            if (err) {
                console.error('❌ Gabim në importimin e njohurive:', err);
                return res.status(500).json({ error: 'Gabim gjatë importimit të njohurive' });
            }

            res.json({ message: 'Njohuritë u importuan me sukses' });
        });
    });
});

// ✅ KODI EKZISTUES - FSHI HISTORINË E PËRDORUESIT
router.delete('/clear/:userId', (req, res) => {
    const { userId } = req.params;

    db.run(
        'DELETE FROM messages WHERE user_id = ?',
        [userId],
        function(err) {
            if (err) {
                console.error('❌ Gabim në fshirjen e historisë:', err);
                return res.status(500).json({ error: 'Gabim gjatë fshirjes së historisë' });
            }
            res.json({ message: 'Historia u fshi me sukses' });
        }
    );
});

// ✅ KODI EKZISTUES - EKSPORTO HISTORINË
router.get('/export-history/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp ASC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Gabim në eksportimin e historisë:', err);
                return res.status(500).json({ error: 'Gabim gjatë eksportimit të historisë' });
            }
            res.json({ history: rows });
        }
    );
});

// ✅ KODI EKZISTUES - RUAJ FEEDBACK
router.post('/feedback', (req, res) => {
    const { userId, messageId, feedbackType } = req.body;

    db.run(
        'INSERT INTO feedback (user_id, message_id, feedback_type) VALUES (?, ?, ?)',
        [userId, messageId, feedbackType],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtjen e feedback:', err);
                return res.status(500).json({ error: 'Gabim gjatë ruajtjes së feedback' });
            }
            res.json({ message: 'Feedback u ruajt me sukses' });
        }
    );
});

// =================== 🔮 OPENAI CHAT ROUTE - VERSION I OPTIMIZUAR =====================
router.post('/openai', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?.userId || 1; // Merr userId nga authentication

        console.log("🔮 [OPENAI-ROUTE] Mesazh i marrë:", message?.substring(0, 50));

        if (!message || !message.trim()) {
            return res.json({
                success: false,
                error: "❌ Ju lutem shkruani një mesazh."
            });
        }

        // 1) ✅ LEXO API KEY NGA DATABASE ME ENKRIPTIM
        const apiRow = await new Promise((resolve, reject) => {
            db.get(
                'SELECT api_key FROM api_keys WHERE user_id = ? AND service_name = ?',
                [userId, 'openai'],
                (err, row) => {
                    if (err) {
                        console.error('❌ [OPENAI-ROUTE] Gabim database:', err);
                        resolve(null);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        if (!apiRow || !apiRow.api_key) {
            console.log('❌ [OPENAI-ROUTE] Nuk ka OpenAI API Key');
            return res.json({
                success: false,
                error: "❌ Nuk ka API Key OpenAI të konfiguruar. Vendosni API Key në panelin OpenAI."
            });
        }

        // 2) ✅ DEKRIPTO API KEY (nëse është i enkriptuar)
        let decryptedKey;
        try {
            const encryption = require('../utils/encryption');
            decryptedKey = encryption.decrypt(apiRow.api_key);
            console.log('🔓 [OPENAI-ROUTE] API Key u dekriptua');
        } catch (decryptError) {
            console.log('⚠️ [OPENAI-ROUTE] API Key nuk është i enkriptuar, duke përdorur direkt');
            decryptedKey = apiRow.api_key;
        }

        // 3) ✅ KONTROLLO NËSE API KEY ËSHTË VALID
        if (!decryptedKey.startsWith('sk-')) {
            console.log('❌ [OPENAI-ROUTE] API Key i pavlefshëm:', decryptedKey.substring(0, 10) + '...');
            return res.json({
                success: false,
                error: "❌ API Key i pavlefshëm për OpenAI. Duhet të fillojë me 'sk-'."
            });
        }

        // 4) ✅ THIRR OPENAI API
        console.log('🌐 [OPENAI-ROUTE] Duke thirrur OpenAI API...');
        
        const { OpenAI } = require('openai');
        const openai = new OpenAI({ 
            apiKey: decryptedKey 
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Përdor gpt-3.5-turbo (më i stabil)
            messages: [
                { 
                    role: "system", 
                    content: "Ti je RRUFE-TESLA AI. Përgjigju në shqip dhe jep përgjigje të dobishme, kreative dhe intuitive." 
                },
                { 
                    role: "user", 
                    content: message 
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const responseText = completion.choices[0].message.content;
        console.log('✅ [OPENAI-ROUTE] Përgjigje e suksesshme nga OpenAI');

        return res.json({
            success: true,
            response: `🔮 **OpenAI RRUFE-TESLA**: ${responseText}`
        });

    } catch (error) {
        console.error("❌ [OPENAI-ROUTE] Gabim:", error.message);
        
        let errorMessage = "❌ Gabim në OpenAI API";
        if (error.message.includes('API key')) {
            errorMessage = "❌ API Key i pavlefshëm për OpenAI";
        } else if (error.message.includes('rate limit')) {
            errorMessage = "❌ Kufizim në shpejtësi. Provoni përsëri më vonë.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = "❌ Problem me lidhjen e internetit.";
        }

        return res.json({
            success: false,
            error: errorMessage
        });
    }
});

module.exports = router;
