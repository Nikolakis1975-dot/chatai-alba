// =================================== api-perpetual-intelligence - VERSION I PËRDITËSUAR ME MEMORI =================================
const express = require('express');
const router = express.Router();

// ✅ IMPORTET E REJA ME MEMORI KONTEKSTUALE
const EnergyQuotaSystem = require('../../utils/ENERGY_QUOTA_SYSTEM_SIMPLE');
const EmpathyPredictionEngine = require('../../utils/EmpathyPredictionEngine');

class PerpetualIntelligenceCore {
    constructor() {
        this.energyQuota = new EnergyQuotaSystem();
        this.empathyEngine = new EmpathyPredictionEngine(); // 🆕 TASHMË KA MEMORI KONTEKSTUALE
        this.status = "QUANTUM_ACTIVE_WITH_MEMORY";
        console.log('✅ PERPETUAL INTELLIGENCE CORE: U inicializua me Context Memory!');
    }

    async processThought(thoughtData, userId) {
        try {
            // ✅ Së pari kontrollo etikën
            const energyStatus = await this.energyQuota.checkSystemStatus(userId);
            
            if (!energyStatus.allow_access) {
                return {
                    success: false,
                    blocked_by: "ENERGY_QUOTA_SYSTEM",
                    message: energyStatus.message_al,
                    usage: energyStatus.usage,
                    max_allowed: energyStatus.max_allowed,
                    system: "RRUFE_TESLA_10.5_ETHICAL_GUARD"
                };
            }

            // ✅ Pastaj përkthen qëllimin ME MEMORI KONTEKSTUALE
            const predictedIntent = await this.empathyEngine.predictIntent(thoughtData, userId); // 🆕 SHTUA userId
            
            // ✅ Përditëso përdorimin e energjisë
            await this.energyQuota.updateUsage(userId, 1);

            // ✅ Nëse ka paralajmërim lodhjeje, shto në përgjigje
            if (energyStatus.reason === "PARALAJMERIM_LODHJE") {
                return {
                    success: true,
                    thought: thoughtData.thought,
                    predicted_intent: predictedIntent,
                    energy_warning: energyStatus.message_al,
                    usage: energyStatus.usage,
                    threshold: energyStatus.threshold,
                    system: "PERPETUAL_INTELLIGENCE_WITH_CAUTION"
                };
            }

            return {
                success: true,
                thought: thoughtData.thought,
                predicted_intent: predictedIntent,
                energy_status: "HEALTHY",
                usage: energyStatus.usage,
                max_allowed: energyStatus.max_allowed,
                system: "PERPETUAL_INTELLIGENCE_WITH_MEMORY" // 🆕 NDRYSHUAR
            };

        } catch (error) {
            console.error('❌ Gabim në processThought:', error);
            throw error;
        }
    }

    async processVision(visionData, userId) {
        try {
            const energyStatus = await this.energyQuota.checkSystemStatus(userId);
            
            if (!energyStatus.allow_access) {
                return {
                    success: false,
                    blocked_by: "ENERGY_QUOTA_SYSTEM", 
                    message: energyStatus.message_al,
                    system: "VISION_BLOCKED_ETHICAL"
                };
            }

            await this.energyQuota.updateUsage(userId, 2);

            const visionIntent = await this.empathyEngine.processVisionIntent(visionData);

            return {
                success: true,
                vision_processed: true,
                intent: visionIntent,
                energy_status: energyStatus,
                perpetual: true,
                system: "PERPETUAL_VISION_ACTIVE"
            };

        } catch (error) {
            console.error('❌ Gabim në processVision:', error);
            throw error;
        }
    }

    // 🆕 METODA TË REJA PËR MENAXHIMIN E MEMORISË
    async getContextAnalysis(userId) {
        try {
            const contextAnalysis = await this.empathyEngine.getContextAnalysis(userId);
            const energyStatus = await this.energyQuota.checkSystemStatus(userId);

            return {
                success: true,
                user_id: userId,
                context_analysis: contextAnalysis,
                energy_status: energyStatus,
                system: "CONTEXT_MEMORY_ANALYSIS"
            };
        } catch (error) {
            return {
                success: false,
                message: "Analiza e kontekstit dështoi",
                error: error.message
            };
        }
    }

