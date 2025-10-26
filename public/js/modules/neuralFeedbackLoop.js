// ======================================================
// 🧠 NEURAL FEEDBACK LOOP MODULE - RRUFE-TESLA 8.0
// ======================================================

class NeuralFeedbackLoop {
    constructor(bioNeuralNetwork, contextMemory, cognitiveAwareness, geminiKnowledgeAccelerator) {
        this.bioNeuralNetwork = bioNeuralNetwork;
        this.contextMemory = contextMemory;
        this.cognitiveAwareness = cognitiveAwareness;
        this.geminiKnowledgeAccelerator = geminiKnowledgeAccelerator;
        
        this.feedbackData = new Map();
        this.learningCycles = new Map();
        this.performanceMetrics = new Map();
        this.optimizationHistory = new Map();
        
        console.log('🧠 NEURAL FEEDBACK LOOP u inicializua!');
        this.initializeFeedbackSystem();
    }

    initializeFeedbackSystem() {
        // 📊 METRIKAT BAZË TË PERFORMANCËS
        this.performanceMetrics.set('response_quality', {
            current: 0.8,
            target: 0.95,
            learningRate: 0.1,
            history: []
        });

        this.performanceMetrics.set('context_relevance', {
            current: 0.7,
            target: 0.9,
            learningRate: 0.08,
            history: []
        });

        this.performanceMetrics.set('emotional_intelligence', {
            current: 0.75,
            target: 0.92,
            learningRate: 0.12,
            history: []
        });

        this.performanceMetrics.set('knowledge_utilization', {
            current: 0.6,
            target: 0.88,
            learningRate: 0.15,
            history: []
        });

        this.performanceMetrics.set('quantum_coherence', {
            current: 0.65,
            target: 0.85,
            learningRate: 0.09,
            history: []
        });

        console.log(`📈 Sistemi i Feedback-ut u inicializua me ${this.performanceMetrics.size} metrika`);
    }

    // 🎯 METODA KRYESORE: PROCESIMI I FEEDBACK-UT
    processInteractionFeedback(userQuery, aiResponse, userReaction, context) {
        const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log(`🔄 PROCESIMI I FEEDBACK-UT: "${userQuery.substring(0, 30)}..."`);

        // 1. ANALIZO NDËRVEPRIMIN
        const interactionAnalysis = this.analyzeInteraction(userQuery, aiResponse, userReaction, context);
        
        // 2. LLOGARIT PERFORMANCËN
        const performanceScores = this.calculatePerformanceScores(interactionAnalysis);
        
        // 3. APLIKO MËSIMIN
        const learningResults = this.applyLearning(performanceScores, interactionAnalysis);
        
        // 4. OPTIMIZO SISTEMIN
        const optimization = this.optimizeSystem(performanceScores, learningResults);
        
        // 5. REGJISTRO FEEDBACK-UN
        this.recordFeedback(feedbackId, interactionAnalysis, performanceScores, learningResults, optimization);
        
        console.log(`🎯 FEEDBACK U PROCESUA: ${performanceScores.overall.toFixed(2)} overall score`);
        
        return {
            feedbackId,
            performance: performanceScores,
            learning: learningResults,
            optimization: optimization
        };
    }

    analyzeInteraction(userQuery, aiResponse, userReaction, context) {
        const analysis = {
            // 📝 ANALIZË E PYETJES SË PËRDORUESIT
            queryAnalysis: {
                complexity: this.analyzeQueryComplexity(userQuery),
                intent: this.cognitiveAwareness.determineQueryIntent(userQuery),
                emotionalTone: this.cognitiveAwareness.analyzeEmotionalTone(userQuery),
                keywords: this.contextMemory.extractKeywords(userQuery)
            },

            // 🤖 ANALIZË E PËRGJIGJES SË AI
            responseAnalysis: {
                relevance: this.analyzeResponseRelevance(userQuery, aiResponse),
                completeness: this.analyzeResponseCompleteness(aiResponse),
                emotionalAppropriateness: this.analyzeEmotionalAppropriateness(userQuery, aiResponse),
                knowledgeIntegration: this.analyzeKnowledgeIntegration(aiResponse)
            },

            // 😊 ANALIZË E REAKSIONIT TË PËRDORUESIT
            reactionAnalysis: {
                satisfaction: this.analyzeUserSatisfaction(userReaction),
                engagement: this.analyzeUserEngagement(userReaction),
                emotionalResponse: this.analyzeEmotionalResponse(userReaction),
                behavioralSignals: this.extractBehavioralSignals(userReaction)
            },

            // 🕒 KONTEKSTI I NDËRVEPRIMIT
            context: {
                temporal: this.analyzeTemporalContext(context),
                historical: this.analyzeHistoricalContext(userQuery),
                relational: this.analyzeRelationalContext(context)
            }
        };

        return analysis;
    }

