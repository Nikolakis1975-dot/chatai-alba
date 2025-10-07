// 📁 services/searchService.js
// ==================== ✅ SEARCH SERVICE - 07.10.2024 ====================
// 📝 DESKRIMI: Shërbim për kërkim të thelluar në internet
// 🎯 QËLLIMI: Përgjigje të bazura në research aktual
// 🔧 AUTORI: ChatAI ALBA Team
// =======================================================================

class SearchService {
    async performSearch(query) {
        try {
            // ✅ KËRKIM NË WIKIPEDIA
            const wikiResults = await this.searchWikipedia(query);
            
            // ✅ KËRKIM NË LAJME
            const newsResults = await this.searchNews(query);
            
            // ✅ KËRKIM NË BURIME AKADEMIKE
            const academicResults = await this.searchAcademic(query);
            
            // ✅ GJENERIM I PËRMBLEDHJES
            const summary = await this.generateSummary({
                wikipedia: wikiResults,
                news: newsResults,
                academic: academicResults
            }, query);
            
            return {
                success: true,
                response: summary,
                sources: {
                    wikipedia: wikiResults.source,
                    news: newsResults.source,
                    academic: academicResults.source
                }
            };
            
        } catch (error) {
            console.error('❌ Gabim në search service:', error);
            return {
                success: false,
                response: '❌ Nuk mund të kryej kërkim për momentin'
            };
        }
    }
}

module.exports = new SearchService();
