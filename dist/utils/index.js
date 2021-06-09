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
exports.sendPrComment = exports.buildCommentText = exports.deleteReport = exports.saveReport = exports.buildErrors = exports.getInputs = exports.gatherResults = exports.uploadArtifact = exports.launchLighthouse = void 0;
const fs_1 = __importDefault(require("fs"));
const core = __importStar(require("@actions/core"));
const artifact = __importStar(require("@actions/artifact"));
const github = __importStar(require("@actions/github"));
//@ts-ignore
const lighthouse_1 = __importDefault(require("lighthouse"));
/* istanbul ignore next */
function launchLighthouse(chrome, urls) {
    return __awaiter(this, void 0, void 0, function* () {
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
            emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4420.0 Safari/537.36 Chrome-Lighthouse',
        };
        return lighthouse_1.default(urls, options);
    });
}
exports.launchLighthouse = launchLighthouse;
/* istanbul ignore next */
function uploadArtifact() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultsPath = `${process.cwd()}/files`;
            const artifactClient = artifact.create();
            const fileNames = fs_1.default.readdirSync(resultsPath);
            const files = fileNames.map((fileName) => `${resultsPath}/${fileName}`);
            return artifactClient.uploadArtifact('Lighthouse-results', files, resultsPath, { continueOnError: true });
        }
        catch (error) {
            throw new ErrorEvent(error.message);
        }
    });
}
exports.uploadArtifact = uploadArtifact;
function gatherResults(categories) {
    return Object.keys(categories).map((key) => {
        const casted = key;
        const { title } = categories[casted];
        const score = categories[casted].score * 100;
        return {
            title,
            score,
        };
    });
}
exports.gatherResults = gatherResults;
function getInputs() {
    const urlsInput = core.getInput('urls') || 'http://localhost:3000/fr';
    const performanceThreshold = Number(core.getInput('performanceThreshold'));
    const accessibilityThreshold = Number(core.getInput('accessibilityThreshold'));
    const bestPracticesThreshold = Number(core.getInput('bestPracticesThreshold'));
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
exports.getInputs = getInputs;
function buildErrors(results, thesholds) {
    const errors = [];
    results.forEach(({ title, score }) => {
        const castedTitle = title;
        const value = thesholds[castedTitle];
        if (value) {
            if (score < value)
                errors.push({ title, score });
            else
                core.info(`You successfully met the threshold values you provided for the category ${title} with a score of ${score}`);
        }
    });
    return errors;
}
exports.buildErrors = buildErrors;
function saveReport(report) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.mkdir('files');
            fs_1.default.writeFileSync('files/lhreport.html', report);
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.saveReport = saveReport;
function deleteReport() {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.default.unlinkSync('files/lhreport.html');
        yield fs_1.default.promises.rmdir('files');
    });
}
exports.deleteReport = deleteReport;
function buildCommentText(results, hasErrors) {
    let text = '';
    if (hasErrors) {
        text += 'The lighthouse-ci action failed. ';
    }
    else {
        text += 'The lighthouse-ci action succeeded. ';
    }
    text += 'Here are your Lighthouse scores :';
    results.forEach((result, index) => {
        if (index === 0) {
            text += `\n\t- ${result.title}: ${result.score}\n`;
        }
        else {
            text += `\t- ${result.title}: ${result.score}\n`;
        }
    });
    return text;
}
exports.buildCommentText = buildCommentText;
/**
 * @returns a boolean saying if an error happaned or not
 */
function sendPrComment(token, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const { payload: { pull_request: pullRequest, repository }, } = github.context;
        if (repository) {
            const { full_name: repoFullName } = repository;
            if (repoFullName) {
                const [owner, repo] = repoFullName.split('/');
                if (pullRequest) {
                    const prNumber = pullRequest.number;
                    const octokit = github.getOctokit(token);
                    yield octokit.rest.issues.createComment({
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
    });
}
exports.sendPrComment = sendPrComment;
