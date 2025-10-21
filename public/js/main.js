// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js (I PËRDITËSUAR)
// ======================================================

console.log('🔍 Duke ngarkuar Modulin Principal RRUFEJE...');

// ======================= RRUFE-IMPORT-001 =======================
import SessionManager from './modules/sessionManager.js';

// ======================= RRUFE-IMPORT-002 =======================
import ContextMemory from './modules/contextMemory.js';

// ======================= RRUFE-IMPORT-003 =======================
import ChatObserver from './modules/chatObserver.js';

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
            
            this.isInitialized = true;
            console.log('✅ PLATFORMA RRUFEJE ME 3 MODULE U INICIALIZUA!');
            
        } catch (error) {
            console.error('❌ Gabim në inicializimin e platformës:', error);
        }
    }
    
    // ======================================================
    // 🧠 METODA: INICIALIZIMI I MODULEVE
    // ======================================================
    async initializeModules() {
        // ======================= RRUFE-MODULE-001 =======================
        this.modules.session = new SessionManager();
        
        // ======================= RRUFE-MODULE-002 =======================
        this.modules.contextMemory = new ContextMemory(this.modules.session);
        
        // ======================= RRUFE-MODULE-003 =======================
        this.modules.chatObserver = new ChatObserver(this.modules.contextMemory);
        this.modules.chatObserver.startObserving();
        
        // ======================= RRUFE-INTEGRIM-001 =======================
        this.modules.contextMemory.integrateWithChatSystem();
        
        console.log('🎯 3 MODULET U INICIALIZUAN:');
        console.log('- Session:', this.modules.session.sessionId);
        console.log('- Context Memory:', '✅ AKTIV');
        console.log('- Chat Observer:', '✅ AKTIV');
        console.log('- Integrimi me Chat:', '✅ AKTIV');
    }
    
    // ======================================================
    // 💬 METODA: SHFAQJA E MIRËSEARDHJES
    // ======================================================
    showWelcomeMessage() {
        setTimeout(() => {
            if (typeof window.addMessage !== 'undefined') {
                const sessionInfo = this.modules.session.getSessionInfo();
                const welcomeMsg = `
👑 **PLATFORMA RRUFEJE ME 3 MODULE TË REJA!** 

🎯 **Sesioni:** ${sessionInfo.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🧠 **Module të ngarkuara:** 
   • SessionManager ✅
   • ContextMemory ✅  
   • ChatObserver ✅
🔗 **Integrimi:** 🟢 **AKTIV me Chat System**
🔧 **Status:** 🟢 **SISTEMI I VËZHGIMIT AKTIV**

💡 *Tani çdo mesazh vëzhgohet automatikisht!*
                `;
                window.addMessage(welcomeMsg, 'system', false);
            }
        }, 1000);
    }
    
    // ======================================================
    // 🛠️ METODA: DEBUG DHE TESTIM
    // ======================================================
    debugPlatform() {
        console.log('🔍 DEBUG I PLATFORMËS RRUFEJE:');
        console.log('- Sesioni:', this.modules.session.getSessionInfo());
        console.log('- Context Memory:', '✅ AKTIV (' + this.modules.contextMemory.conversationContext.length + ' mesazhe)');
        console.log('- Chat Observer:', this.modules.chatObserver ? '✅ AKTIV' : '❌ JO');
        console.log('- Inicializuar:', this.isInitialized);
        console.log('- Modulet:', Object.keys(this.modules));
        console.log('- Integrimi me Chat:', '✅ AKTIV');
        
        // Testo të gjitha modulet
        this.modules.contextMemory.debugContext();
        if (this.modules.chatObserver) this.modules.chatObserver.debugObserver();
    }
    
    // ======================================================
    // 💾 METODA: TESTIM I SHPEJTË I KONTEKSTIT
    // ======================================================
    testContextMemory() {
        console.log('🧪 TESTIM I KONTEKST MEMORY:');
        
        // Shto disa mesazhe testuese
        this.modules.contextMemory.addToContext("Përshëndetje bot!", "user", "Përshëndetje! Si mund të ndihmoj?");
        this.modules.contextMemory.addToContext("Si je sot?", "user", "Jam shumë mirë, faleminderit!");
        this.modules.contextMemory.addToContext("Çfarë mund të bësh për mua?", "user", "Mund të ndihmoj me shumë gjëra!");
        
        // Shfaq kontekstin
        console.log('📝 Konteksti i gjeneruar:', this.modules.contextMemory.generateContextForResponse());
        
        // Testo kërkimin
        const results = this.modules.contextMemory.searchInMemory("si je");
        console.log('🔍 Rezultatet e kërkimit:', results);
        
        this.modules.contextMemory.debugContext();
    }
}

// ======================================================
// 🚀 INICIALIZIMI I PLATFORMËS
// ======================================================
let rrufePlatform;

try {
    rrufePlatform = new RrufePlatform();
    window.rrufePlatform = rrufePlatform;
    
    console.log('💡 Shkruaj: rrufePlatform.debugPlatform() për të testuar 3 modulet!');
    console.log('💡 Shkruaj: rrufePlatform.testContextMemory() për testim të shpejtë!');
    
} catch (error) {
    console.error('❌ Gabim në ngarkimin e platformës:', error);
}

export { RrufePlatform };
export default rrufePlatform;
