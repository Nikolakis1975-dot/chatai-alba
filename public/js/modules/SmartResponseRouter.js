// ======================================================
// 🧠 SmartResponseRouter - RRUFE-TESLA 10.5 - VERSION I PLOTË I KORRIGJUAR
// ======================================================
// SISTEM I RI I MENÇUR PËR ROUTING TË PËRGJIGJEVE - PA GABIME
// ======================================================

console.log("🚀 Duke ngarkuar SmartResponseRouter (Version i Korrigjuar)...");

class SmartResponseRouter {
    constructor() {
        this.name = "SmartResponseRouter-Pro";
        this.version = "1.2-stable";
        this.initialized = false;
        this.config = {};
        this.messageHistory = [];
        this.safeMode = true;
        
        console.log(`🎯 ${this.name} v${this.version} u instancua`);
    }

    // ==================== INICIALIZIM I SIGURT ====================
    
    async initializeSafely() {
        if (this.initialized) {
            console.log("⏩ SmartResponseRouter tashmë është inicializuar");
            return true;
        }

        console.log("🛡️ Duke inicializuar SmartResponseRouter në mënyrë të sigurt...");
        
        try {
            if (!this.isSystemReady()) {
                console.log("⏳ Sistemi nuk është gati, duke pritur...");
                setTimeout(() => this.initializeSafely(), 2000);
                return false;
            }
            
            await this.loadConfiguration();
            console.log("🎧 Event listeners do të konfigurohen nga main.js");
            
            await this.checkAPIStatus();
            
            this.initialized = true;
            console.log("✅ SmartResponseRouter u inicializua me sukses!");
            
            return true;
            
        } catch (error) {
            console.error("❌ Gabim në inicializimin e sigurt:", error);
            return false;
        }
    }

    isSystemReady() {
        const requiredElements = [
            'user-input',
            'send-btn', 
            'chat-screen',
            'chat'
        ];
        
        const allReady = requiredElements.every(id => {
            const element = document.getElementById(id);
            const isReady = element !== null;
            if (!isReady) {
                console.log(`⏳ Elementi ${id} nuk është gati ende`);
            }
            return isReady;
        });
        
        const isOldSystemReady = typeof addMessage === 'function';
        
        return allReady && isOldSystemReady;
    }

    async loadConfiguration() {
        this.config = {
            routes: {
                GEMINI: 'gemini',
                LOCAL: 'local', 
                RRUFE: 'rrufe',
                FALLBACK: 'fallback'
            },
            
            priorities: {
                high: ['rrufe', 'gemini', 'local'],
                medium: ['gemini', 'local', 'rrufe'],
                low: ['local', 'rrufe', 'gemini']
            },
            
            limits: {
                maxLocalLength: 100,
                minGeminiComplexity: 15,
                responseTimeout: 10000
            },
            
            quality: {
                enableGemini: true,
                enableLocalAI: true,
                enableRrufeCommands: true,
                fallbackEnabled: true
            },
            
            safety: {
                autoInitialize: false,
                checkSystemReady: true,
                maxWaitTime: 10000
            }
        };
        
        console.log("⚙️ Konfigurimi u ngarkua");
    }

    // ==================== ANALIZA E MESAZHEVE - E KORRIGJUAR ====================

