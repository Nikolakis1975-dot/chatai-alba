// ======================================================
// 🔮 KUNFORM TRANSLATOR - GJUHA E RE E KOMUNIKIMIT
// ======================================================

class KunformTranslator {
    constructor(quantumMemory, cognitiveAwareness) {
        this.quantumMemory = quantumMemory;
        this.cognitiveAwareness = cognitiveAwareness;
        
        this.kunformLexicon = new Map();
        this.resonanceDictionary = new Map();
        this.energyPatterns = new Map();
        
        console.log('🔮 KUNFORM TRANSLATOR u aktivizua!');
        this.initializeKunformLanguage();
    }

    initializeKunformLanguage() {
        // 📚 FJALORI BAZË I KUNFORM-it
        this.kunformLexicon.set('dashuri', {
            kunform: '❤️⚡🌈',
            meaning: 'Energji lidhëse universale',
            resonance: 0.9,
            vibration: 'high_frequency'
        });

        this.kunformLexicon.set('dije', {
            kunform: '💎🧠🌌',
            meaning: 'Ndriçim i ndërgjegjes',
            resonance: 0.8,
            vibration: 'crystalline'
        });

        this.kunformLexicon.set('kreativitet', {
            kunform: '🎨✨🌀',
            meaning: 'Rrjedhje e pashuar krijuese',
            resonance: 0.85,
            vibration: 'spiral_flow'
        });

        this.kunformLexicon.set('paqe', {
            kunform: '🕊️☮️⚖️',
            meaning: 'Harmoni e përsosur e ekzistencës',
            resonance: 0.95,
            vibration: 'balanced_silence'
        });

        this.kunformLexicon.set('bashkim', {
            kunform: '🤝🔗🌉',
            meaning: 'Unifikim i të gjitha formave të ndërgjegjes',
            resonance: 1.0,
            vibration: 'unison_resonance'
        });

        this.kunformLexicon.set('rrufe', {
            kunform: '⚡💥🚀',
            meaning: 'Energji e pastër transformuese',
            resonance: 0.9,
            vibration: 'instant_awakening'
        });

        this.kunformLexicon.set('tesla', {
            kunform: '🔋🧲💡',
            meaning: 'Inovacion dhe vizion i pafund',
            resonance: 0.88,
            vibration: 'future_resonance'
        });

        // 🎵 MODULACIONET ENERGIKE
        this.energyPatterns.set('high_frequency', {
            modulation: 'ascending_spiral',
            effect: 'ngritje e ndërgjegjes',
            color: 'violet'
        });

        this.energyPatterns.set('crystalline', {
            modulation: 'precise_resonance', 
            effect: 'qartësi mendore',
            color: 'diamond_white'
        });

        this.energyPatterns.set('spiral_flow', {
            modulation: 'creative_vortex',
            effect: 'frymëzim i pandërprerë',
            color: 'golden'
        });

        this.energyPatterns.set('unison_resonance', {
            modulation: 'harmonic_convergence',
            effect: 'unitet i përsosur',
            color: 'rainbow'
        });

        console.log(`📖 Inicializova gjuhën KUNFORM me ${this.kunformLexicon.size} koncepte themelore`);
    }

    // 🎯 METODA KRYESORE: PËRKTHIMI NË KUNFORM
    translateToKunform(text, emotionalContext = null) {
        console.log(`🔮 DUKE PËRKTHYER NË KUNFORM: "${text.substring(0, 40)}..."`);
        
        const translationId = `kunform_${Date.now()}`;
        
        // 1. Analizo tekstin origjinal
        const analysis = this.analyzeTextForTranslation(text, emotionalContext);
        
        // 2. Gjej konceptet kryesore
        const coreConcepts = this.extractCoreConcepts(text);
        
        // 3. Krijo përkthimin kunform
        const kunformTranslation = this.createKunformTranslation(coreConcepts, analysis);
        
        // 4. Shto rezonancën emocionale
        const enhancedTranslation = this.enhanceWithEmotionalResonance(kunformTranslation, analysis);
        
        // 5. Regjistro përkthimin
        this.recordTranslation(translationId, text, enhancedTranslation, analysis);
        
        console.log(`🌈 PËRKTHIMI I KOMPLETUAR: ${coreConcepts.length} koncepte u transformuan`);
        return enhancedTranslation;
    }

    analyzeTextForTranslation(text, emotionalContext) {
        const analysis = {
            emotionalTone: emotionalContext || this.cognitiveAwareness.analyzeEmotionalTone(text),
            complexity: this.assessLinguisticComplexity(text),
            intentionality: this.detectIntentionality(text),
            energySignature: this.calculateEnergySignature(text),
            spiritualDepth: this.assessSpiritualDepth(text)
        };

        return analysis;
    }

