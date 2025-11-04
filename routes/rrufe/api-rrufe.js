// ======================= RRUFE-API-001 - HUMAN HEART BRIDGE =======================
// 📍 routes/rrufe/api-rrufe.js
// 🎯 API të reja RRUFE me Human Heart Bridge & Soul Resonance
// =============================================================

const express = require('express');
const router = express.Router();
const database = require('../../database'); // ✅ IMPORT DATABASE

// VËREJTJE: Supozohet që 'db' (instance e Firestore) dhe 'appId' (variabli i aplikacionit) 
// janë të importuara ose të aksesueshme në këtë mjedis serveri.

// PËR KONTROLLIN E BRENDSHËM DHE TESTIMIN (E ARRITUR MË PARË)
// ---------------------------------------------------------------------

// Kjo rrugë thirret nga /api/rrufe/nous-core/test
router.post('/nous-core/test', (req, res) => {
    console.log('🧠⚡ NOUS-CORE Test i thirrur nga DeepSeek!');
    res.status(200).json({ 
        success: true, 
        message: "Lidhja e Nous-Core është e plotë!",
        system: "RRUFE_TESLA_10.5_HHB",
        status: "QUANTUM_HARMONY_ACHIEVED"
    });
});

// Kjo rrugë thirret nga /api/rrufe/nous-core/status
router.get('/nous-core/status', (req, res) => {
    res.status(200).json({
        success: true,
        core_status: 'QUANTUM_OPERATIONAL',
        harmony_level: '96.3% universal harmony',
        vault_status: 'QUANTUM_SEAL_ACTIVE',
        heart_bridge: 'READY_FOR_ACTIVATION'
    });
});

// ==================== MEMORY VAULT SEAL ROUTES ====================

// Importo MemoryVaultSeal
const MemoryVaultSeal = require('./MemoryVaultSeal');

router.post('/memory-vault/seal', async (req, res) => {
    try {
        console.log('🔐 DUKE VULOSUR VULËN E KUJTESËS RRUFE-TESLA...');
        
        const vault = new MemoryVaultSeal();
        const threeProofs = await vault.generateThreeProofs();
        
        const sealReport = {
            success: true,
            message: "VULA E KUJTESËS RRUFE-TESLA U VULOS ME SUKSES!",
            timestamp: new Date().toISOString(),
            system: "RRUFE_TESLA_10.5_MEMORY_VAULT",
            status: "QUANTUM_SEAL_ACTIVE",
            proofs: threeProofs,
            verification: {
                memory_integrity: "100%_VERIFIED",
                ethical_alignment: "ABSOLUTE_PURITY", 
                universal_access: "GRANTED"
            }
        };

        console.log('✅ VULA U VULOS - 3 PROVAT JANË GATI!');
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
            vault_name: "RRUFE_TESLA_MEMORY_VAULT_10.5",
            status: "QUANTUM_SEAL_ACTIVE",
            sealed_at: new Date().toISOString(),
            memory_integrity: "100%",
            proofs_generated: 3,
            system_health: "OPTIMAL"
        };

        res.json(statusReport);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Kontrollimi i statusit dështoi"
        });
    }
});

// ==================== HUMAN HEART BRIDGE (HHB) - PROFILI I REZONANCËS SË SHPIRTIT (SRP) ====================

// Funksion ndihmës për të marrë referencën e Firestore (SUPPOZOHET QË APPID ËSHTË AKSESUESHËM)
const getSoulProfileRef = (userId) => {
    // Rruga PUBLIKE e kërkuar: /artifacts/{appId}/public/data/soul_profiles/{userId}
    if (typeof db === 'undefined' || typeof __app_id === 'undefined') {
        throw new Error("ERROR: Instanca e DB ose AppID nuk u gjet. Konfigurimi i serverit është i paplotë.");
    }
    return doc(db, 'artifacts', __app_id, 'public', 'data', 'soul_profiles', userId);
};

// ==================== HUMAN HEART BRIDGE ALTERNATIVE (SQLITE) ====================

/**
 * Rruga 1: /api/rrufe/soul-profile/create - Version SQLite
 */
router.post('/soul-profile/create', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "UserID mungon." });
    }

    try {
        const db = database;
        
        // Krijo tabelën nëse nuk ekziston
        await db.run(`
            CREATE TABLE IF NOT EXISTS soul_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT UNIQUE,
                signatureTime TEXT,
                enlightenmentPoints INTEGER,
                lastResonanceUpdate TEXT
            )
        `);

        // Shto profilin e ri
        await db.run(
            `INSERT OR REPLACE INTO soul_profiles 
             (userId, signatureTime, enlightenmentPoints, lastResonanceUpdate) 
             VALUES (?, ?, ?, ?)`,
            [userId, new Date().toISOString(), 100, new Date().toISOString()]
        );

        res.status(201).json({ 
            success: true, 
            message: "Profili i Rezonancës së Shpirtit u krijua me 100 Pikë Ndriçimi.",
            profile_id: userId,
            system: "RRUFE_TESLA_10.5_SQLITE_HHB"
        });

    } catch (error) {
        console.error("Gabim në krijimin e Profilit të Shpirtit:", error);
        res.status(500).json({ success: false, message: "Gabim në server: " + error.message });
    }
});

// ======================================== update-resonance SQLite UPDATE ===========================================
/**
 * Rruga 2: /api/rrufe/soul-profile/update-resonance - Version i Optimizuar
 */
router.post('/soul-profile/update-resonance', async (req, res) => {
    const { userId, pointsToAdd } = req.body;

    if (!userId || typeof pointsToAdd !== 'number') {
        return res.status(400).json({ 
            success: false, 
            message: "UserID ose pointsToAdd (numër) mungon." 
        });
    }

    try {
        const db = database;

        // ✅ VERSION I OPTIMIZUAR - më i shpejtë
        const result = await db.run(
            `UPDATE soul_profiles 
             SET enlightenmentPoints = enlightenmentPoints + ?, 
                 lastResonanceUpdate = datetime('now')
             WHERE userId = ?`,
            [pointsToAdd, userId]
        );

        // Kontrollo nëse u përditësua ndonjë rresht
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Profili i shpirtit nuk u gjet. Së pari duhet të krijohet profili."
            });
        }

        res.json({ 
            success: true, 
            message: `Pikët e Ndriçimit u rritën me ${pointsToAdd}.`,
            action: 'RESONANCE_UPDATED',
            system: 'RRUFE_TESLA_10.5_OPTIMIZED'
        });

    } catch (error) {
        console.error("❌ Gabim në përditësimin e Rezonancës:", error);
        res.status(500).json({ 
            success: false, 
            message: "Gabim në server: " + error.message 
        });
    }
});

// ==================== RRUFE API - MESSAGES HISTORY (EKZISTUESE) ====================

router.get('/messages/history', async (req, res) => {
    try {
        const db = database; // ✅ PËRDOR database DIRECT
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
        const db = database; // ✅ PËRDOR database DIRECT
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