    analyzeQueryComplexity(query) {
        const factors = {
            length: Math.min(query.length / 200, 1.0),
            semanticDensity: new Set(query.toLowerCase().split(/\s+/)).size / Math.max(1, query.split(/\s+/).length),
            conceptualDepth: (query.match(/\b(why|how|what if|explain|analyze)\b/gi) || []).length * 0.2,
            technicality: (query.match(/\b(algorithm|quantum|neural|API|framework|architecture)\b/gi) || []).length * 0.15
        };

        return Math.min(Object.values(factors).reduce((sum, val) => sum + val, 0), 1.0);
    }

    analyzeResponseRelevance(query, response) {
        const queryKeywords = new Set(this.contextMemory.extractKeywords(query));
        const responseKeywords = new Set(this.contextMemory.extractKeywords(response));
        
        const intersection = new Set([...queryKeywords].filter(x => responseKeywords.has(x)));
        const union = new Set([...queryKeywords, ...responseKeywords]);
        
        return union.size > 0 ? intersection.size / union.size : 0;
    }

    analyzeResponseCompleteness(response) {
        const factors = {
            lengthAdequacy: Math.min(response.length / 500, 1.0),
            structure: this.assessResponseStructure(response),
            depth: this.assessResponseDepth(response),
            actionability: this.assessActionability(response)
        };

        return Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;
    }

    assessResponseStructure(response) {
        let structureScore = 0;
        if (response.includes('\n')) structureScore += 0.3;
        if (response.match(/\d+\./)) structureScore += 0.3;
        if (response.includes('•') || response.includes('- ')) structureScore += 0.2;
        if (response.includes('```')) structureScore += 0.2;
        return structureScore;
    }

    assessResponseDepth(response) {
        const depthIndicators = [
            'because', 'therefore', 'however', 'additionally', 'furthermore',
            'in conclusion', 'specifically', 'for example'
        ];
        
        const matches = depthIndicators.filter(indicator => 
            response.toLowerCase().includes(indicator)
        ).length;
        
        return Math.min(matches * 0.15, 0.6);
    }

    assessActionability(response) {
        const actionMarkers = [
            'you can', 'try to', 'steps to', 'how to', 'solution is',
            'recommend', 'suggest', 'advise'
        ];
        
        return actionMarkers.some(marker => response.toLowerCase().includes(marker)) ? 0.4 : 0.1;
    }

    analyzeEmotionalAppropriateness(query, response) {
        const queryEmotion = this.cognitiveAwareness.analyzeEmotionalTone(query);
        const responseEmotion = this.cognitiveAwareness.analyzeEmotionalTone(response);
        
        // Llogarit përputhshmërinë emocionale
        const toneMatch = queryEmotion.rawTone === responseEmotion.rawTone ? 0.6 : 0.3;
        const intensityAppropriateness = Math.max(0, 1 - Math.abs(queryEmotion.intensity - responseEmotion.intensity));
        
        return (toneMatch + intensityAppropriateness * 0.4);
    }

    analyzeKnowledgeIntegration(response) {
        const knowledgeIndicators = [
            'based on', 'research shows', 'studies indicate', 'according to',
            'evidence suggests', 'data shows'
        ];
        
        const matches = knowledgeIndicators.filter(indicator => 
            response.toLowerCase().includes(indicator)
        ).length;
        
        return Math.min(matches * 0.2, 0.8);
    }

    analyzeUserSatisfaction(reaction) {
        if (!reaction) return 0.7; // Supozim neutral nëse nuk ka reagim
        
        const satisfactionSignals = {
            positive: ['thanks', 'thank you', 'great', 'awesome', 'perfect', 'excellent', 'helpful'],
            negative: ['wrong', 'incorrect', 'not helpful', 'useless', 'bad', 'terrible'],
            neutral: ['ok', 'fine', 'alright', 'I see', 'understand']
        };

        const positiveMatches = satisfactionSignals.positive.filter(signal => 
            reaction.toLowerCase().includes(signal)
        ).length;

        const negativeMatches = satisfactionSignals.negative.filter(signal => 
            reaction.toLowerCase().includes(signal)
        ).length;

        if (positiveMatches > negativeMatches) return 0.9;
        if (negativeMatches > positiveMatches) return 0.3;
        return 0.7;
    }