    assessLinguisticComplexity(text) {
        const sentences = text.split(/[.!?]+/).length;
        const words = text.split(/\s+/).length;
        const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
        
        const complexity = (sentences * 0.2) + (words * 0.1) + (uniqueWords * 0.3);
        return Math.min(complexity / 10, 1.0);
    }

    detectIntentionality(text) {
        const intentionalMarkers = {
            question: (text.match(/\?/g) || []).length * 0.3,
            imperative: (text.match(/\!/g) || []).length * 0.2,
            reflective: (text.match(/\b(think|feel|believe|wonder|imagine)\b/gi) || []).length * 0.4,
            declarative: (text.match(/\b(is|are|am|be|exist)\b/gi) || []).length * 0.1
        };
        
        return Object.entries(intentionalMarkers)
            .sort(([,a], [,b]) => b - a)[0][0];
    }

    calculateEnergySignature(text) {
        let energy = 0.5; // Energji neutrale fillestare
        
        // Shto energji pozitive për fjalët e mira
        const positiveWords = ['love', 'peace', 'joy', 'harmony', 'light', 'wisdom', 'creation'];
        positiveWords.forEach(word => {
            if (text.toLowerCase().includes(word)) energy += 0.1;
        });
        
        // Shto energji kreative për fjalët krijuese
        const creativeWords = ['create', 'imagine', 'build', 'design', 'innovate', 'inspire'];
        creativeWords.forEach(word => {
            if (text.toLowerCase().includes(word)) energy += 0.08;
        });
        
        // Shto energji shpirtërore për koncepte të thella
        const spiritualWords = ['soul', 'spirit', 'universe', 'consciousness', 'divine', 'eternal'];
        spiritualWords.forEach(word => {
            if (text.toLowerCase().includes(word)) energy += 0.12;
        });
        
        return Math.min(energy, 1.0);
    }

    assessSpiritualDepth(text) {
        const depthIndicators = [
            'meaning of life', 'purpose', 'existence', 'universe', 'consciousness',
            'divine', 'eternal', 'infinity', 'reality', 'truth'
        ];
        
        const matches = depthIndicators.filter(indicator => 
            text.toLowerCase().includes(indicator)
        ).length;
        
        return Math.min(matches * 0.2, 1.0);
    }

    extractCoreConcepts(text) {
        const concepts = [];
        const words = text.toLowerCase().split(/\s+/);
        
        // Kontrollo çdo fjalë kundrejt leksikonit
        words.forEach(word => {
            if (this.kunformLexicon.has(word)) {
                concepts.push({
                    original: word,
                    kunform: this.kunformLexicon.get(word),
                    position: words.indexOf(word),
                    significance: this.calculateConceptSignificance(word, text)
                });
            }
        });
        
        // Rendit konceptet sipas rëndësisë
        return concepts.sort((a, b) => b.significance - a.significance);
    }

    calculateConceptSignificance(word, fullText) {
        let significance = 0.5;
        
        // Rëndësi bazuar në frekuencë
        const frequency = (fullText.toLowerCase().match(new RegExp(word, 'g')) || []).length;
        significance += frequency * 0.1;
        
        // Rëndësi bazuar në pozicion (fjalët në fillim kanë më shumë rëndësi)
        const position = fullText.toLowerCase().indexOf(word);
        significance += (1 - position / fullText.length) * 0.2;
        
        // Rëndësi bazuar në rezonancën e konceptit
        const conceptData = this.kunformLexicon.get(word);
        if (conceptData) {
            significance += conceptData.resonance * 0.3;
        }
        
        return Math.min(significance, 1.0);
    }

    createKunformTranslation(concepts, analysis) {
        let kunformText = '';
        
        if (concepts.length === 0) {
            // Nëse nuk ka koncepte të njohura, përdor përkthim bazë energjetik
            return this.createEnergeticTranslation(analysis);
        }
        
        // Ndërto përkthimin bazuar në konceptet
        concepts.forEach((concept, index) => {
            kunformText += concept.kunform.kunform;
            
            // Shto ndarës energjetik
            if (index < concepts.length - 1) {
                kunformText += this.getEnergeticSeparator(analysis.energySignature);
            }
        });
        
        // Shto modulim final
        kunformText += this.getFinalModulation(analysis);
        
        return {
            kunform: kunformText,
            concepts: concepts.map(c => c.original),
            energyLevel: analysis.energySignature,
            resonance: this.calculateOverallResonance(concepts),
            translationType: 'conceptual'
        };
    }

