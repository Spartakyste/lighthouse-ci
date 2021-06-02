import { launch } from 'chrome-launcher';
import * as core from '@actions/core';
import {
    buildErrors,
    deleteReport,
    gatherResults,
    getInputs,
    launchLighthouse,
    saveReport,
    uploadArtifact,
} from './utils';

export async function start(): Promise<void> {
    const {
        urlsInput,
        performanceThreshold,
        accessibilityThreshold,
        bestPracticesThreshold,
        PWAThreshold,
        SEOThreshold,
    } = getInputs();

    const thesholds = {
        Performance: performanceThreshold,
        Accessibility: accessibilityThreshold,
        SEO: SEOThreshold,
        'Best Practices': bestPracticesThreshold,
        'Progressive Web App': PWAThreshold,
    };

    const chrome = await launch({
        chromeFlags: ['--headless'],
    });

    const runnerResult = await launchLighthouse(chrome, urlsInput);
    const { report } = runnerResult;

    const results = gatherResults(runnerResult.lhr.categories);

    await saveReport(report);

    const errors = buildErrors(results, thesholds);

    core.info('Uploading artifact ...');
    await uploadArtifact();
    core.info('Upload is over');

    core.info('Removing the report ...');
    await deleteReport();
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

    return undefined;
}
