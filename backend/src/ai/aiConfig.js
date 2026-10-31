/**
 * AI Service Configuration
 * Reads configuration from environment variables with safe defaults
 */

const getAIConfig = () => {
    const isEnabled = (process.env.AI_ENABLED || "false").toLowerCase() === "true";
    const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase().trim();
    const apiKey = process.env.AI_API_KEY || (provider === "openai" ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY) || "";
    const model = process.env.AI_MODEL || (provider === "openai" ? "gpt-4o-mini" : "gemini-2.5-flash");
    const timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 15000; // 15s timeout

    return {
        enabled: isEnabled && (apiKey.length > 0 || provider === "mock"),
        rawEnabledFlag: isEnabled,
        hasApiKey: apiKey.length > 0,
        provider,
        apiKey,
        model,
        timeoutMs
    };
};

module.exports = {
    getAIConfig
};