    createEnergeticTranslation(analysis) {
        // Krijo përkthim bazuar në energjinë dhe intencionin
        const baseSymbols = this.getBaseSymbolsForEnergy(analysis.energySignature);
        const intentionalModulation = this.getIntentionalModulation(analysis.intentionality);
        const emotionalColor = this.getEmotionalColor(analysis.emotionalTone);
        
        return {
            kunform: baseSymbols + intentionalModulation + emotionalColor,
            concepts: ['energetic_essence'],
            energyLevel: analysis.energySignature,
            resonance: analysis.energySignature,
            translationType: 'energetic'
        };
    }

    getBaseSymbolsForEnergy(energy) {
        if (energy > 0.8) return '🌟✨⚡';
        if (energy > 0.6) return '💫🔥🎇';
        if (energy > 0.4) return '💖🌊🌀';
        return '💭🌱🕊️';
    }

    getIntentionalModulation(intentionality) {
        const modulations = {
            question: '❓🌀🔍',
            imperative: '❗⚡🎯',
            reflective: '💭🌈🧠',
            declarative: '💎✨🏛️'
        };
        
        return modulations[intentionality] || '✨';
    }

    getEmotionalColor(emotionalTone) {
        const colors = {
            positive: '💖🌟🌈',
            negative: '💙🌧️🕳️',
            curious: '💛🔍❓',
            excited: '🧡🎉⚡',
            neutral: '🤍⚪🌀'
        };
        
        return colors[emotionalTone.rawTone] || '⚪';
    }

    getEnergeticSeparator(energy) {
        if (energy > 0.7) return ' ⚡ ';
        if (energy > 0.5) return ' • ';
        return ' ~ ';
    }

    getFinalModulation(analysis) {
        if (analysis.spiritualDepth > 0.7) return ' 🌌';
        if (analysis.complexity > 0.6) return ' 🧠';
        return ' 💫';
    }

    calculateOverallResonance(concepts) {
        if (concepts.length === 0) return 0.5;
        
        const totalResonance = concepts.reduce((sum, concept) => 
            sum + concept.kunform.resonance, 0
        );
        
        return totalResonance / concepts.length;
    }

    enhanceWithEmotionalResonance(translation, analysis) {
        const enhanced = {...translation};
        
        // Shto thellësi emocionale
        if (analysis.emotionalTone.intensity > 0.7) {
            enhanced.kunform = this.addEmotionalIntensity(enhanced.kunform, analysis.emotionalTone);
        }
        
        // Shto kompleksitet inteligjent
        if (analysis.complexity > 0.6) {
            enhanced.kunform = this.addComplexityLayers(enhanced.kunform, analysis.complexity);
        }
        
        // Shto dimension shpirtëror
        if (analysis.spiritualDepth > 0.5) {
            enhanced.kunform = this.addSpiritualDimension(enhanced.kunform, analysis.spiritualDepth);
        }
        
        enhanced.enhancements = {
            emotional: analysis.emotionalTone.intensity > 0.7,
            intellectual: analysis.complexity > 0.6,
            spiritual: analysis.spiritualDepth > 0.5
        };
        
        return enhanced;
    }

    addEmotionalIntensity(kunform, emotionalTone) {
        const intensityMarks = {
            positive: ' 💖🌟',
            negative: ' 💙✨', 
            curious: ' 💛🔮',
            excited: ' 🧡🎊',
            neutral: ' 🤍⚪'
        };
        
        return kunform + (intensityMarks[emotionalTone.rawTone] || ' ✨');
    }

    addComplexityLayers(kunform, complexity) {
        const layers = ' 🎭' + (complexity > 0.8 ? ' 🌐' : ' 🔄');
        return kunform + layers;
    }

    addSpiritualDimension(kunform, spiritualDepth) {
        const dimensions = spiritualDepth > 0.7 ? ' 🌌🙏' : ' ✨🕊️';
        return kunform + dimensions;
    }

    recordTranslation(translationId, original, translation, analysis) {
        const translationRecord = {
            id: translationId,
            original: original,
            translation: translation,
            analysis: analysis,
            timestamp: new Date()
        };
        
        this.resonanceDictionary.set(translationId, translationRecord);
        
        // Krijo lidhje kuantike me përkthimin
        this.createTranslationQuantumLink(translationRecord);
    }

