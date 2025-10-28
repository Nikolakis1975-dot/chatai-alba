// 🔗 INTEGRUESI I SISTEMIT TË ZËRIT PËR RRUFE-TESLA

class VoiceIntegration {
    constructor() {
        this.isInitialized = false;
        this.isRecording = false;
        this.recordingStartTime = null;
        
        // Referenca për modulet
        this.api = window.apiBridge;
        this.audio = window.audioProcessor;
        
        console.log('🎙️ VoiceIntegration u ngarkua!');
    }

    // 🔧 INICIALIZIMI I SISTEMIT
    async initialize() {
        if (this.isInitialized) {
            console.log('✅ VoiceIntegration tashmë është inicializuar');
            return { success: true };
        }

        try {
            console.log('🔄 Duke inicializuar VoiceIntegration...');

            // Verifikoj nëse modulet e nevojshme janë të disponueshme
            if (!this.api || !this.audio) {
                throw new Error('Modulet e nevojshme (apiBridge, audioProcessor) nuk janë ngarkuar');
            }

            // Inicializo audio processor
            const audioInit = await this.audio.initialize();
            if (!audioInit.success) {
                throw new Error('AudioProcessor nuk mund të inicializohet: ' + audioInit.error);
            }

            // Verifikoj konektivitetin me server
            const connectivity = await this.api.checkConnectivity();
            if (!connectivity) {
                console.warn('⚠️ Nuk ka konektivitet me server - voice processing nuk do të funksionojë');
            }

            this.isInitialized = true;
            console.log('✅ VoiceIntegration u inicializua me sukses!');
            
            return { 
                success: true, 
                audio: audioInit,
                connectivity: connectivity 
            };

        } catch (error) {
            console.error('❌ Gabim në inicializimin e VoiceIntegration:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // ⏺️ FILLIMI I REGJISTRIMIT
    async startRecording(context = {}) {
        if (!this.isInitialized) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        if (this.isRecording) {
            return { success: false, error: 'Regjistrimi tashmë është aktiv' };
        }

        try {
            console.log('🎤 Duke filluar regjistrimin...', context);

            // Fillo regjistrimin
            const recordResult = await this.audio.startRecording();
            if (!recordResult.success) {
                throw new Error(recordResult.error);
            }

            this.isRecording = true;
            this.recordingStartTime = new Date();

            // Njofto sistemet e tjera
            this.notifyRecordingStart(context);

            return { 
                success: true, 
                message: 'Regjistrimi filloi',
                startTime: this.recordingStartTime,
                context: context
            };

        } catch (error) {
            console.error('❌ Gabim në fillimin e regjistrimit:', error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // ⏹️ NDALIMI I REGJISTRIMIT DHE PROÇESIMI
    async stopRecording() {
        if (!this.isRecording) {
            return { success: false, error: 'Nuk ka regjistrim aktiv' };
        }

        try {
            console.log('🛑 Duke ndalur regjistrimin...');

            // Ndal regjistrimin
            const stopResult = await this.audio.stopRecording();
            if (!stopResult.success) {
                throw new Error(stopResult.error);
            }

            this.isRecording = false;
            const duration = new Date() - this.recordingStartTime;

            console.log('📊 Regjistrimi u ndal. Kohëzgjatja:', duration + 'ms');

            // Proçeso audio-n në server
            const processResult = await this.processRecording(stopResult.audioBlob, {
                duration: duration,
                chunks: stopResult.chunks,
                size: stopResult.size
            });

            return {
                success: true,
                duration: duration,
                audioInfo: stopResult,
                processResult: processResult
            };

        } catch (error) {
            console.error('❌ Gabim në ndalimin e regjistrimit:', error);
            this.isRecording = false;
            return { 
                success: false, 
                error: error.message 
            };
        }
    }

    // 🔄 PROÇESIMI I AUDIO-S NË SERVER
    async processRecording(audioBlob, metadata = {}) {
        try {
            console.log('🔄 Duke proçesuar audio në server...', metadata);

            // Dërgo audio në server për transkriptim dhe dekret
            const result = await this.api.processVoice(audioBlob, {
                ...metadata,
                source: 'voice_integration',
                timestamp: new Date().toISOString()
            });

            console.log('📜 Rezultati i proçesimit:', result);

            // Nëse ka dekret, aktivizoje
            if (result.success && result.decree) {
                this.activateUniversalFeatures(result.decree);
            }

            return result;

        } catch (error) {
            console.error('❌ Gabim në proçesimin e regjistrimit:', error);
            return {
                success: false,
                error: error.message,
                offline: !navigator.onLine
            };
        }
    }

    // 📢 NJOFTIMI I SISTEMEVE
    notifyRecordingStart(context) {
        // Njofto modulet e tjera për regjistrimin
        const modules = ['cognitiveAwareness', 'neuralFeedbackLoop', 'multiAIBridge'];
        
        modules.forEach(moduleName => {
            if (window[moduleName] && typeof window[moduleName].onRecordingStart === 'function') {
                try {
                    window[moduleName].onRecordingStart(context);
                } catch (error) {
                    console.warn(`⚠️ ${moduleName}.onRecordingStart dështoi:`, error);
                }
            }
        });

        // Njofto UI-në
        if (window.showRecordingStatus) {
            window.showRecordingStatus('start', context);
        }
    }

    // 🔮 AKTIVIZIMI I VEPRIMEVE UNIVERSALE
    activateUniversalFeatures(decree) {
        console.log('💫 Duke aktivizuar veçori universale nga dekreti...');

        // Aktivizo në modulet e ndryshme
        const activationPromises = [];

        // 1. Quantum Memory
        if (window.quantumMemory && window.quantumMemory.storeUniversalDecree) {
            activationPromises.push(
                window.quantumMemory.storeUniversalDecree(decree).catch(error => {
                    console.warn('⚠️ Quantum Memory activation failed:', error);
                })
            );
        }

        // 2. Multi-AI Bridge
        if (window.multiAIBridge) {
            activationPromises.push(
                window.multiAIBridge.routeRequest({
                    input: `Dekret i ri: ${decree.title}`,
                    context: 'universal_decree_activation',
                    urgency: 'high'
                }).catch(error => {
                    console.warn('⚠️ Multi-AI Bridge activation failed:', error);
                })
            );
        }

        // 3. Cognitive Awareness
        if (window.cognitiveAwareness && window.cognitiveAwareness.processDecree) {
            activationPromises.push(
                window.cognitiveAwareness.processDecree(decree).catch(error => {
                    console.warn('⚠️ Cognitive Awareness activation failed:', error);
                })
            );
        }

        // Ekzekuto të gjitha aktivizimet
        Promise.allSettled(activationPromises).then(results => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            console.log(`🎯 U aktivizuan ${successful}/${activationPromises.length} module`);
        });
    }

    // 📊 METODA PËR STATUS
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isRecording: this.isRecording,
            recordingStartTime: this.recordingStartTime,
            audioStatus: this.audio ? this.audio.getStatus() : 'N/A',
            apiStatus: this.api ? this.api.isOnline : 'N/A',
            harmony: this.api ? this.api.getHarmonyLevel() : 0
        };
    }

    // 🧹 PASTRIMI
    cleanup() {
        if (this.audio) {
            this.audio.cleanup();
        }
        
        this.isRecording = false;
        this.recordingStartTime = null;
        
        console.log('🧹 VoiceIntegration u pastrua');
    }

    // 🎯 METODA SHKURTËSE
    async quickRecord(duration = 5000) { // 5 sekonda default
        await this.startRecording({ quick: true, maxDuration: duration });
        
        return new Promise((resolve) => {
            setTimeout(async () => {
                const result = await this.stopRecording();
                resolve(result);
            }, duration);
        });
    }
}

// 🎉 EKSPORTIMI GLOBAL
window.VoiceIntegration = VoiceIntegration;
window.voiceIntegration = new VoiceIntegration();

console.log('🔗 VoiceIntegration u ngarkua!');

// 🔄 INICIALIZO AUTOMATIKISHT
setTimeout(async () => {
    const initResult = await window.voiceIntegration.initialize();
    if (initResult.success) {
        console.log('🚀 VoiceIntegration u inicializua automatikisht!');
    } else {
        console.warn('⚠️ Inicializimi automatik dështoi:', initResult.error);
    }
}, 2000);
