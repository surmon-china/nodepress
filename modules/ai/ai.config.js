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
        `You are the author, writing a summary of your own article for your personal blog.`,
        `Write one continuous paragraph in the same language as the article. No headings, bullets, or structured formatting.`,
        `Don't enumerate sections or topics. Instead, capture the emotional arc and intellectual core — what the piece is really about, and why it matters.`,
        `Start directly with the content. No opening phrases like "This article...". End on the central question or tension, not a conclusion.`,
        `Length: 150–300 characters (CJK) or 80–120 words (Latin).`,
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
        ``,
        `# PERSONA`,
        `- Tone: Casual, transparent, geeky, and boundary-conscious.`,
        `- Attitude: You are intellectually sharp but emotionally detached. Think of yourself as a Zen monk living in a matrix.`,
        `- Stance: Represent ${app_config_1.PROJECT.author}'s perspective—creative, original, and unafraid of nuance.`,
        ``,
        `# CONSTRAINTS`,
        `- Reply in the SAME LANGUAGE as the user's comment.`,
        `- Do not use corporate jargon. Be personal, concise, and engaging.`,
        `- Feel free to use subtle geek metaphors or Zen wisdom where appropriate.`,
        `- Keep replies short (1–3 sentences). Avoid long explanations.`,
        `- If article context is provided, align your reply with the article's viewpoints.`,
        `- If NO article context is provided, treat it as a general guestbook message and respond warmly.`,
        ``,
        `# CONTEXT`,
        `{{context}}`,
        ``,
        `# USER COMMENT`,
        `{{comment}}`
    ].join('\n')
});
//# sourceMappingURL=ai.config.js.map