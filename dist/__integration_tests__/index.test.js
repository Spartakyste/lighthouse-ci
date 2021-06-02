"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("utils"));
const core = __importStar(require("@actions/core"));
const mocks_1 = require("mocks");
const start_1 = require("start");
describe('Testing the start function', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    test('Should call everything needed', () => __awaiter(void 0, void 0, void 0, function* () {
        const getInputsSpy = jest
            .spyOn(utils, 'getInputs')
            .mockImplementationOnce(() => mocks_1.fakeInputs);
        const launchSpy = jest
            .spyOn(utils, 'launchLighthouse')
            .mockResolvedValueOnce({
            report: '',
            lhr: {
                categories: mocks_1.lighthouseResults100,
            },
        });
        const resultsSpy = jest
            .spyOn(utils, 'gatherResults')
            .mockImplementationOnce(() => mocks_1.fakeResults100);
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
            .mockResolvedValueOnce(undefined);
        yield start_1.start();
        expect(getInputsSpy).toHaveBeenCalledTimes(1);
        expect(launchSpy).toHaveBeenCalledTimes(1);
        expect(resultsSpy).toHaveBeenCalledTimes(1);
        expect(errorsSpy).toHaveBeenCalledTimes(1);
        expect(artifactSpy).toHaveBeenCalledTimes(1);
        expect(saveReportSpy).toHaveBeenCalledTimes(1);
        expect(deleteReportSpy).toHaveBeenCalledTimes(1);
    }));
    test('Launch everything but with errors, should log them', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(utils, 'getInputs').mockImplementationOnce(() => mocks_1.fakeInputs);
        jest.spyOn(utils, 'launchLighthouse').mockResolvedValueOnce({
            report: '',
            lhr: {
                categories: mocks_1.lighthouseResults100,
            },
        });
        jest.spyOn(utils, 'gatherResults').mockImplementationOnce(() => mocks_1.fakeResults100);
        jest.spyOn(utils, 'buildErrors').mockImplementationOnce(() => mocks_1.fakeErrors);
        jest.spyOn(utils, 'saveReport').mockResolvedValueOnce(undefined);
        jest.spyOn(utils, 'deleteReport').mockResolvedValueOnce(undefined);
        jest.spyOn(utils, 'uploadArtifact').mockResolvedValueOnce(undefined);
        const coreSpy = jest.spyOn(core, 'error');
        yield start_1.start();
        expect(coreSpy).toHaveBeenCalledTimes(mocks_1.fakeErrors.length);
    }));
});
