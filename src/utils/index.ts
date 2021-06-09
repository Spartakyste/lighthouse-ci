import fs from 'fs';
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import * as github from '@actions/github';
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
export async function uploadArtifact(): Promise<artifact.UploadResponse> {
    try {
        const resultsPath = `${process.cwd()}/files`;

        const artifactClient = artifact.create();
        const fileNames = fs.readdirSync(resultsPath);
        const files = fileNames.map((fileName) => `${resultsPath}/${fileName}`);
        return artifactClient.uploadArtifact(
            'Lighthouse-results',
            files,
            resultsPath,
            { continueOnError: true }
        );
    } catch (error) {
        throw new ErrorEvent(error.message);
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
    const token = core.getInput('token');

    return {
        urlsInput,
        performanceThreshold,
        accessibilityThreshold,
        bestPracticesThreshold,
        PWAThreshold,
        SEOThreshold,
        token,
    };
}

export function buildErrors(results: Result[], thesholds: Thresholds): Error[] {
    const errors: Error[] = [];
    results.forEach(({ title, score }) => {
        const castedTitle = title as keyof typeof thesholds;
        const value = thesholds[castedTitle];

        if (value) {
            if (score < value) errors.push({ title, score });
            else
                core.info(
                    `You successfully met the threshold values you provided for the category ${title} with a score of ${score}`
                );
        }
    });
    return errors;
}

export async function saveReport(report: string): Promise<void> {
    try {
        await fs.promises.mkdir('files');
        fs.writeFileSync('files/lhreport.html', report);
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteReport(): Promise<void> {
    fs.unlinkSync('files/lhreport.html');
    await fs.promises.rmdir('files');
}

export function buildCommentText(
    results: Result[],
    hasErrors: boolean
): string {
    let text = '';

    if (hasErrors) {
        text += 'The lighthouse-ci action failed. ';
    } else {
        text += 'The lighthouse-ci action succeeded. ';
    }

    text += 'Here are your Lighthouse scores :';

    results.forEach((result, index) => {
        if (index === 0) {
            text += `\n\t- ${result.title}: ${result.score}\n`;
        } else {
            text += `\t- ${result.title}: ${result.score}\n`;
        }
    });

    return text;
}

/**
 * @returns a boolean saying if an error happaned or not
 */
export async function sendPrComment(
    token: string,
    text: string
): Promise<boolean | void> {
    const {
        payload: { pull_request: pullRequest, repository },
    } = github.context;

    if (repository) {
        const { full_name: repoFullName } = repository;

        if (repoFullName) {
            const [owner, repo] = repoFullName.split('/');

            if (pullRequest) {
                const prNumber = pullRequest.number;

                const octokit = github.getOctokit(token);

                await octokit.rest.issues.createComment({
                    owner,
                    repo,
                    issue_number: prNumber,
                    body: text,
                });
                return false;
            }
            core.warning('No pull request was found');
            return true;
        }
        core.warning('No repository name was found');
        return true;
    }
    core.warning('No repository was found');
    return true;
}
