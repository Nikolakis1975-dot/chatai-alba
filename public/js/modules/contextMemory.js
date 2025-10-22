// ======================= RRUFE-MODULE-002 =======================
// 🧠 MODULI: ContextMemory (Client) - VERSION I PËRMBLDSHUR
// 📍 VENDOSJA: /public/js/modules/contextMemory.js
// 🔧 DETYRA: Menaxhim memorie kontekstuale inteligjente në browser
// 🎯 INTEGRIM: Me SessionManager dhe sistemin ekzistues
// ================================================================

class ContextMemory {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
        this.conversationContext = [];
        this.contextStack = [];
        this.memoryConnections = new Map();
        this.maxContextLength = 15; // ✅ Rritur nga 10 në 15
        
        // ✅ SISTEM I RI I MEMORY MANAGEMENT
        this.cache = new Map();
        this.cleanupInterval = setInterval(() => this.cleanupOldEntries(), 30000); // 30 sekonda
        this.compressionEnabled = true;
        
        console.log('🎯 MODULI I KONTEKSTIT U NGARKUA ME MEMORY MANAGEMENT TË AVANCUAR');
    }
    
    // =================== ✅ ANALIZO KONTEKSTIN E BISEDËS ===================================
    analyzeContext(message) {
        const context = {
            message: message,
            timestamp: new Date(),
            keywords: this.extractKeywords(message),
            sentiment: this.analyzeSentiment(message),
            intent: this.detectIntent(message)
        };
        
        console.log('🔍 Analizova kontekst:', context.keywords);
        return context;
    }
    
    // ============================= ✅ SHTO MESAZH NË KONTEKST (I PËRMBLDSHUR) ===============================
    addToContext(message, sender, response = null) {
        const contextEntry = {
            id: this.generateMessageId(), // ✅ ID unik
            message: message,
            sender: sender,
            response: response,
            timestamp: new Date(),
            keywords: this.extractKeywords(message),
            sentiment: this.analyzeSentiment(message), // ✅ Shtuar
            intent: this.detectIntent(message), // ✅ Shtuar
            importance: this.calculateImportance(message, sender) // ✅ Shtuar
        };
        
        // Shto në fillim të array (mesazhet e reja së pari)
        this.conversationContext.unshift(contextEntry);
        
        // ✅ MEMORY MANAGEMENT I RI: Kontrollo gjatësinë në mënyrë inteligjente
        if (this.conversationContext.length > this.maxContextLength) {
            this.removeLeastImportant(); // ✅ Heq mesazhin më pak të rëndësishëm
        }
        
        // ✅ CACHE SYSTEM: Ruaj në cache për kërkim të shpejtë
        this.addToCache(contextEntry);
        
        // ✅ MEMORY CONNECTIONS: Krijo lidhje inteligjente
        this.createMemoryConnections(contextEntry);
        
        console.log('💾 Shtova në kontekst:', message.substring(0, 30));
        this.sessionManager.incrementMessageCount();
        
        return contextEntry.id; // ✅ Kthe ID për referencë
    }

    // ✅ METODA E RE: GENERATE MESSAGE ID
    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // ✅ METODA E RE: CALCULATE IMPORTANCE
    calculateImportance(message, sender) {
        let score = 0;
        
        // Mesazhet e përdoruesit kanë më shumë rëndësi
        if (sender === 'user') score += 2;
        
        // Pyetjet kanë më shumë rëndësi
        if (message.includes('?') || message.includes('si ') || message.includes('ku ') || message.includes('kur ')) {
            score += 3;
        }
        
        // Mesazhet e gjata kanë më shumë rëndësi
        if (message.length > 50) score += 1;
        
        // Fjalët kyçe të rëndësishme
        const importantKeywords = ['rëndësi', 'dëshiroj', 'dua', 'mëso', 'ndihmo', 'urgjent'];
        if (importantKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            score += 2;
        }
        
        return Math.min(score, 10); // Max 10 points
    }

    // ✅ METODA E RE: REMOVE LEAST IMPORTANT
    removeLeastImportant() {
        if (this.conversationContext.length === 0) return;
        
        // Gjej mesazhin me rëndësinë më të ulët
        let minImportance = 11;
        let indexToRemove = -1;
        
        this.conversationContext.forEach((entry, index) => {
            if (entry.importance < minImportance) {
                minImportance = entry.importance;
                indexToRemove = index;
            }
        });
        
        if (indexToRemove !== -1) {
            const removed = this.conversationContext.splice(indexToRemove, 1)[0];
            this.removeFromCache(removed.id);
            console.log('🧹 Hoqa mesazhin:', removed.message.substring(0, 20));
        }
    }

    // ✅ METODA E RE: ADD TO CACHE
    addToCache(entry) {
        this.cache.set(entry.id, entry);
        
        // Kontrollo madhësinë e cache
        if (this.cache.size > 50) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }

    // ✅ METODA E RE: REMOVE FROM CACHE
    removeFromCache(messageId) {
        this.cache.delete(messageId);
    }

    // ✅ METODA E RE: CREATE MEMORY CONNECTIONS
    createMemoryConnections(newEntry) {
        if (this.conversationContext.length < 2) return;
        
        const previousEntry = this.conversationContext[1]; // Mesazhi para atij të ri
        
        // Krijo lidhje bazuar në fjalët kyçe të përbashkëta
        const commonKeywords = newEntry.keywords.filter(keyword => 
            previousEntry.keywords.includes(keyword)
        );
        
        if (commonKeywords.length > 0) {
            this.memoryConnections.set(newEntry.id, {
                connectedTo: previousEntry.id,
                strength: commonKeywords.length,
                keywords: commonKeywords
            });
        }
    }

    // ✅ METODA E RE: SMART CONTEXT GENERATION
    generateSmartContext() {
        if (this.conversationContext.length === 0) {
            return "Bisedë e re. Përshëndetje!";
        }
        
        // Merr 3-5 mesazhet më të rëndësishme
        const importantMessages = [...this.conversationContext]
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 5);
        
        let context = "Konteksti i bisedës: ";
        
        importantMessages.forEach((entry, index) => {
            context += `${entry.sender}: "${entry.message}". `;
            
            // Shto përgjigjen nëse ekziston
            if (entry.response) {
                context += `Bot: "${entry.response}". `;
            }
        });
        
        // Shto informacion shtesë
        context += ` [${this.conversationContext.length} mesazhe totale, ${this.memoryConnections.size} lidhje]`;
        
        return context;
    }

    // ✅ METODA E RE: ENHANCED SEARCH
    searchInMemoryEnhanced(query) {
        const results = [];
        const queryKeywords = this.extractKeywords(query);
        
        // Kërko në cache fillimisht (më e shpejtë)
        this.cache.forEach((entry, id) => {
            const matchScore = this.calculateEnhancedMatchScore(entry, query, queryKeywords);
            if (matchScore > 0.2) { // Threshold më i ulët
                results.push({
                    entry: entry,
                    score: matchScore,
                    source: 'cache'
                });
            }
        });
        
        // Kërko në të gjithë kontekstin
        this.conversationContext.forEach(entry => {
            // Shmang duplikimet
            if (!results.some(result => result.entry.id === entry.id)) {
                const matchScore = this.calculateEnhancedMatchScore(entry, query, queryKeywords);
                if (matchScore > 0.2) {
                    results.push({
                        entry: entry,
                        score: matchScore,
                        source: 'memory'
                    });
                }
            }
        });
        
        // Rendit sipas rezultatit
        results.sort((a, b) => b.score - a.score);
        
        console.log('🔍 Kërkim i përmirësuar:', results.length + ' rezultate');
        return results.slice(0, 5); // Kthe 5 rezultatet më të mira
    }

    // ✅ METODA E RE: CALCULATE ENHANCED MATCH SCORE
    calculateEnhancedMatchScore(entry, query, queryKeywords) {
        let score = 0;
        
        // Match bazuar në fjalët kyçe
        const keywordMatch = this.calculateMatchScore(entry.keywords, queryKeywords);
        score += keywordMatch * 0.6;
        
        // Match bazuar në intent
        const queryIntent = this.detectIntent(query);
        if (entry.intent === queryIntent) {
            score += 0.3;
        }
        
        // Match bazuar në sentiment
        const querySentiment = this.analyzeSentiment(query);
        if (entry.sentiment === querySentiment) {
            score += 0.1;
        }
        
        // Bonus për mesazhe të rëndësishme
        score += (entry.importance / 10) * 0.1;
        
        return Math.min(score, 1);
    }

    // ✅ METODA E RE: CLEANUP OLD ENTRIES
    cleanupOldEntries() {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        
        this.conversationContext = this.conversationContext.filter(entry => {
            const shouldKeep = entry.timestamp > fiveMinutesAgo || entry.importance > 5;
            if (!shouldKeep) {
                this.removeFromCache(entry.id);
                this.memoryConnections.delete(entry.id);
            }
            return shouldKeep;
        });
        
        console.log('🧹 Pastrim i memories:', this.conversationContext.length + ' mesazhe të mbetura');
    }

    // ✅ METODA E RE: GET CONTEXT STATS
    getContextStats() {
        return {
            totalMessages: this.conversationContext.length,
            cacheSize: this.cache.size,
            memoryConnections: this.memoryConnections.size,
            averageImportance: this.conversationContext.reduce((sum, entry) => sum + entry.importance, 0) / this.conversationContext.length || 0,
            oldestMessage: this.conversationContext.length > 0 ? this.conversationContext[this.conversationContext.length - 1].timestamp : null,
            newestMessage: this.conversationContext.length > 0 ? this.conversationContext[0].timestamp : null
        };
    }
    
    // ================================== ✅ GJENERO KONTEKST PËR PËRGJIGJE ===============================
    generateContextForResponse() {
        // ✅ Përdor versionin e ri inteligjent
        return this.generateSmartContext();
    }
    
    // ======================================✅ KËRKO NË MEMORIE ==================================
    searchInMemory(query) {
        // ✅ Përdor versionin e përmirësuar
        return this.searchInMemoryEnhanced(query);
    }
    
    // ✅ METODA NDIHMËSE - NXJERR FJALËT KYÇE
    extractKeywords(text) {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        // Largo fjalët e zakonshme
        const stopWords = ['është', 'jam', 'jeni', 'ju', 'unë', 'nga', 'në', 'për', 'me', 'pa', 'tek'];
        return words.filter(word => !stopWords.includes(word));
    }
    
    // ✅ METODA NDIHMËSE - ANALIZO SENTIMENT
    analyzeSentiment(text) {
        const positiveWords = ['mirë', 'bukur', 'faleminderit', 'mbreslënës', 'shkëlqyeshëm', 'përkushtuar'];
        const negativeWords = ['keq', 'dështim', 'problem', 'gabim', 'i mërzitshëm', 'i shqetësuar'];
        
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) score++;
            if (negativeWords.includes(word)) score--;
        });
        
        return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    }
    
    // ✅ METODA NDIHMËSE - ZBULO QËLLIMIN
    detectIntent(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('si je') || lowerText.includes('si jeni')) return 'greeting';
        if (lowerText.includes('faleminderit') || lowerText.includes('rrofsh')) return 'gratitude';
        if (lowerText.includes('sa është') || lowerText.includes('llogarit')) return 'calculation';
        if (lowerText.includes('ku është') || lowerText.includes('gjej')) return 'location';
        if (lowerText.includes('pse') || lowerText.includes('arsye')) return 'explanation';
        
        return 'general';
    }
    
    // ✅ METODA NDIHMËSE - LLOGARIT PËRSHTATJE
    calculateMatchScore(keywords1, keywords2) {
        if (keywords1.length === 0 || keywords2.length === 0) return 0;
        
        const commonWords = keywords1.filter(word => keywords2.includes(word));
        return commonWords.length / Math.max(keywords1.length, keywords2.length);
    }
    
    // ======================= RRUFE-INTEGRIM-001 =======================
    // 🔗 METODA: integrateWithChatSystem
    // 📍 VENDOSJA: Brenda klasës ContextMemory
    // 🔧 DETYRA: Integro automatikisht me sendMessage ekzistues
    // ================================================================
    integrateWithChatSystem() {
        console.log('🔗 Duke integruar ContextMemory me sistemin e chat-it...');
        
        if (typeof window.sendMessage === 'undefined') {
            console.log('⏳ sendMessage nuk ekziston ende, pres...');
            setTimeout(() => this.integrateWithChatSystem(), 1000);
            return;
        }

        const originalSendMessage = window.sendMessage;
        
        window.sendMessage = async function() {
            const input = document.getElementById('user-input');
            const message = input.value.trim();
            
            if (!message) return;

            // ✅ SHTO MESAZHIN E PËRDORUESIT NË KONTEKST
            if (window.rrufePlatform && window.rrufePlatform.modules.contextMemory) {
                window.rrufePlatform.modules.contextMemory.addToContext(message, 'user');
            }
            
            // ✅ THIRRE FUNKSIONIN ORIGJINAL
            await originalSendMessage.call(this);
            
            // ✅ PAS PËRGJIGJES, SHTO PËRGJIGJEN E BOTIT NË KONTEKST
            setTimeout(() => {
                const chat = document.getElementById('chat');
                if (chat) {
                    const messages = chat.querySelectorAll('.bot-message');
                    const lastBotMessage = messages[messages.length - 1];
                    if (lastBotMessage) {
                        const response = lastBotMessage.querySelector('.message-content')?.textContent;
                        if (response && window.rrufePlatform?.modules?.contextMemory) {
                            window.rrufePlatform.modules.contextMemory.addToContext(response, 'bot');
                            console.log('💾 Ruajta përgjigjen e botit në kontekst:', response.substring(0, 50));
                        }
                    }
                }
            }, 1000);
        };
        
        console.log('✅ MODULI I KONTEKSTIT U INTEGRUAR ME sendMessage!');
    }
    
    // ✅ METODA DEBUG E PËRMBLDSHUR
    debugContext() {
        const stats = this.getContextStats();
        console.log('🔍 DEBUG I KONTEKSTIT TË PËRMBLDSHUR:');
        console.log('- Mesazhe në kontekst:', stats.totalMessages);
        console.log('- Madhësia e cache:', stats.cacheSize);
        console.log('- Lidhje në memorie:', stats.memoryConnections);
        console.log('- Rëndësia mesatare:', stats.averageImportance.toFixed(2));
        console.log('- Konteksti i zgjeruar:', this.generateSmartContext().substring(0, 100) + '...');
        
        // Shfaq 3 mesazhet më të rëndësishme
        const topMessages = [...this.conversationContext]
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 3);
        
        console.log('- Mesazhet më të rëndësishme:');
        topMessages.forEach((msg, index) => {
            console.log(`  ${index + 1}. [${msg.importance}] ${msg.message.substring(0, 40)}`);
        });
    }
}

export default ContextMemory;
