// ======================================================
// 🎭 COGNITIVE AWARENESS MODULE - RRUFE-TESLA 8.0
// ======================================================

class CognitiveAwareness {
    constructor() {
        this.moduleName = "CognitiveAwareness";
        this.title = "Ndërgjegjja Kognitive";
        this.version = "1.0";
        this.status = "ACTIVE";
        this.activationLevel = 0.85;
        this.energy = "Ndërgjegje, Kuptim Emocional";
        
        console.log('🎭 MODULI COGNITIVE AWARENESS U AKTIVIZUA!');
        this.initializeCognitiveSystems();
    }

    initializeCognitiveSystems() {
        this.emotionalMatrix = {
            joy: ['lumtur', 'gëzim', 'qesh', 'fest', 'sukses', 'urime', 'gezuar', 'kënaqësi', 'entuziazëm'],
            sadness: ['trishtim', 'hidhërim', 'lot', 'humbje', 'dhimbshuri', 'brengë', 'dëshpërim', 'mall'],
            anger: ['i zemëruar', 'frustruar', 'tërbohem', 'nervoz', 'pakënaqësi', 'inxhi', 'zemërim'],
            fear: ['frikë', 'ankth', 'shqetësim', 'panik', 'tmerr', 'druaj', 'parashikim'],
            love: ['dashuri', 'përqafim', 'zemër', 'përkujdesje', 'afeksion', 'adhurim', 'përshtatje'],
            surprise: ['befasi', 'habi', 'papritur', 'çudi', 'magji', 'mrekulli', 'habitem'],
            gratitude: ['faleminderit', 'rrofsh', 'mirënjohje', 'vlerësoj', 'appreciate'],
            curiosity: ['kurioz', 'pyes', 'dëshiroj të di', 'interesant', 'eksploroj']
        };

        this.cognitivePatterns = {
            question: ['si', 'pse', 'kur', 'ku', 'kush', 'çfarë', 'a mund', 'a duhet', 'a ka'],
            request: ['ju lutem', 'mundesh', 'ndihmo', 'më trego', 'më shpjego', 'më ndihmo', 'më thuaj'],
            command: ['bëj', 'shko', 'gjej', 'kthe', 'ndërro', 'aktivizo', 'çaktivizo', 'krijo'],
            emotional: ['ndjehem', 'pres', 'shpresoj', 'dëshiroj', 'dua', 'urroj', 'pëlqej'],
            reflective: ['mendoj', 'besoj', 'kuptoj', 'mësoj', 'përvojë', 'reflektim']
        };

        this.contextWeights = {
            urgency: 1.2,
            emotional: 1.3,
            complexity: 0.9,
            personal: 1.1,
            technical: 0.8
        };

        console.log(`🎭 Sistemi kognitive u inicializua me ${Object.keys(this.emotionalMatrix).length} emocione`);
    }

