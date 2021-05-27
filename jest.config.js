module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: [
        '**/__unit_tests__/**/*.test.ts',
        '**/__integration_tests__/**/*.test.ts',
    ],
    testPathIgnorePatterns: ['/lib/', '/node_modules/', 'mocks'],
    moduleFileExtensions: ['js', 'ts', 'json'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    coveragePathIgnorePatterns: [
        '__tests__',
        '__unit_tests__',
        '__integration_tests__',
        '.mock',
        '.snap',
        '.json',
        '.test.ts',
    ],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^package.json$': '<rootDir>/package.json',
    },
};
