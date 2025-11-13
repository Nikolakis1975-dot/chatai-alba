// ================================ contextMemoryService =================================================
// 🆕 CONTEXT MEMORY SERVICE - RRUFE-TESLA 10.5
// 💾 Sistemi i Avancuar i Memories Kontekstuale

const EventEmitter = require('events');
const path = require('path');
const fs = require('fs').promises;

class ContextMemoryService extends EventEmitter {
    constructor() {
        super();
        this.serviceName = "ContextMemoryService";
        this.version = "RRUFE-TESLA-10.5";
        this.status = "INITIALIZING";
        
        // 🗄️ STRUKTURA E MEMORIES
        this.memoryStore = new Map();
        this.contextTree = new Map();
        this.associativeLinks = new Map();
        this.temporalIndex = new Map();
        
        // 📊 STATISTIKA
        this.stats = {
            totalMemories: 0,
            activeContexts: 0,
            associativeLinks: 0,
            memoryHits: 0,
            memoryMisses: 0
        };
        
        console.log('💾 ContextMemoryService po inicializohet...');
        this.initializeService();
    }

    async initializeService() {
        try {
            // KRIJO DREJTORINË E MEMORIES
            await this.ensureMemoryDirectory();
            
            // INICIALIZO STRUKTURAT BAZË
            await this.initializeMemoryStructures();
            
            // NGARKO MEMORITË E EKZISTUESHMES
            await this.loadPersistentMemories();
            
            this.status = "ACTIVE";
            console.log(`✅ ${this.serviceName} v${this.version} u inicializua me sukses!`);
            console.log(`📊 Memories të ngarkuara: ${this.stats.totalMemories}`);
            
            this.emit('service_ready', { 
                service: this.serviceName, 
                status: this.status,
                stats: this.stats
            });
            
        } catch (error) {
            console.error('❌ Gabim në inicializimin e ContextMemoryService:', error);
            this.status = "ERROR";
            this.emit('service_error', { error: error.message });
        }
    }

    async ensureMemoryDirectory() {
        const memoryDir = path.join(__dirname, '../data/memories');
        try {
            await fs.access(memoryDir);
        } catch {
            await fs.mkdir(memoryDir, { recursive: true });
            console.log('📁 U krijua drejtoria e memories:', memoryDir);
        }
    }

    async initializeMemoryStructures() {
        // INICIALIZO STRUKTURAT BAZË TË MEMORIES
        this.memoryStore.set('system_contexts', new Map());
        this.memoryStore.set('user_contexts', new Map());
        this.memoryStore.set('conversation_flows', new Map());
        this.memoryStore.set('emotional_patterns', new Map());
        
        console.log('🏗️  Strukturat e memories u inicializuan');
    }

    async loadPersistentMemories() {
        try {
            const memoryFile = path.join(__dirname, '../data/memories/context_memory.json');
            
            try {
                const data = await fs.readFile(memoryFile, 'utf8');
                const memories = JSON.parse(data);
                
                // NGARKO MEMORITË E RUAJTURA
                for (const [key, memory] of Object.entries(memories)) {
                    this.memoryStore.set(key, new Map(Object.entries(memory)));
                    this.stats.totalMemories++;
                }
                
                console.log(`📂 U ngarkuan ${Object.keys(memories).length} memories të ruajtura`);
            } catch (error) {
                console.log('📂 Nuk u gjetën memories të ruajtura, duke filluar nga zero');
                // KRIJO SKEDARIN BAZË
                await this.savePersistentMemories();
            }
            
        } catch (error) {
            console.log('⚠️  Nuk mund të ngarkohen memories e ruajtura:', error.message);
        }
    }

    // 🎯 METODAT KRYESORE TË MEMORIES

    async storeContext(contextId, contextData, metadata = {}) {
        console.log(`💾 Duke ruajtur kontekst: ${contextId}`);
        
        const memoryEntry = {
            id: contextId,
            data: contextData,
            metadata: {
                created: new Date().toISOString(),
                lastAccessed: new Date().toISOString(),
                accessCount: 0,
                ...metadata
            },
            associations: [],
            emotionalContext: null
        };

        // RUAJTJA NË MEMORY STORE
        this.memoryStore.get('system_contexts').set(contextId, memoryEntry);
        this.stats.totalMemories++;
        
        // KRIJO INDEKS KOHOR
        this.updateTemporalIndex(contextId, memoryEntry);
        
        // RUAJTJE PERSISTENTE
        await this.savePersistentMemories();
        
        this.emit('context_stored', { contextId, memoryEntry });
        return memoryEntry;
    }

