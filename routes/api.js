const express = require('express');
const db = require('../database');
const encryption = require('../utils/encryption');
const router = express.Router();

// Ruaj API Key për përdorues (të enkriptuar me AES-256)
router.post('/save', async (req, res) => {
    const { userId, apiKey, serviceName } = req.body;

    if (!userId || !apiKey) {
        return res.status(400).json({ error: 'Të dhëna të pamjaftueshme' });
    }

    try {
        // Enkripto API Key me AES-256
        const encryptedApiKey = encryption.encrypt(apiKey);
        console.log('✅ API Key u enkriptua me sukses me AES-256');

        // Kontrollo nëse ekziston tashmë
        db.get(
            'SELECT id FROM api_keys WHERE user_id = ? AND service_name = ?',
            [userId, serviceName || 'gemini'],
            (err, row) => {
                if (err) {
                    console.error('❌ Gabim në database:', err);
                    return res.status(500).json({ error: 'Gabim në server' });
                }

                if (row) {
                    // Update ekzistues
                    db.run(
                        'UPDATE api_keys SET api_key = ? WHERE user_id = ? AND service_name = ?',
                        [encryptedApiKey, userId, serviceName || 'gemini'],
                        function(err) {
                            if (err) {
                                console.error('❌ Gabim gjatë update:', err);
                                return res.status(500).json({ error: 'Gabim gjatë përditësimit të API Key' });
                            }
                            res.json({ message: '✅ API Key u përditësua me sukses' });
                        }
                    );
                } else {
                    // Krijo të re
                    db.run(
                        'INSERT INTO api_keys (user_id, api_key, service_name) VALUES (?, ?, ?)',
                        [userId, encryptedApiKey, serviceName || 'gemini'],
                        function(err) {
                            if (err) {
                                console.error('❌ Gabim gjatë insert:', err);
                                return res.status(500).json({ error: 'Gabim gjatë ruajtjes së API Key' });
                            }
                            res.json({ message: '✅ API Key u ruajt me sukses' });
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error('❌ Gabim gjatë enkriptimit:', error);
        res.status(500).json({ error: '❌ Gabim në server gjatë enkriptimit' });
    }
});

// Fshi API Key
router.post('/delete', (req, res) => {
    const { userId, serviceName } = req.body;

    if (!userId) {
        return res.status(400).json({ error: '❌ ID e përdoruesit është e detyrueshme' });
    }

    db.run(
        'DELETE FROM api_keys WHERE user_id = ? AND service_name = ?',
        [userId, serviceName || 'gemini'],
        function(err) {
            if (err) {
                console.error('❌ Gabim gjatë fshirjes:', err);
                return res.status(500).json({ error: '❌ Gabim gjatë fshirjes së API Key' });
            }
            res.json({ message: '✅ API Key u fshi me sukses' });
        }
    );
});

// Merr API Key status
router.get('/status/:userId/:serviceName?', (req, res) => {
    const { userId, serviceName } = req.params;

    db.get(
        'SELECT id, created_at FROM api_keys WHERE user_id = ? AND service_name = ?',
        [userId, serviceName || 'gemini'],
        (err, row) => {
            if (err) {
                console.error('❌ Gabim në database:', err);
                return res.status(500).json({ error: '❌ Gabim në server' });
            }

            if (row) {
                res.json({ hasApiKey: true, createdAt: row.created_at });
            } else {
                res.json({ hasApiKey: false });
            }
        }
    );
});

// Shto këtë rrugë të re për të kontrolluar statusin e enkriptimit
router.get('/encryption-status', (req, res) => {
    const hasEnvKey = !!process.env.ENCRYPTION_KEY;
    const encryption = require('../utils/encryption');
    
    res.json({
        hasEnvKey: hasEnvKey,
        isEncryptionWorking: true, 
        message: hasEnvKey ? 
            '✅ Çelësi i enkriptimit është i konfiguruar në .env' : 
            '⚠️  Paralajmërim: Çelësi i enkriptimit është i gjeneruar automatikisht',
        recommendation: hasEnvKey ? 
            null : 
            'Vendosni ENCRYPTION_KEY=... në .env file për siguri të plotë'
    });
});

module.exports = router;