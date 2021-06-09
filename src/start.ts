import { launch } from 'chrome-launcher';
import * as core from '@actions/core';
import { Thresholds } from 'interfaces';
import {
    buildErrors,
    deleteReport,
    gatherResults,
    getInputs,
    launchLighthouse,
    saveReport,
    uploadArtifact,
    sendPrComment,
    buildCommentText,
} from './utils';

export async function start(): Promise<void> {
    try {
        const {
            urlsInput,
            performanceThreshold,
            accessibilityThreshold,
            bestPracticesThreshold,
            PWAThreshold,
            SEOThreshold,
            token,
        } = getInputs();
        const thesholds: Thresholds = {
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
        core.info('Upload successful');

        await deleteReport();

        const hasErrors = errors.length > 0;

        core.info('Posting comment ...');
        const commentText = buildCommentText(results, hasErrors);
        const error = await sendPrComment(token, commentText);
        if (error) {
            core.info("Comment couldn't be posted");
        } else {
            core.info('Comment successfully posted');
        }

        if (hasErrors) {
            errors.forEach((err) => {
                core.warning(
                    `Category ${err.title} got a score of ${err.score}`
                );
            });
            core.setFailed("Thresholds weren't met, check the artifact");
        }

        await chrome.kill();

        return undefined;
    } catch (error) {
        throw new Error(error);
    }
}
