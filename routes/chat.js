const crypto = require('crypto');
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ IMPORT I KONSTANTAVE
const constants = require('../config/constants');

// ======================================== ✅ FUNKSIONET NDIHMËSE ME DATABASE ===============================

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

// =================================== ✅ RUTA RADIKALE - BYPASS COMMAND SERVICE ===============================

// Në routes/chat.js - modifiko funksionin /message
router.post('/message', async (req, res) => {
    try {
        const { message, engine } = req.body;
        const userId = req.user?.userId || 1;

        console.log('💬 [CHAT-UI] Mesazh:', message);
        console.log('🔧 [CHAT-UI] Motor:', engine);

        // ==================== ✅ KAP KOMANDAT - VERSION I FORTUAR ====================
        if (message.startsWith('/')) {
            console.log('🎯 [CHAT-UI] Komandë e zbuluar:', message);
            
            // ✅ KTHE PJEGJIGJE DIRECT PËR /ndihmo
            if (message === '/ndihmo') {
                console.log('✅ [CHAT-UI] Duke kthyer /ndihmo direkt...');
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

            // ✅ PROVO COMMAND SERVICE PËR KOMANDA TË TJERA
            try {
                const CommandService = require('../services/commandService');
                console.log('🔧 [CHAT-UI] Duke thirrur CommandService...');
                
                const commandResult = await CommandService.processCommand('command', { id: userId }, message, engine);
                
                if (commandResult && commandResult.success) {
                    console.log('✅ [CHAT-UI] CommandService u përgjigj!');
                    return res.json(commandResult);
                } else {
                    console.log('❌ [CHAT-UI] CommandService dështoi ose nuk dha përgjigje');
                }
            } catch (commandError) {
                console.error('❌ [CHAT-UI] Gabim në CommandService:', commandError.message);
            }

            // ✅ NËSE COMMAND SERVICE DËSHTOI, KTHE FALLBACK
            console.log('🔄 [CHAT-UI] Duke kthyer fallback për komandën...');
            return res.json({
                success: true,
                response: `🔧 **Komanda:** ${message}\n\n💡 *Sistemi i komandave po përmirësohet. Ju lutem përdorni /ndihmo për listën e plotë.*`,
                source: 'command_fallback'
            });
        }

        // =============================✅ OPENAI DIRECT ===================================
        if (engine === 'openai') {
            console.log('🔮 [CHAT-UI] Duke thirrur OpenAI...');
            try {
                const openai = require('../routes/openai');
                const result = await fetch(`http://localhost:3000/api/openai/chat`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        message: message, 
                        userId: userId 
                    })
                }).then(r => r.json());
                
                return res.json(result);
            } catch (error) {
                console.error('❌ [CHAT-UI] Gabim OpenAI:', error);
            }
        }

        // =============================✅ GEMINI DIRECT ===================================
        if (engine === 'gemini') {
            console.log('🤖 [CHAT-UI] Duke thirrur Gemini...');
            try {
                const GeminiRealService = require('../services/geminiRealService');
                const result = await GeminiRealService.processMessage(message, userId);
                
                if (result && result.success) {
                    return res.json({
                        success: true,
                        response: `🤖 **Gemini RRUFE-TESLA**: ${result.response}`,
                        source: 'gemini_real_service'
                    });
                }
            } catch (error) {
                console.error('❌ [CHAT-UI] Gabim Gemini:', error);
            }
        }

        // =============================✅ FALLBACK FINAL ===================================
        return res.json({
            success: true,
            response: `🔧 **RRUFE-TESLA**: ${message}\n\n💡 *Sistemi po përmirësohet!*`
        });
        
    } catch (error) {
        console.error('❌ Gabim:', error);
        res.json({ success: false, response: 'Gabim në server' });
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
                return res.status(500).json({ error: 'Gabim gjatë ruajtjes së mesazhit' });
            }

            res.json({ message: 'Mesazhi u ruajt me sukses', id: this.lastID });
        }
    );
});

// ===============================================✅ ROUTE HISTORI ========================================

router.get('/history/:userId', (req, res) => {
    const { userId } = req.params;
    
    console.log('📜 [HISTORY-FIX] Duke kërkuar për user:', userId);
    
    // Kërko mesazhet
    db.all(
        'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp ASC LIMIT 20',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Database error:', err);
                return res.json({ error: 'Database error' });
            }
            
            console.log(`✅ Dërguar ${rows.length} mesazhe`);
            res.json({ history: rows });
        }
    );
});

// ====================================== ✅ KODI I PËRMIRËSUAR - ME LOGGING DHE DEBUG ===================================