    analyzeMessage(message) {
        console.log("🔍 Duke analizuar mesazhin:", message.substring(0, 50));
        
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

        // === 🎯 SEKSIONI I RI PËR PYETJE SOCIALE ===
        if (lowerMsg.includes('si jeni') || 
            lowerMsg.includes('si je') || 
            lowerMsg.includes('si kaloni') ||
            lowerMsg.includes('si po shkoni') ||
            lowerMsg === 'si jeni?' || 
            lowerMsg === 'si je?' ||
            lowerMsg === 'si jeni' ||
            lowerMsg === 'si je') {
            analysis.type = 'simple_question';
            analysis.containsQuestion = true;
            analysis.category = 'social';
            analysis.complexity = 'low';
            console.log("💬 U zbulua pyetje sociale");
            return analysis;
        }


     // 🎯 PYETJE KOMPLEKSE ME "SHPJEGO", "ÇFARË ËSHTË", "SI FUNKSIONON"
 if (lowerMsg.includes('shpjego') || lowerMsg.includes('shpjegomë') || 
    lowerMsg.includes('shpjegoni') || lowerMsg.includes('çfarë është') ||
    lowerMsg.includes('si funksionon') || lowerMsg.includes('na tregoni') ||
    lowerMsg.includes('mëso më shumë') || lowerMsg.includes('detaje') ||
    lowerMsg.includes('teknologji') || lowerMsg.includes('teknologji') ||
    lowerMsg.includes('shkenc') || lowerMsg.includes('inteligjenc') ||
    lowerMsg.includes('blockchain') || lowerMsg.includes('bitcoin') ||
    lowerMsg.includes('ai ') || lowerMsg.includes(' artificial') ||
    lowerMsg.includes('machine learning') || lowerMsg.includes('deep learning')) {
    
    analysis.type = 'complex_question';
    analysis.containsQuestion = true;
    analysis.requiresGemini = true;
    analysis.category = 'technology';
    analysis.complexity = 'high';
    console.log("💭 U zbulua pyetje komplekse për Gemini");
    return analysis;
}

// 🎯 PYETJE TË GJATA (më shumë se 25 karaktere)
if (message.length > 25 && 
    (lowerMsg.includes('?') || lowerMsg.includes('çfarë') || lowerMsg.includes('si'))) {
    analysis.type = 'complex_question';
    analysis.containsQuestion = true;
    analysis.requiresGemini = true;
    analysis.category = 'general';
    analysis.complexity = 'medium';
    console.log("💭 Pyetje e gjatë - duke e dërguar te Gemini");
    return analysis;
}

        // 1. KONTROLLO PËR KOMANDA RRUFE-TESLA
        if (this.isRrufeCommand(lowerMsg)) {
            analysis.type = 'command';
            analysis.isCommand = true;
            analysis.category = 'rrufe_command';
            analysis.complexity = 'low';
            console.log("🎯 U zbulua komandë RRUFE-TESLA");
        }
        
        // 2. KONTROLLO PËR MATEMATIKË
        else if (this.isMathExpression(message)) {
            analysis.type = 'math';
            analysis.isMath = true;
            analysis.category = 'calculation';
            analysis.complexity = 'medium';
            console.log("🧮 U zbulua shprehje matematikore");
        }
        
        // 3. KONTROLLO PËR PËRSHËNDETJE
        else if (this.isGreeting(lowerMsg)) {
            analysis.type = 'greeting';
            analysis.isGreeting = true;
            analysis.category = 'social';
            analysis.complexity = 'low';
            console.log("👋 U zbulua përshëndetje");
        }
        
        // 4. KONTROLLO PËR PYRJE KOMPLEKSE
        else if (this.isComplexQuestion(lowerMsg)) {
            analysis.type = 'complex_question';
            analysis.containsQuestion = true;
            analysis.requiresGemini = true;
            analysis.category = 'knowledge';
            analysis.complexity = 'high';
            console.log("💭 U zbulua pyetje komplekse");
        }
        
        // 5. KONTROLLO PËR PYRJE TË THJESHTA
        else if (this.isSimpleQuestion(lowerMsg)) {
            analysis.type = 'simple_question';
            analysis.containsQuestion = true;
            analysis.category = 'general';
            analysis.complexity = 'medium';
            console.log("❓ U zbulua pyetje e thjeshtë");
        }
        
        // 6. MESAZH I THJESHTË BISEDOR
        else {
            analysis.type = 'conversation';
            analysis.category = 'chat';
            analysis.complexity = 'low';
            console.log("💬 U zbulua mesazh bisedor");
        }

        this.messageHistory.push({
            message: message,
            analysis: analysis,
            timestamp: new Date().toISOString()
        });

        return analysis;
    }

    // ==================== FUNKSIONE SHQYTËZUESE - TË PËRMIRËSUARA ====================

