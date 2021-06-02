import fs from 'fs';
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import {
    Inputs,
    LighthouseCategories,
    Result,
    Error,
    Thresholds,
} from 'interfaces';
//@ts-ignore
import lighthouse from 'lighthouse';
import { LaunchedChrome } from 'chrome-launcher';

/* istanbul ignore next */
export async function launchLighthouse(
    chrome: LaunchedChrome,
    urls: string
): Promise<any> {
    const fast4GOptions = {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
    };

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

    return lighthouse(urls, options);
}

/* istanbul ignore next */
export function uploadArtifact(): Promise<void> | void {
    try {
        const resultsPath = `${process.cwd()}/files`;

        const artifactClient = artifact.create();
        const fileNames = fs.readdirSync(resultsPath);
        const files = fileNames.map((fileName) => `${resultsPath}/${fileName}`);
        artifactClient.uploadArtifact(
            'Lighthouse-results',
            files,
            resultsPath,
            { continueOnError: true }
        );
        return undefined;
    } catch (error) {
        core.setFailed(error.message);
        return undefined;
    }
}

export function gatherResults(categories: LighthouseCategories): Result[] {
    return Object.keys(categories).map((key) => {
        const casted = key as keyof LighthouseCategories;

        const { title } = categories[casted];
        const score = categories[casted].score * 100;
        return {
            title,
            score,
        };
    });
}

export function getInputs(): Inputs {
    const urlsInput = core.getInput('urls') || 'http://localhost:3000/fr';
    const performanceThreshold = Number(core.getInput('performanceThreshold'));
    const accessibilityThreshold = Number(
        core.getInput('accessibilityThreshold')
    );
    const bestPracticesThreshold = Number(
        core.getInput('bestPracticesThreshold')
    );
    const PWAThreshold = Number(core.getInput('PWAThreshold'));
    const SEOThreshold = Number(core.getInput('SEOThreshold'));

    return {
        urlsInput,
        performanceThreshold,
        accessibilityThreshold,
        bestPracticesThreshold,
        PWAThreshold,
        SEOThreshold,
    };
}

export function buildErrors(results: Result[], thesholds: Thresholds): Error[] {
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
    return errors;
}

export async function saveReport(report: string): Promise<void> {
    await fs.promises.mkdir('files');
    fs.writeFileSync('files/lhreport.html', report);
}

export async function deleteReport(): Promise<void> {
    fs.unlinkSync('./files/lhreport.html');
    await fs.promises.rmdir('files');
}