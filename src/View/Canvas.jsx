import React from 'react';
import { v4 as uuid } from 'uuid';
import Store from '../Store/Store';
import { observer } from 'mobx-react';
import { Layer, Line, Rect, Stage, Text } from 'react-konva';

export const Canvas = observer(({ state, stageRef }) => {
    const unitConversion = (unit) => {
        const conversed = +(unit * 25);
        if (conversed.isNan || conversed === undefined || conversed === null) {
            return 0;
        }
        return conversed;
    };

    const getCoordinatesForDash = (sourceId, time) => {
        return [
            30 + unitConversion(time),
            20 + (sourceId - 1) * 42,
            30 + unitConversion(time),
            30 + (sourceId - 1) * 42,
        ];
    };

    return (
        <Stage ref={stageRef} width={window.innerWidth} height={500} draggable>
            <Layer>
                {/* Current time line  */}
                <Line
                    key={uuid()}
                    strokeWidth={0.5}
                    stroke='black'
                    opacity={0.8}
                    points={[
                        30 + unitConversion(Store?.currentTime),
                        0,
                        30 + unitConversion(Store?.currentTime),
                        stageRef.current?.height(),
                    ]}
                />

                {/* PRODUCERS */}
                {Store?.producers?.map((producer, index) => {
                    const text = `И${index + 1}`;
                    return (
                        <>
                            <Text
                                key={uuid()}
                                fontSize={14}
                                text={text}
                                wrap='char'
                                align='center'
                                x={5}
                                y={10 + index * 42}
                            />
                            <Line
                                key={uuid()}
                                strokeWidth={1}
                                opacity={0.4}
                                stroke='blue'
                                points={[
                                    30,
                                    30 + index * 42,
                                    stageRef.current?.width() +
                                        unitConversion(Store?.currentTime),
                                    30 + index * 42,
                                ]}
                            />
                        </>
                    );
                })}

                {/* DASHES */}
                {Store?.loggedProducers?.map((producer) => {
                    return (
                        <Line
                            key={uuid()}
                            strokeWidth={4}
                            stroke='black'
                            opacity={1}
                            points={getCoordinatesForDash(
                                producer.id.sourceId,
                                producer.event.time
                            )}
                        />
                    );
                })}

                {/* DASH TEXT */}
                {Store?.loggedProducers?.map((producer) => {
                    const coords = getCoordinatesForDash(
                        producer.id.sourceId,
                        producer.event.time
                    );
                    return (
                        <Text
                            key={uuid()}
                            fontSize={13}
                            text={`${producer.id.sourceId}.${producer.id.orderId}`}
                            wrap='char'
                            align='center'
                            x={coords[0] - 10}
                            y={coords[1] - 13}
                        />
                    );
                })}

                {/* DEVICES */}
                {Store?.devices?.map((device, index) => {
                    const text = `П${index + 1}`;
                    return (
                        <>
                            <Text
                                key={uuid()}
                                fontSize={14}
                                text={text}
                                wrap='char'
                                align='center'
                                x={5}
                                y={state.numberOfProducers * 50 + index * 42}
                            />

                            <Line
                                key={uuid()}
                                strokeWidth={1}
                                opacity={0.4}
                                stroke='blue'
                                points={[
                                    30,
                                    15 +
                                        state.numberOfProducers * 50 +
                                        index * 42,
                                    stageRef.current?.width() +
                                        unitConversion(Store?.currentTime),
                                    15 +
                                        state.numberOfProducers * 50 +
                                        index * 42,
                                ]}
                            />
                        </>
                    );
                })}

                {/* DEVICE WORK TIME */}
                {Store?.loggedDevices?.map((device) => {
                    const coords = getCoordinatesForDash(
                        device.event.id.sourceId,
                        device.timeStart
                    );
                    return (
                        <Rect
                            stroke='black'
                            strokeWidth={1}
                            x={coords[0]}
                            y={coords[1]}
                            width={unitConversion(
                                device.timeEnd - device.timeStart
                            )}
                            height={10}
                        />
                    );
                })}

                {/* BUFFER */}
                {Store?.buffer?.map((buffCel, index) => {
                    const text = `Б${index + 1}`;
                    return (
                        <>
                            <Text
                                key={uuid()}
                                fontSize={14}
                                text={text}
                                wrap='char'
                                align='center'
                                x={5}
                                y={
                                    state.numberOfDevices * 45 +
                                    state.numberOfProducers * 45 +
                                    index * 42
                                }
                            />

                            <Line
                                key={uuid()}
                                strokeWidth={1}
                                opacity={0.4}
                                stroke='blue'
                                points={[
                                    30,
                                    15 +
                                        state.numberOfDevices * 45 +
                                        state.numberOfProducers * 45 +
                                        index * 42,
                                    stageRef.current?.width() +
                                        unitConversion(Store?.currentTime),
                                    15 +
                                        state.numberOfDevices * 45 +
                                        state.numberOfProducers * 45 +
                                        index * 42,
                                ]}
                            />
                        </>
                    );
                })}

                {/* REFUSES */}
                <>
                    <Text
                        key={uuid()}
                        fontSize={14}
                        text='OTK'
                        wrap='char'
                        align='center'
                        x={5}
                        y={
                            state.numberOfDevices * 45 +
                            state.numberOfProducers * 45 +
                            125
                        }
                    />

                    <Line
                        key={uuid()}
                        strokeWidth={1}
                        opacity={0.4}
                        stroke='blue'
                        points={[
                            30,
                            20 +
                                state.numberOfDevices * 45 +
                                state.numberOfProducers * 45 +
                                125,
                            stageRef.current?.width() +
                                unitConversion(Store?.currentTime),
                            20 +
                                state.numberOfDevices * 45 +
                                state.numberOfProducers * 45 +
                                125,
                        ]}
                    />
                </>
            </Layer>
        </Stage>
    );
});
