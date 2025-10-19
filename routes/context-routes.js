// routes/context-routes.js - VERSION I PLOTË ME TË GJITHA ENDPOINT-ET

const express = require('express');
const router = express.Router();

// ✅ IMPORT SERVICET ME ERROR HANDLING
let contextMemoryService, semanticSearchService, preferenceEngine;

try {
    contextMemoryService = require('../services/contextMemoryService');
    console.log('✅ ContextMemoryService u ngarkua për context routes');
} catch (error) {
    console.error('❌ ContextMemoryService nuk mund të ngarkohet:', error.message);
}

try {
    semanticSearchService = require('../services/semanticSearchService');
    console.log('✅ SemanticSearchService u ngarkua për context routes');
} catch (error) {
    console.error('❌ SemanticSearchService nuk mund të ngarkohet:', error.message);
}

try {
    preferenceEngine = require('../services/preferenceEngine');
    console.log('✅ PreferenceEngine u ngarkua për context routes');
} catch (error) {
    console.error('❌ PreferenceEngine nuk mund të ngarkohet:', error.message);
}

// ======================================================
// ✅ ENDPOINT TEST - KRITIK PËR VERIFIKIM
// ======================================================

router.get('/test', (req, res) => {
    try {
        console.log('🧪 Context API Test endpoint i thirrur');
        
        res.json({ 
            success: true, 
            message: 'Context API is working!',
            timestamp: new Date().toISOString(),
            services: {
                contextMemory: !!contextMemoryService,
                semanticSearch: !!semanticSearchService,
                preferenceEngine: !!preferenceEngine
            }
        });
    } catch (error) {
        console.error('❌ Gabim në context test endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në server',
            error: error.message
        });
    }
});

// ======================================================
// ✅ ENDPOINT-I TJERË TË CONTEXT SYSTEM
// ======================================================

// ✅ MERRE CONTEXT SUMMARY
router.get('/summary', async (req, res) => {
    try {
        const { userId, sessionId } = req.query;
        
        if (!userId || !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'userId dhe sessionId janë të detyrueshme'
            });
        }

        console.log(`📊 Duke marrë context summary për ${userId}, session: ${sessionId}`);

        if (!contextMemoryService) {
            return res.json({
                success: true,
                summary: {
                    message: 'Context service nuk është i disponueshëm',
                    available: false
                }
            });
        }

        const context = await contextMemoryService.getContext(userId, sessionId);
        
        res.json({
            success: true,
            summary: {
                userId: userId,
                sessionId: sessionId,
                conversationLength: context?.context?.conversationHistory?.length || 0,
                topics: context?.context?.previousTopics?.slice(-5) || [],
                lastUpdated: context?.lastUpdated,
                available: true
            }
        });
    } catch (error) {
        console.error('❌ Gabim në context summary:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e context summary'
        });
    }
});

// ✅ MERRE VOICE PROFILE
router.get('/voice-profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`🎤 Duke marrë voice profile për ${userId}`);

        if (!preferenceEngine) {
            return res.json({
                success: true,
                voiceProfile: {
                    message: 'Preference engine nuk është i disponueshëm',
                    available: false
                }
            });
        }

        const voiceProfile = await preferenceEngine.getVoicePreferences(userId);
        
        res.json({
            success: true,
            voiceProfile: voiceProfile || {
                available: false,
                message: 'Nuk ka të dhëna voice profile'
            }
        });
    } catch (error) {
        console.error('❌ Gabim në voice profile:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e voice profile'
        });
    }
});

// ✅ KRIJO CONTEXT PROMPT PËR AI
router.post('/create-prompt', async (req, res) => {
    try {
        const { userId, sessionId, message } = req.body;
        
        if (!userId || !sessionId || !message) {
            return res.status(400).json({
                success: false,
                message: 'userId, sessionId dhe message janë të detyrueshme'
            });
        }

        console.log(`💡 Duke krijuar context prompt për ${userId}: ${message.substring(0, 50)}...`);

        if (!contextMemoryService || !semanticSearchService) {
            return res.json({
                success: true,
                prompt: message, // Kthe mesazhin origjinal nëse shërbimet nuk janë të disponueshme
                metadata: {
                    hasContext: false,
                    reason: 'Shërbimet e context nuk janë të disponueshme'
                }
            });
        }

        // Merr kontekstin aktual
        const context = await contextMemoryService.getContext(userId, sessionId);
        
        // Krijo prompt me kontekst
        const promptData = await semanticSearchService.createContextPrompt(userId, message, context);
        
        res.json({
            success: true,
            prompt: promptData.prompt,
            metadata: promptData.metadata
        });
    } catch (error) {
        console.error('❌ Gabim në create-prompt:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në krijimin e prompt'
        });
    }
});

// ✅ KËRKIM SEMANTIK
router.post('/semantic-search', async (req, res) => {
    try {
        const { userId, sessionId, query } = req.body;
        
        if (!userId || !sessionId || !query) {
            return res.status(400).json({
                success: false,
                message: 'userId, sessionId dhe query janë të detyrueshme'
            });
        }

        console.log(`🔍 Duke kryer semantic search për ${userId}: ${query.substring(0, 50)}...`);

        if (!contextMemoryService || !semanticSearchService) {
            return res.json({
                success: true,
                results: [],
                message: 'Semantic search nuk është i disponueshëm',
                available: false
            });
        }

        // Merr kontekstin aktual
        const context = await contextMemoryService.getContext(userId, sessionId);
        
        // Kryej kërkim semantik
        const searchResults = await semanticSearchService.semanticSearch(userId, query, context);
        
        res.json({
            success: true,
            results: searchResults,
            available: true
        });
    } catch (error) {
        console.error('❌ Gabim në semantic-search:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në kërkim semantik'
        });
    }
});

// ✅ FSHI CONTEXT
router.delete('/clear-context', async (req, res) => {
    try {
        const { userId, sessionId } = req.body;
        
        if (!userId || !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'userId dhe sessionId janë të detyrueshme'
            });
        }

        console.log(`🧹 Duke fshirë context për ${userId}, session: ${sessionId}`);

        if (!contextMemoryService) {
            return res.json({
                success: true,
                message: 'Context service nuk është i disponueshëm',
                cleared: false
            });
        }

        await contextMemoryService.clearContext(userId, sessionId);
        
        res.json({
            success: true,
            message: 'Context u fshi me sukses',
            cleared: true
        });
    } catch (error) {
        console.error('❌ Gabim në clear-context:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në fshirjen e context'
        });
    }
});

// ✅ HEALTH CHECK
router.get('/health', (req, res) => {
    res.json({
        success: true,
        service: 'Context API',
        status: 'operational',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

module.exports = router;
