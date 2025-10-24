// ======================= COGNITIVE AWARENESS LAYER =======================
// 🧠 MODULI: CognitiveAwareness - Shtresa e Vetëdijes Kognitive
// 📍 RRUFE 4.0 - Integrim mbi TemporalContext + BioNeuralNetwork
// =========================================================================

console.log('🎭 COGNITIVE AWARENESS LAYER u ngarkua!');

class CognitiveAwareness {
    constructor(temporalContext, bioNeuralNetwork, contextMemory) {
        this.temporalContext = temporalContext;
        this.bioNeuralNetwork = bioNeuralNetwork;
        this.contextMemory = contextMemory;
        
        this.userStates = new Map();          // 🎯 Gjendjet e përdoruesve
        this.emotionalPatterns = new Map();   // ❤️ Modelet emocionale
        this.behavioralModels = new Map();    // 🧠 Modelet e sjelljes
        this.selfOptimization = new Map();    // ⚡ Vetë-optimizimi
        this.crossSessionMemory = new Map();  // 💾 Kujtesë ndër-sesionale
        
        console.log('🎭 CognitiveAwareness u inicializua!');
        this.initializeCognitiveProcesses();
    }

    // ✅ INICIALIZO PROCESET KOGNITIVE
    initializeCognitiveProcesses() {
        this.cognitiveProcesses = {
            emotionalAnalysis: true,      // ❤️ Analizë emocionale
            intentRecognition: true,      // 🎯 Njohje qëllimesh
            behavioralPrediction: true,   // 🔮 Parashikim sjelljeje
            selfOptimization: true,       // ⚡ Vetë-optimizim
            crossSessionMemory: true      // 💾 Kujtesë ndër-sesionale
        };
        
        console.log('🔄 Inicializuam proceset kognitive:', Object.keys(this.cognitiveProcesses).length);
    }

    // ✅ ANALIZË EMOCIONALE E AVANCUAR
    analyzeEmotionalState(message, userHistory = []) {
        const emotionalMarkers = {
            positive: ['faleminderit', 'bukur', 'shkëlqyeshëm', 'përkryer', 'rrofsh', 'urime', 'bravo', 'suksese'],
            negative: ['problem', 'gabim', 'keq', 'mërzitur', 'shqetësuar', 'dështim', 'frustruar', 'i hidhëruar'],
            curious: ['pse', 'si', 'kur', 'ku', 'a mund', 'dëshiroj', 'pyes', 'interesant'],
            urgent: ['tani', 'menjëherë', 'shpejt', 'urgjent', 'rëndësi', 'emergjencë', 'kritike'],
            confused: ['nuk kuptoj', 'konfuz', 'paqartë', 'dyshim', 'pyetje']
        };

        let emotionalState = {
            tone: 'neutral',
            intensity: 0.5,
            confidence: 0.7,
            markers: [],
            sentimentScore: 0
        };

        // Analizo marker-at emocionalë
        Object.entries(emotionalMarkers).forEach(([emotion, markers]) => {
            markers.forEach(marker => {
                if (message.toLowerCase().includes(marker)) {
                    emotionalState.markers.push({ emotion, marker });
                    
                    // Përcakto tonin bazë
                    if (emotionalState.tone === 'neutral') {
                        emotionalState.tone = emotion;
                    }
                    
                    // Rrit intensitetin
                    emotionalState.intensity += 0.1;
                    
                    // Ndrysho sentiment score
                    if (emotion === 'positive') emotionalState.sentimentScore += 1;
                    if (emotion === 'negative') emotionalState.sentimentScore -= 1;
                }
            });
        });

        // Analizo gjatësinë dhe strukturën e mesazhit
        if (message.length > 100) emotionalState.intensity += 0.1;
        if (message.includes('!')) emotionalState.intensity += 0.2;
        if (message.includes('?')) {
            emotionalState.tone = emotionalState.tone === 'neutral' ? 'curious' : emotionalState.tone;
            emotionalState.intensity += 0.1;
        }
        
        // Analizo historinë e përdoruesit për kontekst
        if (userHistory.length > 0) {
            const recentTone = this.analyzeHistoricalTone(userHistory);
            if (recentTone !== 'neutral') {
                emotionalState.tone = recentTone;
                emotionalState.confidence += 0.1;
            }
        }

        emotionalState.intensity = Math.min(emotionalState.intensity, 1.0);
        emotionalState.confidence = Math.min(emotionalState.confidence, 0.95);
        
        console.log('❤️ Analizë emocionale:', emotionalState);
        return emotionalState;
    }

