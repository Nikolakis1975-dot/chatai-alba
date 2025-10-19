// Në fillim të skedarit - zëvendëso Mongoose me SQLite
const VoiceMemory = require('../models/VoiceMemory'); // ✅ SQLite version

class VoiceContextService {
  constructor() {
    this.voiceAnalysisCache = new Map();
  }

  // ✅ ANALIZO PATTERN-ET E ZËRIT
  async analyzeVoicePattern(userId, audioData, transcribedText) {
    try {
      console.log(`🎵 Duke analizuar pattern-et e zërit për ${userId}`);
      
      const analysis = {
        speechPatterns: this.analyzeSpeechPatterns(transcribedText, audioData),
        acousticFeatures: this.analyzeAcousticFeatures(audioData),
        languagePatterns: this.analyzeLanguagePatterns(transcribedText),
        emotionIndicators: this.analyzeEmotionIndicators(transcribedText)
      };

      // Ruaj analizën në cache për performancë
      this.voiceAnalysisCache.set(userId, analysis);
      
      // Përditëso profilin e zërit në database
      await this.updateVoiceProfile(userId, analysis);
      
      console.log('✅ Analiza e zërit u përfundua me sukses');
      return analysis;
    } catch (error) {
      console.error('❌ Gabim në analizën e zërit:', error);
      return this.getDefaultVoiceAnalysis();
    }
  }

  // ✅ ANALIZO PATTERN-ET E FOLJES
  analyzeSpeechPatterns(transcribedText, audioData) {
    const words = transcribedText.split(' ');
    const duration = audioData.duration || 1; // në sekonda
    
    return {
      speechRate: Math.round((words.length / duration) * 60), // fjalë në minutë
      averageWordLength: this.calculateAverageWordLength(words),
      pauseFrequency: this.estimatePauseFrequency(transcribedText),
      clarityScore: this.estimateClarityScore(transcribedText)
    };
  }

  // ✅ ANALIZO VETITË AKUSTIKE
  analyzeAcousticFeatures(audioData) {
    // Këtu do të implementohet analiza e vërtetë e audio features
    // Për momentin kthejmë vlera simuluese
    return {
      backgroundNoiseLevel: Math.random() * 0.3, // 0-1 scale
      voiceStability: 0.7 + Math.random() * 0.3,
      volumeConsistency: 0.6 + Math.random() * 0.4
    };
  }

  // ✅ ANALIZO PATTERN-ET E GJUHËS
  analyzeLanguagePatterns(transcribedText) {
    const words = transcribedText.toLowerCase().split(' ');
    
    return {
      vocabularyRichness: this.calculateVocabularyRichness(words),
      sentenceComplexity: this.estimateSentenceComplexity(transcribedText),
      frequentlyUsedWords: this.findFrequentWords(words),
      languageStyle: this.detectLanguageStyle(transcribedText)
    };
  }

  // ✅ ANALIZO INDIKATORËT E EMOCIONIT
  analyzeEmotionIndicators(transcribedText) {
    const emotionKeywords = {
      positive: ['faleminderit', 'mirë', 'bukur', 'shkëlqyeshëm', 'përkushtuar'],
      negative: ['problem', 'dështoi', 'gabim', 'keq', 'vështirë'],
      question: ['si', 'çfarë', 'kur', 'ku', 'pse', 'a'],
      excited: ['urime', 'gezuar', 'fantastike', 'mrekullueshëm']
    };

    const text = transcribedText.toLowerCase();
    const indicators = {};

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      indicators[emotion] = keywords.some(keyword => text.includes(keyword));
    }

