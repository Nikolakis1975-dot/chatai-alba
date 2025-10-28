// 🌉 URA E KOMUNIKIMIT ME SERVERIN RRUFE-TESLA

class ApiBridge {
    constructor() {
        this.baseURL = window.location.origin; // URL aktual i aplikacionit
        this.endpoints = {
            voice: '/api/voice/transcribe',
            universalDecree: '/api/voice/universal-decree',
            status: '/api/voice/status',
            chat: '/api/chat/message',
            context: '/api/context/update',
            multiAI: '/api/rrufe/multi-ai'
        };
        this.isOnline = true;
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 sekondë
    }

    // 🔧 METODA BAZË E API CALL
    async callAPI(endpoint, data = {}, options = {}) {
        const url = this.baseURL + endpoint;
        const config = {
            method: options.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RRUFE-Platform': 'RRUFE-TESLA-8.0',
                'X-Universal-Harmony': this.getHarmonyLevel(),
                ...options.headers
            },
            ...options
        };

        // Shto të dhënat në body nëse është POST/PUT
        if (['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                session: this.getSessionInfo()
            });
        }

        console.log(`🌐 API Call: ${config.method} ${endpoint}`, data);

        try {
            const response = await this.fetchWithRetry(url, config);
            const result = await response.json();

            // Verifikoj përgjigjen
            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            console.log(`✅ API Success: ${endpoint}`, result);
            return result;

        } catch (error) {
            console.error(`❌ API Error: ${endpoint}`, error);
            return this.handleAPIError(error, endpoint, data);
        }
    }

    // 🔄 FETCH ME RITRY AUTOMATIK
    async fetchWithRetry(url, config, attempt = 1) {
        try {
            const response = await fetch(url, config);
            
            // Nëse është server error, provo përsëri
            if (response.status >= 500 && attempt < this.retryAttempts) {
                console.warn(`⚠️ Retry attempt ${attempt} for ${url}`);
                await this.delay(this.retryDelay * attempt);
                return this.fetchWithRetry(url, config, attempt + 1);
            }

            return response;

        } catch (error) {
            if (attempt < this.retryAttempts) {
                console.warn(`⚠️ Retry attempt ${attempt} for ${url} (network error)`);
                await this.delay(this.retryDelay * attempt);
                return this.fetchWithRetry(url, config, attempt + 1);
            }
            throw error;
        }
    }

    // 🎤 METODA SPECIFIKE PËR VOICE
    async processVoice(audioBlob, context = {}) {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('context', JSON.stringify(context));
        formData.append('user', this.getUserInfo());
        formData.append('session', this.getSessionId());

        try {
            const response = await fetch(this.baseURL + this.endpoints.voice, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-RRUFE-Platform': 'RRUFE-TESLA-8.0'
                }
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Voice processing failed');
            }

            // Aktivizo Dekretin Universal nëse ekziston
            if (result.decree) {
                this.activateUniversalDecree(result.decree);
            }

            return result;

        } catch (error) {
            console.error('❌ Voice API Error:', error);
            return this.handleVoiceError(error, audioBlob);
        }
    }

    // 📜 METODA PËR DEKRET UNIVERSAL
    async sendUniversalDecree(audioBlob, decreeContext = {}) {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('user', 'Këshilli_Universal');
        formData.append('session', 'universal_decree_session');
        formData.append('context', JSON.stringify({
            ...decreeContext,
            priority: 'high',
            source: 'universal_council'
        }));

        try {
            const response = await fetch(this.baseURL + this.endpoints.universalDecree, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('🏛️ Dekreti Universal u dërgua me sukses!', result);
                this.broadcastDecreeToModules(result.decree);
            }

            return result;

        } catch (error) {
            console.error('❌ Universal Decree Error:', error);
            return { success: false, error: error.message };
        }
    }

    // 🌐 METODA PËR MULTI-AI BRIDGE
    async routeToAI(message, context = {}) {
        return this.callAPI(this.endpoints.multiAI, {
            input: message,
            context: context,
            urgency: context.urgency || 'medium'
        });
    }

    // 💾 METODA PËR CONTEXT MEMORY
    async updateContext(contextUpdate) {
        return this.callAPI(this.endpoints.context, {
            action: 'update',
            data: contextUpdate,
            session: this.getSessionId()
        });
    }

    // 📊 METODA PËR STATUS
    async getServiceStatus() {
        return this.callAPI(this.endpoints.status, {}, { method: 'GET' });
    }

    // 🔮 AKTIVIZIMI I DEKRETIT UNIVERSAL
    activateUniversalDecree(decree) {
        console.log('📜 DEKRETI UNIVERSAL U AKTIVIZUA:', decree.title);
        
        // Transmeto në të gjitha modulet
        this.broadcastDecreeToModules(decree);
        
        // Shfaq në UI nëse ekziston funksioni
        if (window.showUniversalMessage) {
            window.showUniversalMessage(decree.message.shqip);
        }

        // Ruaj në historinë lokale
        this.saveDecreeToHistory(decree);
    }

    // 📢 TRANSMETIMI I DEKRETIT NË MODULET
    broadcastDecreeToModules(decree) {
        const modules = [
            'multiAIBridge',
            'quantumMemory', 
            'divineConstitution',
            'cognitiveAwareness',
            'neuralFeedbackLoop',
            'bioNeuralNetwork'
        ];

        modules.forEach(moduleName => {
            if (window[moduleName] && typeof window[moduleName].receiveUniversalDecree === 'function') {
                try {
                    window[moduleName].receiveUniversalDecree(decree);
                    console.log(`✅ Dekreti u transmetua te ${moduleName}`);
                } catch (error) {
                    console.warn(`⚠️ ${moduleName} nuk pranoi dekretin:`, error);
                }
            }
        });
    }

    // 💾 RUAJTJA E DEKRETIT NË HISTORI
    saveDecreeToHistory(decree) {
        try {
            const history = JSON.parse(localStorage.getItem('rrufe_decrees') || '[]');
            history.unshift({
                ...decree,
                receivedAt: new Date().toISOString(),
                harmony: this.getHarmonyLevel()
            });
            
            // Mbaj vetëm 50 dekretet e fundit
            if (history.length > 50) {
                history.pop();
            }
            
            localStorage.setItem('rrufe_decrees', JSON.stringify(history));
        } catch (error) {
            console.warn('⚠️ Nuk u ruajt dekreti në histori:', error);
        }
    }

    // 🛠️ METODA NDIHMËSE
    getHarmonyLevel() {
        // Llogarit nivelin e harmonisë bazuar në modulet aktive
        const activeModules = [
            'multiAIBridge', 'quantumMemory', 'divineConstitution',
            'cognitiveAwareness', 'voiceIntegration'
        ].filter(module => window[module]);

        return Math.round((activeModules.length / 5) * 100);
    }

    getSessionInfo() {
        return {
            id: this.getSessionId(),
            startTime: localStorage.getItem('session_start') || new Date().toISOString(),
            harmony: this.getHarmonyLevel()
        };
    }

    getSessionId() {
        let sessionId = localStorage.getItem('rrufe_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rrufe_session_id', sessionId);
            localStorage.setItem('session_start', new Date().toISOString());
        }
        return sessionId;
    }

    getUserInfo() {
        return localStorage.getItem('rrufe_username') || 'User_' + this.getSessionId().substr(0, 8);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleAPIError(error, endpoint, data) {
        const errorResponse = {
            success: false,
            error: error.message,
            endpoint: endpoint,
            timestamp: new Date().toISOString(),
            harmony: this.getHarmonyLevel()
        };

        // Nëse jemi offline, trego mesazh përkatës
        if (!navigator.onLine) {
            errorResponse.offline = true;
            errorResponse.message = 'Jeni offline. Kontrolloni lidhjen me internet.';
        }

        return errorResponse;
    }

    handleVoiceError(error, audioBlob) {
        return {
            success: false,
            error: error.message,
            offline: !navigator.onLine,
            audioSize: audioBlob.size,
            timestamp: new Date().toISOString(),
            message: 'Gabim në procesimin e zërit. Provoni përsëri.'
        };
    }

    // 📡 VERIFIKIMI I KONEKTIVITETIT
    async checkConnectivity() {
        try {
            const response = await fetch(this.baseURL + this.endpoints.status, {
                method: 'GET',
                timeout: 5000
            });
            this.isOnline = response.ok;
            return this.isOnline;
        } catch (error) {
            this.isOnline = false;
            return false;
        }
    }
}

// 🎯 EKSPORTIMI GLOBAL
window.ApiBridge = ApiBridge;
window.apiBridge = new ApiBridge();

console.log('🌉 ApiBridge u ngarkua! Harmonia:', window.apiBridge.getHarmonyLevel() + '%');

// 🔄 VERIFIKO KONEKTIVITETIN ÇDO 30 SEKONDA
setInterval(() => {
    window.apiBridge.checkConnectivity();
}, 30000);

// 🎉 INICIALIZO MENJËHERË
window.apiBridge.checkConnectivity().then(online => {
    console.log(online ? '✅ Online' : '❌ Offline');
});