    // ✅ ANALIZË E TONIT HISTORIK
    analyzeHistoricalTone(userHistory) {
        const recentMessages = userHistory.slice(-5); // 5 mesazhet e fundit
        let positiveCount = 0;
        let negativeCount = 0;
        let curiousCount = 0;

        recentMessages.forEach(msg => {
            const tone = this.analyzeEmotionalState(msg.message).tone;
            if (tone === 'positive') positiveCount++;
            if (tone === 'negative') negativeCount++;
            if (tone === 'curious') curiousCount++;
        });

        if (positiveCount > negativeCount && positiveCount > curiousCount) return 'positive';
        if (negativeCount > positiveCount && negativeCount > curiousCount) return 'negative';
        if (curiousCount > positiveCount && curiousCount > negativeCount) return 'curious';
        
        return 'neutral';
    }

    // ✅ NJOHJE E QËLLIMEVE TË PËRDORUESIT
    detectUserIntent(message, conversationContext) {
        const intentPatterns = {
            informationSeeking: ['si', 'ku', 'kur', 'pse', 'kush', 'çfarë', 'a mund', 'a di'],
            taskCompletion: ['bëj', 'krijo', 'gjej', 'llogarit', 'trego', 'ndërto', 'gjenero'],
            socialInteraction: ['si je', 'përshëndetje', 'faleminderit', 'mirupafshim', 'mirëmëngjes'],
            problemSolving: ['problem', 'gabim', 'ndihmë', 'dështim', 'nuk funksionon', 'keq', 'prish'],
            creativeRequest: ['imagjino', 'krijo', 'shpik', 'dizjano', 'përshkruaj', 'përfytyro']
        };

        let detectedIntent = {
            primary: 'general',
            secondary: [],
            confidence: 0.6,
            triggers: []
        };

        Object.entries(intentPatterns).forEach(([intent, patterns]) => {
            patterns.forEach(pattern => {
                if (message.toLowerCase().includes(pattern)) {
                    detectedIntent.triggers.push(pattern);
                    
                    if (detectedIntent.primary === 'general') {
                        detectedIntent.primary = intent;
                    } else if (!detectedIntent.secondary.includes(intent)) {
                        detectedIntent.secondary.push(intent);
                    }
                    detectedIntent.confidence += 0.1;
                }
            });
        });

        // Rrit besueshmërinë bazuar në kontekst
        if (conversationContext && conversationContext.length > 0) {
            const recentIntent = this.analyzeConversationContext(conversationContext);
            if (recentIntent === detectedIntent.primary) {
                detectedIntent.confidence += 0.2;
            }
        }

        detectedIntent.confidence = Math.min(detectedIntent.confidence, 0.95);
        
        console.log('🎯 Qëllimi i zbuluar:', detectedIntent);
        return detectedIntent;
    }

    // ✅ ANALIZË E KONTEKSTIT TË BISEDËS
    analyzeConversationContext(conversationContext) {
        if (conversationContext.length === 0) return 'general';
        
        const recentIntents = conversationContext.slice(0, 3).map(entry => 
            this.detectUserIntent(entry.message, []).primary
        );
        
        // Gjej intent-in më të shpeshtë
        const intentCount = {};
        recentIntents.forEach(intent => {
            intentCount[intent] = (intentCount[intent] || 0) + 1;
        });
        
        return Object.keys(intentCount).reduce((a, b) => 
            intentCount[a] > intentCount[b] ? a : b
        );
    }

