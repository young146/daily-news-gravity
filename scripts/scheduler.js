
// web/scripts/scheduler.js
const { exec } = require('child_process');
const cron = require('node-cron'); // User might need to install this: npm install node-cron

console.log('⏳ Scheduler started. Waiting for 8:00 AM...');

// Schedule task to run at 8:00 AM every day
cron.schedule('0 8 * * *', () => {
    console.log('⏰ It is 8:00 AM. Starting crawler...');

    exec('npm run crawl', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Crawler failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Crawler stderr: ${stderr}`);
        }
        console.log(`✅ Crawler output:\n${stdout}`);
    });
});
