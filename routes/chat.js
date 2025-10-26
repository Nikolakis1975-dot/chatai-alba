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

// ✅ RUTA E THJESHTUAR PËR MESAZHE - PUNON ME COMMAND SERVICE
router.post('/message', async (req, res) => {
    try {
        const { message, userId = 1 } = req.body;
        
        console.log('🔍 routes/chat/message: Marrë mesazh:', message?.substring(0, 50));

        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                response: '❌ Ju lutem shkruani një mesazh'
            });
        }

        // ✅ PERDOR DIRECT COMMAND SERVICE
        console.log('🎯 routes/chat/message: Duke thirrur CommandService direkt...');
        
        // Merr përdoruesin
        const user = await new Promise((resolve) => {
            db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
                if (err) {
                    console.error('❌ Gabim në marrjen e user:', err);
                    resolve({ id: userId, username: 'user' + userId });
                } else {
                    resolve(user || { id: userId, username: 'user' + userId });
                }
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

// ✅ RUTA PËR PANELIN E NDIHMËS ME BUTONA
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

// ✅ RUTA PËR MARRJEN E HISTORISË SË BISEDËS
router.get('/history/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp ASC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Gabim në marrjen e historisë:', err);
                return res.status(500).json({ error: 'Gabim gjatë marrjes së historisë' });
            }
            
            res.json({ 
                success: true, 
                history: rows 
            });
        }
    );
});

// ✅ RUTA PËR RUAJTJEN E MESAZHEVE
router.post('/save', (req, res) => {
    const { userId, content, sender, timestamp } = req.body;

    if (!userId || !content || !sender) {
        return res.status(400).json({ 
            success: false,
            error: 'Të dhëna të pamjaftueshme' 
        });
    }

    db.run(
        'INSERT INTO messages (user_id, content, sender, timestamp) VALUES (?, ?, ?, ?)',
        [userId, content, sender, timestamp || new Date().toISOString()],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtjen e mesazhit:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë ruajtjes së mesazhit' 
                });
            }

            res.json({ 
                success: true,
                message: 'Mesazhi u ruajt me sukses', 
                id: this.lastID 
            });
        }
    );
});

// ✅ RUTA PËR RUAJTJEN E NJOHURIVE
router.post('/knowledge', (req, res) => {
    const { userId, question, answer } = req.body;

    if (!userId || !question || !answer) {
        return res.status(400).json({ 
            success: false,
            error: 'Të dhëna të pamjaftueshme' 
        });
    }

    db.run(
        'INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)',
        [userId, question, answer],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtjen e njohurive:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë ruajtjes së njohurive' 
                });
            }

            res.json({ 
                success: true,
                message: 'Njohuria u ruajt me sukses', 
                id: this.lastID 
            });
        }
    );
});

// ✅ RUTA PËR KËRKIMIN E NJOHURIVE
router.get('/knowledge/:userId/:question', (req, res) => {
    const { userId, question } = req.params;

    db.get(
        'SELECT answer FROM knowledge_base WHERE user_id = ? AND question = ?',
        [userId, question],
        (err, row) => {
            if (err) {
                console.error('❌ Gabim në kërkimin e njohurive:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë kërkimit të njohurive' 
                });
            }

            if (row) {
                res.json({ 
                    success: true,
                    answer: row.answer 
                });
            } else {
                res.json({ 
                    success: true,
                    answer: null 
                });
            }
        }
    );
});

// ✅ RUTA PËR EKSPORTIMIN E NJOHURIVE
router.get('/export/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        'SELECT question, answer FROM knowledge_base WHERE user_id = ?',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Gabim në eksportimin e njohurive:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë eksportimit të njohurive' 
                });
            }

            res.json({
                success: true,
                knowledge: rows
            });
        }
    );
});

// ✅ RUTA PËR IMPORTIMIN E NJOHURIVE
router.post('/import', (req, res) => {
    const { userId, knowledge } = req.body;

    if (!userId || !knowledge || !Array.isArray(knowledge)) {
        return res.status(400).json({ 
            success: false,
            error: 'Të dhëna të pamjaftueshme' 
        });
    }

    // Fshi njohuritë ekzistuese për këtë përdorues
    db.run('DELETE FROM knowledge_base WHERE user_id = ?', [userId], (err) => {
        if (err) {
            console.error('❌ Gabim në importimin e njohurive:', err);
            return res.status(500).json({ 
                success: false,
                error: 'Gabim gjatë importimit të njohurive' 
            });
        }

        // Shto njohuritë e reja
        const stmt = db.prepare('INSERT INTO knowledge_base (user_id, question, answer) VALUES (?, ?, ?)');
        
        let importCount = 0;
        knowledge.forEach(item => {
            if (item.question && item.answer) {
                stmt.run([userId, item.question, item.answer]);
                importCount++;
            }
        });

        stmt.finalize((err) => {
            if (err) {
                console.error('❌ Gabim në importimin e njohurive:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë importimit të njohurive' 
                });
            }

            res.json({ 
                success: true,
                message: `Njohuritë u importuan me sukses. ${importCount} të dhëna të importuara.` 
            });
        });
    });
});

// ✅ RUTA PËR FSHIRJEN E HISTORISË SË PËRDORUESIT
router.delete('/clear/:userId', (req, res) => {
    const { userId } = req.params;

    db.run(
        'DELETE FROM messages WHERE user_id = ?',
        [userId],
        function(err) {
            if (err) {
                console.error('❌ Gabim në fshirjen e historisë:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë fshirjes së historisë' 
                });
            }
            res.json({ 
                success: true,
                message: 'Historia u fshi me sukses' 
            });
        }
    );
});

// ✅ RUTA PËR EKSPORTIMIN E HISTORISË
router.get('/export-history/:userId', (req, res) => {
    const { userId } = req.params;

    db.all(
        'SELECT content, sender, timestamp FROM messages WHERE user_id = ? ORDER BY timestamp ASC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('❌ Gabim në eksportimin e historisë:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë eksportimit të historisë' 
                });
            }
            res.json({ 
                success: true,
                history: rows 
            });
        }
    );
});

// ✅ RUTA PËR RUAJTJEN E FEEDBACK
router.post('/feedback', (req, res) => {
    const { userId, messageId, feedbackType } = req.body;

    db.run(
        'INSERT INTO feedback (user_id, message_id, feedback_type) VALUES (?, ?, ?)',
        [userId, messageId, feedbackType],
        function(err) {
            if (err) {
                console.error('❌ Gabim në ruajtjen e feedback:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Gabim gjatë ruajtjes së feedback' 
                });
            }
            res.json({ 
                success: true,
                message: 'Feedback u ruajt me sukses' 
            });
        }
    );
});

// ✅ RUTA PËR TESTIMIN E SHËNDETIT TË CHAT-IT
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '✅ Chat routes janë operative!',
        timestamp: new Date().toISOString(),
        version: 'RRUFE-TESLA 8.0'
    });
});

// ======================================================
// 🎯 EKSPORTIMI I ROUTER-IT - FUND I SKEDARIT
// ======================================================

module.exports = router;
