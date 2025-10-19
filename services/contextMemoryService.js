// services/contextMemoryService.js - VERSION I KORRIGJUAR
const ConversationContext = require('../models/ConversationContext');

class ContextMemoryService {
    constructor() {
        this.contextCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
    }

    // ✅ METODA E SAKTË - initializeContext
    async initializeContext(userId, requestedSessionId = null, initialPreferences = {}) {
        try {
            console.log(`🧠 Duke inicializuar kontekst për ${userId}, session: ${requestedSessionId}`);
            
            let sessionId = requestedSessionId;
            
            // ✅ NËSE NUK KA SESION ID, GJETJ SESIONIN E FUNDIT TË USERIT
            if (!sessionId) {
                const latestSessionId = await ConversationContext.findLatestSessionByUserId(userId);
                if (latestSessionId) {
                    sessionId = latestSessionId;
                    console.log(`🔄 Duke ripërdorur session ekzistues: ${sessionId}`);
                } else {
                    sessionId = 'session-' + Date.now();
                    console.log(`🆕 Duke krijuar session të ri: ${sessionId}`);
                }
            }

            // ✅ PËRDOR SQLite DATABASE EKZISTUESE
            const existingContext = await ConversationContext.findOne({ 
                userId, 
                sessionId 
            });

            if (existingContext) {
                console.log('✅ Kontekst ekzistues u gjet në SQLite, duke e përdorur atë');
                // Konverto JSON string në object
                existingContext.context = typeof existingContext.context === 'string' 
                    ? JSON.parse(existingContext.context) 
                    : existingContext.context;
                
                this.contextCache.set(`${userId}-${sessionId}`, existingContext);
                return existingContext;
            }

            // Krijo kontekst të ri në SQLite
            const newContextData = {
                userId,
                sessionId,
                context: {
                    userPreferences: {
                        languageStyle: initialPreferences.languageStyle || 'shqip-standard',
                        formalityLevel: initialPreferences.formalityLevel || 'neutral',
                        topicsOfInterest: initialPreferences.topicsOfInterest || [],
                        avoidedTopics: initialPreferences.avoidedTopics || []
                    },
                    conversationHistory: [],
                    voiceCharacteristics: {
                        averageSpeechRate: 0,
                        preferredTone: 'neutral',
                        vocabularyLevel: 'intermediate'
                    },
                    currentTopic: 'general',
                    previousTopics: []
                },
                memoryStrength: 1.0
            };

            const newContext = await ConversationContext.create(newContextData);
            this.contextCache.set(`${userId}-${sessionId}`, newContext);
            
            console.log('✅ Kontekst i ri u krijua me sukses në SQLite');
            return newContext;
        } catch (error) {
            console.error('❌ Gabim në inicializimin e kontekstit në SQLite:', error);
            // ✅ FALLBACK - Memory cache nëse SQLite dështon
            return this.createMemoryOnlyContext(userId, requestedSessionId || 'session-' + Date.now(), initialPreferences);
        }
    }

    // ✅ UPDATE CONTEXT ME MESAZH TË RI
    async updateContext(userId, sessionId, userMessage, assistantResponse, messageType = 'text') {
        try {
            let context = await this.getCurrentContext(userId, sessionId);
            
            if (!context) {
                context = await this.initializeContext(userId, sessionId);
            }

            // Shto në historinë e bisedës
            context.context.conversationHistory.push({
                role: 'user',
                message: userMessage,
                messageType: messageType,
                timestamp: new Date()
            });

            context.context.conversationHistory.push({
                role: 'assistant',
                message: assistantResponse,
                messageType: 'text',
                timestamp: new Date()
            });

            // Limito historinë (mbaj vetëm 20 mesazhet e fundit)
            if (context.context.conversationHistory.length > 20) {
                context.context.conversationHistory = context.context.conversationHistory.slice(-20);
            }

            // Analizo dhe përditëso temën aktuale
            await this.analyzeAndUpdateTopic(context, userMessage);
            
            // Përditëso memory strength
            context.memoryStrength = this.calculateMemoryStrength(context);
            context.lastUpdated = new Date();

            // ✅ PERDITSO NE DATABASE
            await ConversationContext.update(userId, sessionId, {
                context: context.context,
                memoryStrength: context.memoryStrength,
                lastUpdated: context.lastUpdated
            });

            this.contextCache.set(`${userId}-${sessionId}`, context);

            console.log('✅ Konteksti u përditësua me sukses');
            return context;
        } catch (error) {
            console.error('❌ Gabim në përditësimin e kontekstit:', error);
            throw error;
        }
    }

    // ✅ MER CURRENT CONTEXT
    async getCurrentContext(userId, sessionId) {
        try {
            const cacheKey = `${userId}-${sessionId}`;
            
            // Provo cache fillimisht
            if (this.contextCache.has(cacheKey)) {
                return this.contextCache.get(cacheKey);
            }

            const context = await ConversationContext.findOne({
                userId,
                sessionId
            });

            if (context) {
                // Konverto JSON string në object
                context.context = typeof context.context === 'string' 
                    ? JSON.parse(context.context) 
                    : context.context;
                
                this.contextCache.set(cacheKey, context);
                setTimeout(() => {
                    this.contextCache.delete(cacheKey);
                }, this.cacheTimeout);
            }

            return context;
        } catch (error) {
            console.error('❌ Gabim në marrjen e kontekstit:', error);
            return null;
        }
    }

