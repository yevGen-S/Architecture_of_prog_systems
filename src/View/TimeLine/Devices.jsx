import React from 'react';
import Store from '../../Store/Store';
import { v4 as uuid } from 'uuid';
import { Line, Rect, Text } from 'react-konva';
import { observer } from 'mobx-react-lite';

export const Devices = observer(
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

            {/* {console.log(sysRef.current)} */}
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
                                y={
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
                                        sysRef.current.producers.length *
                                            offsetY +
                                        index * offsetY,
                                    stageRef.current?.width() +
                                        unitConversion(Store?.currentTime),
                                    offsetY +
                                        sysRef.current.producers.length *
                                            offsetY +
                                        index * offsetY,
                                ]}
                            />
                        </>
                    );
                })}

                {/* DEVICE WORK TIME */}
                {Store?.loggedDevices?.map((device) => {
                    const coords = getCoordinatesForDash(
                        device.event.eventProducer.id,
                        device.timeStart,
                        'device'
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
                            height={15}
                        />
                    );
                })}

                {/* DASH DEVICE WORK TIME TEXT */}
                {Store?.loggedDevices?.map((device) => {
                    const coords = getCoordinatesForDash(
                        device.event.eventProducer.id,
                        device.timeStart,
                        'device'
                    );
                    return (
                        <Text
                            key={uuid()}
                            fontSize={13}
                            text={`${device.event.id.sourceId}.${device.event.id.orderId}`}
                            wrap='char'
                            align='center'
                            x={
                                coords[0] +
                                unitConversion(
                                    device.timeEnd - device.timeStart
                                ) /
                                    2
                            }
                            y={coords[1] + 2}
                        />
                    );
                })}
            </>
        );
    }
);
