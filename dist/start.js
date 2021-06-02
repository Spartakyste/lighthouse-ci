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
exports.start = void 0;
const chrome_launcher_1 = require("chrome-launcher");
const core = __importStar(require("@actions/core"));
const utils_1 = require("./utils");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const { urlsInput, performanceThreshold, accessibilityThreshold, bestPracticesThreshold, PWAThreshold, SEOThreshold, } = utils_1.getInputs();
        const thesholds = {
            Performance: performanceThreshold,
            Accessibility: accessibilityThreshold,
            SEO: SEOThreshold,
            'Best Practices': bestPracticesThreshold,
            'Progressive Web App': PWAThreshold,
        };
        const chrome = yield chrome_launcher_1.launch({
            chromeFlags: ['--headless'],
        });
        const runnerResult = yield utils_1.launchLighthouse(chrome, urlsInput);
        const { report } = runnerResult;
        const results = utils_1.gatherResults(runnerResult.lhr.categories);
        yield utils_1.saveReport(report);
        const errors = utils_1.buildErrors(results, thesholds);
        core.info('Uploading artifact ...');
        yield utils_1.uploadArtifact();
        core.info('Upload is over');
        core.info('Removing the report ...');
        yield utils_1.deleteReport();
        core.info('Report removed');
        if (errors.length > 0) {
            errors.forEach((err) => {
                core.error(`You didn't meet the thresholds values you provided for the category ${err.title} with a score of ${err.score}`);
            });
            core.setFailed("Thresholds weren't meet, check the artifact");
        }
        yield chrome.kill();
        return undefined;
    });
}
exports.start = start;
