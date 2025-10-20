// ✅ MODULI PRINCIPAL - LIDHËSI I MODULEVE
import SessionManager from '../modules/sessionManager.js';
import ContextMemory from '../modules/contextMemory.js';

class RrufePlatform {
    constructor() {
        this.sessionManager = new SessionManager();
        this.contextMemory = new ContextMemory(this.sessionManager.sessionId);
        this.initializePlatform();
    }
    
    initializePlatform() {
        console.log('🚀 PLATFORMA RRUFEJE U NGARKUA!');
        this.showWelcomeMessage();
        this.loadSessionHistory();
        this.initializeEventListeners();
    }
    
    showWelcomeMessage() {
        // Shfaqje mirëseardhjeje
    }
    
    loadSessionHistory() {
        // Ngarkim historie
    }
    
    initializeEventListeners() {
        // Lidhje me butonat ekzistuese
    }
}

// ✅ INICIALIZO PLATFORMËN
window.rrufePlatform = new RrufePlatform();
