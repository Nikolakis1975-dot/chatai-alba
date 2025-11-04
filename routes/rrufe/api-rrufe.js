// =========================== RRUFE-TESLA 10.5 ULTRA STABLE ===============================
const express = require('express');
const router = express.Router();
const database = require('../../database'); // ✅ IMPORT I SAKTË

class MemoryMonitor {
    static checkMemory() {
        const used = process.memoryUsage();
        const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
        
        console.log(`🧠 MEMORY MONITOR: ${memoryMB}MB / 512MB`);
        
        if (memoryMB > 450) {
            console.log('🚨 MEMORY CRITICAL');
            if (global.gc) global.gc();
            return { critical: true, memoryMB };
        }
        
        if (memoryMB > 400) {
            return { warning: true, memoryMB };
        }
        
        return { healthy: true, memoryMB };
    }
}

// ==================== HUMAN HEART BRIDGE - SOUL PROFILES ====================

/**
 * @route POST /api/rrufe/soul-profile/create
 * @desc Krijon SRP - ULTRA STABLE
 */
router.post('/soul-profile/create', async (req, res) => {
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical) {
        return res.json({
            success: false,
            message: "Server overload - Provoni përsëri",
            memory_usage: memoryCheck.memoryMB + "MB"
        });
    }

    const { userId } = req.body;
    
    if (!userId) {
        return res.json({ 
            success: false, 
            message: "UserID mungon." 
        });
    }

    try {
        // ✅ QUERY I THJESHTË & I SIGURT
        await database.run(
            `INSERT INTO soul_profiles (userId, enlightenmentPoints) VALUES (?, ?)`,
            [userId, 100]
        );

        res.json({ 
            success: true, 
            message: "Profili i Shpirtit u krijua me 100 Pikë!",
            profile_id: userId
        });

    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.json({ 
                success: false, 
                message: "Profili ekziston tashmë." 
            });
        }
        
        res.json({ 
            success: false, 
            message: "Gabim në server." 
        });
    }
});

/**
 * @route POST /api/rrufe/soul-profile/update-resonance  
 * @desc Përditësim - ULTRA STABLE
 */
router.post('/soul-profile/update-resonance', async (req, res) => {
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical) {
        return res.json({
            success: false,
            message: "Server overload",
            memory_usage: memoryCheck.memoryMB + "MB"
        });
    }

    const { userId, pointsToAdd } = req.body;

    if (!userId || typeof pointsToAdd !== 'number') {
        return res.json({ 
            success: false, 
            message: "UserID ose pointsToAdd mungon." 
        });
    }

    try {
        const result = await database.run(
            `UPDATE soul_profiles SET enlightenmentPoints = enlightenmentPoints + ? WHERE userId = ?`,
            [pointsToAdd, userId]
        );

        if (result.changes === 0) {
            return res.json({ 
                success: false, 
                message: "Profili nuk u gjet." 
            });
        }

        res.json({ 
            success: true, 
            message: `Pikët u rritën me ${pointsToAdd}!`,
            performance: "STABLE"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Gabim në përditësim."
        });
    }
});

/**
 * @route GET /api/rrufe/soul-profile/leaderboard
 * @desc Leaderboard - ULTRA STABLE
 */
router.get('/soul-profile/leaderboard', async (req, res) => {
    const memoryCheck = MemoryMonitor.checkMemory();
    if (memoryCheck.critical) {
        return res.json({
            success: false,
            message: "Server overload",
            memory_usage: memoryCheck.memoryMB + "MB"
        });
    }

    try {
        const profiles = await database.all(`
            SELECT userId, enlightenmentPoints
            FROM soul_profiles 
            ORDER BY enlightenmentPoints DESC 
            LIMIT 10
        `);

        res.json({ 
            success: true, 
            message: "Leaderboard u mor!",
            profiles: profiles || [],
            total: profiles ? profiles.length : 0
        });

    } catch (error) {
        res.json({
            success: true,
            message: "Leaderboard në modalitet të sigurt",
            profiles: [],
            total: 0,
            safe_mode: true
        });
    }
});

// ==================== NOUS-CORE ROUTES ====================

router.post('/nous-core/test', async (req, res) => {
    res.json({
        success: true,
        message: "NOUS-CORE RRUFE-TESLA 10.5 është operative!",
        status: "STABLE"
    });
});

router.get('/nous-core/status', async (req, res) => {
    const memoryCheck = MemoryMonitor.checkMemory();
    
    res.json({
        success: true,
        status: "OPERATIONAL",
        memory_usage: memoryCheck.memoryMB + "MB",
        system: "RRUFE_TESLA_10.5_STABLE"
    });
});

router.get('/health', async (req, res) => {
    const memoryCheck = MemoryMonitor.checkMemory();
    
    res.json({
        success: true,
        system: "RRUFE-TESLA 10.5 API",
        status: "HEALTHY",
        memory_usage: memoryCheck.memoryMB + "MB",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