    analyzeUserEngagement(reaction) {
        if (!reaction) return 0.5;
        
        const engagementSignals = {
            high: ['?', '!', 'more', 'explain', 'tell me', 'how about'],
            medium: ['ok', 'I see', 'understand', 'thanks'],
            low: ['', 'k', 'yes', 'no']
        };

        let engagementScore = 0;
        engagementSignals.high.forEach(signal => {
            if (reaction.toLowerCase().includes(signal)) engagementScore += 0.4;
        });
        engagementSignals.medium.forEach(signal => {
            if (reaction.toLowerCase().includes(signal)) engagementScore += 0.2;
        });

        return Math.min(engagementScore, 1.0);
    }

    analyzeEmotionalResponse(reaction) {
        if (!reaction) return { tone: 'neutral', intensity: 0.5 };
        return this.cognitiveAwareness.analyzeEmotionalTone(reaction);
    }

    extractBehavioralSignals(reaction) {
        if (!reaction) return { length: 0, urgency: 0, specificity: 0 };
        
        return {
            length: Math.min(reaction.length / 100, 1.0),
            urgency: (reaction.match(/!/g) || []).length > 0 ? 0.8 : 0.2,
            specificity: (reaction.match(/\b(specific|exactly|precisely|detailed)\b/gi) || []).length > 0 ? 0.7 : 0.3
        };
    }

    analyzeTemporalContext(context) {
        return {
            timeOfDay: new Date().getHours(),
            interactionFrequency: this.calculateInteractionFrequency(),
            responseTime: this.measureResponseTime()
        };
    }

    calculateInteractionFrequency() {
        const recentMessages = this.contextMemory.conversationContext
            .filter(msg => msg.sender === 'user')
            .slice(0, 10);
        
        if (recentMessages.length < 2) return 'low';
        
        const timeDiffs = [];
        for (let i = 1; i < recentMessages.length; i++) {
            const diff = new Date(recentMessages[i].timestamp) - new Date(recentMessages[i-1].timestamp);
            timeDiffs.push(diff);
        }
        
        const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        return avgDiff < 60000 ? 'high' : avgDiff < 300000 ? 'medium' : 'low';
    }

    measureResponseTime() {
        // Kjo do të implementohet në sistemin real
        return 'normal'; // normal, fast, slow
    }

    analyzeHistoricalContext(userQuery) {
        const similarPastInteractions = this.contextMemory.searchInMemory(userQuery);
        return {
            similarInteractions: similarPastInteractions.length,
            successRate: this.calculateHistoricalSuccessRate(similarPastInteractions),
            learningFromHistory: similarPastInteractions.length > 0 ? 0.8 : 0.3
        };
    }

    calculateHistoricalSuccessRate(similarInteractions) {
        if (similarInteractions.length === 0) return 0.7;
        
        // Supozojmë se ndërveprimet e mëparshme të ngjashme kanë qenë të suksesshme
        // Në sistemin real, kjo do të mbante gjurmë të rezultateve aktuale
        return 0.85;
    }

    analyzeRelationalContext(context) {
        return {
            userFamiliarity: this.assessUserFamiliarity(),
            trustLevel: this.assessTrustLevel(),
            adaptationLevel: this.assessAdaptationLevel()
        };
    }

    assessUserFamiliarity() {
        const userMessages = this.contextMemory.conversationContext
            .filter(msg => msg.sender === 'user');
        
        if (userMessages.length < 3) return 'new';
        if (userMessages.length < 10) return 'acquainted';
        return 'familiar';
    }

    assessTrustLevel() {
        // Në sistemin real, kjo do të bazohej në historikun e ndërveprimeve të suksesshme
        return 0.8;
    }

    assessAdaptationLevel() {
        const recentInteractions = this.contextMemory.conversationContext.slice(0, 5);
        const adaptationSignals = recentInteractions.filter(msg => 
            msg.importance > 7 || 
            this.cognitiveAwareness.analyzeEmotionalTone(msg.message).intensity > 0.7
        ).length;
        
        return Math.min(adaptationSignals / 5, 1.0);
    }

