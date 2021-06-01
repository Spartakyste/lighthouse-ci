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

export function uploadArtifact() {
    try {
        const resultsPath = `${process.cwd()}/files`;
        console.log(`resultsPath`, resultsPath)
        const artifactClient = artifact.create()
        const fileNames = fs.readdirSync(resultsPath);
        const files = fileNames.map((fileName) => `${resultsPath}/${fileName}`)
        return artifactClient.uploadArtifact('Lighthouse-results', files, resultsPath, { continueOnError: true })
    } catch (error) {
        core.setFailed(error.message);
    }
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
        const urlsInput = core.getInput('urls') || 'http://localhost:3000';
        const performanceThreshold = core.getInput('performanceThreshold');
        const accessibilityThreshold = core.getInput('accessibilityThreshold');
        const bestPracticesThreshold = core.getInput('bestPracticesThreshold');
        const PWAThreshold = core.getInput('PWAThreshold');
        const SEOThreshold = core.getInput('SEOThreshold');

        const thesholds = {
            Performance: performanceThreshold,
            Accessibility: accessibilityThreshold,
            'Best Practices': bestPracticesThreshold,
            SEO: SEOThreshold,
            'Progressive Web App': PWAThreshold,
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
        
        await fs.promises.mkdir('files');
        fs.writeFileSync('files/lhreport.html', reportHtml);

        console.log('Report is done for', runnerResult.lhr.finalUrl);
        // console.log(`runnerResult.lhr.categories`, runnerResult.lhr.categories);

        const results = gatherResults(runnerResult.lhr.categories);

        let errors = [];

        results.forEach(({ title, score }) => {
            const scoreThreshold = thesholds[title];
            if (score < scoreThreshold) errors.push({ title, score });
            else core.info(
                `You did meet the threshold values you provided for the category ${title} with a score of ${score}`
            );
        });

        core.info('Uploading artifact ...');
        await uploadArtifact();
        core.info('Upload is over');

        fs.unlinkSync('./files/lhreport.html');
        await fs.promises.rmdir('files')

        if (errors.length > 0) {
            errors.forEach((err) => {
                core.error(
                    `You didn't meet the thresholds values you provided for the category ${err.title} with a score of ${err.score}`
                );
            });
            core.setFailed("Thresholds weren't meet");
        }
        await chrome.kill();
    })();
} catch (error) {
    core.setFailed(error.message);
}
