// services/preferenceEngine.js - SERVICE I RI
const VoiceMemory = require('../models/VoiceMemory');

class PreferenceEngine {
    constructor() {
        this.preferenceCache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minuta cache
    }

    // ✅ METODA QË MUNGTON - getUserPreferences
    async getUserPreferences(userId) {
        try {
            console.log(`🎯 Duke marrë preferencat për ${userId}`);
            
            // Provo cache fillimisht
            const cacheKey = `prefs-${userId}`;
            if (this.preferenceCache.has(cacheKey)) {
                return this.preferenceCache.get(cacheKey);
            }

            // Merr nga database
            const voiceMemory = await VoiceMemory.findOne({ userId });
            
            let preferences = {
                responseStyle: {
                    length: 'medium',
                    tone: 'friendly', 
                    language: 'shqip'
                },
                topics: [],
                interactionPreferences: {
                    useVoice: false,
                    detailedResponses: true,
                    formalLanguage: false
                }
            };

            if (voiceMemory && voiceMemory.preferences) {
                // Konverto JSON string në object nëse është string
                const prefs = typeof voiceMemory.preferences === 'string' 
                    ? JSON.parse(voiceMemory.preferences) 
                    : voiceMemory.preferences;
                
                // Merge me preferencat ekzistuese nga database
                preferences = {
                    ...preferences,
                    ...prefs
                };
            }

            // Ruaj në cache
            this.preferenceCache.set(cacheKey, preferences);
            setTimeout(() => {
                this.preferenceCache.delete(cacheKey);
            }, this.cacheTimeout);

            console.log(`✅ Preferencat u morën për ${userId}`);
            return preferences;
        } catch (error) {
            console.error('❌ Gabim në marrjen e preferencave:', error);
            return this.getDefaultPreferences();
        }
    }

    // ✅ ANALIZO DHE PERDITSO PREFERENCAT
    async analyzeAndUpdatePreferences(userId, userMessage, assistantResponse, voiceAnalysis = null) {
        try {
            console.log(`🔍 Duke analizuar preferencat për ${userId}`);
            
            let voiceMemory = await VoiceMemory.findOne({ userId });
            const updates = {};

            // Analizo stilin e përgjigjes së preferuar
            if (assistantResponse) {
                const responseLength = assistantResponse.length;
                if (responseLength < 100) updates.preferredResponseLength = 'short';
                else if (responseLength < 500) updates.preferredResponseLength = 'medium';
                else updates.preferredResponseLength = 'detailed';
            }

            // Analizo preferencat e zërit nëse ka analizë
            if (voiceAnalysis) {
                updates.voicePreferences = {
                    preferredTone: voiceAnalysis.emotionIndicators?.emotionalTone || 'neutral',
                    speechRatePreference: voiceAnalysis.speechPatterns?.speechRate > 150 ? 'fast' : 'normal'
                };
            }

            // Analizo temat e preferuara
            const topics = this.extractTopics(userMessage);
            if (topics.length > 0) {
                updates.preferredTopics = topics;
            }

            // Përditëso në database nëse ka ndryshime
            if (Object.keys(updates).length > 0) {
                if (!voiceMemory) {
                    // Krijo record të ri
                    voiceMemory = await VoiceMemory.create({
                        userId,
                        preferences: updates
                    });
                } else {
                    // Përditëso record ekzistues
                    const currentPrefs = typeof voiceMemory.preferences === 'string'
                        ? JSON.parse(voiceMemory.preferences)
                        : voiceMemory.preferences;
                    
                    voiceMemory.preferences = {
                        ...currentPrefs,
                        ...updates
                    };
                    await VoiceMemory.update(userId, {
                        preferences: voiceMemory.preferences
                    });
                }

                // Pastro cache
                this.preferenceCache.delete(`prefs-${userId}`);
                console.log(`✅ Preferencat u përditësuan për ${userId}`);
            }

            return updates;
        } catch (error) {
            console.error('❌ Gabim në analizën e preferencave:', error);
            return {};
        }
    }

    // ✅ METODA NDIHMËSE - Ekstrakt tema nga mesazhi
    extractTopics(message) {
        const topics = [];
        const topicKeywords = {
            'teknologji': ['kompjuter', 'telefon', 'internet', 'aplikacion', 'software', 'ai', 'teknologji'],
            'shëndet': ['shëndet', 'mjek', 'spital', 'ilac', 'dhembje', 'trupi', 'ushqim'],
            'edukim': ['shkollë', 'universitet', 'mësim', 'libër', 'ditelindje', 'edukim', 'nxënie'],
            'hobi': ['sport', 'muzikë', 'film', 'libra', 'udhëtim', 'hobi', 'kohë e lirë'],
            'punë': ['punë', 'karrierë', 'intervistë', 'projekt', 'mbledhje', 'profesion']
        };

        const messageLower = message.toLowerCase();
        
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => messageLower.includes(keyword))) {
                topics.push(topic);
            }
        }

        return topics;
    }

    // ✅ PREFERENCA DEFAULT
    getDefaultPreferences() {
        return {
            responseStyle: {
                length: 'medium',
                tone: 'friendly',
                language: 'shqip'
            },
            topics: [],
            interactionPreferences: {
                useVoice: false,
                detailedResponses: true,
                formalLanguage: false
            }
        };
    }

    // ✅ FSHI PREFERENCAT (për testim)
    async clearPreferences(userId) {
        try {
            this.preferenceCache.delete(`prefs-${userId}`);
            console.log(`✅ Cache i preferencave u pastrua për ${userId}`);
            return true;
        } catch (error) {
            console.error('❌ Gabim në pastrimin e preferencave:', error);
            return false;
        }
    }
}

module.exports = new PreferenceEngine();