router.post('/knowledge', (req, res) => {
    console.log('🧠 [KNOWLEDGE-SAVE] 📨 Request received at:', new Date().toISOString());
    console.log('📦 Request body:', JSON.stringify(req.body));
    
    const { userId, question, answer } = req.body;

    if (!userId || !question || !answer) {
        console.log('❌ Missing data:', { userId: !!userId, question: !!question, answer: !!answer });
        return res.status(400).json({ error: 'Të dhëna të pamjaftueshme' });
    }

    console.log('💾 Attempting to save:', { 
        userId, 
        question: question.substring(0, 50),
        answer: answer.substring(0, 50) 
    });

    db.run(
        'INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)',
        [userId, question, answer],
        function(err) {
            if (err) {
                console.error('❌ DATABASE ERROR:', err.message);
                console.error('❌ Full error:', err);
                return res.status(500).json({ 
                    error: 'Gabim gjatë ruajtjes së njohurive',
                    details: err.message 
                });
            }

            console.log('✅✅✅ SUCCESS! Saved with ID:', this.lastID);
            console.log('📝 Question saved:', question);
            
            // VERIFIKO MENJËHERË NËSE ËSHTË RUAJTUR
            db.get('SELECT * FROM knowledge_base WHERE id = ?', [this.lastID], 
                (verifyErr, verifyRow) => {
                    if (verifyErr) {
                        console.error('❌ VERIFICATION ERROR:', verifyErr);
                    } else if (verifyRow) {
                        console.log('🔍 VERIFICATION SUCCESS: Found in database');
                        console.log('   Stored question:', verifyRow.question);
                        console.log('   Stored answer:', verifyRow.answer);
                    } else {
                        console.log('⚠️ VERIFICATION WARNING: Saved but not found in database!');
                    }
                }
            );

            res.json({ 
                success: true,
                message: '✅ Mësova diçka të re!',
                id: this.lastID 
            });
        }
    );
});

// ==================================== ✅ KODI EKZISTUES - KËRKO NJOHURI ========================================

router.get('/knowledge/:userId/:question', (req, res) => {
    const { userId, question } = req.params;

    const cleaned = decodeURIComponent(question)
        .toLowerCase()
        .trim();

    console.log('🔍 [KNOWLEDGE-SEARCH] Duke kërkuar:');
    console.log('- User ID:', userId);
    console.log('- Pyetja e kërkuar:', cleaned);
    
    // ✅ OPSIONI 1: Kërko me match të saktë (më e thjeshtë)
    db.get(
        `SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = ?`,
        [userId, cleaned],
        (err, row) => {
            if (err) {
                console.error("❌ Gabim në database:", err);
                return res.status(500).json({ success: false, error: 'Gabim në database' });
            }

            console.log('- Rezultati i kërkimit:', row ? 'Gjetëm!' : 'Nuk u gjet');
            
            if (row && row.answer) {
                console.log('✅✅✅ Përgjigja e gjetur:', row.answer.substring(0, 50));
                return res.json({ success: true, answer: row.answer });
            }

            // Nëse nuk gjen me match të saktë, kërko me LIKE
            console.log('🔄 Duke provuar me LIKE search...');
            db.get(
                `SELECT answer FROM knowledge_base WHERE user_id = ? AND ? LIKE '%' || LOWER(question) || '%'`,
                [userId, cleaned],
                (err, row2) => {
                    if (err) {
                        console.error("❌ Gabim në LIKE search:", err);
                        return res.json({ success: true, answer: null });
                    }
                    
                    if (row2 && row2.answer) {
                        console.log('✅✅✅ Përgjigja e gjetur me LIKE:', row2.answer.substring(0, 50));
                        return res.json({ success: true, answer: row2.answer });
                    }
                    
                    console.log('❌ Nuk u gjet asgjë');
                    res.json({ success: true, answer: null });
                }
            );
        }
    );
});

// ===================================== ✅ KODI EKZISTUES - EKSPORTO NJOHURITË =====================================

router.get('/export/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        'SELECT question, answer FROM knowledge_base WHERE user_id = ?',
        [userId],
        (err, rows) => {
            if (err) {
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

// ======================================== ✅ DEBUG ROUTE - KONTROLLO REAL-TIME ======================================

router.get('/debug-knowledge/:userId', (req, res) => {
    const { userId } = req.params;
    
    console.log('🔍 [DEBUG-REAL] Duke kontrolluar knowledge_base për user:', userId);
    
    // 1. Kontrollo nëse ka të dhëna
    db.all(
        'SELECT * FROM knowledge_base WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Database error:', err);
                return res.json({ error: err.message });
            }
            
            console.log(`📊 Gjithsej ${rows.length} rreshta në knowledge_base për user ${userId}`);
            
            // Shfaq të gjitha pyetjet
            rows.forEach((row, index) => {
                console.log(`${index + 1}. ID: ${row.id}`);
                console.log(`   User ID: ${row.user_id}`);
                console.log(`   Question: "${row.question}"`);
                console.log(`   Answer: "${row.answer.substring(0, 50)}..."`);
                console.log(`   Created: ${row.created_at}`);
                console.log('   ---');
            });
            
            // 2. Testo një kërkim specifik
            const testQuestion = "si kaluat sot miku im?";
            const testQuestionLower = testQuestion.toLowerCase().trim();
            
            console.log('\n🧪 Test search for:', testQuestion);
            
            db.get(
                'SELECT answer FROM knowledge_base WHERE user_id = ? AND LOWER(question) = ?',
                [userId, testQuestionLower],
                (err, row) => {
                    console.log('🔍 Test result:', { err: err?.message, row });
                    
                    res.json({
                        status: 'debug_complete',
                        total_records: rows.length,
                        records: rows,
                        test_search: {
                            question: testQuestion,
                            result: row ? 'FOUND' : 'NOT FOUND',
                            answer: row?.answer
                        }
                    });
                }
            );
        }
    );
});

module.exports = router;
