// utils/textAnalyzer.js - AI Text Detection Logic
const crypto = require('crypto');

/**
 * Main text analysis function
 * Detects if text is AI-generated using pattern analysis
 * @param {string} text - Text to analyze
 * @param {object} settings - User settings (sensitivity, etc.)
 * @returns {object} Analysis result with confidence and reasons
 */
async function analyzeText(text, settings = {}) {
    const startTime = Date.now();
    
    // Default settings
    const config = {
        sensitivity: settings.sensitivity || 70,
        enablePatternAnalysis: true,
        enableStructuralAnalysis: true,
        enableVocabularyAnalysis: true,
        ...settings
    };

    console.log(`🔍 Starting text analysis (sensitivity: ${config.sensitivity}%)`);

    try {
        // Initialize analysis results
        const analysisResults = {
            patterns: analyzePatterns(text),
            structure: analyzeStructure(text),
            vocabulary: analyzeVocabulary(text),
            metadata: extractMetadata(text)
        };

        // Calculate weighted confidence score
        const confidence = calculateOverallConfidence(analysisResults, config);
        
        // Determine if AI-generated based on confidence and user threshold
        const isAI = confidence >= config.sensitivity;

        // Compile reasons for detection
        const reasons = compileReasons(analysisResults, confidence);

        const processingTime = Date.now() - startTime;

        console.log(`✅ Analysis complete: ${confidence}% confidence (${processingTime}ms)`);

        return {
            isAI: isAI,
            confidence: Math.round(confidence),
            reasons: reasons,
            processingTime: processingTime,
            analysisDetails: {
                patternScore: analysisResults.patterns.score,
                structureScore: analysisResults.structure.score,
                vocabularyScore: analysisResults.vocabulary.score,
                textHash: generateTextHash(text)
            }
        };

    } catch (error) {
        console.error('❌ Text analysis failed:', error);
        throw new Error(`Analysis failed: ${error.message}`);
    }
}

/**
 * Analyze text patterns that are common in AI-generated content
 */
