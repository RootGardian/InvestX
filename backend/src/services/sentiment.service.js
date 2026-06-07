/**
 * =====================================================
 *  NLP SENTIMENT ANALYSIS SERVICE — Local Pipeline
 * =====================================================
 *  Pipeline:
 *    1. Fetch news headlines from Finnhub API
 *    2. Tokenize raw text (WordTokenizer from 'natural')
 *    3. Remove stop words (custom financial stop-word list)
 *    4. Stem tokens (Porter Stemmer)
 *    5. Score sentiment using AFINN lexicon (local, no LLM API)
 *    6. Classify as BULLISH / BEARISH / NEUTRAL
 *    7. Persist analysis in database
 * =====================================================
 */

const natural = require('natural');
const Sentiment = require('sentiment');
const prisma = require('../utils/prisma');

const tokenizer = new natural.WordTokenizer();
const stemmerEn = natural.PorterStemmer;
const stemmerFr = natural.PorterStemmerFr;
const sentimentAnalyzer = new Sentiment();

// ── FINANCIAL STOP WORDS (EN & FR) ───────────────────────────
const STOP_WORDS_EN = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
    'because', 'but', 'and', 'or', 'if', 'while', 'about', 'up', 'that',
    'this', 'it', 'its', 'i', 'me', 'my', 'we', 'our', 'you', 'your',
    'he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'what',
    'which', 'who', 'whom',
    // Financial noise
    'stock', 'stocks', 'share', 'shares', 'market', 'markets', 'company',
    'inc', 'corp', 'ltd', 'llc', 'nasdaq', 'nyse', 'sp', 'dow', 'jones',
    'said', 'says', 'according', 'report', 'reports', 'reported', 'new',
    'also', 'year', 'years', 'today', 'week', 'month', 'quarter'
]);

const STOP_WORDS_FR = new Set([
    'le', 'la', 'les', 'l', 'un', 'une', 'des', 'du', 'de', 'à', 'au', 'aux',
    'et', 'ou', 'mais', 'donc', 'car', 'ni', 'pour', 'dans', 'sur', 'sous',
    'avec', 'sans', 'par', 'que', 'qui', 'quoi', 'dont', 'où', 'je', 'tu',
    'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles', 'mon', 'ton', 'son',
    'ma', 'ta', 'sa', 'mes', 'tes', 'ses', 'ce', 'cet', 'cette', 'ces',
    'ne', 'pas', 'plus', 'y', 'en', 'a', 'est', 'sont', 'ont', 'été',
    'sera', 'seront', 'avoir', 'être', 'faire', 'fait', 'dit', 'selon',
    // Financial noise FR
    'action', 'actions', 'bourse', 'bourses', 'marché', 'marchés',
    'entreprise', 'entreprises', 'société', 'sociétés', 'groupe',
    'trimestre', 'semestre', 'an', 'année', 'jour', 'semaine', 'mois',
    'nouveau', 'nouvelle', 'rapport', 'rapporte', 'cac', 'indice'
]);

// ── CUSTOM FINANCIAL SENTIMENT LEXICON EXTENSION ────────────
const FINANCIAL_LEXICON_EN = {
    'bullish': 3, 'bearish': -3,
    'upgrade': 3, 'downgrade': -3,
    'outperform': 3, 'underperform': -3,
    'beat': 2, 'miss': -2, 'missed': -2,
    'surge': 3, 'surged': 3, 'surging': 3,
    'plunge': -3, 'plunged': -3, 'plunging': -3,
    'rally': 3, 'rallied': 3, 'rallying': 3,
    'crash': -4, 'crashed': -4, 'crashing': -4,
    'soar': 3, 'soared': 3, 'soaring': 3,
    'tumble': -3, 'tumbled': -3, 'tumbling': -3,
    'breakout': 2, 'breakdown': -2,
    'overbought': -1, 'oversold': 1,
    'dividend': 2, 'buyback': 2,
    'lawsuit': -2, 'fraud': -4, 'scandal': -3,
    'bankrupt': -5, 'bankruptcy': -5,
    'profitable': 3, 'unprofitable': -3,
    'growth': 2, 'decline': -2, 'declining': -2,
    'revenue': 1, 'loss': -2, 'losses': -2,
    'profit': 2, 'earnings': 1,
    'recession': -3, 'inflation': -1,
    'acquisition': 1, 'merger': 1,
    'layoff': -2, 'layoffs': -2,
    'innovation': 2, 'patent': 1,
    'guidance': 1, 'warning': -2,
    'strong': 2, 'weak': -2,
    'record': 2, 'high': 1, 'low': -1,
    'optimistic': 2, 'pessimistic': -2,
    'volatile': -1, 'stability': 1, 'stable': 1
};

