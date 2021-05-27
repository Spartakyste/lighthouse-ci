import core from '@actions/core';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';

interface LighthouseCategories {
    [categorie: string]: {
        title: string;
        score: number;
        description: string;
    };
}
function gatherResults(categories: LighthouseCategories) {
    return Object.keys(categories).map((key) => {
        const title = categories[key].title;
        const score = categories[key].score * 100;
        return {
            title,
            score,
        };
    });
}

try {
   
    const fast4GOptions = {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
    };

    (async () => {
        const urlsInput = core.getInput('urls');
        console.log(`urlsInput`, urlsInput);
        const urls = urlsInput.split(',');
        console.log('urls ->>', urls);
        const chrome = await launch({
            chromeFlags: ['--headless'],
        });

        //* For all options, see https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js

        const options = {
            logLevel: 'quiet',
            output: 'html',
            port: chrome.port,
            throttling: fast4GOptions,
            screenEmulation: {
                mobile: false,
                width: 1350,
                height: 940,
                deviceScaleFactor: 1,
                disabled: false,
            },
            formFactor: 'desktop',
            emulatedUserAgent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Safari/537.36 Chrome-Lighthouse',
        };
        const runnerResult = await lighthouse(
            urls,
            options
        );

        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        fs.writeFileSync('lhreport.html', reportHtml);

        console.log('Report is done for', runnerResult.lhr.finalUrl);
        // console.log(`runnerResult.lhr.categories`, runnerResult.lhr.categories);

        const results = gatherResults(runnerResult.lhr.categories);
        console.log(`results`, results);
        await chrome.kill();
    })();
} catch (error) {
    // core.setFailed(error.message);
}
