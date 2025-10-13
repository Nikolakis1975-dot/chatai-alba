// services/nluService.js - VERSION I PLOTË I PUNUESHËM
console.log('🚀 NLU Service - Duke u ngarkuar...');

class NLUService {
    constructor() {
        console.log('✅ NLU Service u inicializua me sukses!');
        this.initialized = true;
        
     // =============================== ✅ FJALOR I GJERË SHQIP PËR ANALIZË MË TË MIRË =================================

        this.shqipKeywords = {
            greetings: [
                'përshëndetje', 'pershendetje', 'tungjatjeta', 'tung', 'çkemi', 'ckemi',
                'mirëdita', 'miredita', 'mirëmbrëma', 'mirembrema', 'mirëmëngjes', 'miremengjes',
                'hello', 'hi', 'hey', 'ciao', 'salut'
            ],
            farewells: [
                'mirupafshim', 'lamtumirë', 'lamtumire', 'bye', 'goodbye', 'farwell',
                'natën e mirë', 'naten e mire', 'ditën e mirë', 'diten e mire'
            ],
            gratitude: [
                'faleminderit', 'fale', 'rrofsh', 'rrofshi', 'thanks', 'thank you',
                'ju falenderoj', 'faleminderit shumë', 'fale shumë', 'rrofsh shumë',
                'shumë faleminderit', 'shume faleminderit'
            ],
            requests: [
                'ndihmë', 'ndihmo', 'help', 'më ndihmo', 'me ndihmo', 'mund të më ndihmosh',
                'mund te me ndihmosh', 'dëshiroj ndihmë', 'deshiroj ndihme', 'kam nevojë',
                'kam nevoje', 'më duhet', 'me duhet', 'asistent', 'asistencë', 'asistence'
            ],
            questions: [
                'si je', 'si jeni', 'si kalove', 'si kaluat', 'si po', 'si po shkon',
                'si po ia del', 'çfarë po bën', 'cfare po ben', 'çfarë thua', 'cfare thua',
                'a mund', 'a din', 'a dini', 'ku është', 'ku eshte', 'kur', 'pse', 'si',
                'sa', 'kush', 'cil', 'përse', 'perse'
            ],
            positive: [
                'mirë', 'mire', 'bukur', 'shkëlqyeshëm', 'shkelqyeshem', 'mrekullueshëm',
                'fantastik', 'perfekt', 'lumtur', 'gezuar', 'kënaqur', 'kenaqur', 'super',
                'mbreslënës', 'mbreslenes', 'i/e shkëlqyer', 'i/e shkelqyer'
            ],
            negative: [
                'keq', 'tmerr', 'katastrof', 'i/e tmerrshëm', 'i/e tmerrshem', 'i/e shëmtuar',
                'i/e shemtuar', 'trishtuar', 'i/e mërzitur', 'i/e merzitur', 'i/e dëshpëruar',
                'i/e deshperuar', 'i/e pikëlluar', 'i/e pikelluar'
            ]
        };
    }

      // 🔍 ====================================== ANALIZA TEXT MLU ===========================================