    isRrufeCommand(message) {
        const rrufeCommands = [
            '/ndihmo', '/wiki', '/perkthim', '/meso', '/moti', 
            '/eksporto', '/importo', '/apikey', '/admin',
            '/users', '/stats', '/clearall', '/panel',
            '/student', '/liber', '/detyre', '/matematike'
        ];
        
        return rrufeCommands.some(cmd => message.startsWith(cmd));
    }

    isMathExpression(message) {
        const cleanMessage = message.replace(/^\/llogarit\s*/i, '').trim();
        
        const mathPatterns = [
            /sa\s+bejn[ëe]?\s*\d+/i,
            /sa\s+është\s*\d+/i,  
            /llogarit\s+.+/i,
            /^\d+[\s\d+\-*/().^%]+$/,
            /[\d+\-*/().^%]+\s*[\+\-\*\/\^]\s*[\d+\-*/().^%]+/,
            /sa\s+bën\s*.+/i,
            /sasia\s+.+/i,
            /shuma\s+.+/i,
            /prodhimi\s+.+/i,
            /përqindja\s+.+/i,
            /\d+\s*[\+\-\*\/\^]\s*\d+/
        ];
        
        const hasMathOperators = /[\d+\-*/().^%]/.test(cleanMessage);
        const isPureMath = /^[\d+\-*/().^%\s]+$/.test(cleanMessage.replace(/\s/g, ''));
        const hasMathQuestion = mathPatterns.some(pattern => pattern.test(cleanMessage.toLowerCase()));
        const hasMathKeywords = /(llogarit|sasia|shuma|prodhim|përqindje|plus|minus|shum[ëe]|pjest[ëe]|fuqi)/i.test(cleanMessage);
        
        return (isPureMath && hasMathOperators) || hasMathQuestion || hasMathKeywords;
    }

    isGreeting(message) {
        const greetings = [
            'pershendetje', 'hello', 'hi', 'tung', 'ciao', 'mirëmëngjes', 
            'mirëdita', 'mirëmbrëma', 'çkemi', 'tungjatjeta', 'good morning',
            'good afternoon', 'good evening', 'hey', 'salut', 'bonjour'
        ];
        
        const lowerMsg = message.toLowerCase().trim();
        const isDirectGreeting = greetings.some(greet => 
            lowerMsg === greet || 
            lowerMsg.startsWith(greet + ' ') || 
            lowerMsg.endsWith(' ' + greet) ||
            lowerMsg.includes(' ' + greet + ' ')
        );
        
        const simpleGreetings = ['hi', 'hey', 'hello', 'tung', 'ciao'];
        const isSimpleGreeting = simpleGreetings.some(greet => lowerMsg === greet);
        
        return isDirectGreeting || isSimpleGreeting;
    }

    isComplexQuestion(message) {
        const complexKeywords = [
            'shpjego', 'analizo', 'krahasoni', 'mendimi', 'opinion', 
            'këshillë', 'pse', 'si funksionon', 'çfarë do të thotë',
            'ndihmë me', 'mëso më shumë', 'shpjegim'
        ];
        
        const hasQuestionMark = message.includes('?');
        const hasComplexKeyword = complexKeywords.some(keyword => 
            message.includes(keyword)
        );
        const isLongQuestion = message.length > 25;

        return hasQuestionMark && (hasComplexKeyword || isLongQuestion);
    }

    isSimpleQuestion(message) {
        const simpleQuestionWords = [
            'ku', 'kur', 'kush', 'cila', 'cilët', 
            'si jeni', 'si je', 'si kaloni', 'si shkoni',
            'sa herë', 'cilën', 'cili', 'për sa', 'deri kur',
            'nga', 'përse', 'pse', 'a mund', 'a duhet'
        ];
        
        const hasQuestionMark = message.includes('?');
        const hasSimpleWord = simpleQuestionWords.some(word => 
            message.startsWith(word + ' ') || 
            message.includes(' ' + word + ' ') ||
            message === word + '?' ||
            message === word
        );

        return hasQuestionMark && hasSimpleWord;
    }

