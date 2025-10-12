const crypto = require('crypto');
const express = require('express');
const db = require('../database');
const router = express.Router();

// ✅ SHTIMI I RI - IMPORT I COMMAND SERVICE
const CommandService = require('../services/commandService');


// =============================== ✅ RREGULLIMI I RUTËS /message PËR TRAJTIMIN E NLU =======================================
router.post('/message', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        console.log('🔍 DEBUG /message: Marrë mesazh:', message, 'për user:', userId);

        if (!message || !userId) {
            return res.json({
                success: false,
                response: '❌ Të dhëna të pamjaftueshme'
            });
        }

        // Merr të dhënat e përdoruesit
        const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [userId]);
        
        if (!user) {
            return res.json({
                success: false,
                response: '❌ Përdoruesi nuk u gjet'
            });
        }

        console.log('🎯 DEBUG: Duke thirrur CommandService për mesazh:', message);
        
        // Dërgo mesazhin te CommandService (që përfshin NLU)
        const commandResult = await CommandService.processCommand('chat', user, message);
        
        console.log('📊 DEBUG: Rezultati nga CommandService:', {
            success: commandResult.success,
            intent: 'NLU processed'
        });

        // Nëse CommandService e trajton mesazhin (përfshirë mesazhet natyrore me NLU)
        if (commandResult.success) {
            return res.json(commandResult);
        }

        // ✅ NËSE ARRIN KËTU, ATHERË COMMAND SERVICE NUK E KA TRAJTUAR MESAZHIN NATYROR!
        console.log('🔄 DEBUG: CommandService nuk e trajtoi, kontrolloj nëse duhet të shkoj te Gemini...');
        
        // Vetëm nëse CommandService nuk e trajton, shko te Gemini
        try {
            const geminiResponse = await require('./gemini').processMessage(message, userId);
            return res.json({
                success: true,
                response: geminiResponse
            });
        } catch (geminiError) {
            console.error('❌ Gabim në Gemini:', geminiError);
            return res.json({
                success: false,
                response: '❌ Nuk është konfiguruar API Key për Gemini. Përdor /apikey'
            });
        }

    } catch (error) {
        console.error('❌ Gabim në procesimin e mesazhit:', error);
        return res.json({
            success: false,
            response: '❌ Gabim në server. Provo përsëri.'
        });
    }
});

// ✅ KODI EKZISTUES - MERR HISTORINË E BISEDËS
// ✅ RUTA E RE PËR PANELIN E NDIHMËS ME BUTONA - Shto në routes/chat.js ekzistues
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

// ✅ KODI EKZISTUES - EKSPORTO NJOHURITË
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

module.exports = router;
