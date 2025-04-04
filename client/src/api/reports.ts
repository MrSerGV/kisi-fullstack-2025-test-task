const ROUTE = import.meta.env.VITE_API_DOMAIN_ROUTE;

export const fetchReportData = async () => {
    return await fetch(`${ROUTE}/get-report-data`)

}

export const exportToPdfReport = async (htmlContent: string) => {
    return await fetch(`${ROUTE}/render-pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ htmlContent }),
    });
}