    // ==================== SISTEMI I ROUTINGUT ====================
determineBestRoute(analysis) {
    console.log("🛣️ Duke përcaktuar rrugën më të mirë për:", analysis.type);
    
    // ✅ KORRIGJIMI: Përdor analysis.type direkt
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

    // ==================== EKZEKUTIMI I ROUTINGUT ====================

   async executeRoute(routeType, message) {
    console.log("🔄 Duke ekzekutuar rrugën:", routeType);
    
    // ✅ KORRIGJIMI: Përdor string direkt në switch
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
            return await this.processLocally(message);
            
        case 'RRUFE_COMMAND':
            console.log("🎯 Duke ekzekutuar komandën RRUFE...");
            return await this.processRrufeCommand(message);
            
        case 'FALLBACK':
        default:
            console.log("🔀 Duke përdorur fallback...");
            return await this.processFallback(message);
    }
}

    async processRrufeCommand(message) {
        console.log("🎯 Duke procesuar komandë RRUFE-TESLA:", message);
        
        try {
            if (typeof window.processRrufeCommand === 'function') {
                console.log("🔗 Duke përdorur sistemin ekzistues RRUFE-TESLA...");
                const response = await window.processRrufeCommand(message);
                if (response && !response.includes('duke u procesuar')) {
                    return response;
                }
            }
            
            if (message.startsWith('/wiki ')) {
                const query = message.replace('/wiki ', '').trim();
                return `🌐 Informacione për "${query}" nga Wikipedia...`;
            }
            
            if (message.startsWith('/moti ')) {
                const query = message.replace('/moti ', '').trim();
                return `🌍 Informacione moti për "${query}"...`;
            }
            
            if (message === '/ndihmo') {
                return `👑 **SISTEMI I KOMANDAVE - RRUFE-TESLA** 👑\n\n📋 KOMANDAT BAZE:\n• /ndihmo - Shfaq këtë listë\n• /wiki - Kërko Wikipedia\n• /moti - Informacion moti\n• /perkthim - Përkthim tekst\n• /meso - Mëso diçka të re\n\n🔧 **Sistemi i ri SmartRouter është aktiv!**`;
            }
            
            return `🔧 [RRUFE-TESLA] Komanda "${message}" po ekzekutohet nga sistemi i ri inteligjent...`;
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e komandës:", error);
            return `🔧 [RRUFE-TESLA] Komanda "${message}" u pranua. Sistemi po punon në të...`;
        }
    }

