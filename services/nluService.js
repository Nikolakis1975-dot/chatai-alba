// services/nluService.js - VERSION I THJESHTË
console.log('🚀 NLU Service - Duke u ngarkuar...');

class NLUService {
    constructor() {
        console.log('✅ NLU Service u inicializua me sukses!');
    }

    async analyzeText(text, userId = null) {
        try {
            console.log(`🔍 NLU Duke analizuar: "${text.substring(0, 50)}"`);
            
            const analysis = {
                text: text,
                timestamp: new Date().toISOString(),
                intent: { 
                    type: this.detectIntent(text), 
                    confidence: 0.8,
                    parameters: {}
                },
                sentiment: { 
                    sentiment: 'neutral', 
                    score: 0,
                    confidence: 0.8,
                    irony: false,
                    emotionalTone: 'neutral'
                },
                entities: { 
                    persons: [], 
                    locations: [], 
                    organizations: []
                },
                nuances: { 
                    figurativeLanguage: [],
                    urgency: 'normal',
                    politeness: 'neutral'
                }
            };

            console.log(`📊 NLU Rezultat: ${analysis.intent.type}`);
            return analysis;

        } catch (error) {
            console.error('❌ Gabim në NLU analyzeText:', error);
            return this.getDefaultAnalysis(text);
        }
    }

    detectIntent(text) {
        const lowerText = text.toLowerCase().trim();
        
        if (lowerText.includes('pershendetje') || lowerText.includes('si jeni') || lowerText.includes('si je')) {
            return 'greeting';
        }
        
        if (lowerText.includes('faleminderit') || lowerText.includes('rrofsh')) {
            return 'gratitude';
        }
        
        if (lowerText.includes('ndihm') || lowerText.includes('help')) {
            return 'request';
        }
        
        if (text.includes('?')) {
            return 'question';
        }
        
        if (text.startsWith('/')) {
            return 'command';
        }
        
        return 'statement';
    }

    getDefaultAnalysis(text) {
        return {
            text: text,
            timestamp: new Date().toISOString(),
            intent: { type: 'unknown', confidence: 0.5, parameters: {} },
            sentiment: { sentiment: 'neutral', score: 0, confidence: 0.5, irony: false, emotionalTone: 'neutral' },
            entities: { persons: [], locations: [], organizations: [] },
            nuances: { figurativeLanguage: [], urgency: 'normal', politeness: 'neutral' }
        };
    }
}

// ✅ EKSPORTO SIMPLE
module.exports = new NLUService();
console.log('🎉 NLU Service u ngarkua dhe u eksportua me sukses!');
