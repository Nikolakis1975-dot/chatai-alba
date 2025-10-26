// ======================================================
// ⚛️ QUANTUM MEMORY MODULE - RRUFE-TESLA
// ======================================================

class QuantumMemory {
    constructor(contextMemory) {
        this.contextMemory = contextMemory;
        this.entangledPairs = new Map();
        this.superpositionStates = new Map();
        this.quantumConnections = new Map();
        
        console.log('⚛️ QUANTUM MEMORY u inicializua!');
        this.initializeQuantumSystem();
    }

    initializeQuantumSystem() {
        // Inicializo sistemin kuantik bazë
        this.quantumStates = {
            ALIVE: 'superposition_alive',
            ENTANGLED: 'quantum_entangled', 
            COLLAPSED: 'waveform_collapsed',
            COHERENT: 'quantum_coherent'
        };
        
        this.quantumConstants = {
            PLANCK_CONSTANT: 6.626e-34,
            ENTANGLEMENT_THRESHOLD: 0.85,
            SUPERPOSITION_LIMIT: 100
        };
    }

    createQuantumEntanglement(message1, message2) {
        const entanglementId = `entangle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const entanglement = {
            id: entanglementId,
            particles: [message1.id, message2.id],
            strength: this.calculateEntanglementStrength(message1, message2),
            created: new Date(),
            quantumState: this.quantumStates.ENTANGLED
        };
        
        this.entangledPairs.set(entanglementId, entanglement);
        
        // Krijo lidhje kuantike
        this.createQuantumConnection(message1, message2, entanglement.strength);
        
        console.log(`🔗 Krijova entanglement kuantik: ${entanglementId} (forcë: ${entanglement.strength.toFixed(2)})`);
        return entanglementId;
    }

    calculateEntanglementStrength(msg1, msg2) {
        let strength = 0;
        
        // Ngjashmëri semantike
        const semanticSimilarity = this.calculateSemanticSimilarity(msg1.message, msg2.message);
        strength += semanticSimilarity * 0.6;
        
        // Lidhje kohore
        const timeDiff = Math.abs(new Date(msg1.timestamp) - new Date(msg2.timestamp));
        const timeStrength = Math.max(0, 1 - (timeDiff / (1000 * 60 * 60 * 24))); // 24 orë
        strength += timeStrength * 0.3;
        
        // Rëndësi e përbashkët
        const importanceAvg = (msg1.importance + msg2.importance) / 20; // Normalizo
        strength += importanceAvg * 0.1;
        
        return Math.min(strength, 1.0);
    }

    calculateSemanticSimilarity(text1, text2) {
        const words1 = this.extractKeywords(text1);
        const words2 = this.extractKeywords(text2);
        
        if (words1.length === 0 || words2.length === 0) return 0;
        
        const commonWords = words1.filter(word => words2.includes(word));
        const similarity = commonWords.length / Math.max(words1.length, words2.length);
        
        return similarity;
    }

    extractKeywords(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }

    createQuantumConnection(sourceMsg, targetMsg, strength) {
        const connectionId = `quantum_conn_${sourceMsg.id}_${targetMsg.id}`;
        
        const connection = {
            id: connectionId,
            source: sourceMsg.id,
            target: targetMsg.id,
            strength: strength,
            quantumState: this.quantumStates.COHERENT,
            created: new Date()
        };
        
        this.quantumConnections.set(connectionId, connection);
        return connectionId;
    }

    // 🧠 METODA TË REJA RRUFE-TESLA
    createSuperpositionState(messages) {
        const superpositionId = `superpos_${Date.now()}`;
        
        const superposition = {
            id: superpositionId,
            messages: messages.map(msg => msg.id),
            quantumState: this.quantumStates.ALIVE,
            created: new Date(),
            collapseThreshold: 0.7
        };
        
        this.superpositionStates.set(superpositionId, superposition);
        console.log(`🌀 Krijova superposition state me ${messages.length} mesazhe`);
        
        return superpositionId;
    }

    collapseSuperposition(superpositionId, triggerMessage) {
        const superposition = this.superpositionStates.get(superpositionId);
        if (!superposition) return null;
        
        // Proceso kolapsin e valës kuantike
        const collapsedState = {
            originalSuperposition: superpositionId,
            trigger: triggerMessage.id,
            collapsedAt: new Date(),
            resultingContext: this.generateCollapsedContext(superposition, triggerMessage)
        };
        
        // Largo superposition
        this.superpositionStates.delete(superpositionId);
        
        console.log(`💥 Superposition u kolapsua nga: ${triggerMessage.message.substring(0, 30)}`);
        return collapsedState;
    }

    generateCollapsedContext(superposition, trigger) {
        // Gjenero kontekst të ri bazuar në kolapsin kuantik
        const contextMessages = superposition.messages.slice(0, 3);
        return `Kontekst kuantik: ${trigger.message} → [${contextMessages.join(', ')}]`;
    }

    debugQuantumMemory() {
        console.log('🔮 DEBUG QUANTUM MEMORY:');
        console.log(`- Entangled Pairs: ${this.entangledPairs.size}`);
        console.log(`- Superposition States: ${this.superpositionStates.size}`);
        console.log(`- Quantum Connections: ${this.quantumConnections.size}`);
        
        // Shfaq disa entanglements
        if (this.entangledPairs.size > 0) {
            console.log('🔗 Entanglements aktive:');
            this.entangledPairs.forEach((entanglement, id) => {
                console.log(`   ${id}: forcë ${entanglement.strength.toFixed(2)}`);
            });
        }
    }

    // 🚀 METODA E RE: Quantum Context Enhancement
    enhanceContextWithQuantumMemory() {
        if (this.contextMemory.conversationContext.length >= 2) {
            const recentMessages = this.contextMemory.conversationContext.slice(0, 2);
            this.createQuantumEntanglement(recentMessages[0], recentMessages[1]);
        }
    }
}
