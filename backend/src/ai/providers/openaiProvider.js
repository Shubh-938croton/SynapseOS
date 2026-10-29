const axios = require("axios");
const BaseProvider = require("./baseProvider");

class OpenAIProvider extends BaseProvider {
    async generateJSON(systemPrompt, userPrompt, options = {}) {
        const apiKey = this.config.apiKey;
        const model = this.config.model || "gpt-4o-mini";
        const timeout = options.timeout || this.config.timeoutMs || 15000;

        if (!apiKey) {
            throw new Error("Missing OpenAI API Key. Set AI_API_KEY environment variable.");
        }

        const url = "https://api.openai.com/v1/chat/completions";

        const requestBody = {
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: options.temperature !== undefined ? options.temperature : 0.2
        };

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`
                },
                timeout
            });

            const choice = response.data?.choices?.[0];
            if (!choice || !choice.message?.content) {
                throw new Error("OpenAI returned empty response.");
            }

            const rawText = choice.message.content.trim();
            try {
                return JSON.parse(rawText);
            } catch (parseErr) {
                const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
                return JSON.parse(cleanJson);
            }
        } catch (err) {
            if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
                throw new Error("AI provider request timed out. Please try again.");
            }
            if (err.response) {
                const status = err.response.status;
                const errMessage = err.response.data?.error?.message || err.message;
                if (status === 429) {
                    throw new Error("AI provider rate limit reached. Please wait a moment.");
                }
                if (status === 401 || status === 403) {
                    throw new Error("AI provider authentication failed. Check server API key.");
                }
                throw new Error(`AI Provider Error (${status}): ${errMessage}`);
            }
            throw err;
        }
    }
}

module.exports = OpenAIProvider;
