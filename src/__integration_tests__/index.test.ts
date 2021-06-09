import * as utils from 'utils';
import * as core from '@actions/core';
import {
    fakeErrors,
    fakeInputs,
    fakeResults100,
    lighthouseResults100,
} from 'mocks';
import { start } from 'start';
import { UploadResponse } from '@actions/artifact';

describe('Testing the start function', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('Should call everything needed', async () => {
        const getInputsSpy = jest
            .spyOn(utils, 'getInputs')
            .mockImplementationOnce(() => fakeInputs);

        const launchSpy = jest
            .spyOn(utils, 'launchLighthouse')
            .mockResolvedValueOnce({
                report: '',
                lhr: {
                    categories: lighthouseResults100,
                },
            });

        const resultsSpy = jest
            .spyOn(utils, 'gatherResults')
            .mockImplementationOnce(() => fakeResults100);

        const errorsSpy = jest
            .spyOn(utils, 'buildErrors')
            .mockImplementationOnce(() => []);

        const saveReportSpy = jest
            .spyOn(utils, 'saveReport')
            .mockResolvedValueOnce(undefined);
        const deleteReportSpy = jest
            .spyOn(utils, 'deleteReport')
            .mockResolvedValueOnce(undefined);

        const artifactSpy = jest
            .spyOn(utils, 'uploadArtifact')
            .mockResolvedValueOnce(undefined as unknown as UploadResponse);

        await start();

        expect(getInputsSpy).toHaveBeenCalledTimes(1);
        expect(launchSpy).toHaveBeenCalledTimes(1);
        expect(resultsSpy).toHaveBeenCalledTimes(1);
        expect(errorsSpy).toHaveBeenCalledTimes(1);
        expect(artifactSpy).toHaveBeenCalledTimes(1);
        expect(saveReportSpy).toHaveBeenCalledTimes(1);
        expect(deleteReportSpy).toHaveBeenCalledTimes(1);
    });
});
