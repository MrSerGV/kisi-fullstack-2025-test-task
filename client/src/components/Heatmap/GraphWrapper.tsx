import { forwardRef } from 'react';

import { calculateColor, formatTime } from '../../utils/heatmapUtils';
import { SuccessEventWithUsers } from '../../types/heatmapTypes';

interface GraphWrapperProps {
    location: Record<string, Record<string, SuccessEventWithUsers>>;
    hours: number[];
    dates: string[];
    currentLocation: string;
    timezoneName: string;
    startDate: string;
    endDate: string;
}

const GraphWrapper = forwardRef<HTMLDivElement, GraphWrapperProps>(
    ({ location, hours, dates, currentLocation, timezoneName, startDate, endDate }, ref) => {
        return (
            <div
                className='graph-wrapper'
                style={{
                    padding: '50px',
                    border: 'solid 2px #e3e4e7',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    display: 'grid',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                }}
                ref={ref}>
                <div
                    className='legend'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <div
                        className='icon'
                        style={{
                            width: '15px',
                            height: '15px',
                            backgroundColor: '#555dfc',
                            marginRight: '5px',
                        }}
                    ></div>
                    <div className='labels'>{`Unique users unlock heatmap in ${currentLocation} for ${startDate} - ${endDate}`}</div>
                </div>
                <div
                    className='graph-container'
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '100px auto',
                        gap: '5px',
                        marginBottom: '10px',

                    }}
                >
                    <div
                        className='y-axis'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100px',
                            paddingTop: '10px',
                        }}
                    >
                        {dates.map((date) => (
                            <div key={date}
                                 className='y-label'
                                 style={{
                                     padding: '5px',
                                     fontSize: '14px',
                                 }}
                            >
                                {date}
                            </div>
                        ))}
                    </div>
                    <div
                        className='heatmap'
                        style={{
                            marginTop: '10px',
                            borderLeft: 'solid',
                            borderBottom: 'solid',
                            padding: '0 10px',
                            gridTemplateRows: 'repeat(7, 1fr)',
                        }}
                    >
                        {dates.map((date, index) => (
                            <div key={date}
                                 className='row'
                                 style={{
                                     display: 'grid',
                                     gridTemplateColumns: 'repeat(24, 1fr)',
                                     height: 'calc(100% / 7)',
                                     backgroundColor: index % 2 ? 'rgb(75, 82, 255, 0.1)' : 'none',
                                 }}
                            >
                                {hours.map((hour, index) => {
                                    const counter = location[date]?.[hour]?.counter || 0;
                                    return (
                                        <div
                                            key={hour}
                                            className='cell'
                                            style={{
                                                backgroundColor: counter
                                                    ? calculateColor(counter + 2)
                                                    : `rgb(75, 82, 255, ${index % 2 / 10})`,
                                                color: counter > 3 ? '#bfbfc2' : '#404046',
                                                padding: 0,
                                                textAlign: 'center',
                                                minWidth: '5px',
                                                minHeight: '5px'
                                            }}
                                        >
                                            {counter || ""}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    <div
                        className='x-axis'
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(24, 1fr)',
                            width: '100%',
                            padding: '5px 0',
                            gridColumn: '2',
                        }}
                    >
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className='x-label'
                                style={{
                                    padding: '5px',
                                    gridColumn: 'span 1',
                                    fontSize: '14px',
                                }}
                            >
                                {formatTime(hour)}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='timezone'>{`Timezone: ${timezoneName}`}</div>
            </div>
        );
    }
);

export default GraphWrapper