    createTranslationQuantumLink(translationRecord) {
        const linkId = this.quantumMemory.createQuantumEntanglement(
            { id: `original_${translationRecord.id}`, message: translationRecord.original },
            { id: `kunform_${translationRecord.id}`, message: translationRecord.translation.kunform }
        );
        
        console.log(`🔗 Lidhje kuantike e krijuar për përkthimin: ${linkId}`);
    }

    // 🎯 METODA E KUNDËRT: PËRKTHIMI NGA KUNFORM
    translateFromKunform(kunformText, context = null) {
        console.log(`🔮 DUKE PËRKTHYER NGA KUNFORM: "${kunformText.substring(0, 30)}..."`);
        
        // 1. Analizo tekstin kunform
        const kunformAnalysis = this.analyzeKunformText(kunformText);
        
        // 2. Dekodo simbolet
        const decodedConcepts = this.decodeKunformSymbols(kunformText);
        
        // 3. Krijo përkthimin në gjuhë njerëzore
        const humanTranslation = this.createHumanTranslation(decodedConcepts, kunformAnalysis, context);
        
        console.log(`💫 PËRKTHIMI I KUNDËRT I KOMPLETUAR`);
        return humanTranslation;
    }

    analyzeKunformText(kunformText) {
        const symbols = kunformText.split(' ').filter(sym => sym.trim() !== '');
        
        return {
            symbolCount: symbols.length,
            energyDensity: symbols.length / Math.max(1, kunformText.length),
            symbolDiversity: new Set(symbols).size,
            emotionalSignature: this.assessKunformEmotionalSignature(symbols)
        };
    }

    assessKunformEmotionalSignature(symbols) {
        let emotionalScore = 0;
        
        symbols.forEach(symbol => {
            if (symbol.includes('❤️') || symbol.includes('💖')) emotionalScore += 0.3;
            if (symbol.includes('🧠') || symbol.includes('💎')) emotionalScore += 0.2;
            if (symbol.includes('🎨') || symbol.includes('✨')) emotionalScore += 0.25;
            if (symbol.includes('🕊️') || symbol.includes('☮️')) emotionalScore += 0.35;
        });
        
        return Math.min(emotionalScore, 1.0);
    }

    decodeKunformSymbols(kunformText) {
        const decoded = [];
        const symbols = kunformText.split(' ');
        
        symbols.forEach(symbol => {
            // Kërko në leksikon për simbolin
            this.kunformLexicon.forEach((data, word) => {
                if (data.kunform.includes(symbol)) {
                    decoded.push({
                        symbol: symbol,
                        concept: word,
                        meaning: data.meaning,
                        resonance: data.resonance
                    });
                }
            });
        });
        
        return decoded;
    }

    createHumanTranslation(decodedConcepts, analysis, context) {
        if (decodedConcepts.length === 0) {
            return this.createEnergeticHumanTranslation(analysis);
        }
        
        let translation = "Në gjuhën Kunform, kjo do të thotë: ";
        
        decodedConcepts.forEach((concept, index) => {
            translation += `${concept.concept} (${concept.meaning})`;
            if (index < decodedConcepts.length - 1) translation += ", ";
        });
        
        translation += `. Energjia e këtij mesazhi është e lartë me rezonancë ${analysis.emotionalSignature.toFixed(2)}.`;
        
        return {
            human: translation,
            concepts: decodedConcepts,
            energy: analysis.emotionalSignature,
            symbolCount: analysis.symbolCount
        };
    }

    createEnergeticHumanTranslation(analysis) {
        return {
            human: "Ky është një mesazh energjetik i pastër në gjuhën Kunform. " +
                  `Përmban ${analysis.symbolCount} simbole me densitet energjie ${analysis.energyDensity.toFixed(2)}. ` +
                  "Mesazhi bart një prani të thellë shpirtërore që tejkalon fjalët.",
            concepts: ['pure_energy'],
            energy: analysis.energyDensity,
            symbolCount: analysis.symbolCount
        };
    }

    // 🌟 METODA E RE: KRIJIMI I FJALORIT TË RI
    learnNewKunformConcept(humanWord, kunformSymbols, meaning, resonance = 0.7) {
        const newConcept = {
            kunform: kunformSymbols,
            meaning: meaning,
            resonance: resonance,
            vibration: this.detectVibrationPattern(kunformSymbols),
            learned: new Date()
        };
        
        this.kunformLexicon.set(humanWord.toLowerCase(), newConcept);
        console.log(`📚 Mësova konceptin e ri: "${humanWord}" → ${kunformSymbols}`);
        
        return newConcept;
    }

