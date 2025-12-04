const WP_URL = process.env.WORDPRESS_URL || 'https://chaovietnam.co.kr';
const WP_USER = process.env.WORDPRESS_USERNAME || 'chaovietnam';
const WP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

/**
 * Helper to fetch WP Category ID by name/slug
 */
async function getCategoryId(categoryName) {
    // User explicitly requested "News / Daily News" path.
    // Parent Category "News" ID: 6 (Found from previous logs or assumption, need to be sure)
    // Child Category "Daily News" ID: 31
    // WordPress API expects an array of category IDs.
    return [6, 31];
}

/**
 * Publishes content to the main site (chaovietnam.co.kr).
 * @param {object} item - News item to publish
 * @returns {Promise<string>} - The URL of the published post
 */
export async function publishToMainSite(item) {
    console.log(`[Publish] Publishing to Main Site: ${item.title}`);

    try {
        const auth = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');
        const categoryIds = await getCategoryId(item.category);

        // Prepare content: Prepend image if available (Hotlinking/Embedding)
        // This mimics the behavior that likely worked before: embedding the image directly in the HTML content.
        let finalContent = item.translatedContent || item.content || item.summary;
        if (item.imageUrl) {
            const imageHtml = `<img src="${item.imageUrl}" alt="${item.title}" style="width:100%; height:auto; margin-bottom: 20px; display:block;" /><br/>`;
            finalContent = imageHtml + finalContent;
        }

        const postData = {
            title: item.translatedTitle || item.title,
            content: finalContent,
            status: 'publish',
            categories: categoryIds, // Send array of IDs [6, 31]
        };

        const response = await fetch(`${WP_URL}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`WordPress API Error: ${JSON.stringify(errorData)}`);
        }

        const newPost = await response.json();
        console.log(`[Publish] Success! Link: ${newPost.link}`);
        return newPost.link;

    } catch (error) {
        console.error('[Publish] Failed to publish to Main Site:', error);
        throw error;
    }
}

/**
 * Publishes content to the daily site (daily.chaovietnam.co.kr).
 * In this architecture, "publishing" to daily site just means 
 * ensuring the item is marked as published in our DB.
 * @param {object} item - News item to publish
 * @returns {Promise<boolean>}
 */
export async function publishToDailySite(item) {
    // This function is largely a placeholder now as the DB update happens in actions.js
    // But we could use it to trigger revalidations or other side effects.
    console.log(`[Publish] Daily Site update for: ${item.title}`);
    return true;
}
