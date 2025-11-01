class CosmicCounterService {
    static soulResonances = []; // Përkohësisht në memorie
    
    static async recordResonance(resonanceData) {
        const record = {
            id: this.generateId(),
            resonance: resonanceData.resonanceLevel || 0.8,
            visitorData: resonanceData.visitorData,
            timestamp: resonanceData.timestamp || new Date().toISOString()
        };
        
        this.soulResonances.push(record);
        
        console.log(`🌌 Rezonancë e re u regjistrua! Total: ${this.soulResonances.length}`);
        
        return {
            id: record.id,
            count: this.soulResonances.length
        };
    }
    
    static async getTotalCount() {
        return this.soulResonances.length || 123;
    }
    
    static generateId() {
        return 'soul_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

module.exports = CosmicCounterService;
