import fs from 'fs';
import {
    fakeResults100,
    fakeResults50,
    fakeTresholds100,
    lighthouseResults100,
    lighthouseResults50,
} from 'mocks';
import {
    buildCommentText,
    buildErrors,
    deleteReport,
    gatherResults,
    getInputs,
    saveReport,
} from 'utils';

describe('Testing the gatheringResults', () => {
    test('Should return a well formatted object with 100 as scores', () => {
        const results = gatherResults(lighthouseResults100);

        expect(results).toMatchSnapshot();
    });

    test('Should return a well formatted object with 50 as scores', () => {
        const results = gatherResults(lighthouseResults50);

        expect(results).toMatchSnapshot();
    });
});

describe('Testing the getInputs', () => {
    test('Should return all necessary inputs', () => {
        const {
            urlsInput,
            performanceThreshold,
            accessibilityThreshold,
            bestPracticesThreshold,
            PWAThreshold,
            SEOThreshold,
        } = getInputs();

        expect(urlsInput).toBeDefined();
        expect(performanceThreshold).toBeDefined();
        expect(accessibilityThreshold).toBeDefined();
        expect(bestPracticesThreshold).toBeDefined();
        expect(PWAThreshold).toBeDefined();
        expect(SEOThreshold).toBeDefined();
    });

    test("Should return all default values if there's no arguments within the action", () => {
        const {
            urlsInput,
            performanceThreshold,
            accessibilityThreshold,
            bestPracticesThreshold,
            PWAThreshold,
            SEOThreshold,
        } = getInputs();

        expect(urlsInput).toBe('http://localhost:3000/fr');
        expect(performanceThreshold).toBe(0);
        expect(accessibilityThreshold).toBe(0);
        expect(bestPracticesThreshold).toBe(0);
        expect(PWAThreshold).toBe(0);
        expect(SEOThreshold).toBe(0);
    });
});

describe('Testing the buildErrors', () => {
    test('Should return an empty array if thresholds are met', () => {
        const results = buildErrors(fakeResults100, fakeTresholds100);

        expect(results).toEqual([]);
    });

    test('Should return an array of errors if thresholds are not met', () => {
        const results = buildErrors(fakeResults50, fakeTresholds100);

        expect(results).toMatchSnapshot();
    });
});

describe('Testing the saveReport', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('Should create a folder and an html file named lhreport', async () => {
        const file = 'Testing file';

        const mkdirSpy = jest
            .spyOn(fs.promises, 'mkdir')
            .mockResolvedValueOnce(undefined);

        const writeFileSpy = jest
            .spyOn(fs, 'writeFileSync')
            .mockImplementationOnce(() => ({}));

        await saveReport(file);

        expect(mkdirSpy).toHaveBeenCalledTimes(1);
        expect(mkdirSpy).toHaveBeenCalledWith('files');

        expect(writeFileSpy).toHaveBeenCalledTimes(1);
        expect(writeFileSpy).toHaveBeenCalledWith('files/lhreport.html', file);
    });
});

describe('Testing the deleteReport', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('Should delete the report named lhreport and remove the folder', async () => {
        const rmdirSpy = jest
            .spyOn(fs.promises, 'rmdir')
            .mockResolvedValueOnce(undefined);

        const unlynkFileSpy = jest
            .spyOn(fs, 'unlinkSync')
            .mockImplementationOnce(() => ({}));

        await deleteReport();

        expect(rmdirSpy).toHaveBeenCalledTimes(1);
        expect(rmdirSpy).toHaveBeenCalledWith('files');

        expect(unlynkFileSpy).toHaveBeenCalledTimes(1);
        expect(unlynkFileSpy).toHaveBeenCalledWith('./files/lhreport.html');
    });
});

describe('Testing the buildCommentText', () => {
    test('Should return a text with the results', () => {
        const results = buildCommentText(fakeResults100);
        expect(results).toMatchSnapshot();
    });
});
