// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js (I PËRDITËSUAR)
// ======================================================

console.log('🔍 Duke ngarkuar Modulin Principal RRUFEJE...');

// ======================= RRUFE-IMPORT-001 =======================
// 🧠 MODULI: SessionManager
// 📍 VENDOSJA: Në fillim të main.js  
// 🔧 DETYRA: Importo modulin e ri të sesionit
// 📁 SKEDARI: ./modules/sessionManager.js
// ================================================================
import SessionManager from './modules/sessionManager.js';

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
            console.log('✅ PLATFORMA RRUFEJE ME MODULE U INICIALIZUA!');
            
        } catch (error) {
            console.error('❌ Gabim në inicializimin e platformës:', error);
        }
    }
    
    // ======================================================
    // 🧠 METODA: INICIALIZIMI I MODULEVE
    // ======================================================
    async initializeModules() {
        // ======================= RRUFE-MODULE-001 =======================
        // 🧠 MODULI: SessionManager
        // 📍 VENDOSJA: Zëvendëso objektin session me klasën
        // 🔧 DETYRA: Përdor modulin e ri të sesionit
        // ================================================================
        this.modules.session = new SessionManager();
        
        console.log('🎯 MODULI I SESIONIT U INTEGRUAR:', this.modules.session.sessionId);
    }
    
    // ======================================================
    // 💬 METODA: SHFAQJA E MIRËSEARDHJES
    // ======================================================
    showWelcomeMessage() {
        setTimeout(() => {
            if (typeof window.addMessage !== 'undefined') {
                const sessionInfo = this.modules.session.getSessionInfo();
                const welcomeMsg = `
👑 **PLATFORMA RRUFEJE ME MODULE TË REJA!** 

🎯 **Sesioni:** ${sessionInfo.id.substring(0, 15)}...
🕒 **Koha:** ${new Date().toLocaleTimeString('sq-AL')}
🔧 **Status:** 🟢 **MODULI I SESIONIT AKTIV**

💡 *Sistemi i ri i moduleve është integruar me sukses!*
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
    
    console.log('💡 Shkruaj: rrufePlatform.debugPlatform() për të testuar modulin e ri!');
    
} catch (error) {
    console.error('❌ Gabim në ngarkimin e platformës:', error);
}

export { RrufePlatform };
export default rrufePlatform;
