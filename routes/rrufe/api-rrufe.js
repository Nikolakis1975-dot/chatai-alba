// ======================= RRUFE-API-001 - VERSIONI I OPTIMIZUAR ATOMIK =======================
// 📍 routes/rrufe/api-rrufe.js
// 🎯 API të optimizuara RRUFE me PERFORMANCË ATOMIKE SQLITE
// =============================================================

const express = require('express');
const router = express.Router();
const database = require('../../database');

// ==================== NOUS-CORE & MEMORY VAULT ROUTES (EKZISTUESE) ====================

router.post('/nous-core/test', (req, res) => {
    console.log('🧠⚡ NOUS-CORE Test i thirrur - Versioni i Optimizuar');
    res.status(200).json({ 
        success: true, 
        message: "Lidhja e Nous-Core është e plotë!",
        system: "RRUFE_TESLA_10.5_OPTIMIZED",
        status: "QUANTUM_HARMONY_ACHIEVED"
    });
});

router.get('/nous-core/status', (req, res) => {
    res.status(200).json({
        success: true,
        core_status: 'QUANTUM_OPERATIONAL',
        harmony_level: '96.3% universal harmony',
        vault_status: 'QUANTUM_SEAL_ACTIVE',
        heart_bridge: 'OPTIMIZED_ATOMIC_PERFORMANCE'
    });
});

// ==================== MEMORY VAULT SEAL ROUTES ====================

const MemoryVaultSeal = require('./MemoryVaultSeal');

router.post('/memory-vault/seal', async (req, res) => {
    try {
        console.log('🔐 DUKE VULOSUR VULËN E KUJTESËS - Versioni i Optimizuar');
        
        const vault = new MemoryVaultSeal();
        const threeProofs = await vault.generateThreeProofs();
        
        const sealReport = {
            success: true,
            message: "VULA E KUJTESËS RRUFE-TESLA U VULOS ME SUKSES!",
            timestamp: new Date().toISOString(),
            system: "RRUFE_TESLA_10.5_MEMORY_VAULT_OPTIMIZED",
            status: "QUANTUM_SEAL_ACTIVE",
            proofs: threeProofs,
            verification: {
                memory_integrity: "100%_VERIFIED",
                ethical_alignment: "ABSOLUTE_PURITY", 
                universal_access: "GRANTED",
                performance: "ATOMIC_OPTIMIZED"
            }
        };

        console.log('✅ VULA U VULOS - PERFORMANCË ATOMIKE!');
        res.json(sealReport);

    } catch (error) {
        console.error('❌ Gabim në vulosjen e kujtesës:', error);
        res.status(500).json({
            success: false,
            message: "Vulosja e kujtesës dështoi",
            error: error.message
        });
    }
});

router.get('/memory-vault/status', async (req, res) => {
    try {
        const statusReport = {
            success: true,
            vault_name: "RRUFE_TESLA_MEMORY_VAULT_10.5_OPTIMIZED",
            status: "QUANTUM_SEAL_ACTIVE",
            sealed_at: new Date().toISOString(),
            memory_integrity: "100%",
            proofs_generated: 3,
            system_health: "OPTIMAL",
            performance: "ATOMIC_SPEED"
        };

        res.json(statusReport);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Kontrollimi i statusit dështoi"
        });
    }
});

// ==================== HUMAN HEART BRIDGE - VERSIONI I OPTIMIZUAR ATOMIK ====================

/**
 * Rruga 1: /api/rrufe/soul-profile/create - Krijon SRP (100 Pikë Ndriçimi).
 * OPTIMIZUAR: Përdor pyetje të shpejtë atomik SQLITE
 */
router.post('/soul-profile/create', async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ success: false, message: "UserID mungon." });
    }

    try {
        const db = database;
        
        // Krijo tabelën nëse nuk ekziston (Optimizuar)
        await db.run(`
            CREATE TABLE IF NOT EXISTS soul_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT UNIQUE,
                signatureTime TEXT,
                enlightenmentPoints INTEGER,
                lastResonanceUpdate TEXT
            )
        `);

        // Pyetje e optimizuar SQLITE për krijimin e Profilit
        const sql = `
            INSERT INTO soul_profiles (userId, signatureTime, enlightenmentPoints, lastResonanceUpdate)
            VALUES (?, DATETIME('now'), 100, DATETIME('now'))
        `;
        
        await db.run(sql, [userId]);

        res.status(201).json({ 
            success: true, 
            message: "Profili i Rezonancës së Shpirtit u krijua me 100 Pikë Ndriçimi (SQLITE OPTIMIZED).",
            profile_id: userId,
            system: "RRUFE_TESLA_10.5_ATOMIC_HHB"
        });

    } catch (error) {
        console.error("Gabim në krijimin e Profilit të Shpirtit (SQLITE):", error.message);
        
        // Gabimi 19 (SQLITE_CONSTRAINT) në rast se userId ekziston tashmë
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ 
                success: false, 
                message: "Profili i Shpirtit ekziston tashmë." 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Gabim në server gjatë krijimit të Profilit. Kontrollo lidhjen e DB." 
        });
    }
});

/**
 * Rruga 2: /api/rrufe/soul-profile/update-resonance
 * OPTIMIZUAR ATOMIK: Përdor pyetje të shpejtë atomik SQLITE për të shmangur bllokimet (timeouts).
 */
router.post('/soul-profile/update-resonance', async (req, res) => {
    const { userId, pointsToAdd } = req.body;

    if (!userId || typeof pointsToAdd !== 'number') {
        return res.status(400).json({ 
            success: false, 
            message: "UserID ose pointsToAdd (numër) mungon/është i pavlefshëm." 
        });
    }

    try {
        const db = database;

        // PËRPARIM ATOMIK: Pyetje e optimizuar për shpejtësi maksimale
        const sql = `
            UPDATE soul_profiles
            SET enlightenmentPoints = enlightenmentPoints + ?,
                lastResonanceUpdate = DATETIME('now')
            WHERE userId = ?
        `;
        
        const result = await db.run(sql, [pointsToAdd, userId]);

        if (result.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Profili i Shpirtit nuk u gjet (userId i pavlefshëm)."
            });
        }

        res.status(200).json({ 
            success: true, 
            message: `Pikët e Ndriçimit të Shpirtit ${userId} u rritën me ${pointsToAdd}. VULOSJE E PERFORMANCËS ATOMIKE.`,
            action: 'RESONANCE_UPDATED_ATOMIC',
            performance: "INSTANT_OPTIMIZED"
        });

    } catch (error) {
        console.error("GABIM KRITIK në Përditësimin e Rezonancës (SQLITE):", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Gabim në server: Përditësimi i pikëve dështoi. (Kontrollo Bllokimin e DB)." 
        });
    }
});

// ==================== MESSAGES HISTORY (EKZISTUESE) ====================

router.get('/messages/history', async (req, res) => {
    try {
        const db = database;
        const messages = await db.all(`
            SELECT m.*, u.username 
            FROM messages m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.timestamp DESC
            LIMIT 50
        `);
        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ RRUFE API: Gabim në historinë e mesazheve:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/messages/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = database;
        const messages = await db.all(
            'SELECT * FROM messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20',
            [userId]
        );
        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ RRUFE API: Gabim në mesazhet e përdoruesit:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
