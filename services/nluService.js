// services/nluService.js
// ==================== ✅ NLU SERVICE - KUPTIMI I GJUHËS NATYRORE ====================
// 📝 DESKRIMI: Shërbim për kuptimin e thellë të gjuhës shqipe
// 🎯 QËLLIMI: Të kuptojë nuancat, ironinë, sarkazmin dhe qëllimin e vërtetë
// 🔧 AUTORI: ChatAI ALBA Team
// 📅 DATA: 12.10.2024
// ==================================================================================

const sentimentData = require('../data/sentimentData.json');
const albanianExpressions = require('../data/albanianExpressions.json');

class NLUService {
    constructor() {
        this.sentimentLexicon = this.loadSentimentLexicon();
        this.figurativeExpressions = this.loadFigurativeExpressions();
        this.contextBuffer = new Map();
        console.log('✅ NLU Service u inicializua me sukses');
    }

    // ============================ ✅ LOAD RESOURCES =============================
    
    loadSentimentLexicon() {
        // Lexikon bazë për analizën e sentimentit në shqip
        return {
            positive: ['mirë', 'bukur', 'shkëlqyeshëm', 'mrekullueshëm', 'fantastik', 'perfekt', 'mbreslënës'],
            negative: ['keq', 'tmerr', 'katastrof', 'i tmerrshëm', 'i shëmtuar', 'i dështuar'],
            intensifiers: ['shumë', 'jashtëzakonisht', 'tepër', 'pak', 'paksa'],
            negators: ['nuk', 's\'', 'jo', 'kurrë', 'asnjë'],
            ironyIndicators: ['sigurisht', 'natyrisht', 'pa dyshim', 'bëj fjalen']
        };
    }

    loadFigurativeExpressions() {
        // Shprehje figurativë tipike shqipe
        return {
            metaphors: [
                { pattern: /ra shiu/i, meaning: 'u prish diçka' },
                { pattern: /digjet toka/i, meaning: 'është shumë e nxehtë' },
                { pattern: /ngriva qiellin/i, meaning: 'u zemërua shumë' },
                { pattern: /fluturon në retë/i, meaning: 'është shumë i lumtur' }
            ],
            idioms: [
                { pattern: /i ra dhelpra/i, meaning: 'u sëmurë' },
                { pattern: /i doli miku/i, meaning: 'ia doli mirë' },
                { pattern: /i ra në qafë/i, meaning: 'e mori përsipër' }
            ],
            sarcasmPatterns: [
                /po.*sigurisht/i,
                /natyrisht.*që/i,
                /bëj fjalen.*shumë/i
            ]
        };
    }

    // ============================ ✅ ANALIZA BAZË E TEKSTIT =============================
    
    async analyzeText(text, userId = null) {
        try {
            console.log(`🔍 NLU Po analizon: "${text}"`);
            
            const analysis = {
                text: text,
                timestamp: new Date().toISOString(),
                
                // Analiza Sintaksore
                syntax: await this.analyzeSyntax(text),
                
                // Analiza Semantike
                semantics: await this.analyzeSemantics(text),
                
                // Analiza e Sentimentit
                sentiment: await this.analyzeSentiment(text),
                
                // Detektimi i Qëllimit
                intent: await this.detectIntent(text),
                
                // Nxjerrja e Entiteteve
                entities: await this.extractEntities(text),
                
                // Kuptimi i Nuancave
                nuances: await this.analyzeNuances(text),
                
                // Konteksti i Përdoruesit
                context: userId ? await this.getUserContext(userId) : null
            };

            console.log('✅ NLU Analysis Completed:', analysis.intent.type);
            return analysis;

        } catch (error) {
            console.error('❌ Gabim në analizën NLU:', error);
            return this.getDefaultAnalysis(text);
        }
    }

    // ============================ ✅ ANALIZA SINTAKSORE =============================
    
