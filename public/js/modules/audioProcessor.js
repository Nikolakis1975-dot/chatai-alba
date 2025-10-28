// 🎙️ PROÇESUES I AVANCUAR I AUDIO PËR RRUFE-TESLA

class AudioProcessor {
    constructor() {
        this.audioContext = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.supportedFormats = ['audio/webm', 'audio/mp4', 'audio/wav'];
        this.config = {
            sampleRate: 16000,
            channels: 1,
            bitRate: 128000,
            maxDuration: 30000, // 30 sekonda
            silenceThreshold: 0.01,
            silenceTimeout: 2000 // 2 sekonda
        };
    }

    // 🎤 INICIALIZIMI I AUDIO CONTEXT
    async initialize() {
        try {
            // Kontrollo suportin për getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Audio API nuk mbështetet në këtë shfletues');
            }

            // Kërko leje për mikrofon
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: this.config.sampleRate,
                    channelCount: this.config.channels,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });

            // Krijo AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: this.config.sampleRate
            });

            // Krijo MediaRecorder
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: this.getSupportedMimeType(),
                audioBitsPerSecond: this.config.bitRate
            });

            // Konfiguro event listeners
            this.setupEventListeners();

            console.log('✅ AudioProcessor u inicializua!');
            return { success: true, stream: stream };

        } catch (error) {
            console.error('❌ Gabim në inicializimin e AudioProcessor:', error);
            return { success: false, error: error.message };
        }
    }

    // ⏺️ FILLIMI I REGJISTRIMIT
    async startRecording() {
        if (!this.mediaRecorder) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        if (this.isRecording) {
            return { success: false, error: 'Regjistrimi tashmë është duke u kryer' };
        }

        try {
            this.audioChunks = [];
            this.isRecording = true;

            // Start recording
            this.mediaRecorder.start(1000); // Collect data every 1 second

            // Timeout për regjistrim automatik
            this.recordingTimeout = setTimeout(() => {
                if (this.isRecording) {
                    this.stopRecording();
                }
            }, this.config.maxDuration);

            console.log('🎤 Regjistrimi filloi...');
            return { success: true, message: 'Regjistrimi filloi' };

        } catch (error) {
            console.error('❌ Gabim në fillimin e regjistrimit:', error);
            return { success: false, error: error.message };
        }
    }

    // ⏹️ NDALIMI I REGJISTRIMIT
    async stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) {
            return { success: false, error: 'Nuk ka regjistrim aktiv' };
        }

        return new Promise((resolve) => {
            // Event kur regjistrimi përfundon
            const onStop = () => {
                this.isRecording = false;
                clearTimeout(this.recordingTimeout);
                
                // Krijo audio blob
                const audioBlob = new Blob(this.audioChunks, { 
                    type: this.mediaRecorder.mimeType 
                });

                console.log('🛑 Regjistrimi u ndal. Madhësia:', this.formatFileSize(audioBlob.size));

                // Kthe rezultatet
                resolve({
                    success: true,
                    audioBlob: audioBlob,
                    duration: this.calculateDuration(),
                    size: audioBlob.size,
                    format: this.mediaRecorder.mimeType,
                    chunks: this.audioChunks.length
                });

                // Pastro
                this.audioChunks = [];
            };

            // Vendos event listener dhe ndal
            this.mediaRecorder.addEventListener('stop', onStop, { once: true });
            this.mediaRecorder.stop();
        });
    }

    // 🔊 PROÇESIMI I AUDIO DATA
    processAudioData(audioData) {
        // Kjo metodë mund të përdoret për analiza të avancuara të audio
        // si analiza e frekuencave, zbulimi i emocioneve nga zëri, etj.
        
        const analysis = {
            volume: this.calculateVolume(audioData),
            frequency: this.analyzeFrequency(audioData),
            clarity: this.measureClarity(audioData),
            timestamp: new Date().toISOString()
        };

        console.log('🔊 Analiza e audio:', analysis);
        return analysis;
    }

    // 📊 KONVERTIMI I AUDIO NË FORMATE TË NDRYSHME
    async convertAudioFormat(audioBlob, targetFormat = 'audio/wav') {
        try {
            // Kjo është implementim bazë - në praktikë do të kërkonte librari shtesë
            console.log(`🔄 Konvertim nga ${audioBlob.type} në ${targetFormat}`);
            
            // Për implementim të plotë, do të duhej të përdorni:
            // - AudioContext për ri-encoding
            // - Librari si ffmpeg.wasm për konvertime komplekse
            
            return {
                success: true,
                originalFormat: audioBlob.type,
                targetFormat: targetFormat,
                message: 'Konvertimi audio (implementim bazë)',
                audioBlob: audioBlob // Në versionin final, kjo do të jetë blob i ri
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 🎚️ METODA ANALITIKE
    calculateVolume(audioData) {
        // Llogarit volumin mesatar
        let sum = 0;
        for (let i = 0; i < audioData.length; i++) {
            sum += Math.abs(audioData[i]);
        }
        return sum / audioData.length;
    }

    analyzeFrequency(audioData) {
        // Analizë bazë e frekuencave
        // Në implementim të plotë, do të përdorte FFT
        return {
            dominantFreq: 'N/A', // Do të llogarite frekuencën dominuese
            bandwidth: 'N/A',
            spectralCentroid: 'N/A'
        };
    }

    measureClarity(audioData) {
        // Matje e thjeshtë e qartësisë
        const noiseLevel = this.calculateVolume(audioData.slice(0, 100)); // Sample i parë
        const signalLevel = this.calculateVolume(audioData);
        return Math.max(0, 1 - (noiseLevel / signalLevel));
    }

    calculateDuration() {
        // Llogaritje e përafërt e kohëzgjatjes bazuar në madhësinë e të dhënave
        const totalBytes = this.audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
        return Math.round(totalBytes / (this.config.bitRate / 8) * 1000);
    }

    // 🛠️ METODA NDIHMËSE
    getSupportedMimeType() {
        for (const format of this.supportedFormats) {
            if (MediaRecorder.isTypeSupported(format)) {
                return format;
            }
        }
        return 'audio/webm'; // Fallback
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupEventListeners() {
        // Event kur ka të dhëna të reja audio
        this.mediaRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0) {
                this.audioChunks.push(event.data);
                
                // Proçeso të dhënat në real-time (opsionale)
                if (window.cognitiveAwareness) {
                    this.processAudioData(event.data);
                }
            }
        });

        // Event kur ndodhin gabime
        this.mediaRecorder.addEventListener('error', (error) => {
            console.error('❌ Gabim në media recorder:', error);
            this.isRecording = false;
        });
    }

    // 🧹 PASTRIMI I BURIMEVE
    cleanup() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.audioChunks = [];
        this.isRecording = false;
        
        console.log('🧹 AudioProcessor u pastrua');
    }

    // 📊 METODA PËR INFORMACION
    getStatus() {
        return {
            isRecording: this.isRecording,
            audioContext: !!this.audioContext,
            mediaRecorder: !!this.mediaRecorder,
            chunksRecorded: this.audioChunks.length,
            supportedFormats: this.supportedFormats,
            config: this.config
        };
    }
}

// 🎯 EKSPORTIMI GLOBAL
window.AudioProcessor = AudioProcessor;
window.audioProcessor = new AudioProcessor();

console.log('🎙️ AudioProcessor u ngarkua!');

// 🔄 VERIFIKO DISPONUESHMËRINË E MIKROFONIT
window.audioProcessor.initialize().then(result => {
    if (result.success) {
        console.log('✅ AudioProcessor gati për përdorim!');
    } else {
        console.warn('⚠️ AudioProcessor nuk mund të inicializohet:', result.error);
    }
});
