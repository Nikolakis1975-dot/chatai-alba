// ======================================================
// 🚀 GEMINI KNOWLEDGE ACCELERATOR MODULE - RRUFE-TESLA
// ======================================================

class GeminiKnowledgeAccelerator {
    constructor(contextMemory, quantumMemory, temporalContext) {
        this.contextMemory = contextMemory;
        this.quantumMemory = quantumMemory;
        this.temporalContext = temporalContext;
        
        this.geminiKnowledgeBase = new Map();
        this.knowledgeConnections = new Map();
        this.learningPatterns = new Map();
        this.optimizationMetrics = new Map();
        
        console.log('🚀 GEMINI KNOWLEDGE ACCELERATOR u inicializua!');
        this.initializeKnowledgeSystem();
    }

    initializeKnowledgeSystem() {
        // Struktura bazë e njohurive
        this.knowledgeCategories = {
            technical: 'Teknologji dhe Programim',
            conceptual: 'Koncepte dhe Teori',
            practical: 'Zbatime Praktike',
            innovative: 'Ide Inovative'
        };
        
        this.learningRates = {
            technical: 0.9,
            conceptual: 0.8,
            practical: 0.85,
            innovative: 0.95
        };

        console.log('💎 Sistemi i njohurive u inicializua me 4 kategori');
    }

    captureGeminiKnowledge(geminiResponse, userQuery, conversationContext) {
        const knowledgeId = `knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Analizo dhe kategorizo përgjigjen
        const knowledgeAnalysis = this.analyzeKnowledgeContent(geminiResponse, userQuery);
        
        const knowledgeEntry = {
            id: knowledgeId,
            query: userQuery,
            response: geminiResponse,
            category: knowledgeAnalysis.category,
            confidence: knowledgeAnalysis.confidence,
            keyInsights: knowledgeAnalysis.keyInsights,
            complexity: knowledgeAnalysis.complexity,
            timestamp: new Date(),
            context: conversationContext ? conversationContext.slice(0, 3).map(msg => msg.id) : [],
            usageCount: 0,
            relevanceScore: 0.8
        };
        
        // Ruaj njohurinë
        this.geminiKnowledgeBase.set(knowledgeId, knowledgeEntry);
        
        // Krijo lidhje njohurish
        this.createKnowledgeConnections(knowledgeEntry, conversationContext);
        
        // Optimizo bazën e njohurive
        this.optimizeKnowledgeBase();
        
        console.log(`💎 Kapja e njohurive: ${knowledgeId} (${knowledgeAnalysis.category})`);
        return knowledgeId;
    }

    analyzeKnowledgeContent(response, query) {
        // Analizo përmbajtjen e njohurive
        const complexity = this.assessComplexity(response);
        const category = this.categorizeKnowledge(response, query);
        const keyInsights = this.extractKeyInsights(response);
        
        return {
            category: category,
            complexity: complexity,
            keyInsights: keyInsights,
            confidence: this.calculateConfidence(response, query),
            semanticDensity: this.measureSemanticDensity(response)
        };
    }

    assessComplexity(text) {
        const factors = {
            length: Math.min(text.length / 1000, 1.0),
            technicalTerms: (text.match(/\b(algorithm|quantum|neural|API|framework)\b/gi) || []).length * 0.1,
            sentenceComplexity: (text.match(/[.;:]\s/g) || []).length * 0.05,
            conceptualDepth: (text.match(/\b(concept|theory|principle|framework)\b/gi) || []).length * 0.15
        };
        
        const total = Object.values(factors).reduce((sum, factor) => sum + factor, 0);
        return Math.min(total, 1.0);
    }

    categorizeKnowledge(response, query) {
        const categoryScores = {
            technical: this.scoreTechnicalContent(response, query),
            conceptual: this.scoreConceptualContent(response),
            practical: this.scorePracticalContent(response),
            innovative: this.scoreInnovativeContent(response)
        };
        
        return Object.entries(categoryScores)
            .sort(([,a], [,b]) => b - a)[0][0];
    }

    scoreTechnicalContent(response, query) {
        let score = 0;
        const techKeywords = ['code', 'function', 'algorithm', 'API', 'database', 'server', 'client'];
        
        techKeywords.forEach(keyword => {
            if (response.toLowerCase().includes(keyword) || query.toLowerCase().includes(keyword)) {
                score += 0.2;
            }
        });
        
        return Math.min(score, 1.0);
    }

    scoreConceptualContent(response) {
        const conceptKeywords = ['concept', 'theory', 'principle', 'framework', 'model', 'paradigm'];
        const matches = conceptKeywords.filter(keyword => 
            response.toLowerCase().includes(keyword)
        ).length;
        
        return Math.min(matches * 0.3, 1.0);
    }

    scorePracticalContent(response) {
        const practicalIndicators = ['step by step', 'how to', 'example', 'tutorial', 'practice'];
        const matches = practicalIndicators.filter(indicator => 
            response.toLowerCase().includes(indicator)
        ).length;
        
        return Math.min(matches * 0.25, 1.0);
    }

    scoreInnovativeContent(response) {
        const innovationKeywords = ['innovative', 'revolutionary', 'breakthrough', 'cutting-edge', 'future'];
        const matches = innovationKeywords.filter(keyword => 
            response.toLowerCase().includes(keyword)
        ).length;
        
        return Math.min(matches * 0.4, 1.0);
    }

    extractKeyInsights(response) {
        const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10);
        const insights = [];
        
        // Ekstrago fjali kyçe
        sentences.forEach(sentence => {
            if (this.isKeyInsight(sentence)) {
                insights.push(sentence.trim());
            }
        });
        
        return insights.slice(0, 3); // Kthe vetëm 3 më të rëndësishmet
    }

    isKeyInsight(sentence) {
        const insightIndicators = [
            'the key is', 'most important', 'crucial', 'essential', 
            'fundamental', 'core concept', 'main point'
        ];
        
        return insightIndicators.some(indicator => 
            sentence.toLowerCase().includes(indicator)
        ) || sentence.length > 50; // Ose fjali të gjata
    }

    calculateConfidence(response, query) {
        let confidence = 0.7; // Besim bazë
        
        // Rrit besimin bazuar në faktorë
        if (response.length > query.length * 2) confidence += 0.1;
        if (this.containsExamples(response)) confidence += 0.1;
        if (this.hasStructure(response)) confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    containsExamples(text) {
        return text.toLowerCase().includes('example') || 
               text.toLowerCase().includes('for instance') ||
               text.includes('```'); // Kod example
    }