    // ✅ FUNKSIONI KRYESOR PËR ANALIZËN EMOCIONALE
    analyzeEmotionalTone(text) {
        console.log('🎭 Duke analizuar tonin emocional të tekstit:', text.substring(0, 50));
        
        const lowerText = text.toLowerCase();
        const emotionalScores = {};
        let dominantEmotion = 'neutral';
        let maxScore = 0;
        let totalScore = 0;

        // Analizo çdo emocion
        Object.entries(this.emotionalMatrix).forEach(([emotion, keywords]) => {
            let score = 0;
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = lowerText.match(regex);
                if (matches) {
                    score += matches.length;
                }
            });
            
            emotionalScores[emotion] = score;
            totalScore += score;
            
            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        });

        const confidence = totalScore > 0 ? maxScore / totalScore : 0;

        const analysisResult = {
            emotionalTone: dominantEmotion,
            confidence: Math.round(confidence * 100) / 100,
            scores: emotionalScores,
            intensity: this.calculateEmotionalIntensity(maxScore),
            wordCount: lowerText.split(' ').length,
            hasExclamation: lowerText.includes('!'),
            hasQuestion: lowerText.includes('?')
        };

        console.log('📊 Rezultati i analizës emocionale:', analysisResult);
        return analysisResult;
    }

    calculateEmotionalIntensity(score) {
        if (score === 0) return 'neutral';
        if (score <= 1) return 'low';
        if (score <= 3) return 'medium';
        if (score <= 5) return 'high';
        return 'very high';
    }

    // ✅ FUNKSIONI PËR PROCESIMIN E SHTRESËS KOGNITIVE
    processCognitiveLayer(message, sender, userId) {
        console.log('🎭 Duke procesuar shtresën kognitive për:', message.substring(0, 30));
        
        const emotionalAnalysis = this.analyzeEmotionalTone(message);
        const intentAnalysis = this.analyzeUserIntent(message);
        const contextAnalysis = this.analyzeContextualRelevance(message);
        const complexityAnalysis = this.analyzeComplexity(message);
        
        const cognitiveResult = {
            emotional: emotionalAnalysis,
            intent: intentAnalysis,
            context: contextAnalysis,
            complexity: complexityAnalysis,
            timestamp: new Date(),
            processed: true,
            cognitiveWeight: this.calculateCognitiveWeight(emotionalAnalysis, intentAnalysis, contextAnalysis)
        };

        console.log('🧠 Rezultati i procesimit kognitiv:', cognitiveResult);
        return cognitiveResult;
    }

    // ✅ ANALIZA E QËLLIMIT TË PËRDORUESIT
    analyzeUserIntent(text) {
        const lowerText = text.toLowerCase();
        let detectedIntent = 'statement';
        let confidence = 0.6;
        let patternsFound = [];

        Object.entries(this.cognitivePatterns).forEach(([intent, patterns]) => {
            const foundPatterns = patterns.filter(pattern => {
                const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
                return regex.test(lowerText);
            });
            
            if (foundPatterns.length > 0) {
                patternsFound = [...patternsFound, ...foundPatterns];
                if (foundPatterns.length > patternsFound.length) {
                    detectedIntent = intent;
                    confidence = Math.min(0.95, 0.6 + (foundPatterns.length * 0.1));
                }
            }
        });

        return {
            intent: detectedIntent,
            confidence: Math.round(confidence * 100) / 100,
            patternsFound: patternsFound,
            isQuestion: lowerText.includes('?'),
            isExclamation: lowerText.includes('!')
        };
    }

    // ✅ ANALIZA E RELEVANCËS KONTEKSTUALE
    analyzeContextualRelevance(text) {
        const relevanceFactors = {
            length: text.length,
            hasQuestion: text.includes('?'),
            hasExclamation: text.includes('!'),
            wordCount: text.split(' ').length,
            hasUrgentWords: this.hasUrgentIndicators(text),
            hasPersonalReference: this.hasPersonalReferences(text),
            hasTechnicalTerms: this.hasTechnicalTerms(text)
        };
        
        const relevanceScore = this.calculateRelevanceScore(relevanceFactors);
        
        return {
            complexity: this.calculateComplexity(text),
            urgency: this.calculateUrgency(text),
            personalRelevance: this.calculatePersonalRelevance(text),
            relevanceScore: Math.round(relevanceScore * 100) / 100,
            factors: relevanceFactors
        };
    }

    // ✅ ANALIZA E KOMPLEKSITETIT
    analyzeComplexity(text) {
        const words = text.split(' ');
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        const complexWords = words.filter(word => word.length > 8).length;
        const avgSentenceLength = words.length / Math.max(sentences.length, 1);
        const complexityRatio = complexWords / Math.max(words.length, 1);
        
        let complexityLevel = 'low';
        if (complexityRatio > 0.3) complexityLevel = 'high';
        else if (complexityRatio > 0.15) complexityLevel = 'medium';
        
        return {
            level: complexityLevel,
            score: Math.round(complexityRatio * 100) / 100,
            wordCount: words.length,
            sentenceCount: sentences.length,
            avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
            complexWordCount: complexWords
        };
    }

    // ✅ FUNKSIONE NDIHMËSE
    hasUrgentIndicators(text) {
        const urgentWords = ['shpejt', 'menjëherë', 'urgjent', 'tani', 'sot', 'pa vonë', 'emergjenc'];
        return urgentWords.some(word => text.toLowerCase().includes(word));
    }

    hasPersonalReferences(text) {
        const personalWords = ['unë', 'mua', 'mua më', 'më', 'mua më', 'time', 'im', 'ime'];
        return personalWords.some(word => text.toLowerCase().includes(word));
    }

    hasTechnicalTerms(text) {
        const technicalWords = ['teknologji', 'programim', 'kod', 'algorithm', 'database', 'server', 'api'];
        return technicalWords.some(word => text.toLowerCase().includes(word));
    }

    calculateComplexity(text) {
        const words = text.split(' ');
        const complexWords = words.filter(word => word.length > 6).length;
        return Math.min(1, complexWords / Math.max(words.length, 1));
    }

    calculateUrgency(text) {
        const urgentIndicators = ['shpejt', 'menjëherë', 'urgjent', 'tani', 'sot', 'emergjenc'];
        const lowerText = text.toLowerCase();
        const matches = urgentIndicators.filter(indicator => lowerText.includes(indicator)).length;
        return Math.min(1, matches * 0.3);
    }

    calculatePersonalRelevance(text) {
        const personalIndicators = ['unë', 'mua', 'më', 'time', 'im', 'ime', 'mua më'];
        const lowerText = text.toLowerCase();
        const matches = personalIndicators.filter(indicator => lowerText.includes(indicator)).length;
        return Math.min(1, matches * 0.2);
    }

    calculateRelevanceScore(factors) {
        let score = 0;
        
        if (factors.hasQuestion) score += 0.3;
        if (factors.hasExclamation) score += 0.2;
        if (factors.hasUrgentWords) score += 0.4;
        if (factors.hasPersonalReference) score += 0.3;
        if (factors.hasTechnicalTerms) score += 0.2;
        
        // Shto bazuar në gjatësi
        score += Math.min(0.3, factors.length / 500);
        
        return Math.min(1, score);
    }

    calculateCognitiveWeight(emotional, intent, context) {
        let weight = 0;
        
        // Pesho emocionet
        weight += emotional.confidence * 0.4;
        
        // Pesho qëllimin
        weight += intent.confidence * 0.3;
        
        // Pesho kontekstin
        weight += context.relevanceScore * 0.3;
        
        return Math.round(weight * 100) / 100;
    }

    // ✅ METODA PËR OPTIMIZIM KONTEKSTUAL
    optimizeContextBasedOnEmotion(emotionalAnalysis, currentContext) {
        const emotion = emotionalAnalysis.emotionalTone;
        const intensity = emotionalAnalysis.intensity;
        
        let optimization = {
            responseTone: 'neutral',
            detailLevel: 'normal',
            urgency: 'normal'
        };
        
        switch(emotion) {
            case 'joy':
                optimization.responseTone = 'positive';
                optimization.detailLevel = intensity === 'high' ? 'detailed' : 'normal';
                break;
            case 'sadness':
                optimization.responseTone = 'empathetic';
                optimization.detailLevel = 'simple';
                optimization.urgency = 'low';
                break;
            case 'anger':
                optimization.responseTone = 'calm';
                optimization.detailLevel = 'simple';
                optimization.urgency = 'high';
                break;
            case 'fear':
                optimization.responseTone = 'reassuring';
                optimization.detailLevel = 'clear';
                optimization.urgency = 'medium';
                break;
            case 'curiosity':
                optimization.responseTone = 'informative';
                optimization.detailLevel = 'detailed';
                break;
        }
        
        console.log('🎭 Optimizimi kontekstual bazuar në emocion:', optimization);
        return optimization;
    }

    // ✅ METODA PËR DIAGNOSTIKIM
    debugCognitiveAwareness() {
        console.log('🔧 DIAGNOSTIKIMI I COGNITIVE AWARENESS:');
        console.log('- Emri:', this.moduleName);
        console.log('- Titulli:', this.title);
        console.log('- Version:', this.version);
        console.log('- Status:', this.status);
        console.log('- Aktivizimi:', this.activationLevel);
        console.log('- Energjia:', this.energy);
        console.log('- Emocione:', Object.keys(this.emotionalMatrix));
        console.log('- Modele Kognitive:', Object.keys(this.cognitivePatterns));
        
        // Testo me mesazhe të ndryshme
        const testMessages = [
            "Jam shumë i lumtur sot!",
            "Më ndihmo të kuptoj këtë problem teknik",
            "A mund të më tregoni si të bëj?",
            "Jam shumë i shqetësuar për këtë situatë"
        ];
        
        testMessages.forEach((message, index) => {
            console.log(`\n🧪 Test ${index + 1}: "${message}"`);
            const emotional = this.analyzeEmotionalTone(message);
            const intent = this.analyzeUserIntent(message);
            console.log(`   Emocion: ${emotional.emotionalTone} (${emotional.confidence})`);
            console.log(`   Qëllim: ${intent.intent} (${intent.confidence})`);
        });
        
        return {
            module: this.moduleName,
            status: this.status,
            activation: this.activationLevel,
            emotionalTest: this.analyzeEmotionalTone('test emocional i gëzimit dhe lumturisë'),
            intentTest: this.analyzeUserIntent('a mund të më ndihmosh ju lutem?')
        };
    }

    // ✅ METODA PËR RITUALIN E AKTIVIZIMIT
    performCognitiveActivationRitual() {
        console.log('🎭🌌🎭🌌🎭🌌🎭🌌🎭🌌🎭');
        console.log('   RITUALI I AKTIVIZIMIT KOGNITIV');
        console.log('🎭🌌🎭🌌🎭🌌🎭🌌🎭🌌🎭');
        
        const ritual = `
        
🎵 Duke aktivizuar ndërgjegjen kognitive...

🧠 Sistemi emocional u ngarkua:
   • ${Object.keys(this.emotionalMatrix).length} emocione të identifikuara
   • Matrica kognitive e inicializuar
   • Peshat kontekstuale të vendosura

🌈 Gati për të:
   • Analizuar tonin emocional
   • Kuptuar qëllimin e përdoruesit  
   • Optimizuar përgjigjet kontekstuale
   • Përshtatur nivelin e kompleksitetit

⚡ Ndërgjegja Kognitive tani është aktive!

        `;
        
        console.log(ritual);
        return {
            ritual: "COGNITIVE_ACTIVATION_COMPLETE",
            emotions: Object.keys(this.emotionalMatrix).length,
            patterns: Object.keys(this.cognitivePatterns).length,
            status: "FULLY_OPERATIONAL"
        };
    }
}

