// ======================================================
// 🧠 SmartResponseRouter - RRUFE-TESLA 10.5
// ======================================================
// SISTEM I RI I ROUTING-UT INTELIGJENT
// ======================================================

console.log("🚀 Duke ngarkuar SmartResponseRouter (Version i Ri)...");

class SmartResponseRouter {
    constructor() {
        this.name = "SmartResponseRouter-Pro";
        this.version = "1.2-stable";
        this.initialized = false;
        this.safeMode = true;
        this.messageHistory = [];
        
        this.config = {
            routes: {
                GEMINI: 'GEMINI_COMPLEX',
                LOCAL: 'LOCAL_SMART', 
                FALLBACK: 'FALLBACK',
                MATH: 'LOCAL_MATH',
                GREETING: 'LOCAL_GREETING',
                COMMAND: 'RRUFE_COMMAND'
            },
            quality: {
                enableGemini: true,
                minComplexityForGemini: 0.7,
                responseTimeThreshold: 5000
            },
            learning: {
                enableKnowledgeStorage: true,
                minAnswerLength: 50,
                saveGeminiResponses: true
            }
        };
        
        console.log(`🎯 ${this.name} v${this.version} u instancua`);
    }

    async initializeSafely() {
        try {
            console.log("🔄 Duke inicializuar SmartResponseRouter...");
            
            // Kontrollo nëse janë të disponueshëm modulet e nevojshme
            if (typeof window.geminiService === 'undefined') {
                console.log("⚠️ GeminiService nuk është i disponueshëm - Safe Mode aktiv");
                this.safeMode = true;
            }
            
            this.initialized = true;
            console.log("✅ SmartResponseRouter u inicializua me sukses!");
            return true;
            
        } catch (error) {
            console.error("❌ Gabim në inicializimin e SmartResponseRouter:", error);
            this.safeMode = true;
            return false;
        }
    }

    async processUserMessage(message) {
        if (!this.initialized) {
            console.log("⏳ SmartResponseRouter nuk është inicializuar, duke u inicializuar...");
            const initialized = await this.initializeSafely();
            if (!initialized) {
                return "🔄 Sistemi po inicializohet, provoni përsëri...";
            }
        }
        
        console.log(`🧠 SmartResponseRouter po proceson: "${message.substring(0, 50)}..."`);
        
        try {
            const analysis = this.analyzeMessage(message);
            const routeConfig = this.determineBestRoute(message, analysis);
            const response = await this.executeRoute(routeConfig, message);
            
            // ✅ RREGULLIMI I RI: RUAJ PËRGJIGJEN NGA GEMINI
            await this.saveGeminiResponseIfNeeded(message, response, routeConfig);
            
            console.log("✅ Përgjigja u gjenerua me sukses");
            return response;
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e mesazhit:", error);
            return "Më falni, pati një gabim në sistem. Provo përsëri.";
        }
    }

