import * as core from '@actions/core';
//@ts-ignore
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'fs';
import { Error } from 'interfaces';
import { gatherResults, uploadArtifact } from 'utils';

try {
    const fast4GOptions = {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
    };

    (async (): Promise<void> => {
        const urlsInput = core.getInput('urls') || 'http://localhost:3000/fr';
        const performanceThreshold = Number(
            core.getInput('performanceThreshold')
        );
        const accessibilityThreshold = Number(
            core.getInput('accessibilityThreshold')
        );
        const bestPracticesThreshold = Number(
            core.getInput('bestPracticesThreshold')
        );
        const PWAThreshold = Number(core.getInput('PWAThreshold'));
        const SEOThreshold = Number(core.getInput('SEOThreshold'));

        const thesholds = {
            Performance: performanceThreshold,
            Accessibility: accessibilityThreshold,
            'Best Practices': bestPracticesThreshold,
            SEO: SEOThreshold,
            'Progressive Web App': PWAThreshold,
        };

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

        const reportHtml = runnerResult.report;

        await fs.promises.mkdir('files');
        fs.writeFileSync('files/lhreport.html', reportHtml);
        console.log(`runnerResult.lhr.categories`, runnerResult.lhr.categories);
        const results = gatherResults(runnerResult.lhr.categories);

        const errors: Error[] = [];

        results.forEach(({ title, score }) => {
            const castedTitle = title as keyof typeof thesholds;
            const value = thesholds[castedTitle];

            core.info(
                `You enforced a minimum value of ${value} for the category ${castedTitle}`
            );

            if (score < value) errors.push({ title, score });
            else
                core.info(
                    `You did meet the threshold values you provided for the category ${title} with a score of ${score}`
                );
        });

        core.info('Uploading artifact ...');
        await uploadArtifact();
        core.info('Upload is over');

        core.info('Removing the report ...');
        fs.unlinkSync('./files/lhreport.html');
        await fs.promises.rmdir('files');
        core.info('Report removed');

        if (errors.length > 0) {
            errors.forEach((err) => {
                core.error(
                    `You didn't meet the thresholds values you provided for the category ${err.title} with a score of ${err.score}`
                );
            });
            core.setFailed("Thresholds weren't meet, check the artifact");
        }
        await chrome.kill();
    })();
} catch (error) {
    core.setFailed(error.message);
}
