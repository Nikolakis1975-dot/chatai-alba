// ======================================================
// 🧠 SmartResponseRouter - RRUFE-TESLA 10.5 - VERSION I SIGURT
// ======================================================
// SISTEM I RI I MENÇUR PËR ROUTING TË PËRGJIGJEVE - PA KONFLIKTE
// ======================================================

console.log("🚀 Duke ngarkuar SmartResponseRouter (Version i Sigurt)...");

class SmartResponseRouter {
    constructor() {
        this.name = "SmartResponseRouter-Safe";
        this.version = "1.1-safe";
        this.initialized = false;
        this.config = {};
        this.messageHistory = [];
        this.safeMode = true; // 🛡️ MOD I RI I SIGURISË
        
        console.log(`🎯 ${this.name} v${this.version} u instancua (Safe Mode)`);
    }

    // ==================== INICIALIZIM I SIGURT ====================
    
    async initializeSafely() {
        if (this.initialized) {
            console.log("⏩ SmartResponseRouter tashmë është inicializuar");
            return true;
        }

        console.log("🛡️ Duke inicializuar SmartResponseRouter në mënyrë të sigurt...");
        
        try {
            // 🚫 KONTROLLO NËSE SISTEMI ËSHTË GATI - MOS VEPRO PARAKOHTË
            if (!this.isSystemReady()) {
                console.log("⏳ Sistemi nuk është gati, duke pritur...");
                setTimeout(() => this.initializeSafely(), 2000);
                return false;
            }
            
            // Ngarko konfigurimin
            await this.loadConfiguration();
            
            // 🚫 MOS KONFIGURO EVENT LISTENERS KËTU - do të bëhet nga main.js
            console.log("🎧 Event listeners do të konfigurohen nga main.js");
            
            // Kontrollo statusin e API
            await this.checkAPIStatus();
            
            this.initialized = true;
            console.log("✅ SmartResponseRouter u inicializua me sukses (Safe Mode)!");
            
            return true;
            
        } catch (error) {
            console.error("❌ Gabim në inicializimin e sigurt:", error);
            return false;
        }
    }

    // 🛡️ FUNKSION I RI: KONTROLLO NËSE SISTEMI ËSHTË GATI
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
        
        // Kontrollo gjithashtu nëse sistemi i vjetër është i gatshëm
        const isOldSystemReady = typeof addMessage === 'function';
        
