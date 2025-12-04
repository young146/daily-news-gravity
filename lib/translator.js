
// web/lib/translator.js

/**
 * Translates text from source language to target language.
 * Currently mocked until API key is provided.
 * 
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'vi')
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang = 'vi') {
    console.log(`[MockTranslate] Translating to ${targetLang}: ${text.substring(0, 20)}...`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translation logic (just prepends [VI])
    // TODO: Replace with actual Google Translate or OpenAI API call
    return `[VI] ${text}`;
}

/**
 * Translates a news item (title, summary, content).
 * @param {object} item - News item object
 * @returns {Promise<object>} - Object with translated fields
 */
export async function translateNewsItem(item) {
    const translatedTitle = await translateText(item.title, 'vi');
    const translatedSummary = item.summary ? await translateText(item.summary, 'vi') : null;

    // Content might be HTML, need careful handling in real impl
    const translatedContent = item.content ? await translateText(item.content, 'vi') : null;

    return {
        translatedTitle,
        translatedSummary,
        translatedContent
    };
}
