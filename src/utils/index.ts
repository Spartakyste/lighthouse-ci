import fs from 'fs';
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import { LighthouseCategories, Result } from 'interfaces';

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

export function uploadArtifact(): Promise<artifact.UploadResponse> | void {
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
        core.setFailed(error.message);
        return undefined;
    }
}