        return allReady && isOldSystemReady;
    }

    async loadConfiguration() {
        this.config = {
            // Rrjedhat e procesimit
            routes: {
                GEMINI: 'gemini',
                LOCAL: 'local', 
                RRUFE: 'rrufe',
                FALLBACK: 'fallback'
            },
            
            // Prioritete të routingut
            priorities: {
                high: ['rrufe', 'gemini', 'local'],
                medium: ['gemini', 'local', 'rrufe'],
                low: ['local', 'rrufe', 'gemini']
            },
            
            // Kufijtë e përgjigjeve
            limits: {
                maxLocalLength: 100,
                minGeminiComplexity: 15,
                responseTimeout: 10000
            },
            
            // Cilësia e përgjigjeve
            quality: {
                enableGemini: true,
                enableLocalAI: true,
                enableRrufeCommands: true,
                fallbackEnabled: true
            },
            
            // 🛡️ KONFIGURIM I RI I SIGURISË
            safety: {
                autoInitialize: false, // 🚫 MOS AUTO-INICIALIZO
                checkSystemReady: true,
                maxWaitTime: 10000
            }
        };
        
        console.log("⚙️ Konfigurimi i sigurt u ngarkua");
    }

    // ==================== ANALIZA E MESAZHEVE ====================

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

    // === 🆕 SHTO KËTË SEKSION TË RI ===
    // 1. KONTROLLO PËR "SI JENI" & PYETJE SOCIALE
    if (lowerMsg.includes('si jeni') || 
        lowerMsg.includes('si je') || 
        lowerMsg.includes('si kaloni') ||
        lowerMsg.includes('si po shkoni') ||
        lowerMsg === 'si jeni?' || 
        lowerMsg === 'si je?') {
        analysis.type = 'simple_question';
        analysis.containsQuestion = true;
        analysis.category = 'social';
        analysis.complexity = 'low';
        console.log("💬 U zbulua pyetje sociale");
        return analysis; // Kthehu menjëherë
    }

        const lowerMsg = message.toLowerCase().trim();

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

        // Ruaj analizën në histori
        this.messageHistory.push({
            message: message,
            analysis: analysis,
            timestamp: new Date().toISOString()
        });

        return analysis;
    }

    // ==================== FUNKSIONE SHQYTËZUESE ====================

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
        // Heq komandën /llogarit nëse ekziston
        const cleanMessage = message.replace(/^\/llogarit\s*/i, '').trim();
        
        // Kontrollo për pyetje matematikore (version i përmirësuar)
        const mathPatterns = [
            /sa\s+bejn[ëe]?\s*\d+/i,           // "sa bejne 5"
            /sa\s+është\s*\d+/i,              // "sa është 5"  
            /llogarit\s+.+/i,                 // "llogarit diçka"
            /^\d+[\s\d+\-*/().^%]+$/,         // shprehje e pastër matematikore
            /[\d+\-*/().^%]+\s*[\+\-\*\/\^]\s*[\d+\-*/().^%]+/, // operatorë matematikorë
            /sa\s+bën\s*.+/i,                 // "sa bën 5+5"
            /sasia\s+.+/i,                    // "sasia e diçkaje"
            /shuma\s+.+/i,                    // "shuma e"
            /prodhimi\s+.+/i,                 // "prodhimi i"
            /përqindja\s+.+/i,                // "përqindja e"
            /\d+\s*[\+\-\*\/\^]\s*\d+/        // numër operator numër
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
        
        // Kontrollo nëse mesazhi është kryesisht përshëndetje
        const lowerMsg = message.toLowerCase().trim();
        const isDirectGreeting = greetings.some(greet => 
            lowerMsg === greet || 
            lowerMsg.startsWith(greet + ' ') || 
            lowerMsg.endsWith(' ' + greet) ||
            lowerMsg.includes(' ' + greet + ' ')
        );
        
        // Kontrollo për përshëndetje të thjeshta
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

    // Ose shto në funksionin ekzistues isSimpleQuestion:

isSimpleQuestion(message) {
    const simpleQuestionWords = [
        'ku', 'kur', 'kush', 'cila', 'cilët', 
        'si jeni', 'si je', 'si kaloni', 'si shkoni' // 🆕 Shto këto
    ];
    
    const hasQuestionMark = message.includes('?');
    const hasSimpleWord = simpleQuestionWords.some(word => 
        message.startsWith(word + ' ') || 
        message.includes(' ' + word + ' ') ||
        message === word + '?' // 🆕 Për "si jeni?"
    );

    return hasQuestionMark && hasSimpleWord;
}

    // ==================== SISTEMI I ROUTINGUT ====================

    determineBestRoute(message, analysis) {
        console.log("🛣️ Duke përcaktuar rrugën më të mirë për:", analysis.type);

        // 1. KOMANDA RRUFE-TESLA - Gjithmonë prioritet i lartë
        if (analysis.isCommand) {
            console.log("🎯 Rrugë e zgjedhur: RRUFE_COMMAND");
            return {
                route: this.config.routes.RRUFE,
                priority: 'high',
                reason: 'Komandë RRUFE-TESLA',
                timeout: 5000
            };
        }

        // 2. MATEMATIKË - Procesim lokal i shpejtë
        if (analysis.isMath) {
            console.log("🧮 Rrugë e zgjedhur: LOCAL_MATH");
            return {
                route: this.config.routes.LOCAL,
                priority: 'high', 
                reason: 'Llogaritje matematikore',
                timeout: 3000
            };
        }

        // 3. PËRSHËNDETJE - Përgjigje lokale e shpejtë
        if (analysis.isGreeting) {
            console.log("👋 Rrugë e zgjedhur: LOCAL_GREETING");
            return {
                route: this.config.routes.LOCAL,
                priority: 'high',
                reason: 'Përshëndetje',
                timeout: 2000
            };
        }

        // 4. PYRJE KOMPLEKSE - Gemini për përgjigje të cilësisë së lartë
        if (analysis.requiresGemini && this.config.quality.enableGemini) {
            console.log("💭 Rrugë e zgjedhur: GEMINI_COMPLEX");
            return {
                route: this.config.routes.GEMINI,
                priority: 'high',
                reason: 'Pyetje komplekse',
                timeout: 15000
            };
        }

        // 5. PYRJE TË THJESHTA - Procesim lokal inteligjent
        if (analysis.containsQuestion) {
            console.log("❓ Rrugë e zgjedhur: LOCAL_SMART");
            return {
                route: this.config.routes.LOCAL,
                priority: 'medium',
                reason: 'Pyetje e thjeshtë',
                timeout: 5000
            };
        }

        // 6. FALLBACK - Rrugë default
        console.log("🔀 Rrugë e zgjedhur: FALLBACK");
        return {
            route: this.config.routes.FALLBACK,
            priority: 'low',
            reason: 'Mesazh bisedor',
            timeout: 4000
        };
    }

    // ==================== EKZEKUTIMI I ROUTINGUT ====================

    async executeRoute(routeConfig, message) {
        console.log(`🔄 Duke ekzekutuar rrugën: ${routeConfig.route}`);
        
        try {
            let response;
            
            switch (routeConfig.route) {
                case this.config.routes.RRUFE:
                    response = await this.processRrufeCommand(message);
                    break;
                    
                case this.config.routes.LOCAL:
                    response = await this.processLocally(message);
                    break;
                    
                case this.config.routes.GEMINI:
                    response = await this.processWithGemini(message);
                    break;
                    
                case this.config.routes.FALLBACK:
                default:
                    response = await this.processFallback(message);
                    break;
            }
            
            console.log(`✅ Rrugë ${routeConfig.route} u ekzekutua me sukses`);
            return response;
            
        } catch (error) {
            console.error(`❌ Gabim në rrugën ${routeConfig.route}:`, error);
            return await this.processFallback(message);
        }
    }

    async processRrufeCommand(message) {
        console.log("🎯 Duke procesuar komandë RRUFE-TESLA:", message);
        
        try {
            // 🛡️ PROVO SISTEMIN E VJETËR RRUFE-TESLA PARË - ME KONTROLL
            if (typeof window.processRrufeCommand === 'function') {
                console.log("🔗 Duke përdorur sistemin ekzistues RRUFE-TESLA...");
                const response = await window.processRrufeCommand(message);
                if (response && !response.includes('duke u procesuar')) {
                    return response;
                }
            }
            
            // PROVO KOMANDAT EKZISTUESE
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
            
            // Fallback inteligjent
            return `🔧 [RRUFE-TESLA] Komanda "${message}" po ekzekutohet nga sistemi i ri inteligjent...`;
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e komandës:", error);
            return `🔧 [RRUFE-TESLA] Komanda "${message}" u pranua. Sistemi po punon në të...`;
        }
    }

    async processLocally(message) {
        console.log("🔧 Duke procesuar lokal:", message);
        
        // Përdor inteligjencën lokale të RRUFE-TESLA
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
        
        if (analysis.containsQuestion) {
            return "Kjo është një pyetje interesante! Për përgjigje më të detajuara, sigurohuni që keni konfiguruar API Key për Gemini.";
        }
        
        // Përgjigje default inteligjente
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
        
        // Kontrollo nëse Gemini është i disponueshëm
        if (!await this.checkAPIStatus()) {
            console.log("❌ Gemini nuk është i disponueshëm, duke përdorur fallback");
            return await this.processFallback(message);
        }
        
        try {
            // Simulim i thirrjes në Gemini
            // Në versionin real, do të integrohet me API-n ekzistuese
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
        
        // Fallback inteligjent bazuar në analizën e mesazhit
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
            // Heq komandën /llogarit nëse ekziston
            let mathExpr = expression.replace(/^\/llogarit\s*/i, '').trim();
            
            // Pastro shprehjen
            let cleanExpr = mathExpr.replace(/[^0-9+\-*/().^]/g, '');
            
            // Zëvendëso ^ me ** për fuqi
            cleanExpr = cleanExpr.replace(/\^/g, '**');
            
            // Llogarit me siguri
            const result = Function(`"use strict"; return (${cleanExpr})`)();
            
            return `🧮 **${mathExpr}** = **${result}**`;
            
        } catch (error) {
            console.error("❌ Gabim në llogaritjen matematikore:", error);
            return '❌ Nuk mund ta llogaris shprehjen matematikore. Kontrolloni sintaksën.';
        }
    }

    async checkAPIStatus() {
        try {
            // Kontrollo nëse ka API Key të konfiguruar
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

    async callGeminiAPI(message) {
        // Simulim i thirrjes në Gemini
        // Në versionin real, do të zëvendësohet me API-n ekzistuese
        console.log("📡 [SIMULIM] Duke thirrur Gemini API...");
        
        // Simuloj një vonesë
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Përgjigje simulimi inteligjente
        const simulatedResponses = {
            'si jeni': "Jam shumë mirë, faleminderit që pyetët! 😊 Çfarë mund të bëj për ju?",
            'sa eshte ora': `🕒 Ora aktuale është: ${new Date().toLocaleTimeString('sq-AL')}`,
            'default': "Kjo është një pyetje interesante. Për përgjigje më të detajuara, më tregoni më shumë kontekst."
        };
        
        return simulatedResponses[message.toLowerCase()] || simulatedResponses.default;
    }

    isGenericResponse(response) {
        const genericPatterns = [
            'nuk e kuptova',
            'mund të përsërisni',
            'nuk kam përgjigje',
            'nuk jam i sigurt',
            'më falni',
            'do të doja të ndihmoja',
            'nuk mund të jap një përgjigje'
        ];
        
        return genericPatterns.some(pattern => 
            response.toLowerCase().includes(pattern)
        );
    }

    // 🛡️ NUK KA EVENT LISTENERS KËTU - do të konfigurohen nga main.js

    // ==================== API PUBLIKE ====================

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
            // 1. Analizo mesazhin
            const analysis = this.analyzeMessage(message);
            
            // 2. Përcakto rrugën më të mirë
            const routeConfig = this.determineBestRoute(message, analysis);
            
            // 3. Ekzekuto rrugën
            const response = await this.executeRoute(routeConfig, message);
            
            console.log("✅ Përgjigja u gjenerua me sukses");
            return response;
            
        } catch (error) {
            console.error("❌ Gabim në procesimin e mesazhit:", error);
            return "Më falni, pati një gabim në sistem. Provo përsëri.";
        }
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

// ==================== EKSPORTIM I SIGURT ====================

// Krijo instancë globale
window.SmartResponseRouter = SmartResponseRouter;

// Krijo instancë default
window.smartResponseRouter = new SmartResponseRouter();

// 🛡️ NUK KA AUTO-INICIALIZIM - prit thirrje manuale nga main.js
console.log("✅ SmartResponseRouter (Version i Sigurt) u ngarkua - Duke pritur inicializim manual");

// ==================== TESTIM I SIGURT ====================

// Funksion për testim të shpejtë
window.testSmartRouter = async function(message = "Pershendetje") {
    console.log("🧪 TEST I SMART ROUTER (Safe Mode):");
    const response = await window.smartResponseRouter.processUserMessage(message);
    console.log("📝 Përgjigja:", response);
    return response;
};
