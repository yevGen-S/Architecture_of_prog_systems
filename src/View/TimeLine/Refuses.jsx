import React from 'react';
import { Line, Text } from 'react-konva';
import { v4 as uuid } from 'uuid';
import Store from '../../Store/Store';

export const Refuses = ({
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

            <Text
                key={uuid()}
                fontSize={14}
                text='OTK'
                wrap='char'
                align='center'
                x={5}
                y={
                    sysRef.current.devices.length * offsetY +
                    sysRef.current.producers.length * offsetY +
                    sysRef.current.buffer.length * offsetY +
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
                        sysRef.current.devices.length * offsetY +
                        sysRef.current.producers.length * offsetY +
                        sysRef.current.buffer.length * offsetY,
                    stageRef.current?.width() +
                        unitConversion(Store?.currentTime),
                    offsetY +
                        sysRef.current.devices.length * offsetY +
                        sysRef.current.producers.length * offsetY +
                        sysRef.current.buffer.length * offsetY,
                ]}
            />

            {/* DASHES */}
            {Store?.loggedRefuses?.map((refuse) => {
                // console.log('ОТКАЗ', refuse);

                return (
                    <Line
                        key={uuid()}
                        strokeWidth={5}
                        stroke='black'
                        opacity={1}
                        points={getCoordinatesForDash(
                            refuse.id.sourceId,
                            refuse.time,
                            'refuse'
                        )}
                    />
                );
            })}

            {/* DASH TEXT */}
            {Store?.loggedRefuses?.map((refuse) => {
                // console.log('ОТКАЗ', refuse);

                const coords = getCoordinatesForDash(
                    refuse.id.sourceId,
                    refuse.time,
                    'refuse'
                );
                return (
                    <Text
                        key={uuid()}
                        fontSize={13}
                        text={`${refuse.id.sourceId}.${refuse.id.orderId}`}
                        wrap='char'
                        align='center'
                        x={coords[0] - 10}
                        y={coords[1] - 15}
                    />
                );
            })}
        </>
    );
};
