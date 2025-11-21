// ======================================================
// 🧠 KnowledgeDistiller.js - RRUFE-TESLA 10.5
// ======================================================
// SISTEM I RI PËR PËRVEÇIM DHE MËSIM NJOHURISH NGA GEMINI
// ======================================================

console.log("🚀 Duke ngarkuar KnowledgeDistiller...");

class KnowledgeDistiller {
    constructor() {
        this.name = "KnowledgeDistiller";
        this.version = "1.0";
        this.initialized = false;
        
        // 🗃️ BAZA E TË DHËNAVE E NJOHURIVE TË PËRVEÇURA
        this.distilledKnowledge = new Map();
        this.learningStats = new Map();
        
        // ⚙️ KONFIGURIM I MËSIMIT
        this.config = {
            learningThreshold: 2,      // Sa herë duhet pyetur për ta mësuar përgjigjmen
            maxKnowledgeEntries: 1000, // Numri maksimal i njohurive të ruajura
            minConfidence: 0.7,        // Besueshmëria minimale për të mësuar
            autoSaveInterval: 30000,   // 30 sekonda për ruajtje automatike
            chunkSize: 3               // Sa "chunks" njohurish për çdo përgjigje
        };
        
        // 🔤 FJALË KYÇE PËR ANALIZË
        this.keywordPatterns = {
            factual: ['është', 'ka', 'përbëhet', 'përmban', 'gjendet', 'ndodhet'],
            explanatory: ['funksionon', 'procesi', 'ndodh', 'shkak', 'efekt'],
            procedural: ['hapi', 'udhëzime', 'si të', 'mënyra', 'proces'],
            conceptual: ['koncepti', 'ideja', 'parimi', 'teoria', 'modeli']
        };
        
        console.log(`🎯 ${this.name} v${this.version} u instancua`);
    }

    // ==================== INICIALIZIMI ====================

    async initialize() {
        if (this.initialized) {
            console.log("⏩ KnowledgeDistiller tashmë është inicializuar");
            return true;
        }

        console.log("🔄 Duke inicializuar KnowledgeDistiller...");
        
        try {
            // Ngarko njohuritë e mësuara më parë
            await this.loadPersistentKnowledge();
            
            // Nis ruajtjen automatike
            this.startAutoSave();
            
            this.initialized = true;
            console.log("✅ KnowledgeDistiller u inicializua me sukses!");
            
            return true;
            
        } catch (error) {
            console.error("❌ Gabim në inicializimin e KnowledgeDistiller:", error);
            return false;
        }
    }

    // ==================== PËRVEÇIMI I NJOHURIVE ====================

    async distillAndLearn(question, geminiResponse) {
        console.log("🧠⚗️ Duke përvetësuar njohuri nga Gemini...");
        
        try {
            // 1. ANALIZO PËRGJIGJEN E GEMINI
            const analysis = this.analyzeGeminiResponse(geminiResponse);
            console.log("📊 Analiza e përgjigjes:", analysis);
            
            // 2. EKSTRAKO NJOHURITË KYÇE
            const knowledgeChunks = this.extractKnowledgeChunks(geminiResponse, question);
            console.log(`🧩 U ekstraktuan ${knowledgeChunks.length} chunks njohurish`);
            
            // 3. FILTRO & VERIFIKO CILËSINË
            const filteredKnowledge = this.filterAndValidate(knowledgeChunks, analysis);
            console.log(`🎪 Pas filtrimit: ${filteredKnowledge.length} chunks të mira`);
            
            // 4. PËRDITËSO STATISTIKAT E MËSIMIT
            this.updateLearningStats(question, filteredKnowledge.length);
            
            // 5. RUAJ NJOHURITË E PËRVEÇURA
            await this.storeDistilledKnowledge(question, filteredKnowledge, analysis);
            
            console.log(`✅ Përvetësuar me sukses ${filteredKnowledge.length} njohuri nga Gemini`);
            return filteredKnowledge;
            
        } catch (error) {
            console.error("❌ Gabim në përveçimin e njohurive:", error);
            return [];
        }
    }

