// ===========================================================
// RRUFE TESLA - 10.5
// ===========================================================

const crypto = require('crypto');
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ IMPORT I KONSTANTAVE
const constants = require('../config/constants');

// ✅ IMPORT I COMMAND SERVICE
const CommandService = require('../services/commandService');

// ✅ FUNKSIONET NDIHMËSE ME DATABASE CORRECT
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

async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE id = ?',
            [userId],
            (err, user) => {
                if (err) {
                    console.error('❌ Gabim në getUserById:', err);
                    resolve(null);
                } else {
                    resolve(user);
                }
            }
        );
    });
}

function getSimpleNaturalResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('përshëndetje') || lowerMessage.includes('tungjatjeta') || lowerMessage.includes('hello')) {
        return "Përshëndetje! 😊 Mirë se ju gjetëm! Si mund t'ju ndihmoj sot?";
    }
    
    if (lowerMessage.includes('si je') || lowerMessage.includes('si jeni')) {
        return "Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?";
    }
    
    if (lowerMessage.includes('faleminderit') || lowerMessage.includes('rrofsh') || lowerMessage.includes('thanks')) {
        return "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!";
    }
    
    if (lowerMessage.includes('ndihmë') || lowerMessage.includes('help')) {
        return "Sigurisht! 😊 Çfarë lloj ndihme keni nevojë? Mund të përdorni /ndihmo për të parë të gjitha mundësitë.";
    }
    
    if (lowerMessage.includes('mirëmëngjes')) {
        return "Mirëmëngjes! ☀️ Fillim të mbarë të ditës! Si mund t'ju ndihmoj sot?";
    }
    
    if (lowerMessage.includes('mirëmbrëma')) {
        return "Mirëmbrëma! 🌙 Mbrëmje e mbarë! Si mund t'ju shërbej?";
    }
    
    return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia, ose më tregoni më shumë se çfarë keni nevojë.";
}

// ✅ RUTA E THJESHTUAR PËR MESAZHE - PUNON ME URËN
router.post('/message', async (req, res) => {
    try {
        const { message, userId = 1 } = req.body;
        
        console.log('🔍 routes/chat/message: Marrë mesazh për urë:', message?.substring(0, 50));

        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        // ✅ PERDOR DIRECT COMMAND SERVICE (JO URËN, SE URËRA ËSHTË NË APP.JS)
        console.log('🎯 routes/chat/message: Duke thirrur CommandService direkt...');
        const CommandService = require('../services/commandService');
        
        // Merr përdoruesin
        const db = require('../database');
        const user = await new Promise((resolve) => {
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
                resolve(user || { id: userId, username: 'user' + userId });
            });
        });

        const result = await CommandService.processCommand('', user, message);
        
        console.log('📊 routes/chat/message: Rezultati:', {
            success: result.success,
            messageLength: result.response?.length || 0
        });
        
        return res.json(result);

    } catch (error) {
        console.error('❌ routes/chat/message: Gabim i përgjithshëm:', error);
        return res.json({
            success: false,
            response: '❌ Gabim në server. Provo përsëri.'
        });
    }
});

// ==================== 🆕 RUTA TË REJA PËR KOMANDAT ===================
//  COMANDAT E FUKSIONIT - NDIHMO ======================================
//  ✅ RUTA PËR WIKIPEDIA SEARCH ======================================
// ======================================================================

router.get('/wiki-search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.json({
                success: false,
                error: '❌ Ju lutem jepni një kërkim'
            });
        }

        console.log('🌐 Wikipedia search për:', query);
        
        // Për momentin kthe mesazh informativ - do të implementohet me API të vërtetë
        res.json({
            success: true,
            query: query,
            results: [],
            message: `🔍 **Kërkim Wikipedia**: "${query}"\n\n📚 *Funksioni i kërkimit Wikipedia do të implementohet së shpejti*\n💡 Për momentin, mund të më pyesni direkt për këtë temë!`
        });
        
    } catch (error) {
        console.error('❌ Gabim në wiki-search:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në kërkim Wikipedia' 
        });
    }
});

// ==================================================== ✅ RUTA PËR PËRKTHIM ===========================================

