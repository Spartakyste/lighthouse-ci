"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mocks_1 = require("mocks");
const utils_1 = require("utils");
describe('Testing the gatheringResults', () => {
    test('Should return a well formatted object with 100 as scores', () => {
        const results = utils_1.gatherResults(mocks_1.lighthouseResults100);
        expect(results).toMatchSnapshot();
    });
    test('Should return a well formatted object with 50 as scores', () => {
        const results = utils_1.gatherResults(mocks_1.lighthouseResults50);
        expect(results).toMatchSnapshot();
    });
});
describe('Testing the getInputs', () => {
    test('Should return all necessary inputs', () => {
        const { urlsInput, performanceThreshold, accessibilityThreshold, bestPracticesThreshold, PWAThreshold, SEOThreshold, } = utils_1.getInputs();
        expect(urlsInput).toBeDefined();
        expect(performanceThreshold).toBeDefined();
        expect(accessibilityThreshold).toBeDefined();
        expect(bestPracticesThreshold).toBeDefined();
        expect(PWAThreshold).toBeDefined();
        expect(SEOThreshold).toBeDefined();
    });
    test("Should return all default values if there's no arguments within the action", () => {
        const { urlsInput, performanceThreshold, accessibilityThreshold, bestPracticesThreshold, PWAThreshold, SEOThreshold, } = utils_1.getInputs();
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
        const results = utils_1.buildErrors(mocks_1.fakeResults100, mocks_1.fakeTresholds100);
        expect(results).toEqual([]);
    });
    test('Should return an array of errors if thresholds are not met', () => {
        const results = utils_1.buildErrors(mocks_1.fakeResults50, mocks_1.fakeTresholds100);
        expect(results).toMatchSnapshot();
    });
});
describe('Testing the saveReport', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    test('Should create a folder and an html file named lhreport', () => __awaiter(void 0, void 0, void 0, function* () {
        const file = 'Testing file';
        const mkdirSpy = jest
            .spyOn(fs_1.default.promises, 'mkdir')
            .mockResolvedValueOnce(undefined);
        const writeFileSpy = jest
            .spyOn(fs_1.default, 'writeFileSync')
            .mockImplementationOnce(() => ({}));
        yield utils_1.saveReport(file);
        expect(mkdirSpy).toHaveBeenCalledTimes(1);
        expect(mkdirSpy).toHaveBeenCalledWith('files');
        expect(writeFileSpy).toHaveBeenCalledTimes(1);
        expect(writeFileSpy).toHaveBeenCalledWith('files/lhreport.html', file);
    }));
});
describe('Testing the deleteReport', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    test('Should delete the report named lhreport and remove the folder', () => __awaiter(void 0, void 0, void 0, function* () {
        const rmdirSpy = jest
            .spyOn(fs_1.default.promises, 'rmdir')
            .mockResolvedValueOnce(undefined);
        const unlynkFileSpy = jest
            .spyOn(fs_1.default, 'unlinkSync')
            .mockImplementationOnce(() => ({}));
        yield utils_1.deleteReport();
        expect(rmdirSpy).toHaveBeenCalledTimes(1);
        expect(rmdirSpy).toHaveBeenCalledWith('files');
        expect(unlynkFileSpy).toHaveBeenCalledTimes(1);
        expect(unlynkFileSpy).toHaveBeenCalledWith('./files/lhreport.html');
    }));
});
describe('Testing the buildCommentText', () => {
    test('Should return a text with the results', () => {
        const results = utils_1.buildCommentText(mocks_1.fakeResults100, true);
        expect(results).toMatchSnapshot();
    });
    test('Should return a text with the results', () => {
        const results = utils_1.buildCommentText(mocks_1.fakeResults100, false);
        expect(results).toMatchSnapshot();
    });
});