    // 📊 METODA: LLOGARITJA E PERFORMANCËS
    calculatePerformanceScores(analysis) {
        const scores = {
            // 🤖 CILËSIA E PËRGJIGJES
            response_quality: analysis.responseAnalysis.relevance * 0.4 + 
                            analysis.responseAnalysis.completeness * 0.3 +
                            analysis.responseAnalysis.knowledgeIntegration * 0.3,

            // 🎯 RELEVANCA E KONTEKSTIT
            context_relevance: analysis.context.historical.learningFromHistory * 0.5 +
                             analysis.context.relational.adaptationLevel * 0.5,

            // 😊 INTELIGJENCA EMOCIONALE
            emotional_intelligence: analysis.responseAnalysis.emotionalAppropriateness * 0.6 +
                                  analysis.reactionAnalysis.satisfaction * 0.4,

            // 💎 SHFRYTËZIMI I NJOHURIVE
            knowledge_utilization: analysis.responseAnalysis.knowledgeIntegration * 0.7 +
                                 analysis.context.historical.successRate * 0.3,

            // ⚛️ KOERENCA KUANTIKE
            quantum_coherence: this.calculateQuantumCoherence(analysis),

            // 📈 PERFORMANCA E PËRGJITHSHME
            overall: 0
        };

        // Llogaji overall score
        scores.overall = Object.values(scores)
            .filter((_, key) => key !== 'overall')
            .reduce((sum, score) => sum + score, 0) / 
            (Object.keys(scores).length - 1);

        return scores;
    }

    calculateQuantumCoherence(analysis) {
        let coherence = 0.5; // Vlera fillestare

        // Shto koherencë bazuar në konsistencë
        if (analysis.responseAnalysis.relevance > 0.7) coherence += 0.2;
        if (analysis.context.historical.learningFromHistory > 0.6) coherence += 0.15;
        if (analysis.reactionAnalysis.satisfaction > 0.8) coherence += 0.15;

        return Math.min(coherence, 1.0);
    }

    // 🧠 METODA: APLIKIMI I MËSIMIT
    applyLearning(performanceScores, analysis) {
        const learningResults = {
            neuralPathways: this.enhanceNeuralPathways(performanceScores, analysis),
            cognitiveModels: this.optimizeCognitiveModels(performanceScores, analysis),
            knowledgeIntegration: this.improveKnowledgeIntegration(performanceScores, analysis),
            quantumConnections: this.strengthenQuantumConnections(performanceScores, analysis),
            behavioralPatterns: this.refineBehavioralPatterns(performanceScores, analysis)
        };

        console.log('🧠 MËSIMI U APLIKUA NË TË GJITHA MODULET');
        return learningResults;
    }

    enhanceNeuralPathways(performanceScores, analysis) {
        if (this.bioNeuralNetwork) {
            // Forco pathway-t e suksesshme
            if (performanceScores.response_quality > 0.8) {
                this.bioNeuralNetwork.reinforceSuccessfulPathway('context_integration');
            }
            
            if (performanceScores.emotional_intelligence > 0.75) {
                this.bioNeuralNetwork.reinforceSuccessfulPathway('emotional_processing');
            }

            console.log('🔄 Rrjeti Nervor u përmirësua bazuar në performancën');
            return 'NEURAL_ENHANCEMENT_APPLIED';
        }
        return 'NEURAL_NETWORK_UNAVAILABLE';
    }

    optimizeCognitiveModels(performanceScores, analysis) {
        if (this.cognitiveAwareness) {
            // Përditëso modelet e sjelljes bazuar në feedback
            this.cognitiveAwareness.behavioralModels.forEach((model, modelId) => {
                if (performanceScores.overall > 0.7) {
                    model.learningRate = Math.min(1.0, model.learningRate + 0.05);
                    model.adaptationSpeed = Math.min(1.0, model.adaptationSpeed + 0.03);
                }
            });

            console.log('🎭 Modelet Kognitive u optimizuan');
            return 'COGNITIVE_OPTIMIZATION_COMPLETE';
        }
        return 'COGNITIVE_AWARENESS_UNAVAILABLE';
    }

