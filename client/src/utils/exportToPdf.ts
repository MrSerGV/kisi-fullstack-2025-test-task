import type { RefObject } from 'react';

import { extractStylesAndGenerateHTML } from './heatmapUtils'
import { exportToPdfReport } from '../api/reports.ts';

export const onClickExport = async (
    graphWrapperRef: RefObject<HTMLDivElement | null>,
    currentLocation: string,
    startDate: string,
    endDate: string
) => {
    if (graphWrapperRef?.current) {
        const graphHTML = graphWrapperRef.current.outerHTML;
        const htmlContent = extractStylesAndGenerateHTML(graphHTML, currentLocation, startDate, endDate);

        try {
            const response = await exportToPdfReport(htmlContent);

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const pdfUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `Report-heatmap-${currentLocation}-for-${startDate}-${endDate}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    } else {
        console.error('graph-wrapper element is not available.');
    }
};
