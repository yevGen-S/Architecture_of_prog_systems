import React from 'react';
import Store from '../../Store/Store';
import { v4 as uuid } from 'uuid';
import { Line, Rect, Text } from 'react-konva';
import { observer } from 'mobx-react-lite';

export const Buffers = observer(
    ({
        sysRef,
        stageRef,
        unitConversion,
        getCoordinatesForDash,
        offsetX,
        offsetY,
    }) => {
        return (
            <>
                {/* {console.log("BUFFER",sysRef.current)} */}

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
                                    sysRef.current.devices.length * offsetY +
                                    sysRef.current.producers.length * offsetY +
                                    index * offsetY +
                                    offsetY -
                                    15
                                }
                            />

                            <Line
                                key={uuid()}
                                strokeWidth={1}
                                opacity={0.4}
                                stroke='blue'
                                points={[
                                    offsetX,
                                    offsetY +
                                        sysRef.current.devices.length *
                                            offsetY +
                                        sysRef.current.producers.length *
                                            offsetY +
                                        index * offsetY,
                                    stageRef.current?.width() +
                                        unitConversion(Store?.currentTime),
                                    offsetY +
                                        sysRef.current.devices.length *
                                            offsetY +
                                        sysRef.current.producers.length *
                                            offsetY +
                                        index * offsetY,
                                ]}
                            />
                        </>
                    );
                })}

                {/* BUFFER REQUEST TIME*/}
                {Store?.loggedBuffer?.map((buffCel, index) => {
                    const timeEnd = buffCel.timeEnd
                        ? buffCel.timeEnd
                        : Store?.currentTime;

                    // console.log('TIME END', timeEnd);

                    const coords = getCoordinatesForDash(
                        buffCel.id + 1,
                        buffCel.timeStart,
                        'buffer'
                    );
                    return (
                        <Rect
                            stroke='black'
                            strokeWidth={1}
                            x={coords[0]}
                            y={coords[1]}
                            width={unitConversion(timeEnd - buffCel.timeStart)}
                            height={15}
                        />
                    );
                })}

                {/* DASH BUFFER WORK TIME TEXT */}
                {Store?.loggedBuffer?.map((buffCel, index) => {
                    const timeEnd = buffCel.timeEnd
                        ? buffCel.timeEnd
                        : Store?.currentTime;

                    const coords = getCoordinatesForDash(
                        buffCel.id + 1,
                        buffCel.timeStart,
                        'buffer'
                    );
                    return (
                        <Text
                            key={uuid()}
                            fontSize={13}
                            text={`${buffCel.event.id.sourceId}.${buffCel.event.id.orderId}`}
                            wrap='char'
                            align='center'
                            x={
                                coords[0] +
                                unitConversion(timeEnd - buffCel.timeStart) / 2
                            }
                            y={coords[1] + 2}
                        />
                    );
                })}
            </>
        );
    }
);
