// ======================================== EmotionalContextEngine ======================================================
// ✅ KRIJO KËTË SKEDAR TË RI:

class EmotionalContextEngine {
    constructor() {
        this.emotionalState = 'neutral';
        this.contextHistory = [];
    }

    analyzeEmotionalContext(message) {
        const emotionalWords = {
            positive: ['lumtur', 'gezuar', 'faleminderit', 'bukur', 'mrekulli', 'dashuri', 'paqe'],
            negative: ['trishtim', 'hidhërim', 'problem', 'vështirësi', 'ankth', 'frikë'],
            urgent: ['menjëherë', 'urgjent', 'shpejt', 'emergjencë', 'ndihmë']
        };

        let detectedEmotion = 'neutral';
        const lowerMessage = message.toLowerCase();

        if (emotionalWords.positive.some(word => lowerMessage.includes(word))) {
            detectedEmotion = 'positive';
        } else if (emotionalWords.negative.some(word => lowerMessage.includes(word))) {
            detectedEmotion = 'negative';
        } else if (emotionalWords.urgent.some(word => lowerMessage.includes(word))) {
            detectedEmotion = 'urgent';
        }

        this.contextHistory.push({
            message: message.substring(0, 50) + '...',
            emotion: detectedEmotion,
            timestamp: new Date()
        });

        return detectedEmotion;
    }

    getEmotionalContext() {
        return {
            current_emotion: this.emotionalState,
            recent_context: this.contextHistory.slice(-3),
            total_analysis: this.contextHistory.length
        };
    }
}

// Eksporto
if (typeof window !== 'undefined') {
    window.EmotionalContextEngine = EmotionalContextEngine;
}
console.log('✅ EmotionalContextEngine.js u ngarkua!');
