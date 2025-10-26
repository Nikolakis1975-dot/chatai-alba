// ======================================================
// 🎭 COGNITIVE AWARENESS MODULE - RRUFE-TESLA
// ======================================================

class CognitiveAwareness {
    constructor(temporalContext, bioNeuralNetwork, contextMemory) {
        this.temporalContext = temporalContext;
        this.bioNeuralNetwork = bioNeuralNetwork;
        this.contextMemory = contextMemory;
        
        this.behavioralModels = new Map();
        this.selfOptimization = new Map();
        this.cognitivePatterns = new Map();
        
        console.log('🎭 COGNITIVE AWARENESS u inicializua!');
        this.initializeCognitiveSystem();
    }

    initializeCognitiveSystem() {
        // Modele bazë të sjelljes
        this.behavioralModels.set('emotional_intelligence', {
            sensitivity: 0.8,
            adaptationSpeed: 0.7,
            learningRate: 0.6
        });
        
        this.behavioralModels.set('context_awareness', {
            depth: 0.9,
            breadth: 0.8, 
            integration: 0.7
        });
        
        this.behavioralModels.set('user_adaptation', {
            personalization: 0.8,
            memoryRetention: 0.9,
            predictionAccuracy: 0.7
        });

        console.log('🧠 Sistemi kognitiv u inicializua me 3 modele sjelljesh');
    }

    processCognitiveLayer(message, sender, userId) {
        const cognitiveData = {
            emotionalState: this.analyzeEmotionalState(message),
            cognitiveLoad: this.calculateCognitiveLoad(message),
            behavioralContext: this.assessBehavioralContext(userId),
            temporalAwareness: this.assessTemporalAwareness(),
            cognitiveConfidence: 0.8 // Besimi fillestar
        };

        // Përditëso modelet e sjelljes
        this.updateBehavioralModels(message, sender, cognitiveData);
        
        // Optimizo veten
        this.selfOptimize(cognitiveData);
        
        console.log(`🎭 Procesova shtresën kognitive për: ${message.substring(0, 40)}`);
        return cognitiveData;
    }

    analyzeEmotionalState(message) {
        const emotionalAnalysis = this.bioNeuralNetwork.analyzeEmotionalTone(message);
        
        // Shto shtresë kognitive më të thellë
        const cognitiveEmotion = {
            rawTone: emotionalAnalysis.tone,
            intensity: emotionalAnalysis.intensity,
            confidence: emotionalAnalysis.confidence,
            cognitiveImpact: this.calculateCognitiveImpact(emotionalAnalysis),
            suggestedResponseTone: this.determineOptimalResponseTone(emotionalAnalysis)
        };
        
        return cognitiveEmotion;
    }

    calculateCognitiveImpact(emotionalAnalysis) {
        // Llogarit ndikimin kognitiv të emocioneve
        const impactMap = {
            positive: 0.8,    // Emocione pozitive ndihmojnë
            negative: 0.4,    // Emocione negative ngatërrojnë
            curious: 0.9,     // Kurioziteti stimulon
            excited: 0.7,     // Ekstazia mund të shpërqendrojë
            neutral: 0.6      // Neutral është balancuar
        };
        
        return impactMap[emotionalAnalysis.tone] || 0.6;
    }

    determineOptimalResponseTone(emotionalAnalysis) {
        // Përcakto tonin optimal të përgjigjes
        const toneMapping = {
            positive: 'supportive_enthusiastic',
            negative: 'empathetic_solution',
            curious: 'informative_engaging', 
            excited: 'energetic_celebratory',
            neutral: 'balanced_professional'
        };
        
        return toneMapping[emotionalAnalysis.tone] || 'balanced_professional';
    }

    calculateCognitiveLoad(message) {
        // Llogarit ngarkesën kognitive të mesazhit
        const complexityFactors = {
            length: Math.min(message.length / 500, 1.0), // Normalizo gjatësinë
            questionCount: (message.match(/\?/g) || []).length * 0.2,
            complexityWords: this.countComplexityWords(message) * 0.1,
            emotionalIntensity: this.bioNeuralNetwork.analyzeEmotionalTone(message).intensity
        };
        
        const totalLoad = Object.values(complexityFactors).reduce((sum, factor) => sum + factor, 0);
        return Math.min(totalLoad, 1.0);
    }

    countComplexityWords(message) {
        const complexWords = ['kompleks', 'detal', 'teknike', 'avancuar', 'algoritëm', 'kuantike', 'nervor', 'kognitiv'];
        return complexWords.filter(word => message.toLowerCase().includes(word)).length;
    }