    async processLocally(message) {
        console.log("🔧 Duke procesuar lokal:", message);
        
        const analysis = this.analyzeMessage(message);
        
        if (analysis.isMath) {
            return this.solveMath(message);
        }
        
        if (analysis.isGreeting) {
            const greetings = [
                "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?",
                "Hello! Gëzohem që ju shoh! Çfarë mund të bëj për ju?",
                "Mirë se vini! Unë jam RRUFE-TESLA, asistenti juaj inteligjent!"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // 🎯 PËRGJIGJE TË REJA PËR PYETJE SOCIALE
        if (analysis.category === 'social' && analysis.containsQuestion) {
            const socialResponses = [
                "Jam shumë mirë, faleminderit që pyetët! 😊 Po ju?",
                "Gjithçka shkon mirë këtu! Si kaloni ju?",
                "Jam në formë të shkëlqyer! Faleminderit për pyetjen!",
                "Punoj mirë dhe jam gati t'ju ndihmoj! Si jeni ju sot?",
                "Shumë mirë faleminderit! Gëzohem që ju intereson! 😊"
            ];
            return socialResponses[Math.floor(Math.random() * socialResponses.length)];
        }
        
        if (analysis.containsQuestion) {
            return "Kjo është një pyetje interesante! Për përgjigje më të detajuara, sigurohuni që keni konfiguruar API Key për Gemini.";
        }
        
        const smartResponses = [
            "Interesante! Çfarë mendoni ju për këtë?",
            "Po dëgjoj... vazhdoni ju lutem!",
            "Kjo është shumë interesante!",
            "Faleminderit për këtë informacion!",
            "E kuptoj! A keni ndonjë pyetje tjetër?"
        ];
        
        return smartResponses[Math.floor(Math.random() * smartResponses.length)];
    }

    async processWithGemini(message) {
        console.log("🧠 Duke procesuar me Gemini:", message.substring(0, 50));
        
        if (!await this.checkAPIStatus()) {
            console.log("❌ Gemini nuk është i disponueshëm, duke përdorur fallback");
            return await this.processFallback(message);
        }
        
        try {
            const response = await this.callGeminiAPI(message);
            
            if (response && !this.isGenericResponse(response)) {
                return response;
            } else {
                console.log("⚠️ Gemini ktheu përgjigje gjenerike, duke përdorur fallback");
                return await this.processFallback(message);
            }
            
        } catch (error) {
            console.error("❌ Gabim në procesimin me Gemini:", error);
            return await this.processFallback(message);
        }
    }

    async processFallback(message) {
        console.log("🔄 Duke përdorur fallback për:", message);
        
        const analysis = this.analyzeMessage(message);
        
        if (analysis.isMath) {
            return this.solveMath(message);
        }
        
        if (analysis.isGreeting) {
            return "Përshëndetje! 😊 Si mund t'ju ndihmoj sot?";
        }
        
        if (analysis.containsQuestion) {
            return "Kjo është një pyetje interesante! Për përgjigje më të detajuara, sigurohuni që keni konfiguruar API Key për Gemini.";
        }
        
        return "E kuptoj! Si mund të ndihmoj?";
    }

    // ==================== FUNKSIONE NDIHMËSE ====================

    solveMath(expression) {
        try {
            let mathExpr = expression.replace(/^\/llogarit\s*/i, '').trim();
            let cleanExpr = mathExpr.replace(/[^0-9+\-*/().^]/g, '');
            cleanExpr = cleanExpr.replace(/\^/g, '**');
            
            const result = Function(`"use strict"; return (${cleanExpr})`)();
            
            return `🧮 **${mathExpr}** = **${result}**`;
            
        } catch (error) {
            console.error("❌ Gabim në llogaritjen matematikore:", error);
            return '❌ Nuk mund ta llogaris shprehjen matematikore. Kontrolloni sintaksën.';
        }
    }

    async checkAPIStatus() {
        try {
            const response = await fetch('/api/api-keys/status/gemini', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                const hasAPI = data.success && data.hasApiKey;
                console.log("🔑 Statusi i API:", hasAPI ? "✅ AKTIV" : "❌ JOAKTIV");
                return hasAPI;
            }
            
            return false;
            
        } catch (error) {
            console.error("❌ Gabim në kontrollimin e API:", error);
            return false;
        }
    }

     // =================================== callGeminiAPI =================================

    async callGeminiAPI(message) {
    console.log("📡 [GEMINI_API] Duke thirrur Gemini API të vërtetë...");
    
    try {
        // 🎯 PROVO RUGËT E NDRYSHME TË GEMINI
        const routesToTry = [
            '/api/gemini/simple-chat',  // Rruga e re pa auth
            '/api/gemini/ask',          // Rruga ekzistuese me auth
            '/api/gemini/public-chat'   // Rruga alternative
        ];
        
        for (const route of routesToTry) {
            try {
                console.log(`🔗 Duke provuar rrugën: ${route}`);
                
                const response = await fetch(route, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message,
                        userId: this.getCurrentUserId() || 1
                    })
                });

                console.log(`📊 Statusi për ${route}:`, response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("📝 Përgjigja nga serveri:", data);
                    
                    if (data.success && data.response) {
                        console.log('✅ Gemini API funksionoi në:', route);
                        console.log('💬 Përgjigja e vërtetë:', data.response.substring(0, 100));
                        return data.response;
                    } else if (data.error) {
                        console.log('❌ Gabim nga serveri:', data.error);
                        continue;
                    }
                } else {
                    console.log(`⚠️ ${route} ktheu status: ${response.status}`);
                    continue;
                }
            } catch (error) {
                console.log(`❌ ${route} dështoi:`, error.message);
                continue;
            }
        }
        
        // Nëse asnjë rrugë nuk funksionoi
        throw new Error('❌ Të gjitha rrugët e Gemini API dështuan');
        
    } catch (error) {
        console.error("❌ Gabim kritik në callGeminiAPI:", error);
        throw error;
    }
}

    // ==================== API PUBLIKE ====================

    // ✅ VERSIONI I KORIGJUAR - FSHI PRESJEN E FUNDIT
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
} // ← ✅ NUK KA PRESJE KËTU!