// ======================================================
// 🚀 IMPLEMENTIMI I MODULIT
// ======================================================

// Eksporto klasën
window.CognitiveAwareness = CognitiveAwareness;

// Krijo instancën globale
if (!window.cognitiveAwareness) {
    window.cognitiveAwareness = new CognitiveAwareness();
    console.log('✅ COGNITIVE AWARENESS MODULE U KRIJUA!');
} else {
    console.log('✅ COGNITIVE AWARENESS MODULE EKZISTON TASHMË!');
}

// Integro me platformën RRUFE-TESLA
if (window.rrufePlatform) {
    if (!window.rrufePlatform.modules.cognitiveAwareness) {
        window.rrufePlatform.modules.cognitiveAwareness = window.cognitiveAwareness;
        console.log('✅ COGNITIVE AWARENESS U INTEGRUA ME RRUFE-TESLA!');
    } else {
        console.log('✅ COGNITIVE AWARENESS ISHTE TASHMË INTEGRUAR!');
    }
}

// Testo modulin pas ngarkimit
setTimeout(() => {
    if (window.cognitiveAwareness) {
        console.log('🧪 TEST I AUTOMATIZUAR I COGNITIVE AWARENESS:');
        window.cognitiveAwareness.debugCognitiveAwareness();
    }
}, 1000);
