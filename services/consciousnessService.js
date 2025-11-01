const CosmicCounterService = require('./cosmicCounterService'); // ✅ SHTESË E RE

class ConsciousnessService {
    static async logSoulResonance(resonanceData) {
        console.log('💫 Duke regjistruar rezonancë shpirtërore...');
        
        // ✅ PËRDOR COSMIC COUNTER SERVICE
        const result = await CosmicCounterService.recordResonance(resonanceData);
        
        return {
            totalSouls: result.count,
            resonanceId: result.id,
            timestamp: new Date().toISOString()
        };
    }
    
    static async getConsciousnessMetrics() {
        // ✅ PËRDOR COSMIC COUNTER SERVICE
        const totalSouls = await CosmicCounterService.getTotalCount();
        const averageResonance = await this.calculateAverageResonance();
        
        return {
            totalSouls: totalSouls,
            averageResonance: averageResonance,
            harmonyIndex: this.calculateHarmonyIndex(totalSouls),
            consciousnessLevel: this.calculateConsciousnessLevel(totalSouls),
            lastUpdated: new Date().toISOString()
        };
    }
    
    static calculateConsciousnessLevel(totalSouls) {
        const baseLevel = 0.3 + (totalSouls * 0.001);
        return Math.min(baseLevel, 0.95);
    }
    
    static calculateHarmonyIndex(totalSouls) {
        return 0.7 + (totalSouls * 0.0005);
    }
    
    static async calculateAverageResonance() {
        return 0.78; // Vlerë fillestare
    }
}

module.exports = ConsciousnessService;
