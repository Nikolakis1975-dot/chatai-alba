// ======================= TEMPORAL CONTEXT =======================
// ⏳ MODULI: TemporalContext - Kontekst Kohor 4-Dimensional
// 📍 /public/js/modules/temporalContext.js
// ===============================================================

console.log('⏳ TEMPORAL CONTEXT u ngarkua!');

class TemporalContext {
    constructor(contextMemory) {
        this.contextMemory = contextMemory;
        this.temporalLayers = new Map();
        this.eventHorizons = new Map();
        this.causalChains = new Map();
        
        console.log('🕰️ TemporalContext u inicializua!');
    }

    // ✅ KRIJO HARTË KOHORE
    createTemporalMap(conversation) {
        const temporalMap = {
            startTime: conversation[conversation.length - 1]?.timestamp,
            endTime: conversation[0]?.timestamp,
            duration: this.calculateConversationDuration(conversation),
            events: conversation.map((entry, index) => ({
                sequence: index,
                timestamp: entry.timestamp,
                type: entry.sender,
                content: entry.message.substring(0, 50),
                importance: entry.importance || 5
            })),
            patterns: this.detectTemporalPatterns(conversation)
        };

        const mapId = `temporal_${Date.now()}`;
        this.temporalLayers.set(mapId, temporalMap);
        
        console.log('🗺️ Krijuam hartë kohore:', mapId);
        return mapId;
    }

    // ✅ LLOGARIT KOHËZGJATJEN E BISEDËS
    calculateConversationDuration(conversation) {
        if (conversation.length < 2) return "0s";
        
        const start = new Date(conversation[conversation.length - 1].timestamp);
        const end = new Date(conversation[0].timestamp);
        const durationMs = end - start;
        
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        
        return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }

    // ✅ ZBULO MODELE KOHORE
    detectTemporalPatterns(conversation) {
        const patterns = {
            questionResponsePairs: 0,
            userBotAlternation: 0,
            rapidFireMessages: 0,
            timeGaps: []
        };

        for (let i = 1; i < conversation.length; i++) {
            const current = conversation[i];
            const previous = conversation[i - 1];
            
            // Kontrollo çiftet pyetje-përgjigje
            if (previous.sender === 'user' && current.sender === 'bot') {
                patterns.questionResponsePairs++;
            }
            
            // Kontrollo alternimin user-bot
            if (previous.sender !== current.sender) {
                patterns.userBotAlternation++;
            }
            
            // Kontrollo mesazhe të shpejta (< 10 sekonda)
            const timeDiff = new Date(current.timestamp) - new Date(previous.timestamp);
            if (timeDiff < 10000) { // 10 sekonda
                patterns.rapidFireMessages++;
            }
            
            // Regjistro boshllëqe kohore
            patterns.timeGaps.push(timeDiff);
        }

        return patterns;
    }

    // ✅ NXJERR MARRËDHËNIE SHAK-PASOJË
    inferCausalRelations(events) {
        const causalRelations = [];
        
        for (let i = 1; i < events.length; i++) {
            const cause = events[i - 1];
            const effect = events[i];
            
            // Kontrollo nëse ka lidhje shkak-pasojë
            if (this.isCausalRelation(cause, effect)) {
                causalRelations.push({
                    cause: cause.message.substring(0, 30),
                    effect: effect.message.substring(0, 30),
                    confidence: this.calculateCausalConfidence(cause, effect),
                    timestamp: effect.timestamp
                });
            }
        }

        const chainId = `causal_${Date.now()}`;
        this.causalChains.set(chainId, causalRelations);
        
        console.log('⛓️ Zbuluam', causalRelations.length, 'marrëdhënie shkak-pasojë');
        return chainId;
    }

    // ✅ KONTROLLO NËSE KA LIDHJE SHAK-PASOJË
    isCausalRelation(cause, effect) {
        // Pyetje → Përgjigje
        if (cause.sender === 'user' && effect.sender === 'bot') {
            return true;
        }
        
        // Përgjigje → Pyetje e re
        if (cause.sender === 'bot' && effect.sender === 'user') {
            return true;
        }
        
        // Kontrollo përpasje temash
        const causeKeywords = this.contextMemory.extractKeywords(cause.message);
        const effectKeywords = this.contextMemory.extractKeywords(effect.message);
        const commonKeywords = causeKeywords.filter(kw => effectKeywords.includes(kw));
        
        return commonKeywords.length > 0;
    }

    // ✅ LLOGARIT BESUESHMËRI SHAK-PASOJË
    calculateCausalConfidence(cause, effect) {
        let confidence = 0.5; // Default
        
        // Bonus për pyetje-përgjigje
        if (cause.sender === 'user' && effect.sender === 'bot') {
            confidence += 0.3;
        }
        
        // Bonus për fjalë kyçe të përbashkëta
        const causeKeywords = this.contextMemory.extractKeywords(cause.message);
        const effectKeywords = this.contextMemory.extractKeywords(effect.message);
        const commonKeywords = causeKeywords.filter(kw => effectKeywords.includes(kw));
        
        confidence += commonKeywords.length * 0.1;
        
        return Math.min(confidence, 1.0);
    }

    // ✅ PARASHIKO NGJARJET E ARDHSHME
    predictFutureEvents(currentContext, lookAhead = 3) {
        const predictions = [];
        const recentEvents = currentContext.slice(0, 5);
        
        // Analizo modelet e fundit
        const recentPatterns = this.detectTemporalPatterns(recentEvents);
        
        // Parashiko bazuar në modele
        if (recentPatterns.questionResponsePairs > 0) {
            predictions.push({
                type: 'question_response',
                confidence: 0.7,
                description: 'Përdoruesi ka shanse të larta për të bërë pyetje të reja'
            });
        }
        
        if (recentPatterns.rapidFireMessages > 2) {
            predictions.push({
                type: 'continued_engagement',
                confidence: 0.8,
                description: 'Përdoruesi është i angazhuar, pritet vazhdim i bisedës'
            });
        }

        console.log('🔮 Parashikuam', predictions.length, 'ngjarje të ardhshme');
        return predictions;
    }

    // ✅ DEBUG TEMPORAL CONTEXT
    debugTemporalContext() {
        console.log('🔍 DEBUG TEMPORAL CONTEXT:');
        console.log('- Hartë kohore:', this.temporalLayers.size);
        console.log('- Zinxhirë shkak-pasojë:', this.causalChains.size);
        
        // Shfaq hartën kohore më të re
        const latestMap = Array.from(this.temporalLayers.values()).pop();
        if (latestMap) {
            console.log('- Biseda e fundit:', latestMap.duration);
            console.log('- Ngjarje total:', latestMap.events.length);
            console.log('- Modele:', latestMap.patterns);
        }
    }
}

// Eksporto për përdorim global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemporalContext;
} else {
    window.TemporalContext = TemporalContext;
}
