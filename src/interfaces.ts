export interface LighthouseCategories {
    Performance: {
        title: string;
        score: number;
        description: string;
    };
    Accessibility: {
        title: string;
        score: number;
        description: string;
    };
    'Best Practices': {
        title: string;
        score: number;
        description: string;
    };
    SEO: {
        title: string;
        score: number;
        description: string;
    };
    'Progressive Web App': {
        title: string;
        score: number;
        description: string;
    };
}

export interface Thresholds {
    Performance: number | undefined;
    Accessibility: number | undefined;
    SEO: number | undefined;
    'Best Practices': number | undefined;
    'Progressive Web App': number | undefined;
}

export interface Result {
    title: string;
    score: number;
}

export interface Error {
    title: string;
    score: number;
}

export interface Inputs {
    urlsInput: string;
    token: string;
    performanceThreshold: number | undefined;
    accessibilityThreshold: number | undefined;
    bestPracticesThreshold: number | undefined;
    PWAThreshold: number | undefined;
    SEOThreshold: number | undefined;
}