    analyzeMessage(message) {
        console.log("🔍 Duke analizuar mesazhin:", message);
        
        const analysis = {
            type: 'unknown',
            complexity: 'low',
            language: 'albanian',
            length: message.length,
            containsQuestion: false,
            requiresGemini: false,
            isCommand: false,
            isMath: false,
            isGreeting: false,
            category: 'general'
        };

        const lowerMsg = message.toLowerCase().trim();

        // 👋 PËRSHËNDETJE
        if (lowerMsg.includes('përshëndetje') || lowerMsg.includes('hello') || 
            lowerMsg.includes('hi') || lowerMsg.includes('mirëdita') ||
            lowerMsg === 'ciao' || lowerMsg === 'hey') {
            analysis.type = 'greeting';
            analysis.isGreeting = true;
            analysis.complexity = 'very_low';
        }
        
        // 🧮 MATEMATIKË
        else if (lowerMsg.match(/\d+[\+\-\*\/]\d+/) || 
                 lowerMsg.includes('sa është') || lowerMsg.includes('sa bëjnë') ||
                 lowerMsg.includes('llogarit') || lowerMsg.includes('kalkul')) {
            analysis.type = 'math';
            analysis.isMath = true;
            analysis.complexity = 'low';
        }
        
        // 💭 PYRJE KOMPLEKSE
        else if (lowerMsg.includes('çfarë është') || lowerMsg.includes('si funksionon') ||
                 lowerMsg.includes('shpjego') || lowerMsg.includes('shpjegomë') ||
                 lowerMsg.includes('detaje') || lowerMsg.includes('mëso më shumë') ||
                 lowerMsg.includes('blockchain') || lowerMsg.includes('inteligjencë artificiale') ||
                 lowerMsg.includes('machine learning') || lowerMsg.includes('deep learning') ||
                 lowerMsg.includes('teknologji') || lowerMsg.includes('shkenc') ||
                 message.length > 30) {
            analysis.type = 'complex_question';
            analysis.requiresGemini = true;
            analysis.complexity = 'high';
        }
        
        // ❓ PYRJE E THJESHTË
        else if (lowerMsg.includes('?') || lowerMsg.includes('ku ') || 
                 lowerMsg.includes('si ') || lowerMsg.includes('kur ') ||
                 lowerMsg.includes('pse ') || lowerMsg.includes('kush ') ||
                 lowerMsg.includes('a ')) {
            analysis.type = 'simple_question';
            analysis.containsQuestion = true;
            analysis.complexity = 'medium';
        }
        
        // 🎯 KOMANDË RRUFE
        else if (lowerMsg.startsWith('/') || lowerMsg.includes('rrufe') || 
                 lowerMsg.includes('tesla') || lowerMsg.includes('ndihmo')) {
            analysis.type = 'command';
            analysis.isCommand = true;
            analysis.complexity = 'medium';
        }
        
        // 💬 BIEDË E THJESHTË
        else {
            analysis.type = 'conversation';
            analysis.complexity = 'low';
        }

        console.log("📊 Analiza e mesazhit:", analysis);
        return analysis;
    }

    determineBestRoute(analysis) {
        console.log("🛣️ Duke përcaktuar rrugën më të mirë për:", analysis.type);
        
        switch(analysis.type) {
            case 'complex_question':
                console.log("🎯 Pyetje komplekse - duke zgjedhur GEMINI");
                return 'GEMINI_COMPLEX';
                
            case 'simple_question':
                console.log("❓ Pyetje e thjeshtë - duke zgjedhur LOCAL_SMART");
                return 'LOCAL_SMART';
                
            case 'math':
                console.log("🧮 Matematikë - duke zgjedhur LOCAL_MATH");
                return 'LOCAL_MATH';
                
            case 'greeting':
                console.log("👋 Përshëndetje - duke zgjedhur LOCAL_GREETING");
                return 'LOCAL_GREETING';
                
            case 'command':
                console.log("🎯 Komandë RRUFE - duke zgjedhur RRUFE_COMMAND");
                return 'RRUFE_COMMAND';
                
            case 'conversation':
            default:
                console.log("🔀 Bisedë - duke zgjedhur FALLBACK");
                return 'FALLBACK';
        }
    }

    async executeRoute(routeType, message) {
        console.log("🔄 Duke ekzekutuar rrugën:", routeType);
        
        switch(routeType) {
            case 'GEMINI_COMPLEX':
                console.log("🧠 Duke dërguar te Gemini për pyetje komplekse...");
                return await this.processWithGemini(message);
                
            case 'LOCAL_SMART':
                console.log("💡 Duke procesuar lokal...");
                return await this.processLocally(message);
                
            case 'LOCAL_MATH':
                console.log("🧮 Duke zgjidhur matematikën...");
                return await this.solveMath(message);
                
            case 'LOCAL_GREETING':
                console.log("👋 Duke përgjigjur përshëndetjes...");
                return await this.processGreeting(message);
                
            case 'RRUFE_COMMAND':
                console.log("🎯 Duke ekzekutuar komandën RRUFE...");
                return await this.processRrufeCommand(message);
                
            case 'FALLBACK':
            default:
                console.log("🔀 Duke përdorur fallback...");
                return await this.processFallback(message);
        }
    }

