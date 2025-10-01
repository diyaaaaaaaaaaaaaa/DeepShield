// routes/detect.js - API routes for content detection
const express = require('express');
const router = express.Router();

// Import text analysis utility (we'll create this next)
// For now, we'll use a simple placeholder function
const analyzeText = require('../utils/textAnalyzer');


// ===== TEXT DETECTION ENDPOINT =====
// POST /api/detect/text
router.post('/detect/text', async (req, res) => {
    try {
        // Extract text from request body
        const { text, settings = {} } = req.body;
        
        // Validate input
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Text field is required and must be a string',
                example: { text: "Your text here", settings: { sensitivity: 70 } }
            });
        }

        // Check text length (prevent abuse)
        if (text.length < 10) {
            return res.status(400).json({
                error: 'Text too short',
                message: 'Text must be at least 10 characters long'
            });
        }

        if (text.length > 50000) {
            return res.status(400).json({
                error: 'Text too long',
                message: 'Text must be less than 50,000 characters'
            });
        }

        console.log(`🔍 Analyzing text (${text.length} characters):`);
        console.log(`📝 First 100 chars: "${text.substring(0, 100)}..."`);

        // Perform text analysis
        const analysisResult = await analyzeText(text, settings);

        // Log result for debugging
        console.log(`✅ Analysis complete: ${analysisResult.confidence}% AI confidence`);

        // Return structured response
        res.json({
            success: true,
            contentType: 'text',
            isAI: analysisResult.isAI,
            confidence: analysisResult.confidence,
            reasons: analysisResult.reasons,
            metadata: {
                textLength: text.length,
                wordCount: text.split(' ').length,
                analyzedAt: new Date().toISOString(),
                processingTime: analysisResult.processingTime
            },
            settings: settings
        });

    } catch (error) {
        console.error('❌ Error in text detection:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: 'Unable to analyze text at this time',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// ===== BATCH TEXT DETECTION ENDPOINT =====
// POST /api/detect/batch
router.post('/detect/batch', async (req, res) => {
    try {
        const { texts, settings = {} } = req.body;

        // Validate input
        if (!Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'texts field must be a non-empty array',
                example: { texts: ["text1", "text2"], settings: { sensitivity: 70 } }
            });
        }

        // Limit batch size
        if (texts.length > 10) {
            return res.status(400).json({
                error: 'Batch too large',
                message: 'Maximum 10 texts per batch request'
            });
        }

        console.log(`🔄 Processing batch of ${texts.length} texts`);

        // Process each text
        const results = [];
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            
            if (typeof text !== 'string' || text.length < 10) {
                results.push({
                    index: i,
                    error: 'Invalid text: must be string with at least 10 characters',
                    success: false
                });
                continue;
            }

            try {
                const analysisResult = await analyzeText(text, settings);
                results.push({
                    index: i,
                    success: true,
                    isAI: analysisResult.isAI,
                    confidence: analysisResult.confidence,
                    reasons: analysisResult.reasons,
                    textLength: text.length
                });
            } catch (error) {
                results.push({
                    index: i,
                    error: 'Analysis failed for this text',
                    success: false
                });
            }
        }

        console.log(`✅ Batch processing complete: ${results.filter(r => r.success).length}/${texts.length} successful`);

        res.json({
            success: true,
            batchSize: texts.length,
            results: results,
            processedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error in batch detection:', error);
        res.status(500).json({
            error: 'Batch analysis failed',
            message: 'Unable to process batch request'
        });
    }
});

// ===== PLACEHOLDER ENDPOINTS FOR FUTURE FEATURES =====

// Image detection (placeholder)
router.post('/detect/image', (req, res) => {
    res.json({
        success: false,
        message: 'Image detection not implemented yet',
        comingSoon: true,
        supportedFormats: ['jpg', 'png', 'webp'],
        estimatedRelease: 'Phase 2'
    });
});

// Video detection (placeholder)
router.post('/detect/video', (req, res) => {
    res.json({
        success: false,
        message: 'Video detection not implemented yet',
        comingSoon: true,
        supportedFormats: ['mp4', 'webm'],
        estimatedRelease: 'Phase 2'
    });
});

// Alternative content suggestions (placeholder)
router.get('/alternatives/:contentHash', (req, res) => {
    const { contentHash } = req.params;
    res.json({
        success: false,
        message: 'Alternative content suggestions not implemented yet',
        contentHash: contentHash,
        comingSoon: true,
        estimatedRelease: 'Phase 2'
    });
});

// ===== UTILITY ENDPOINTS =====

// Get API status and capabilities
router.get('/status', (req, res) => {
    res.json({
        status: 'operational',
        capabilities: {
            textDetection: true,
            batchProcessing: true,
            imageDetection: false,
            videoDetection: false,
            alternativeContent: false
        },
        limits: {
            maxTextLength: 50000,
            maxBatchSize: 10,
            rateLimitPerMinute: 60
        },
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
    });
});

module.exports = router;