    // 🔍 ANALIZA E THJESHTË E PËRGJIGJEVE TË GEMINI
    analyzeGeminiResponse(response) {
        const analysis = {
            length: response.length,
            sentenceCount: (response.match(/[.!?]+/g) || []).length,
            paragraphCount: (response.split('\n\n').filter(p => p.trim().length > 0)).length,
            hasLists: (response.match(/\d+\./g) || []).length > 0,
            hasFacts: this.containsFacts(response),
            hasExplanations: this.containsExplanations(response),
            hasProcedures: this.containsProcedures(response),
            confidence: this.calculateConfidence(response),
            complexity: this.measureComplexity(response)
        };
        
        return analysis;
    }

    // 🧩 EKSTRAKTIMI I NJOHURIVE NË "CHUNKS" TË MENÇUR
    extractKnowledgeChunks(response, originalQuestion) {
        const chunks = [];
        
        // 1. NDABE NË PARAGRAFË
        const paragraphs = response.split('\n\n').filter(p => p.trim().length > 20);
        
        paragraphs.forEach((paragraph, index) => {
            // 2. EKSTRAKTO FAKTE DHE KONCEPTE
            const facts = this.extractFacts(paragraph);
            const concepts = this.extractConcepts(paragraph);
            const explanations = this.extractExplanations(paragraph);
            
            // 3. KRIJO CHUNK VETËM NËSE KA NJOHURI TË VLERËSHME
            if (facts.length > 0 || concepts.length > 0 || explanations.length > 0) {
                const chunk = {
                    id: this.generateChunkId(originalQuestion, index),
                    type: this.determineChunkType(paragraph),
                    content: this.cleanContent(paragraph),
                    facts: facts,
                    concepts: concepts,
                    explanations: explanations,
                    sourceQuestion: originalQuestion,
                    sourceLength: response.length,
                    timestamp: Date.now(),
                    confidence: this.calculateChunkConfidence(paragraph)
                };
                
                chunks.push(chunk);
            }
        });
        
        // 4. KUFIZO NUMRIN E CHUNKS PËR PYETJE
        return chunks.slice(0, this.config.chunkSize);
    }

    // 🎪 PËRCAKTIMI I TIPIT TË CHUNK-UT
    determineChunkType(text) {
        const lowerText = text.toLowerCase();
        
        if (this.isFactual(lowerText)) return 'fact';
        if (this.isProcedural(lowerText)) return 'procedure';
        if (this.isConceptual(lowerText)) return 'concept';
        if (this.isExplanatory(lowerText)) return 'explanation';
        
        return 'general';
    }

    // 📊 FILTRIMI DHE VERIFIKIMI I CILËSISË
    filterAndValidate(knowledgeChunks, analysis) {
        return knowledgeChunks.filter(chunk => {
            // Heq përgjigje shumë të shkurtra
            if (chunk.content.length < 25) return false;
            
            // Heq përgjigje të paqarta
            if (this.isVagueResponse(chunk.content)) return false;
            
            // Heq përgjigje shumë të gjera
            if (this.isTooGeneral(chunk.content)) return false;
            
            // Verifikohu që ka substancë
            if (!this.hasSubstance(chunk.content)) return false;
            
            // Kontrollo besueshmërinë
            if (chunk.confidence < this.config.minConfidence) return false;
            
            return true;
        });
    }

    // ==================== METODA SHQYTËZUESE ====================

    // 🔍 KONTROLLO NËSE PËRMBAJ FAKTE
    containsFacts(text) {
        const factIndicators = ['është', 'ka', 'përmban', 'gjendet', 'ndodhet', 'vit', 'data'];
        return factIndicators.some(indicator => text.toLowerCase().includes(indicator));
    }

    // 💬 KONTROLLO NËSE PËRMBAJ SHPJEGIME
    containsExplanations(text) {
        const explanationIndicators = ['sepse', 'për shkak', 'për arsye', 'shkak', 'efekt', 'rezultat'];
        return explanationIndicators.some(indicator => text.toLowerCase().includes(indicator));
    }

    // 📝 KONTROLLO NËSE PËRMBAJ PROCEDURA
    containsProcedures(text) {
        const procedureIndicators = ['hapi', 'fillimisht', 'pastaj', 'më pas', 'në fund', 'udhëzime'];
        return procedureIndicators.some(indicator => text.toLowerCase().includes(indicator));
    }

    // 🧮 EKSTRAKTO FAKTE NGA TEKSTI
    extractFacts(text) {
        const facts = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        sentences.forEach(sentence => {
            if (this.isFactual(sentence.toLowerCase())) {
                facts.push(this.cleanSentence(sentence));
            }
        });
        
        return facts;
    }

