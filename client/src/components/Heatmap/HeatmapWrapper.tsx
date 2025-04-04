import React, { useEffect, useState, useMemo } from 'react';

import Heatmap from './Heatmap';
import { Event, GroupedType } from '../../types/heatmapTypes';
import {  formatDate } from '../../utils/heatmapUtils';

import { fetchReportData } from '../../api/reports';

const DEFAULT_LOCATION = 'Kisi Stockholm Office';

const HeatmapWrapper: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentLocation, setCurrentLocation] = useState<string>(DEFAULT_LOCATION);
    const [locations, setLocations] = useState<Array<string>>([]);
    let isFetching = false;
    const fetchData = async () => {
        if (isFetching) return;
        isFetching = true;

        try {
            setLoading(true);
            const response = await fetchReportData();
            const json: Event[] = await response.json();
            setEvents(json as Event[]);
        } catch (error) {
            setError('Failed to fetch data. Please try again later.');
        } finally {
            isFetching = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {

            await fetchData();
        };
        loadData();
    }, []);

    const groupDataByHourAndObject = useMemo(() => {
        const grouped: GroupedType = {};

        const initializeGroup = (
            objectName: string,
            date: string,
            hour: number,
            user: number
        ) => {
            if (!grouped[objectName]) grouped[objectName] = {};
            if (!grouped[objectName][date]) grouped[objectName][date] = {};
            if (!grouped[objectName][date][hour]) {
                grouped[objectName][date][hour] = { counter: 0, uniqueUsers: [] };
            }
            if (!grouped[objectName][date][hour].uniqueUsers.includes(user)) {
                grouped[objectName][date][hour].counter += 1;
                grouped[objectName][date][hour].uniqueUsers.push(user);
            }
        };

        events.forEach((entry) => {
            if (entry.success && typeof entry.actor_id === 'number') {
                const created_at = new Date(entry.created_at);
                const date = formatDate(created_at);
                const hour = created_at.getHours();
                initializeGroup(entry.object_name, date, hour, entry.actor_id);
                initializeGroup(DEFAULT_LOCATION, date, hour, entry.actor_id);
            }
        });

        setLocations(Object.keys(grouped));
        return grouped;
    }, [events]);

    if (loading) return <div>Loading...</div>;

    if (error) return <div className='error'>{error}</div>;

    return (
        <Heatmap
            groupDataByHourAndObject={groupDataByHourAndObject}
            currentLocation={currentLocation}
            locations={locations}
            setCurrentLocation={setCurrentLocation}
            events={events}
        />
    );
};

export default HeatmapWrapper;
