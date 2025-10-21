// ======================================================
// 🧠 MODULI I SESIONIT - sessionManager.js
// ======================================================

class SessionManager {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.sessionStart = new Date();
        this.messageCount = 0;
        this.sessionData = {};
        console.log('🎯 MODULI I SESIONIT U NGARKUA:', this.sessionId);
    }
    
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('rrufeSessionId');
        if (!sessionId) {
            sessionId = 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rrufeSessionId', sessionId);
        }
        return sessionId;
    }
    
    getSessionInfo() {
        const duration = Date.now() - this.sessionStart.getTime();
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        return {
            id: this.sessionId,
            start: this.sessionStart,
            duration: `${minutes}m ${seconds}s`,
            messageCount: this.messageCount,
            data: this.sessionData
        };
    }
    
    saveSessionData(key, value) {
        this.sessionData[key] = value;
        console.log('💾 Ruajta të dhëna sesioni:', key, value);
    }
    
    getSessionData(key) {
        return this.sessionData[key];
    }
    
    renewSession() {
        const newId = 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('rrufeSessionId', newId);
        this.sessionId = newId;
        this.sessionStart = new Date();
        this.messageCount = 0;
        this.sessionData = {};
        return newId;
    }
    
    incrementMessageCount() {
        this.messageCount++;
    }
}

export default SessionManager;
