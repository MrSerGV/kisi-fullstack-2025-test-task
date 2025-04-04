export const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

export const processDates = (dates: string[]): string[] => {
    const result: string[] = [...dates];
    const datesLength = dates.length;
    if (datesLength >= 7) return dates.slice(-7);

    const daysToAdd = 7 - datesLength;
    const lastDate = new Date(result[result.length - 1]);

    for (let i = 0; i <= daysToAdd; i++) {
        lastDate.setDate(lastDate.getDate() - 1);
        const formattedDate = formatDate(lastDate);

        if (!result.includes(formattedDate) && result.length < 7) {
            result.push(formattedDate);
        }
    }

    return result.sort();
};

export const calculateColor = (number: number): string => {
    const startColor = { r: 75, g: 82, b: 255 };
    const endColor = { r: 34, g: 38, b: 71 };
    const alpha = Math.min(number / 10, 1);

    if (number <= 10) {
        return `rgb(${startColor.r}, ${startColor.g}, ${startColor.b}, ${alpha})`;
    }

    const step = Math.floor((number - 1) / 10);
    const interpolationFactor = step * 10;

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * interpolationFactor);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * interpolationFactor);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * interpolationFactor);

    return `rgb(${r}, ${g}, ${b}, ${alpha})`;
};

export const formatTime = (hour: number): string => {
    return hour % 2 ? "" : `${hour % 12 || 12}${hour < 12 ? "AM" : "PM"}`;
};

export const extractStylesAndGenerateHTML = (graphHTML: string, currentLocation: string, startDate: string, endDate: string): string  => {
    let styles = '';
    for (const styleSheet of Array.from(document.styleSheets)) {
        try {
            if (styleSheet.cssRules) {
                for (const rule of Array.from(styleSheet.cssRules)) {
                    styles += rule.cssText;
                }
            }
        } catch (error) {
            console.warn('Unable to access some CSS rules:', error);
        }
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${styles}</style>
        <div style='padding: 20px'>
            <h1>${currentLocation}</h1>
            <p>Weekly place analytics<br>${startDate} - ${endDate}</p>
        </div>
      </head>
      <body style='padding: 20px'>${graphHTML}</body>
      </html>
    `;
}

