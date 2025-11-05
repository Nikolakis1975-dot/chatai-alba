// =================================== api-perpetual-light - SUPER LIGHT VERSION =======================================
const express = require('express');
const router = express.Router();

// ✅ VERSION I LEHTË - PA MODULE TË JASHTME
class PerpetualLight {
    constructor() {
        this.usageMap = new Map(); // Simple memory cache
        console.log('✅ PERPETUAL LIGHT: U inicializua!');
    }

    async processThought(thought, userId) {
        try {
            // ✅ KONTROLLO MEMORINË PARA SE TË FILLOJË
            const used = process.memoryUsage();
            const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
            
            if (memoryMB > 400) {
                return {
                    success: false,
                    message: "Serveri është duke u ringarkuar. Provoni përsëri.",
                    memory_usage: memoryMB + "MB"
                };
            }

            // ✅ KONTROLLO ENERGI (SIMPLIFIED)
            const currentUsage = this.usageMap.get(userId) || 0;
            const newUsage = currentUsage + 1;
            this.usageMap.set(userId, newUsage);

            if (newUsage > 100) {
                return {
                    success: false,
                    message: "Keni tejkaluar kufirin e sigurt për sot.",
                    usage: newUsage,
                    max_allowed: 100
                };
            }

            // ✅ ANALIZO I THJESHTË
            const intent = this.simpleIntentAnalysis(thought);
            
            return {
                success: true,
                thought: thought,
                intent: intent,
                usage: newUsage,
                memory_healthy: true,
                system: "PERPETUAL_LIGHT"
            };

        } catch (error) {
            return {
                success: false,
                message: "Gabim i lehtë - serveri po ringarkohet",
                error: error.message
            };
        }
    }

    simpleIntentAnalysis(thought) {
        const t = thought.toLowerCase();
        if (t.includes('univers')) return { type: "UNIVERSAL", confidence: 0.9 };
        if (t.includes('ndihm') || t.includes('problem')) return { type: "HELP", confidence: 0.8 };
        if (t.includes('krij') || t.includes('bëj')) return { type: "CREATE", confidence: 0.85 };
        return { type: "GENERAL", confidence: 0.7 };
    }

    async getEnergyStatus(userId) {
        const usage = this.usageMap.get(userId) || 0;
        return {
            user_id: userId,
            usage: usage,
            max_allowed: 100,
            healthy: usage < 80,
            message: usage < 80 ? "Normal" : "Kufiri afrohet"
        };
    }
}

const perpetualLight = new PerpetualLight();

// ==================== ROUTES SUPER TË LEHTA ====================

router.post('/thought', async (req, res) => {
    try {
        const { thought, userId } = req.body;
        
        if (!thought || !userId) {
            return res.json({
                success: false,
                message: "Thought dhe userId janë të detyrueshme"
            });
        }

        console.log(`🧠 LIGHT THOUGHT: ${userId} - ${thought.substring(0, 30)}...`);
        
        const result = await perpetualLight.processThought(thought, userId);
        
        res.json({
            ...result,
            timestamp: new Date().toISOString(),
            version: "LIGHT_OPTIMIZED"
        });

    } catch (error) {
        // ✅ EDHE NË CRASH, KTHE PËRGJIGJE
        res.json({
            success: false,
            message: "Serveri po ringarkohet - provoni përsëri pas 10 sekondash",
            version: "LIGHT_SAFE_MODE"
        });
    }
});

router.get('/energy-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const status = await perpetualLight.getEnergyStatus(userId);
        
        res.json({
            success: true,
            ...status,
            system: "ENERGY_LIGHT"
        });

    } catch (error) {
        res.json({
            success: true,
            user_id: req.params.userId,
            usage: 0,
            max_allowed: 100,
            healthy: true,
            message: "Sistemi i energjisë është në modalitet të sigurt",
            safe_mode: true
        });
    }
});

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "PERPETUAL LIGHT ËSHTË OPERATIVE!",
        memory_optimized: true,
        features: ["Thought Processing", "Energy Management", "Crash Protection"]
    });
});

module.exports = router;