    async processWithGemini(message) {
        try {
            console.log("🌐 Duke dërguar te Gemini API...");
            
            // Provo të gjesh dhe përdorësh rrugën e gemini
            if (typeof callGeminiAPI !== 'undefined') {
                const geminiRoute = await callGeminiAPI(message);
                if (geminiRoute && geminiRoute.success) {
                    return geminiRoute.response;
                }
            }
            
            // Fallback nëse Gemini nuk funksionon
            console.log("🔄 Gemini nuk funksionon, duke përdorur fallback...");
            return await this.processFallback(message);
            
        } catch (error) {
            console.error("❌ Gabim në Gemini:", error);
            return "Kjo është një pyetje interesante! Për përgjigje më të detajuara, sigurohuni që keni konfiguruar API Key për Gemini.";
        }
    }

    async processLocally(message) {
        // Implementim i thjeshtë lokal
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('si jeni') || lowerMsg.includes('si je')) {
            return "Jam shumë mirë, faleminderit që pyetët! 😊 Si mund t'ju ndihmoj sot?";
        }
        
        if (lowerMsg.includes('faleminderit') || lowerMsg.includes('rrofsh')) {
            return "S'ka përse! 😊 Gjithmonë i lumtur të ndihmoj!";
        }
        
        if (lowerMsg.includes('libër') || lowerMsg.includes('libra')) {
            return "📚 Interesante! Çfarë lloj libri po kërkoni? Fiction, shkencor, historik, apo diçka tjetër?";
        }
        
