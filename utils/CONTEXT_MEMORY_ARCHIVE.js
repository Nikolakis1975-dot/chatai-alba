// 🧠 CONTEXT MEMORY ARCHIVE - MEMORIA KUANTIKE E PERPETUAL INTELLIGENCE

class ContextMemoryArchive {
    constructor(maxEntries = 10) {
        this.MAX_ENTRIES = maxEntries;
        this.memoryCache = new Map(); // Cache në memorie për server
        console.log(`✅ CONTEXT_MEMORY_ARCHIVE: Arkivi u inicializua (Kapaciteti: ${this.MAX_ENTRIES})`);
    }

    async getContextHistory(userId) {
        // Përdor cache në server në vend të localStorage
        return this.memoryCache.get(userId) || [];
    }

    async saveNewEntry(userId, newEntry) {
        let history = await this.getContextHistory(userId);
        
        const timestampedEntry = { 
            ...newEntry, 
            timestamp: new Date().toISOString(),
            entry_id: 'entry_' + Date.now()
        };

        // Shto hyrjen e re në fillim
        history.unshift(timestampedEntry);

        // Mbaj vetëm numrin maksimal
        if (history.length > this.MAX_ENTRIES) {
            history = history.slice(0, this.MAX_ENTRIES);
        }

        // Ruaj në cache të serverit
        this.memoryCache.set(userId, history);
        
        console.log(`🧠 CMA: Hyrje e re për ${userId}. Total: ${history.length}`);
        return history;
    }

    async getRecentIntent(userId) {
        const history = await this.getContextHistory(userId);
        return history.length > 0 ? history[0] : null;
    }

    async getIntentPattern(userId) {
        const history = await this.getContextHistory(userId);
        if (history.length < 2) return null;

        // Analizo pattern-in e intentit të fundit
        const recentIntents = history.slice(0, 3).map(entry => entry.intent?.type);
        
        // Kontrollo nëse ka pattern të përsëritur
        const uniqueIntents = [...new Set(recentIntents)];
        if (uniqueIntents.length === 1) {
            return {
                pattern: "REPEATED_INTENT",
                intent: uniqueIntents[0],
                confidence: 0.9,
                count: recentIntents.length
            };
        }

        return null;
    }

    async clearHistory(userId) {
        this.memoryCache.delete(userId);
        console.log(`🗑️ CMA: Historia u fshi për ${userId}`);
        return true;
    }

    async getMemoryStats(userId) {
        const history = await this.getContextHistory(userId);
        const recentIntent = await this.getRecentIntent(userId);
        const pattern = await this.getIntentPattern(userId);

        return {
            user_id: userId,
            total_entries: history.length,
            max_capacity: this.MAX_ENTRIES,
            recent_intent: recentIntent,
            detected_pattern: pattern,
            memory_health: history.length > 5 ? "OPTIMAL" : "DEVELOPING",
            timeline: history.map(entry => ({
                timestamp: entry.timestamp,
                intent: entry.intent?.type,
                confidence: entry.intent?.confidence
            }))
        };
    }
}

module.exports = ContextMemoryArchive;