    async analyzeSyntax(text) {
        const words = text.split(/\s+/);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            avgWordLength: words.reduce((acc, word) => acc + word.length, 0) / words.length,
            hasQuestion: /[?]/.test(text),
            hasExclamation: /[!]/.test(text),
            structure: this.analyzeSentenceStructure(text)
        };
    }

    analyzeSentenceStructure(text) {
        if (text.endsWith('?')) return 'question';
        if (text.endsWith('!')) return 'exclamation';
        if (text.includes('|')) return 'learning_pattern';
        if (this.isCommand(text)) return 'command';
        return 'statement';
    }

    isCommand(text) {
        return text.startsWith('/');
    }

    // ============================ ✅ ANALIZA E SENTIMENTIT =============================
    
    async analyzeSentiment(text) {
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        let confidence = 0.5;
        let detectedIrony = false;

        // Analizë bazë e sentimentit
        words.forEach(word => {
            if (this.sentimentLexicon.positive.includes(word)) {
                score += 1;
                confidence += 0.1;
            }
            if (this.sentimentLexicon.negative.includes(word)) {
                score -= 1;
                confidence += 0.1;
            }
        });

        // Kontroll për ironi
        detectedIrony = this.detectIrony(text);

        // Përcaktimi i sentimentit final
        let sentiment = 'neutral';
        if (score > 1) sentiment = 'positive';
        if (score < -1) sentiment = 'negative';
        if (detectedIrony) sentiment = 'ironic';

        return {
            sentiment: sentiment,
            score: score,
            confidence: Math.min(confidence, 0.95),
            irony: detectedIrony,
            emotionalTone: this.detectEmotionalTone(text)
        };
    }

    detectIrony(text) {
        const lowerText = text.toLowerCase();
        
        // Kontroll për shprehje ironike
        for (let pattern of this.figurativeExpressions.sarcasmPatterns) {
            if (pattern.test(lowerText)) {
                return true;
            }
        }

        // Kontroll për mospërputhje mes fjalëve pozitive dhe kontekstit negativ
        const positiveWords = this.sentimentLexicon.positive.filter(word => 
            lowerText.includes(word)
        );
        
        const negativeWords = this.sentimentLexicon.negative.filter(word => 
            lowerText.includes(word)
        );

        // Nëse ka fjalë pozitive por konteksti është pyetës/negativ
        if (positiveWords.length > 0 && (text.includes('?') || negativeWords.length > 0)) {
            return true;
        }

        return false;
    }

    detectEmotionalTone(text) {
        const lowerText = text.toLowerCase();
        
        if (/(urgjent|shpejt|menjëherë)/i.test(lowerText)) return 'urgjent';
        if (/(ju lutem|të lutem|dashur)/i.test(lowerText)) return 'i lutur';
        if (/(faleminderit|rrofsh)/i.test(lowerText)) return 'mirënjohës';
        if (/(help|ndihmë|asistent)/i.test(lowerText)) return 'kërkesë ndihme';
        
        return 'neutral';
    }

    // ============================ ✅ DETEKTIMI I QËLLIMIT =============================
    
    async detectIntent(text) {
        const lowerText = text.toLowerCase().trim();
        
        // Qëllime të thjeshta
        if (this.isGreeting(lowerText)) {
            return {
                type: 'greeting',
                confidence: 0.9,
                parameters: { timeOfDay: this.getTimeOfDay() }
            };
        }

        if (this.isQuestion(lowerText)) {
            return {
                type: 'question',
                confidence: 0.85,
                parameters: { questionType: this.getQuestionType(lowerText) }
            };
        }

        if (this.isRequest(lowerText)) {
            return {
                type: 'request',
                confidence: 0.8,
                parameters: { requestType: this.getRequestType(lowerText) }
            };
        }

        if (this.isStatement(lowerText)) {
            return {
                type: 'statement',
                confidence: 0.7,
                parameters: { topic: this.extractTopic(lowerText) }
            };
        }

        // Qëllim i panjohur
        return {
            type: 'unknown',
            confidence: 0.3,
            parameters: {}
        };
    }

    isGreeting(text) {
        const greetings = [
            'përshëndetje', 'tungjatjeta', 'hello', 'hi', 'ciao', 
            'si je', 'si jeni', 'mirëmëngjes', 'mirëdita', 'mirëmbrëma'
        ];
        return greetings.some(greeting => text.includes(greeting));
    }

    isQuestion(text) {
        return text.includes('?') || 
               text.startsWith('si ') || 
               text.startsWith('ku ') ||
               text.startsWith('kur ') ||
               text.startsWith('pse ') ||
               text.startsWith('a ');
    }

    isRequest(text) {
        const requestWords = ['dua', 'dëshiroj', 'mund', 'ndihmë', 'help', 'ju lutem'];
        return requestWords.some(word => text.includes(word));
    }

    isStatement(text) {
        return !this.isQuestion(text) && !this.isRequest(text) && text.length > 5;
    }

    getQuestionType(text) {
        if (text.startsWith('si ')) return 'how';
        if (text.startsWith('ku ')) return 'where';
        if (text.startsWith('kur ')) return 'when';
        if (text.startsWith('pse ')) return 'why';
        if (text.startsWith('a ')) return 'yes_no';
        return 'general';
    }

    getRequestType(text) {
        if (text.includes('ndihmë') || text.includes('help')) return 'help';
        if (text.includes('informacion')) return 'information';
        if (text.includes('shpjegim')) return 'explanation';
        return 'general';
    }

    // ============================ ✅ NXJERRJA E ENTITETEVE =============================
    
    async extractEntities(text) {
        const entities = {
            persons: this.extractPersons(text),
            locations: this.extractLocations(text),
            organizations: this.extractOrganizations(text),
            temporal: this.extractTemporal(text),
            numerical: this.extractNumerical(text)
        };

        return entities;
    }

    extractPersons(text) {
        // Rregulla bazë për nxjerrjen e emrave të njerëzve
        const personPatterns = [
            /(profesor|dr|doktor)\s+([A-Z][a-zëç]+)/gi,
            /(zoti|zonja)\s+([A-Z][a-zëç]+)/gi
        ];
        
        const persons = [];
        personPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) persons.push(...matches);
        });

        return persons;
    }

    extractLocations(text) {
        const locations = ['Tiranë', 'Durrës', 'Shqipëri', 'Kosovë', 'Vlorë', 'Elbasan'];
        return locations.filter(location => 
            text.toLowerCase().includes(location.toLowerCase())
        );
    }

    extractOrganizations(text) {
        const organizations = ['UNIVERSITETI', 'SHKOLLA', 'KOMPANI', 'QEVERIA'];
        return organizations.filter(org => 
            text.toLowerCase().includes(org.toLowerCase())
        );
    }

    extractTemporal(text) {
        const temporal = [];
        const timePatterns = [
            /\d{1,2}:\d{2}/g, // Ora
            /(sot|nesër|dje)/gi, // Koha relative
            /\d{1,2}\s+(orë|minuta|ditë)/gi // Koha me njësi
        ];

        timePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) temporal.push(...matches);
        });

        return temporal;
    }

    extractNumerical(text) {
        const numbers = text.match(/\d+/g) || [];
        return numbers.map(num => parseInt(num));
    }

    // ============================ ✅ ANALIZA E NUANCAVE =============================
    
    async analyzeNuances(text) {
        return {
            figurativeLanguage: this.detectFigurativeLanguage(text),
            urgency: this.detectUrgency(text),
            politeness: this.analyzePoliteness(text),
            complexity: this.analyzeComplexity(text)
        };
    }

    detectFigurativeLanguage(text) {
        const lowerText = text.toLowerCase();
        const detected = [];

        // Kontroll për metafora
        this.figurativeExpressions.metaphors.forEach(meta => {
            if (meta.pattern.test(lowerText)) {
                detected.push({
                    type: 'metaphor',
                    expression: meta.pattern.source,
                    meaning: meta.meaning
                });
            }
        });

        // Kontroll për idioma
        this.figurativeExpressions.idioms.forEach(idiom => {
            if (idiom.pattern.test(lowerText)) {
                detected.push({
                    type: 'idiom',
                    expression: idiom.pattern.source,
                    meaning: idiom.meaning
                });
            }
        });

        return detected;
    }

    detectUrgency(text) {
        const urgentWords = ['shpejt', 'menjëherë', 'urgjent', 'tani', 'përpara'];
        const matches = urgentWords.filter(word => 
            text.toLowerCase().includes(word)
        );
        return matches.length > 0 ? 'high' : 'normal';
    }

    analyzePoliteness(text) {
        const politeWords = ['ju lutem', 'të lutem', 'faleminderit', 'rrofsh'];
        const matches = politeWords.filter(word => 
            text.toLowerCase().includes(word)
        );
        return matches.length > 0 ? 'polite' : 'neutral';
    }

    analyzeComplexity(text) {
        const words = text.split(/\s+/);
        const longWords = words.filter(word => word.length > 8);
        const ratio = longWords.length / words.length;
        
        if (ratio > 0.3) return 'high';
        if (ratio > 0.15) return 'medium';
        return 'low';
    }

    // ============================ ✅ ANALIZA SEMANTIKE =============================
    
    async analyzeSemantics(text) {
        return {
            topic: this.extractTopic(text),
            keywords: this.extractKeywords(text),
            semanticRelations: this.analyzeSemanticRelations(text)
        };
    }

    extractTopic(text) {
        const commonTopics = {
            'teknologji': ['kompjuter', 'telefon', 'internet', 'program'],
            'edukim': ['shkollë', 'universitet', 'student', 'mësim'],
            'shëndetësi': ['doktor', 'spital', 'sëmundje', 'shëndet'],
            'mot': ['temperaturë', 'shi', 'diell', 'erë']
        };

        const lowerText = text.toLowerCase();
        for (let [topic, keywords] of Object.entries(commonTopics)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return topic;
            }
        }

        return 'general';
    }

    extractKeywords(text) {
        const stopWords = ['dhe', 'ose', 'por', 'është', 'janë', 'ka'];
        const words = text.toLowerCase().split(/\s+/);
        return words.filter(word => 
            word.length > 3 && !stopWords.includes(word)
        );
    }

    analyzeSemanticRelations(text) {
        // Analizë bazë e marrëdhënieve semantike
        return {
            hasCauseEffect: /(sepse|për shkak|si rezultat)/i.test(text),
            hasComparison: /(më shumë|më pak|si|nga)/i.test(text),
            hasTemporal: /(para|pas|gjatë|kur)/i.test(text)
        };
    }

    // ============================ ✅ MENAXHIMI I KONTEKSTIT =============================
    
    async getUserContext(userId) {
        // Për momentin kthejmë kontekst bazë
        // Në të ardhmen do të integrohet me Context Memory
        return {
            previousInteraction: null,
            userPreferences: {},
            conversationHistory: [],
            learningStyle: 'neutral'
        };
    }

    async updateUserContext(userId, interaction) {
        // Përditësimi i kontekstit të përdoruesit
        if (!this.contextBuffer.has(userId)) {
            this.contextBuffer.set(userId, {
                interactions: [],
                preferences: {},
                lastUpdated: new Date()
            });
        }

        const userContext = this.contextBuffer.get(userId);
        userContext.interactions.push(interaction);
        userContext.lastUpdated = new Date();

        // Ruaj kontekstin (në të ardhmen në database)
        this.contextBuffer.set(userId, userContext);
    }

    // ============================ ✅ METODA NDIHMËSE =============================
    
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    getDefaultAnalysis(text) {
        return {
            text: text,
            timestamp: new Date().toISOString(),
            syntax: { wordCount: text.split(/\s+/).length, sentenceCount: 1 },
            semantics: { topic: 'unknown', keywords: [] },
            sentiment: { sentiment: 'neutral', score: 0, confidence: 0.5 },
            intent: { type: 'unknown', confidence: 0.3 },
            entities: { persons: [], locations: [], organizations: [] },
            nuances: { figurativeLanguage: [], urgency: 'normal' }
        };
    }

    // ============================ ✅ METODA TESTUESE =============================
    
    async testNLU() {
        const testCases = [
            "Përshëndetje! Si je?",
            "Më ndihmo të gjej informacion për Shqipërinë",
            "Po shiu po i bie, shumë bukur!",
            "Sa është 2 + 2?",
            "Dua të di motin për nesër"
        ];

        console.log('🧪 DUKE TESTUAR NLU SERVICE...');
        
        for (let testCase of testCases) {
            const analysis = await this.analyzeText(testCase);
            console.log(`📝 Test: "${testCase}"`);
            console.log(`🎯 Qëllimi: ${analysis.intent.type} (${analysis.intent.confidence})`);
            console.log(`😊 Sentimenti: ${analysis.sentiment.sentiment}`);
            console.log('---');
        }
    }
}

// ============================ ✅ EKSPORTIMI =============================

module.exports = new NLUService();

// ============================ ✅ INICIALIZIMI AUTOMATIK =============================

console.log('🚀 NLU Service u ngarkua me sukses!');
console.log('💡 Përdorim: const nluService = require("./services/nluService")');