        return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.";
    }

    async solveMath(message) {
        try {
            console.log("🧮 Duke zgjidhur shprehjen matematikore...");
            
            const lowerMsg = message.toLowerCase();
            let expression = '';
            
            // Nxjerr shprehjen matematikore
            if (lowerMsg.includes('sa është')) {
                expression = message.split('sa është')[1].replace('?', '').trim();
            } else if (lowerMsg.includes('sa bëjnë')) {
                expression = message.split('sa bëjnë')[1].replace('?', '').trim();
            } else {
                // Provoj të gjej shprehjen direkt
                expression = message.replace(/[^\d\+\-\*\/\.]/g, '').trim();
            }
            
            if (!expression) {
                return "Nuk mund ta gjej shprehjen matematikore. Mund të provoni: 'Sa është 5 + 3?'";
            }
            
            // Sigurohu që shprehja është e sigurt
            if (!/^[\d\+\-\*\/\.\(\)\s]+$/.test(expression)) {
                return "Shprehja matematikore përmban karaktere të pasigurta.";
            }
            
            // Llogarit rezultatin
            const result = eval(expression);
            
            return `🧮 **${message}** = **${result}**`;
            
        } catch (error) {
            console.error("❌ Gabim në zgjidhjen e matematikës:", error);
            return "Nuk mund ta zgjidh këtë shprehje matematikore. Ju lutem provoni një shprehje më të thjeshtë.";
        }
    }

    async processGreeting(message) {
        const greetings = [
            "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?",
            "Hello! 👋 Si mund t'ju shërbej?",
            "Mirëdita! ☀️ Çfarë mund të bëj për ju?",
            "Tungjatjeta! 🎯 Si mund të ndihmoj?"
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    async processRrufeCommand(message) {
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('ndihmo') || lowerMsg.includes('help')) {
            return `🎯 **RRUFE-TESLA Komandat:**
• /ndihmo - Shfaq këtë ndihmë
• /stats - Statistikat e sistemit  
• /mode [normal|rrufe|divine] - Ndrysho modin
• /learn - Aktivizo mësimin
• /reset - Ristejo bisedën`;
        }
        
        if (lowerMsg.includes('stats') || lowerMsg.includes('statistikat')) {
            return `📊 **Statistikat e RRUFE-TESLA:**
• Mesazhe të procesuara: ${this.messageHistory.length}
• Moduli: ${this.safeMode ? 'Safe Mode' : 'Normal'}
• Version: ${this.version}
• Gjuhë: Shqip`;
        }
        
        return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.";
    }

    async processFallback(message) {
        console.log("🔀 Duke përdorur fallback për:", message);
        
        // Provo procesimin lokal
        const localResponse = await this.processLocally(message);
        if (localResponse && !this.isGenericResponse(localResponse)) {
            return localResponse;
        }
        
        // Fallback final
        return "E kuptoj! 😊 Përdorni /ndihmo për të parë të gjitha komandat e mia.";
    }

    async saveGeminiResponseIfNeeded(question, answer, routeConfig) {
        try {
            // Kontrollo nëse është përgjigje e mirë për tu ruajtur
            const shouldSave = this.shouldSaveResponse(question, answer, routeConfig);
            
            if (shouldSave) {
                console.log("💾 Duke ruajtur përgjigjen në sistemin e njohurive...");
                
                // Provo chatSystem parë
                if (window.chatSystem && typeof window.chatSystem.learnFromInteraction === 'function') {
                    await window.chatSystem.learnFromInteraction(question, answer, {
                        source: 'smart_router',
                        route: routeConfig,
                        complexity: 'high',
                        category: this.detectCategory(question)
                    });
                    console.log("✅ U ruajt në chatSystem");
                }
                // Provo KnowledgeDistiller direct
                else if (window.knowledgeDistiller && typeof window.knowledgeDistiller.addKnowledge === 'function') {
                    const knowledgeKey = this.generateKnowledgeKey(question);
                    await window.knowledgeDistiller.addKnowledge(knowledgeKey, {
                        question: question,
                        answer: answer,
                        learnedAt: new Date().toISOString(),
                        source: 'gemini_api',
                        category: this.detectCategory(question),
                        usageCount: 0
                    }, 'smart_learned');
                    console.log("✅ U ruajt në KnowledgeDistiller:", knowledgeKey);
                }
                // Provo localStorage si fallback
                else {
                    this.saveToLocalStorage(question, answer);
                    console.log("✅ U ruajt në localStorage (fallback)");
                }
            }
        } catch (error) {
            console.error("❌ Gabim në ruajtjen e përgjigjes:", error);
        }
    }

    shouldSaveResponse(question, answer, routeConfig) {
        // Kontrollo nëse përgjigja ka përmbajtje
        if (!answer || answer.length < 50) {
            return false;
        }
        
        // Kontrollo nëse është përgjigje gjenerike
        const genericResponses = [
            'e kuptoj',
            'përdorni /ndihmo',
            'nuk kuptova',
            'mund të përsërisni',
            'nuk jam i sigurt',
            'kjo është një pyetje interesante'
        ];
        
        const isGeneric = genericResponses.some(phrase => 
            answer.toLowerCase().includes(phrase)
        );
        
        if (isGeneric) {
            return false;
        }
        
        // Kontrollo nëse vjen nga Gemini
        const isFromGemini = routeConfig === 'GEMINI_COMPLEX';
        
        // Kontrollo nëse pyetja është e përsëritshme
        const isRepeatableQuestion = this.isRepeatableQuestion(question);
        
        return isFromGemini && isRepeatableQuestion && !isGeneric;
    }

    isRepeatableQuestion(question) {
        const lowerQuestion = question.toLowerCase();
        
        const repeatablePatterns = [
            'çfarë është',
            'si funksionon',
            'shpjego',
            'kush është',
            'ku ndodhet',
            'kur u krijua',
            'pse',
            'si bëhet'
        ];
        
        return repeatablePatterns.some(pattern => 
            lowerQuestion.includes(pattern)
        );
    }

    generateKnowledgeKey(question) {
        return question
            .toLowerCase()
            .substring(0, 25)
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 5);
    }

    detectCategory(question) {
        const lowerQ = question.toLowerCase();
        if (lowerQ.includes('ai') || lowerQ.includes('teknologji') || lowerQ.includes('programim') || lowerQ.includes('kompjuter')) {
            return 'technology';
        } else if (lowerQ.includes('shkenc') || lowerQ.includes('fizik') || lowerQ.includes('kim') || lowerQ.includes('biologji')) {
            return 'science';
        } else if (lowerQ.includes('libër') || lowerQ.includes('edukim') || lowerQ.includes('shkoll') || lowerQ.includes('universitet')) {
            return 'education';
        } else if (lowerQ.includes('shëndet') || lowerQ.includes('mjekësi') || lowerQ.includes('spital')) {
            return 'health';
        } else if (lowerQ.includes('histori') || lowerQ.includes('kultur') || lowerQ.includes('art')) {
            return 'culture';
        } else {
            return 'general';
        }
    }

    saveToLocalStorage(question, answer) {
        try {
            const key = 'rrufe_gemini_' + this.generateKnowledgeKey(question);
            const knowledge = {
                question: question,
                answer: answer,
                timestamp: new Date().toISOString(),
                category: this.detectCategory(question),
                source: 'gemini_forced'
            };
            localStorage.setItem(key, JSON.stringify(knowledge));
            return true;
        } catch (e) {
            console.error("❌ Gabim në localStorage:", e);
            return false;
        }
    }

    isGenericResponse(response) {
        const genericPatterns = [
            'e kuptoj',
            'përdorni /ndihmo',
            'nuk kuptova',
            'mund të përsërisni',
            'nuk jam i sigurt'
        ];
        
        return genericPatterns.some(pattern => 
            response.toLowerCase().includes(pattern)
        );
    }

    getStats() {
        return {
            name: this.name,
            version: this.version,
            initialized: this.initialized,
            safeMode: this.safeMode,
            messagesProcessed: this.messageHistory.length,
            config: this.config
        };
    }
}

