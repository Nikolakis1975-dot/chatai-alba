// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js
// ======================================================

console.log('🔍 Duke ngarkuar Modulin Principal RRUFEJE...');

// ======================================================
// 🎯 IMPORTS - MODULET E JASHTME
// ======================================================

// ======================= RRUFE-IMPORT-001 =======================
// 🧠 MODULI: SessionManager
// 📍 VENDOSJA: Shkcommento kur të krijohet skedari
// 📁 SKEDARI: /js/modules/sessionManager.js
// ================================================================
// import SessionManager from './modules/sessionManager.js';

// ======================= RRUFE-IMPORT-002 =======================  
// 🧠 MODULI: ContextMemory
// 📍 VENDOSJA: Shkcommento kur të krijohet skedari
// 📁 SKEDARI: /js/modules/contextMemory.js
// ================================================================
// import ContextMemory from './modules/contextMemory.js';

class RrufePlatform {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Duke inicializuar Platformën RRUFEJE...');
            
            // ======================================================
            // 🧠 INICIALIZIMI I MODULEVE
            // ======================================================
            await this.initializeModules();
            
            // ======================================================
            // 💬 SHFAQJA E MIRËSEARDHJES
            // ======================================================
            this.showWelcomeMessage();
            
            // ======================================================
            // 📂 NGARKIMI I HISTORISË
            // ======================================================
            await this.loadSessionHistory();
            
            this.isInitialized = true;
            console.log('✅ PLATFORMA RRUFEJE U INICIALIZUA ME SUKSES!');
            
        } catch (error) {
            console.error('❌ Gabim në inicializimin e platformës:', error);
        }
    }
    
    // ======================================================
    // 🧠 METODA: INICIALIZIMI I MODULEVE
    // ======================================================
    async initializeModules() {
        // ✅ MODULI I SESIONIT - BAZË
        this.modules.session = {
            id: this.getOrCreateSessionId(),
            startTime: new Date(),
            messageCount: 0,
            data: {}
        };
        
        console.log('🎯 MODULI I SESIONIT:', this.modules.session.id);
        
        // ======================= RRUFE-MODULE-001 =======================
        // 🧠 MODULI: SessionManager
        // 📍 VENDOSJA: Në këtë linjë
        // 🔧 DETYRA: Zëvendëso objektin session me klasën SessionManager
        // 📁 SKEDARI: /js/modules/sessionManager.js
        // ================================================================
        // this.modules.session = new SessionManager();
        
        // ======================= RRUFE-MODULE-002 =======================
        // 🧠 MODULI: ContextMemory  
        // 📍 VENDOSJA: Në këtë linjë
        // 🔧 DETYRA: Krijo instancën e ContextMemory
        // 📁 SKEDARI: /js/modules/contextMemory.js
        // ================================================================
        // this.modules.contextMemory = new ContextMemory(this.modules.session.id);
    }
    
    // ======================================================
    // 💾 METODA: MENAXHIMI I SESIONIT
    // ======================================================
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('rrufeSessionId');
        if (!sessionId) {
            sessionId = 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rrufeSessionId', sessionId);
            console.log('🆕 KRIJOVA SESION TË RI:', sessionId);
        } else {
            console.log('🔁 RIKTHEVA SESIONIN:', sessionId);
        }
        return sessionId;
    }
    
    // ======================================================
    // 💬 METODA: SHFAQJA E MIRËSEARDHJES
    // ======================================================
    showWelcomeMessage() {
        setTimeout(() => {
            if (typeof window.addMessage !== 'undefined') {
                const welcomeMsg = `
👑 **PLATFORMA RRUFEJE U AKTIVIZUA!** 

🎯 **Sesioni:** ${this.modules.session.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🔧 **Status:** 🟢 **MODULET E NGARKUARA**

💡 *Sistemi i ri i moduleve është gati!*
                `;
                window.addMessage(welcomeMsg, 'system', false);
            }
        }, 1000);
    }
    
    // ======================================================
    // 📂 METODA: NGARKIMI I HISTORISË
    // ======================================================
    async loadSessionHistory() {
        try {
            console.log('📂 Duke kontrolluar historinë e sesionit...');
            
            // ======================= RRUFE-FEATURE-001 =======================
            // 🧠 FUNKSIONALITETI: Ngarkimi i historisë së sesionit
            // 📍 VENDOSJA: Në këtë metodë
            // 🔧 DETYRA: Implemento fetch për historinë e sesionit
            // 📁 ENDPOINT: /api/chat/session-history/:sessionId
            // ================================================================
            // const history = await this.fetchSessionHistory();
            // if (history.length > 0) {
            //     this.displayHistory(history);
            // }
            
        } catch (error) {
            console.log('📂 Duke filluar sesion të ri...');
        }
    }
    
    // ======================================================
    // 🛠️ METODA: DEBUG DHE TESTIM
    // ======================================================
    debugPlatform() {
        console.log('🔍 DEBUG I PLATFORMËS RRUFEJE:');
        console.log('- Sesioni:', this.modules.session);
        console.log('- Inicializuar:', this.isInitialized);
        console.log('- Modulet:', Object.keys(this.modules));
    }
}

// ======================================================
// 🚀 INICIALIZIMI I PLATFORMËS
// ======================================================
let rrufePlatform;

try {
    rrufePlatform = new RrufePlatform();
    window.rrufePlatform = rrufePlatform;
    
    console.log('💡 Shkruaj: rrufePlatform.debugPlatform() për të parë statusin');
    
} catch (error) {
    console.error('❌ Gabim në ngarkimin e platformës:', error);
}

export { RrufePlatform };
export default rrufePlatform;
