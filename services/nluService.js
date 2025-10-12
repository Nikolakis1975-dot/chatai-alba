// services/nluService.js - VERSION I RI 100% I PUNUESHËM
console.log('🚀 NLU Service - Duke u ngarkuar...');

class NLUService {
    constructor() {
        console.log('✅ NLU Service u inicializua me sukses!');
        this.initialized = true;
    }

    async analyzeText(text, userId = null) {
        try {
            console.log(`🔍 NLU Duke analizuar: "${text.substring(0, 50)}"`);
            
            // Analizë bazë por funksionale
            const analysis = {
                text: text,
                timestamp: new Date().toISOString(),
                intent: { 
                    type: this.detectIntent(text), 
                    confidence: 0.8,
                    parameters: this.getIntentParameters(text)
                },
                sentiment: { 
                    sentiment: this.analyzeSentiment(text), 
                    score: 0,
                    confidence: 0.7,
                    irony: false,
                    emotionalTone: 'neutral'
                },
                entities: { 
                    persons: this.extractPersons(text), 
                    locations: this.extractLocations(text), 
                    organizations: [] 
                },
                nuances: { 
                    figurativeLanguage: [],
                    urgency: 'normal',
                    politeness: 'neutral'
                }
            };

            console.log(`📊 NLU Rezultat: ${analysis.intent.type} | ${analysis.sentiment.sentiment}`);
            return analysis;

        } catch (error) {
            console.error('❌ Gabim në NLU analyzeText:', error);
            return this.getDefaultAnalysis(text);
        }
    }

    detectIntent(text) {
        try {
            const lowerText = text.toLowerCase().trim();
            
            // Përshëndetje
            if (lowerText.includes('përshëndetje') || 
                lowerText.includes('tungjatjeta') || 
                lowerText.includes('hello') ||
                lowerText.includes('hi') ||
                lowerText.includes('mirëdita') ||
                lowerText.includes('mirëmbrëma')) {
                return 'greeting';
            }
            
            // Pyetje për gjendjen
            if (lowerText.includes('si je') || 
                lowerText.includes('si jeni') ||
                lowerText.includes('si kalove') ||
                lowerText.includes('si keni kaluar')) {
                return 'greeting';
            }
            
            // Falënderim
            if (lowerText.includes('faleminderit') || 
                lowerText.includes('rrofsh') ||
                lowerText.includes('thanks') ||
                lowerText.includes('thank you')) {
                return 'gratitude';
            }
            
            // Kërkesë për ndihmë
            if (lowerText.includes('ndihmë') || 
                lowerText.includes('help') ||
                lowerText.includes('më ndihmo') ||
                lowerText.includes('mund të më ndihmosh')) {
                return 'request';
            }
            
            // Pyetje
            if (text.includes('?')) {
                return 'question';
            }
            
            return 'statement';
            
        } catch (error) {
            return 'unknown';
        }
    }

    getIntentParameters(text) {
        const params = {};
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('sot') || lowerText.includes('today')) {
            params.timeReference = 'today';
        }
        if (lowerText.includes('nesër') || lowerText.includes('tomorrow')) {
            params.timeReference = 'tomorrow';
        }
        if (lowerText.includes('dje') || lowerText.includes('yesterday')) {
            params.timeReference = 'yesterday';
        }
        
        return params;
    }

    analyzeSentiment(text) {
        try {
            const lowerText = text.toLowerCase();
            const positiveWords = ['mirë', 'bukur', 'shkëlqyeshëm', 'mrekullueshëm', 'fantastik', 'perfekt', 'lumtur', 'gezuar'];
            const negativeWords = ['keq', 'tmerr', 'katastrof', 'i tmerrshëm', 'i shëmtuar', 'trishtuar', 'i mërzitur'];

            const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
            const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

            if (positiveCount > negativeCount) return 'positive';
            if (negativeCount > positiveCount) return 'negative';
            
            return 'neutral';
        } catch (error) {
            return 'neutral';
        }
    }

    extractPersons(text) {
        const persons = [];
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('mik') || lowerText.includes('shok') || lowerText.includes('dashur')) {
            persons.push('person');
        }
        
        return persons;
    }

    extractLocations(text) {
        const locations = [];
        const lowerText = text.toLowerCase();
        const commonLocations = ['tiran', 'durrës', 'shqipëri', 'kosovë', 'vlorë', 'elbasan'];
        
        commonLocations.forEach(location => {
            if (lowerText.includes(location)) {
                locations.push(location);
            }
        });
        
        return locations;
    }

    getDefaultAnalysis(text) {
        return {
            text: text,
            timestamp: new Date().toISOString(),
            intent: { type: 'unknown', confidence: 0.5, parameters: {} },
            sentiment: { sentiment: 'neutral', score: 0, confidence: 0.5, irony: false },
            entities: { persons: [], locations: [], organizations: [] },
            nuances: { figurativeLanguage: [] }
        };
    }
}

// Krijo dhe eksporto instancën - KY RRESHT ËSHTË SHUMË I RËNDËSISHËM!
const nluService = new NLUService();
module.exports = nluService;

console.log('🎉 NLU Service u ngarkua dhe u eksportua me sukses!');
