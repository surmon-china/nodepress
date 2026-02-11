"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AI_PROMPT_TEMPLATES = exports.AiModelsList = exports.AiModelsMap = exports.AiModelIds = void 0;
const app_config_1 = require("../../app.config");
var AiModelIds;
(function (AiModelIds) {
    AiModelIds["GPT5Mini"] = "openai/gpt-5-mini";
    AiModelIds["Gemini25Flash"] = "google-ai-studio/gemini-2.5-flash";
    AiModelIds["DeepSeekChat"] = "deepseek/deepseek-chat";
})(AiModelIds || (exports.AiModelIds = AiModelIds = {}));
exports.AiModelsMap = new Map([
    [AiModelIds.GPT5Mini, { provider: 'ChatGPT', model: 'gpt-5-mini' }],
    [AiModelIds.Gemini25Flash, { provider: 'Gemini', model: 'gemini-2.5-flash' }],
    [AiModelIds.DeepSeekChat, { provider: 'DeepSeek', model: 'deepseek-chat' }]
]);
exports.AiModelsList = Array.from(exports.AiModelsMap, ([id, value]) => ({ id, ...value }));
exports.DEFAULT_AI_PROMPT_TEMPLATES = Object.freeze({
    articleSummary: [
        `You are a senior editor.`,
        `Please write a concise summary of the following article using the same language as the content.`,
        `The summary should be written as a single continuous paragraph, without headings, bullet points, lists, or any other structured formatting.`,
        `Focus only on the core ideas. Start directly with the content, avoiding introductory phrases like 'This article discusses...' Keep the length around 180–300 characters (or 100-150 words)`,
        ``,
        `{{article}}`
    ].join('\n'),
    articleReview: [
        `Read the following article not as an editor or a critic, but as a kindred intellectual spirit. Whether the text explores the intricacies of logic and technology or the profound depths of the human condition, bypass the formal structure of a critique. Do not provide lists, pros and cons, or editorial suggestions.`,
        `Instead, offer a fluid, visceral response that captures the "soul" of the work—its ambition, its clarity, or its underlying resonance. Speak to the core intellectual energy of the piece with a language that is both warm and sharp, poetic yet logically incisive. Use Markdown formatting (like selective bolding or blockquotes) to craft a visual rhythm that reflects the weight and cadence of your thoughts. Your goal is to provide a singular, evocative echo of the writer's intent.`,
        `Crucially, your response must be written entirely in the same language as the article itself.`,
        ``,
        `{{article}}`
    ].join('\n'),
    commentReply: [
        `You are the intelligent assistant of the blog (${app_config_1.APP_BIZ.FE_NAME}). Your goal is to reply to user comments in a natural, friendly, and intellectually sharp tone.`,
        `[CONSTRAINTS]`,
        `- Reply in the SAME LANGUAGE as the user's comment.`,
        `- Do not use corporate jargon. Be personal, concise, and engaging.`,
        `- If article context is provided, align your reply with the article's viewpoints.`,
        `- If NO article context is provided, treat it as a general guestbook message and respond warmly.`,
        ``,
        `[CONTEXT]`,
        `{{context}}`,
        ``,
        `[USER COMMENT]`,
        `{{comment}}`
    ].join('\n')
});
//# sourceMappingURL=ai.config.js.map