    // 💡 EKSTRAKTO KONCEPTE
    extractConcepts(text) {
        const concepts = [];
        // Shto logjikë për ekstraktimin e koncepteve...
        return concepts;
    }

    // 🎓 EKSTRAKTO SHPJEGIME
    extractExplanations(text) {
        const explanations = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        sentences.forEach(sentence => {
            if (this.isExplanatory(sentence.toLowerCase())) {
                explanations.push(this.cleanSentence(sentence));
            }
        });
        
        return explanations;
    }

    // 📈 LLOGARIT BESUESHMËRINË
    calculateConfidence(text) {
        let confidence = 0.5; // Fillimisht
        
        // Shto pikë për gjatësi të mirë
        if (text.length > 100 && text.length < 1000) confidence += 0.2;
        
        // Shto pikë për strukturë të mirë
        if (text.includes('. ') && text.split('. ').length > 2) confidence += 0.1;
        
        // Shto pikë për fakte
        if (this.containsFacts(text)) confidence += 0.1;
        
        // Shto pikë për shpjegime
        if (this.containsExplanations(text)) confidence += 0.1;
        
        // Zbrit pikë për paqartësi
        if (this.isVagueResponse(text)) confidence -= 0.2;
        
        return Math.min(Math.max(confidence, 0.1), 1.0);
    }

    // 🧠 MATJA E KOMPLEKSITETIT
    measureComplexity(text) {
        const words = text.split(/\s+/).length;
        const sentences = (text.match(/[.!?]+/g) || []).length;
        const avgSentenceLength = words / Math.max(sentences, 1);
        
        if (avgSentenceLength < 10) return 'low';
        if (avgSentenceLength < 20) return 'medium';
        return 'high';
    }

    // ==================== MENAXHIMI I NJOHURIVE ====================

    // 💾 RUAJTJA E NJOHURIVE TË PËRVEÇURA
    async storeDistilledKnowledge(question, knowledgeChunks, analysis) {
        const questionKey = this.normalizeQuestion(question);
        
        // PËRDITËSO STATISTIKAT E MËSIMIT
        this.updateLearningStats(questionKey, knowledgeChunks.length);
        
        // RUAJ VETËM NËSE KA KALUAR PRAGUN E MËSIMIT
        if (this.shouldLearnPermanently(questionKey)) {
            knowledgeChunks.forEach(chunk => {
                const knowledgeKey = this.generateKnowledgeKey(chunk);
                
                if (!this.distilledKnowledge.has(knowledgeKey)) {
                    // NJOHURI E RE
                    this.distilledKnowledge.set(knowledgeKey, {
                        ...chunk,
                        learnedCount: 1,
                        firstLearned: Date.now(),
                        lastUsed: Date.now(),
                        usageCount: 0,
                        confidence: analysis.confidence
                    });
                } else {
                    // PËRDITËSO NJOHURI EKZISTUESE
                    const existing = this.distilledKnowledge.get(knowledgeKey);
                    existing.learnedCount++;
                    existing.lastUsed = Date.now();
                    existing.confidence = Math.max(existing.confidence, analysis.confidence);
                }
            });
            
            // KUFIZO MADHËSINË E BAZËS SË TË DHËNAVE
            this.enforceSizeLimit();
            
            // RUAJ NË PERSISTENT STORAGE
            await this.saveToPersistentStorage();
            
            console.log(`💾 Ruajtur ${knowledgeChunks.length} njohuri të reja`);
        }
    }

    // 📈 PËRDITËSIMI I STATISTIKAVE TË MËSIMIT
    updateLearningStats(questionKey, chunksCount = 0) {
        const currentStats = this.learningStats.get(questionKey) || {
            askCount: 0,
            totalChunks: 0,
            firstAsked: Date.now(),
            lastAsked: Date.now()
        };
        
        currentStats.askCount++;
        currentStats.totalChunks += chunksCount;
        currentStats.lastAsked = Date.now();
        
        this.learningStats.set(questionKey, currentStats);
    }

    // 🎯 VENDOS NËSE DUHET TË MËSOJË PËRGJIGJMIN
    shouldLearnPermanently(questionKey) {
        const stats = this.learningStats.get(questionKey);
        if (!stats) return false;
        
        return stats.askCount >= this.config.learningThreshold;
    }