    hasStructure(text) {
        return text.includes('\n') || 
               text.includes('•') ||
               text.includes('- ') ||
               text.match(/\d+\./); // Lista me numra
    }

    measureSemanticDensity(text) {
        const words = text.split(/\s+/).length;
        const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
        return words > 0 ? uniqueWords / words : 0;
    }

    createKnowledgeConnections(knowledgeEntry, context) {
        // Krijo lidhje me kontekstin ekzistues
        if (context && context.length > 0) {
            context.forEach(contextMsg => {
                const connectionId = `conn_${knowledgeEntry.id}_${contextMsg.id}`;
                
                this.knowledgeConnections.set(connectionId, {
                    id: connectionId,
                    knowledge: knowledgeEntry.id,
                    context: contextMsg.id,
                    strength: this.calculateConnectionStrength(knowledgeEntry, contextMsg),
                    created: new Date()
                });
            });
        }
        
        // Krijo lidhje kuantike
        if (this.quantumMemory && context && context.length >= 2) {
            this.quantumMemory.createQuantumEntanglement(
                { id: knowledgeEntry.id, message: knowledgeEntry.query },
                context[0]
            );
        }
    }

    calculateConnectionStrength(knowledge, contextMsg) {
        let strength = 0;
        
        // Ngjashmëri semantike
        const semanticSimilarity = this.calculateSemanticSimilarity(
            knowledge.query, 
            contextMsg.message
        );
        strength += semanticSimilarity * 0.6;
        
        // Lidhje kohore
        const timeDiff = new Date(knowledge.timestamp) - new Date(contextMsg.timestamp);
        const timeStrength = Math.max(0, 1 - (timeDiff / (1000 * 60 * 60))); // 1 orë
        strength += timeStrength * 0.3;
        
        // Rëndësi
        strength += (contextMsg.importance / 10) * 0.1;
        
        return Math.min(strength, 1.0);
    }