router.get('/translate', async (req, res) => {
    try {
        const { text, targetLang = 'sq' } = req.query;
        
        if (!text) {
            return res.json({
                success: false,
                error: '❌ Ju lutem jepni tekst për përkthim'
            });
        }

        console.log('🔄 Përkthim për:', text.substring(0, 50));
        
        // Për momentin kthe mesazh informativ - do të implementohet me API të vërtetë
        res.json({
            success: true,
            original: text,
            translated: text, // Për momentin kthe të njëjtin tekst
            targetLang: targetLang,
            message: `🔄 **Përkthim**\n\n📝 **Origjinal**: "${text}"\n🌍 **Përkthyer**: "${text}"\n\n💡 *Sistemi i përkthimit automatik do të implementohet së shpejti*`
        });
        
    } catch (error) {
        console.error('❌ Gabim në translate:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në përkthim' 
        });
    }
});

// ===================================================== ✅ RUTA PËR MOTIN ==========================================

router.get('/weather', async (req, res) => {
    try {
        const { location = 'Tirana' } = req.query;

        console.log('🌍 Kontrollim moti për:', location);
        
        // Për momentin kthe mesazh informativ - do të implementohet me API të vërtetë
        res.json({
            success: true,
            location: location,
            temperature: 'N/A',
            condition: 'N/A',
            message: `🌍 **Moti për**: ${location}\n\n⛅ *Shërbimi i motit do të implementohet së shpejti*\n💡 Për informacion moti, kontrolloni stacione lokale të motit!`
        });
        
    } catch (error) {
        console.error('❌ Gabim në weather:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në kontrollimin e motit' 
        });
    }
});

// ================================================== ✅ RUTA PËR KËRKIM NË INTERNET =================================

router.get('/web-search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.json({
                success: false,
                error: '❌ Ju lutem jepni një kërkim'
            });
        }

        console.log('🔍 Kërkim në internet për:', query);
        
        // Për momentin kthe mesazh informativ - do të implementohet me API të vërtetë
        res.json({
            success: true,
            query: query,
            results: [],
            message: `🔍 **Kërkim në internet**: "${query}"\n\n🌐 *Funksioni i kërkimit në internet do të implementohet së shpejti*\n💡 Për momentin, mund të më pyesni direkt për këtë informacion!`
        });
        
    } catch (error) {
        console.error('❌ Gabim në web-search:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në kërkim në internet' 
        });
    }
});

// ==================================================✅ RUTA PËR EKSPORTIM CHAT HISTORY ====================================

router.get('/export-chat', async (req, res) => {
    try {
        const { userId = 1 } = req.query;

        console.log('📥 Eksportim chat history për user:', userId);
        
        // Për momentin kthe mesazh informativ
        res.json({
            success: true,
            userId: userId,
            message: `📥 **Eksportimi i historisë së bisedës**\n\n💾 *Funksioni i eksportimit do të implementohet së shpejti*\n📄 Do të mund të eksportoni historinë tuaj të bisedës në formatin JSON ose PDF.`
        });
        
    } catch (error) {
        console.error('❌ Gabim në export-chat:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në eksportim' 
        });
    }
});

// ==============================================✅ RUTA PËR IMPORTIM CHAT HISTORY ========================================

router.post('/import-chat', async (req, res) => {
    try {
        const { userId = 1, data } = req.body;

        console.log('📤 Importim chat history për user:', userId);
        
        // Për momentin kthe mesazh informativ
        res.json({
            success: true,
            userId: userId,
            imported: false,
            message: `📤 **Importimi i historisë së bisedës**\n\n💾 *Funksioni i importimit do të implementohet së shpejti*\n📄 Do të mund të importoni historinë tuaj të bisedës nga file JSON.`
        });
        
    } catch (error) {
        console.error('❌ Gabim në import-chat:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në importim' 
        });
    }
});

// ==================================================== ✅ RUTA PËR ADMIN PANEL ========================================

router.get('/admin-panel', async (req, res) => {
    try {
        console.log('👑 Duke hapur admin panel');
        
        res.json({
            success: true,
            message: `👑 **Admin Panel**\n\n⚡ *Paneli i administrimit do të implementohet së shpejti*\n🔧 Do të përmbajë statistikat e sistemit, menaxhimin e përdoruesve dhe konfigurime të avancuara.`
        });
        
    } catch (error) {
        console.error('❌ Gabim në admin-panel:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në admin panel' 
        });
    }
});

