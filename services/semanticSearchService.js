const natural = require('natural');
const { WordTokenizer, PorterStemmer } = natural;

class SemanticSearchService {
  constructor() {
    this.tokenizer = new WordTokenizer();
    this.conversationVectors = new Map();
  }

  // ✅ KËRKIM SEMANTIK NË HISTORINË E BISEDËS
  async semanticSearch(userId, currentMessage, context) {
    try {
      console.log(`🔍 Duke kryer kërkim semantik për ${userId}`);
      
      if (!context || !context.context.conversationHistory.length) {
        return {
          relevantHistory: [],
          similarityScore: 0,
          suggestedContext: []
        };
      }

      const currentEmbedding = this.createTextEmbedding(currentMessage);
      const relevantExchanges = [];

      // Analizo historinë për gjetje të ngjashmërive
      for (let i = 0; i < context.context.conversationHistory.length - 1; i += 2) {
        const userMsg = context.context.conversationHistory[i];
        const assistantMsg = context.context.conversationHistory[i + 1];
        
        if (userMsg && assistantMsg) {
          const similarity = this.calculateSimilarity(
            currentEmbedding, 
            this.createTextEmbedding(userMsg.message)
          );
          
          if (similarity > 0.3) { // Threshold për relevancë
            relevantExchanges.push({
              userMessage: userMsg.message,
              assistantResponse: assistantMsg.message,
              similarity: Math.round(similarity * 100) / 100,
              timestamp: userMsg.timestamp,
              messageType: userMsg.messageType
            });
          }
        }
      }

      // Rendit sipas relevancës
      relevantExchanges.sort((a, b) => b.similarity - a.similarity);

      // Gjej tema të lidhura
      const suggestedContext = this.findRelatedTopics(context, currentMessage);

      console.log(`✅ Kërkim semantik i përfunduar. Gjetur: ${relevantExchanges.length} rezultate`);
      
      return {
        relevantHistory: relevantExchanges.slice(0, 3), // Top 3 më të relevante
        similarityScore: relevantExchanges.length > 0 ? relevantExchanges[0].similarity : 0,
        suggestedContext: suggestedContext
      };
    } catch (error) {
      console.error('❌ Gabim në kërkim semantik:', error);
      return {
        relevantHistory: [],
        similarityScore: 0,
        suggestedContext: []
      };
    }
  }

  // ✅ KRIJO EMBEDDING PËR TEKST
  createTextEmbedding(text) {
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const stemmedTokens = tokens.map(token => PorterStemmer.stem(token));
    
    const embedding = {};
    stemmedTokens.forEach(token => {
      embedding[token] = (embedding[token] || 0) + 1;
    });
    
    return embedding;
  }

  // ✅ LLOGARIT NGJASHMËRINË COSINE
  calculateSimilarity(embedding1, embedding2) {
    const allTokens = new Set([...Object.keys(embedding1), ...Object.keys(embedding2)]);
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const token of allTokens) {
      const val1 = embedding1[token] || 0;
      const val2 = embedding2[token] || 0;
      
      dotProduct += val1 * val2;
      magnitude1 += val1 * val1;
      magnitude2 += val2 * val2;
    }

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  // ✅ GJEJ TEMAT E LIDHURA
  findRelatedTopics(context, currentMessage) {
    const topics = [];
    const currentTokens = this.createTextEmbedding(currentMessage);
    
    // Analizo temat e mëparshme
    const previousTopics = context.context.previousTopics.slice(-5); // 5 temat e fundit
    
    previousTopics.forEach(topicObj => {
      const topicEmbedding = this.createTextEmbedding(topicObj.topic);
      const similarity = this.calculateSimilarity(currentTokens, topicEmbedding);
      
      if (similarity > 0.2) {
        topics.push({
          topic: topicObj.topic,
          relevance: Math.round(similarity * 100) / 100,
          lastDiscussed: topicObj.timestamp
        });
      }
    });

    // Rendit sipas relevancës
    topics.sort((a, b) => b.relevance - a.relevance);
    
    return topics.slice(0, 3); // Kthe 3 temat më të relevante
  }

  // ✅ ANALIZO DHE SUGJERO KONTEKST
  async analyzeAndSuggestContext(userId, currentMessage, context) {
    try {
      const searchResults = await this.semanticSearch(userId, currentMessage, context);
      
      let contextSuggestion = "";
      
      if (searchResults.relevantHistory.length > 0) {
        const bestMatch = searchResults.relevantHistory[0];
        contextSuggestion = `Bazuar në bisedën tonë të mëparshme ku pyetë "${bestMatch.userMessage}", unë u përgjigja "${bestMatch.assistantResponse}". `;
      }

      if (searchResults.suggestedContext.length > 0) {
        const relatedTopic = searchResults.suggestedContext[0];
        contextSuggestion += `Kjo temë lidhet me diskutimin tonë të kaluar për "${relatedTopic.topic}".`;
      }

      return {
        contextSuggestion: contextSuggestion.trim(),
        hasRelevantHistory: searchResults.relevantHistory.length > 0,
        confidence: searchResults.similarityScore
      };
    } catch (error) {
      console.error('❌ Gabim në analizën e kontekstit:', error);
      return {
        contextSuggestion: "",
        hasRelevantHistory: false,
        confidence: 0
      };
    }
  }

  // ✅ KRIJO CONTEXT PROMPT PËR AI
  async createContextPrompt(userId, currentMessage, context) {
    const analysis = await this.analyzeAndSuggestContext(userId, currentMessage, context);
    
    let prompt = "";
    
    if (analysis.hasRelevantHistory) {
      prompt = `KONTEKSTI I MËPARSHËM: ${analysis.contextSuggestion}\n\n`;
    }
    
    prompt += `PYETJA E RE: ${currentMessage}\n\n`;
    prompt += `UDHËZIM: Përgjigju duke pasur parasysh kontekstin e mëparshëm nëse është i relevantshëm.`;
    
    return {
      prompt: prompt,
      metadata: {
        hasContext: analysis.hasRelevantHistory,
        confidence: analysis.confidence,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = new SemanticSearchService();
