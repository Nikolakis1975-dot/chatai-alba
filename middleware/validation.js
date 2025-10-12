// middleware/validation.js
const validateMessage = (req, res, next) => {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Mesazhi nuk mund të jetë bosh'
        });
    }
    
    if (message.length > 1000) {
        return res.status(400).json({
            success: false,
            message: 'Mesazhi është shumë i gjatë (max 1000 karaktere)'
        });
    }
    
    // Kontroll për content të rrezikshëm
    const dangerousPatterns = /<script|javascript:|onload=|onerror=/i;
    if (dangerousPatterns.test(message)) {
        return res.status(400).json({
            success: false,
            message: 'Mesazhi përmbaj content të rrezikshëm'
        });
    }
    
    next();
};

const validateApiKey = (req, res, next) => {
    const { apikey } = req.body;
    
    if (!apikey || apikey.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'API Key nuk mund të jetë bosh'
        });
    }
    
    // Validim i thjeshtë i formatit të Gemini API Key
    if (!apikey.startsWith('AIza')) {
        return res.status(400).json({
            success: false,
            message: 'Format i pavlefshëm API Key'
        });
    }
    
    next();
};

module.exports = {
    validateMessage,
    validateApiKey
};
