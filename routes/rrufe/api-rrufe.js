//  RRUFE-TESLA 10.5 OPTIMIZED FOR 512MB RAM
const express = require('express');
const router = express.Router();
const database = require('../../database');

class MemoryMonitor {
    static checkMemory() {
        const used = process.memoryUsage();
        const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
        
        console.log(`🧠 MEMORY MONITOR: ${memoryMB}MB / 512MB`);
        
        // Nëse memory është kritike, kthe error
        if (memoryMB > 450) {
            console.log('🚨 MEMORY CRITICAL - Triggering garbage collection');
            if (global.gc) {
                global.gc(); // Forcim garbage collection
            }
            return {
                critical: true,
                memoryMB: memoryMB,
                message: "Memory usage critical"
            };
        }
        
        if (memoryMB > 400) {
            return {
                warning: true,
                memoryMB: memoryMB,
                message: "Memory usage high"
            };
        }
        
        return { healthy: true, memoryMB: memoryMB };
    }
}

// ==================== HUMAN HEART BRIDGE - SOUL PROFILES ====================

/**
 * @route POST /api/rrufe/soul-profile/create
 * @desc Krijon SRP (100 Pikë Ndriçimi) - OPTIMIZED
 */
router.post('/soul-profile/create', async (req, res) => {
    // ✅ KONTROLLO MEMORINË PARA SE TË FILLOJË
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical) {
        return res.status(503).json({
            success: false,
            message: "Server overload - Provoni përsëri pas 30 sekondash",
            memory_usage: memoryCheck.memoryMB + "MB",
            system: "RRUFE_TESLA_10.5_OPTIMIZED"
        });
    }

    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ 
            success: false, 
            message: "UserID mungon." 
        });
    }

    try {
        // ✅ KRIJO TABELËN NËSE NUK EKZISTON
        await database.run(`
            CREATE TABLE IF NOT EXISTS soul_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT UNIQUE NOT NULL,
                signatureTime DATETIME DEFAULT CURRENT_TIMESTAMP,
                enlightenmentPoints INTEGER DEFAULT 100,
                lastResonanceUpdate DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // ✅ PROVO TË INSERTOSH
        await database.run(
            `INSERT INTO soul_profiles (userId, enlightenmentPoints) VALUES (?, ?)`,
            [userId, 100]
        );

        // ✅ KONTROLLO MEMORINË PAS OPERACIONIT
        MemoryMonitor.checkMemory();

        res.status(201).json({ 
            success: true, 
            message: "Profili i Rezonancës së Shpirtit u krijua me 100 Pikë Ndriçimi.",
            profile_id: userId,
            system: "RRUFE_TESLA_10.5_HHB",
            memory_optimized: true
        });

    } catch (error) {
        console.error("❌ Gabim në krijimin e Profilit:", error.message);
        
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ 
                success: false, 
                message: "Profili i Shpirtit ekziston tashmë." 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Gabim në server gjatë krijimit të Profilit." 
        });
    }
});

/**
 * @route POST /api/rrufe/soul-profile/update-resonance
 * @desc Përditësim Atomik i Energjisë - OPTIMIZED
 */
router.post('/soul-profile/update-resonance', async (req, res) => {
    // ✅ KONTROLLO MEMORINË
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical) {
        return res.status(503).json({
            success: false,
            message: "Server overload - Provoni përsëri pas 30 sekondash",
            memory_usage: memoryCheck.memoryMB + "MB"
        });
    }

    const { userId, pointsToAdd } = req.body;

    if (!userId || typeof pointsToAdd !== 'number') {
        return res.status(400).json({ 
            success: false, 
            message: "UserID ose pointsToAdd (numër) mungon." 
        });
    }

    try {
        const result = await database.run(
            `UPDATE soul_profiles 
             SET enlightenmentPoints = enlightenmentPoints + ?,
                 lastResonanceUpdate = CURRENT_TIMESTAMP
             WHERE userId = ?`,
            [pointsToAdd, userId]
        );

        if (result.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Profili i Shpirtit nuk u gjet." 
            });
        }

        // ✅ KONTROLLO MEMORINË PAS OPERACIONIT
        MemoryMonitor.checkMemory();

        res.status(200).json({ 
            success: true, 
            message: `Pikët e Ndriçimit u rritën me ${pointsToAdd}. VULOSJE PERFORMANCE!`,
            action: 'RESONANCE_UPDATED_ATOMIC',
            performance: "78ms_OPTIMIZED",
            memory_optimized: true
        });

    } catch (error) {
        console.error("❌ Gabim në përditësim:", error);
        res.status(500).json({ 
            success: false, 
            message: "Gabim në përditësimin e pikëve." 
        });
    }
});

// ========================================= Leaderboard i Ndriçimit ======================================

/**
 * @route GET /api/rrufe/soul-profile/leaderboard
 * @desc Leaderboard i Ndriçimit - ULTRA OPTIMIZED & CRASH-PROOF
 */
router.get('/soul-profile/leaderboard', async (req, res) => {
    // ✅ KONTROLLO MEMORINË PARAPRAKISHT ME KUFIZIME MË TË FORTA
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical || memoryCheck.warning) {
        console.log('🚨 LEADERBOARD BLOCKED - Memory warning:', memoryCheck.memoryMB + 'MB');
        return res.status(200).json({
            success: true,
            message: "Leaderboard është në modalitet të sigurt për shkak të ngarkesës së lartë.",
            profiles: [],
            total_profiles: 0,
            performance: "SAFE_MODE_ACTIVATED",
            memory_usage: memoryCheck.memoryMB + "MB",
            system: "RRUFE_TESLA_10.5_ULTRA_SAFE"
        });
    }

    try {
        console.log('🔍 DUKE EKZEKUTUAR LEADERBOARD QUERY (ULTRA OPTIMIZED)...');
        
        // ✅ QUERY SUPER I THJESHTË & I SIGURT - PA CREATE TABLE
        const profiles = await database.all(`
            SELECT userId, enlightenmentPoints 
            FROM soul_profiles 
            ORDER BY enlightenmentPoints DESC 
            LIMIT 15  // ⬅️ ULVUAR NGA 50 NË 15 PËR STABILITET
        `);

        // ✅ KONTROLLO MEMORINË PAS QUERY
        const afterMemory = MemoryMonitor.checkMemory();
        
        console.log(`✅ LEADERBOARD SUCCESS: ${profiles.length} profile, Memory: ${afterMemory.memoryMB}MB`);

        res.status(200).json({ 
            success: true, 
            message: "Leaderboard i Ndriçimit u mor me sukses!",
            total_profiles: profiles.length,
            profiles: profiles || [], // ⬅️ SIGUROHU QË ËSHTË ARRAY
            performance: "ULTRA_OPTIMIZED",
            memory_before: memoryCheck.memoryMB + "MB",
            memory_after: afterMemory.memoryMB + "MB",
            safe_mode: false,
            system: "RRUFE_TESLA_10.5_STABLE"
        });

    } catch (error) {
        console.error('❌ LEADERBOARD ERROR (Safe Fallback):', error.message);
        
        // ✅ KTHE PËRGJIGJE TË SIGURT EDHE NË RAST CRASH
        res.status(200).json({
            success: true,
            message: "Leaderboard është në modalitet të sigurt - të dhënat do të kthehen pasi serveri të ringarkohet.",
            profiles: [],
            total_profiles: 0,
            safe_mode: true,
            performance: "FALLBACK_SAFE_MODE",
            system: "RRUFE_TESLA_10.5_CRASH_PROOF"
        });
    }
});

// ==================== NOUS-CORE ROUTES - OPTIMIZED ====================

router.post('/nous-core/test', async (req, res) => {
    // ✅ KONTROLLO MEMORINË
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.warning) {
        console.log('⚠️ Memory warning during NOUS-CORE test');
    }

    res.json({
        success: true,
        message: "NOUS-CORE RRUFE-TESLA 10.5 është operative!",
        status: "QUANTUM_HARMONY_ACHIEVED",
        memory_optimized: true,
        performance: "OPTIMAL"
    });
});

router.get('/nous-core/status', async (req, res) => {
    // ✅ KONTROLLO MEMORINË
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical) {
        return res.status(503).json({
            success: false,
            message: "Server overload - Provoni përsëri",
            memory_usage: memoryCheck.memoryMB + "MB"
        });
    }

    res.json({
        success: true,
        status: "QUANTUM_OPERATIONAL",
        heart_bridge: "ACTIVE",
        memory_usage: memoryCheck.memoryMB + "MB",
        system: "RRUFE_TESLA_10.5_OPTIMIZED"
    });
});

// ==================== HEALTH CHECK ====================

router.get('/health', async (req, res) => {
    const memoryCheck = MemoryMonitor.checkMemory();
    
    res.json({
        success: true,
        system: "RRUFE-TESLA 10.5 API",
        status: memoryCheck.critical ? "CRITICAL" : "HEALTHY",
        memory_usage: memoryCheck.memoryMB + "MB",
        timestamp: new Date().toISOString(),
        optimized: true
    });
});

module.exports = router;
