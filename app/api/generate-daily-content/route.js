
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        // 1. Launch a hidden browser (Puppeteer)
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // For server compatibility
        });
        const page = await browser.newPage();
        // Increase timeout to 90 seconds (dev server might be slow on first build)
        page.setDefaultNavigationTimeout(90000);
        page.setDefaultTimeout(90000); // Also set general timeout

        // 2. Set viewport to match our card size (Landscape)
        // EXACT MATCH to remove whitespace (Card is 1200x630)
        await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

        // 3. Navigate to the Clean Print Page
        // This page is located at /print/card-news and has NO admin layout.
        const targetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/print/card-news`;

        console.log(`Puppeteer visiting: ${targetUrl}`);

        // Strategy Change: Don't wait for network idle (flaky in dev).
        // Instead, go to the page and wait for the specific element (#capture-target) to appear.
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForSelector('#capture-target', { timeout: 90000 });

        // 4. Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        // 5. Generate PNG (for SNS)
        const pngBuffer = await page.screenshot({
            type: 'png',
            fullPage: true
        });

        await browser.close();

        // 6. Save to server (public folder for now)
        const date = new Date().toISOString().split('T')[0];
        const pdfPath = path.join(process.cwd(), 'public', `daily-news-${date}.pdf`);
        const pngPath = path.join(process.cwd(), 'public', `daily-news-${date}.png`);

        fs.writeFileSync(pdfPath, pdfBuffer);
        fs.writeFileSync(pngPath, pngBuffer);

        console.log('Files generated successfully:', pdfPath, pngPath);

        return new Response(JSON.stringify({
            success: true,
            pdfUrl: `/daily-news-${date}.pdf`,
            pngUrl: `/daily-news-${date}.png`
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Auto-generation failed:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