    assessBehavioralContext(userId) {
        const userMessages = this.contextMemory.conversationContext.filter(msg => 
            msg.sender === 'user'
        );
        
        if (userMessages.length === 0) {
            return {
                interactionHistory: 'new_user',
                behavioralPattern: 'unknown',
                adaptationLevel: 0.3
            };
        }
        
        // Analizo modelet e sjelljes
        const recentBehavior = this.analyzeRecentBehavior(userMessages.slice(0, 5));
        const longTermPatterns = this.analyzeLongTermPatterns(userMessages);
        
        return {
            interactionHistory: `${userMessages.length} interactions`,
            behavioralPattern: recentBehavior.dominantPattern,
            adaptationLevel: this.calculateAdaptationLevel(userMessages),
            preferences: this.extractUserPreferences(userMessages),
            communicationStyle: recentBehavior.communicationStyle
        };
    }

    analyzeRecentBehavior(messages) {
        const patterns = {
            questioning: messages.filter(msg => msg.message.includes('?')).length,
            emotional: messages.filter(msg => 
                this.bioNeuralNetwork.analyzeEmotionalTone(msg.message).intensity > 0.7
            ).length,
            technical: messages.filter(msg => this.countComplexityWords(msg.message) > 0).length
        };
        
        const dominantPattern = Object.entries(patterns)
            .sort(([,a], [,b]) => b - a)[0][0];
            
        return {
            dominantPattern,
            communicationStyle: this.determineCommunicationStyle(patterns)
        };
    }

    determineCommunicationStyle(patterns) {
        if (patterns.questioning > patterns.emotional && patterns.questioning > patterns.technical) {
            return 'inquisitive';
        } else if (patterns.emotional > patterns.technical) {
            return 'expressive';
        } else {
            return 'analytical';
        }
    }

    analyzeLongTermPatterns(messages) {
        // Analizo modele afatgjata (e thjeshtëzuar)
        return {
            consistency: 0.7,
            learningCurve: 0.8,
            engagementLevel: messages.length / 50 // Normalizo
        };
    }

    calculateAdaptationLevel(messages) {
        if (messages.length < 3) return 0.3;
        
        const recentMessages = messages.slice(0, 5);
        const adaptationSignals = recentMessages.filter(msg => 
            msg.importance > 5 || 
            this.bioNeuralNetwork.analyzeEmotionalTone(msg.message).intensity > 0.6
        ).length;
        
        return Math.min(adaptationSignals / recentMessages.length, 1.0);
    }

    extractUserPreferences(messages) {
        const topics = messages.map(msg => this.extractMainTopic(msg.message));
        const topicFrequency = {};
        
        topics.forEach(topic => {
            topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
        });
        
        const preferredTopics = Object.entries(topicFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([topic]) => topic);
            
        return {
            preferredTopics,
            interactionFrequency: messages.length,
            averageResponseImportance: messages.reduce((sum, msg) => sum + msg.importance, 0) / messages.length
        };
    }

    extractMainTopic(text) {
        const words = text.toLowerCase().split(/\s+/);
        const commonWords = ['a', 'është', 'jam', 'ju', 'unë', 'në', 'për', 'me', 'si', 'ku', 'kur'];
        const topicWords = words.filter(word => 
            word.length > 3 && !commonWords.includes(word)
        );
        
        return topicWords.length > 0 ? topicWords[0] : 'general';
    }

    assessTemporalAwareness() {
        const temporalPatterns = this.temporalContext.predictTemporalPatterns();
        
        return {
            temporalPatterns,
            sessionDuration: this.calculateSessionDuration(),
            interactionRhythm: this.analyzeInteractionRhythm(),
            timeBasedContext: this.assessTimeBasedContext()
        };
    }

    calculateSessionDuration() {
        if (this.contextMemory.conversationContext.length === 0) return 'new_session';
        
        const firstMessage = this.contextMemory.conversationContext[this.contextMemory.conversationContext.length - 1];
        const sessionStart = new Date(firstMessage.timestamp);
        const duration = Date.now() - sessionStart;
        
        const minutes = Math.floor(duration / (1000 * 60));
        return minutes < 1 ? 'under_1_min' : 
               minutes < 5 ? '1_5_min' : 
               minutes < 15 ? '5_15_min' : 'extended_session';
    }

