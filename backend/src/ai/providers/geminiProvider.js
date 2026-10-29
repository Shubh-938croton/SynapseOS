const axios = require("axios");
const BaseProvider = require("./baseProvider");

class GeminiProvider extends BaseProvider {
    async generateJSON(systemPrompt, userPrompt, options = {}) {
        const apiKey = this.config.apiKey;
        const model = this.config.model || "gemini-2.5-flash";
        const timeout = options.timeout || this.config.timeoutMs || 15000;

        if (!apiKey) {
            throw new Error("Missing Gemini API Key. Set AI_API_KEY environment variable.");
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

        const requestBody = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: [
                {
                    role: "user",
                    parts: [{ text: userPrompt }]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: options.temperature !== undefined ? options.temperature : 0.2
            }
        };

        try {
            const response = await axios.post(url, requestBody, {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout
            });

            const candidate = response.data?.candidates?.[0];
            if (!candidate || !candidate.content?.parts?.[0]?.text) {
                throw new Error("Gemini returned empty or blocked response.");
            }

            const rawText = candidate.content.parts[0].text.trim();
            try {
                return JSON.parse(rawText);
            } catch (parseErr) {
                // Strip possible markdown fences if returned
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

module.exports = GeminiProvider;
