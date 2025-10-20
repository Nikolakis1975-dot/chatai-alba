class SessionManager {
    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.sessionStart = new Date();
        this.messageCount = 0;
    }
    
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('rrufeSessionId');
        if (!sessionId) {
            sessionId = 'rrufe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rrufeSessionId', sessionId);
        }
        return sessionId;
    }
    
    // ... të gjitha metodat e sesionit
}

module.exports = SessionManager;