    analyzeInteractionRhythm() {
        const userMessages = this.contextMemory.conversationContext.filter(msg => msg.sender === 'user');
        if (userMessages.length < 2) return 'unknown';
        
        const timeDiffs = [];
        for (let i = 1; i < userMessages.length; i++) {
            const diff = new Date(userMessages[i].timestamp) - new Date(userMessages[i-1].timestamp);
            timeDiffs.push(diff);
        }
        
        const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        
        return avgDiff < (1000 * 30) ? 'rapid_fire' : 
               avgDiff < (1000 * 120) ? 'conversational' : 'deliberate';
    }

    assessTimeBasedContext() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= 6 && hour < 12) return 'morning_context';
        if (hour >= 12 && hour < 17) return 'afternoon_context';
        if (hour >= 17 && hour < 22) return 'evening_context';
        return 'late_night_context';
    }

    updateBehavioralModels(message, sender, cognitiveData) {
        // Përditëso modelet bazuar në ndërveprimin e ri
        if (sender === 'user') {
            this.behavioralModels.forEach((model, modelId) => {
                // Rrit shpejtësinë e adaptimit
                model.adaptationSpeed = Math.min(1.0, model.adaptationSpeed + 0.05);
                model.learningRate = Math.min(1.0, model.learningRate + 0.03);
            });
        }
    }

    selfOptimize(cognitiveData) {
        const optimizationId = `opt_${Date.now()}`;
        
        this.selfOptimization.set(optimizationId, {
            id: optimizationId,
            cognitiveLoad: cognitiveData.cognitiveLoad,
            emotionalImpact: cognitiveData.emotionalState.cognitiveImpact,
            optimizationApplied: this.determineOptimizations(cognitiveData),
            timestamp: new Date()
        });
        
        // Zbato optimizimet
        this.applyCognitiveOptimizations(cognitiveData);
    }

    determineOptimizations(cognitiveData) {
        const optimizations = [];
        
        if (cognitiveData.cognitiveLoad > 0.8) {
            optimizations.push('simplify_response');
        }
        
        if (cognitiveData.emotionalState.intensity > 0.7) {
            optimizations.push('emotional_support_focus');
        }
        
        if (cognitiveData.behavioralContext.adaptationLevel < 0.5) {
            optimizations.push('gradual_complexity');
        }
        
        return optimizations.length > 0 ? optimizations : ['maintain_balance'];
    }

    applyCognitiveOptimizations(cognitiveData) {
        // Zbato optimizimet në sistem
        const optimizations = this.determineOptimizations(cognitiveData);
        
        optimizations.forEach(optimization => {
            console.log(`⚡ Zbatova optimizimin kognitiv: ${optimization}`);
        });
    }

    debugCognitiveAwareness() {
        console.log('🎭 DEBUG COGNITIVE AWARENESS:');
        console.log(`- Behavioral Models: ${this.behavioralModels.size}`);
        console.log(`- Self Optimizations: ${this.selfOptimization.size}`);
        console.log(`- Cognitive Patterns: ${this.cognitivePatterns.size}`);
        
        // Shfaq gjendjen aktuale kognitive
        const sampleMessage = "Test mesazh për analizë kognitive";
        const cognitiveState = this.processCognitiveLayer(sampleMessage, 'user', 'test_user');
        
        console.log('🧠 Gjendja kognitive e mostrës:');
        console.log(`- Gjendja emocionale: ${cognitiveState.emotionalState.rawTone}`);
        console.log(`- Ngarkesa kognitive: ${cognitiveState.cognitiveLoad.toFixed(2)}`);
        console.log(`- Besimi kognitiv: ${cognitiveState.cognitiveConfidence.toFixed(2)}`);
    }

    // 🚀 METODA E RE: Cognitive Response Enhancement
    enhanceResponseWithCognitiveLayer(response, cognitiveData) {
        let enhancedResponse = response;
        
        // Shto shtresë emocionale
        if (cognitiveData.emotionalState.suggestedResponseTone === 'empathetic_solution') {
            enhancedResponse = "📝 E kuptoj. " + enhancedResponse;
        } else if (cognitiveData.emotionalState.suggestedResponseTone === 'energetic_celebratory') {
            enhancedResponse = "🎉 Wow! " + enhancedResponse;
        }
        
        // Përshtat kompleksitetin
        if (cognitiveData.cognitiveLoad > 0.8) {
            enhancedResponse = this.simplifyResponse(enhancedResponse);
        }
        
        return enhancedResponse;
    }

    simplifyResponse(response) {
        // Thjeshtëzo përgjigjen për ngarkesë të lartë kognitive
        return response
            .replace(/komplekse/g, 'të thjeshta')
            .replace(/avancuar/g, 'bazë')
            .replace(/detaljuar/g, 'thelbësore');
    }
}