    async clearUserMemory(userId) {
        try {
            await this.empathyEngine.clearUserContext(userId);
            await this.energyQuota.resetUsage(userId);

            return {
                success: true,
                message: "Memoria e përdoruesit u pastrua me sukses",
                user_id: userId,
                system: "MEMORY_RESET_COMPLETE"
            };
        } catch (error) {
            return {
                success: false,
                message: "Pastrimi i memories dështoi",
                error: error.message
            };
        }
    }
}

// ✅ KRIJO INSTANCËN KRYESORE
const piCore = new PerpetualIntelligenceCore();

// ==================== ROUTES E REJA ME MEMORI ====================

router.post('/thought', async (req, res) => {
    try {
        const { thought, userId } = req.body;
        
        if (!thought || !userId) {
            return res.json({
                success: false,
                message: "Thought dhe userId janë të detyrueshme"
            });
        }

        console.log(`🧠 PERPETUAL THOUGHT: ${userId} - "${thought.substring(0, 50)}..."`);
        
        const result = await piCore.processThought({
            thought: thought,
            timestamp: new Date().toISOString(),
            context: "perpetual_intelligence"
        }, userId);

        res.json({
            ...result,
            system: "RRUFE_TESLA_10.5_PERPETUAL_INTELLIGENCE",
            council_approved: true,
            ethical_guard: "ACTIVE",
            memory_enhanced: true, // 🆕 TREGO SE KA MEMORI
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ ROUTE ERROR:', error);
        res.json({
            success: false,
            message: "Procesimi i mendimit dështoi",
            error: error.message
        });
    }
});

// 🆕 RUGË E RE PËR ANALIZË KONTEKSTI
router.get('/context-analysis/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`🧠 CONTEXT ANALYSIS: ${userId}`);
        
        const result = await piCore.getContextAnalysis(userId);
        
        res.json({
            ...result,
            timestamp: new Date().toISOString(),
            system: "RRUFE_TESLA_10.5_CONTEXT_MEMORY"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Analiza e kontekstit dështoi",
            error: error.message
        });
    }
});

// 🆕 RUGË E RE PËR PASTRIM MEMORIE
router.post('/clear-memory/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`🗑️ CLEAR MEMORY: ${userId}`);
        
        const result = await piCore.clearUserMemory(userId);
        
        res.json({
            ...result,
            timestamp: new Date().toISOString(),
            system: "MEMORY_MANAGEMENT"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Pastrimi i memories dështoi",
            error: error.message
        });
    }
});

router.get('/energy-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`🔋 ENERGY CHECK: ${userId}`);
        
        const status = await piCore.energyQuota.checkSystemStatus(userId);
        
        res.json({
            success: true,
            user_id: userId,
            energy_status: status,
            system: "ENERGY_QUOTA_SYSTEM",
            perpetual_intelligence: "ETHICAL_MODE",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Kontrolli i energjisë dështoi",
            error: error.message
        });
    }
});

// ✅ Rrugë e përditësuar për testim
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "PERPETUAL INTELLIGENCE API ME MEMORI KONTEKSTUALE ËSHTË OPERATIVE!",
        system: "RRUFE_TESLA_10.5",
        status: "QUANTUM_ACTIVE_WITH_MEMORY",
        features: [
            "Energy Quota System",
            "Empathy Prediction Engine", 
            "Context Memory Archive",
            "Ethical Guard Rails",
            "Direct Thought Processing",
            "Memory Management",
            "Context Analysis"
        ],
        new_endpoints: [
            "POST /thought (me memorie kontekstuale)",
            "GET /context-analysis/:userId",
            "POST /clear-memory/:userId",
            "GET /energy-status/:userId"
        ]
    });
});

module.exports = router;