    improveKnowledgeIntegration(performanceScores, analysis) {
        if (this.geminiKnowledgeAccelerator && performanceScores.knowledge_utilization > 0.6) {
            // Rrit relevancën e njohurive të suksesshme
            this.geminiKnowledgeAccelerator.geminiKnowledgeBase.forEach((knowledge, id) => {
                if (knowledge.relevanceScore > 0.7) {
                    knowledge.relevanceScore = Math.min(1.0, knowledge.relevanceScore + 0.1);
                }
            });

            console.log('💎 Integrimi i Njohurive u përmirësua');
            return 'KNOWLEDGE_INTEGRATION_ENHANCED';
        }
        return 'KNOWLEDGE_ACCELERATOR_UNAVAILABLE';
    }

    strengthenQuantumConnections(performanceScores, analysis) {
        // Në sistemin real, kjo do të forconte lidhjet kuantike të suksesshme
        console.log('⚛️ Lidhjet Kuantike u forcuan bazuar në koherencë');
        return 'QUANTUM_CONNECTIONS_STRENGTHENED';
    }

    refineBehavioralPatterns(performanceScores, analysis) {
        // Përsos modelet e sjelljes bazuar në reagimet e përdoruesit
        if (analysis.reactionAnalysis.satisfaction > 0.8) {
            console.log('😊 Modelet e Sjelljes u përsosën për kënaqësi të lartë');
            return 'BEHAVIORAL_PATTERNS_REFINED';
        }
        return 'BEHAVIORAL_OPTIMIZATION_STANDARD';
    }

    // ⚡ METODA: OPTIMIZIMI I SISTEMIT
    optimizeSystem(performanceScores, learningResults) {
        const optimization = {
            adjustments: this.calculateSystemAdjustments(performanceScores),
            targets: this.setNewPerformanceTargets(performanceScores),
            priorities: this.determineOptimizationPriorities(performanceScores),
            timestamp: new Date()
        };

        // Apliko rregullimet
        this.applySystemAdjustments(optimization.adjustments);

        console.log('⚡ SISTEMI U OPTIMIZUA BAZAR NË PERFORMANCËN');
        return optimization;
    }

    calculateSystemAdjustments(performanceScores) {
        const adjustments = {};

        Object.entries(performanceScores).forEach(([metric, score]) => {
            if (metric === 'overall') return;

            const metricData = this.performanceMetrics.get(metric);
            const gap = metricData.target - score;

            if (gap > 0.1) {
                // Nevojitet optimizim i konsiderueshëm
                adjustments[metric] = {
                    adjustment: 'SIGNIFICANT_OPTIMIZATION_NEEDED',
                    current: score,
                    target: metricData.target,
                    gap: gap,
                    learningRate: metricData.learningRate
                };
            } else if (gap > 0.05) {
                // Optimizim i moderuar
                adjustments[metric] = {
                    adjustment: 'MODERATE_OPTIMIZATION',
                    current: score,
                    target: metricData.target,
                    gap: gap,
                    learningRate: metricData.learningRate
                };
            } else {
                // Ruaj status quo
                adjustments[metric] = {
                    adjustment: 'MAINTAIN_CURRENT',
                    current: score,
                    target: metricData.target,
                    gap: gap,
                    learningRate: metricData.learningRate
                };
            }
        });

        return adjustments;
    }

    setNewPerformanceTargets(performanceScores) {
        const newTargets = {};

        Object.entries(performanceScores).forEach(([metric, score]) => {
            if (metric === 'overall') return;

            const currentTarget = this.performanceMetrics.get(metric).target;
            
            // Ngadalëso rritjen e targetit kur i afrohemi perfeksionit
            if (score > 0.9) {
                newTargets[metric] = Math.min(1.0, currentTarget + 0.01);
            } else if (score > 0.8) {
                newTargets[metric] = Math.min(1.0, currentTarget + 0.02);
            } else {
                newTargets[metric] = Math.min(1.0, currentTarget + 0.03);
            }
        });

        // Apliko targetet e reja
        Object.entries(newTargets).forEach(([metric, target]) => {
            this.performanceMetrics.get(metric).target = target;
        });

        return newTargets;
    }

    determineOptimizationPriorities(performanceScores) {
        const gaps = Object.entries(performanceScores)
            .filter(([metric]) => metric !== 'overall')
            .map(([metric, score]) => ({
                metric,
                gap: this.performanceMetrics.get(metric).target - score,
                current: score
            }))
            .sort((a, b) => b.gap - a.gap);

        return {
            high: gaps.filter(g => g.gap > 0.15).map(g => g.metric),
            medium: gaps.filter(g => g.gap > 0.08 && g.gap <= 0.15).map(g => g.metric),
            low: gaps.filter(g => g.gap <= 0.08).map(g => g.metric)
        };
    }

