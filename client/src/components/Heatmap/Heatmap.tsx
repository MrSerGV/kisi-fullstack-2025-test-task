import React, { useRef } from 'react';

import { Header } from './Header';
import GraphWrapper from './GraphWrapper';
import { onClickExport } from '../../utils/exportToPdf';
import { processDates } from '../../utils/heatmapUtils';
import { GroupedType, Event } from '../../types/heatmapTypes';

import './Heatmap.css';


interface HeatmapRendererProps {
    groupDataByHourAndObject: GroupedType;
    currentLocation: string;
    locations: string[];
    setCurrentLocation: (location: string) => void;
    events: Event[];
}

const HeatmapRenderer: React.FC<HeatmapRendererProps> = ({
    groupDataByHourAndObject,
    currentLocation,
    locations,
    setCurrentLocation,
    events,
                                                         }) => {
    const graphWrapperRef = useRef<HTMLDivElement>(null);

    const location = groupDataByHourAndObject[currentLocation];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dates = processDates(Object.keys(location));
    const options: Intl.DateTimeFormatOptions = { year: 'numeric',  month: 'short', day: '2-digit' };
    const startDate = new Date(dates[0]).toLocaleDateString('en-US', options);
    const endDate = new Date(dates[dates.length - 1]).toLocaleDateString('en-US', options);
    const rawDateFormat = events[0]?.created_at || new Date().toISOString();
    const timezoneName = `${
        Intl.DateTimeFormat('en-US', { timeZoneName: 'long' })
            .format(new Date(rawDateFormat))
            .split(',')[1]
    } (GMT${rawDateFormat.slice(-6)})`;

    return (
        <div className='heatmap-container'>
            <Header
                currentLocation={currentLocation}
                locations={locations}
                setCurrentLocation={setCurrentLocation}
                onClickExport={() => onClickExport(graphWrapperRef, currentLocation, startDate, endDate)}
            />
            <GraphWrapper
                ref={graphWrapperRef}
                location={location}
                hours={hours}
                dates={dates}
                currentLocation={currentLocation}
                timezoneName={timezoneName}
                startDate={startDate}
                endDate={endDate}
            />
        </div>
    );
};

export default HeatmapRenderer;
