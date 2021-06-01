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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArtifact = exports.gatherResults = void 0;
const fs_1 = __importDefault(require("fs"));
const core = __importStar(require("@actions/core"));
const artifact = __importStar(require("@actions/artifact"));
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
function uploadArtifact() {
    try {
        const resultsPath = `${process.cwd()}/files`;
        const artifactClient = artifact.create();
        const fileNames = fs_1.default.readdirSync(resultsPath);
        const files = fileNames.map((fileName) => `${resultsPath}/${fileName}`);
        return artifactClient.uploadArtifact('Lighthouse-results', files, resultsPath, { continueOnError: true });
    }
    catch (error) {
        core.setFailed(error.message);
        return undefined;
    }
}
exports.uploadArtifact = uploadArtifact;
