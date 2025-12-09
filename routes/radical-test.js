// routes/radical-test.js - ROUTES PËR TESTE TË PLOTA
const express = require('express');
const router = express.Router();

console.log('🧪 Routes radikale për teste u ngarkuan!');

// ================================ ✅ 1. TEST INTEGRIMI ME SISTEMIN KRYESOR ===================================

router.get('/integration-test', async (req, res) => {
    console.log('🔗 Test integrimi me sistemin kryesor...');
    
    const tests = [];
    
    try {
        // Test 1: Kontrollo nëse sistemi kryesor është aktiv
        const mainHealth = await fetch('http://localhost:3000/api/chat/health').catch(() => null);
        tests.push({
            name: 'Sistemi kryesor aktiv',
            success: mainHealth && mainHealth.ok,
            status: mainHealth?.status
        });
        
        // Test 2: Kontrollo nëse OpenAI punon
        const openaiTest = await fetch('http://localhost:3000/api/openai/status').catch(() => null);
        tests.push({
            name: 'OpenAI API aktiv',
            success: openaiTest && openaiTest.ok,
            status: openaiTest?.status
        });
        
        // Test 3: Kontrollo nëse Gemini punon
        const geminiTest = await fetch('http://localhost:3000/api/gemini/status').catch(() => null);
        tests.push({
            name: 'Gemini API aktiv',
            success: geminiTest && geminiTest.ok,
            status: geminiTest?.status
        });
        
        const passed = tests.filter(t => t.success).length;
        const total = tests.length;
        
        res.json({
            success: true,
            tests: tests,
            summary: {
                passed: passed,
                total: total,
                percentage: Math.round((passed / total) * 100)
            },
            status: passed === total ? 'FULLY_INTEGRATED' : 'PARTIALLY_INTEGRATED'
        });
        
    } catch (error) {
        console.error('❌ Gabim në testin e integrimit:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            tests: tests
        });
    }
});

// =================================================== ✅ 2. TEST PERFORMANCE =============================================

router.get('/performance-test', async (req, res) => {
    console.log('⚡ Test performance...');
    
    const startTime = Date.now();
    const results = [];
    
    // Test me requeste të shumta
    for (let i = 0; i < 5; i++) {
        const testStart = Date.now();
        
        try {
            const response = await fetch(`/api/radical/radical-search/1/test%20pyetje%20${i}`);
            const data = await response.json();
            
            results.push({
                request: i + 1,
                success: data.success,
                time: Date.now() - testStart,
                found: data.found
            });
            
        } catch (error) {
            results.push({
                request: i + 1,
                success: false,
                time: Date.now() - testStart,
                error: error.message
            });
        }
    }
    
    const totalTime = Date.now() - startTime;
    const avgTime = totalTime / results.length;
    const successRate = (results.filter(r => r.success).length / results.length) * 100;
    
    res.json({
        success: true,
        results: results,
        performance: {
            totalTime: totalTime + 'ms',
            averageTime: Math.round(avgTime) + 'ms',
            successRate: Math.round(successRate) + '%',
            requestsPerSecond: Math.round((results.length / totalTime) * 1000 * 100) / 100
        },
        verdict: avgTime < 100 ? 'EXCELLENT' : avgTime < 500 ? 'GOOD' : 'SLOW'
    });
});

// ================================================= ✅ 3. MIGRIMI I TË DHËNAVE ========================================

router.post('/migrate-data', async (req, res) => {
    console.log('🔄 Duke migruar të dhënat nga sistemi i vjetër...');
    
    try {
        // Merr të gjitha të dhënat nga sistemi i vjetër
        const oldData = await fetch('http://localhost:3000/api/chat/debug-knowledge-all/1').catch(() => null);
        
        if (!oldData || !oldData.ok) {
            return res.json({
                success: false,
                error: 'Nuk mund të merren të dhënat e vjetra',
                migrated: 0
            });
        }
        
        const oldDataJson = await oldData.json();
        const records = oldDataJson.records || [];
        
        console.log(`📊 Gjetëm ${records.length} të dhëna të vjetra për migrim`);
        
        let migratedCount = 0;
        let failedCount = 0;
        
        // Migro çdo record
        for (const record of records) {
            try {
                const migrateResponse = await fetch('http://localhost:3000/api/radical/radical-learn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: record.user_id || 1,
                        question: record.question,
                        answer: record.answer
                    })
                });
                
                const migrateData = await migrateResponse.json();
                
                if (migrateData.success) {
                    migratedCount++;
                    console.log(`✅ Migruar: "${record.question.substring(0, 30)}..."`);
                } else {
                    failedCount++;
                    console.log(`❌ Dështoi: "${record.question.substring(0, 30)}..."`);
                }
                
                // Prit 50ms midis çdo migrimi
                await new Promise(resolve => setTimeout(resolve, 50));
                
            } catch (migrateError) {
                failedCount++;
                console.log(`❌ Gabim në migrim:`, migrateError.message);
            }
        }
        
        res.json({
            success: true,
            migrated: migratedCount,
            failed: failedCount,
            total: records.length,
            percentage: Math.round((migratedCount / records.length) * 100)
        });
        
    } catch (error) {
        console.error('❌ Gabim në migrim:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