    // ✅ MODELIM I SJELLJES SË PËRDORUESIT
    modelUserBehavior(userId, currentInteraction, historicalData = []) {
        const behaviorModel = {
            userId: userId,
            interactionPatterns: [],
            preferredCommunicationStyle: 'balanced',
            responseTimeExpectation: 'normal',
            topicPreferences: new Set(),
            emotionalBaseline: 'neutral',
            expertiseLevel: 'beginner',
            engagementLevel: 'medium',
            lastUpdated: new Date()
        };

        // Analizo modelet e ndërveprimit
        if (historicalData.length > 0) {
            const recentInteractions = historicalData.slice(-10);
            
            // Gjej preferencat e temave
            recentInteractions.forEach(interaction => {
                const keywords = this.contextMemory.extractKeywords(interaction.message);
                keywords.forEach(keyword => behaviorModel.topicPreferences.add(keyword));
            });

            // Analizo stilin e komunikimit
            const messageLengths = recentInteractions.map(i => i.message.length);
            const avgLength = messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length;
            
            if (avgLength > 100) behaviorModel.preferredCommunicationStyle = 'detailed';
            if (avgLength < 30) behaviorModel.preferredCommunicationStyle = 'concise';

            // Analizo nivelin e ekspertizës
            const technicalKeywords = ['kod', 'programim', 'algorithm', 'API', 'database'];
            const technicalCount = recentInteractions.filter(interaction =>
                technicalKeywords.some(keyword => interaction.message.toLowerCase().includes(keyword))
            ).length;
            
            if (technicalCount > 3) behaviorModel.expertiseLevel = 'advanced';
            else if (technicalCount > 0) behaviorModel.expertiseLevel = 'intermediate';

            // Analizo nivelin e angazhimit
            const engagementScore = recentInteractions.length / 10; // Normalizo
            if (engagementScore > 0.7) behaviorModel.engagementLevel = 'high';
            if (engagementScore < 0.3) behaviorModel.engagementLevel = 'low';
        }

        // Përditëso modelin aktual
        if (this.behavioralModels.has(userId)) {
            const existingModel = this.behavioralModels.get(userId);
            behaviorModel.interactionPatterns = [...existingModel.interactionPatterns, currentInteraction];
            
            // Mbaj vetëm 20 ndërveprimet e fundit
            if (behaviorModel.interactionPatterns.length > 20) {
                behaviorModel.interactionPatterns = behaviorModel.interactionPatterns.slice(-20);
            }
        } else {
            behaviorModel.interactionPatterns = [currentInteraction];
        }

        this.behavioralModels.set(userId, behaviorModel);
        console.log('🧠 Model i sjelljes u përditësua për:', userId);
        return behaviorModel;
    }

    // ✅ KUJTESË NDËR-SESIONALE
    enableCrossSessionMemory(userId) {
        if (!this.crossSessionMemory) {
            this.crossSessionMemory = new Map();
        }

        let crossSessionData;
        
        if (this.crossSessionMemory.has(userId)) {
            crossSessionData = this.crossSessionMemory.get(userId);
            crossSessionData.sessionCount += 1;
            crossSessionData.lastSession = new Date();
        } else {
            crossSessionData = {
                userId: userId,
                learnedPreferences: new Set(),
                behavioralPatterns: [],
                emotionalHistory: [],
                importantTopics: new Set(),
                sessionCount: 1,
                totalInteractionTime: 0,
                firstSession: new Date(),
                lastSession: new Date()
            };
        }

        this.crossSessionMemory.set(userId, crossSessionData);
        console.log('💾 Kujtesa ndër-sesionale u aktivizua/përditësua për:', userId);
        return crossSessionData;
    }

    // ✅ VETË-OPTIMIZIM I SISTEMIT
    selfOptimizeSystem(userFeedback = null) {
        const optimizationMetrics = {
            responseAccuracy: 0.8,
            userSatisfaction: 0.7,
            responseTime: 0.9,
            contextualUnderstanding: 0.75,
            emotionalIntelligence: 0.6
        };

        if (userFeedback) {
            // Përditëso metrikat bazuar në feedback
            if (userFeedback.positive) {
                optimizationMetrics.userSatisfaction += 0.05;
                optimizationMetrics.responseAccuracy += 0.03;
            }
            if (userFeedback.negative) {
                optimizationMetrics.userSatisfaction -= 0.05;
                optimizationMetrics.emotionalIntelligence += 0.02; // Mëso nga gabimet
            }
        }

        // Optimizo parametrat e BioNeuralNetwork
        if (this.bioNeuralNetwork) {
            this.bioNeuralNetwork.neuralActivity = Math.min(
                this.bioNeuralNetwork.neuralActivity + 0.02, 
                0.95
            );
        }

        // Optimizo Temporal Context parameters
        if (this.temporalContext) {
            // Mund të optimizohet koha e ruajtjes së kontekstit bazuar në metrikat
        }

        this.selfOptimization.set('last_optimization', {
            timestamp: new Date(),
            metrics: optimizationMetrics,
            changesApplied: true
        });

        console.log('⚡ Vetë-optimizimi u krye:', optimizationMetrics);
        return optimizationMetrics;
    }

