import { formatDate, processDates, calculateColor, formatTime, extractStylesAndGenerateHTML } from './heatmapUtils';

describe('formatDate function', () => {
    it('should format a date correctly', () => {
        const inputDate = new Date('2025-04-03T14:00:00Z');
        const result = formatDate(inputDate);
        expect(result).toBe('2025-04-03');
    });

    it('should handle edge cases (start of year)', () => {
        const inputDate = new Date('2025-01-01T00:00:00Z');
        const result = formatDate(inputDate);
        expect(result).toBe('2025-01-01');
    });
});

describe('processDates function', () => {
    it('should return the last 7 dates if input array length >= 7', () => {
        const inputDates = [
            '2025-04-01',
            '2025-04-02',
            '2025-04-03',
            '2025-04-04',
            '2025-04-05',
            '2025-04-06',
            '2025-04-07',
            '2025-04-08'
        ];
        const result = processDates(inputDates);
        expect(result).toEqual([
            '2025-04-02',
            '2025-04-03',
            '2025-04-04',
            '2025-04-05',
            '2025-04-06',
            '2025-04-07',
            '2025-04-08'
        ]);
    });

    it('should fill missing days for prev month and return sorted array', () => {
        const inputDates = ['2025-04-01', '2025-04-02'];
        const result = processDates(inputDates);
        expect(result).toEqual([
            '2025-03-27',
            '2025-03-28',
            '2025-03-29',
            '2025-03-30',
            '2025-03-31',
            '2025-04-01',
            '2025-04-02',
        ]);
    });


    it('should fill missing days and return sorted array', () => {
        const inputDates = ['2025-04-10', '2025-04-11'];
        const result = processDates(inputDates);
        expect(result).toEqual([
            '2025-04-05',
            '2025-04-06',
            '2025-04-07',
            '2025-04-08',
            '2025-04-09',
            '2025-04-10',
            '2025-04-11',
        ]);
    });

});

describe('calculateColor function', () => {
    it('should interpolate between start and end colors based on number', () => {
        const result = calculateColor(5);
        expect(result).toBe('rgb(75, 82, 255, 0.5)');
    });

    it('should return start color for values <= 10', () => {
        const result = calculateColor(10);
        expect(result).toBe('rgb(75, 82, 255, 1)');
    });

    it('should interpolate towards end color for values > 10', () => {
        const result = calculateColor(20);
        expect(result).not.toBe('rgb(75, 82, 255, 1)');
    });

    it('should cap alpha at 1 for large numbers', () => {
        const result = calculateColor(50);
        expect(result).toContain(', 1)');
    });
});

describe('formatTime function', () => {
    it('should format times correctly', () => {
        expect(formatTime(0)).toBe('12AM');
        expect(formatTime(12)).toBe('12PM');
        expect(formatTime(6)).toBe('6AM');
        expect(formatTime(18)).toBe('6PM');
    });

    it('should return an empty string for odd hours', () => {
        expect(formatTime(1)).toBe("");
        expect(formatTime(3)).toBe("");
    });
});

describe('extractStylesAndGenerateHTML', () => {
    beforeEach(() => {
        // Mock the document.styleSheets for testing
        Object.defineProperty(document, 'styleSheets', {
            value: [
                {
                    cssRules: [
                        { cssText: 'body { font-family: Arial; }' },
                        { cssText: 'h1 { color: blue; }' },
                    ],
                },
            ],
            writable: true,
        });
    });

    it('should generate HTML with extracted CSS and provided graphHTML', () => {
        const graphHTML = '<div class="graph">Graph Content</div>';
        const currentLocation = 'Test Location';
        const startDate = 'Jan 1, 2023';
        const endDate = 'Jan 7, 2023';

        const result = extractStylesAndGenerateHTML(graphHTML, currentLocation, startDate, endDate);

        expect(result).toContain('<style>body { font-family: Arial; }h1 { color: blue; }</style>');
        expect(result).toContain('<h1>Test Location</h1>');
        expect(result).toContain('<p>Weekly place analytics<br>Jan 1, 2023 - Jan 7, 2023</p>');
        expect(result).toContain('<div class="graph">Graph Content</div>');
    });

    it('should handle cases where no styles are accessible', () => {
        Object.defineProperty(document, 'styleSheets', {
            value: [],
            writable: true,
        });

        const graphHTML = '<div class="graph">Graph Content</div>';
        const currentLocation = 'Test Location';
        const startDate = 'Jan 1, 2023';
        const endDate = 'Jan 7, 2023';

        const result = extractStylesAndGenerateHTML(graphHTML, currentLocation, startDate, endDate);

        expect(result).toContain('<style></style>');
        expect(result).toContain('<h1>Test Location</h1>');
        expect(result).toContain('<p>Weekly place analytics<br>Jan 1, 2023 - Jan 7, 2023</p>');
        expect(result).toContain('<div class="graph">Graph Content</div>');
    });

    it('should gracefully handle errors when accessing CSS rules', () => {
        Object.defineProperty(document, 'styleSheets', {
            value: [
                {
                    cssRules: null, // Simulate inaccessible rules
                },
            ],
            writable: true,
        });

        const graphHTML = '<div class="graph">Graph Content</div>';
        const currentLocation = 'Test Location';
        const startDate = 'Jan 1, 2023';
        const endDate = 'Jan 7, 2023';

        const result = extractStylesAndGenerateHTML(graphHTML, currentLocation, startDate, endDate);

        expect(result).toContain('<style></style>'); // No styles should be extracted
        expect(result).toContain('<h1>Test Location</h1>');
        expect(result).toContain('<p>Weekly place analytics<br>Jan 1, 2023 - Jan 7, 2023</p>');
        expect(result).toContain('<div class="graph">Graph Content</div>');
    });

    it('should correctly format the HTML with the provided parameters', () => {
        const graphHTML = '<div class="graph">Graph Content</div>';
        const currentLocation = 'Another Location';
        const startDate = 'Feb 15, 2023';
        const endDate = 'Feb 21, 2023';

        const result = extractStylesAndGenerateHTML(graphHTML, currentLocation, startDate, endDate);

        expect(result).toContain('<h1>Another Location</h1>');
        expect(result).toContain('<p>Weekly place analytics<br>Feb 15, 2023 - Feb 21, 2023</p>');
        expect(result).toContain('<div class="graph">Graph Content</div>');
    });
});
