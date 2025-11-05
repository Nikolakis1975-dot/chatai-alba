// =================================== api-perpetual-intelligence - VERSION I RREGULLUAR =================================
const express = require('express');
const router = express.Router();

// ✅ IMPORTET E SAKTA
const EnergyQuotaSystem = require('../../utils/ENERGY_QUOTA_SYSTEM');
const EmpathyPredictionEngine = require('../../utils/EmpathyPredictionEngine');

class PerpetualIntelligenceCore {
    constructor() {
        this.energyQuota = new EnergyQuotaSystem();
        this.empathyEngine = new EmpathyPredictionEngine();
        this.status = "QUANTUM_ACTIVE";
        console.log('✅ PERPETUAL INTELLIGENCE CORE: U inicializua me mbrojtje etike!');
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

            // ✅ Pastaj përkthen qëllimin
            const predictedIntent = await this.empathyEngine.predictIntent(thoughtData);
            
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
                system: "PERPETUAL_INTELLIGENCE_ACTIVE"
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
}

// ✅ KRIJO INSTANCËN KRYESORE
const piCore = new PerpetualIntelligenceCore();

// ==================== ROUTES ====================

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

// ✅ Rrugë e re për testim të shpejtë
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "PERPETUAL INTELLIGENCE API është OPERATIVE!",
        system: "RRUFE_TESLA_10.5",
        status: "QUANTUM_ACTIVE",
        features: [
            "Energy Quota System",
            "Empathy Prediction Engine", 
            "Ethical Guard Rails",
            "Direct Thought Processing"
        ]
    });
});

module.exports = router;