    // ✅ PROCESIM I PLOTË KOGNITIV
    processCognitiveLayer(message, sender, userId = 'default') {
        console.log('🎭 DUKE PROÇESUAR SHTRESËN KOGNITIVE:');
        
        // 1. Analizë emocionale
        const emotionalState = this.analyzeEmotionalState(message);
        
        // 2. Zbulim qëllimi
        const userIntent = this.detectUserIntent(message, this.contextMemory.conversationContext);
        
        // 3. Modelim sjelljeje
        const behaviorModel = this.modelUserBehavior(userId, {
            message,
            sender,
            timestamp: new Date(),
            emotionalState,
            intent: userIntent
        }, this.contextMemory.conversationContext);
        
        // 4. Aktivizo kujtesën ndër-sesionale
        const crossSessionData = this.enableCrossSessionMemory(userId);
        
        // 5. Kthe të dhënat kognitive të integruara
        const cognitiveData = {
            emotionalState,
            userIntent, 
            behaviorModel,
            crossSessionData,
            timestamp: new Date(),
            cognitiveConfidence: this.calculateCognitiveConfidence(emotionalState, userIntent)
        };
        
        console.log('🎭 Procesimi kognitiv u kompletua për:', userId);
        return cognitiveData;
    }

    // ✅ LLOGARITJE E BESUESHMËRISË KOGNITIVE
    calculateCognitiveConfidence(emotionalState, userIntent) {
        let confidence = 0.7; // Default
        
        // Rrit besueshmërinë për analiza të forta emocionale
        if (emotionalState.intensity > 0.7) confidence += 0.1;
        if (emotionalState.confidence > 0.8) confidence += 0.1;
        
        // Rrit besueshmërinë për qëllime të qarta
        if (userIntent.confidence > 0.8) confidence += 0.1;
        if (userIntent.primary !== 'general') confidence += 0.1;
        
        return Math.min(confidence, 0.95);
    }

    // ✅ MARRJE E VENDIMEVE KOGNITIVE
    makeCognitiveDecision(cognitiveData, availableOptions) {
        const decision = {
            selectedOption: null,
            confidence: 0,
            reasoning: [],
            alternatives: []
        };

        // Bazuar në gjendjen emocionale
        if (cognitiveData.emotionalState.tone === 'urgent') {
            decision.reasoning.push('Përdoruesi kërkon përgjigje të shpejtë');
            decision.selectedOption = availableOptions.find(opt => opt.speed === 'fast') || availableOptions[0];
        }
        
        if (cognitiveData.emotionalState.tone === 'curious') {
            decision.reasoning.push('Përdoruesi është kurioz - ofro shpjegime të hollësishme');
            decision.selectedOption = availableOptions.find(opt => opt.detail === 'high') || availableOptions[0];
        }

        // Bazuar në qëllimin
        if (cognitiveData.userIntent.primary === 'informationSeeking') {
            decision.reasoning.push('Përdoruesi kërkon informacion - ofro përgjigje të detajuara');
        }

        // Bazuar në modelin e sjelljes
        if (cognitiveData.behaviorModel.preferredCommunicationStyle === 'detailed') {
            decision.reasoning.push('Përdoruesi preferon komunikim të detajuar');
        }

        decision.confidence = cognitiveData.cognitiveConfidence;
        decision.alternatives = availableOptions.filter(opt => opt !== decision.selectedOption);

        return decision;
    }

    // ✅ DEBUG COGNITIVE AWARENESS
    debugCognitiveAwareness() {
        console.log('🔍 DEBUG COGNITIVE AWARENESS:');
        console.log('- Përdorues të monitoruar:', this.behavioralModels.size);
        console.log('- Procese kognitive:', Object.keys(this.cognitiveProcesses).length);
        console.log('- Optimizime të aplikuara:', this.selfOptimization.size);
        console.log('- Kujtesë ndër-sesionale:', this.crossSessionMemory?.size || 0);
        
        // Shfaq modelet e fundit të sjelljes
        const recentModels = Array.from(this.behavioralModels.entries()).slice(0, 3);
        console.log('- Modelet e fundit të sjelljes:');
        recentModels.forEach(([userId, model]) => {
            console.log(`  👤 ${userId}: ${model.preferredCommunicationStyle} style | ${model.expertiseLevel} level`);
        });

        // Shfaq optimizimet e fundit
        const lastOptimization = this.selfOptimization.get('last_optimization');
        if (lastOptimization) {
            console.log('- Optimizimi i fundit:', lastOptimization.timestamp);
            console.log('  Metrikat:', lastOptimization.metrics);
        }
    }
}

// Eksporto për përdorim global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CognitiveAwareness;
} else {
    window.CognitiveAwareness = CognitiveAwareness;
}

console.log('🎭 COGNITIVE AWARENESS LAYER u inicializua me sukses!');
