// ======================= RRUFE-MODULE-002 =======================
// 🧠 MODULI: ContextMemory (Client)
// 📍 VENDOSJA: /public/js/modules/contextMemory.js
// 🔧 DETYRA: Menaxhim memorie kontekstuale në browser
// 🎯 INTEGRIM: Me SessionManager dhe sistemin ekzistues
// ================================================================

class ContextMemory {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
        this.conversationContext = [];
        this.contextStack = [];
        this.memoryConnections = new Map();
        this.maxContextLength = 10; // 10 mesazhet e fundit
        console.log('🎯 MODULI I KONTEKSTIT U NGARKUA');
    }
    
    // ✅ ANALIZO KONTEKSTIN E BISEDËS
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
    
    // ✅ SHTO MESAZH NË KONTEKST
    addToContext(message, sender, response = null) {
        const contextEntry = {
            message: message,
            sender: sender,
            response: response,
            timestamp: new Date(),
            keywords: this.extractKeywords(message)
        };
        
        // Shto në fillim të array (mesazhet e reja së pari)
        this.conversationContext.unshift(contextEntry);
        
        // Mbaj vetëm mesazhet e fundit
        if (this.conversationContext.length > this.maxContextLength) {
            this.conversationContext = this.conversationContext.slice(0, this.maxContextLength);
        }
        
        console.log('💾 Shtova në kontekst:', message.substring(0, 30));
        this.sessionManager.incrementMessageCount();
    }
    
    // ✅ GJENERO KONTEKST PËR PËRGJIGJE
    generateContextForResponse() {
        if (this.conversationContext.length === 0) {
            return "Bisedë e re. Përshëndetje!";
        }
        
        const recentMessages = this.conversationContext.slice(0, 3); // 3 mesazhet e fundit
        let context = "Konteksti i bisedës: ";
        
        recentMessages.forEach((entry, index) => {
            context += `${entry.sender}: "${entry.message}". `;
        });
        
        return context;
    }
    
    // ✅ KËRKO NË MEMORIE
    searchInMemory(query) {
        const results = [];
        const queryKeywords = this.extractKeywords(query);
        
        this.conversationContext.forEach(entry => {
            const matchScore = this.calculateMatchScore(entry.keywords, queryKeywords);
            if (matchScore > 0.3) { // 30% match
                results.push({
                    entry: entry,
                    score: matchScore
                });
            }
        });
        
        // Rendit sipas rezultatit
        results.sort((a, b) => b.score - a.score);
        return results.slice(0, 3); // 3 rezultatet më të mira
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
    
    // ✅ METODA DEBUG
    debugContext() {
        console.log('🔍 DEBUG I KONTEKSTIT:');
        console.log('- Mesazhe në kontekst:', this.conversationContext.length);
        console.log('- Konteksti i fundit:', this.generateContextForResponse());
        console.log('- Lidhje në memorie:', this.memoryConnections.size);
    }
}

// ======================= RRUFE-INTEGRIM-001 =======================
// 🔗 INTEGRIMI: Me sistemin ekzistues të chat-it
// 📍 VENDOSJA: Në fund të ContextMemory.js
// 🔧 DETYRA: Integro automatikisht me sendMessage
// ================================================================

// ✅ MBISHTRO sendMessage PËR TË RUAJTUR KONTEKST
function integrateWithChatSystem() {
    if (typeof window.sendMessage === 'undefined') {
        console.log('⏳ sendMessage nuk ekziston ende, pres...');
        setTimeout(integrateWithChatSystem, 1000);
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
        
        // ✅ PAS PËRGJIGJES, SHTO NË KONTEKST
        setTimeout(() => {
            const chat = document.getElementById('chat');
            if (chat) {
                const lastMessage = chat.lastElementChild;
                if (lastMessage && lastMessage.classList.contains('bot-message')) {
                    const response = lastMessage.querySelector('.message-content')?.textContent;
                    if (response && window.rrufePlatform?.modules?.contextMemory) {
                        window.rrufePlatform.modules.contextMemory.addToContext(response, 'bot');
                    }
                }
            }
        }, 500);
    };
    
    console.log('🔗 MODULI I KONTEKSTIT U INTEGRUAR ME sendMessage!');
}

// ✅ AUTO-INTEGRIM PAS NGARKIMIT
setTimeout(integrateWithChatSystem, 2000);

export default ContextMemory;