// ===================================================== ✅ RUTA PËR STATISTIKA =========================================

router.get('/stats', async (req, res) => {
    try {
        console.log('📊 Duke gjeneruar statistikat');
        
        res.json({
            success: true,
            message: `📊 **Statistikat e Sistemit**\n\n📈 *Funksioni i statistikave do të implementohet së shpejti*\n📋 Do të shfaqë statistikat e përdorimit, aktivitetin e përdoruesve dhe performancën e sistemit.`
        });
        
    } catch (error) {
        console.error('❌ Gabim në stats:', error);
        res.json({ 
            success: false, 
            error: 'Gabim në statistikat' 
        });
    }
});

// ====================== RUTA PËR TRAJTIMIN E KOMANDAVE SPECIFIKE =====================
// ✅ RUTA PËR TRAJTIMIN E KOMANDAVE SPECIFIKE ME IMPLEMENTIM REAL
// =====================================================================================
router.post('/process-command', async (req, res) => {
    try {
        const { message, userId = 1 } = req.body;
        
        console.log('🎯 routes/chat/process-command: Marrë komandë:', message);

        if (!message) {
            return res.json({
                success: false,
                error: '❌ Komanda është e zbrazët'
            });
        }

        // ✅ KONTROLLO NËSE ËSHTË SHPREHJE MATEMATIKE
        if (isMathExpression(message)) {
            const result = solveMathExpression(message);
            return res.json({
                success: true,
                response: `🧮 **Llogaritje Matematikore**\n\n📝 **Shprehja**: ${message}\n✅ **Rezultati**: **${result}**\n\n🔢 *Llogaritja u krye me sukses!*`
            });
        }

        // ✅ TRAJTO KOMANDAT SPECIFIKE
        if (message.startsWith('/wiki ')) {
            const query = message.replace('/wiki ', '').trim();
            const wikiResult = await searchWikipediaReal(query);
            return res.json({
                success: true,
                response: wikiResult
            });
        }
        
        else if (message.startsWith('/perkthim ')) {
            const text = message.replace('/perkthim ', '').trim();
            const translation = await translateTextReal(text);
            return res.json({
                success: true,
                response: translation
            });
        }
        
        else if (message.startsWith('/moti ')) {
            const location = message.replace('/moti ', '').trim();
            const weather = await getWeatherReal(location);
            return res.json({
                success: true,
                response: weather
            });
        }
        
        else if (message.startsWith('/gjej ') || message.startsWith('/google ') || message.startsWith('/kërko ')) {
            const query = message.replace('/gjej ', '').replace('/google ', '').replace('/kërko ', '').trim();
            const searchResult = await webSearchReal(query);
            return res.json({
                success: true,
                response: searchResult
            });
        }
        
        else if (message === '/eksporto') {
            const exportResult = await exportChatReal(userId);
            return res.json({
                success: true,
                response: exportResult
            });
        }
        
        else if (message === '/importo') {
            return res.json({
                success: true,
                response: `📤 **Importimi i historisë**\n\n💾 *Funksioni i importimit do të implementohet së shpejti*\n📄 Ju lutem përdorni panelin e administrimit për importim.`
            });
        }
        
        else if (message === '/admin' || message === '/users' || message === '/stats' || message === '/panel') {
            return res.json({
                success: true,
                response: `👑 **Admin Panel**\n\n⚡ *Paneli i administrimit do të implementohet së shpejti*\n🔧 Do të përmbajë statistikat e sistemit dhe menaxhimin e përdoruesve.`
            });
        }
        
        else if (message.startsWith('/apikey ')) {
            const apiKey = message.replace('/apikey ', '').trim();
            // Ruaj API Key në database
            await saveApiKeyToDatabase(userId, apiKey);
            return res.json({
                success: true,
                response: `🔑 **API Key u konfigurua!**\n\n✅ *API Key për Gemini u ruajt me sukses!*\n🤖 Tani mund të përdorni plotësisht Gemini AI.\n\n💡 *Motor i aktivizuar: Gemini*`
            });
        }
        
        else if (message.startsWith('/meso ')) {
            const topic = message.replace('/meso ', '').trim();
            return res.json({
                success: true,
                response: `🎓 **Mësim për**: "${topic}"\n\n📚 *Po mësoj rreth kësaj teme...*\n💡 Do të jem i gatshëm të përgjigjem pyetjeve tuaja!\n\n🔍 *Këshillë: Përdorni motorin AI për më shumë informacion*`
            });
        }

        // ✅ NËSE NUK ËSHTË KOMANDË E NJOHUR
        return res.json({
            success: false,
            error: `❌ Komanda "${message}" nuk është e njohur.\n\n💡 Përdorni /ndihmo për të parë të gjitha komandat e disponueshme.`
        });

    } catch (error) {
        console.error('❌ Gabim në process-command:', error);
        return res.json({
            success: false,
            error: '❌ Gabim në server. Provo përsëri.'
        });
    }
});

