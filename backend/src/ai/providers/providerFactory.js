const GeminiProvider = require("./geminiProvider");
const OpenAIProvider = require("./openaiProvider");
const MockAIProvider = require("./mockProvider");
const { getAIConfig } = require("../aiConfig");

const getProvider = (providerName, customConfig = {}) => {
    const baseConfig = getAIConfig();
    const config = { ...baseConfig, ...customConfig, provider: providerName || baseConfig.provider };
    const providerType = (providerName || config.provider || "").toLowerCase();

    switch (providerType) {
        case "gemini":
            return new GeminiProvider(config);
        case "openai":
            return new OpenAIProvider(config);
        case "mock":
            return new MockAIProvider(config);
        default:
            throw new Error(`Unsupported AI provider: "${providerType}". Supported providers are 'gemini', 'openai', 'mock'.`);
    }
};

const createAIProvider = (customConfig = null) => {
    const config = customConfig || getAIConfig();
    return getProvider(config.provider, config);
};

module.exports = {
    createAIProvider,
    getProvider
};
