// ==================== ✅ SEARCH SERVICE - 07.10.2024 ====================
// 📝 DESKRIMI: Shërbim për kërkim të thelluar në internet
// 🎯 QËLLIMI: Përgjigje të bazura në research aktual nga burime të ndryshme
// 📥 INPUT: query string për kërkim
// 📤 OUTPUT: Përmbledhje e bazuar në research
// 🔧 AUTORI: ChatAI ALBA Team
// =======================================================================

const axios = require('axios');

class SearchService {
    
    // ✅ KRYERJA E KËRKIMIT TË PLOTË
    async performSearch(query) {
        try {
            console.log(`🔍 Duke kërkuar për: "${query}"`);
            
            // ✅ KËRKIM PARALEL NË TË GJITHA BURIMET
            const [wikiResults, newsResults, academicResults] = await Promise.all([
                this.searchWikipedia(query),
                this.searchNews(query),
                this.searchAcademic(query)
            ]);
            
            // ✅ GJENERIM I PËRMBLEDHJES INTELIGJENTE
            const summary = await this.generateIntelligentSummary({
                wikipedia: wikiResults,
                news: newsResults,
                academic: academicResults
            }, query);
            
            return {
                success: true,
                response: summary,
                metadata: {
                    query: query,
                    sourcesUsed: this.countSources(wikiResults, newsResults, academicResults),
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            console.error('❌ Gabim në search service:', error);
            return {
                success: false,
                response: '❌ Nuk mund të kryej kërkim të thelluar për momentin. Provo më vonë.'
            };
        }
    }

    // ✅ KËRKIM NË WIKIPEDIA
    async searchWikipedia(query) {
        try {
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, {
                timeout: 10000
            });
            
            return {
                title: response.data.title,
                summary: response.data.extract,
                url: response.data.content_urls?.desktop?.page,
                source: 'Wikipedia',
                hasData: true
            };
            
        } catch (error) {
            console.log(`⚠️ Wikipedia nuk gjeti rezultate për: ${query}`);
            return {
                title: query,
                summary: null,
                source: 'Wikipedia',
                hasData: false
            };
        }
    }

    // ✅ KËRKIM NË LAJME (duke përdorur NewsAPI ose alternativë)
    async searchNews(query) {
        try {
            // PËRDORIM NEWSAPI OSE ALTERNATIVË
            const newsApiKey = process.env.NEWS_API_KEY;
            
            if (newsApiKey) {
                const response = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=3&apiKey=${newsApiKey}`, {
                    timeout: 10000
                });
                
                const articles = response.data.articles.slice(0, 3);
                
                return {
                    articles: articles.map(article => ({
                        title: article.title,
                        description: article.description,
                        source: article.source.name,
                        url: article.url,
                        publishedAt: article.publishedAt
                    })),
                    source: 'News API',
                    hasData: articles.length > 0
                };
            } else {
                // ALTERNATIVË PA API KEY - Kërkim i thjeshtë
                return {
                    articles: [],
                    source: 'News (API Key Required)',
                    hasData: false,
                    message: 'Shto NEWS_API_KEY në .env për lajme aktuale'
                };
            }
            
        } catch (error) {
            console.log('⚠️ News search failed:', error.message);
            return {
                articles: [],
                source: 'News',
                hasData: false
            };
        }
    }

    // ✅ KËRKIM NË BURIME AKADEMIKE (Google Scholar alternative)
    async searchAcademic(query) {
        try {
            // PËRDORIM CrossRef API për burime akademike
            const response = await axios.get(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=3`, {
                timeout: 10000
            });
            
            const works = response.data.message.items.slice(0, 3);
            
            return {
                publications: works.map(work => ({
                    title: work.title[0],
                    authors: work.author?.map(a => `${a.given} ${a.family}`).join(', '),
                    journal: work['container-title']?.[0],
                    year: work.published?.['date-parts']?.[0]?.[0],
                    doi: work.DOI,
                    url: work.URL
                })),
                source: 'CrossRef Academic',
                hasData: works.length > 0
            };
            
        } catch (error) {
            console.log('⚠️ Academic search failed:', error.message);
            return {
                publications: [],
                source: 'Academic Sources',
                hasData: false
            };
        }
    }

    // ✅ GJENERIM I PËRMBLEDHJES INTELIGJENTE
    async generateIntelligentSummary(sources, originalQuery) {
        let summary = `🔍 **REZULTATET E KËRKIMIT PËR:** "${originalQuery}"\n\n`;
        
        // ✅ WIKIPEDIA SUMMARY
        if (sources.wikipedia.hasData) {
            summary += `📚 **Wikipedia:**\n${sources.wikipedia.summary}\n\n`;
            summary += `🔗 *Burimi: ${sources.wikipedia.url}*\n\n`;
        } else {
            summary += `📚 **Wikipedia:** Nuk u gjet informacion specifik.\n\n`;
        }
        
        // ✅ NEWS SUMMARY
        if (sources.news.hasData && sources.news.articles.length > 0) {
            summary += `📰 **Lajmet e Fundit:**\n`;
            sources.news.articles.forEach((article, index) => {
                summary += `${index + 1}. **${article.title}**\n`;
                if (article.description) {
                    summary += `   ${article.description}\n`;
                }
                summary += `   📅 ${new Date(article.publishedAt).toLocaleDateString('sq-AL')}\n`;
                summary += `   📰 ${article.source}\n\n`;
            });
        } else {
            summary += `📰 **Lajme:** Nuk ka lajme të freskëta për këtë temë.\n\n`;
        }
        
        // ✅ ACADEMIC SUMMARY
        if (sources.academic.hasData && sources.academic.publications.length > 0) {
            summary += `🎓 **Burime Akademike:**\n`;
            sources.academic.publications.forEach((pub, index) => {
                summary += `${index + 1}. **${pub.title}**\n`;
                if (pub.authors) {
                    summary += `   👥 ${pub.authors}\n`;
                }
                if (pub.journal) {
                    summary += `   📖 ${pub.journal}\n`;
                }
                if (pub.year) {
                    summary += `   📅 ${pub.year}\n`;
                }
                summary += `   🔗 DOI: ${pub.doi}\n\n`;
            });
        } else {
            summary += `🎓 **Burime Akademike:** Nuk u gjetën publikime specifike.\n\n`;
        }
        
        // ✅ REZULTATI PËRFUNDIMTAR
        summary += `---\n`;
        summary += `💡 **Këshillë:** Përdor /wiki <fjale> për kërkim të fokusuar në Wikipedia.\n`;
        summary += `🌐 **Burime të përdorura:** ${this.getUsedSources(sources)}`;
        
        return summary;
    }

    // ✅ NUMRIMI I BURIMEVE TË PËRDORURA
    countSources(wiki, news, academic) {
        let count = 0;
        if (wiki.hasData) count++;
        if (news.hasData && news.articles.length > 0) count++;
        if (academic.hasData && academic.publications.length > 0) count++;
        return count;
    }

    // ✅ LISTA E BURIMEVE TË PËRDORURA
    getUsedSources(sources) {
        const used = [];
        if (sources.wikipedia.hasData) used.push('Wikipedia');
        if (sources.news.hasData && sources.news.articles.length > 0) used.push('Lajme');
        if (sources.academic.hasData && sources.academic.publications.length > 0) used.push('Akademike');
        return used.join(', ') || 'Asnjë burim i disponueshëm';
    }
}

module.exports = new SearchService();
