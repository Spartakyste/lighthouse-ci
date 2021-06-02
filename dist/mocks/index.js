"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeErrors = exports.fakeInputs = exports.fakeResults50 = exports.fakeResults100 = exports.fakeTresholds50 = exports.fakeTresholds100 = exports.lighthouseResults50 = exports.lighthouseResults100 = void 0;
exports.lighthouseResults100 = {
    Performance: {
        title: 'Performance category',
        score: 1,
        description: 'The performance description',
    },
    Accessibility: {
        title: 'Accessibility category',
        score: 1,
        description: 'The accessibility description',
    },
    'Best Practices': {
        title: 'Best Practices category',
        score: 1,
        description: 'The best practices description',
    },
    SEO: {
        title: 'SEO category',
        score: 1,
        description: 'The SEO description',
    },
    'Progressive Web App': {
        title: 'Progressive Web App category',
        score: 1,
        description: 'The progressive web app description',
    },
};
exports.lighthouseResults50 = {
    Performance: {
        title: 'Performance category',
        score: 0.5,
        description: 'The performance description',
    },
    Accessibility: {
        title: 'Accessibility category',
        score: 0.5,
        description: 'The accessibility description',
    },
    'Best Practices': {
        title: 'Best Practices category',
        score: 0.5,
        description: 'The best practices description',
    },
    SEO: {
        title: 'SEO category',
        score: 0.5,
        description: 'The SEO description',
    },
    'Progressive Web App': {
        title: 'Progressive Web App category',
        score: 0.5,
        description: 'The progressive web app description',
    },
};
exports.fakeTresholds100 = {
    Performance: 100,
    Accessibility: 100,
    SEO: 100,
    'Best Practices': 100,
    'Progressive Web App': 100,
};
exports.fakeTresholds50 = {
    Performance: 50,
    Accessibility: 50,
    SEO: 50,
    'Best Practices': 50,
    'Progressive Web App': 50,
};
exports.fakeResults100 = [
    {
        title: 'Performance',
        score: 100,
    },
    {
        title: 'Accessibility',
        score: 100,
    },
    {
        title: 'SEO',
        score: 100,
    },
    {
        title: 'Best Practices',
        score: 100,
    },
    {
        title: 'Progressive Web App',
        score: 100,
    },
];
exports.fakeResults50 = [
    {
        title: 'Performance',
        score: 50,
    },
    {
        title: 'Accessibility',
        score: 50,
    },
    {
        title: 'SEO',
        score: 50,
    },
    {
        title: 'Best Practices',
        score: 50,
    },
    {
        title: 'Progressive Web App',
        score: 50,
    },
];
exports.fakeInputs = {
    urlsInput: 'http://whatever.com',
    performanceThreshold: 100,
    accessibilityThreshold: 100,
    bestPracticesThreshold: 100,
    PWAThreshold: 100,
    SEOThreshold: 100,
    token: 'Abc',
};
exports.fakeErrors = [
    {
        score: 50,
        title: 'Performance',
    },
    {
        score: 50,
        title: 'Accessibility',
    },
    {
        score: 50,
        title: 'SEO',
    },
    {
        score: 50,
        title: 'Best Practices',
    },
    {
        score: 50,
        title: 'Progressive Web App',
    },
];
