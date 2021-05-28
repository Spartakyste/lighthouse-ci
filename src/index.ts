//@ts-nocheck
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';
import join from 'path';

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

function uploadArtifact() {
    const resultPath = `../lhreport.html`;
    console.log(`resultPath`, resultPath);
    const artifactClient = artifact.create();
    // const fileNames = await promisifiedReaddir(path);
    const file = fs.readdirSync(join(__dirname, 'resultPath'));
    console.log(`file`, file);
    // const files = fileNames.map((fileName) => join(resultsPath, fileName));
    return artifactClient.uploadArtifact(
        'Lighthouse-results',
        file,
        resultPath
    );
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
        const performanceTreshold = core.getInput('performanceTreshold');
        const accessibilityTreshold = core.getInput('accessibilityTreshold');
        const bestPracticesTreshold = core.getInput('bestPracticesTreshold');
        const PWATreshold = core.getInput('PWATreshold');
        const SEOTreshold = core.getInput('SEOTreshold');

        const thesholds = {
            Performance: performanceTreshold,
            Accessibility: accessibilityTreshold,
            'Best Practices': bestPracticesTreshold,
            SEO: SEOTreshold,
            'Progressive Web App': PWATreshold,
        };

        // const urls = urlsInput.split(',');

        const chrome = await launch({
            chromeFlags: ['--headless'],
        });

        //* For all options, see https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js

        const options = {
            logLevel: false,
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
        const runnerResult = await lighthouse(urlsInput, options);

        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        fs.writeFileSync('lhreport.html', reportHtml);

        console.log('Report is done for', runnerResult.lhr.finalUrl);
        // console.log(`runnerResult.lhr.categories`, runnerResult.lhr.categories);

        const results = gatherResults(runnerResult.lhr.categories);

        let errors = [];

        results.forEach(({ title, score }) => {
            const scoreTreshold = thesholds[title];
            if (score < scoreTreshold) errors.push({ title, score });
        });

        core.info('Uploading artifact ...');
        await uploadArtifact();
        core.info('Upload is over');

        fs.unlinkSync('./lhreport.html');

        if (errors.length > 0) {
            errors.forEach((err) => {
                core.error(
                    `You didn't meet the tresholds values you provided for the category ${err.title} with a score of ${err.score}`
                );
            });
            core.setFailed("Thresholds weren't meet");
        }
        await chrome.kill();
    })();
} catch (error) {
    core.setFailed(error.message);
}
