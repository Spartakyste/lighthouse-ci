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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const core = __importStar(require("@actions/core"));
const artifact = __importStar(require("@actions/artifact"));
const lighthouse_1 = __importDefault(require("lighthouse"));
const chrome_launcher_1 = require("chrome-launcher");
const fs_1 = __importDefault(require("fs"));
function gatherResults(categories) {
    return Object.keys(categories).map((key) => {
        const title = categories[key].title;
        const score = categories[key].score * 100;
        return {
            title,
            score,
        };
    });
}
function uploadArtifact() {
    try {
        const resultPath = `../lhreport.html`;
        console.log(`resultPath`, resultPath);
        const artifactClient = artifact.create();
        // const fileNames = await promisifiedReaddir(path);
        const file = fs_1.default.readdirSync(resultPath);
        console.log(`file`, file);
        // const files = fileNames.map((fileName) => join(resultsPath, fileName));
        return artifactClient.uploadArtifact('Lighthouse-results', file, resultPath);
    }
    catch (error) {
        throw Error(error);
    }
}
try {
    const fast4GOptions = {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const urlsInput = core.getInput('urls');
        const performanceTreshold = core.getInput('performanceTreshold');
        const accessibilityTreshold = core.getInput('accessibilityTreshold');
        const bestPracticesTreshold = core.getInput('bestPracticesTreshold');
        const PWATreshold = core.getInput('PWATreshold');
        const SEOTreshold = core.getInput('SEOTreshold');
        const thesholds = {
            Performance: performanceTreshold,
            Accessibility: accessibilityTreshold,
            'Best Practices': bestPracticesTreshold,
            SEO: SEOTreshold,
            'Progressive Web App': PWATreshold,
        };
        // const urls = urlsInput.split(',');
        const chrome = yield chrome_launcher_1.launch({
            chromeFlags: ['--headless'],
        });
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
            emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Safari/537.36 Chrome-Lighthouse',
        };
        const runnerResult = yield lighthouse_1.default(urlsInput, options);
        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        fs_1.default.writeFileSync('lhreport.html', reportHtml);
        console.log('Report is done for', runnerResult.lhr.finalUrl);
        // console.log(`runnerResult.lhr.categories`, runnerResult.lhr.categories);
        const results = gatherResults(runnerResult.lhr.categories);
        let errors = [];
        results.forEach(({ title, score }) => {
            const scoreTreshold = thesholds[title];
            if (score < scoreTreshold)
                errors.push({ title, score });
        });
        core.info('Uploading artifact ...');
        yield uploadArtifact();
        core.info('Upload is over');
        fs_1.default.unlinkSync('./lhreport.html');
        if (errors.length > 0) {
            errors.forEach((err) => {
                core.error(`You didn't meet the tresholds values you provided for the category ${err.title} with a score of ${err.score}`);
            });
            core.setFailed("Thresholds weren't meet");
        }
        yield chrome.kill();
    }))();
}
catch (error) {
    core.setFailed(error.message);
}