    return {
      confidence: 0.5 + Math.random() * 0.5,
      enthusiasm: indicators.excited ? 0.8 : 0.3 + Math.random() * 0.4,
      clarity: 0.6 + Math.random() * 0.4,
      emotionalTone: this.determineEmotionalTone(indicators)
    };
  }

  // ✅ PERDITSO PROFILIN E ZERIT
  async updateVoiceProfile(userId, analysis) {
    try {
      let voiceMemory = await VoiceMemory.findOne({ userId });
      
      if (!voiceMemory) {
        voiceMemory = new VoiceMemory({ 
          userId,
          voiceProfile: analysis,
          preferences: {
            preferredResponseStyle: {
              length: 'medium',
              tone: 'friendly',
              language: 'shqip'
            },
            topicsHistory: []
          }
        });
      } else {
        // Përditëso me të dhënat e reja (moving average)
        voiceMemory.voiceProfile = this.mergeVoiceProfiles(voiceMemory.voiceProfile, analysis);
        
        // Shto në historinë e adaptimit
        voiceMemory.adaptationHistory.push({
          timestamp: new Date(),
          adaptationType: 'voice_analysis_update',
          reason: 'Analizë e re e zërit'
        });
      }

      voiceMemory.lastUpdated = new Date();
      await voiceMemory.save();
      
      console.log(`✅ Profili i zërit u përditësua për ${userId}`);
      return voiceMemory;
    } catch (error) {
      console.error('❌ Gabim në përditësimin e profilit të zërit:', error);
    }
  }

  // ✅ MER PROFILIN E ZERIT
  async getVoiceProfile(userId) {
    try {
      // Provo cache fillimisht
      if (this.voiceAnalysisCache.has(userId)) {
        return this.voiceAnalysisCache.get(userId);
      }

      const voiceMemory = await VoiceMemory.findOne({ userId });
      return voiceMemory ? voiceMemory.voiceProfile : this.getDefaultVoiceAnalysis();
    } catch (error) {
      console.error('❌ Gabim në marrjen e profilit të zërit:', error);
      return this.getDefaultVoiceAnalysis();
    }
  }

  // ✅ MBLIDH PROFILET E ZERIT (moving average)
  mergeVoiceProfiles(oldProfile, newProfile) {
    // Implementim i thjeshtë - në versionin e ardhshëm do të jetë më i avancuar
    const mergeFactor = 0.7; // 70% e vlerës së vjetër, 30% e asaj të re
    
    return {
      speechPatterns: this.mergeObjects(oldProfile.speechPatterns, newProfile.speechPatterns, mergeFactor),
      acousticFeatures: this.mergeObjects(oldProfile.acousticFeatures, newProfile.acousticFeatures, mergeFactor),
      languagePatterns: this.mergeObjects(oldProfile.languagePatterns, newProfile.languagePatterns, mergeFactor),
      emotionIndicators: this.mergeObjects(oldProfile.emotionIndicators, newProfile.emotionIndicators, mergeFactor)
    };
  }

  mergeObjects(oldObj, newObj, factor) {
    const merged = {};
    for (const key in oldObj) {
      if (typeof oldObj[key] === 'number' && typeof newObj[key] === 'number') {
        merged[key] = (oldObj[key] * factor) + (newObj[key] * (1 - factor));
      } else {
        merged[key] = newObj[key] || oldObj[key];
      }
    }
    return merged;
  }

  // ✅ METODA NDIHMËSE
  calculateAverageWordLength(words) {
    if (words.length === 0) return 0;
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return totalLength / words.length;
  }

  estimatePauseFrequency(text) {
    const pauseIndicators = [',', '.', ';', '!', '?'];
    let pauseCount = 0;
    
    for (const char of text) {
      if (pauseIndicators.includes(char)) pauseCount++;
    }
    
    return pauseCount / (text.length / 100); // pause per 100 karaktere
  }

  estimateClarityScore(text) {
    const clearIndicators = ['?', '!', '.', 'mirë', 'në rregull'];
    let clarityPoints = 0;
    
    for (const indicator of clearIndicators) {
      if (text.includes(indicator)) clarityPoints++;
    }
    
    return Math.min(clarityPoints / clearIndicators.length * 10, 10);
  }

  calculateVocabularyRichness(words) {
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
  }

  estimateSentenceComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 'simple';
    
    const avgWordsPerSentence = text.split(' ').length / sentences.length;
    return avgWordsPerSentence > 8 ? 'complex' : 'simple';
  }

  findFrequentWords(words) {
    const wordCount = {};
    words.forEach(word => {
      if (word.length > 3) { // Ignoro fjalët shumë të shkurtra
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  }

  detectLanguageStyle(text) {
    const formalWords = ['faleminderit', 'ju lutem', 'zotëri', 'zonjë'];
    const informalWords = ['hej', 'shoq', 'bravo', 'okej'];
    
    const formalCount = formalWords.filter(word => text.includes(word)).length;
    const informalCount = informalWords.filter(word => text.includes(word)).length;
    
    if (formalCount > informalCount) return 'formal';
    if (informalCount > formalCount) return 'informal';
    return 'neutral';
  }

  determineEmotionalTone(indicators) {
    if (indicators.positive && indicators.excited) return 'excited';
    if (indicators.positive) return 'positive';
    if (indicators.negative) return 'concerned';
    if (indicators.question) return 'inquisitive';
    return 'neutral';
  }

  getDefaultVoiceAnalysis() {
    return {
      speechPatterns: {
        speechRate: 120,
        averageWordLength: 5.2,
        pauseFrequency: 2.1,
        clarityScore: 7.5
      },
      acousticFeatures: {
        backgroundNoiseLevel: 0.2,
        voiceStability: 0.8,
        volumeConsistency: 0.7
      },
      languagePatterns: {
        vocabularyRichness: 0.6,
        sentenceComplexity: 'medium',
        frequentlyUsedWords: [],
        languageStyle: 'neutral'
      },
      emotionIndicators: {
        confidence: 0.7,
        enthusiasm: 0.6,
        clarity: 0.7,
        emotionalTone: 'neutral'
      }
    };
  }

  // ✅ PËRSHTAT KONTEKSTIN BAZUAR NË ANALIZËN E ZËRIT
  async adaptContextFromVoice(userId, voiceAnalysis) {
    try {
      // Kjo metodë përdoret për të përshtatur kontekstin bazuar në analizën e zërit
      console.log(`🔄 Duke përshtatur kontekstin për ${userId} bazuar në zërin`);
      
      // Këtu do të implementohet logjika e përshtatjes së kontekstit
      // Për momentin kthejmë një objekt adaptimi
      
      return {
        adapted: true,
        adjustments: {
          responseTone: voiceAnalysis.emotionIndicators.emotionalTone,
          responseLength: voiceAnalysis.speechPatterns.speechRate > 150 ? 'short' : 'detailed',
          languageStyle: voiceAnalysis.languagePatterns.languageStyle
        }
      };
    } catch (error) {
      console.error('❌ Gabim në përshtatjen e kontekstit:', error);
      return { adapted: false, adjustments: {} };
    }
  }

  // ✅ MBAJ MEND PREFERENCAT E PËRDORUESIT NGA ZËRI
  async rememberUserPreferences(userId, preferences) {
    try {
      const voiceMemory = await VoiceMemory.findOne({ userId });
      
      if (voiceMemory) {
        // Përditëso preferencat
        voiceMemory.preferences = {
          ...voiceMemory.preferences,
          ...preferences
        };
        
        await voiceMemory.save();
        console.log(`✅ Preferencat u përditësuan për ${userId}`);
      }
    } catch (error) {
      console.error('❌ Gabim në ruajtjen e preferencave:', error);
    }
  }
}

module.exports = new VoiceContextService();
