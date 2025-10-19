const express = require('express');
const router = express.Router();
// ✅ SHTO KËTË LINJË QË MUNGTON:
const db = require('../database');
const ConversationContext = require('../models/ConversationContext');
const contextMemoryService = require('../services/contextMemoryService');
const voiceContextService = require('../services/voiceContextService');
const semanticSearchService = require('../services/semanticSearchService');

console.log('✅ Context Routes u ngarkuan me sukses');

// ✅ MIDDLEWARE PËR SESSION FALLBACK
router.use((req, res, next) => {
    // Krijo sessionId nëse nuk ekziston
    if (req.body && !req.body.sessionId && req.body.userId) {
        req.body.sessionId = `user-${req.body.userId}-default`;
    }
    if (req.query && !req.query.sessionId && req.query.userId) {
        req.query.sessionId = `user-${req.query.userId}-default`;
    }
    next();
});

// ✅ MARR SUMMARY TË KONTEKSTIT
router.get('/summary', async (req, res) => {
    try {
        const { userId, sessionId } = req.query;
        
        console.log(`📊 Duke marrë summary të kontekstit për ${userId}, ${sessionId}`);

        if (!userId || !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'userId dhe sessionId janë të detyrueshëm'
            });
        }

        const summary = await contextMemoryService.getContextSummary(userId, sessionId);
        
        res.json({
            success: true,
            summary: summary
        });
    } catch (error) {
        console.error('❌ Gabim në marrjen e summary:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e summary të kontekstit'
        });
    }
});

// ✅ KRIJO CONTEXT PROMPT PËR AI
router.post('/create-prompt', async (req, res) => {
    try {
        const { userId, sessionId, message } = req.body;
        
        console.log(`🧠 Duke krijuar prompt për ${userId}, session: ${sessionId}`);

        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                message: 'userId dhe message janë të detyrueshëm'
            });
        }

        // Krijo ose përditëso kontekstin
        const context = await contextMemoryService.createOrUpdateContext(
            userId, 
            sessionId, 
            message
        );

        res.json({
            success: true,
            context: context,
            message: 'Konteksti u krijua me sukses'
        });
    } catch (error) {
        console.error('❌ Gabim në krijimin e prompt:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në krijimin e kontekstit'
        });
    }
});

// ✅ UPDATE KONTEKSTIN
router.post('/update', async (req, res) => {
    try {
        const { userId, sessionId, userMessage, assistantResponse, messageType } = req.body;
        
        console.log(`🔄 Duke përditësuar kontekst për ${userId}, session: ${sessionId}`);

        if (!userId || !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'userId dhe sessionId janë të detyrueshëm'
            });
        }

        const updated = await contextMemoryService.updateContext(
            userId,
            sessionId,
            userMessage,
            assistantResponse,
            messageType
        );

        res.json({
            success: true,
            updated: updated,
            message: 'Konteksti u përditësua me sukses'
        });
    } catch (error) {
        console.error('❌ Gabim në përditësimin e kontekstit:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në përditësimin e kontekstit'
        });
    }
});

// ✅ LISTO TË GJITHA SESIONET PËR NJË USER
router.get('/sessions', async (req, res) => {
    try {
        const { userId } = req.query;
        
        console.log(`📊 Duke kërkuar sesione për user: ${userId}`);
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId është i detyrueshëm'
            });
        }

        // Kërko të gjitha sessionet për këtë user
        const sessions = await ConversationContext.findAllByUserId(userId);
        
        console.log(`✅ Gjetur ${sessions.length} sesione për ${userId}`);
        
        res.json({
            success: true,
            userId: userId,
            sessionCount: sessions.length,
            sessions: sessions
        });
    } catch (error) {
        console.error('❌ Gabim në marrjen e sesioneve:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e sesioneve'
        });
    }
});

// ✅ KËRKIM SEMANTIK NË HISTORI
router.post('/semantic-search', async (req, res) => {
    try {
        const { userId, query } = req.body;
        
        console.log(`🔍 Duke kryer kërkim semantik për ${userId}: ${query}`);

        if (!userId || !query) {
            return res.status(400).json({
                success: false,
                message: 'userId dhe query janë të detyrueshëm'
            });
        }

        const results = await semanticSearchService.searchConversations(userId, query);
        
        res.json({
            success: true,
            query: query,
            results: results
        });
    } catch (error) {
        console.error('❌ Gabim në kërkim semantik:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në kërkim semantik'
        });
    }
});

// ✅ MARR PREFERENCAT E PËRDOUESIT
router.get('/preferences', async (req, res) => {
    try {
        const { userId } = req.query;
        
        console.log(`🎯 Duke marrë preferencat për ${userId}`);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId është i detyrueshëm'
            });
        }

        const preferences = await contextMemoryService.getUserPreferences(userId);
        
        res.json({
            success: true,
            preferences: preferences
        });
    } catch (error) {
        console.error('❌ Gabim në marrjen e preferencave:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e preferencave'
        });
    }
});

// ✅ FSHI SESIONET E VJETERA

// ✅ ENDPOINT I RI I THJESHTË - FSHI TË GJITHA PËR USER
router.delete('/nuclear-cleanup', async (req, res) => {
    try {
        const { userId } = req.query;
        
        console.log(`💥 NUKLEARE: Duke fshirë TË GJITHA sesionet për ${userId}`);
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId është i detyrueshëm'
            });
        }

        // QUERY I THJESHTË - FSHI TË GJITHA
        db.run(
            'DELETE FROM conversation_contexts WHERE user_id = ?',
            [userId],
            function(err) {
                if (err) {
                    console.error('❌ Gabim në fshirje:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Gabim në fshirje: ' + err.message
                    });
                }

                const deletedCount = this.changes;
                console.log(`💥 U FSHINË ${deletedCount} SESIONE PËR USER ${userId}`);

                res.json({
                    success: true,
                    message: `U fshinë ${deletedCount} sesione`,
                    deletedCount: deletedCount
                });
            }
        );

    } catch (error) {
        console.error('❌ Gabim:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim: ' + error.message
        });
    }
});
// ✅ MARR VOICE PROFILE
router.get('/voice-profile', async (req, res) => {
    try {
        const { userId } = req.query;
        
        console.log(`🎤 Duke marrë voice profile për ${userId}`);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId është i detyrueshëm'
            });
        }

        const voiceProfile = await voiceContextService.getVoiceProfile(userId);
        
        res.json({
            success: true,
            voiceProfile: voiceProfile
        });
    } catch (error) {
        console.error('❌ Gabim në marrjen e voice profile:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në marrjen e voice profile'
        });
    }
});

// ✅ HEALTH CHECK
router.get('/health', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Context Memory API është operative',
            timestamp: new Date().toISOString(),
            endpoints: [
                'GET /summary',
                'POST /create-prompt', 
                'POST /update',
                'GET /sessions',
                'POST /semantic-search',
                'GET /preferences',
                'DELETE /cleanup',
                'GET /voice-profile'
            ]
        });
    } catch (error) {
        console.error('❌ Gabim në health check:', error);
        res.status(500).json({
            success: false,
            message: 'Gabim në health check'
        });
    }
});

module.exports = router;