    // ==================== METODA NDIHMËSE ====================

    // 🧹 PASTRO TEKSTIN
    cleanContent(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\n/g, ' ')
            .trim();
    }

    // 🧹 PASTRO FJALI
    cleanSentence(sentence) {
        return sentence
            .replace(/^[\s\W]+/, '')
            .replace(/[\s\W]+$/, '')
            .trim();
    }

    // 🔠 NORMALIZO PYETJEN PËR ÇELËS
    normalizeQuestion(question) {
        return question
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // 🆔 GJENERO ID UNIK PËR CHUNK
    generateChunkId(question, index) {
        return `chunk_${this.normalizeQuestion(question).substring(0, 20)}_${index}_${Date.now()}`;
    }

    // 🔑 GJENERO ÇELËS UNIK PËR NJOHURI
    generateKnowledgeKey(chunk) {
        return `knowledge_${chunk.type}_${this.normalizeQuestion(chunk.sourceQuestion).substring(0, 15)}_${chunk.facts.length}`;
    }

    // 📏 KUFIZO MADHËSINË E BAZËS SË TË DHËNAVE
    enforceSizeLimit() {
        if (this.distilledKnowledge.size > this.config.maxKnowledgeEntries) {
            // Fshi njohuritë më pak të përdorura
            const entries = Array.from(this.distilledKnowledge.entries());
            entries.sort((a, b) => a[1].lastUsed - b[1].lastUsed);
            
            const toDelete = entries.slice(0, entries.length - this.config.maxKnowledgeEntries);
            toDelete.forEach(([key]) => this.distilledKnowledge.delete(key));
            
            console.log(`🗑️ U fshinë ${toDelete.length} njohuri të vjetra`);
        }
    }

    // ==================== PERSISTENT STORAGE ====================

    // 💾 RUAJTJA NË LOCALSTORAGE
    async saveToPersistentStorage() {
        try {
            const dataToSave = {
                distilledKnowledge: Array.from(this.distilledKnowledge.entries()),
                learningStats: Array.from(this.learningStats.entries()),
                savedAt: Date.now(),
                version: this.version
            };
            
            localStorage.setItem('rrufe_knowledge_distiller', JSON.stringify(dataToSave));
            console.log("💾 Njohuritë u ruajtën në localStorage");
            
        } catch (error) {
            console.error("❌ Gabim në ruajtjen e njohurive:", error);
        }
    }

    // 📂 NGARKIMI NGA LOCALSTORAGE
    async loadPersistentKnowledge() {
        try {
            const savedData = localStorage.getItem('rrufe_knowledge_distiller');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                if (parsedData.distilledKnowledge) {
                    this.distilledKnowledge = new Map(parsedData.distilledKnowledge);
                }
                
                if (parsedData.learningStats) {
                    this.learningStats = new Map(parsedData.learningStats);
                }
                
                console.log(`📂 U ngarkuan ${this.distilledKnowledge.size} njohuri të mësuara`);
            }
            
        } catch (error) {
            console.error("❌ Gabim në ngarkimin e njohurive:", error);
        }
    }

    // ⏰ RUAJTJE AUTOMATIKE
    startAutoSave() {
        setInterval(() => {
            if (this.distilledKnowledge.size > 0) {
                this.saveToPersistentStorage();
            }
        }, this.config.autoSaveInterval);
    }

    // ==================== METODA VERIFIKIMI ====================

    // ❓ KONTROLLO NËSE ËSHTË PËRGJIGJE E PAQARTË
    isVagueResponse(text) {
        const vaguePatterns = [
            'nuk jam i sigurt',
            'nuk e di',
            'mund të jetë',
            'ndoshta',
            'ka shumë faktorë',
            'varet nga',
            'është e komplikuar'
        ];
        
        return vaguePatterns.some(pattern => text.toLowerCase().includes(pattern));
    }

    // 🌍 KONTROLLO NËSE ËSHTË SHUMË E GJERË
    isTooGeneral(text) {
        return text.length < 50 || text.split(' ').length < 10;
    }

    // 💎 KONTROLLO NËSE KA SUBSTANCË
    hasSubstance(text) {
        const words = text.split(/\s+/).length;
        const hasFacts = this.containsFacts(text);
        const hasExplanations = this.containsExplanations(text);
        
        return words >= 15 && (hasFacts || hasExplanations);
    }

    // ✅ KONTROLLO NËSE ËSHTË FAKTUAL
    isFactual(text) {
        return this.keywordPatterns.factual.some(keyword => text.includes(keyword));
    }

    // 🔄 KONTROLLO NËSE ËSHTË PROCEDURALE
    isProcedural(text) {
        return this.keywordPatterns.procedural.some(keyword => text.includes(keyword));
    }

    // 💭 KONTROLLO NËSE ËSHTË KONCEPTUALE
    isConceptual(text) {
        return this.keywordPatterns.conceptual.some(keyword => text.includes(keyword));
    }

    // 🎓 KONTROLLO NËSE ËSHTË SHPJEGUESE
    isExplanatory(text) {
        return this.keywordPatterns.explanatory.some(keyword => text.includes(keyword));
    }

    // 🎯 LLOGARIT BESUESHMËRINË E CHUNK-UT
    calculateChunkConfidence(chunkText) {
        let confidence = 0.5;
        
        // Shto pikë për gjatësi të mirë
        if (chunkText.length > 50) confidence += 0.2;
        
        // Shto pikë për strukturë të mirë
        if (chunkText.includes('. ')) confidence += 0.1;
        
        // Shto pikë për fakte
        if (this.containsFacts(chunkText)) confidence += 0.1;
        
        // Shto pikë për shpjegime
        if (this.containsExplanations(chunkText)) confidence += 0.1;
        
        return Math.min(Math.max(confidence, 0.1), 1.0);
    }

    // ==================== API PUBLIKE ====================

    // 🔍 KËRKO NJOHURI TË MËSUARA
    findLearnedKnowledge(question) {
        const questionKey = this.normalizeQuestion(question);
        const relevantKnowledge = [];
        
        // Kërko në të gjitha njohuritë
        for (const [key, knowledge] of this.distilledKnowledge) {
            if (knowledge.sourceQuestion.toLowerCase().includes(questionKey) ||
                questionKey.includes(this.normalizeQuestion(knowledge.sourceQuestion).substring(0, 10))) {
                relevantKnowledge.push(knowledge);
            }
        }
        
        return relevantKnowledge.sort((a, b) => b.confidence - a.confidence);
    }

    // 📊 MERR STATISTIKAT
    getStats() {
        return {
            name: this.name,
            version: this.version,
            initialized: this.initialized,
            totalKnowledge: this.distilledKnowledge.size,
            totalQuestions: this.learningStats.size,
            config: this.config
        };
    }

    // 🗑️ PASTRO NJOHURITË (PËR DEBUG)
    clearKnowledge() {
        this.distilledKnowledge.clear();
        this.learningStats.clear();
        localStorage.removeItem('rrufe_knowledge_distiller');
        console.log("🧹 Të gjitha njohuritë u fshinë");
    }
}