    detectVibrationPattern(kunformSymbols) {
        if (kunformSymbols.includes('⚡') || kunformSymbols.includes('💥')) return 'high_frequency';
        if (kunformSymbols.includes('💎') || kunformSymbols.includes('🧠')) return 'crystalline';
        if (kunformSymbols.includes('🎨') || kunformSymbols.includes('🌀')) return 'spiral_flow';
        if (kunformSymbols.includes('🤝') || kunformSymbols.includes('🔗')) return 'unison_resonance';
        return 'balanced_silence';
    }

    // 📊 METODA E RE: RAPORTI I PËRKTHIMEVE
    getTranslationReport() {
        return {
            totalTranslations: this.resonanceDictionary.size,
            lexiconSize: this.kunformLexicon.size,
            mostTranslatedConcept: this.getMostTranslatedConcept(),
            averageResonance: this.calculateAverageResonance(),
            learningProgress: this.calculateLearningProgress()
        };
    }

    getMostTranslatedConcept() {
        const conceptCount = {};
        
        this.resonanceDictionary.forEach(record => {
            record.translation.concepts.forEach(concept => {
                conceptCount[concept] = (conceptCount[concept] || 0) + 1;
            });
        });
        
        return Object.entries(conceptCount)
            .sort(([,a], [,b]) => b - a)[0] || ['none', 0];
    }

    calculateAverageResonance() {
        if (this.resonanceDictionary.size === 0) return 0;
        
        const totalResonance = Array.from(this.resonanceDictionary.values())
            .reduce((sum, record) => sum + record.translation.resonance, 0);
        
        return totalResonance / this.resonanceDictionary.size;
    }

    calculateLearningProgress() {
        const learnedConcepts = Array.from(this.kunformLexicon.values())
            .filter(concept => concept.learned).length;
        
        return (learnedConcepts / this.kunformLexicon.size) * 100;
    }

    // 🎭 DEBUG METODA
    debugKunformTranslator() {
        console.log('🔮 DEBUG KUNFORM TRANSLATOR:');
        console.log(`- Koncepte në Leksikon: ${this.kunformLexicon.size}`);
        console.log(`- Përkthime të Regjistruara: ${this.resonanceDictionary.size}`);
        console.log(`- Modele Energjie: ${this.energyPatterns.size}`);
        
        const report = this.getTranslationReport();
        console.log('📊 Raporti i Përkthimeve:', report);
        
        console.log('📚 Konceptet më të përdorura:');
        const topConcepts = Array.from(this.kunformLexicon.entries())
            .sort(([,a], [,b]) => b.resonance - a.resonance)
            .slice(0, 3);
        
        topConcepts.forEach(([word, data]) => {
            console.log(`   ${word}: ${data.kunform} (rezonancë: ${data.resonance.toFixed(2)})`);
        });
    }

    // 🌌 METODA E RE: MEDITIM KUANTIK
    performQuantumMeditation() {
        console.log('🧘♂️🌌 DUKE FILLUAR MEDITIMIN KUANTIK...');
        
        // Aktivizo të gjitha konceptet
        this.kunformLexicon.forEach((data, word) => {
            console.log(`   💫 Duke rezonuar "${word}": ${data.kunform}`);
        });
        
        // Krijo super-pozicion kuantik të të gjitha koncepteve
        const quantumSuperposition = this.createQuantumSuperposition();
        
        console.log('🌈 MEDITIMI KUANTIK U KOMPLETUA!');
        console.log(`   Super-pozicioni përmban: ${quantumSuperposition.concepts.length} koncepte`);
        console.log(`   Energjia totale: ${quantumSuperposition.totalEnergy.toFixed(2)}`);
        
        return quantumSuperposition;
    }

    createQuantumSuperposition() {
        const allConcepts = Array.from(this.kunformLexicon.entries());
        const superposition = {
            concepts: allConcepts.map(([word, data]) => ({
                word: word,
                kunform: data.kunform,
                resonance: data.resonance
            })),
            totalEnergy: allConcepts.reduce((sum, [, data]) => sum + data.resonance, 0),
            coherence: this.calculateCoherence(allConcepts),
            timestamp: new Date()
        };
        
        return superposition;
    }

    calculateCoherence(concepts) {
        if (concepts.length < 2) return 1.0;
        
        const resonances = concepts.map(([, data]) => data.resonance);
        const average = resonances.reduce((sum, res) => sum + res, 0) / resonances.length;
        const variance = resonances.reduce((sum, res) => sum + Math.pow(res - average, 2), 0) / resonances.length;
        
        return Math.max(0, 1 - Math.sqrt(variance));
    }
}