// ==================== FUND I KLASËS ====================

// ✅ ✅ ✅ VETËM TANI MUND TË KRIJOSH INSTANCËN

// Krijo instancë globale
window.SmartResponseRouter = SmartResponseRouter;

// Krijo instancën
window.smartResponseRouter = new SmartResponseRouter();

console.log("✅ SmartResponseRouter (Version i Korrigjuar) u ngarkua!");

// Auto-inicializim
setTimeout(() => {
    if (window.smartResponseRouter && !window.smartResponseRouter.initialized) {
        console.log("🔄 Auto-inicializim i SmartResponseRouter...");
        window.smartResponseRouter.initializeSafely().then(success => {
            console.log(success ? "✅ Auto-inicializimi u krye" : "❌ Auto-inicializimi dështoi");
        });
    }
}, 2000);

// ==================== FUNKSIONE TESTIMI ====================

window.testSmartRouter = function() {
    console.log("🧪 TEST I SMART RESPONSE ROUTER:");
    
    if (window.smartResponseRouter) {
        const stats = window.smartResponseRouter.getStats();
        console.log("📊 SmartRouter Stats:", stats);
        
        // Testo me pyetje të ndryshme
        const testMessages = [
            "Përshëndetje",
            "Sa është 5 + 3?",
            "Çfarë është AI?",
            "Si jeni?",
            "/ndihmo"
        ];
        
        testMessages.forEach(msg => {
            window.smartResponseRouter.processUserMessage(msg).then(response => {
                console.log(`🧪 "${msg}" → ${response.substring(0, 60)}...`);
            });
        });
    } else {
        console.log("❌ SmartResponseRouter nuk është i disponueshëm");
    }
};