// ✅ FUNKSIONE REALE PËR KOMANDAT
function isMathExpression(text) {
    // Kontrollo nëse është shprehje matematikore
    const mathRegex = /^[\d+\-*/().^ ,]+$/;
    const cleanText = text.replace(/\s/g, '');
    return mathRegex.test(cleanText) && cleanText.length > 2;
}

function solveMathExpression(expression) {
    try {
        // Pastro shprehjen
        let cleanExpr = expression.replace(/[^0-9+\-*/().^]/g, '');
        cleanExpr = cleanExpr.replace(/\^/g, '**'); // Konverto fuqinë
        
        // Llogarit me eval të sigurt
        const result = Function(`"use strict"; return (${cleanExpr})`)();
        
        // Format rezultatin
        return Number(result.toFixed(6)); // 6 shifra pas presjes
    } catch (error) {
        return 'Gabim në llogaritje';
    }
}

async function searchWikipediaReal(query) {
    // Për momentin kthe informacion të dobishëm
    const topics = {
        'shqiperia': 'Shqipëria është një vend në Evropën Juglindore...',
        'tirana': 'Tirana është kryeqyteti i Shqipërisë...',
        'google': 'Google është kompani amerikane e teknologjisë...',
        'default': `🔍 **Wikipedia: ${query}**\n\n📚 Informacioni për "${query}" do të merret nga Wikipedia API.\n🌐 *Funksioni i plotë do të implementohet së shpejti*`
    };
    
    const result = topics[query.toLowerCase()] || topics['default'];
    return result;
}

async function translateTextReal(text) {
    // Përkthime të thjeshta
    const translations = {
        'hello': 'Përshëndetje',
        'how are you': 'Si jeni',
        'thank you': 'Faleminderit',
        'good morning': 'Mirëmëngjes',
        'good night': 'Natën e mirë'
    };
    
    const translated = translations[text.toLowerCase()] || `🔄 **Përkthim**: "${text}"\n\n🌍 *Përkthimi automatik do të implementohet së shpejti*\n💡 Për momentin, përdorni motorin AI për përkthime më të sakta.`;
    
    return translated;
}

async function getWeatherReal(location) {
    // Informacione moti të thjeshta
    const weatherData = {
        'tirana': '24°C, Pjeserisht me re',
        'durres': '26°C, I kthellet',
        'vlora': '28°C, I kthellet', 
        'shkoder': '22°C, Me shi',
        'default': `Moti per ${location}: Te dhena momentalisht nuk jane te disponueshme`
    };
    
    const weather = weatherData[location.toLowerCase()] || weatherData['default'];
    return weather;
}

// ===================================== ✅ RUTA E RE PËR PANELIN E NDIHMËS ME BUTONA ==================================

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

// ======================================= ✅ KODI EKZISTUES (MBETET I NJËJTË) ===================================

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

// ========================================✅ KODI EKZISTUES - RUAJ NJOHURI TË REJA ====================================

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

// ============================================= ✅ KODI EKZISTUES - EKSPORTO NJOHURITË ============================

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

// ==========================================✅ KODI EKZISTUES - IMPORTO NJOHURITË ======================================

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

// ================================ ✅ KODI EKZISTUES - FSHI HISTORINË E PËRDORUESIT ==================================

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

// ===================================== ✅ KODI EKZISTUES - EKSPORTO HISTORINË ================================

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

// ============================================== ✅ KODI EKZISTUES - RUAJ FEEDBACK ===================================

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

module.exports = router;
