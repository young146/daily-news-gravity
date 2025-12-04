
// web/lib/sns.js

/**
 * Posts content to SNS platforms.
 * @param {object} item - News item to post
 * @param {string} platform - 'facebook' or 'kakao'
 * @returns {Promise<boolean>}
 */
export async function postToSNS(item, platform) {
    console.log(`[MockSNS] Posting to ${platform}: ${item.title}`);

    const message = `
    [NEWS] ${item.translatedTitle || item.title}
    
    ${item.translatedSummary || item.summary}
    
    Read more: https://chaovietnam.co.kr/news/${item.id}
  `;

    // TODO: Implement actual API calls
    if (platform === 'facebook') {
        // await facebookApi.post(...)
    } else if (platform === 'kakao') {
        // await kakaoApi.post(...)
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
}