    calculateSemanticSimilarity(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return union.size > 0 ? intersection.size / union.size : 0;
    }

    optimizeKnowledgeBase() {
        // Optimizo bazën e njohurive
        if (this.geminiKnowledgeBase.size > 50) {
            this.removeLowRelevanceKnowledge();
        }
        
        this.updateRelevanceScores();
        this.organizeKnowledgeByCategory();
    }

    removeLowRelevanceKnowledge() {
        const toRemove = [];
        
        this.geminiKnowledgeBase.forEach((knowledge, id) => {
            if (knowledge.relevanceScore < 0.3 && knowledge.usageCount === 0) {
                toRemove.push(id);
            }
        });
        
        toRemove.forEach(id => {
            this.geminiKnowledgeBase.delete(id);
            console.log(`🧹 Fshiva njohuri me relevancë të ulët: ${id}`);
        });
    }

    updateRelevanceScores() {
        this.geminiKnowledgeBase.forEach((knowledge, id) => {
            // Përditëso skorën e relevancës
            const timeFactor = this.calculateTimeRelevance(knowledge.timestamp);
            const usageFactor = Math.min(knowledge.usageCount * 0.1, 0.5);
            const confidenceFactor = knowledge.confidence * 0.3;
            
            knowledge.relevanceScore = timeFactor + usageFactor + confidenceFactor;
            this.geminiKnowledgeBase.set(id, knowledge);
        });
    }

    calculateTimeRelevance(timestamp) {
        const now = new Date();
        const knowledgeTime = new Date(timestamp);
        const hoursDiff = (now - knowledgeTime) / (1000 * 60 * 60);
        
        // Njohuritë e reja kanë relevancë më të lartë
        return Math.max(0, 1 - (hoursDiff / 168)); // 1 javë = relevancë 0
    }

    organizeKnowledgeByCategory() {
        this.knowledgeByCategory = {};
        
        Object.keys(this.knowledgeCategories).forEach(category => {
            this.knowledgeByCategory[category] = [];
        });
        
        this.geminiKnowledgeBase.forEach(knowledge => {
            if (this.knowledgeByCategory[knowledge.category]) {
                this.knowledgeByCategory[knowledge.category].push(knowledge);
            }
        });
    }

    // 🔍 METODA KËRKIMI
    searchAccumulatedKnowledge(query, category = null) {
        const results = [];
        
        this.geminiKnowledgeBase.forEach(knowledge => {
            if (category && knowledge.category !== category) return;
            
            const relevance = this.calculateSearchRelevance(knowledge, query);
            if (relevance > 0.3) {
                results.push({
                    knowledge: knowledge,
                    relevance: relevance,
                    matchType: this.determineMatchType(knowledge, query)
                });
            }
        });
        
        // Rendit sipas relevancës
        return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
    }

    calculateSearchRelevance(knowledge, query) {
        let relevance = 0;
        
        // Kërko në query
        relevance += this.textMatchScore(knowledge.query, query) * 0.4;
        
        // Kërko në përgjigje
        relevance += this.textMatchScore(knowledge.response, query) * 0.3;
        
        // Kërko në key insights
        relevance += knowledge.keyInsights.reduce((sum, insight) => 
            sum + this.textMatchScore(insight, query), 0
        ) * 0.2;
        
        // Relevancë e përgjithshme
        relevance += knowledge.relevanceScore * 0.1;
        
        return Math.min(relevance, 1.0);
    }

    textMatchScore(text, query) {
        const textWords = new Set(text.toLowerCase().split(/\s+/));
        const queryWords = new Set(query.toLowerCase().split(/\s+/));
        
        const matches = [...queryWords].filter(word => textWords.has(word)).length;
        return queryWords.size > 0 ? matches / queryWords.size : 0;
    }

    determineMatchType(knowledge, query) {
        if (knowledge.query.toLowerCase().includes(query.toLowerCase())) {
            return 'direct_query_match';
        } else if (knowledge.response.toLowerCase().includes(query.toLowerCase())) {
            return 'response_content_match';
        } else {
            return 'semantic_similarity';
        }
    }

