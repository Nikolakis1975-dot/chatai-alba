// ======================= GEMINI KNOWLEDGE ACCELERATOR =======================
// 🧠 MODULI: GeminiKnowledgeAccelerator - Përshpejtuesi i Njohurive nga Gemini
// 📍 INTEGRIM ME ContextMemory + QuantumMemory + TemporalContext
// ============================================================================

console.log('🚀 GEMINI KNOWLEDGE ACCELERATOR u ngarkua!');

class GeminiKnowledgeAccelerator {
    constructor(contextMemory, quantumMemory, temporalContext) {
        this.contextMemory = contextMemory;
        this.quantumMemory = quantumMemory;
        this.temporalContext = temporalContext;
        
        this.geminiKnowledgeBase = new Map();     // 💎 Baza e njohurive nga Gemini
        this.learningPatterns = new Map();        // 📚 Modelet e mësimit
        this.knowledgeConnections = new Map();    // 🔗 Lidhjet e njohurive
        this.optimizationMetrics = new Map();     // 📊 Metrikat e optimizimit
        
        console.log('🚀 GeminiKnowledgeAccelerator u inicializua!');
    }

    // ✅ KAPJA DHE RUAJTJA E NJOHURIVE NGA GEMINI
    captureGeminiKnowledge(geminiResponse, userQuery, context) {
        const knowledgeEntry = {
            id: `gemini_knowledge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            query: userQuery,
            response: geminiResponse,
            context: context,
            timestamp: new Date(),
            confidence: this.calculateResponseConfidence(geminiResponse),
            keywords: this.extractKnowledgeKeywords(geminiResponse),
            category: this.categorizeKnowledge(geminiResponse),
            importance: this.calculateKnowledgeImportance(geminiResponse, userQuery)
        };

        // Ruaj në bazën e njohurive
        this.geminiKnowledgeBase.set(knowledgeEntry.id, knowledgeEntry);
        
        // Krijo lidhje kuantike me kontekstin ekzistues
        this.createKnowledgeConnections(knowledgeEntry);
        
        // Optimizo kontekst memory me njohuri të reja
        this.optimizeContextWithNewKnowledge(knowledgeEntry);
        
        console.log('💎 Kapja e njohurive nga Gemini:', knowledgeEntry.keywords.length + ' fjalë kyçe');
        return knowledgeEntry.id;
    }

    // ✅ EKSTRAKTIM I FJALËVE KYÇE TË NJOHURIVE
    extractKnowledgeKeywords(response) {
        // Përdor ContextMemory për ekstraktim të avancuar
        const keywords = this.contextMemory.extractKeywords(response);
        
        // Shto fjalë kyçe specifike për njohuri
        const knowledgeKeywords = [
            'dije', 'informacion', 'këshillë', 'udhëzim', 'shpjegim',
            'koncept', 'parim', 'rregull', 'strategji', 'metodë',
            'teknikë', 'proces', 'sistem', 'model', 'teori'
        ];
        
        return [...new Set([...keywords, ...knowledgeKeywords.filter(kw => 
            response.toLowerCase().includes(kw)
        )])];
    }

    // ✅ KLASIFIKIM I NJOHURIVE
    categorizeKnowledge(response) {
        const categories = {
            technical: ['kod', 'programim', 'teknologji', 'software', 'hardware', 'algorithm'],
            educational: ['mëso', 'shkollë', 'universitet', 'trajnim', 'edukim', 'kurs'],
            practical: ['udhëzim', 'tutorial', 'hap pas hapi', 'praktik', 'implementim'],
            creative: ['ide', 'kreativ', 'inovacion', 'shpikje', 'dizajn'],
            analytical: ['analizë', 'krahasim', 'studim', 'hulumtim', 'statistikë']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => response.toLowerCase().includes(keyword))) {
                return category;
            }
        }
        
        return 'general';
    }

    // ✅ KRIJIM I LIDHJEVE KUANTIKE ME NJOHURI TË REJA
    createKnowledgeConnections(newKnowledge) {
        // Gjej njohuri të ngjashme ekzistuese
        const similarKnowledge = Array.from(this.geminiKnowledgeBase.values())
            .filter(knowledge => 
                knowledge.id !== newKnowledge.id &&
                this.calculateKnowledgeSimilarity(knowledge, newKnowledge) > 0.6
            );

        // Krijo lidhje kuantike për çdo njohuri të ngjashme
        similarKnowledge.forEach(existingKnowledge => {
            const connectionId = this.quantumMemory.createQuantumEntanglement(
                { id: newKnowledge.id, keywords: newKnowledge.keywords },
                { id: existingKnowledge.id, keywords: existingKnowledge.keywords }
            );
            
            this.knowledgeConnections.set(connectionId, {
                knowledge1: newKnowledge.id,
                knowledge2: existingKnowledge.id,
                similarity: this.calculateKnowledgeSimilarity(existingKnowledge, newKnowledge),
                strength: 0.8 // Forcë e lartë për lidhje njohurish
            });
        });

        console.log('🔗 Krijuam', similarKnowledge.length, 'lidhje njohurish të reja');
    }

    // ✅ OPTIMIZIM I KONTEKSTIT ME NJOHURI TË REJA
    optimizeContextWithNewKnowledge(knowledge) {
        // Përditëso kontekst memory me njohuri të reja të rëndësishme
        if (knowledge.importance >= 7) {
            this.contextMemory.addToContext(
                `💎 [GEMINI KNOWLEDGE] ${knowledge.response.substring(0, 100)}...`,
                'gemini_knowledge',
                knowledge.response
            );
        }

        // Përditëso Temporal Context me timeline të ri njohurish
        this.temporalContext.createTemporalMap(
            Array.from(this.geminiKnowledgeBase.values())
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 20)
        );
    }

    // ✅ KËRKIM I NJOHURIVE TË AKKUMULUARA
    searchAccumulatedKnowledge(query, minConfidence = 0.7) {
        const results = [];
        const queryKeywords = this.contextMemory.extractKeywords(query);

        this.geminiKnowledgeBase.forEach(knowledge => {
            const similarity = this.calculateKnowledgeSimilarity(
                { keywords: queryKeywords },
                knowledge
            );
            
            if (similarity >= minConfidence) {
                results.push({
                    knowledge: knowledge,
                    similarity: similarity,
                    confidence: knowledge.confidence,
                    category: knowledge.category
                });
            }
        });

        // Rendit sipas relevancës
        results.sort((a, b) => (b.similarity * b.confidence) - (a.similarity * a.confidence));
        
        return results.slice(0, 5); // Kthe 5 rezultatet më të mira
    }

    // ✅ LLOGARITJE E NGJASHMËRISË SË NJOHURIVE
    calculateKnowledgeSimilarity(knowledge1, knowledge2) {
        const keywords1 = Array.isArray(knowledge1.keywords) ? knowledge1.keywords : [];
        const keywords2 = Array.isArray(knowledge2.keywords) ? knowledge2.keywords : [];
        
        if (keywords1.length === 0 || keywords2.length === 0) return 0;
        
        const commonKeywords = keywords1.filter(keyword => 
            keywords2.includes(keyword)
        );
        
        return commonKeywords.length / Math.max(keywords1.length, keywords2.length);
    }

    // ✅ LLOGARITJE E RËNDËSISË SË NJOHURIVE
    calculateKnowledgeImportance(response, originalQuery) {
        let importance = 5; // Default
        
        // Rrit rëndësinë për përgjigje të gjata dhe të detajuara
        if (response.length > 200) importance += 2;
        if (response.includes('rëndësi') || response.includes('kritike')) importance += 3;
        
        // Rrit rëndësinë për pyetje komplekse
        const complexQueryKeywords = ['si', 'pse', 'kur', 'ku', 'kush', 'çfarë'];
        if (complexQueryKeywords.some(keyword => originalQuery.includes(keyword))) {
            importance += 2;
        }
        
        // Rrit rëndësinë për përgjigje të strukturuara
        if (response.includes('1.') || response.includes('- ') || response.includes('•')) {
            importance += 1;
        }
        
        return Math.min(importance, 10);
    }

    // ✅ LLOGARITJE E BESUESHMËRISË SË PËRGJIGJES
    calculateResponseConfidence(response) {
        let confidence = 0.7; // Default Gemini confidence
        
        // Rrit besueshmërinë për përgjigje të strukturuara
        if (response.includes('1.') || response.includes('- ')) confidence += 0.1;
        if (response.includes('http') || response.includes('www')) confidence += 0.1;
        if (response.length > 100) confidence += 0.1;
        if (response.includes('parim') || response.includes('rregull')) confidence += 0.1;
        
        return Math.min(confidence, 0.95);
    }

    // ✅ STATISTIKA E NJOHURIVE
    getKnowledgeStats() {
        const categories = {};
        this.geminiKnowledgeBase.forEach(knowledge => {
            categories[knowledge.category] = (categories[knowledge.category] || 0) + 1;
        });

        return {
            totalKnowledge: this.geminiKnowledgeBase.size,
            totalConnections: this.knowledgeConnections.size,
            categories: categories,
            averageConfidence: Array.from(this.geminiKnowledgeBase.values())
                .reduce((sum, k) => sum + k.confidence, 0) / this.geminiKnowledgeBase.size || 0,
            averageImportance: Array.from(this.geminiKnowledgeBase.values())
                .reduce((sum, k) => sum + k.importance, 0) / this.geminiKnowledgeBase.size || 0
        };
    }

    // ✅ PASTRIMM I NJOHURIVE TË VJETERA
    cleanupOldKnowledge(maxAgeHours = 24) {
        const cutoffTime = new Date(Date.now() - (maxAgeHours * 60 * 60 * 1000));
        let cleanedCount = 0;

        this.geminiKnowledgeBase.forEach((knowledge, id) => {
            if (new Date(knowledge.timestamp) < cutoffTime && knowledge.importance < 6) {
                this.geminiKnowledgeBase.delete(id);
                cleanedCount++;
            }
        });

        console.log('🧹 Pastruam', cleanedCount, 'njohuri të vjetra');
        return cleanedCount;
    }

    // ✅ DEBUG GEMINI KNOWLEDGE ACCELERATOR
    debugKnowledgeAccelerator() {
        const stats = this.getKnowledgeStats();
        
        console.log('🔍 DEBUG GEMINI KNOWLEDGE ACCELERATOR:');
        console.log('- Njohuri të akumuluara:', stats.totalKnowledge);
        console.log('- Lidhje njohurish:', stats.totalConnections);
        console.log('- Besueshmëri mesatare:', stats.averageConfidence.toFixed(2));
        console.log('- Rëndësi mesatare:', stats.averageImportance.toFixed(2));
        console.log('- Kategoritë:', stats.categories);
        
        // Shfaq 3 njohuritë më të fundit
        const recentKnowledge = Array.from(this.geminiKnowledgeBase.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 3);
        
        console.log('- Njohuritë e fundit:');
        recentKnowledge.forEach((knowledge, index) => {
            console.log(`  ${index + 1}. [${knowledge.category}] "${knowledge.query.substring(0, 30)}..."`);
            console.log(`     📊 Rëndësia: ${knowledge.importance} | Besueshmëria: ${knowledge.confidence.toFixed(2)}`);
        });
    }
}

// Eksporto për përdorim global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiKnowledgeAccelerator;
} else {
    window.GeminiKnowledgeAccelerator = GeminiKnowledgeAccelerator;
}

console.log('💎 GEMINI KNOWLEDGE ACCELERATOR u inicializua me sukses!');
