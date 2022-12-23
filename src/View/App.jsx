import React, { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import Store from '../Store/Store';
import { observer } from 'mobx-react';
import { Layer, Line, Stage } from 'react-konva';
import { InputFrom } from './InputForm/Input';

import { Producers } from './TimeLine/Producers';
import { Devices } from './TimeLine/Devices';
import { Buffers } from './TimeLine/Buffers';
import { Refuses } from './TimeLine/Refuses';
import { EventCalendarSummary } from './EventCalendarSummary';
import { Mode } from '../Logic/Mode';
import { AutoModeTable } from './AutoModeTable';

const offsetX = 30;
const offsetY = 50;

export const App = observer(() => {
    const sysRef = useRef();

    const stageRef = useRef(null);

    const handleOnClick = () => {
        sysRef.current.handleNextEvent();
        Store.update(sysRef.current);
    };

    const unitConversion = (unit) => {
        const conversed = +(unit * 25);
        if (isNaN(conversed) || conversed === undefined || conversed === null) {
            return 0;
        }
        return conversed;
    };

    const getCoordinatesForDash = (sourceId, time, type) => {
        if (type === 'device') {
            return [
                offsetX + unitConversion(time), //x1

                offsetY -
                    15 +
                    sysRef.current.producers.length * offsetY +
                    (sourceId - 1) * offsetY, //y1

                offsetX + unitConversion(time), //x2

                offsetY +
                    sysRef.current.producers.length * offsetY +
                    (sourceId - 1) * offsetY,
                stageRef.current?.width() + unitConversion(Store?.currentTime), //y2
            ];
        }

        if (type === 'buffer') {
            // console.log(sysRef.current.producers);

            return [
                offsetX + unitConversion(time), //x1

                offsetY -
                    15 +
                    sysRef.current.devices.length * offsetY +
                    sysRef.current.producers.length * offsetY +
                    (sourceId - 1) * offsetY, //y1

                offsetX + unitConversion(time), //x2

                offsetY +
                    sysRef.current.devices.length * offsetY +
                    sysRef.current.producers.length * offsetY +
                    (sourceId - 1) * offsetY, //y2
            ];
        }

        if (type === 'refuse') {
            return [
                offsetX + unitConversion(time), //x1

                offsetY -
                    15 +
                    sysRef.current.devices.length * offsetY +
                    sysRef.current.producers.length * offsetY +
                    sysRef.current.buffer.length * offsetY,

                offsetX + unitConversion(time), //x2

                offsetY +
                    sysRef.current.devices.length * offsetY +
                    sysRef.current.producers.length * offsetY +
                    sysRef.current.buffer.length * offsetY,
            ];
        }

        if (type === 'producer') {
            return [
                offsetX + unitConversion(time),
                offsetY - 15 + (sourceId - 1) * offsetY,
                offsetX + unitConversion(time),
                offsetY + (sourceId - 1) * offsetY,
            ];
        }
    };

    const handleChangeMode = () => {
        Store.changeMode();
    };

    return (
        <>
            <button style={{ height: '30px' }} onClick={handleChangeMode}>
                {Store.mode}
            </button>
            <InputFrom sysRef={sysRef} />

            <h2> Time diagram. </h2>
            <h4> Current time: {Store?.currentTime} </h4>

            <div>
                <h1> Step mode </h1>
                <h3>
                    Number of produced requests:{' '}
                    {Store.numberOfProduceedRequests}
                </h3>

                <h3>
                    Number of handled requests: {Store.numberOfHandledRequests}
                </h3>
            </div>

            <button
                style={{ width: '100px', height: '30px', borderRadius: '10px' }}
                onClick={handleOnClick}
                disabled={Store.mode === Mode.AUTOMATIC}
            >
                NEXT EVENT
            </button>

            {Store.mode === Mode.STEP_BY_STEP ? (
                <>
                    {sysRef.current && (
                        <>
                            <Stage
                                ref={stageRef}
                                width={window.innerWidth}
                                height={700}
                                draggable
                            >
                                <Layer>
                                    {/* Current time line  */}
                                    <Line
                                        key={uuid()}
                                        strokeWidth={0.5}
                                        stroke='black'
                                        opacity={0.8}
                                        points={[
                                            offsetX +
                                                unitConversion(
                                                    Store?.currentTime
                                                ),
                                            0,
                                            offsetX +
                                                unitConversion(
                                                    Store?.currentTime
                                                ),
                                            stageRef.current?.height(),
                                        ]}
                                    />

                                    <Producers
                                        stageRef={stageRef}
                                        unitConversion={unitConversion}
                                        getCoordinatesForDash={
                                            getCoordinatesForDash
                                        }
                                        offsetX={offsetX}
                                        offsetY={offsetY}
                                    />

                                    <Devices
                                        sysRef={sysRef}
                                        stageRef={stageRef}
                                        unitConversion={unitConversion}
                                        getCoordinatesForDash={
                                            getCoordinatesForDash
                                        }
                                        offsetX={offsetX}
                                        offsetY={offsetY}
                                    />

                                    <Buffers
                                        sysRef={sysRef}
                                        stageRef={stageRef}
                                        unitConversion={unitConversion}
                                        getCoordinatesForDash={
                                            getCoordinatesForDash
                                        }
                                        offsetX={offsetX}
                                        offsetY={offsetY}
                                    />

                                    <Refuses
                                        sysRef={sysRef}
                                        stageRef={stageRef}
                                        unitConversion={unitConversion}
                                        getCoordinatesForDash={
                                            getCoordinatesForDash
                                        }
                                        offsetX={offsetX}
                                        offsetY={offsetY}
                                    />
                                </Layer>
                            </Stage>

                            <EventCalendarSummary
                                handleOnClick={handleOnClick}
                            />

                            {Store.increment}
                        </>
                    )}
                </>
            ) : (
                <AutoModeTable sysRef={sysRef} />
            )}
        </>
    );
});
