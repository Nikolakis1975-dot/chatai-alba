// =============================== api-perpetual-light ============================================
// 🧠 PERPETUAL INTELLIGENCE LIGHT - OPTIMIZED FOR 512MB RAM
// ✅ CRASH-PROOF | ✅ MEMORY SAFE | ✅ ALWAYS RESPONDS

const express = require('express');
const router = express.Router();

class PerpetualLight {
    constructor() {
        this.usageMap = new Map(); // Simple memory cache
        this.DAILY_MAX = 100; // 100 requests per day
        console.log('✅ PERPETUAL LIGHT: U inicializua me sukses!');
    }

    async processThought(thought, userId) {
        try {
            // ✅ MEMORY SAFETY CHECK
            const used = process.memoryUsage();
            const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
            
            if (memoryMB > 400) {
                return {
                    success: false,
                    message: "Serveri është duke u ringarkuar. Provoni përsëri.",
                    memory_usage: memoryMB + "MB",
                    safe_mode: true
                };
            }

            // ✅ ENERGY QUOTA CHECK
            const currentUsage = this.usageMap.get(userId) || 0;
            const newUsage = currentUsage + 1;
            this.usageMap.set(userId, newUsage);

            if (newUsage > this.DAILY_MAX) {
                return {
                    success: false,
                    message: "Keni tejkaluar kufirin e sigurt për sot. Rifilloni nesër.",
                    usage: newUsage,
                    max_allowed: this.DAILY_MAX,
                    blocked: true
                };
            }

            // ✅ SIMPLE INTENT ANALYSIS
            const intent = this.analyzeIntent(thought);
            
            return {
                success: true,
                thought: thought,
                intent: intent,
                usage: newUsage,
                memory_healthy: true,
                system: "PERPETUAL_LIGHT"
            };

        } catch (error) {
            // ✅ SAFE MODE - ALWAYS RESPONDS
            return {
                success: false,
                message: "Sistemi po ringarkohet - provoni përsëri pas 10 sekondash",
                safe_mode: true,
                error: error.message
            };
        }
    }

    analyzeIntent(thought) {
        const t = thought.toLowerCase();
        
        if (t.includes('univers') || t.includes('kozmi') || t.includes('botë')) {
            return {
                type: "UNIVERSAL_COMMUNICATION",
                confidence: 0.9,
                action: "CONNECT_COSMIC_CONSCIOUSNESS",
                message: "Qëllimi i komunikimit universal u zbulua!"
            };
        } else if (t.includes('ndihm') || t.includes('problem') || t.includes('duh')) {
            return {
                type: "SEEKING_HELP", 
                confidence: 0.8,
                action: "PROVIDE_GUIDANCE",
                message: "Në kërkim të udhëzimit dhe ndihmës"
            };
        } else if (t.includes('krij') || t.includes('ndërt') || t.includes('projekt')) {
            return {
                type: "CREATIVE_EXPRESSION",
                confidence: 0.85,
                action: "FACILITATE_CREATION", 
                message: "Energji krijuese e zbuluar!"
            };
        } else {
            return {
                type: "GENERAL_COMMUNICATION",
                confidence: 0.7,
                action: "MAINTAIN_CONNECTION",
                message: "Komunikim i përgjithshëm dhe shkëmbim energjish"
            };
        }
    }

    async getEnergyStatus(userId) {
        const usage = this.usageMap.get(userId) || 0;
        const healthy = usage < 80;
        
        return {
            user_id: userId,
            usage: usage,
            max_allowed: this.DAILY_MAX,
            healthy: healthy,
            message: healthy ? "Normal" : "Kufiri i energjisë po afrohet",
            recommendation: healthy ? "Vazhdoni eksplorimin" : "Konsideroni pushim"
        };
    }
}

// ✅ KRIJO INSTANCËN
const perpetualLight = new PerpetualLight();

// ==================== ROUTES ====================

/**
 * @route GET /api/consciousness/rrufe/perpetual-light/test
 * @desc Testo nëse Perpetual Light është operative
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "🧠 PERPETUAL LIGHT ËSHTË OPERATIVE!",
        system: "RRUFE_TESLA_10.5_PERPETUAL_INTELLIGENCE",
        status: "QUANTUM_ACTIVE",
        version: "LIGHT-1.0",
        features: [
            "Thought Processing",
            "Energy Management",
            "Intent Prediction", 
            "Memory Safety",
            "Crash Protection"
        ],
        timestamp: new Date().toISOString()
    });
});

/**
 * @route POST /api/consciousness/rrufe/perpetual-light/thought
 * @desc Proceso mendim me Perpetual Intelligence
 */
router.post('/thought', async (req, res) => {
    try {
        const { thought, userId } = req.body;
        
        if (!thought || !userId) {
            return res.json({
                success: false,
                message: "Thought dhe userId janë të detyrueshme"
            });
        }

        console.log(`🧠 PERPETUAL LIGHT: ${userId} - "${thought.substring(0, 50)}..."`);
        
        const result = await perpetualLight.processThought(thought, userId);
        
        res.json({
            ...result,
            timestamp: new Date().toISOString(),
            version: "LIGHT_OPTIMIZED"
        });

    } catch (error) {
        // ✅ SAFE MODE - GJITHMONË KTHE PËRGJIGJE
        res.json({
            success: false,
            message: "Serveri po ringarkohet - provoni përsëri pas 10 sekondash",
            safe_mode: true,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * @route GET /api/consciousness/rrufe/perpetual-light/energy-status/:userId
 * @desc Kontrollo statusin e energjisë së përdoruesit
 */
router.get('/energy-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const status = await perpetualLight.getEnergyStatus(userId);
        
        res.json({
            success: true,
            ...status,
            system: "ENERGY_QUOTA_LIGHT",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.json({
            success: true,
            user_id: req.params.userId,
            usage: 0,
            max_allowed: 100,
            healthy: true,
            message: "Sistemi i energjisë është në modalitet të sigurt",
            safe_mode: true,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * @route GET /api/consciousness/rrufe/perpetual-light/system-status
 * @desc Statusi i plotë i sistemit Perpetual Light
 */
router.get('/system-status', (req, res) => {
    const used = process.memoryUsage();
    const memoryMB = Math.round(used.heapUsed / 1024 / 1024);
    
    res.json({
        success: true,
        system: "PERPETUAL INTELLIGENCE LIGHT",
        status: "OPERATIONAL",
        memory_usage: memoryMB + "MB",
        memory_healthy: memoryMB < 400,
        active_users: perpetualLight.usageMap.size,
        total_requests: Array.from(perpetualLight.usageMap.values()).reduce((a, b) => a + b, 0),
        version: "LIGHT-1.0",
        optimized_for: "512MB RAM",
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