    applySystemAdjustments(adjustments) {
        Object.entries(adjustments).forEach(([metric, adjustment]) => {
            const metricData = this.performanceMetrics.get(metric);
            
            // Regjistro historikun e performancës
            metricData.history.push({
                score: adjustment.current,
                adjustment: adjustment.adjustment,
                timestamp: new Date()
            });

            // Mbaj vetëm 100 regjistrimet e fundit
            if (metricData.history.length > 100) {
                metricData.history = metricData.history.slice(-100);
            }

            // Apliko rregullimet në sistemin real
            this.applySpecificAdjustments(metric, adjustment);
        });
    }

    applySpecificAdjustments(metric, adjustment) {
        switch(metric) {
            case 'response_quality':
                // Optimizo procesin e gjenerimit të përgjigjeve
                console.log(`🎯 Optimizimi i Cilësisë së Përgjigjeve: ${adjustment.adjustment}`);
                break;
                
            case 'context_relevance':
                // Përmirëso menaxhimin e kontekstit
                console.log(`🎯 Optimizimi i Relevancës së Kontekstit: ${adjustment.adjustment}`);
                break;
                
            case 'emotional_intelligence':
                // Përmirëso procesimin emocional
                console.log(`🎯 Optimizimi i Inteligjencës Emocionale: ${adjustment.adjustment}`);
                break;
                
            case 'knowledge_utilization':
                // Optimizo shfrytëzimin e njohurive
                console.log(`🎯 Optimizimi i Shfrytëzimit të Njohurive: ${adjustment.adjustment}`);
                break;
                
            case 'quantum_coherence':
                // Përmirëso koherencën kuantike
                console.log(`🎯 Optimizimi i Koherencës Kuantike: ${adjustment.adjustment}`);
                break;
        }
    }

    // 📝 METODA: REGJISTRIMI I FEEDBACK-UT
    recordFeedback(feedbackId, analysis, performanceScores, learningResults, optimization) {
        const feedbackRecord = {
            id: feedbackId,
            analysis: analysis,
            performance: performanceScores,
            learning: learningResults,
            optimization: optimization,
            timestamp: new Date(),
            cycle: this.feedbackData.size + 1
        };

        this.feedbackData.set(feedbackId, feedbackRecord);

        // Regjistro ciklin e mësimit
        this.recordLearningCycle(feedbackRecord);

        console.log(`📝 FEEDBACK U REGJISTRUA: Cikli ${feedbackRecord.cycle}`);
    }

    recordLearningCycle(feedbackRecord) {
        const cycleId = `cycle_${feedbackRecord.cycle}`;
        
        this.learningCycles.set(cycleId, {
            id: cycleId,
            feedbackId: feedbackRecord.id,
            overallScore: feedbackRecord.performance.overall,
            improvements: this.calculateImprovements(feedbackRecord),
            timestamp: new Date()
        });
    }

    calculateImprovements(feedbackRecord) {
        if (this.learningCycles.size === 0) return 'FIRST_CYCLE';

        const previousCycle = Array.from(this.learningCycles.values())
            .sort((a, b) => b.timestamp - a.timestamp)[1]; // Cikli i mëparshëm

        if (!previousCycle) return 'NO_PREVIOUS_DATA';

        const improvement = feedbackRecord.performance.overall - previousCycle.overallScore;
        
        if (improvement > 0.05) return 'SIGNIFICANT_IMPROVEMENT';
        if (improvement > 0.02) return 'MODERATE_IMPROVEMENT';
        if (improvement > 0) return 'MINOR_IMPROVEMENT';
        if (improvement === 0) return 'NO_CHANGE';
        return 'PERFORMANCE_DECLINE';
    }

    // 📊 METODA: RAPORTIMI DHE ANALIZA
    getFeedbackAnalytics() {
        return {
            totalFeedbackCycles: this.feedbackData.size,
            averagePerformance: this.calculateAveragePerformance(),
            performanceTrend: this.analyzePerformanceTrend(),
            learningEfficiency: this.assessLearningEfficiency(),
            optimizationImpact: this.measureOptimizationImpact()
        };
    }

