import React from 'react';

interface HeaderProps {
    currentLocation: string;
    locations: string[];
    setCurrentLocation: (location: string) => void;
    onClickExport: () => void
}

export const Header: React.FC<HeaderProps> = ({
    currentLocation,
    locations,
    setCurrentLocation,
    onClickExport,
                                              }) => {
    return (
        <div className='header'>
            <div className='text'>
                <h1>Weekly place analytics</h1>
                <p>
                    Discover practical information on your facility usage patterns, user
                    behavior, and security trends.
                </p>
            </div>
            <div className='actions'>
                <label htmlFor='location'>Location:</label>
                <select
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    name='locations'
                    id='location'
                >
                    {locations.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <button onClick={onClickExport}>Export</button>
            </div>
        </div>
    );
};