    async analyzeText(text, userId = null) {
        try {
            console.log(`🔍 NLU Duke analizuar: "${text.substring(0, 50)}"`);
            
            const analysis = {
                text: text,
                timestamp: new Date().toISOString(),
                intent: { 
                    type: this.detectIntent(text), 
                    confidence: this.calculateConfidence(text),
                    parameters: this.getIntentParameters(text)
                },
                sentiment: { 
                    sentiment: this.analyzeSentiment(text), 
                    score: this.calculateSentimentScore(text),
                    confidence: 0.8,
                    irony: this.detectIrony(text),
                    emotionalTone: this.detectEmotionalTone(text)
                },
                entities: { 
                    persons: this.extractPersons(text), 
                    locations: this.extractLocations(text), 
                    organizations: this.extractOrganizations(text)
                },
                nuances: { 
                    figurativeLanguage: this.detectFigurativeLanguage(text),
                    urgency: this.detectUrgency(text),
                    politeness: this.detectPoliteness(text)
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
            
        // ===================== ✅ PËRSHËNDETJE ===============================

            if (this.containsAny(lowerText, this.shqipKeywords.greetings)) {
                return 'greeting';
            }
            
       // ========================= ✅ LAMTUMIRË ===============================

            if (this.containsAny(lowerText, this.shqipKeywords.farewells)) {
                return 'farewell';
            }
            
       // ========================= ✅ FALËNDERIM ===============================

            if (this.containsAny(lowerText, this.shqipKeywords.gratitude)) {
                return 'gratitude';
            }
            
       // ========================✅ KËRKESË PËR NDIHMË ============================

            if (this.containsAny(lowerText, this.shqipKeywords.requests)) {
                return 'request';
            }
            
       // ======================== ✅ PYTJE =====================================

            if (this.containsAny(lowerText, this.shqipKeywords.questions) || text.includes('?')) {
                return 'question';
            }
            
      // ============================ ✅ KOMANDË ====================================

            if (text.startsWith('/')) {
                return 'command';
            }
            
            return 'statement';
            
        } catch (error) {
            return 'unknown';
        }
    }

    calculateConfidence(text) {
        let confidence = 0.5;
        const lowerText = text.toLowerCase();
        
        // Rrit confidence bazuar në specifikësinë e mesazhit
        if (this.containsAny(lowerText, this.shqipKeywords.greetings)) confidence += 0.3;
        if (this.containsAny(lowerText, this.shqipKeywords.gratitude)) confidence += 0.3;
        if (this.containsAny(lowerText, this.shqipKeywords.requests)) confidence += 0.2;
        if (text.includes('?')) confidence += 0.1;
        
        return Math.min(confidence, 0.95);
    }

    getIntentParameters(text) {
        const params = {};
        const lowerText = text.toLowerCase();
        
      // ===========================✅ KOHË ======================================

        if (lowerText.includes('sot') || lowerText.includes('today')) {
            params.timeReference = 'today';
        }
        if (lowerText.includes('nesër') || lowerText.includes('neser') || lowerText.includes('tomorrow')) {
            params.timeReference = 'tomorrow';
        }
        if (lowerText.includes('dje') || lowerText.includes('yesterday')) {
            params.timeReference = 'yesterday';
        }
        
      // ======================== ✅ KOHË E DITËS ===================================

        const hour = new Date().getHours();
        if (hour < 12) params.timeOfDay = 'morning';
        else if (hour < 18) params.timeOfDay = 'afternoon';
        else params.timeOfDay = 'evening';
        
      // =========================✅ TIP PYTJEJE =====================================

        if (lowerText.includes('si je') || lowerText.includes('si jeni')) {
            params.questionType = 'wellbeing';
        }
        if (lowerText.includes('çfarë') || lowerText.includes('cfare') || lowerText.includes('what')) {
            params.questionType = 'information';
        }
        if (lowerText.includes('ku') || lowerText.includes('where')) {
            params.questionType = 'location';
        }
        if (lowerText.includes('kur') || lowerText.includes('when')) {
            params.questionType = 'time';
        }
        
        return params;
    }

    analyzeSentiment(text) {
        try {
            const lowerText = text.toLowerCase();
            
            const positiveCount = this.shqipKeywords.positive.filter(word => 
                lowerText.includes(word)
            ).length;
            
            const negativeCount = this.shqipKeywords.negative.filter(word => 
                lowerText.includes(word)
            ).length;

            if (positiveCount > negativeCount) return 'positive';
            if (negativeCount > positiveCount) return 'negative';
            
            return 'neutral';
        } catch (error) {
            return 'neutral';
        }
    }

    calculateSentimentScore(text) {
        const lowerText = text.toLowerCase();
        let score = 0;
        
        this.shqipKeywords.positive.forEach(word => {
            if (lowerText.includes(word)) score += 0.2;
        });
        
        this.shqipKeywords.negative.forEach(word => {
            if (lowerText.includes(word)) score -= 0.2;
        });
        
        return Math.max(-1, Math.min(1, score));
    }

    detectIrony(text) {
        const lowerText = text.toLowerCase();
        const ironyIndicators = ['sigurisht', 'natyrisht', 'patjetër', 'pa dyshim'];
        
        return ironyIndicators.some(indicator => 
            lowerText.includes(indicator) && lowerText.includes('!')
        );
    }

    detectEmotionalTone(text) {
        const lowerText = text.toLowerCase();
        
        if (this.containsAny(lowerText, ['urgjent', 'në rrezik', 'shpejt', 'menjëherë'])) {
            return 'urgent';
        }
        if (this.containsAny(lowerText, ['ju lutem', 'të lutem', 'do të isha mirënjohës'])) {
            return 'polite';
        }
        if (this.containsAny(lowerText, ['haha', 'lol', '😂', '😄', 'qeshu', 'të qeshurave'])) {
            return 'humorous';
        }
        
        return 'neutral';
    }

    extractPersons(text) {
        const persons = [];
        const lowerText = text.toLowerCase();
        
        const personIndicators = [
            'mik', 'shok', 'dashur', 'dashuro', 'zemër', 'zemer',
            'profesor', 'mësues', 'mesues', 'drejtor', 'prind'
        ];
        
        personIndicators.forEach(person => {
            if (lowerText.includes(person)) {
                persons.push(person);
            }
        });
        
        return persons;
    }

    extractLocations(text) {
        const locations = [];
        const lowerText = text.toLowerCase();
        
        const commonLocations = [
            'tiran', 'durrës', 'durres', 'shqipëri', 'shqiperi', 'kosovë', 'kosove',
            'vlorë', 'vlore', 'elbasan', 'fier', 'korçë', 'korce', 'shkodër', 'shkoder',
            'berat', 'lushnjë', 'lushnje', 'kavajë', 'kavaje'
        ];
        
        commonLocations.forEach(location => {
            if (lowerText.includes(location)) {
                locations.push(location);
            }
        });
        
        return locations;
    }

    extractOrganizations(text) {
        const organizations = [];
        const lowerText = text.toLowerCase();
        
        const orgIndicators = [
            'shkoll', 'universitet', 'fakultet', 'kompani', 'kompania', 'firma',
            'qeveri', 'ministri', 'bashki', 'komun'
        ];
        
        orgIndicators.forEach(org => {
            if (lowerText.includes(org)) {
                organizations.push(org);
            }
        });
        
        return organizations;
    }

    detectFigurativeLanguage(text) {
        const figurative = [];
        const lowerText = text.toLowerCase();
        
        // Shembuj të shprehjeve figurative shqipe
        const figurativeExpressions = [
            { expression: 'bie shi', meaning: 'ndodh diçka e papritur' },
            { expression: 'hap sy', meaning: 'kujdesu' },
            { expression: 'vdekur nga uria', meaning: 'shumë i uritur' }
        ];
        
        figurativeExpressions.forEach(expr => {
            if (lowerText.includes(expr.expression)) {
                figurative.push(expr);
            }
        });
        
        return figurative;
    }

    detectUrgency(text) {
        const lowerText = text.toLowerCase();
        
        if (this.containsAny(lowerText, ['shpejt', 'menjëherë', 'tani', 'urgjent', 'emergjencë'])) {
            return 'high';
        }
        if (this.containsAny(lowerText, ['sot', 'pas pak', 'shpejtësisht'])) {
            return 'medium';
        }
        
        return 'normal';
    }

    detectPoliteness(text) {
        const lowerText = text.toLowerCase();
        
        if (this.containsAny(lowerText, ['ju lutem', 'të lutem', 'faleminderit', 'ju falenderoj'])) {
            return 'polite';
        }
        if (this.containsAny(lowerText, ['dëshiroj', 'dua', 'më jep', 'më dërgo'])) {
            return 'direct';
        }
        
        return 'neutral';
    }

    // ==================================== ✅ METODË NDIHMËSE =======================================================

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
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

// ====================✅ KRIJO DHE EKSPORTO INSTANCËN - KY RRESHT ËSHTË SHUMË I RËNDËSISHËM! =========================

const nluService = new NLUService();
module.exports = nluService;

console.log('🎉 NLU Service u ngarkua dhe u eksportua me sukses!');