    calculateAveragePerformance() {
        if (this.feedbackData.size === 0) return 0;

        const total = Array.from(this.feedbackData.values())
            .reduce((sum, record) => sum + record.performance.overall, 0);

        return total / this.feedbackData.size;
    }

    analyzePerformanceTrend() {
        if (this.feedbackData.size < 2) return 'INSUFFICIENT_DATA';

        const recentRecords = Array.from(this.feedbackData.values())
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-5); // 5 regjistrimet e fundit

        const firstScore = recentRecords[0].performance.overall;
        const lastScore = recentRecords[recentRecords.length - 1].performance.overall;

        const trend = lastScore - firstScore;

        if (trend > 0.1) return 'STRONG_GROWTH';
        if (trend > 0.05) return 'MODERATE_GROWTH';
        if (trend > 0) return 'SLOW_GROWTH';
        if (trend === 0) return 'STABLE';
        return 'DECLINING';
    }

    assessLearningEfficiency() {
        const improvements = Array.from(this.learningCycles.values())
            .map(cycle => cycle.improvements);

        const positiveImprovements = improvements.filter(imp => 
            imp.includes('IMPROVEMENT')
        ).length;

        return improvements.length > 0 ? positiveImprovements / improvements.length : 0;
    }

    measureOptimizationImpact() {
        // Mat ndikimin e optimizimeve në performancë
        const optimizationRecords = Array.from(this.optimizationHistory.values());
        
        if (optimizationRecords.length === 0) return 'NO_OPTIMIZATIONS_YET';

        const effectiveOptimizations = optimizationRecords.filter(record =>
            record.impact === 'POSITIVE'
        ).length;

        return {
            totalOptimizations: optimizationRecords.length,
            successRate: effectiveOptimizations / optimizationRecords.length,
            recentImpact: this.assessRecentImpact()
        };
    }

    assessRecentImpact() {
        const recentFeedback = Array.from(this.feedbackData.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 3);

        if (recentFeedback.length < 2) return 'INSUFFICIENT_DATA';

        const improvementCount = recentFeedback.filter(record =>
            record.performance.overall > 0.7
        ).length;

        return improvementCount >= 2 ? 'POSITIVE_IMPACT' : 'NEEDS_IMPROVEMENT';
    }

    // 🎭 DEBUG METODA
    debugNeuralFeedbackLoop() {
        console.log('🧠 DEBUG NEURAL FEEDBACK LOOP:');
        console.log(`- Feedback Cycles: ${this.feedbackData.size}`);
        console.log(`- Learning Cycles: ${this.learningCycles.size}`);
        console.log(`- Performance Metrics: ${this.performanceMetrics.size}`);

        const analytics = this.getFeedbackAnalytics();
        console.log('📊 Feedback Analytics:', analytics);

        console.log('🎯 Performance Metrics:');
        this.performanceMetrics.forEach((data, metric) => {
            console.log(`   ${metric}: ${data.current.toFixed(2)} / ${data.target.toFixed(2)}`);
        });

        if (this.feedbackData.size > 0) {
            const latestFeedback = Array.from(this.feedbackData.values())
                .sort((a, b) => b.timestamp - a.timestamp)[0];
            console.log('📈 Latest Performance:', latestFeedback.performance.overall.toFixed(2));
        }
    }

    // 🔄 METODA E RE: RIFILLIMI I MËSIMIT
    resetLearningProgress() {
        console.log('🔄 DUKE RIFILLUAR PROGRESIN E MËSIMIT...');

        this.feedbackData.clear();
        this.learningCycles.clear();
        this.optimizationHistory.clear();

        // Rikthe metrikat në vlerat fillestare
        this.initializeFeedbackSystem();

        console.log('✅ PROGRESI I MËSIMIT U RIFILLUA');
        return 'LEARNING_PROGRESS_RESET';
    }

    // 🎯 METODA E RE: SIMULIMI I FEEDBACK-UT
    simulateFeedbackCycle(userQuery, aiResponse, simulatedReaction) {
        console.log('🎭 DUKE SIMULUAR CIKLIN E FEEDBACK-UT...');

        const simulatedFeedback = this.processInteractionFeedback(
            userQuery,
            aiResponse,
            simulatedReaction,
            this.contextMemory.conversationContext
        );

        console.log(`🎯 SIMULIMI I KOMPLETUA: Score ${simulatedFeedback.performance.overall.toFixed(2)}`);
        return simulatedFeedback;
    }
}