    // ✅ METODA QË MUNGTON - getContextSummary
    async getContextSummary(userId, sessionId) {
        try {
            console.log(`📊 Duke marrë summary të kontekstit për ${userId}, ${sessionId}`);
            
            const context = await this.getCurrentContext(userId, sessionId);
            
            if (!context) {
                console.log('📭 Nuk u gjet kontekst për këtë bisedë');
                return {
                    hasContext: false,
                    summary: 'Nuk ka kontekst të mëparshëm për këtë bisedë.'
                };
            }

            // Krijo summary të kontekstit
            const summary = {
                hasContext: true,
                currentTopic: context.context.currentTopic || 'general',
                previousTopics: context.context.previousTopics ? 
                    context.context.previousTopics.slice(-3).map(t => t.topic || t) : [],
                userPreferences: context.context.userPreferences || {},
                conversationLength: context.context.conversationHistory ? 
                    context.context.conversationHistory.length : 0,
                memoryStrength: context.memoryStrength || 1.0,
                recentHistory: context.context.conversationHistory ? 
                    context.context.conversationHistory.slice(-4) : [],
                lastUpdated: context.lastUpdated || new Date()
            };

            console.log(`✅ Summary u krijua: ${summary.conversationLength} mesazhe, tema: ${summary.currentTopic}`);
            return summary;
        } catch (error) {
            console.error('❌ Gabim në marrjen e context summary:', error);
            return {
                hasContext: false,
                summary: 'Gabim në marrjen e kontekstit.'
            };
        }
    }

    // ✅ ANALIZO DHE PERDITSO TOPIC
    async analyzeAndUpdateTopic(context, userMessage) {
        // Implementim i thjeshtë - në versionin e ardhshëm do të jetë më i avancuar
        const words = userMessage.toLowerCase().split(' ');
        
        const topicKeywords = {
            'teknologji': ['kompjuter', 'telefon', 'internet', 'aplikacion', 'software', 'hardware'],
            'moti': ['temperaturë', 'shi', 'diell', 'erë', 'stinë'],
            'shëndet': ['shëndet', 'mjek', 'spital', 'ilac', 'dhembje'],
            'edukim': ['shkollë', 'universitet', 'mësim', 'libër', 'ditelindje'],
            'hobi': ['sport', 'muzikë', 'film', 'libra', 'udhëtim']
        };

        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => words.includes(keyword))) {
                if (context.context.currentTopic !== topic) {
                    // Shto temën e mëparshme në historinë e temave
                    context.context.previousTopics.push({
                        topic: context.context.currentTopic,
                        timestamp: new Date(),
                        duration: this.calculateTopicDuration(context)
                    });
                    
                    context.context.currentTopic = topic;
                    console.log(`🔄 Temë e re e zbuluar: ${topic}`);
                }
                break;
            }
        }
    }

    // ✅ LLOGARIT MEMORY STRENGTH
    calculateMemoryStrength(context) {
        const historyLength = context.context.conversationHistory.length;
        const topicDuration = this.calculateTopicDuration(context);
        
        // Formula e thjeshtë - në versionin e ardhshëm do të jetë më komplekse
        let strength = 0.5 + (historyLength * 0.02) + (topicDuration * 0.01);
        return Math.min(Math.max(strength, 0.1), 1.0);
    }

    calculateTopicDuration(context) {
        if (!context.context.previousTopics || context.context.previousTopics.length === 0) return 0;
        
        const lastTopic = context.context.previousTopics[context.context.previousTopics.length - 1];
        return lastTopic.duration || 0;
    }

    // ✅ FSHI CONTEXT (për testim/reset)
    async deleteContext(userId, sessionId) {
        try {
            await ConversationContext.delete(userId, sessionId);
            this.contextCache.delete(`${userId}-${sessionId}`);
            console.log(`✅ Konteksti u fshi për ${userId}, ${sessionId}`);
            return true;
        } catch (error) {
            console.error('❌ Gabim në fshirjen e kontekstit:', error);
            return false;
        }
    }

    createMemoryOnlyContext(userId, sessionId, initialPreferences) {
        console.log('🔄 Duke krijuar kontekst në memorie (pa database)');
        return {
            userId,
            sessionId,
            context: {
                userPreferences: initialPreferences,
                conversationHistory: [],
                currentTopic: 'general',
                previousTopics: [],
                voiceCharacteristics: {
                    averageSpeechRate: 0,
                    preferredTone: 'neutral',
                    vocabularyLevel: 'intermediate'
                }
            },
            memoryStrength: 1.0,
            lastUpdated: new Date()
        };
    }
}

module.exports = new ContextMemoryService();
