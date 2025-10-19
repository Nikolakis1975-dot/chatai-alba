// middleware/contextMiddleware.js - VERSION I RI I PLOTË
const contextMemoryService = require('../services/contextMemoryService');
const voiceContextService = require('../services/voiceContextService');
const semanticSearchService = require('../services/semanticSearchService');

// ✅ DEKLARIM I VETËM I preferenceEngine
let preferenceEngine;

try {
    preferenceEngine = require('../services/preferenceEngine');
    console.log('✅ PreferenceEngine u ngarkua me sukses');
} catch (error) {
    console.error('❌ PreferenceEngine nuk u ngarkua:', error);
    // Fallback object
    preferenceEngine = {
        getUserPreferences: () => Promise.resolve({
            responseStyle: { length: 'medium', tone: 'friendly', language: 'shqip' },
            topics: [],
            interactionPreferences: { useVoice: false, detailedResponses: true, formalLanguage: false }
        }),
        analyzeAndUpdatePreferences: () => Promise.resolve({})
    };
}

// ✅ MIDDLEWARE PËR INICIALIZIM KONTEKSTI
const initializeContext = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.body.userId || 'anonymous';
        const sessionId = req.sessionID || req.headers['session-id'] || Date.now().toString();
        
        // Inicializo kontekstin nëse nuk ekziston
        req.context = await contextMemoryService.initializeContext(userId, sessionId);
        req.userId = userId;
        req.sessionId = sessionId;
        
        console.log(`🧠 Konteksti u inicializua për ${userId} (Session: ${sessionId})`);
        next();
    } catch (error) {
        console.error('❌ Gabim në inicializimin e kontekstit:', error);
        req.context = null;
        next();
    }
};

// ✅ MIDDLEWARE PËR UPDATE KONTEKSTI PAS PËRGJIGJES
const updateContextAfterResponse = async (req, res, next) => {
    try {
        // Ekzekutohet pasi përgjigja është dërguar
        const oldSend = res.send;
        
        res.send = function(data) {
            // Thirr funksionin origjinal
            oldSend.apply(res, arguments);
            
            // Update kontekstin në background (jo-bllokues)
            if (req.context && req.userMessage && data) {
                setTimeout(async () => {
                    try {
                        const responseText = typeof data === 'string' ? data : 
                                            (JSON.parse(data)?.message || JSON.parse(data)?.response);
                        
                        if (responseText && req.userMessage.trim().length > 0) {
                            await contextMemoryService.updateContext(
                                req.userId, 
                                req.sessionId, 
                                req.userMessage, 
                                responseText,
                                req.messageType || 'text'
                            );
                            
                            console.log(`✅ Konteksti u përditësua për ${req.userId}`);
                            
                            // Update preferencat nëse është voice
                            if (req.messageType === 'voice' && req.voiceAnalysis) {
                                await preferenceEngine.analyzeAndUpdatePreferences(
                                    req.userId,
                                    req.userMessage,
                                    responseText,
                                    req.voiceAnalysis
                                );
                            }
                        }
                    } catch (updateError) {
                        console.error('❌ Gabim në update konteksti:', updateError);
                    }
                }, 0);
            }
        };
        
        next();
    } catch (error) {
        console.error('❌ Gabim në context middleware:', error);
        next();
    }
};

// ✅ MIDDLEWARE PËR ANALIZË ZËRI
const analyzeVoiceContext = async (req, res, next) => {
    try {
        if (req.body.audioData || req.file) {
            const transcribedText = req.body.transcribedText || req.body.message || '';
            
            if (transcribedText.trim().length > 0) {
                // Analizo pattern-et e zërit
                req.voiceAnalysis = await voiceContextService.analyzeVoicePattern(
                    req.userId,
                    {
                        duration: req.body.duration || 0,
                        size: req.file?.size || 0,
                        mimeType: req.file?.mimetype || 'audio/wav'
                    },
                    transcribedText
                );
                
                req.messageType = 'voice';
                req.userMessage = transcribedText;
                
                console.log(`🎵 Analiza e zërit u krye për ${req.userId}`);
            }
        } else if (req.body.message && req.body.message.trim().length > 0) {
            req.messageType = 'text';
            req.userMessage = req.body.message;
        }
        
        next();
    } catch (error) {
        console.error('❌ Gabim në analizën e zërit:', error);
        next();
    }
};

// ✅ MIDDLEWARE PËR CONTEXT ENHANCEMENT
const enhanceWithContext = async (req, res, next) => {
    try {
        if (req.context && req.userMessage) {
            // Merr summary të kontekstit për përdorim nga AI
            req.contextSummary = await contextMemoryService.getContextSummary(
                req.userId, 
                req.sessionId
            );
            
            // Merr profile të zërit nëse ekziston
            req.voiceProfile = await voiceContextService.getVoiceProfile(req.userId);
            
            // Merr preferencat e përdoruesit
            req.userPreferences = await preferenceEngine.getUserPreferences(req.userId);
            
            // Krijo context prompt për AI
            if (req.userMessage) {
                req.contextPrompt = await semanticSearchService.createContextPrompt(
                    req.userId,
                    req.userMessage,
                    req.context
                );
            }
            
            console.log(`🔧 Konteksti u përmirësua për ${req.userId}`);
        }
        
        next();
    } catch (error) {
        console.error('❌ Gabim në enhancement të kontekstit:', error);
        next();
    }
};

// ✅ MIDDLEWARE PËR ERROR HANDLING
const contextErrorHandler = (error, req, res, next) => {
    if (error.message.includes('context') || error.message.includes('voice')) {
        console.error('❌ Gabim në context system:', error);
        // Vazhdo pa kontekst nëse ka gabime
        req.context = null;
        req.contextPrompt = { prompt: req.body.message, metadata: { hasContext: false } };
    }
    next(error);
};

module.exports = {
    initializeContext,
    updateContextAfterResponse,
    analyzeVoiceContext,
    enhanceWithContext,
    contextErrorHandler
};
