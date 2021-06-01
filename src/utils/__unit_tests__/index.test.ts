import { lighthouseResults100, lighthouseResults50 } from 'mocks';
import { gatherResults } from 'utils';

describe('Testing the gatheringResults', () => {
    test('Should return a well formatted object with 100 as scores', () => {
        const results = gatherResults(lighthouseResults100);

        expect(results).toMatchSnapshot();
    });

    test('Should return a well formatted object with 50 as scores', () => {
        const results = gatherResults(lighthouseResults50);

        expect(results).toMatchSnapshot();
    });
});
