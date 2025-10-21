// ======================================================
// 🚀 MODULI PRINCIPAL RRUFEJE - main.js
// ======================================================

console.log('🔍 Duke ngarkuar Modulin Principal RRUFEJE...');

class RrufePlatform {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        try {
            console.log('🚀 Duke inicializuar Platformën RRUFEJE...');
            
            // ✅ INICIALIZO MODULET
            await this.initializeModules();
            
            // ✅ SHFAQ MESAZH MIRËSEARDHJEJE
            this.showWelcomeMessage();
            
            // ✅ NGARKO HISTORINË E SESIONIT
            await this.loadSessionHistory();
            
            this.isInitialized = true;
            console.log('✅ PLATFORMA RRUFEJE U INICIALIZUA ME SUKSES!');
            
        } catch (error) {
            console.error('❌ Gabim në inicializimin e platformës:', error);
        }
    }
    
    async initializeModules() {
        // ✅ MODULI I SESIONIT
        this.modules.session = {
            id: this.getOrCreateSessionId(),
            startTime: new Date(),
            messageCount: 0
        };
        
        console.log('🎯 MODULI I SESIONIT:', this.modules.session.id);
    }
    
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
    
    showWelcomeMessage() {
        // ✅ PROVO TË SHFAQËSH MESAZH NË CHAT
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
            } else {
                console.log('💬 Sistemi është gati, por addMessage nuk ekziston');
            }
        }, 1000);
    }
    
    async loadSessionHistory() {
        try {
            console.log('📂 Duke kontrolluar historinë e sesionit...');
            // ✅ KËTU DO VIJË LOGJIKA E HISTORISË
        } catch (error) {
            console.log('📂 Duke filluar sesion të ri...');
        }
    }
    
    // ✅ METODA PËR DEBUG
    debugPlatform() {
        console.log('🔍 DEBUG I PLATFORMËS RRUFEJE:');
        console.log('- Sesioni:', this.modules.session);
        console.log('- Inicializuar:', this.isInitialized);
        console.log('- Modulet:', Object.keys(this.modules));
    }
}

// ✅ INICIALIZO PLATFORMËN
let rrufePlatform;

try {
    rrufePlatform = new RrufePlatform();
    window.rrufePlatform = rrufePlatform;
    
    // ✅ SHTO BUTON DEBUG NË CONSOLE
    console.log('💡 Shkruaj: rrufePlatform.debugPlatform() për të parë statusin');
    
} catch (error) {
    console.error('❌ Gabim në ngarkimin e platformës:', error);
}

// ✅ EKSPORTO PËR PËRDORIM NË MODULE TË TJERA
export { RrufePlatform };
export default rrufePlatform;
