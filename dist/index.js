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
const core_1 = __importDefault(require("@actions/core"));
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
        const urlsInput = core_1.default.getInput('urls');
        console.log(`urlsInput`, urlsInput);
        const urls = urlsInput.split(',');
        console.log('urls ->>', urls);
        const chrome = yield chrome_launcher_1.launch({
            chromeFlags: ['--headless'],
        });
        //* For all options, see https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js
        const options = {
            logLevel: 'quiet',
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
        const runnerResult = yield lighthouse_1.default(urls, options);
        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        fs_1.default.writeFileSync('lhreport.html', reportHtml);
        console.log('Report is done for', runnerResult.lhr.finalUrl);
        // console.log(`runnerResult.lhr.categories`, runnerResult.lhr.categories);
        const results = gatherResults(runnerResult.lhr.categories);
        console.log(`results`, results);
        yield chrome.kill();
    }))();
}
catch (error) {
    // core.setFailed(error.message);
}
