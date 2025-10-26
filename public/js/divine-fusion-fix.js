// divine-fusion-fix.js - Vendose në /public/js/divine-fusion-fix.js
console.log('🔧 DIVINE FUSION FIX - Duke rregulluar inicializimin...');

function initializeDivineFusion() {
    if (typeof DivineFusionEngine !== 'undefined' && window.rrufePlatform) {
        console.log('⚡ Duke inicializuar DivineFusion...');
        
        try {
            // Krijo alias global nëse nuk ekziston
            if (typeof DivineFusion === 'undefined') {
                window.DivineFusion = DivineFusionEngine;
                console.log('✅ Krijuam DivineFusion alias');
            }
            
            // Inicializo DivineFusion në platformë
            window.rrufePlatform.modules.divineFusion = new DivineFusion(
                window.rrufePlatform.modules.contextMemory,
                window.rrufePlatform.modules.quantumMemory,
                window.rrufePlatform.modules.cognitiveAwareness
            );
            
            console.log('✅ DivineFusion u inicializua me sukses!');
            
            // Verifikimi
            console.log('🔍 VERIFIKIMI:');
            console.log('- DivineFusionEngine:', typeof DivineFusionEngine);
            console.log('- DivineFusion:', typeof DivineFusion);
            console.log('- divineFusion në platformë:', !!window.rrufePlatform.modules.divineFusion);
            
            return true;
            
        } catch (error) {
            console.log('❌ Gabim në inicializim:', error);
            return false;
        }
    } else {
        console.log('⚠️ Duke pritur për DivineFusionEngine ose rrufePlatform...');
        console.log('- DivineFusionEngine:', typeof DivineFusionEngine);
        console.log('- rrufePlatform:', !!window.rrufePlatform);
        return false;
    }
}

// Provo të inicializosh menjëherë
let initializationAttempt = initializeDivineFusion();

// Nëse nuk funksionon menjëherë, provo përsëri pas 2 sekondash
if (!initializationAttempt) {
    setTimeout(() => {
        console.log('🔄 Provoj përsëri inicializimin...');
        initializeDivineFusion();
    }, 2000);
}