function analyzePatterns(text) {
    const patterns = {
        repetitiveWords: 0,
        genericPhrases: 0,
        transitionOveruse: 0,
        perfectGrammar: 0
    };

    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // 1. Check for repetitive words/phrases
    const wordFreq = {};
    words.forEach(word => {
        if (word.length > 4) { // Only count meaningful words
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    const repeatedWords = Object.values(wordFreq).filter(count => count > 3).length;
    patterns.repetitiveWords = Math.min((repeatedWords / words.length) * 100, 30);

    // 2. Check for generic AI phrases
    const aiPhrases = [
        'in conclusion', 'furthermore', 'moreover', 'additionally', 'consequently',
        'it is important to note', 'it should be noted', 'in summary',
        'overall', 'in general', 'ultimately', 'essentially', 'basically',
        'it is worth mentioning', 'significantly', 'notably'
    ];
    
    const foundPhrases = aiPhrases.filter(phrase => 
        text.toLowerCase().includes(phrase)
    ).length;
    patterns.genericPhrases = Math.min((foundPhrases / sentences.length) * 40, 25);

    // 3. Check for excessive transitions
    const transitions = ['however', 'therefore', 'meanwhile', 'subsequently', 'nevertheless'];
    const transitionCount = transitions.filter(t => text.toLowerCase().includes(t)).length;
    patterns.transitionOveruse = Math.min((transitionCount / sentences.length) * 30, 20);

    // 4. Check for suspiciously perfect grammar (simplified)
    const grammarScore = checkGrammarPerfection(text);
    patterns.perfectGrammar = grammarScore;

    const totalScore = Object.values(patterns).reduce((sum, score) => sum + score, 0);

    return {
        score: Math.min(totalScore, 100),
        details: patterns,
        description: 'Pattern analysis for AI-typical language usage'
    };
}

/**
 * Analyze text structure and flow
 */
function analyzeStructure(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    const structure = {
        sentenceLengthConsistency: 0,
        paragraphBalance: 0,
        logicalFlow: 0
    };

    // 1. Sentence length consistency (AI tends to be very consistent)
    if (sentences.length > 1) {
        const lengths = sentences.map(s => s.trim().split(/\s+/).length);
        const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
        const stdDev = Math.sqrt(variance);
        
        // Low variance = high consistency = more AI-like
        const consistencyScore = Math.max(0, 30 - (stdDev * 2));
        structure.sentenceLengthConsistency = Math.min(consistencyScore, 30);
    }

    // 2. Paragraph balance (AI tends to create evenly balanced paragraphs)
    if (paragraphs.length > 1) {
        const paragraphLengths = paragraphs.map(p => p.length);
        const avgParagraphLength = paragraphLengths.reduce((sum, len) => sum + len, 0) / paragraphLengths.length;
        const paragraphVariance = paragraphLengths.reduce((sum, len) => sum + Math.pow(len - avgParagraphLength, 2), 0) / paragraphLengths.length;
        
        const balanceScore = Math.max(0, 25 - (Math.sqrt(paragraphVariance) / 100));
        structure.paragraphBalance = Math.min(balanceScore, 25);
    }

    // 3. Logical flow assessment (simplified)
    structure.logicalFlow = assessLogicalFlow(sentences);

    const totalScore = Object.values(structure).reduce((sum, score) => sum + score, 0);

    return {
        score: Math.min(totalScore, 100),
        details: structure,
        description: 'Structural analysis of text organization and flow'
    };
}

/**
 * Analyze vocabulary complexity and usage
 */
function analyzeVocabulary(text) {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const uniqueWords = new Set(words);
    
    const vocabulary = {
        diversityRatio: 0,
        complexityScore: 0,
        formalityLevel: 0
    };

    // 1. Vocabulary diversity (AI sometimes lacks diversity)
    const diversity = uniqueWords.size / words.length;
    if (diversity < 0.3) { // Low diversity might indicate AI
        vocabulary.diversityRatio = (0.3 - diversity) * 100;
    }

    // 2. Word complexity (AI might use consistently complex words)
    const complexWords = Array.from(uniqueWords).filter(word => word.length > 8).length;
    const complexityRatio = complexWords / uniqueWords.size;
    if (complexityRatio > 0.15) { // High complexity might indicate AI
        vocabulary.complexityScore = (complexityRatio - 0.15) * 200;
    }

    // 3. Formality level (AI tends to be formal)
    const formalWords = ['utilize', 'demonstrate', 'significant', 'appropriate', 'comprehensive', 'substantial'];
    const formalWordCount = formalWords.filter(word => text.toLowerCase().includes(word)).length;
    vocabulary.formalityLevel = Math.min((formalWordCount / (words.length / 100)) * 15, 20);

    const totalScore = Object.values(vocabulary).reduce((sum, score) => sum + score, 0);

    return {
        score: Math.min(totalScore, 100),
        details: vocabulary,
        description: 'Vocabulary analysis for AI-typical word usage patterns'
    };
}

/**
 * Extract metadata about the text
 */
function extractMetadata(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    return {
        wordCount: words,
        sentenceCount: sentences,
        paragraphCount: paragraphs,
        avgWordsPerSentence: sentences > 0 ? Math.round(words / sentences) : 0,
        readabilityEstimate: calculateReadabilityScore(text)
    };
}

/**
 * Calculate overall confidence based on all analysis results
 */
function calculateOverallConfidence(results, config) {
    // Weight different analysis types
    const weights = {
        patterns: 0.4,      // 40% - Most important
        structure: 0.35,    // 35% - Very important  
        vocabulary: 0.25    // 25% - Supporting evidence
    };

    const weightedScore = 
        (results.patterns.score * weights.patterns) +
        (results.structure.score * weights.structure) +
        (results.vocabulary.score * weights.vocabulary);

    // Apply sensitivity adjustment
    const sensitivityMultiplier = config.sensitivity / 70; // 70 is baseline
    const adjustedScore = weightedScore * sensitivityMultiplier;

    return Math.min(Math.max(adjustedScore, 0), 100);
}

/**
 * Compile human-readable reasons for the detection result
 */
function compileReasons(results, confidence) {
    const reasons = [];

    // Pattern-based reasons
    if (results.patterns.details.repetitiveWords > 5) {
        reasons.push("Repetitive word usage detected");
    }
    if (results.patterns.details.genericPhrases > 10) {
        reasons.push("Generic transitional phrases commonly used by AI");
    }
    if (results.patterns.details.perfectGrammar > 15) {
        reasons.push("Unusually perfect grammar and syntax");
    }

    // Structure-based reasons
    if (results.structure.details.sentenceLengthConsistency > 20) {
        reasons.push("Highly consistent sentence structure");
    }
    if (results.structure.details.paragraphBalance > 15) {
        reasons.push("Unnaturally balanced paragraph lengths");
    }

    // Vocabulary-based reasons
    if (results.vocabulary.details.formalityLevel > 15) {
        reasons.push("Consistently formal vocabulary");
    }
    if (results.vocabulary.details.diversityRatio > 10) {
        reasons.push("Limited vocabulary diversity");
    }

    // Default reasons if none found
    if (reasons.length === 0) {
        if (confidence > 50) {
            reasons.push("Multiple subtle indicators suggest AI generation");
        } else {
            reasons.push("Text appears to be human-written");
        }
    }

    return reasons.slice(0, 4); // Limit to 4 most important reasons
}

/**
 * Helper functions
 */
function checkGrammarPerfection(text) {
    // Simplified grammar check - look for common human errors that AI avoids
    const humanErrorPatterns = [
        /\bi\s/gi,              // Uncapitalized "i"
        /\s{2,}/g,              // Multiple spaces
        /[.!?]{2,}/g,           // Multiple punctuation
        /\s+[.!?]/g             // Space before punctuation
    ];

    const errorCount = humanErrorPatterns.reduce((count, pattern) => {
        return count + (text.match(pattern) || []).length;
    }, 0);

    // Fewer errors = more perfect = more AI-like
    const expectedErrors = text.length / 1000; // Expect ~1 error per 1000 chars
    const perfectionScore = Math.max(0, (expectedErrors - errorCount) * 5);
    
    return Math.min(perfectionScore, 25);
}

function assessLogicalFlow(sentences) {
    // Simplified logical flow assessment
    // AI tends to have very logical, predictable flow
    let flowScore = 0;
    
    const flowWords = ['first', 'second', 'third', 'finally', 'next', 'then', 'therefore', 'thus'];
    const foundFlowWords = flowWords.filter(word => 
        sentences.some(sentence => sentence.toLowerCase().includes(word))
    ).length;
    
    // More flow words = more structured = more AI-like
    flowScore = Math.min((foundFlowWords / sentences.length) * 60, 20);
    
    return flowScore;
}

function calculateReadabilityScore(text) {
    // Simplified Flesch Reading Ease approximation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).length;
    const syllables = text.toLowerCase().match(/[aeiouy]+/g)?.length || 0;
    
    if (sentences === 0 || words === 0) return 50; // Default neutral score
    
    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    const readabilityScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, readabilityScore));
}

function generateTextHash(text) {
    return crypto.createHash('md5').update(text).digest('hex').substring(0, 8);
}

// Export the main function
module.exports = analyzeText;