import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function translateNewsItem(title, summary, content) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API Key is missing');
    }

    const prompt = `
    You are a professional translator for a news agency. 
    Translate the following news item from English/Vietnamese to Korean.
    
    Return the result in JSON format with keys: "translatedTitle", "translatedSummary", "translatedContent".
    
    - "translatedTitle": Concise and professional news headline style.
    - "translatedSummary": 2-3 sentences summarizing the key points.
    - "translatedContent": The full body text translated into Korean. 
      IMPORTANT: Return ONLY clean, semantic HTML. 
      - Use ONLY <p>, <h3>, <ul>, <li>, <strong> tags.
      - DO NOT use <div>, <article>, <span>, or <style> tags.
      - DO NOT include class names or IDs.
      - DO NOT include images (<img>) inside the content (images are handled separately).
      - Ensure the content is broken into readable paragraphs.
      - **TONE & STYLE**: Use formal Korean news reporting style (e.g., ends with "~다", "~했다", "~전망이다"). 
        - DO NOT use conversational tone (e.g., "~해요", "~입니다").
        - Maintain objectivity and professionalism.
    
    Input:
    Title: ${title}
    Summary: ${summary}
    Content: ${content}
  `;

    const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini", // Cost-effective model
        response_format: { type: "json_object" },
    });

    try {
        return JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        console.error("Failed to parse OpenAI response", e);
        return {
            translatedTitle: "Translation Failed",
            translatedSummary: "Translation Failed",
            translatedContent: "Translation Failed"
        };
    }
}

export async function translateText(text) {
    if (!process.env.OPENAI_API_KEY) return text;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{
                role: "user",
                content: `Translate the following news headline to Korean. Keep it concise and professional. Input: "${text}"`
            }],
            model: "gpt-4o-mini",
        });
        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("Simple translation failed:", error);
        return text;
    }
}