// French Lexicon
const FINANCIAL_LEXICON_FR = {
    'haussier': 3, 'baissier': -3,
    'surperformer': 3, 'sous-performer': -3,
    'battre': 2, 'battu': 2, 'manquer': -2, 'manqué': -2,
    'envoler': 3, 'envolé': 3, 'chute': -3, 'chuté': -3,
    'rebond': 3, 'rebondir': 3, 'krach': -4, 'effondrement': -4,
    'effondré': -4, 'décollage': 3, 'dégringolade': -3, 'dégringoler': -3,
    'suracheté': -1, 'survendu': 1,
    'dividende': 2, 'rachat': 2,
    'procès': -2, 'fraude': -4, 'scandale': -3,
    'faillite': -5, 'banqueroute': -5,
    'rentable': 3, 'non-rentable': -3, 'déficitaire': -3,
    'croissance': 2, 'déclin': -2, 'baisse': -2,
    'revenu': 1, 'perte': -2, 'pertes': -2,
    'bénéfice': 2, 'bénéfices': 2, 'résultats': 1,
    'récession': -3, 'inflation': -1,
    'acquisition': 1, 'fusion': 1,
    'licenciement': -2, 'licenciements': -2,
    'innovation': 2, 'brevet': 1,
    'prévisions': 1, 'avertissement': -2,
    'fort': 2, 'forte': 2, 'faible': -2,
    'record': 2, 'haut': 1, 'bas': -1,
    'optimiste': 2, 'pessimiste': -2,
    'volatil': -1, 'stabilité': 1, 'stable': 1,
    'bon': 3, 'bonne': 3, 'excellent': 4, 'mauvais': -3, 'mauvaise': -3, 'pire': -4,
    'super': 3, 'génial': 4, 'terrible': -3, 'catastrophe': -4, 'succès': 3, 'échec': -3
};

// Register French language in Sentiment
sentimentAnalyzer.registerLanguage('fr', {
    labels: FINANCIAL_LEXICON_FR
});

/**
 * Step 1: Fetch news headlines from Finnhub
 */