    // 📊 METODA ANALITIKE
    getKnowledgeStats() {
        const stats = {
            totalKnowledge: this.geminiKnowledgeBase.size,
            byCategory: {},
            averageConfidence: 0,
            mostUsed: null,
            knowledgeGrowth: this.calculateGrowthRate()
        };
        
        // Llogarit statistikat e kategorive
        Object.keys(this.knowledgeCategories).forEach(category => {
            const categoryKnowledge = [...this.geminiKnowledgeBase.values()]
                .filter(k => k.category === category);
            stats.byCategory[category] = categoryKnowledge.length;
        });
        
        // Llogarit besimin mesatar
        const totalConfidence = [...this.geminiKnowledgeBase.values()]
            .reduce((sum, k) => sum + k.confidence, 0);
        stats.averageConfidence = totalConfidence / this.geminiKnowledgeBase.size;
        
        // Gjej më të përdorurën
        const mostUsed = [...this.geminiKnowledgeBase.values()]
            .sort((a, b) => b.usageCount - a.usageCount)[0];
        stats.mostUsed = mostUsed;
        
        return stats;
    }

    calculateGrowthRate() {
        if (this.geminiKnowledgeBase.size < 2) return 0;
        
        const knowledgeEntries = [...this.geminiKnowledgeBase.values()];
        const sortedByTime = knowledgeEntries.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        const firstEntry = sortedByTime[0];
        const lastEntry = sortedByTime[sortedByTime.length - 1];
        
        const timeDiff = (new Date(lastEntry.timestamp) - new Date(firstEntry.timestamp)) / (1000 * 60 * 60);
        return timeDiff > 0 ? sortedByTime.length / timeDiff : 0;
    }

    debugKnowledgeAccelerator() {
        console.log('🚀 DEBUG GEMINI KNOWLEDGE ACCELERATOR:');
        console.log(`- Knowledge Base: ${this.geminiKnowledgeBase.size} entries`);
        console.log(`- Knowledge Connections: ${this.knowledgeConnections.size}`);
        console.log(`- Learning Patterns: ${this.learningPatterns.size}`);
        
        const stats = this.getKnowledgeStats();
        console.log('📊 Knowledge Statistics:');
        console.log(`- By Category:`, stats.byCategory);
        console.log(`- Average Confidence: ${stats.averageConfidence.toFixed(2)}`);
        console.log(`- Growth Rate: ${stats.knowledgeGrowth.toFixed(2)} entries/hour`);
        
        // Testo kërkimin
        const testResults = this.searchAccumulatedKnowledge('technology');
        console.log(`- Test Search Results: ${testResults.length} matches`);
    }

    // 🎯 METODA E RE: Knowledge Enhancement
    enhanceResponseWithKnowledge(response, userQuery) {
        const knowledgeResults = this.searchAccumulatedKnowledge(userQuery);
        
        if (knowledgeResults.length > 0) {
            const bestMatch = knowledgeResults[0];
            
            // Shto referencë nga njohuria ekzistuese
            if (bestMatch.relevance > 0.7) {
                return `${response}\n\n💡 *Bazuar në njohuri të mëparshme:* ${bestMatch.knowledge.keyInsights[0]}`;
            }
        }
        
        return response;
    }

    // 🔄 METODA E RE: Continuous Learning
    learnFromInteraction(userQuery, geminiResponse, userSatisfaction) {
        const knowledgeId = this.captureGeminiKnowledge(geminiResponse, userQuery);
        const knowledgeEntry = this.geminiKnowledgeBase.get(knowledgeId);
        
        if (knowledgeEntry && userSatisfaction !== undefined) {
            // Përditëso bazuar në kënaqësinë e përdoruesit
            knowledgeEntry.usageCount++;
            knowledgeEntry.relevanceScore += userSatisfaction ? 0.1 : -0.1;
            knowledgeEntry.relevanceScore = Math.max(0, Math.min(1, knowledgeEntry.relevanceScore));
            
            this.geminiKnowledgeBase.set(knowledgeId, knowledgeEntry);
        }
    }
}