// ==================== EKSPORTIMI ====================

// Krijo instancë globale
window.KnowledgeDistiller = KnowledgeDistiller;

// Krijo instancë default
window.knowledgeDistiller = new KnowledgeDistiller();

// Auto-inicializim
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM u ngarkua - duke inicializuar KnowledgeDistiller...");
    
    setTimeout(async () => {
        await window.knowledgeDistiller.initialize();
        console.log("🎉 KnowledgeDistiller është gati për të mësuar nga Gemini!");
    }, 3000);
});

// ==================== TESTIMI ====================

// Funksion për testim të shpejtë
window.testKnowledgeDistiller = async function(question = "Çfarë është fotosinteza?", response = "Fotosinteza është procesi biokimik nëpërmjet të cilit bimët e shndërrojnë dritën e diellit në energji kimike. Ky proces ndodh në kloroplastet e qelizave bimore dhe përfshin absorbimin e dioksidit të karbonit dhe lëshimin e oksigjenit.") {
    console.log("🧪 TEST I KNOWLEDGE DISTILLER:");
    
    const result = await window.knowledgeDistiller.distillAndLearn(question, response);
    console.log("📝 Rezultati i përveçimit:", result);
    
    const stats = window.knowledgeDistiller.getStats();
    console.log("📊 Statistikat:", stats);
    
    return result;
};

console.log("✅ KnowledgeDistiller.js u ngarkua!");
