// services/semanticSearchService.js - VERSION I THJESHTËSUAR PA 'natural'

class SemanticSearchService {
  constructor() {
    console.log('🔍 SemanticSearchService: Duke u inicializuar (version i thjeshtësuar pa natural)');
    this.conversationVectors = new Map();
  }

  // ✅ KËRKIM SEMANTIK NË HISTORINË E BISEDËS - I THJESHTËSUAR
  async semanticSearch(userId, currentMessage, context) {
    try {
      console.log(`🔍 Duke kryer kërkim semantik të thjeshtësuar për ${userId}`);
      
      if (!context || !context.context?.conversationHistory?.length) {
        return {
          relevantHistory: [],
          similarityScore: 0,
          suggestedContext: []
        };
      }

      const currentTokens = this.simpleTokenize(currentMessage);
      const relevantExchanges = [];

      // Analizo historinë për gjetje të ngjashmërive
      for (let i = 0; i < context.context.conversationHistory.length - 1; i += 2) {
        const userMsg = context.context.conversationHistory[i];
        const assistantMsg = context.context.conversationHistory[i + 1];
        
        if (userMsg && assistantMsg) {
          const userTokens = this.simpleTokenize(userMsg.message);
          const similarity = this.simpleSimilarity(currentTokens, userTokens);
          
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
      const suggestedContext = this.simpleFindRelatedTopics(context, currentMessage);

      console.log(`✅ Kërkim semantik i thjeshtësuar i përfunduar. Gjetur: ${relevantExchanges.length} rezultate`);
      
      return {
        relevantHistory: relevantExchanges.slice(0, 3), // Top 3 më të relevante
        similarityScore: relevantExchanges.length > 0 ? relevantExchanges[0].similarity : 0,
        suggestedContext: suggestedContext
      };
    } catch (error) {
      console.error('❌ Gabim në kërkim semantik të thjeshtësuar:', error);
      return {
        relevantHistory: [],
        similarityScore: 0,
        suggestedContext: []
      };
    }
  }

  // ✅ TOKENIZIM I THJESHTË - PA 'natural'
  simpleTokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Hiq karakteret speciale
      .split(/\s+/) // Ndaj në fjalë
      .filter(word => word.length > 2); // Filtro fjalët e shkurtra
  }

  // ✅ STEMIM I THJESHTË - PA PorterStemmer
  simpleStem(word) {
    // Rregulla bazë për stemim në shqip
    const stemRules = {
      'ime$': 'im',
      'imeve$': 'im',
      'imet$': 'im',
      'it$': '',
      'itë$': '',
      'ive$': '',
      'it$': '',
      'esh$': '',
      'nin$': '',
      'nte$': '',
      'në$': '',
      'ri$': 'r',
      'ria$': 'r',
      'rinë$': 'r',
      'rimi$': 'r',
      'rime$': 'r'
    };

    let stemmed = word;
    for (const [pattern, replacement] of Object.entries(stemRules)) {
      const regex = new RegExp(pattern);
      if (regex.test(stemmed)) {
        stemmed = stemmed.replace(regex, replacement);
        break;
      }
    }
    
    return stemmed;
  }

  // ✅ NGJASHMËRI E THJESHTË - PA Cosine Similarity komplekse
  simpleSimilarity(tokens1, tokens2) {
    if (tokens1.length === 0 || tokens2.length === 0) return 0;
    
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    
    const intersection = [...set1].filter(x => set2.has(x)).length;
    const union = new Set([...set1, ...set2]).size;
    
    return union > 0 ? intersection / union : 0;
  }

  // ✅ KRIJO EMBEDDING TË THJESHTË
  createSimpleEmbedding(text) {
    const tokens = this.simpleTokenize(text);
    const stemmedTokens = tokens.map(token => this.simpleStem(token));
    
    const embedding = {};
    stemmedTokens.forEach(token => {
      embedding[token] = (embedding[token] || 0) + 1;
    });
    
    return embedding;
  }

  // ✅ GJEJ TEMAT E LIDHURA - I THJESHTËSUAR
  simpleFindRelatedTopics(context, currentMessage) {
    const topics = [];
    const currentTokens = this.simpleTokenize(currentMessage);
    
    // Analizo temat e mëparshme
    const previousTopics = context.context?.previousTopics?.slice(-5) || []; // 5 temat e fundit
    
    previousTopics.forEach(topicObj => {
      const topicTokens = this.simpleTokenize(topicObj.topic);
      const similarity = this.simpleSimilarity(currentTokens, topicTokens);
      
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

  // ✅ ANALIZO DHE SUGJERO KONTEKST - I THJESHTËSUAR
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
      console.error('❌ Gabim në analizën e kontekstit të thjeshtësuar:', error);
      return {
        contextSuggestion: "",
        hasRelevantHistory: false,
        confidence: 0
      };
    }
  }

  // ✅ KRIJO CONTEXT PROMPT PËR AI - I THJESHTËSUAR
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

  // ✅ METODË E RE: KËRKIM I THJESHTË ME FJALËKYÇE
  async simpleKeywordSearch(userId, query, context) {
    try {
      console.log(`🔍 Duke kryer kërkim me fjalëkyçe për ${userId}`);
      
      if (!context || !context.context?.conversationHistory?.length) {
        return { matches: [], count: 0 };
      }

      const queryKeywords = this.simpleTokenize(query);
      const matches = [];

      // Kërko në historinë e bisedës
      for (let i = 0; i < context.context.conversationHistory.length - 1; i += 2) {
        const userMsg = context.context.conversationHistory[i];
        const assistantMsg = context.context.conversationHistory[i + 1];
        
        if (userMsg && assistantMsg) {
          const messageKeywords = this.simpleTokenize(userMsg.message);
          const keywordMatches = queryKeywords.filter(keyword => 
            messageKeywords.includes(keyword)
          ).length;

          if (keywordMatches > 0) {
            matches.push({
              userMessage: userMsg.message,
              assistantResponse: assistantMsg.message,
              keywordMatches: keywordMatches,
              matchPercentage: Math.round((keywordMatches / queryKeywords.length) * 100),
              timestamp: userMsg.timestamp
            });
          }
        }
      }

      // Rendit sipas numrit të përputhjeve
      matches.sort((a, b) => b.keywordMatches - a.keywordMatches);

      console.log(`✅ Kërkim me fjalëkyçe i përfunduar. Gjetur: ${matches.length} përputhje`);
      
      return {
        matches: matches.slice(0, 5), // Top 5 përputhje
        count: matches.length,
        queryKeywords: queryKeywords
      };
    } catch (error) {
      console.error('❌ Gabim në kërkim me fjalëkyçe:', error);
      return { matches: [], count: 0, queryKeywords: [] };
    }
  }
}

module.exports = new SemanticSearchService();
