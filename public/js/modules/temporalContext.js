// ======================================================
// ⏳ TEMPORAL CONTEXT MODULE - RRUFE-TESLA
// ======================================================

class TemporalContext {
    constructor(contextMemory) {
        this.contextMemory = contextMemory;
        this.temporalLayers = new Map();
        this.causalChains = new Map();
        this.timeAnchors = new Map();
        
        console.log('⏳ TEMPORAL CONTEXT u inicializua!');
        this.initializeTemporalSystem();
    }

    initializeTemporalSystem() {
        // Shtresa kohore bazë
        this.temporalLayers.set('present', {
            depth: 0,
            timespan: 'current_session',
            priority: 1.0
        });
        
        this.temporalLayers.set('recent', {
            depth: 1, 
            timespan: 'last_hour',
            priority: 0.8
        });
        
        this.temporalLayers.set('session', {
            depth: 2,
            timespan: 'entire_session',
            priority: 0.6
        });

        console.log('🕒 Sistemi kohor u inicializua me 3 shtresa');
    }

    createTemporalMap(messages) {
        const temporalMapId = `temporal_map_${Date.now()}`;
        
        const temporalMap = {
            id: temporalMapId,
            messages: messages.map(msg => ({
                id: msg.id,
                timestamp: msg.timestamp,
                importance: msg.importance,
                temporalWeight: this.calculateTemporalWeight(msg)
            })),
            created: new Date(),
            timeRange: this.calculateTimeRange(messages),
            causalDensity: this.analyzeCausalDensity(messages)
        };
        
        this.temporalLayers.set(temporalMapId, temporalMap);
        
        // Krijo zinxhirë shkakësorë
        this.extractCausalChains(messages, temporalMapId);
        
        console.log(`🗺️ Krijuara Temporal Map me ${messages.length} mesazhe`);
        return temporalMapId;
    }

    calculateTemporalWeight(message) {
        const now = new Date();
        const messageTime = new Date(message.timestamp);
        const timeDiff = now - messageTime;
        
        // Pesha kohore - mesazhet e fundit kanë më shumë peshë
        const recencyWeight = Math.max(0, 1 - (timeDiff / (1000 * 60 * 30))); // 30 minuta
        
        // Kombino me rëndësinë
        const importanceWeight = message.importance / 10;
        
        return (recencyWeight * 0.7) + (importanceWeight * 0.3);
    }

    calculateTimeRange(messages) {
        if (messages.length === 0) return { start: null, end: null, duration: 0 };
        
        const timestamps = messages.map(msg => new Date(msg.timestamp));
        const start = new Date(Math.min(...timestamps));
        const end = new Date(Math.max(...timestamps));
        const duration = end - start;
        
        return { start, end, duration };
    }

    analyzeCausalDensity(messages) {
        if (messages.length < 2) return 0;
        
        let causalLinks = 0;
        
        for (let i = 1; i < messages.length; i++) {
            if (this.isCausallyRelated(messages[i-1], messages[i])) {
                causalLinks++;
            }
        }
        
        return causalLinks / (messages.length - 1);
    }

    isCausallyRelated(msg1, msg2) {
        // Kontrollo nëse mesazhet janë të lidhura shkakësorisht
        const timeDiff = new Date(msg2.timestamp) - new Date(msg1.timestamp);
        const semanticSimilarity = this.calculateSemanticOverlap(msg1.message, msg2.message);
        
        return timeDiff < (1000 * 60 * 5) && semanticSimilarity > 0.3; // 5 minuta dhe ngjashmëri
    }

    calculateSemanticOverlap(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return union.size > 0 ? intersection.size / union.size : 0;
    }

    extractCausalChains(messages, temporalMapId) {
        const chains = [];
        let currentChain = [];
        
        for (let i = 0; i < messages.length; i++) {
            if (currentChain.length === 0) {
                currentChain.push(messages[i]);
            } else {
                const lastMessage = currentChain[currentChain.length - 1];
                if (this.isCausallyRelated(lastMessage, messages[i])) {
                    currentChain.push(messages[i]);
                } else {
                    if (currentChain.length > 1) {
                        chains.push([...currentChain]);
                    }
                    currentChain = [messages[i]];
                }
            }
        }
        
        // Shto zinxhirin e fundit
        if (currentChain.length > 1) {
            chains.push(currentChain);
        }
        
        // Ruaj zinxhirët
        chains.forEach((chain, index) => {
            const chainId = `causal_chain_${temporalMapId}_${index}`;
            this.causalChains.set(chainId, {
                id: chainId,
                messages: chain.map(msg => msg.id),
                temporalMap: temporalMapId,
                strength: chain.length / messages.length,
                created: new Date()
            });
        });
        
        console.log(`⛓️ Ekstraktova ${chains.length} zinxhirë shkakësorë`);
    }