const fetchNews = async (ticker) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const from = weekAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    const response = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${ticker.toUpperCase()}&from=${from}&to=${to}&token=${apiKey}`
    );

    if (!response.ok) {
        throw new Error(`Finnhub news error: ${response.statusText}`);
    }

    const articles = await response.json();
    return articles.slice(0, 20); // Limit to 20 most recent
};

/**
 * Step 2: Language Detection
 */
const detectLanguage = (tokens) => {
    let enCount = 0;
    let frCount = 0;
    
    tokens.forEach(token => {
        if (STOP_WORDS_EN.has(token)) enCount++;
        if (STOP_WORDS_FR.has(token)) frCount++;
    });

    return frCount > enCount ? 'fr' : 'en';
};

const tokenizerEn = new natural.WordTokenizer();
const tokenizerFr = new natural.AggressiveTokenizerFr();

/**
 * Step 3: Tokenize text
 */
const tokenize = (text, lang = 'en') => {
    const tokenizer = lang === 'fr' ? tokenizerFr : tokenizerEn;
    return tokenizer.tokenize(text.toLowerCase());
};

/**
 * Step 4: Remove stop words (language-aware)
 */
const removeStopWords = (tokens, lang = 'en') => {
    const stopWords = lang === 'fr' ? STOP_WORDS_FR : STOP_WORDS_EN;
    // Allow accented chars in French
    const regex = lang === 'fr' ? /^[a-zà-ÿ]+$/ : /^[a-z]+$/;
    
    return tokens.filter(token =>
        !stopWords.has(token) && token.length > 2 && regex.test(token)
    );
};

/**
 * Step 5: Stem tokens (language-aware)
 */
const stemTokens = (tokens, lang = 'en') => {
    const stemmer = lang === 'fr' ? stemmerFr : stemmerEn;
    return tokens.map(token => stemmer.stem(token));
};

/**
 * Step 6: Score sentiment (language-aware)
 */
const scoreSentiment = (text, lang = 'en') => {
    const options = {};
    if (lang === 'fr') {
        options.language = 'fr';
    } else {
        options.extras = FINANCIAL_LEXICON_EN;
    }

    const result = sentimentAnalyzer.analyze(text, options);

    return {
        score: result.score,
        comparative: result.comparative,  // normalized: score / number of tokens
        positive: result.positive,
        negative: result.negative
    };
};

/**
 * Step 6: Classify sentiment
 *   comparative > 0.05  → BULLISH
 *   comparative < -0.05 → BEARISH
 *   otherwise           → NEUTRAL
 */
const classifySentiment = (comparative) => {
    if (comparative > 0.05) return 'BULLISH';
    if (comparative < -0.05) return 'BEARISH';
    return 'NEUTRAL';
};

/**
 * FULL PIPELINE: Fetch → Tokenize → Filter → Stem → Score → Classify → Store
 */
const analyzeTickerSentiment = async (ticker) => {
    const articles = await fetchNews(ticker);

    if (!articles || articles.length === 0) {
        return { ticker, message: 'No news articles found', analyses: [] };
    }

    const analyses = [];

    for (const article of articles) {
        const rawText = `${article.headline || ''} ${article.summary || ''}`.trim();
        if (!rawText) continue;

        // Pipeline stages
        let tokens = tokenize(rawText, 'en');
        const lang = detectLanguage(tokens);
        
        if (lang === 'fr') {
            tokens = tokenize(rawText, 'fr');
        }
        
        const filteredTokens = removeStopWords(tokens, lang);
        const stemmedTokens = stemTokens(filteredTokens, lang);
        const sentimentResult = scoreSentiment(rawText, lang);
        const label = classifySentiment(sentimentResult.comparative);

        // Persist to database
        const analysis = await prisma.sentimentAnalysis.create({
            data: {
                ticker: ticker.toUpperCase(),
                headline: article.headline || 'No headline',
                source: article.source || null,
                url: article.url || null,
                rawText,
                tokens,
                filteredTokens: stemmedTokens,
                sentimentScore: sentimentResult.comparative,
                sentimentLabel: label
            }
        });

        analyses.push({
            id: analysis.id,
            headline: analysis.headline,
            source: analysis.source,
            tokens: tokens.length,
            filteredTokens: stemmedTokens.length,
            sentimentScore: sentimentResult.comparative,
            sentimentLabel: label,
            positiveWords: sentimentResult.positive,
            negativeWords: sentimentResult.negative
        });
    }

    // Compute aggregate sentiment
    const scores = analyses.map(a => a.sentimentScore);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const overallLabel = classifySentiment(avgScore);

    return {
        ticker: ticker.toUpperCase(),
        articlesAnalyzed: analyses.length,
        averageSentiment: avgScore.toFixed(4),
        overallLabel,
        distribution: {
            bullish: analyses.filter(a => a.sentimentLabel === 'BULLISH').length,
            neutral: analyses.filter(a => a.sentimentLabel === 'NEUTRAL').length,
            bearish: analyses.filter(a => a.sentimentLabel === 'BEARISH').length
        },
        analyses
    };
};

/**
 * Get stored sentiment history for a ticker
 */
const getSentimentHistory = async (ticker, limit = 50) => {
    const results = await prisma.sentimentAnalysis.findMany({
        where: { ticker: ticker.toUpperCase() },
        orderBy: { processedAt: 'desc' },
        take: limit
    });
    return results;
};

module.exports = {
    analyzeTickerSentiment,
    getSentimentHistory,
    // Export internals for testing/transparency
    detectLanguage,
    tokenize,
    removeStopWords,
    stemTokens,
    scoreSentiment,
    classifySentiment
};