    async retrieveContext(contextId, updateAccess = true) {
        console.log(`🔍 Duke kërkuar kontekst: ${contextId}`);
        
        const context = this.memoryStore.get('system_contexts').get(contextId);
        
        if (context) {
            if (updateAccess) {
                context.metadata.lastAccessed = new Date().toISOString();
                context.metadata.accessCount++;
                await this.savePersistentMemories();
            }
            
            this.stats.memoryHits++;
            this.emit('context_retrieved', { contextId, context });
            return context;
        }
        
        this.stats.memoryMisses++;
        this.emit('context_miss', { contextId });
        return null;
    }

    async createAssociation(sourceContext, targetContext, associationType, strength = 0.8) {
        const association = {
            source: sourceContext,
            target: targetContext,
            type: associationType,
            strength: strength,
            created: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };

        const associationId = `assoc_${sourceContext}_${targetContext}_${Date.now()}`;
        this.associativeLinks.set(associationId, association);
        this.stats.associativeLinks++;
        
        // PËRDITËSO KONTEKSTET
        await this.addAssociationToContext(sourceContext, associationId);
        await this.addAssociationToContext(targetContext, associationId);
        
        this.emit('association_created', { associationId, association });
        return associationId;
    }

    async addAssociationToContext(contextId, associationId) {
        const context = await this.retrieveContext(contextId, false);
        if (context) {
            context.associations.push(associationId);
            await this.storeContext(contextId, context.data, context.metadata);
        }
    }

    // 🔍 METODA TË KËRKIMIT DHE RIKUJTIMIT

    async searchByPattern(pattern, limit = 10) {
        const results = [];
        
        for (const [contextId, context] of this.memoryStore.get('system_contexts')) {
            if (this.matchesPattern(context, pattern)) {
                results.push({
                    contextId,
                    relevance: this.calculateRelevance(context, pattern),
                    context: context
                });
            }
        }
        
        // RENDIT SIPAS RELEVANCËS
        results.sort((a, b) => b.relevance - a.relevance);
        return results.slice(0, limit);
    }

    matchesPattern(context, pattern) {
        // IMPLEMENTO LOGJIKËN E KËRKIMIT TË MODELIT
        const contextString = JSON.stringify(context.data).toLowerCase();
        const patternString = JSON.stringify(pattern).toLowerCase();
        return contextString.includes(patternString);
    }

    calculateRelevance(context, pattern) {
        // LLOGARIT RELEVANCËN BAZuar NË PËRSHTATJE
        let relevance = 0.5; // RELEVANCË BAZË
        
        // SHTO RELEVANCË BAZuar NË FREKUENCËN E AKSESIT
        relevance += (context.metadata.accessCount / 100) * 0.3;
        
        // SHTO RELEVANCË BAZuar NË KOHËN E FUNDIT
        const daysSinceAccess = (new Date() - new Date(context.metadata.lastAccessed)) / (1000 * 60 * 60 * 24);
        relevance += (1 / (daysSinceAccess + 1)) * 0.2;
        
        return Math.min(1.0, relevance);
    }

    // 💾 MENAXHIMI I PERSISTENCE

    async savePersistentMemories() {
        try {
            const memoryFile = path.join(__dirname, '../data/memories/context_memory.json');
            const memories = {};
            
            // KONVERTO MAP NË OBJEKT
            for (const [key, map] of this.memoryStore) {
                memories[key] = Object.fromEntries(map);
            }
            
            await fs.writeFile(memoryFile, JSON.stringify(memories, null, 2));
            console.log('💾 Memories u ruajtën në skedar');
            
        } catch (error) {
            console.error('❌ Gabim në ruajtjen e memories:', error);
        }
    }

    updateTemporalIndex(contextId, memoryEntry) {
        const dateKey = new Date().toISOString().split('T')[0]; // VETËM DATA
        if (!this.temporalIndex.has(dateKey)) {
            this.temporalIndex.set(dateKey, new Set());
        }
        this.temporalIndex.get(dateKey).add(contextId);
    }

    // 📊 METODA DIAGNOSTIKE

    getServiceStatus() {
        return {
            service: this.serviceName,
            version: this.version,
            status: this.status,
            stats: this.stats,
            memoryStoreSize: this.memoryStore.size,
            associativeLinks: this.associativeLinks.size,
            temporalIndexSize: this.temporalIndex.size,
            timestamp: new Date().toISOString()
        };
    }

    getMemoryStats() {
        const systemContexts = this.memoryStore.get('system_contexts');
        const userContexts = this.memoryStore.get('user_contexts');
        
        return {
            totalSystemContexts: systemContexts ? systemContexts.size : 0,
            totalUserContexts: userContexts ? userContexts.size : 0,
            totalAssociations: this.associativeLinks.size,
            temporalEntries: this.temporalIndex.size,
            hitRate: this.stats.memoryHits / (this.stats.memoryHits + this.stats.memoryMisses) || 0
        };
    }
}

module.exports = ContextMemoryService;
