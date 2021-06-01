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

export interface Result {
    title: string;
    score: number;
}

export interface Error {
    title: string;
    score: number;
}
