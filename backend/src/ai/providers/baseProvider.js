/**
 * Base AI Provider Abstract Class
 */
class BaseProvider {
    constructor(config) {
        this.config = config;
    }

    /**
     * Generate structured JSON completion
     * @param {string} systemPrompt
     * @param {string} userPrompt
     * @param {object} options
     * @returns {Promise<object>} Parsed JSON response
     */
    async generateJSON(systemPrompt, userPrompt, options = {}) {
        throw new Error("generateJSON() must be implemented by provider subclass");
    }
}

module.exports = BaseProvider;
