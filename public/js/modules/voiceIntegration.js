// 📁 /public/js/modules/voiceIntegration.js
class VoiceIntegration {
  async processVoice(audioData) {
    // Dërgojë audio në server
    const response = await fetch('/api/voice/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio: audioData, context: window.currentContext })
    });
    
    return await response.json();
  }
}

window.voiceIntegration = new VoiceIntegration();
