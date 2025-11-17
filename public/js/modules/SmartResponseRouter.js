// =====================================  ======================================
class SmartResponseRouter {
    constructor() {
        this.initialize();
    }
    
    async initialize() {
        console.log("🧠 Smart Response Router po inicializohet...");
        await this.loadConfiguration();
        this.setupEventListeners();
    }
    
    async loadConfiguration() {
        // Ngarko konfigurimin nga serveri ose localStorage
        this.config = {
            geminiEnabled: await this.checkAPIStatus(),
            localIntelligence: true,
            fallbackStrategies: ['gemini', 'local', 'rrufe'],
            responseQuality: 'high'
        };
    }
    
    async processMessage(message) {
        // Ky është zemra e sistemit të ri
        const analysis = this.analyzeMessage(message);
        const route = this.determineBestRoute(message, analysis);
        return await this.executeRoute(route, message);
    }
}
