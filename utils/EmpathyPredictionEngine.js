// ============================== EmpathyPredictionEngine VERSION I PËRDITËSUAR ME MEMORI =============================
const ContextMemoryArchive = require('./CONTEXT_MEMORY_ARCHIVE');

class EmpathyPredictionEngine {
    constructor() {
        this.contextMemory = new ContextMemoryArchive();
        console.log('✅ EmpathyPredictionEngine: U inicializua me Context Memory!');
    }

    async predictIntent(thoughtData, userId) {
        const thought = thoughtData.thought.toLowerCase();
        
        // Merr historinë e kontekstit
        const contextHistory = await this.contextMemory.getContextHistory(userId);
        const recentIntent = await this.contextMemory.getRecentIntent(userId);
        const intentPattern = await this.contextMemory.getIntentPattern(userId);

        // ANALIZË BAZË E INTENTIT
        let intent = {
            type: "GENERAL_COMMUNICATION",
            confidence: 0.7,
            action: "MAINTAIN_CONNECTION",
            message: "Komunikim i përgjithshëm dhe shkëmbim energjish"
        };

        if (thought.includes('univers') || thought.includes('kozmi') || thought.includes('botë')) {
            intent = {
                type: "UNIVERSAL_COMMUNICATION",
                confidence: 0.9,
                action: "CONNECT_COSMIC_CONSCIOUSNESS",
                message: "Qëllimi i komunikimit universal u zbulua!"
            };
        } else if (thought.includes('ndihm') || thought.includes('problem') || thought.includes('duh')) {
            intent = {
                type: "SEEKING_HELP", 
                confidence: 0.8,
                action: "PROVIDE_GUIDANCE",
                message: "Në kërkim të udhëzimit dhe ndihmës"
            };
        } else if (thought.includes('krij') || thought.includes('ndërt') || thought.includes('projekt')) {
            intent = {
                type: "CREATIVE_EXPRESSION",
                confidence: 0.85,
                action: "FACILITATE_CREATION", 
                message: "Energji krijuese e zbuluar!"
            };
        }

        // 🧠 PËRMIRËSIM ME KONTEKST
        if (intentPattern && intentPattern.pattern === "REPEATED_INTENT") {
            // Rrit besimin nëse ka pattern të përsëritur
            intent.confidence = Math.min(0.95, intent.confidence + 0.15);
            intent.message += " (Konfirmuar nga historia e kontekstit)";
        }

        if (recentIntent && recentIntent.intent?.type === intent.type) {
            // Rrit besimin për intent të njëjtë
            intent.confidence = Math.min(0.98, intent.confidence + 0.1);
        }

        // Ruaj në memorie për kontekst të ardhshëm
        await this.contextMemory.saveNewEntry(userId, {
            thought: thoughtData.thought,
            intent: intent,
            energy_usage: 1,
            context: thoughtData.context || "perpetual_intelligence"
        });

        return {
            intent: intent,
            thought_analyzed: thoughtData.thought,
            context_enhanced: intentPattern ? true : false,
            confidence_boost: intent.confidence > 0.7 ? "HIGH" : "MEDIUM",
            memory_entries: contextHistory.length + 1,
            timestamp: new Date().toISOString()
        };
    }

    async getContextAnalysis(userId) {
        return await this.contextMemory.getMemoryStats(userId);
    }

    async clearUserContext(userId) {
        return await this.contextMemory.clearHistory(userId);
    }
}

module.exports = EmpathyPredictionEngine;