    // 🧠 METODA TË REJA RRUFE-TESLA
    predictTemporalPatterns() {
        const patterns = [];
        const recentMessages = this.contextMemory.conversationContext.slice(0, 10);
        
        if (recentMessages.length >= 3) {
            // Analizo modele kohore
            const timePattern = this.analyzeTimePattern(recentMessages);
            const topicPattern = this.analyzeTopicEvolution(recentMessages);
            
            patterns.push({
                type: 'temporal_rhythm',
                confidence: timePattern.confidence,
                prediction: timePattern.nextExpected
            });
            
            patterns.push({
                type: 'topic_progression', 
                confidence: topicPattern.confidence,
                prediction: topicPattern.likelyNextTopic
            });
        }
        
        return patterns;
    }

    analyzeTimePattern(messages) {
        const timeDiffs = [];
        for (let i = 1; i < messages.length; i++) {
            const diff = new Date(messages[i].timestamp) - new Date(messages[i-1].timestamp);
            timeDiffs.push(diff);
        }
        
        const avgDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
        const nextExpected = new Date(Date.now() + avgDiff);
        
        return {
            averageInterval: avgDiff,
            nextExpected: nextExpected,
            confidence: Math.min(1.0, 0.3 + (timeDiffs.length * 0.1))
        };
    }

    analyzeTopicEvolution(messages) {
        const topics = messages.map(msg => this.extractMainTopic(msg.message));
        const topicTransitions = {};
        
        for (let i = 1; i < topics.length; i++) {
            const transition = `${topics[i-1]}->${topics[i]}`;
            topicTransitions[transition] = (topicTransitions[transition] || 0) + 1;
        }
        
        const currentTopic = topics[topics.length - 1];
        const likelyNext = Object.entries(topicTransitions)
            .filter(([transition]) => transition.startsWith(currentTopic + '->'))
            .sort(([,a], [,b]) => b - a)[0];
        
        return {
            currentTopic: currentTopic,
            likelyNextTopic: likelyNext ? likelyNext[0].split('->')[1] : 'unknown',
            confidence: likelyNext ? Math.min(1.0, likelyNext[1] / topics.length) : 0.3
        };
    }

    extractMainTopic(text) {
        const words = text.toLowerCase().split(/\s+/);
        const commonWords = ['a', 'është', 'jam', 'ju', 'unë', 'në', 'për', 'me'];
        const topicWords = words.filter(word => 
            word.length > 3 && !commonWords.includes(word)
        );
        
        return topicWords.length > 0 ? topicWords[0] : 'general';
    }

    debugTemporalContext() {
        console.log('⏳ DEBUG TEMPORAL CONTEXT:');
        console.log(`- Temporal Layers: ${this.temporalLayers.size}`);
        console.log(`- Causal Chains: ${this.causalChains.size}`);
        console.log(`- Time Anchors: ${this.timeAnchors.size}`);
        
        // Shfaq parashikimet
        const predictions = this.predictTemporalPatterns();
        if (predictions.length > 0) {
            console.log('🔮 Parashikime kohore:');
            predictions.forEach(pred => {
                console.log(`   ${pred.type}: ${pred.prediction} (besim: ${pred.confidence.toFixed(2)})`);
            });
        }
    }

    // 🚀 METODA E RE: Temporal Optimization
    optimizeContextBasedOnTime() {
        const now = new Date();
        const recentMessages = this.contextMemory.conversationContext.filter(msg => {
            const msgTime = new Date(msg.timestamp);
            return (now - msgTime) < (1000 * 60 * 60); // Mesazhet e fundit 1 orë
        });
        
        if (recentMessages.length > 0) {
            this.createTemporalMap(recentMessages);
        }
    }
}