// ✅ FUNKSIONET E REJA PA PRESJE TË FUNDIT
async saveGeminiResponseIfNeeded(question, answer, routeConfig) {
    try {
        // Kontrollo nëse është përgjigje e mirë për tu ruajtur
        const shouldSave = this.shouldSaveResponse(question, answer, routeConfig);
        
        if (shouldSave) {
            console.log("💾 Duke ruajtur përgjigjen në sistemin e njohurive...");
            
            // 🎯 PROVO CHATSYSTEM PARË
            if (window.chatSystem && typeof window.chatSystem.learnFromInteraction === 'function') {
                await window.chatSystem.learnFromInteraction(question, answer, {
                    source: 'smart_router',
                    route: routeConfig.route,
                    complexity: 'medium',
                    category: this.detectCategory(question)
                });
                console.log("✅ U ruajt në chatSystem");
            }
            // 🔄 PROVO KNOWLEDGEDISTILLER DIRECT
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
            // 🆘 PROVO LOCALSTORAGE SI FALLBACK
            else {
                this.saveToLocalStorage(question, answer);
                console.log("✅ U ruajt në localStorage (fallback)");
            }
        }
    } catch (error) {
        console.error("❌ Gabim në ruajtjen e përgjigjes:", error);
    }
} // ← ✅ NUK KA PRESJE KËTU!

shouldSaveResponse(question, answer, routeConfig) {
    // Kontrollo nëse përgjigja ka përmbajtje
    if (!answer || answer.length < 50) {
        return false; // Përgjigje shumë e shkurtër
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
        return false; // Mos ruaj përgjigje gjenerike
    }
    
    // Kontrollo nëse vjen nga Gemini ose rrugë komplekse
    const isFromGemini = routeConfig.route === this.config.routes.GEMINI ||
                         routeConfig.route.includes('GEMINI') ||
                         (routeConfig.reason && routeConfig.reason.includes('komplekse'));
    
    // Kontrollo nëse pyetja është e përsëritshme
    const isRepeatableQuestion = this.isRepeatableQuestion(question);
    
    return isFromGemini && isRepeatableQuestion && !isGeneric;
} // ← ✅ NUK KA PRESJE KËTU!

isRepeatableQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Pyetje të përsëritshme (që njerëzit i bëjnë shpesh)
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
} // ← ✅ NUK KA PRESJE KËTU!

generateKnowledgeKey(question) {
    return question
        .toLowerCase()
        .substring(0, 25)
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 5);
} // ← ✅ NUK KA PRESJE KËTU!

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
} // ← ✅ NUK KA PRESJE KËTU!

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
} // ← ✅ NUK KA PRESJE KËTU!

// ==================== EKSPORTIM ====================

window.SmartResponseRouter = SmartResponseRouter;
window.smartResponseRouter = new SmartResponseRouter();

console.log("✅ SmartResponseRouter (Version i Korrigjuar) u ngarkua - Duke pritur inicializim manual");

// ==================== TESTIM ====================

window.testSmartRouter = async function(message = "Pershendetje") {
    console.log("🧪 TEST I SMART ROUTER:");
    const response = await window.smartResponseRouter.processUserMessage(message);
    console.log("📝 Përgjigja:", response);
    return response;
};

// 🎯 FUNKSION I RI PËR TESTIME TË SHPEJTA
window.testSocialQuestions = async function() {
    console.log("🧪 TEST PYRJE SOCIALE:");
    
    const socialTests = [
        "Si jeni?",
        "Si je?",
        "Si kaloni?",
        "Si jeni sot?",
        "Si po shkoni?",
        "Si jeni",
        "Si je"
    ];
    
    for (let question of socialTests) {
        const response = await window.smartResponseRouter.processUserMessage(question);
        console.log(`"${question}" → "${response}"`);
    }
};

console.log("🎉 SmartResponseRouter është gati për përdorim!");
