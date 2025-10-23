// ======================= QUANTUM MEMORY =======================
// 🧠 MODULI: QuantumMemory - Memorie Kuantike
// 📍 /public/js/modules/quantumMemory.js
// ===============================================================

console.log('⚛️ QUANTUM MEMORY u ngarkua!');

class QuantumMemory {
    constructor(contextMemory) {
        this.contextMemory = contextMemory;
        this.entangledPairs = new Map();
        this.superpositionStates = new Map();
        this.quantumCoherence = 0.95;
        
        console.log('🔮 QuantumMemory u inicializua!');
    }

    // ✅ KRIJO NDËRLIDHJE KUANTIKE
    createQuantumEntanglement(message1, message2) {
        const entanglementId = `entangle_${message1.id}_${message2.id}`;
        
        this.entangledPairs.set(entanglementId, {
            message1: message1.id,
            message2: message2.id,
            strength: this.calculateQuantumCoherence(message1, message2),
            created: new Date(),
            state: 'entangled'
        });

        console.log('🔗 Krijuam ndërlidhje kuantike:', entanglementId);
        return entanglementId;
    }

    // ✅ LLOGARIT KOHERENCË KUANTIKE
    calculateQuantumCoherence(msg1, msg2) {
        const sharedKeywords = msg1.keywords.filter(keyword => 
            msg2.keywords.includes(keyword)
        );
        
        const coherence = sharedKeywords.length / Math.max(
            msg1.keywords.length, 
            msg2.keywords.length
        );
        
        return coherence;
    }

    // ✅ GJENDJE SUPERPOZICIONI
    createSuperpositionState(query) {
        const possibleStates = Array.from(this.contextMemory.conversationContext)
            .filter(entry => 
                this.calculateQuantumMatch(entry, query) > 0.3
            )
            .slice(0, 5);
        
        this.superpositionStates.set(query, {
            states: possibleStates,
            created: new Date(),
            probability: possibleStates.length > 0 ? 0.8 : 0.2
        });

        console.log('🎭 Krijuam superpozicion me:', possibleStates.length, 'gjendje');
        return possibleStates;
    }

    // ✅ KOLAPS I GJENDJES KUANTIKE
    collapseQuantumState(query) {
        const superposition = this.superpositionStates.get(query);
        if (!superposition || superposition.states.length === 0) {
            return null;
        }

        // Zgjidh gjendjen më të mundshme
        const bestState = superposition.states.reduce((best, current) => 
            this.calculateQuantumMatch(current, query) > 
            this.calculateQuantumMatch(best, query) ? current : best
        );

        console.log('🎯 Kolaps kuantik - Gjendja e zgjedhur:', bestState.message.substring(0, 50));
        return bestState;
    }

    // ✅ LLOGARIT PËRSHTATJE KUANTIKE
    calculateQuantumMatch(entry, query) {
        const queryKeywords = this.contextMemory.extractKeywords(query);
        const keywordMatch = this.contextMemory.calculateMatchScore(entry.keywords, queryKeywords);
        
        // Bonus për ndërlidhje kuantike
        const entanglementBonus = Array.from(this.entangledPairs.values())
            .filter(entanglement => 
                entanglement.message1 === entry.id || 
                entanglement.message2 === entry.id
            ).length * 0.1;

        return Math.min(keywordMatch + entanglementBonus, 1.0);
    }

    // ✅ DEBUG QUANTUM MEMORY
    debugQuantumMemory() {
        console.log('🔍 DEBUG QUANTUM MEMORY:');
        console.log('- Ndërlidhje kuantike:', this.entangledPairs.size);
        console.log('- Gjendje superpozicioni:', this.superpositionStates.size);
        console.log('- Koherencë kuantike:', this.quantumCoherence);
        
        // Shfaq 3 ndërlidhjet më të forta
        const topEntanglements = Array.from(this.entangledPairs.entries())
            .sort((a, b) => b[1].strength - a[1].strength)
            .slice(0, 3);
        
        console.log('- Ndërlidhjet më të forta:');
        topEntanglements.forEach(([id, entanglement], index) => {
            console.log(`  ${index + 1}. ${id} - Forcë: ${entanglement.strength.toFixed(2)}`);
        });
    }
}

// Eksporto për përdorim global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumMemory;
} else {
    window.QuantumMemory = QuantumMemory;
}
